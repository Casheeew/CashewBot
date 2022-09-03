const mandarinSearch = require('./commands/mandarinSearch.js');
const kyujitai = require('./commands/kyujitai.js');
const { helpPage } = require('./commands/help.js');
const { aboutPage } = require('./commands/about.js');
const { search } = require('chinese-lexicon');

class Command {
  constructor(name, run) {
      this.name = name,
      this.run = run
  };
};

class ReactionCommand {
  constructor(name, id) {
    this.name = name;
    this.id = id;
  };
};

const openBook = new ReactionCommand('OpenBook', '1015246188359979108')
const arrowLeft = new ReactionCommand('LeftArrow', '1015443770113806491')
const arrowRight = new ReactionCommand('RightArrow', '1015443768012455976')

// Trim message to get rid of the prefix
const getContent = msg => {
  index = msg.content.indexOf(' ');
  if (index == -1) {
    return false;
  };
  return msg.content.slice(index+1);
}; 
const searchCommand = new Command('search', async msg => {
  var pageIdx = 0
  var searchResult = await mandarinSearch.search(getContent(msg), pageIdx)
  var result = await msg.channel.send({embeds: [await searchResult.embed]});
  result.react(openBook.id)
  .then(() => result.react(arrowLeft.id))
  .then(() => result.react(arrowRight.id))
  .catch((error) => console.error('One of the emojis failed to react:', error));
  
  const filter = (reaction, user) => {
    return [openBook.name, arrowLeft.name, arrowRight.name].includes(reaction.emoji.name) && user.id === msg.author.id;
  }
  const collector = result.createReactionCollector({filter, idle: 180000, dispose: true});
  const switchBetweeenReactions = async function(reaction) {
    switch (reaction.emoji.name) {
      case openBook.name:
        break;
      case arrowLeft.name:
        if (pageIdx > 0) pageIdx -= 1;
        searchResult = await mandarinSearch.search(getContent(msg), pageIdx);
        result.edit({embeds: [await searchResult.embed]});
        break;
      case arrowRight.name:
        if (pageIdx < searchResult.maxPageIdx) pageIdx += 1;
        searchResult = await mandarinSearch.search(getContent(msg), pageIdx);
        result.edit({embeds: [await searchResult.embed]});
        break;
    };
  }
  collector.on('collect', async (reaction, user) => {
    switchBetweeenReactions(reaction);
  });
  collector.on('remove', async (reaction, user) => {
    switchBetweeenReactions(reaction);
  });
});
const kyujiCommand = new Command('kyuji', async msg => {kyujitai.convertKyujitaiShinjitai(getContent(msg), converted => msg.channel.send(converted))})
const helpCommand = new Command('help', async msg => await msg.channel.send({embeds: [helpPage]}))
const aboutCommand = new Command('about', async msg => await msg.channel.send({embeds: [aboutPage]}))

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
    if (msg.content.split(' ')[0] == `${prefix}${cmdname}`) {
      return await commands[cmdname](msg);
    }
  }
};

exports.switchBetweenCommands = switchBetweenCommands
// 0x70FA70 Grassy Green