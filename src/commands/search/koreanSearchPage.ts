import { EmbedBuilder } from 'discord.js';
import { KRDICT_EN } from '../../database';
import { KRDICTEntry } from '../common/types';
import { Op } from 'sequelize';

const isAlpha = (str: string) => /.*[a-zA-Z]+.*/.test(str);
// const isPinyin = (str: string) => /.*[ĀāÁáǍǎÀàĒēÉéĚěÈèĪīÍíǏǐÌìŌōÓóǑǒÒòŪūÚúǓǔÙùÜüǗǘǙǚǛǜ«»⸢⸣⸤⸥]+.*/.test(str);
// const isNumbered = (str: string) => /.*[a-zA-Z]+[1-9].*/.test(str);

function processMatches(entries: any[], limit: number): KRDICTEntry[] {
    for (const entry of entries) {
        entry.definitions = entry.definitions.split('\u241D').map((line: string) => line.split('\u241E'));
    }
    return entries
        .slice(0, limit);
}

async function search(term: string, limit = 100) {

    const beforeFindAll = performance.now();
    const matchingEntries: any = await KRDICT_EN.findAll({
        where:
        {
            word: {
                [Op.startsWith]: `${term}`,
            }

        }
    })
    const afterFindAll = performance.now();
    console.log(`findAll: ${afterFindAll - beforeFindAll}`);

    return processMatches(matchingEntries, limit);
}

async function searchEnglish(term: string, limit = 100) {
    term = term.toLowerCase();

    const beforeFindAll = performance.now();
    const matchingEntries: any = await KRDICT_EN.findAll({
        where: {
            definitions: {
                [Op.substring]: `${term}`,
            }
        }
    })
    const afterFindAll = performance.now();
    console.log(`findAll: ${afterFindAll - beforeFindAll}`);

    return processMatches(matchingEntries, limit);
}

const returnLookUpWordEmbed = async function (message: string, startIdx: number) {

    const embed = new EmbedBuilder().setColor(0x0099FF); // Sky Blue

    const beforeSearch = performance.now();
    // const wordInfo = await search(message);
    let wordInfo;
    
    
    // wordInfo = await search(message);
    
    if (isAlpha(message)) {
        wordInfo = await searchEnglish(message);
    } else {
        wordInfo = await search(message);
    }
    const afterSearch = performance.now();
    console.log(`Call to search took ${afterSearch - beforeSearch}ms.`)

    const entriesCount = wordInfo.length;
    if (entriesCount === 0) {
        embed.setTitle(`Search`);
        embed.setDescription(`I couldn\'t find any results for **${message}**`);
        return { embed, entriesCount };
    }

    for (let i = startIdx; i < Math.min(wordInfo.length, startIdx + 4); i++) {
        const word = wordInfo[i];
        embed.addFields({
            name: `${word.word} | ${word.hanja}`,
            value: `${'⭐'.repeat(word.stars)}\n(${word.partOfSpeech}) *${word.definitions.join(', ')}*`
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