'use strict'

const jsdom = require('jsdom')
const superagent = require('superagent');
const { printStatus } = require('../logging/logger');
const { getCollectedDrops, getDropProgresses } = require('./twitch')

async function getDropData() {
    let response = [];
    
    const pageData = await superagent.get("https://twitch.facepunch.com/");
    const dom = new jsdom.JSDOM(pageData.text);
    
    let collectedDrops = await getCollectedDrops(); 

    for (let i = 0; i < collectedDrops.length; i++) {
        const d = collectedDrops[i];
        collectedDrops[i] = d.split(" ")[0].toLowerCase();
    }

    const dropProgesses = await getDropProgresses();

    printStatus("Getting drop data.")

    const drops = dom.window.document.getElementsByClassName("drop");
    for (let i = 0; i < drops.length; i++) {
        const drop = drops[i];
        if (drop.parentElement.parentElement.parentElement.classList.contains("general-drops"))
            continue;

        let data = {};

        data["streamURL"] = drop.href;
        data["streamerName"] = drop.getElementsByClassName("streamer-name")[0].innerHTML;
        data["itemName"] = drop.getElementsByClassName("drop-name")[0].innerHTML;
        data["isStreaming"] = drop.classList.contains("is-live");
        data["watchTime"] = drop.getElementsByClassName("drop-time")[0].children[1].innerHTML;

        let progress = 0;
        dropProgesses.forEach(prog => {
            if (data["streamerName"].toLowerCase().includes(prog.dropStreamer))
                progress = prog.progress;
        })
        data["progress"] = progress;

        let isClaimed = false;
        collectedDrops.forEach(d => {
            if (data["streamerName"].toLowerCase().includes(d))
                isClaimed = true;
        })
        data["isClaimed"] = isClaimed || progress == 100;

        response.push(data);
    }

    return response;
}

module.exports = {getDropData}