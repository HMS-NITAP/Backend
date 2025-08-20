const firstYearAcknowlegdementLetterAttachment = (date,name,year,rollNo,regNo,amount,blockName,roomNo,cotNo,gender,floor) => {
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
                    /* padding: 20px; */
                    text-align: center;
                }
        
                .logo {
                    max-width: 80px;
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
                }

                .mainH1 {
                    font-size: 18px;
                    font-weight: 700;
                }
        
                .message {
                    font-size: 14px;
                    font-weight: bold;
                    margin-bottom: 0px;
                }
        
                .body {
                    font-size: 16px;
                    margin-bottom: 10px;
                }
        
                .Acknowledgement {
                    border-top: 1px solid #000;
                    border-bottom: 1px solid #000;
                    font-weight: bold;
                }

                .title{
                    font-size: 18px;
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
                    width: 95%;
                    margin: auto;
                    display: grid;
                    grid-template-columns: repeat(3, 1fr); 
                    grid-template-rows: 1fr; 
                    gap: 5px;
                    margin-top: 10px;
                    margin-bottom: 0px; 
                }

                .grid-item {
                    display: flex;
                    flex-direction: column;
                    text-align: left;
                    color: #000;
                    font-size: 16px;
                    font-weight: 500;
                    gap: 10px;
                }

                .sign-container {
                    width: 90%;
                    margin: auto;
                    display: grid;
                    grid-template-columns: repeat(3, 1fr); 
                    grid-template-rows: 1fr; 
                    gap: 10px;
                    margin-top: 100px;
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
                        <div class="mainH1">NATIONAL INSTITUTE OF TECHNOLOGY , ANDHRA PRADESH </div>
                        <span>TADEPALLIGUDEM-534102, WEST GODAVARI DIST., ANDHRA PRADESH, INDIA</span>
                    </div>
                </div>

                <div class="Acknowledgement">
                    <div class="Date">
                        <p class="title">Hostel Room Allocation Letter (Student Copy)</p>
                        <p>Date: ${date}</p>
                    </div>
                </div>

                <div class="grid-container">
                    <div class="grid-item">
                        <div>Name: ${name}</div>
                        <div>B.Tech Year: ${year}</div>
                        <div>Roll No: ${rollNo}</div>
                    </div>

                    <div class="grid-item">
                        <div>Gender: ${gender==="M" ? "Male" : "Female"}</div>
                        <div>Hostel Block : ${blockName}</div> 
                        <div>Amount Paid: ${amount}</div>
                    </div>

                    <div class="grid-item">
                        <div>Floor No : ${floor}</div>
                        <div>Room No : ${roomNo}</div>
                        <div>Cot No : ${cotNo}</div>   
                    </div>
                </div>

                <div class="sign-container">
                    <div class="grid-item">
                        <p>Reported On</p>
                    </div>
                    <div class="grid-item" style="text-align: center; gap: 0px;">
                        <div>Signature of Authorised</div>
                        <div>Hostel Office Official</div>
                    </div>
                    <div>
                        <p>Signature of Warden/Caretaker</p>
                    </div>
                </div>
            </div>
            <hr />
            <div class="container" style="margin-top: 900px;">
                <div class="logoContainer">
                    <div>
                        <a href="https://www.nitandhra.ac.in/main/"><img class="logo" src="https://res.cloudinary.com/dwt1vmf2u/image/upload/v1720685383/logo_jfjskg.png" alt="NITAP Logo"></a>
                    </div>
                    <div class="main">
                        <div class="mainH1">NATIONAL INSTITUTE OF TECHNOLOGY , ANDHRA PRADESH </div>
                        <span>TADEPALLIGUDEM-534102, WEST GODAVARI DIST., ANDHRA PRADESH, INDIA</span>
                    </div>
                </div>

                <div class="Acknowledgement">
                    <div class="Date">
                        <p class="title">Hostel Room Allocation Letter (Office Copy)</p>
                        <p>Date: ${date}</p>
                    </div>
                </div>

                <div class="grid-container">
                    <div class="grid-item">
                        <div>Name: ${name}</div>
                        <div>B.Tech Year: ${year}</div>
                        <div>Roll No: ${rollNo}</div>
                    </div>

                    <div class="grid-item">
                        <div>Gender: ${gender==="M" ? "Male" : "Female"}</div>
                        <div>Hostel Block : ${blockName}</div> 
                        <div>Amount Paid: ${amount}</div>
                    </div>

                    <div class="grid-item">
                        <div>Floor No : ${floor}</div>
                        <div>Room No : ${roomNo}</div>
                        <div>Cot No : ${cotNo}</div>   
                    </div>
                </div>

                <div class="sign-container">
                    <div class="grid-item">
                    </div>
                    <div class="grid-item" style="text-align: center; gap: 0px;">
                        <div>Signature of Authorised</div>
                        <div>Hostel Office Official</div>
                    </div>
                    <div>
                    </div>
                </div>
            </div>
        </body>
    </html>`
}

module.exports = firstYearAcknowlegdementLetterAttachment;