const { Telegraf } = require("telegraf");
const token = "1709369172:AAHB7-dftVgD_Y2n4FSF-TdZNxusRwTtBNU";
const testGroupId = -1001439368563;
const bot = new Telegraf(token);

const sendCodeMessage = (phone, code) => {
  var text = `Generated message for phone ${phone} and code -> ${code}`;
  bot.telegram.sendMessage(testGroupId, text);
};

bot.launch();
module.exports = {
  sendMessage: sendCodeMessage,
};
