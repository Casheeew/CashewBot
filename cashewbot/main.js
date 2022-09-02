// Require the necessary discord.js classes
const { Client, GatewayIntentBits, Partials, channelLink } = require('discord.js');
const mandarinSearch = require('./commands/mandarinSearch.js');
const kyujitai = require('./commands/kyujitai.js');
const { helpPage } = require('./commands/help.js');
const { aboutPage } = require('./commands/about.js');

// Create a new client instance
const client = new Client({

    intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.Reaction,
    ]

});

class Command {
    constructor(name, run) {
        this.name = name,
        this.run = run
    }
}

const getContent = msg => msg.content.slice(msg.content.indexOf(' ')+1)

const searchCommand = new Command('search', async msg => {
    msg.channel.send({embeds: [await mandarinSearch.search(getContent(msg))]})
})
const kyujiCommand = new Command('kyuji', async msg => {
    kyujitai.convertKyujitaiShinjitai(getContent(msg), str => msg.channel.send(str))
})
const helpCommand = new Command('help', async msg => msg.channel.send({embeds: [helpPage]}))
const aboutCommand = new Command('about', async msg => msg.channel.send({embeds: [aboutPage]}))

const commands = {
    's': searchCommand.run,
    'search': searchCommand.run,
    'k': kyujiCommand.run,
    'kyuji': kyujiCommand.run,
    'h': helpCommand.run,
    'help': helpCommand.run, 
    'about': aboutCommand.run,
  };
  
  const switchBetweenCommands = async msg => {
    for (const cmdname in commands) {
      if (msg.content.startsWith(`!${cmdname}`)) {
        return await commands[cmdname](msg);
      }
    }
  };
  
client.on("messageCreate", message => {

    if (message.partial) {

	message.fetch()
		.then(fullMessage => {
            switchBetweenCommands(fullMessage)
		})
		.catch(error => {
			console.log('Something went wrong when fetching the message: ', error);
		});

} else {
    switchBetweenCommands(message)
}})

// When the client is ready, run this code (only once)
client.once('ready', c => {
	console.log(`Ready! Logged in as ${c.user.tag} `);
})

// Login to Discord with your client's token
client.login(process.env.botToken);