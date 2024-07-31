import helpPageEmbed from '../commandPages/helpPage.js';

const helpPage = async function(msg, prefix) {
    const embed = helpPageEmbed(prefix);
    await msg.channel.send({ embeds: [embed] });
}

export default helpPage;