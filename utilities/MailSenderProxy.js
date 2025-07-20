const nodemailer = require("nodemailer")

const SendEmailProxy = async(email,title,body,attachmentPath,attachmentName) => {
    try{
        const transporter = nodemailer.createTransport({
            pool:true,
            service : process.env.MAIL_HOST1,
            auth:{
                user : process.env.MAIL_USER1,
                pass : process.env.MAIL_PASS1
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

        transporter.close();

        return info;
    }catch(e){
        console.log("Error Sending Email");
        throw(e);
    }
}

module.exports = SendEmailProxy;