const editJsonFile = require('edit-json-file');
const fs = require('fs');

function isSaved() {
    return fs.existsSync(`${__dirname}/cookies.json`);
}

function saveCookies(driver) {
    driver.manage().getCookies().then(cookies => {
        const ejs = editJsonFile(`${__dirname}/cookies.json`, {autosave:true})
        ejs.set("cookies", cookies);
    }); 
}

function getCookies() {
    return require('./cookies.json').cookies;
}

module.exports = {
    isSaved,
    saveCookies,
    getCookies
};