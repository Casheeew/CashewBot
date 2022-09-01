const { EmbedBuilder } = require('discord.js');

function helpPageEmbed() {
    
        embed = new EmbedBuilder()
        .setColor(0xF8C8DC) // Pastel Pink
        .setAuthor({ name: '叉焼', iconURL: 'https://i.postimg.cc/W3FjFhDt/Red-Bird.jpg'})
        .setDescription('My commands:')
        .addFields(

            { name: '[s', value: 'Search for a Chinese or English word on CC-CEDICT' },

        )
        .setFooter({ text: 'You can click on the reactions below to see more commands', iconURL: 'https://i.postimg.cc/W3FjFhDt/Red-Bird.jpgc' });

        return embed
    }
exports.helpPageEmbed = helpPageEmbed

