const Kyujitai = require('kyujitai');
const { EmbedBuilder } = require('discord.js');
const { getContent } = require('./commandsHelper.js')
var prefix = '!';

function convertKyujitaiShinjitai(msg) {
  message = getContent(msg);
  const kyujitai = new Kyujitai ((error) => {
    if (!message) {
      embed = new EmbedBuilder()
      .setColor(0x0099FF) // Sky Blue
      .setAuthor({ name: '叉焼', iconURL: 'https://i.postimg.cc/W3FjFhDt/Red-Bird.jpg'})
      .setTitle('Shinjitai - Kyujitai convert')
      .setDescription(`Say **${prefix}k** or **${prefix}kyuji** to convert a Japanese sentence from [Shinjitai(新字体)](https://en.wikipedia.org/wiki/Shinjitai) to [Kyujitai(旧字体)](https://en.wikipedia.org/wiki/Ky%C5%ABjitai)!\n\nexample: **${prefix}k 成歩堂竜ノ介の冒険と覚悟**`);
      
      msg.channel.send({embeds: [embed]});
      return;
    };

    encoded = kyujitai.encode(message);
    if (encoded == message) {
      msg.channel.send(kyujitai.decode(message)); // If original message is Kyujitai, convert to Shinjitai
    } else {
      msg.channel.send(encoded);
    };
  });
};

exports.convertKyujitaiShinjitai = convertKyujitaiShinjitai;