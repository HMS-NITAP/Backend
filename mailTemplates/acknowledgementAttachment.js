const acknowledgementAttachment = (date,image,name,contact,year,rollNo,regNo,paymentMode,amount,blockName,roomNo,cotNo) => {
    return `<!DOCTYPE html>
	<html>
        <head>
            <meta charset="UTF-8">
            <title>Registration Form</title>
            <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;500;700&display=swap" rel="stylesheet">
            <style>
                body {
                    background-color: #ffffff;
                    font-family: 'Lato', Arial, sans-serif;
                    font-size: 16px;
                    line-height: 1.4;
                    color: #333333;
                    margin: 0;
                    padding: 0;
                }
        
                .container {
                    max-width: 1180px;
                    margin: 0 auto;
                    padding: 20px;
                    text-align: center;
                }
        
                .logo {
                    max-width: 125px;
                }

                .image {
                    width: 100px;
                    height: 120px;
                    borderRadiud : 10px;
                }

                .logoContainer {
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    gap: 10px;
                }
                
                .main {
                    display: flex;
                    flex-direction: column;
                    row-gap: 1px;
                }

                .mainH1 {
                    font-size: 22px;
                    font-weight: 700;
                }
        
                .message {
                    font-size: 16px;
                    font-weight: bold;
                    margin-bottom: 10px;
                }
        
                .body {
                    font-size: 16px;
                    margin-bottom: 10px;
                }
        
                .Acknowledgement {
                    font-weight: bold;
                }

                .title{
                    font-size: 20px;
                }

                .Date {
                    display: flex;
                    flex-direction: row;
                    justify-content: right;
                    column-gap: 160px;
                    margin-right: 60px;
                    font-weight: 700;
                }

                .heading {
                    text-align: "center";
                    font-weight: 700;
                    font-size: 20px;
                    color: black;
                }

                .grid-container {
                    width: 90%;
                    margin: auto;
                    display: grid;
                    grid-template-columns: repeat(3, 1fr); 
                    grid-template-rows: 1fr; 
                    gap: 10px;
                    margin-top: 20px;
                    margin-bottom: 20px; 
                }

                .grid-item {
                    display: flex;
                    flex-direction: column;
                    text-align: left;
                    color: #000;
                    font-size: 16px;
                    font-weight: 500;
                }

                .sign-container {
                    width: 90%;
                    margin: auto;
                    display: grid;
                    grid-template-columns: repeat(3, 1fr); 
                    grid-template-rows: 1fr; 
                    gap: 10px;
                    margin-top: 40px;
                    margin-bottom: 20px; 
                }

            </style>
        
        </head>
        <body>
            <div class="container">
                <div class="logoContainer">
                    <div>
                        <a href="https://www.nitandhra.ac.in/main/"><img class="logo" src="https://res.cloudinary.com/dwt1vmf2u/image/upload/v1720685383/logo_jfjskg.png" alt="NITAP Logo"></a>
                    </div>
                    <div class="main">
                        <p class="mainH1">NATIONAL INSTITUTE OF TECHNOLOGY , ANDHRA PRADESH </p>
                        <span>TADEPALLIGUDEM-534102, WEST GODAVARI DIST., ANDHRA PRADESH, INDIA</span>
                        <p class="message">HOSTEL OFFICE</p>
                    </div>
                </div>

                <hr>

                <div class="Acknowledgement">
                    <div class="Date">
                        <p class="title">Acknowledgement for Hostel Room Allocation (B.Tech)</p>
                        <p>Date: ${date}</p>
                    </div>
                </div>

                <hr>

                <div class="heading">Student Details :</div>
                <div class="grid-container">
                    <div class="grid-item">
                        <img class="logo" src=${image} alt="Student Image">
                    </div>

                    <div class="grid-item">
                        <p>Name of the Student: ${name}</p>
                        <p>Contact No: ${contact}</p>
                        <p>B.Tech Year: ${year}</p>
                    </div>

                    <div class="grid-item">
                        <p>Roll No: ${rollNo}</p>
                        <p>Reg No: ${regNo}</p>
                    </div>
                </div>

                <div class="heading">Payment and Hostel Allotment Details :</div>
                <div class="grid-container">
                    <div class="grid-item">
                        <p>Payment Mode : ${paymentMode}</p>
                        <p>Amount Paid: ${amount}</p>
                    </div>

                    <div class="grid-item">
                        <p>Hostel Block : ${blockName}</p>
                        <p>Room No : ${roomNo}</p>
                    </div>

                    <div class="grid-item">
                        <p>Cot No : ${cotNo}</p>
                    </div>
                </div>

                <div class="sign-container">
                    <div class="grid-item">
                        <p>Signature of Student</p>
                    </div>
                    <div class="grid-item">
                    </div>
                    <div>
                        <p>Signature of Warden/Caretaker</p>
                    </div>
                </div>

                <div class="heading"><p>(This is a computer-generated receipt and does not require a signature.)</p></div>
            </div>
        </body>
    </html>`
}

module.exports = acknowledgementAttachment;