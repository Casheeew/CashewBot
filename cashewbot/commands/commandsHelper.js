/* setup SQLite */
const Sequelize = require('sequelize');
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


// Update or create a new SQL model
async function updateOrCreate (model, where, newItem) {
   const foundItem = await model.findOne({where});
   if (!foundItem) {
        const item = await model.create(newItem)
        return  {item, created: true};
    }
    const item = await model.update(newItem, {where});
    return {item, created: false};
};

// Trim message to get rid of command prefix
const processMessage = (msg, parseArgs=false) => {
    index = msg.content.indexOf(' ');
    if (index == -1) {
      return {
        value: false,
      };
    };
    if (parseArgs) {
      return {
        value: msg.content.split(' ').shift(),
      };
    };
    return { 
      value: msg.content.slice(index+1),
    };
}; 

const getPrefixes = async function(guild) {
  const guildData = await GuildData.findOne({ where: { guildId: guild.id } });
  if (await guildData) {
      prefix = await guildData.get('prefix');
    } else {
      prefix = '!';
  }
  return prefix;
}
module.exports = {
  UserData,
  GuildData,
  updateOrCreate,
  processMessage,
  getPrefixes,
}