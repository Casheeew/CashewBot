// const chineseLexicon = require('chinese-lexicon');
import { EmbedBuilder } from 'discord.js';
import { CEDICT } from 'database';
import { DictionaryEntry } from '../common/types';
import { Op } from 'sequelize';

export const isAlpha = (str: string) => /^[a-zA-Z]+$/.test(str);

function isWholeWordMatch(searchOnString: string, searchText: string) {
    if (!searchOnString) return false;
    searchText = searchText.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    return searchOnString.match(new RegExp("\\b" + searchText + "\\b", "i")) != null;
}

function isSubstringMatch(text: string, term: string) {
    if (!text) return false;
    return text.includes(term);
}

async function search(term: string, limit = 100) {
    term = term.toLowerCase();

    console.log(`\\b${term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&').trim()}\\b`);

    const beforeFindAll = performance.now();
    const matchingEntries: any = await CEDICT.findAll({
        where: {
            [Op.or]: [
                {
                    glossary: {
                        [Op.iRegexp]: `${term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&').trim()}`,
                    }
                },
                {
                    simp: {
                        [Op.iLike]: `${term}%`,
                    }
                },
                {
                    trad: {
                        [Op.iLike]: `${term}%`,
                    }
                },
                {
                    pinyinTones: {
                        [Op.iLike]: `${term}%`,
                    }
                },
                {
                    pinyin: {
                        [Op.iLike]: `${term}%`
                    }
                },
            ]
        }
    })
    const afterFindAll = performance.now();
    console.log(`findAll: ${afterFindAll - beforeFindAll}`);

    return matchingEntries
        .map((entry: DictionaryEntry) => {
            let { definitions, simp, trad, searchablePinyin, pinyin, pinyinTones } = entry;
            let relevance = 1;
            let definitionsCount = definitions.length;
            for (let i = 0; i < definitionsCount; i++) {
                let definition = definitions[i];
                if (isWholeWordMatch(definition, term)) {
                    relevance += 10 / (i + 1);
                }
                if (isSubstringMatch(definition, term)) {
                    relevance += 1 / (i + 1);
                }
            }
            if (isWholeWordMatch(simp, term) || isWholeWordMatch(trad, term) || isWholeWordMatch(searchablePinyin, term) || isWholeWordMatch(pinyinTones, term) || isWholeWordMatch(pinyin.toLowerCase(), term)) {
                relevance += 10;
            }
            entry.relevance = relevance;
            return entry;
        })
        .sort((a: DictionaryEntry, b: DictionaryEntry) => {
            if (a.relevance === undefined || b.relevance === undefined) throw new Error('relevance is undefined');
            return (b.boost * b.relevance) - (a.boost * a.relevance)
        })
        .slice(0, limit);
}

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

    const beforeSearch = performance.now();
    const wordInfo = await search(message);
    const afterSearch = performance.now();

    console.log(`Call to search took ${afterSearch - beforeSearch}ms.`)

    // // If the searched word is alphabetical, search the matching chinese entries
    // if (isAlpha(message)) {
    //     // wordInfo = await search(message);
    //     wordInfo = await search(message);
    // } else {
    //     wordInfo = await getEntries(message);
    // }

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