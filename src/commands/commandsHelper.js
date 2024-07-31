/* setup database */
import { Sequelize } from "sequelize";
export const sequelize = new Sequelize(process.env.DB_URL);

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection to database has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

export const UserData = sequelize.define('userData', {
  userId: {
    type: Sequelize.STRING,
    unique: true,
  },
  save1: {
    type: Sequelize.JSON,
    defaultValue: null,
  },
  save2: {
    type: Sequelize.JSON,
    defaultValue: null,
  },
  save3: {
    type: Sequelize.JSON,
    defaultValue: null,
  }
});

export const GuildData = sequelize.define('guildData', {
  guildId: {
    type: Sequelize.STRING,
    unique: true,
  },
  name: Sequelize.STRING,
  prefix: {
    type: Sequelize.STRING,
    defaultValue: '[!]',
    allowNull: false,
  },
});

// Update or create a new SQL model
export async function updateOrCreate(model, where, newItem) {
  const foundItem = await model.findOne({ where });
  if (!foundItem) {
    const item = await model.create(newItem)
    return { item, created: true };
  }
  const item = await model.update(newItem, { where });
  return { item, created: false };
};

// Trim message to get rid of command prefix
export const processMessage = (msg, parseArgs=false) => {
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

export const getPrefixes = async function (guild) {
  let prefix;
  const guildData = await GuildData.findOne({ where: { guildId: guild.id } });
  if (guildData) {
    prefix = await guildData.get('prefix');
  } else {
    prefix = JSON.stringify(['!']);
  }
  return prefix;
}

