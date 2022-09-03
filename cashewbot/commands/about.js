const aboutPageEmbed = require('../commandPages/createAboutPage');
const aboutPage = function(msg) {
    msg.channel.send({ embeds: [aboutPageEmbed.aboutPageEmbed] });
}

exports.aboutPage = aboutPage;