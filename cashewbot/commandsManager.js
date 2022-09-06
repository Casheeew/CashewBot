const { initiateQuiz } = require('./commands/quiz.js')
const { mandarinSearch }  = require('./commands/mandarinSearch.js');
const { convertKyujitaiShinjitai } = require('./commands/kyujitai.js');
const { helpPage } = require('./commands/help.js');
const { aboutPage } = require('./commands/about.js');
const { prefixHandler } = require('./commands/prefix.js');
const { convertAccentedPinyin } = require('./commands/cvpinyin.js')
const { getPrefixes } = require('./commands/commandsHelper.js');

class Command {
  constructor(name, run) {
      this.name = name,
      this.run = run
  };
};

const prefixCommand = new Command('prefix', async (msg, prefix) => prefixHandler(msg, prefix));
const searchCommand = new Command('search', async (msg, prefix) => mandarinSearch(msg, prefix));
const kyujiCommand = new Command('kyuji', async (msg, prefix) => convertKyujitaiShinjitai(msg, prefix));
const quizCommand = new Command('quiz', async (msg, prefix) => initiateQuiz(msg, prefix));
const helpCommand = new Command('help', async (msg, prefix) => helpPage(msg, prefix));
const aboutCommand = new Command('about', async (msg, prefix) => aboutPage(msg));
const convertPinyinCommand = new Command('cvpinyin', async (msg, prefix) => convertAccentedPinyin(msg, prefix));

const commands = {
  's': searchCommand.run,
  'search': searchCommand.run,
  'k': kyujiCommand.run,
  'kyuji': kyujiCommand.run,
  'h': helpCommand.run,
  'help': helpCommand.run, 
  'q': quizCommand.run,
  'quiz': quizCommand.run,
  'about': aboutCommand.run,
  'prefix': prefixCommand.run,
  'cvpinyin': convertPinyinCommand.run,
};

const switchBetweenCommands = async msg => {
  const prefixStr = await getPrefixes(msg.guild);
  const prefixList = await prefixStr.split(' ');

  for (const cmdname in commands) {
    for (const prefix of prefixList) {
      if (msg.content.split(' ')[0] == `${await prefix}${cmdname}`) {
        return await commands[cmdname](msg, prefix);
      }
    }
  }
};

exports.switchBetweenCommands = switchBetweenCommands
// 0x70FA70 Grassy Green