import NaverAPI from '../utils/naverAPI';
import { EmbedBuilder, Message } from 'discord.js';

const naver = new NaverAPI();

const naverLookupEmbed = async function(message: string) {
    const meanings = await naver.jpToKr(message) as string[] | undefined;
    if (meanings === undefined) return;
    let idx = 0;
    const li: string[] = [];
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