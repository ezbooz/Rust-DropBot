const { getDropData } = require("../datacollection/drops");
const { getDropProgresses } = require("../datacollection/twitch");
const { By } = require('selenium-webdriver');
const { printDrops, printStatus, updateTargetDrop } = require("../logging/logger");

let interval;

async function run() {
    let driver = global.driver;
    global.lastDropData = await getDropData();
    printDrops(global.lastDropData);

    if (global.targetDrop == null || global.targetDrop == undefined)
    {
        const nextDrop = getNextDrop();
        if (nextDrop != null)
            global.targetDrop = nextDrop;
        else {
            printStatus("Looking for a stream.")
            setTimeout(run, 60*1000);
            return;
        }
    }

    global.lastDropData.forEach(d => {
        if (d.streamURL == global.targetDrop.streamURL)
            global.targetDrop = d;
    });

    if (await driver.getCurrentUrl() != global.targetDrop.streamURL)
    {
        printStatus("Switching streams.");

        await driver.get(global.targetDrop.streamURL);

        const buttons = await driver.findElements(By.className("jbpuQw"));

        if (buttons.length > 1)
            await buttons[0].click();
    }    

    if (!global.targetDrop.isStreaming || global.targetDrop.progress == 100)
    {
        const nextdrop = getNextDrop();
        if (nextdrop != null)
        {
            global.targetDrop = nextdrop;
            printStatus("Switching streams.")
            setTimeout(run, 5*1000);
        } else
        {
            setTimeout(run, 60*1000);
            printStatus("Looking for a stream.")
            return;
        }
    }

    // jbpuQw

    // console.log(`watching ${global.targetDrop.streamerName} for drop "${global.targetDrop.itemName}" | ${global.targetDrop.progress}% of ${global.targetDrop.watchTime}.`);
    printStatus("Watching a stream.");
    updateTargetDrop()
    setTimeout(run, 30*1000);
}

function setTargetDrop(drop) {
    global.targetDrop = drop;
}

function getNextDrop() {
    // let drops = await getDropData();
    let drops = global.lastDropData;

    drops = drops.filter(drop => drop.isStreaming);
    drops = drops.filter(drop => !drop.isClaimed);
    drops = drops.filter(drop => drop.progress != 100);

    if (drops.length < 1)
        return null;

    drops.sort((d1, d2) => {
        if (d1.progress > d2.progress)
            return -1;
        else
            return 1;
    })

    return drops[0];
}

module.exports = {
    getNextDrop,
    run,
    setTargetDrop
}