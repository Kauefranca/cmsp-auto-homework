const fs = require('fs');

async function validator(browser) {
    console.log('Verificando token...');
    const page = await browser.newPage();
    await page.goto(`https://cmsp-tms.ip.tv/user?auth_token=${JSON.parse(fs.readFileSync('./authid.json'))}`);
    try {
        await page.waitForSelector('tbody.MuiTableBody-root', { timeout: 10000 });
        console.log('Token validado com sucesso!');
        return true;
    }
    catch {
        console.log('Token inválido!');
        return false;
    }
    finally {
        await page.close();
    }
}

module.exports = { validator }