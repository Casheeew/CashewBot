// Require the necessary discord.js classes
const { Client, GatewayIntentBits, Partials, channelLink } = require('discord.js');
const { token } = require('./config.json');

const mandarinSearch = require('./commands/mandarinSearch.js')
const kyujitai = require('./commands/kyujitai.js');
const returnHelpPage = require('./commands/help.js');

// Create a new client instance
const client = new Client({

    intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.Reaction
    ]

});

const switchBetweenCommands = function(message) {
    messageContent = message.content.substring(3)
    switch(message.content.substring(0, 3)) {
        case '[s ':
            message.channel.send({embeds: [mandarinSearch.search(messageContent)]});
            break;

        case '[k ':
            kyujitai.convertKyujitaiShinjitai(messageContent, (str) => message.channel.send(str));
            break;

        case '[h ':
            message.channel.send({embeds: [returnHelpPage.returnHelpPage()]})
            break;
            
        }
    }
    

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
client.login(token);
