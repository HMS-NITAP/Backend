const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const PdfGenerator = async (htmlContent, filename) => {
    try {
        // const browser = await puppeteer.launch({
        //     args: ['--no-sandbox', '--disable-setuid-sandbox']
        // });

        const browser = await puppeteer.launch({
            headless: true,
            executablePath: `/usr/bin/google-chrome`,
            args: [`--no-sandbox`, `--headless`, `--disable-gpu`, `--disable-dev-shm-usage`],
          });

        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(60000);

        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        // Generate PDF
        const pdfPath = path.join(__dirname, filename);
        await page.pdf({ path: pdfPath, format: 'A4' });
        console.log("PDF generated");

        await browser.close();
        return pdfPath;
    } catch (error) {
        console.error("Error generating PDF:", error);
        throw error;
    }
};

module.exports = PdfGenerator;
