const mandarinSearch = require('../commandPages/createMandarinSearchPage.js');
const { EmbedBuilder } = require('discord.js');
var prefix = '!'

const search = async function(message) {
    if (!message) {
        embed = new EmbedBuilder()
        .setColor(0x0099FF) // Sky Blue
        .setAuthor({ name: '叉焼', iconURL: 'https://i.postimg.cc/W3FjFhDt/Red-Bird.jpg'})
        .setTitle('Mandarin Search')
        .setDescription(`Say **${prefix}s** or **${prefix}search** to search a Mandarin or English word!\n\nexample: **${prefix}s 蔀**`);

        return embed;
    };

    return await mandarinSearch.returnLookUpWordEmbed(message);
};
exports.search = search;