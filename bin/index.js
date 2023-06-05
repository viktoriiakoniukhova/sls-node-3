#!usr/bin/env mode
process.env["NTBA_FIX_350"] = 1;

const { program } = require("commander");
const TelegramBot = require("node-telegram-bot-api");

//BOT setup

const token = process.env.BOT_TOKEN;
const chatId = process.env.CHAT_ID;

const bot = new TelegramBot(token, { polling: true });

//Commander setup
program.version("1.0.0").description("CLI notepad in telegram");

program
  .command("message <message>")
  .alias("m")
  .description("Send message to telegram bot")
  .action((message) => {
    console.log("Send message command called");
    sendMessage(message);
  });

program
  .command("photo <pathToFile>")
  .alias("p")
  .description("Send photo to telegram bot")
  .action((pathToFile) => {
    console.log("Send photo command called");
    sendPhoto(pathToFile);
  });

program.parse(process.argv);

async function sendMessage(str) {
  await bot.sendMessage(chatId, str);
  process.exit();
}

async function sendPhoto(path) {
  await bot.sendPhoto(chatId, path, {}, { contentType: "image/png" });
  process.exit();
}
