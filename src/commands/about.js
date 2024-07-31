import aboutPageEmbed from '../commandPages/aboutPage.js';

const aboutPage = function (msg) {
    msg.channel.send({ embeds: [aboutPageEmbed.aboutPageEmbed] });
}

export default aboutPage;