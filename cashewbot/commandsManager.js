const mandarinSearch = require('./commands/mandarinSearch.js');
const kyujitai = require('./commands/kyujitai.js');
const { helpPage } = require('./commands/help.js');
const { aboutPage } = require('./commands/about.js');
const Sequelize = require('sequelize');
const { Guild, EmbedBuilder } = require('discord.js');


const sequelize = new Sequelize('database', 'user', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  storage: 'database.sqlite',
}) // Connection information

const UserData = sequelize.define('userData', {
  userId: {
    type: Sequelize.STRING,
    unique: true,
  },
});

const GuildData = sequelize.define('guildData', {
  guildId: {
    type: Sequelize.STRING,
    unique: true,
  },
  name: Sequelize.STRING,
  prefix: {
    type: Sequelize.STRING,
    defaultValue: '!',
    allowNull: false,
  },
});

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

async function updateOrCreate (model, where, newItem) {
  // First try to find the record
 const foundItem = await model.findOne({where});
 if (!foundItem) {
      // Item not found, create a new one
      const item = await model.create(newItem)
      return  {item, created: true};
  }
  // Found an item, update it
  const item = await model.update(newItem, {where});
  return {item, created: false};
}

// Database
const prefixHandler = async function(msg, oldPrefix) {
  prefix = getContent(msg);
  embed = new EmbedBuilder()
    .setColor(0xF8C8DC) // Pastel Pink
    .setAuthor({ name: '叉焼', iconURL: 'https://i.postimg.cc/W3FjFhDt/Red-Bird.jpg'})

  if (!prefix) {
    embed.setTitle('Set Prefix')
         .setDescription(`Say **${await oldPrefix}prefix**, followed by a prefix or a list of prefixes, seperated by a space to change the prefix for this server! (requires admin priviledges)\n\nexample: ${oldPrefix}prefix ? c!    (default: !)`);
   
    return {embeds: [embed]};
  };

  embed.setTitle('Prefix')
       .setDescription(`Changed Prefix!`);
  updateOrCreate(GuildData, { guildId: msg.guild.id }, { guildId: msg.guild.id, name: msg.guild.name, prefix: prefix });
  return {embeds: [embed]};
}

const prefixCommand = new Command('prefix', async msg => {
  const guildData = await GuildData.findOne({ where: { guildId: msg.guild.id } });
  if (guildData) {
    oldPrefix = await guildData.get('prefix');
  } else {
    oldPrefix = '!';
  }
  msg.channel.send(await prefixHandler(msg, oldPrefix));
});
// ToDo: move search function into its own file
const searchCommand = new Command('search', async msg => {
  var pageIdx = 0
  var searchResult = await mandarinSearch.search(getContent(msg), pageIdx)
  var result = await msg.channel.send({embeds: [await searchResult.embed]});
  
  if (searchResult.help) return;
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
    
    result.react(openBook.id)
    .then(() => result.react(arrowLeft.id))
  .then(() => result.react(arrowRight.id))
  .catch((error) => console.error('One of the emojis failed to react:', error));
  
  const filter = (reaction, user) => {
    return [openBook.name, arrowLeft.name, arrowRight.name].includes(reaction.emoji.name) && user.id === msg.author.id;
  }

  const collector = result.createReactionCollector({filter, idle: 180000, dispose: true});
  collector.on('collect', async (reaction, user) => {
    switchBetweeenReactions(reaction);
  });
  collector.on('remove', async (reaction, user) => {
    switchBetweeenReactions(reaction);
  });
});
const kyujiCommand = new Command('kyuji', async msg => {
  kyujitai.convertKyujitaiShinjitai(getContent(msg), converted => msg.channel.send(converted))
});
const helpCommand = new Command('help', async msg => await msg.channel.send({embeds: [helpPage]}));
const aboutCommand = new Command('about', async msg => await msg.channel.send({embeds: [aboutPage]}));

const commands = {
  's': searchCommand.run,
  'search': searchCommand.run,
  'k': kyujiCommand.run,
  'kyuji': kyujiCommand.run,
  'h': helpCommand.run,
  'help': helpCommand.run, 
  'about': aboutCommand.run,
  'prefix': prefixCommand.run,
};

const switchBetweenCommands = async msg => {

  const guildData = await GuildData.findOne({ where: { guildId: msg.guild.id } });
  try{
    var prefixList = await guildData.get('prefix').split(' ');
  } 
  catch (e) {
    if (e instanceof TypeError) {
      var prefixList = ['!'];
    } else { console.error(e); };
  }; // If guildData is uninitialized, set default prefix '!'

  for (const cmdname in commands) {
    for (const prefix of prefixList) {
      if (msg.content.split(' ')[0] == `${await prefix}${cmdname}`) {
        return await commands[cmdname](msg);
      }
    }
  }
};

exports.switchBetweenCommands = switchBetweenCommands
exports.UserData = UserData
exports.GuildData = GuildData
// 0x70FA70 Grassy Green