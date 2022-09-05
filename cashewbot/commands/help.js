const helpPageEmbed = require('../commandPages/createHelpPage');

const helpPage = async function(msg, prefix) {
    const embed = helpPageEmbed.helpPageEmbed(prefix);
    await msg.channel.send({ embeds: [embed] });
}

exports.helpPage = helpPage;