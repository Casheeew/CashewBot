/* setup database */
import { Guild, Message } from "discord.js";
import { Sequelize, DataType, Model } from "sequelize-typescript";

const databaseURL = process.env.DB_URL;
if (typeof databaseURL === "undefined") {
  throw new Error("DB_URL is missing from the environment");
}
export const sequelize = new Sequelize(databaseURL);

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection to database has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

export const UserData = sequelize.define("userData", {
  userId: {
    type: DataType.STRING,
    unique: true,
  },
  save1: {
    type: DataType.JSON,
    defaultValue: null,
  },
  save2: {
    type: DataType.JSON,
    defaultValue: null,
  },
  save3: {
    type: DataType.JSON,
    defaultValue: null,
  },
});

export const GuildData = sequelize.define("guildData", {
  guildId: {
    type: DataType.STRING,
    unique: true,
  },
  name: DataType.STRING,
  prefix: {
    type: DataType.STRING,
    defaultValue: "[!]",
    allowNull: false,
  },
});

// Update or create a new SQL model
export async function updateOrCreate(model: any, where: any, newItem: any) {
  const foundItem = await model.findOne({ where });
  if (!foundItem) {
    const item = await model.create(newItem);
    return { item, created: true };
  }
  const item = await model.update(newItem, { where });
  return { item, created: false };
}

// Trim message to get rid of command prefix
export const processMessage = (msg: Message, parseArgs = false) => {
  let index = msg.content.indexOf(" ");
  if (index == -1) {
    return {
      value: false,
    };
  }
  if (parseArgs) {
    let args = msg.content.split(" ");
    const prefix = args.shift();

    return {
      value: args,
      prefix,
    };
  }
  return {
    value: msg.content.slice(index + 1),
  };
};

export const getPrefixes = async function (guild: Guild) {
  let prefix: string;
  const guildData = await GuildData.findOne({ where: { guildId: guild.id } });
  if (guildData) {
    prefix = await guildData.get("prefix") as string;
  } else {
    prefix = JSON.stringify(["!"]);
  }
  return prefix;
};
