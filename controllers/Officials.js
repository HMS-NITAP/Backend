const {uploadMedia} = require('../utilities/MediaUploader')
const {AccountType} = require('../constant/AccountType')

const { PrismaClient } = require('@prisma/client')
const Prisma = new PrismaClient();

exports.createAnnouncement = async(req,res) => {
    try{
        const {title,textContent} = req.body;
        const id = req.user.id;
        const {file} = req.files;

        id = parseInt(id);

        if(!title || !textContent || !id || !file){
            return res.status(404).json({
                success:false,
                message:"Content Missing",
            })
        }

        const ifOfficialExists = await Prisma.user.findUnique({where : {id}});
        if(!ifOfficialExists){
            return res.status(404).json({
                success:false,
                message:"Account not Found",
            })
        }

        // Remove this, already verified in Middlewares
        if(ifOfficialExists?.accountType !== AccountType.Official){
            console.log(ifOfficialExists?.accountType);
            console.log(AccountType?.Official);
            return res.status(400).json({
                success:false,
                message:"Unauthorized Account Type",
            })
        }

        const uploadedFile = await uploadMedia(file,process.env.FOLDER_NAME);
        if(!uploadedFile){
            return res.status(400).json({
                success:false,
                message:"File Upload Failed",
            })
        }

        await Prisma.announcement.create({data:{title:title,textContent:textContent,fileContent:[uploadedFile?.secure_url],createdById:id}});
        return res.status(200).json({
            success:true,
            message:"Announcement Created Successfully",
        });

    }catch(e){
        console.log(e);
        return res.status(400).json({
            success:false,
            message:"Failed to create Announcement",
        })
    }
}

exports.deleteAnnouncement = async(req,res) => {
    try{
        const announcementId = req.body.id;
        const userId = req.user.id;

        if(!announcementId || !userId){
            return res.status(404).json({
                success:false,
                message:"Announcement Id Not Found",
            })
        }

        const ifUserExists = await Prisma.user.findFirst({where : {id : userId}});
        if(!ifUserExists){
            return res.status(404).json({
                success:false,
                message:"User Account Not Found",
            })
        }

        const ifAnnouncementExists = await Prisma.announcement.findUnique({where : {id : announcementId}});
        if(!ifAnnouncementExists){
            return res.status(404).json({
                success : false,
                message : "Announcement Not Found",
            })
        }
        
        await Prisma.announcement.delete({where : {id:announcementId}});

        return res.status(200).json({
            success:true,
            message:"Announcement Deleted Successfully",
        })
    }catch(e){
        return res.status(400).json({
            success:false,
            message:"Unable to delete Announcement",
        })
    }
}



exports.updateStudentAttendance = async (req, res) => {
    try {
        const { id } = req.user;
        const { date, studentId, status } = req.body;

        if (!id || !date || !studentId || !status) {
            return res.status(400).json({
                success: false,
                message: "Data is missing",
            });
        }

        const officialDetails = await prisma.official.findFirst({ where: { userId: id } });
        if (!officialDetails) {
            return res.status(404).json({
                success: false,
                message: "Official account not found",
            });
        }

        const hostelBlockId = officialDetails.hostelBlockId;
        if (!hostelBlockId) {
            return res.status(404).json({
                success: false,
                message: "Hostel Block ID not found",
            });
        }

        const dateToUpdate = new Date(date);

        let updateData;
        if (status === 'PRESENT') {
            updateData = { presentDays: { push: dateToUpdate } };
        } else if (status === 'ABSENT') {
            updateData = { absentDays: { push: dateToUpdate } };
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid status",
            });
        }

        await prisma.studentAttendance.updateMany({
            where: { studentId, hostelBlockId },
            data: updateData,
        });

        return res.status(200).json({
            success: true,
            message: `Student marked ${status.toLowerCase()} successfully`,
        });
    } catch (error) {
        console.error('Error updating student attendance:', error);
        return res.status(500).json({
            success: false,
            message: "Unable to update student attendance",
        });
    }
};
