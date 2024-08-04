import "dotenv/config";
import { Client, GatewayIntentBits, Partials } from "discord.js";
import executeCommand from "./commands";
import { sequelize } from "./database";
import express from "express";
import fs from 'fs';
import path from 'path';

/* Init CashewBot */

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  executeCommand(message);
});

// When the client is ready, run this code (only once)
client.once("ready", async (c) => {
  await sequelize.sync();
  console.log(`Logged in as ${c.user.tag}!`);

  // async function loadJSONtoDB(filePath: string) {
  //   const entries = JSON.parse(fs.readFileSync(filePath, "utf-8"))
  //   await CEDICT.bulkCreate(entries);
  // }

  // async function loadJSONtoDB(filePath: string) {
  //   const pipeline = chain([
  //     fs.createReadStream(filePath),
  //     StreamArray.withParser(),
  //   ]);


  //   console.log('Loading to Database...');

  //   pipeline.on('data', async (data) => {
  //     const entry: DictionaryEntry = data.value;
  //     updateOrCreate(
  //       CEDICT,
  //       {
  //         simp: entry.simp,
  //         trad: entry.trad,
  //         definitions: entry.definitions,
  //       },
  //       entry
  //     )
  //     pipeline.pause();
  //     setTimeout(() => pipeline.resume(), 10);
  //   });

  // }

  // const dictionaryDir = path.join('src', 'assets', 'dictionaries', 'CC-CEDICT');

  // loadJSONtoDB(path.join(dictionaryDir, 'entries.json'));

});

// Login to Discord with your client's token
client.login(process.env.BOT_TOKEN);

/* Init CashewBot Web */
const app = express();
const port = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
