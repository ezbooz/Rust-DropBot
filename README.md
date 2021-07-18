# Rust DropBot
Automatically farm rust drops on twitch.

<img src=art/ui.png>

# Installation
You must have the FireFox web browser installed. You can install it [here](https://www.mozilla.org/en-US/firefox/). 

Make sure you have NodeJS LTS installed, if not, download it from [here](https://nodejs.org/en/). If you are not sure whether or not you have NodeJS installed, you can check by opening a terminal and typing `node --version`.

Make sure you have geckodriver.exe placed in your path. If you do not, you can download a copy from [here](https://github.com/mozilla/geckodriver/releases). If you are unsure, open a terminal and type in `geckodriver --version`.

Check that you have git installed, if you don't know, you can check by opening a terminal and typing `git --version`. If you do not have it installed, you can download it [here](https://git-scm.com/download/win).

Now that you have all the required items installed, open a terminal and run
```sh
git clone https://github.com/Waves-rgb/Rust-DropBot.git
cd Rust-DropBot
npm i
```

It should now be installed and ready to run!

# Usage
In order to start the bot, you can either run start.bat, or you can open a terminal and type `node index.js`.

There are two keys to force exit the program. The keys are the Escape key, and the 

# Issues
Although I don't believe this can get your account suspended from twitch, it is not my fault if it does.

The bot does not exit properly (as of v1.0), you may have to Task-kill some of the FireFox tasks that open by the bot.

The bot won't claim items (as of v1.0), you have to manually claim the items [here](https://www.twitch.tv/drops/inventory), and check for new drops [here](https://twitch.facepunch.com/).

The bot can sometimes break (rarely) but you should check on the bot every now and then.

# Related
[TTVDropBot](https://github.com/Zaarrg/TTVDropBot) - This is what inspired me to make this, it was not working at the time because of the way it collects streams. I decided I would make my own version, that automatically scrapes the streams, and looks nicer.