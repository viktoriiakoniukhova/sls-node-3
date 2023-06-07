const { program } = require("commander");
const fs = require("fs");

const TelegramBot = require("node-telegram-bot-api");

//BOT setup

const token = process.env.BOT_TOKEN;

const bot = new TelegramBot(token, { polling: true });

bot.on("polling_error", (error) => {
  console.log("Polling error:", error);
});

//Commander setup
program.version("1.0.0").description("CLI notepad in telegram");

program
  .command("start")
  .alias("s")
  .description("Start notepad")
  .action(() => {
    console.log('Send "/start" in chat with bot');

    bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id;
      fs.writeFile("keeper_id.txt", chatId.toString(), (err) => {
        if (err) throw err;
        console.log("Id записано!");
        process.exit();
      });
    });
  });

program
  .command("message <message>")
  .alias("m")
  .description("Send message to telegram bot")
  .action((message) => {
    fs.stat("keeper_id.txt", (err) => {
      if (err) {
        if (err.code === "ENOENT") {
          console.log("Use start (s) command to be able to make notes");
          process.exit();
        } else {
          console.error("Error checking file existence:", err);
        }
      } else sendMessage(message);
    });
  });

program
  .command("photo <pathToFile>")
  .alias("p")
  .description("Send photo to telegram bot")
  .action((pathToFile) => {
    fs.stat("keeper_id.txt", (err) => {
      if (err) {
        if (err.code === "ENOENT") {
          console.log("Use start (s) command to be able to make notes");
          process.exit();
        } else {
          console.error("Error checking file existence:", err);
        }
      } else sendPhoto(pathToFile);
    });
  });

program.parse(process.argv);

function sendMessage(str) {
  fs.readFile("keeper_id.txt", "utf-8", (err, data) => {
    if (err) throw err;
    bot.sendMessage(data, str).then(() => {
      console.log("Message was succesfully sent");
      process.exit();
    });
  });
}

function sendPhoto(path) {
  fs.readFile("keeper_id.txt", "utf-8", (err, data) => {
    if (err) throw err;
    bot.sendPhoto(data, path, {}, { contentType: "image/png" }).then(() => {
      console.log("Photo was succesfully sent");
      process.exit();
    });
  });
}
