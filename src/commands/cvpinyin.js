import { placeTone } from '../utils/parsePinyin.js';
import { processMessage } from './commandsHelper.js';
import { EmbedBuilder } from 'discord.js';

const convertAccentedPinyin = function (msg, prefix) {
    const processedMessage = processMessage(msg);
    message = processedMessage.value;

    if (!message) {
        embed = new EmbedBuilder()
            .setColor(0x0099FF) // Sky Blue
            .setAuthor({
                name: '叉焼',
                iconURL: 'https://i.postimg.cc/W3FjFhDt/Red-Bird.jpg'
            })
            .setTitle('Convert ugly pinyin with numbers to beautiful, accented pinyin!')
            .setDescription(
                `Say **${prefix}cvpinyin** to convert a Chinese sentence from numbered Pinyin to accented Pinyin!\n\nexample: **${prefix}cvpinyin han4 zi4**`
            );

        msg.channel.send({ embeds: [embed] });
        return;
    };

    msg.channel.send(placeTone(message));
}

export default convertAccentedPinyin;