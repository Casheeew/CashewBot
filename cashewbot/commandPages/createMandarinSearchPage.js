const chineseLexicon = require('chinese-lexicon')
const { EmbedBuilder } = require('discord.js');

function isAlpha(str) {
    return /^[a-zA-Z]+$/.test(str);
  }
const wordSearchEmbed = new EmbedBuilder()
	.setColor(0x0099FF) //Sky Blue
    
const returnLookUpWordEmbed = async function(message) {
    
    const embed = new EmbedBuilder(wordSearchEmbed.data);
    
    // If the searched word is alphabetical, search the matching chinese entries
    if (isAlpha(message)) {
        var wordInfo = await chineseLexicon.search(message)
    }
    else {
        var wordInfo = await chineseLexicon.getEntries(message)
    }
    
    const isEmpty = obj => Object.keys(obj).length===0;
    
    if (isEmpty(wordInfo)) {
        embed.setTitle(`Search`)
        embed.setDescription(`I couldn\'t find any results for **${message}**`)
        return embed
    }
    
    embed.setTitle(`Search results for "${message}"`)
         .setFooter({ text: 'You can click the reactions below to see more information!', iconURL: 'https://i.postimg.cc/W3FjFhDt/Red-Bird.jpg' });
    
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