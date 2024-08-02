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

export const CEDICT = sequelize.define("CEDICT", {
  simp: DataType.STRING,
  trad: DataType.STRING,
  definitions: DataType.ARRAY(DataType.TEXT),
  glossary: DataType.TEXT,
  pinyin: DataType.STRING,
  searchablePinyin: DataType.STRING,
  pinyinTones: DataType.STRING,
  statistics: DataType.JSON,
  boost: DataType.DOUBLE,
  usedAsComponentIn: DataType.JSON,
})

export type DictionaryEntry = {
  simp: string;
  trad: string;
  definitions: string[];
  glossary: string;
  pinyin: string;
  searchablePinyin: string;
  pinyinTones: string;
  statistics: {
    hskLevel: number;
    topWords: object[];
    movieWordCount?: number;
    movieWordCountPercent?: number;
    movieWordRank?: number;
    movieWordContexts?: number;
    movieWordContextsPercent?: number;
    bookWordCount?: number;
    bookWordCountPercent?: number;
    bookWordRank?: number;
    movieCharCount?: number;
    movieCharCountPercent?: number;
    movieCharRank?: number;
    movieCharContexts?: number;
    movieCharContextsPercent?: number;
    bookCharCount?: number;
    bookCharCountPercent?: number;
    bookCharRank?: number;
    pinyinFrequency?: number;
  };
  boost: number;
  relevance?: number;
  usedAsComponentIn: object;
};

// Update or create a new SQL model
export async function updateOrCreate(model: any, where: any, newItem: any) {
  const foundItem = await model.findOne({ where });
  if (foundItem === null) {
    const item = await model.create(newItem);
    return { item, created: true };
  }
  const item = await model.update(newItem, { where });
  return { item, created: false };
}

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
