const tokenize = require('chinese-tokenizer').loadFile('./assets/cedict_ts.u8')
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
    return array
}
        
const wordSearchEmbed = new EmbedBuilder()
	.setColor(0x0099FF) //Sky Blue
	.setFooter({ text: 'You can click the reactions below to see more information!', iconURL: 'https://i.postimg.cc/W3FjFhDt/Red-Bird.jpg' });

const returnLookUpWordEmbed = function(message) {

    const embed = new EmbedBuilder(wordSearchEmbed.data)
    
    var wordInfo = tokenize(message)[0]

    var simplified = wordInfo.simplified
    var traditional = wordInfo.traditional
    var matches = wordInfo.matches
    matches = removeDuplicate(matches)
         
    embed.setTitle(`Search results for "${message}"`)
    //.setURL
    for (var i in matches) {
        count = parseInt(i) + 1
        embed.addFields(
            {name: `${simplified} | ${traditional}`, value: `${count}. (${matches[i].pinyinPretty}) ${matches[i].english}`},
        )

    }
    return embed
}

exports.returnLookUpWordEmbed = returnLookUpWordEmbed