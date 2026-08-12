const { latoFontFaceCss } = require("./fonts");

const INSTITUTE_LOGO_URL = "https://res.cloudinary.com/dwt1vmf2u/image/upload/v1720685383/logo_jfjskg.png";

const CARD_WIDTH = "88.9mm";
const CARD_HEIGHT = "50.8mm";

const messIdCardAttachment = ({ serialNo, image, name, rollNo, course, branch, contact, blockName, roomNo, messHall }) => {
    return `<!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <title>Mess ID Card</title>
            <style>
                ${latoFontFaceCss}

                @page {
                    size: ${CARD_WIDTH} ${CARD_HEIGHT};
                    margin: 0;
                }

                * {
                    box-sizing: border-box;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }

                body {
                    background-color: #ffffff;
                    font-family: 'Lato', Arial, sans-serif;
                    color: #000000;
                    margin: 0;
                    padding: 0;
                }

                .card {
                    width: ${CARD_WIDTH};
                    height: ${CARD_HEIGHT};
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                }

                .card + .card {
                    page-break-before: always;
                }

                .card-header {
                    background-color: #c0392b;
                    color: #ffffff;
                    text-align: center;
                    padding: 1.4mm 1mm;
                }

                .card-header-title {
                    font-size: 6.2pt;
                    font-weight: 700;
                    margin: 0;
                    letter-spacing: 0.1pt;
                }

                .card-header-address {
                    font-size: 4.4pt;
                    font-weight: 500;
                    margin: 0.4mm 0 0 0;
                }

                .card-body {
                    flex: 1;
                    padding: 1.6mm 2.4mm 1.6mm 2.4mm;
                    position: relative;
                }

                .watermark {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 24mm;
                    opacity: 0.12;
                }

                .card-content {
                    position: relative;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }

                .serial {
                    font-size: 4.6pt;
                    font-weight: 700;
                    margin: 0;
                    line-height: 1;
                }

                .badge-row {
                    text-align: center;
                    margin: -1.2mm 0 0.6mm 0;
                }

                .badge {
                    display: inline-block;
                    border: 0.3mm solid #c0392b;
                    border-radius: 4mm;
                    color: #c0392b;
                    font-size: 5.4pt;
                    font-weight: 700;
                    padding: 0.3mm 3mm;
                    letter-spacing: 0.4pt;
                }

                .details {
                    width: 100%;
                    border-collapse: collapse;
                }

                .details td {
                    vertical-align: top;
                }

                .field {
                    font-size: 6pt;
                    font-weight: 500;
                    padding: 0.75mm 0;
                    border-bottom: 0.2mm dotted #000000;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .field-label {
                    font-weight: 700;
                }

                .photo-cell {
                    width: 19mm;
                    padding-left: 2mm;
                }

                .photo, .photo-placeholder {
                    width: 17mm;
                    height: 22mm;
                    border: 0.2mm solid #000000;
                }

                .photo {
                    object-fit: cover;
                }

                .photo-placeholder {
                    font-size: 3.6pt;
                    text-align: center;
                    color: #555555;
                    padding-top: 6mm;
                }

                .signatures {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: auto;
                    padding-top: 3.6mm;
                    table-layout: fixed;
                }

                .signatures td {
                    font-size: 4pt;
                    font-weight: 500;
                    text-align: center;
                }

                .validity {
                    width: 100%;
                    height: 100%;
                    border-collapse: collapse;
                    table-layout: fixed;
                }

                .validity th:first-child {
                    width: 10mm;
                    white-space: nowrap;
                }

                .validity th, .validity td {
                    border: 0.2mm solid #000000;
                    font-size: 4.4pt;
                    font-weight: 700;
                    text-align: center;
                    padding: 0.3mm 0.2mm;
                }

                .validity td {
                    font-weight: 500;
                }
            </style>
        </head>
        <body>
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
                                    <div class="field"><span class="field-label">Course &amp; Branch :</span> ${course} - ${branch}</div>
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
        </body>
    </html>`
}

module.exports = messIdCardAttachment;
