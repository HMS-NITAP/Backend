const nodemailer = require("nodemailer")

const SendEmail = async(email,title,body,attachmentPath,attachmentName) => {
    try{
        const transporter = nodemailer.createTransport({
            service : process.env.MAIL_HOST,
            auth:{
                user : process.env.MAIL_USER,
                pass : process.env.MAIL_PASS
            }
        });

        const mailOptions = {
            from : "NIT Andhra Pradesh | Hostel Management System",
            to:email,
            subject:title,
            html:body,
        }

        if (attachmentPath) {
            mailOptions.attachments = [
                {
                    filename: attachmentName,
                    path: attachmentPath
                }
            ];
        }

        let info = await transporter.sendMail(mailOptions);

        return info;
    }catch(e){
        console.log("Error Sending Email");
        throw(e);
    }
}

module.exports = SendEmail;