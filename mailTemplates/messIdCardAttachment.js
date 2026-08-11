const INSTITUTE_LOGO_URL = "https://res.cloudinary.com/dwt1vmf2u/image/upload/v1720685383/logo_jfjskg.png";

const messIdCardAttachment = ({ serialNo, image, name, rollNo, course, branch, contact, blockName, roomNo, messHall }) => {
    return `<!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <title>Mess ID Card</title>
            <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;500;700&display=swap" rel="stylesheet">
            <style>
                body {
                    background-color: #ffffff;
                    font-family: 'Lato', Arial, sans-serif;
                    color: #000000;
                    margin: 0;
                    padding: 0;
                }

                .container {
                    max-width: 700px;
                    margin: 0 auto;
                    padding: 24px 20px;
                }

                .card {
                    border: 1px solid #000000;
                    margin-bottom: 28px;
                }

                * {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }

                .card-header {
                    background-color: #c0392b;
                    color: #ffffff;
                    text-align: center;
                    padding: 8px 6px;
                }

                .card-header-title {
                    font-size: 15px;
                    font-weight: 700;
                    margin: 0;
                    letter-spacing: 0.4px;
                }

                .card-header-address {
                    font-size: 11px;
                    font-weight: 500;
                    margin: 2px 0 0 0;
                }

                .card-body {
                    padding: 12px 14px 16px 14px;
                    position: relative;
                }

                .watermark {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 190px;
                    opacity: 0.12;
                }

                .card-content {
                    position: relative;
                }

                .serial {
                    font-size: 12px;
                    font-weight: 700;
                    margin: 0 0 6px 0;
                }

                .badge-row {
                    text-align: center;
                    margin-bottom: 10px;
                }

                .badge {
                    display: inline-block;
                    border: 1px solid #c0392b;
                    border-radius: 20px;
                    color: #c0392b;
                    font-size: 13px;
                    font-weight: 700;
                    padding: 4px 22px;
                    letter-spacing: 1px;
                }

                .details {
                    width: 100%;
                    border-collapse: collapse;
                }

                .details td {
                    vertical-align: top;
                }

                .field {
                    font-size: 12px;
                    font-weight: 500;
                    padding: 4px 0;
                    border-bottom: 1px dotted #000000;
                }

                .field-label {
                    font-weight: 700;
                }

                .photo-cell {
                    width: 110px;
                    padding-left: 14px;
                }

                .photo {
                    width: 100px;
                    height: 120px;
                    border: 1px solid #000000;
                    object-fit: cover;
                }

                .photo-placeholder {
                    width: 100px;
                    height: 120px;
                    border: 1px solid #000000;
                    font-size: 10px;
                    text-align: center;
                    color: #555555;
                }

                .signatures {
                    width: 100%;
                    margin-top: 26px;
                    border-collapse: collapse;
                }

                .signatures td {
                    font-size: 11px;
                    font-weight: 500;
                    text-align: center;
                }

                .validity {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 4px;
                }

                .validity th, .validity td {
                    border: 1px solid #000000;
                    font-size: 11px;
                    font-weight: 700;
                    text-align: center;
                    padding: 6px 2px;
                }

                .validity td {
                    font-weight: 500;
                    height: 26px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="card">
                    <div class="card-header">
                        <p class="card-header-title">NATIONAL INSTITUTE OF TECHNOLOGY ANDHRA PRADESH</p>
                        <p class="card-header-address">TADEPALLIGUDEM, W.G.Dt., ANDHRA PRADESH - 534 101</p>
                    </div>
                    <div class="card-body">
                        <img class="watermark" src="${INSTITUTE_LOGO_URL}" alt="">
                        <div class="card-content">
                        <p class="serial">S.No : ${serialNo}</p>
                        <div class="badge-row"><span class="badge">MESS ID CARD</span></div>

                        <table class="details">
                            <tr>
                                <td>
                                    <div class="field"><span class="field-label">Student Name :</span> ${name}</div>
                                    <div class="field"><span class="field-label">Roll No./Reg.No. :</span> ${rollNo}</div>
                                    <div class="field"><span class="field-label">Course :</span> ${course}</div>
                                    <div class="field"><span class="field-label">Branch :</span> ${branch}</div>
                                    <div class="field"><span class="field-label">Contact No. :</span> ${contact}</div>
                                    <div class="field"><span class="field-label">Block &amp; Room No. :</span> ${blockName} - ${roomNo}</div>
                                    <div class="field"><span class="field-label">Mess Allotted :</span> ${messHall}</div>
                                </td>
                                <td class="photo-cell">
                                    ${image ? `<img class="photo" src="${image}" alt="Student Photo">` : `<div class="photo-placeholder">Affix a recent passport size Photo</div>`}
                                </td>
                            </tr>
                        </table>

                        <table class="signatures">
                            <tr>
                                <td>Student Signature</td>
                                <td>Warden Signature</td>
                                <td>Mess Warden Signature</td>
                            </tr>
                        </table>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <p class="card-header-title">NATIONAL INSTITUTE OF TECHNOLOGY ANDHRA PRADESH</p>
                        <p class="card-header-address">TADEPALLIGUDEM, W.G.Dt., ANDHRA PRADESH - 534 101</p>
                    </div>
                    <div class="card-body">
                        <table class="validity">
                            <tr>
                                <th>YEAR</th>
                                <th colspan="2">1st YEAR</th>
                                <th colspan="2">2nd YEAR</th>
                                <th colspan="2">3rd YEAR</th>
                                <th colspan="2">4th YEAR</th>
                            </tr>
                            <tr>
                                <th>SEM</th>
                                <th>ODD</th>
                                <th>EVEN</th>
                                <th>ODD</th>
                                <th>EVEN</th>
                                <th>ODD</th>
                                <th>EVEN</th>
                                <th>ODD</th>
                                <th>EVEN</th>
                            </tr>
                            ${["HOR", "ROOM No", "VALID TILL", "SIGN"].map((label) => `<tr><th>${label}</th>${"<td></td>".repeat(8)}</tr>`).join("")}
                        </table>
                    </div>
                </div>
            </div>
        </body>
    </html>`
}

module.exports = messIdCardAttachment;
