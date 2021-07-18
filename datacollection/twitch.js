// const { JSDOM } = require('jsdom')

const jsdom = require('jsdom');
const { By, until } = require('selenium-webdriver');
const { printStatus } = require("../logging/logger")

async function getDropProgresses() {
    printStatus("Getting drop's progress.");
    const driver = global.driver;

    await driver.switchTo().newWindow('dropProgressTab');
    await driver.get("https://www.twitch.tv/drops/inventory");
    await driver.wait(until.elementLocated(By.className("eeWlxQ")));

    const dom = new jsdom.JSDOM(await driver.getPageSource());

    let progresses = [];
    let drops = dom.window.document.body.getElementsByClassName("gtZclG")
    
    for (let i = 0; i < drops.length; i++) {
        const drop = drops[i];
        if (drop.parentElement.getElementsByClassName("ktnnZK").length < 1)
            continue;
        
        let progress;
        if (drop.getElementsByClassName("jMWlGV").length > 0)
            progress = 100;
        else
            progress = drop.parentElement.getElementsByClassName("ktnnZK")[0].innerHTML;
        
        let data = {};
        data["progress"] = progress;
        data["dropStreamer"] = drop.parentElement.getElementsByClassName("cEfyas")[0].innerHTML.split(" ")[0].toLowerCase();
        progresses.push(data);
    }

    await driver.close();
    await driver.switchTo().window((await driver.getAllWindowHandles())[0]);
    return progresses;
}

async function getCollectedDrops() {
    printStatus("Getting claimed drops.");
    const driver = global.driver;

    await driver.switchTo().newWindow('collectedDropsTab');
    await driver.get("https://www.twitch.tv/drops/inventory");
    await driver.wait(until.elementLocated(By.className("eeWlxQ")))

    const dom = new jsdom.JSDOM(await driver.getPageSource());

    const claimedItems = dom.window.document.body.getElementsByClassName("eeWlxQ")[0].children;

    const out = [];
    for (let i = 0; i < claimedItems.length; i++) {
        const claimedItem = claimedItems[i];

        if (claimedItem.classList.contains("jOQDqw"))
            continue;

        out.push(claimedItem.getElementsByClassName("dObDam")[1].children[0].innerHTML);
    }
    await driver.close();
    await driver.switchTo().window((await driver.getAllWindowHandles())[0]);
    return out;
}

module.exports = {
    getCollectedDrops,
    getDropProgresses
}