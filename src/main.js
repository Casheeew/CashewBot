const { Client, GatewayIntentBits, Partials, channelLink } = require('discord.js');
const { switchBetweenCommands } = require('./commandsManager.js');
const { sequelize } = require('./commands/commandsHelper.js')
const dotenv = require('dotenv')
const express = require('express')

dotenv.config()

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
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.Reaction,
    ]
});
  
client.on("messageCreate", message => {
    if (message.author.bot) return;
    
    switchBetweenCommands(message);
});

// When the client is ready, run this code (only once)
client.once('ready', c => {
    sequelize.sync({});
    console.log(`Logged in as ${c.user.tag}!`);
});

// Login to Discord with your client's token
client.login(process.env.BOT_TOKEN);


/* Init CashewBot Web */
const app = express()
const port = process.env.PORT || 4000;

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})