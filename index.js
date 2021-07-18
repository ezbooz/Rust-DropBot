const readline = require('readline');

const firefox = require('selenium-webdriver/firefox');
const { Builder } = require('selenium-webdriver');
const { run, setTargetDrop, getNextDrop } = require("./bot/bot")
const { printWatermark, printStatus } = require("./logging/logger")
const session = require('./session/twitchSession');

function waitForNewline() {
    const query = "";
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }))
}

// global.debugMode = process.argv.includes("-debug");

const screen = {
    width: 640,
    height: 480
};

(async() => {
    printWatermark();
    printStatus("Starting selenium webdriver.");

    global.driver = await new Builder().forBrowser('firefox').setFirefoxOptions(new firefox.Options().headless().windowSize(screen)).build();   

    await driver.manage().deleteAllCookies();

    if (!session.isSaved())
    {
        await global.driver.get("http://twitch.tv/login");
        printStatus("Please login and then press enter.");
        await waitForNewline();
        printWatermark();
        printStatus("Saving cookies.");
        session.saveCookies();
    } else {
        driver.get("https://twitch.tv/");
        let i = 0;
        let failed = 0;
        session.getCookies().forEach(async (cookie) => {
            i++;
            printStatus(`Loading cookies. ${i}/${session.getCookies().length} ${failed > 0 ? failed + " failed. (Usually fine)" : "."}`);
            try {
                await driver.manage().addCookie(cookie);
            } catch {
                failed++;
            }
        });
    }
    run();
})();