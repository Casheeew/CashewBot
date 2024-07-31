import naverLookupEmbed from '../commandPages/naverLookupPage.js';
import { processMessage } from './commandsHelper.js';
import { EmbedBuilder } from 'discord.js';

const searchResult = async function (msg, prefix) {
    const processedMessage = processMessage(msg);
    const query = processedMessage.value;

    if (!query) {
        embed = new EmbedBuilder()
            .setColor(0x0099FF) // Sky Blue
            .setAuthor({ name: '叉焼', iconURL: 'https://i.postimg.cc/W3FjFhDt/Red-Bird.jpg' })
            .setTitle('Jp to Kr Search')
            .setDescription(`Say **${prefix}s** or **${prefix}search** to search!\n\nexample: **${prefix}s 蔀**`);
    }
    else
        embed = await naverLookupEmbed(query);

    await msg.channel.send({ embeds: [embed] });
}

export default searchResult;