const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const { uploadMediaToS3 } = require("../utilities/S3mediaUploader");

const Prisma = new PrismaClient();

const FIX_DOC_TOKEN_EXPIRY = "1h";
const MAX_FEE_RECEIPT_FILE_SIZE = 250 * 1024; // 250 KB, matches frontend limit

exports.fixDocLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(404).json({
                success: false,
                message: "Some Data not found",
            });
        }

        const user = await Prisma.user.findFirst({ where: { email } });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not Registered",
            });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        const student = await Prisma.instituteStudent.findFirst({ where: { userId: user.id } });
        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student Account Not Found",
            });
        }

        const existing = await Prisma.fixCorruptDoc.findUnique({ where: { userId: user.id } });
        if (existing?.isFixed) {
            return res.status(403).json({
                success: false,
                message: "Your document has already been updated. Please contact the hostel office if you need further changes.",
            });
        }

        const isAffected = student.instituteFeeReceipt && student.hostelFeeReceipt && student.instituteFeeReceipt === student.hostelFeeReceipt;
        if (!isAffected) {
            return res.status(403).json({
                success: false,
                message: "Currently, no discrepancy has been detected in your documents.",
            });
        }

        const token = jwt.sign({ id: user.id, purpose: "fix-docs" }, process.env.JWT_SECRET, { expiresIn: FIX_DOC_TOKEN_EXPIRY });

        await Prisma.fixCorruptDoc.upsert({
            where: { userId: user.id },
            update: { token, isFixed: false },
            create: { userId: user.id, token, isFixed: false },
        });

        return res.status(200).json({
            success: true,
            token,
            student: {
                name: student.name,
                rollNo: student.rollNo,
            },
            message: "Verified. Please upload your Institute Fee Receipt.",
        });
    } catch (e) {
        console.log(e);
        return res.status(400).json({
            success: false,
            message: "Login operation failed",
        });
    }
};

exports.fixDocUpload = async (req, res) => {
    try {
        const { id } = req.user;
        const { instituteFeeReceipt } = req.files || {};

        if (!instituteFeeReceipt) {
            return res.status(404).json({
                success: false,
                message: "Institute Fee Receipt file is missing",
            });
        }

        if (instituteFeeReceipt.mimetype !== "application/pdf") {
            return res.status(400).json({
                success: false,
                message: "Only PDF files are allowed",
            });
        }

        if (instituteFeeReceipt.size > MAX_FEE_RECEIPT_FILE_SIZE) {
            return res.status(400).json({
                success: false,
                message: "File too large. Maximum allowed size is 250 KB.",
            });
        }

        const student = await Prisma.instituteStudent.findFirst({ where: { userId: id } });
        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student Account Not Found",
            });
        }

        const fixRecord = await Prisma.fixCorruptDoc.findUnique({ where: { userId: id } });
        if (!fixRecord || fixRecord.isFixed) {
            return res.status(403).json({
                success: false,
                message: "This correction has already been completed.",
            });
        }

        const uploadedFile = await uploadMediaToS3(instituteFeeReceipt, process.env.FOLDER_NAME_INSTITUTE_FEE_RECEIPTS, student.rollNo);
        if (!uploadedFile?.success) {
            return res.status(403).json({
                success: false,
                message: "File Upload Failed",
            });
        }

        // Enforce single-use inside a transaction: mark fixed only if still not
        // fixed, so concurrent submissions cannot both go through.
        await Prisma.$transaction(async (tx) => {
            const current = await tx.fixCorruptDoc.findUnique({ where: { userId: id } });
            if (!current || current.isFixed) {
                throw new Error("ALREADY_FIXED");
            }
            await tx.instituteStudent.update({
                where: { id: student.id },
                data: { instituteFeeReceipt: uploadedFile.url },
            });
            await tx.fixCorruptDoc.update({
                where: { userId: id },
                data: { isFixed: true, token: null },
            });
        });

        return res.status(200).json({
            success: true,
            message: "Institute Fee Receipt updated successfully.",
        });
    } catch (e) {
        if (e?.message === "ALREADY_FIXED") {
            return res.status(403).json({
                success: false,
                message: "This correction has already been completed.",
            });
        }
        console.log(e);
        return res.status(400).json({
            success: false,
            message: "Unable to update Institute Fee Receipt",
        });
    }
};
