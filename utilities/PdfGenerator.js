const puppeteer = require("puppeteer");
const path = require("path");
const { signS3UrlsInHtml } = require("./S3SignedUrl");

const PdfGenerator = async (htmlContent, filename, pdfOptions = {}) => {
    try {
        // const browser = await puppeteer.launch({
        //     args: ['--no-sandbox', '--disable-setuid-sandbox']
        // });

        // FOR RENDER HOSTING
        const browser = await puppeteer.launch({
            headless: true,
            // executablePath: '/usr/bin/google-chrome', // Adjust this path if necessary
            args: ['--no-sandbox', '--headless', '--disable-gpu', '--disable-dev-shm-usage'],
        });

        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(60000);

        const signedHtml = await signS3UrlsInHtml(htmlContent);

        await page.setContent(signedHtml, { waitUntil: 'networkidle0' });

        // networkidle0 does not cover webfont loading
        await page.evaluate(() => document.fonts.ready);

        // Generate PDF
        const pdfPath = path.join(__dirname, filename);
        await page.pdf({ path: pdfPath, format: 'A4', printBackground: true, ...pdfOptions });
        console.log("PDF generated");

        await browser.close();
        return pdfPath;
    } catch (error) {
        console.error("Error generating PDF:", error);
        throw error;
    }
};

module.exports = PdfGenerator;
