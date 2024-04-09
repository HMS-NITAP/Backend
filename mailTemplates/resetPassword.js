const resetPassword = (token) => {
	return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>Password Update Confirmation</title>
        <style>
            body {
                background-color: #ffffff;
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.4;
                color: #333333;
                margin: 0;
                padding: 0;
            }
    
    
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                text-align: center;
            }
    
            .logo {
                max-width: 200px;
                margin-bottom: 20px;
            }
    
            .message {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 20px;
            }
    
            .body {
                font-size: 16px;
                margin-bottom: 20px;
            }
    
            .support {
                font-size: 14px;
                color: #999999;
                margin-top: 20px;
            }
    
            .highlight {
                font-weight: bold;
            }
            .heading{
                text-align:center;
                font-size: 30px;
                font-weight:600;
                margin-bottom:30px;
            }
            .token{
                color:black;
                font-size:32px;
                font-weight:900;
                margin:0px auto;
            }
        </style>
    
    </head>
    
    <body>
        <div class="container">
        <a href="https://www.nitandhra.ac.in/main/"><img class="logo"
            src="https://media.licdn.com/dms/image/C560BAQEIWah9gNUmvQ/company-logo_200_200/0/1642324574360/national_institute_of_technology_andhra_pradesh_logo?e=1720656000&v=beta&t=Q_CV4msLCgKKiqiDxASvbOJHrCAgWivm7_qGxahLo1o" alt="NITAP Logo"></a>
            <div class="message">Reset Password Link</div>
            <div class="body">
                <div class="heading">Copy and paste the below token to proceed with resetting of your account password.</div>
                <p class="token">${token}</p>
                </p>
                <p>If you did not request this password change, please contact us immediately to secure your account.</p>
            </div>
                <a href="mailto:info@studynotion.com">info@studynotion.com</a>. We are here to help!
            </div>
            
        </div>
    </body>
    
    </html>`; 
};

module.exports = resetPassword;