const { Cursor } = require('ansi');
const center_align = require('center-align');
const chalk = require('chalk');
const { write } = require('./logger');
const ansi = require('ansi')
	, cursor = ansi(process.stdout);

// TODO: fix
function exitHandler(options, exitCode) {
    // write(chalk.redBright(center_align("Exiting", process.stdout.columns)));
    cursor.reset();
    cursor.show();
    write(chalk.redBright(center_align("Exiting", process.stdout.columns)));
    if (global.driver)
        global.driver.quit();

    process.exit();
}


process.on('exit', exitHandler.bind(null,{cleanup:true}));
process.on('SIGINT', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

process.stdin.setRawMode(true);
process.stdin.setEncoding('utf8');
process.stdin.on('data', key => {
	if (key == "e" || key == '\u001B') /*exitHandler({cleanup:true})*/process.exit();
})
