import { EmbedBuilder } from 'discord.js';

const helpPageEmbed = function (displayedPrefix) {

    const embed = new EmbedBuilder()
        .setColor(0xF8C8DC) // Pastel Pink
        .setAuthor({ name: '叉焼', iconURL: 'https://i.postimg.cc/W3FjFhDt/Red-Bird.jpg' })
        .setDescription('My commands:')
        .addFields(
            {
                name: `${displayedPrefix}search (alias: ${displayedPrefix}s)`,
                value: 'Search for a Chinese or English word on CC-CEDICT'
            },
            {
                name: `${displayedPrefix}kyuji (alias: ${displayedPrefix}k)`,
                value: 'Convert a Japanese sentence from [Shinjitai(新字体)](https://en.wikipedia.org/wiki/Shinjitai) to [Kyujitai(旧字体)](https://en.wikipedia.org/wiki/Ky%C5%ABjitai) and back'
            },
            {
                name: `${displayedPrefix}help (alias: ${displayedPrefix}h)`,
                value: 'How did I get here?'
            },
            {
                name: `${displayedPrefix}cvpinyin`,
                value: 'Convert a Japanese sentence from numbered Pinyin to accented Pinyin'
            },
            {
                name: `${displayedPrefix}prefix`,
                value: 'Change my prefix!'
            },
            {
                name: `${displayedPrefix}about`,
                value: 'Show more information about me'
            },
        )
        .setFooter({
            text: 'Type !help (specific command) to see more about that command!',
            iconURL: 'https://i.postimg.cc/W3FjFhDt/Red-Bird.jpgc'
        });

    return embed;
}

export default helpPageEmbed;
