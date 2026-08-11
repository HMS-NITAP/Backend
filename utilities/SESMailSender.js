require("dotenv").config();

const { randomUUID } = require("crypto");
const fs = require("fs");
const path = require("path");
const { SESClient, SendRawEmailCommand } = require("@aws-sdk/client-ses");

const sesClient = new SESClient({ region: process.env.AWS_REGION });

const encodeBase64 = (value) => {
    const encodedValue = Buffer.from(value).toString("base64");
    return (encodedValue.match(/.{1,76}/g) || [""]).join("\r\n");
};

const getContentType = (fileName) => {
    const extension = path.extname(fileName).toLowerCase();
    const contentTypes = {
        ".pdf": "application/pdf",
        ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    };

    return contentTypes[extension] || "application/octet-stream";
};

const buildRawEmail = (email, title, body, attachmentPath, attachmentName) => {
    const boundary = `Boundary_${randomUUID()}`;
    const safeEmail = email.replace(/[\r\n]/g, "");
    const encodedTitle = `=?UTF-8?B?${Buffer.from(title).toString("base64")}?=`;
    const sourceEmail = process.env.SES_FROM_EMAIL;
    const lines = [
        `From: "NIT Andhra Pradesh | Hostel Management System" <${sourceEmail}>`,
        `To: ${safeEmail}`,
        `Subject: ${encodedTitle}`,
        "MIME-Version: 1.0",
        `Content-Type: multipart/mixed; boundary="${boundary}"`,
        "",
        `--${boundary}`,
        'Content-Type: text/html; charset="UTF-8"',
        "Content-Transfer-Encoding: base64",
        "",
        encodeBase64(body),
    ];

    if (attachmentPath) {
        const safeAttachmentName = path.basename(attachmentName || attachmentPath).replace(/["\r\n]/g, "");
        const attachment = fs.readFileSync(attachmentPath);
        lines.push(
            `--${boundary}`,
            `Content-Type: ${getContentType(safeAttachmentName)}; name="${safeAttachmentName}"`,
            "Content-Transfer-Encoding: base64",
            `Content-Disposition: attachment; filename="${safeAttachmentName}"`,
            "",
            encodeBase64(attachment),
        );
    }

    lines.push(`--${boundary}--`, "");
    return lines.join("\r\n");
};

const SendEmailUsingSES = async (email, title, body, attachmentPath, attachmentName) => {
    if (!process.env.SES_FROM_EMAIL) {
        throw new Error("SES_FROM_EMAIL is not configured");
    }

    const command = new SendRawEmailCommand({
        Destinations: [email],
        RawMessage: {
            Data: Buffer.from(buildRawEmail(email, title, body, attachmentPath, attachmentName)),
        },
        Source: process.env.SES_FROM_EMAIL,
    });

    return await sesClient.send(command);
};

module.exports = SendEmailUsingSES;
