const nodemailer = require("nodemailer")

const SendEmail = async(email,title,body) => {
    try{
        const transporter = nodemailer.createTransport({
            service : process.env.MAIL_HOST,
            auth:{
                user : process.env.MAIL_USER,
                pass : process.env.MAIL_PASS
            }
        });

        let info = await transporter.sendMail({
            from : "NIT Andhra Pradesh | Hostel Management System",
            to:email,
            subject:title,
            html:body
        })
        
        return info;
    }catch(e){
        console.log("Error Sending Email");
        console.log(e);
    }
}

module.exports = SendEmail;