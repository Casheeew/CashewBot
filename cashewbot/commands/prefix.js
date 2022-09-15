const { EmbedBuilder } = require('discord.js');
const { updateOrCreate, processMessage, getPrefixes, GuildData } = require('./commandsHelper.js');

const prefixHandler = async function (msg, prefix) {
  const prefixList = await JSON.parse(await getPrefixes(msg.guild))
  const processedMessage = processMessage(msg).value;
  if (processedMessage) {
    var newPrefix = processedMessage.split(' ');
  } 
  
  const currentDisplayedPrefix = prefix;

  const embed = new EmbedBuilder()
    .setColor(0xF8C8DC) // Pastel Pink
    .setAuthor({ name: '叉焼', iconURL: 'https://i.postimg.cc/W3FjFhDt/Red-Bird.jpg' })

  if (!newPrefix) {
    embed.setTitle('Set Prefix')
      .setDescription(`Say **${currentDisplayedPrefix}prefix**, followed by a prefix or a list of prefixes, seperated by space, to change the prefix for this server! (requires admin priviledges)\n\nexample: ${currentDisplayedPrefix}prefix ? c!    (default: !)`)
      .addFields({ name: 'current prefixes', value: prefixList.join(', ') })
    msg.channel.send({ embeds: [embed] });
    return;
  };

  embed.setTitle('Prefix')
    .setDescription(`Changed Prefix!`);
  updateOrCreate(GuildData, { guildId: msg.guild.id }, { guildId: msg.guild.id, name: msg.guild.name, prefix: JSON.stringify(newPrefix) });

  msg.channel.send({ embeds: [embed] });
}

exports.prefixHandler = prefixHandler