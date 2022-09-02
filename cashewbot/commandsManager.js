const mandarinSearch = require('./commands/mandarinSearch.js');
const kyujitai = require('./commands/kyujitai.js');
const { helpPage } = require('./commands/help.js');
const { aboutPage } = require('./commands/about.js');

class Command {
  constructor(name, run) {
      this.name = name,
      this.run = run
  }
}

const getContent = msg => {
  index = msg.content.indexOf(' ');
  if (index == -1) {
    return false;
  };
  return msg.content.slice(index+1);
}

const searchCommand = new Command('search', async msg => {msg.channel.send({embeds: [await mandarinSearch.search(getContent(msg))]})})
const kyujiCommand = new Command('kyuji', async msg => {kyujitai.convertKyujitaiShinjitai(getContent(msg), converted => msg.channel.send(converted))})
const helpCommand = new Command('help', async msg => msg.channel.send({embeds: [helpPage]}))
const aboutCommand = new Command('about', async msg => msg.channel.send({embeds: [aboutPage]}))

const commands = {
  's': searchCommand.run,
  'search': searchCommand.run,
  'k': kyujiCommand.run,
  'kyuji': kyujiCommand.run,
  'h': helpCommand.run,
  'help': helpCommand.run, 
  'about': aboutCommand.run,
};
  
var prefix = '!' 
const switchBetweenCommands = async msg => {
  for (const cmdname in commands) {
    if (msg.content.startsWith(`${prefix}${cmdname}`)) {
      return await commands[cmdname](msg);
    }
  }
};

exports.switchBetweenCommands = switchBetweenCommands
// 0x70FA70 Grassy Green