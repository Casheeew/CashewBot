// const chineseLexicon = require('chinese-lexicon');
import { EmbedBuilder } from 'discord.js';
const chineseLexicon = require('chinese-lexicon');

export const isAlpha = (str: string) => /^[a-zA-Z]+$/.test(str);

class Word {
    data: any;

    constructor(data: any) {
        this.data = data;
    }

    get simp() { return this.data.simp };
    get trad() { return this.data.trad };
    get definitions() { return this.data.definitions };
    get pinyin() { return this.data.pinyin };
    get stats() { return this.data.statistics };

}

const returnLookUpWordEmbed = async function (message: string, startIdx: number) {

    const embed = new EmbedBuilder().setColor(0x0099FF); // Sky Blue
    let wordInfo;

    // If the searched word is alphabetical, search the matching chinese entries
    if (isAlpha(message)) {
        wordInfo = await chineseLexicon.search(message);
    } else {
        wordInfo = await chineseLexicon.getEntries(message);
    }

    // todo
    // const wordInfo = ['hi'];
    const entriesCount = wordInfo.length;
    if (entriesCount === 0) {
        embed.setTitle(`Search`);
        embed.setDescription(`I couldn\'t find any results for **${message}**`);
        return { embed, entriesCount };
    }

    for (let i = startIdx; i < Math.min(wordInfo.length, startIdx + 4); i++) {
        const word = new Word(wordInfo[i]);
        embed.addFields({
            name: `${word.simp} | ${word.trad}`,
            value: `\`HSK Level: ${word.stats.hskLevel}\`\n(${word.pinyin}) *${word.definitions.join(', ')}*`
        })
    }; //toDo: Change this to send all page embeds


    embed.setTitle(`Search results for "${message}"`)
        .setFooter({
            text: 'You can tap the reactions below to see more information!',
            iconURL: 'https://i.postimg.cc/W3FjFhDt/Red-Bird.jpg'
        });
    return { embed, entriesCount };
}

export default returnLookUpWordEmbed;