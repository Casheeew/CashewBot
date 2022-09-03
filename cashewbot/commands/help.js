const helpPageEmbed = require('../commandPages/createHelpPage');
const helpPage = function(msg) {
    msg.channel.send({ embeds: [helpPageEmbed.helpPageEmbed] });
}

exports.helpPage = helpPage;