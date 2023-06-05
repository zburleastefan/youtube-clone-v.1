const puppeteer = require('puppeteer');
const fs = require('fs');

let screenshotNumber = 1;
let pdfNumber = 1;

(async () => {
    const browser = await puppeteer.launch(
        {headless:"new"}
    );
    const page = await browser.newPage();

    // await page.goto(fullUrl, {
    //     waitUntil: 'networkidle0',
    //   });
      
    //   await page.type('#username', 'scott');
    //   await page.type('#password', 'tiger');
      
    //   await page.click('#Login_Button');
      
    //   await page.waitForNavigation({
    //     waitUntil: 'networkidle0',
    //   });
      
    //   await page.pdf({
    //     path: outputFileName,
    //     displayHeaderFooter: true,
    //     headerTemplate: '',
    //     footerTemplate: '',
    //     printBackground: true,
    //     format: 'A4',
    //   });

    await page.goto('https://youtube-clone-zburleastefan.vercel.app', {
        waitUntil: 'networkidle0',
    });
    // await page.goto('https://youtube-clone-zburleastefan.vercel.app');
    try {
        while (fs.existsSync(`./puppeteer/screenshots/screenshot_${screenshotNumber}.png`)) {
            //file exists
            ++screenshotNumber;
            // console.log("screenshot exists!")
        }
        while (fs.existsSync(`./puppeteer/pdfs/pdf_${pdfNumber}.pdf`)) {
            //file exists
            ++pdfNumber;
            // console.log("pdf exists!")
        }
    } catch(err) {
        console.error(err)
    }
    await page.screenshot({path:  `./puppeteer/screenshots/screenshot_${screenshotNumber}.png`,fullPage: true});
    await page.pdf({ path: `./puppeteer/pdfs/pdf_${pdfNumber}.pdf` });

    browser.close();
})();

// npm i puppeteer 
// node puppeteer/puppeteer.js
// npm run puppeteer