const { EmbedBuilder } = require('discord.js');
const support_server_url = process.env.support_server_url;

const aboutPageEmbed = new EmbedBuilder()
    .setColor(0xF8C8DC) // Pastel Pink
    .setAuthor({
        name: '叉焼',
        iconURL: 'https://i.postimg.cc/W3FjFhDt/Red-Bird.jpg'
    })
    .setTitle('About me')
    .setDescription(
        `Make suggestions, report bugs, ask for help here: [Support server](${support_server_url})\n\n**叉焼** uses data from: \n- CC-CEDICT`
    )

exports.aboutPageEmbed = aboutPageEmbed;

