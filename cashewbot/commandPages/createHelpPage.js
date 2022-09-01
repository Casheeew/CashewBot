const { EmbedBuilder } = require('discord.js');

function helpPageEmbed() {
    
        embed = new EmbedBuilder()
        .setColor(0xF8C8DC) // Pastel Pink
        .setAuthor({ name: '叉焼', iconURL: 'https://i.postimg.cc/W3FjFhDt/Red-Bird.jpg'})
        .setDescription('My commands:')
        .addFields(

            { name: '[search (alias: [s)', value: 'Search for a Chinese or English word on CC-CEDICT' },
            { name: '[kyuji (alias: [k)', value: 'Convert a Japanese sentence from [Shinjitai](https://en.wikipedia.org/wiki/Shinjitai)(新字体) to [Kyujitai](https://en.wikipedia.org/wiki/Ky%C5%ABjitai)(旧字体) and vice versa'},
            { name: '[help (alias: [h)', value: 'How did I get here?' },

        )
        .setFooter({ text: 'You can click on the reactions below to see more commands', iconURL: 'https://i.postimg.cc/W3FjFhDt/Red-Bird.jpgc' });

        return embed
    }
exports.helpPageEmbed = helpPageEmbed

