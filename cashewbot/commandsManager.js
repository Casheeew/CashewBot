const Sequelize = require('sequelize');

const { mandarinSearch }  = require('./commands/mandarinSearch.js');
const { convertKyujitaiShinjitai } = require('./commands/kyujitai.js');
const { helpPage } = require('./commands/help.js');
const { aboutPage } = require('./commands/about.js');
const { prefixHandler } = require('./commands/prefix.js')
const { getContent } = require('./commands/commandsHelper.js')

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

const prefixCommand = new Command('prefix', async msg => prefixHandler(msg, GuildData));
const searchCommand = new Command('search', async msg => mandarinSearch(msg));
const kyujiCommand = new Command('kyuji', async msg => convertKyujitaiShinjitai(msg));
const helpCommand = new Command('help', async msg => helpPage(msg));
const aboutCommand = new Command('about', async msg => aboutPage(msg));

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