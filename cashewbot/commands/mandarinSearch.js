const mandarinSearch = require('../commandPages/createMandarinSearchPage.js');
const { EmbedBuilder } = require('discord.js');
var prefix = '!'

const search = async function(message, pageIdx) {
    if (!message) {
        embed = new EmbedBuilder()
        .setColor(0x0099FF) // Sky Blue
        .setAuthor({ name: '叉焼', iconURL: 'https://i.postimg.cc/W3FjFhDt/Red-Bird.jpg'})
        .setTitle('Mandarin Search')
        .setDescription(`Say **${prefix}s** or **${prefix}search** to search a Mandarin or English word!\n\nexample: **${prefix}s 蔀**`);

        return {embed, maxPageIdx: -1, help: true};
    };
    result = await mandarinSearch.returnLookUpWordEmbed(message, pageIdx*4)
    return {embed: result.embed, maxPageIdx: Math.floor(result.entriesCount / 4), help: false}; // Each page has max. 4 entries
};
exports.search = search;