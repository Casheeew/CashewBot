import { Sequelize, DataType } from "sequelize-typescript";

const databaseURL = process.env.DB_URL;
if (typeof databaseURL === "undefined") {
  throw new Error("DB_URL is missing from the environment");
}
export const sequelize = new Sequelize(databaseURL, {
  pool: {
    acquire: 60000,
    idle: 60000,
  }
});

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

// Update or create a new SQL model
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateOrCreate(model: any, where: any, newItem: any) {
  const foundItem = await model.findOne({ where });
  if (foundItem === null) {
    const item = await model.create(newItem);
    return { item, created: true };
  }
  const item = await model.update(newItem, { where });
  return { item, created: false };
}
