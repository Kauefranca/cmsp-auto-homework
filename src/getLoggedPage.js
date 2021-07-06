const fs = require('fs');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getLoggedPage(credentials, browser) {

    console.log('Fazendo login');
    const page = await browser.newPage();
    await page.goto('https://cmspweb.ip.tv');
    await page.waitForSelector('div#access-student');
    await page.click('div#access-student');
    await page.click('input#ra-student');
    await page.keyboard.type(credentials.ra);
    await page.click('input#digit-student');
    await page.keyboard.type(credentials.digit);
    await page.select('select#uf-student', credentials.uf);
    await page.click('input#password-student');
    await page.keyboard.type(credentials.password);
    await page.click('input#btn-login-student');
    console.log('Login terminado');
    return page;
}

async function getAuthToken(credentials, browser) {
    const page = await getLoggedPage(credentials, browser);
    await sleep(3000);
    await page.click('div#chng');
    await sleep(2000);
    await page.click('div#channelArea div#roomList div div');
    console.log('Entrando na sala...');
    await sleep(5000);
    await page.click('div#channelTaskList')
    await page.waitForSelector('div#rpchntasklist');
    const authToken = await page.evaluate(() => {
        return document.querySelector('div#rpchntasklist iframe').getAttribute('src').split('auth_token=')[1]
    });
    await page.close();
    return fs.writeFileSync('./authid.json', JSON.stringify(authToken, null, '\t'));
}

module.exports = { getAuthToken }
