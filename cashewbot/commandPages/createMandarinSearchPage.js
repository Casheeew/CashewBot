const chineseLexicon = require('chinese-lexicon')
const { EmbedBuilder } = require('discord.js');

const haveSameData = function(obj1, obj2) {
        const obj1Length = Object.keys(obj1).length;
        const obj2Length = Object.keys(obj2).length;
  
        if(obj1Length === obj2Length) {
            return Object.keys(obj1).every(
                key => obj2.hasOwnProperty(key)
                   && obj2[key] === obj1[key]);
        }
        return false;
    }

const removeDuplicate = function(array) {
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array.length; j++) {
            if (i !== j) {
                if (haveSameData(array[i], array[j])) {
                    array.splice(j, 1)
                }
            }
        }
    }
    return array;
}
function isAlpha(str) {
    return /^[a-zA-Z]+$/.test(str);
  }
const wordSearchEmbed = new EmbedBuilder()
	.setColor(0x0099FF) //Sky Blue
	.setFooter({ text: 'You can click the reactions below to see more information!', iconURL: 'https://i.postimg.cc/W3FjFhDt/Red-Bird.jpg' });

const returnLookUpWordEmbed = async function(message) {

    const embed = new EmbedBuilder(wordSearchEmbed.data);
    embed.setTitle(`Search results for "${message}"`);

    // If the searched word is alphabetical, search the matching chinese entries
    if (isAlpha(message)) {
        var wordInfo = await chineseLexicon.search(message)
    }
    else {
        var wordInfo = await chineseLexicon.getEntries(message)
    }

    for (let i = 0; i < Math.min(wordInfo.length, 4); i++) {

        var simplified = wordInfo[i].simp
        var traditional = wordInfo[i].trad
        var definitions = wordInfo[i].definitions
        var pinyin = wordInfo[i].pinyin
        var statistics = wordInfo[i].statistics

        embed.addFields(
            {name: `${simplified} | ${traditional}`, value: `\`Hsk Level: ${statistics.HskLevel}\`\n(${pinyin}) *${definitions.join(', ')}*`},
        )

    }
    return embed
}

exports.returnLookUpWordEmbed = returnLookUpWordEmbed