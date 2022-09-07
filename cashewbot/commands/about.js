const aboutPageEmbed = require('../commandPages/aboutPage');
const aboutPage = function (msg) {
    msg.channel.send({ embeds: [aboutPageEmbed.aboutPageEmbed] });
}

exports.aboutPage = aboutPage;