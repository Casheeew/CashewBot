/* setup database */
const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.Database || 'postgres', process.env.DBUser || 'postgres', process.env.postgresPassword, {
  host: process.env.Host || 'localhost',
  logging: false,
  dialect: 'postgres',
  dialectOptions: {
    // ssl: {
    //   require: false, // true on heroku
    //   rejectUnauthorized: false
    // }
  }
})

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection to database has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

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
async function updateOrCreate(model, where, newItem) {
  const foundItem = await model.findOne({ where });
  if (!foundItem) {
    const item = await model.create(newItem)
    return { item, created: true };
  }
  const item = await model.update(newItem, { where });
  return { item, created: false };
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
    let args = msg.content.split(' ');
    prefix = args.shift();

    return {
      value: args,
      prefix,
    };
  };
  return {
    value: msg.content.slice(index + 1),
    prefix,
  };
};

const getPrefixes = async function (guild) {
  const guildData = await GuildData.findOne({ where: { guildId: guild.id } });
  if (await guildData) {
    prefix = await guildData.get('prefix');
  } else {
    prefix = ['!'];
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