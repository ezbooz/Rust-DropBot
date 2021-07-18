const chalk = require('chalk');
const ansi = require('ansi')
	, cursor = ansi(process.stdout);

const center = require('center-align');
const progress = require('progress-string');

require('./exit')

const watermark =   ["██████╗ ██████╗  ██████╗ ██████╗ ██████╗  ██████╗ ████████╗"
                    ,"██╔══██╗██╔══██╗██╔═══██╗██╔══██╗██╔══██╗██╔═══██╗╚══██╔══╝"
                    ,"██║  ██║██████╔╝██║   ██║██████╔╝██████╔╝██║   ██║   ██║   "
                    ,"██║  ██║██╔══██╗██║   ██║██╔═══╝ ██╔══██╗██║   ██║   ██║   "
                    ,"██████╔╝██║  ██║╚██████╔╝██║     ██████╔╝╚██████╔╝   ██║   "
                    ,"╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═════╝  ╚═════╝    ╚═╝   "];


process.stdout.on('resize',() => {
    clearConsole();
    printWatermark();
    if (global.lastDropData != null)
    {
        updateTargetDrop();
        printDrops();
    }
    printStatus();

    cursor.hide()
})

function stripAnsi(str) {
    return str.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, "");
}
function printWatermark() {
    cursor.goto(0,0);
    setConsoleTitle("DropBot")
    clearConsole();
    watermark.forEach(line => {
        // write(chalk.magenta(line.padStart((process.stdout.columns/2)+line.length/2)))
        write(chalk.magenta(center(line, process.stdout.columns)))
    })
    cursor.hide()
}
let lastStatus = "";
function printStatus(text = lastStatus) {
    lastStatus = text;
    cursor.goto(0, watermark.length+2)
    cursor.eraseLine();
    cursor.write(chalk.gray(center(text, process.stdout.columns)));
}
function updateTargetDrop() {
    const linea = `${chalk.whiteBright()}Watching ${chalk.magentaBright(global.targetDrop.streamerName)}${chalk.whiteBright()} for ${chalk.cyanBright(global.targetDrop.itemName)}`
    const lineb = `${chalk.whiteBright()}${(global.targetDrop.progress)}% of ${global.targetDrop.watchTime}.`

    const lineaStripped = stripAnsi(linea); 
    const linebStripped = stripAnsi(lineb); 

    const remainingWidth = process.stdout.columns-(lineaStripped.length+linebStripped.length+4)

    const bar = progress({
        width: remainingWidth,
        total: 100,
        incomplete: " ",
        style: function (complete, incomplete) {
            return "[" + complete + incomplete + "]"
        }
    })

    cursor.goto(0,process.stdout.rows);
    cursor.write(`${linea} ${bar(global.targetDrop.progress)} ${lineb}`)
    cursor.hide()
}
function printDrops() {
    let drops = global.lastDropData;
    for (let i = 0; i < drops.length; i++) {
        const drop = drops[i];
        cursor.goto(0,i + watermark.length + 4);
        cursor.eraseLine();
        const line = `${chalk.whiteBright(drop.streamerName)} | ${chalk.cyanBright(drop.itemName)} | ${drop.isClaimed ? chalk.greenBright("Claimed") : chalk.redBright("Unclaimed")} | ${drop.isStreaming ? chalk.greenBright("Online") : chalk.redBright("Offline")} | ${chalk.whiteBright(`${drop.progress}% of ${drop.watchTime}`)}`;
        const strippedLine = stripAnsi(line);
        write(line.padStart(((process.stdout.columns/2)+strippedLine.length/2)+line.length - strippedLine.length));
    }
    cursor.hide()
}
function write(msg,newline = true) {
    cursor.write(msg+ (newline ?  "\n" : ""))
    cursor.hide()
}
function clearConsole() {
    write("\x1Bc")
    cursor.hide()
}
function setConsoleTitle(title) {
    process.stdout.write(
        String.fromCharCode(27) + "]0;" + title + String.fromCharCode(7)
    );
    cursor.hide()
}

module.exports = {
    clearConsole,
    updateTargetDrop,
    printWatermark,
    printDrops,
    printStatus,
    write,
}