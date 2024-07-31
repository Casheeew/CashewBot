import NaverAPI from '../utils/naverAPI.js';
import { EmbedBuilder } from 'discord.js';

const naver = new NaverAPI();

const naverLookupEmbed = async function(message) {
    const meanings = await naver.jpToKr(message);
    idx = 0;
    li = [];
    meanings.forEach((meaning) => {
        idx += 1;
        li.push(`${idx}. ${meaning}`);
    })

    const embed = new EmbedBuilder().setColor(0x0099FF); // Sky Blue
    embed.addFields({
        name: `${message}`,
        value: `${li.join('\n')}`
    })

    return embed;
}

export default naverLookupEmbed;