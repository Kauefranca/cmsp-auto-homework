const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

const launchBrowser = async () => {
    const browser = await puppeteer.launch({
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
        ],
        setTimeout: 60000,
        headless: false,
        ignoreHTTPSErrors: true,
        defaultViewport: { width: 1280, height: 720 },
    });
    return browser
}

module.exports = { launchBrowser }