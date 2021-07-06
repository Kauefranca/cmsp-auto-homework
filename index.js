const puppeteer = require('puppeteer');
const fs = require('fs');
const { getAuthToken } = require('./src/getLoggedPage');
const { validator } = require('./src/authIdValidator');
const { resolveForm } = require('./src/resolveForm') 

const credentials = JSON.parse(fs.readFileSync('./database/credentials.json'));

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

;(async () => {
    const browser = await puppeteer.launch({ defaultViewport: null, headless: false});
    if (await validator(browser) == false) {
        await getAuthToken(credentials, browser);
    }
    const page = await browser.newPage();
    await page.goto(`https://cmsp-tms.ip.tv/user?auth_token=${JSON.parse(fs.readFileSync('./authid.json'))}`);

    while (true) {
        try {
            await page.waitForSelector('tbody tr button', { timeout: 10000});
            await page.click('tbody tr button');
            await page.waitForSelector('tbody tr div.collapsed__options button');
            await sleep(1000);
            await page.click('tbody tr div.collapsed__options button');
            await page.waitForSelector('button.fab__submit')
            await resolveForm(page)
        }
        catch {
            break
        }
    }
    console.log('Terminei de fazer suas atividades :D');
    await browser.close()
})();