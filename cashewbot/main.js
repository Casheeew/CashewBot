const { Client, GatewayIntentBits, Partials, channelLink } = require('discord.js');
const { switchBetweenCommands } = require('../cashewbot/commandsManager.js');
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
	console.log(`Ready! Logged in as ${c.user.tag} `);
});

// Login to Discord with your client's token
client.login(process.env.botToken);