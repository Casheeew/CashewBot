const { EmbedBuilder } = require('discord.js');
const { updateOrCreate } = require('./commandsHelper.js');

const guildData = await GuildData.findOne({ where: { guildId: msg.guild.id } });
  if (guildData) {
    oldPrefix = await guildData.get('prefix');
  } else {
    oldPrefix = '!';
  }
  
const prefixHandler = async function(msg, oldPrefix) {
    prefix = getContent(msg);
    embed = new EmbedBuilder()
      .setColor(0xF8C8DC) // Pastel Pink
      .setAuthor({ name: '叉焼', iconURL: 'https://i.postimg.cc/W3FjFhDt/Red-Bird.jpg'})
  
    if (!prefix) {
      embed.setTitle('Set Prefix')
           .setDescription(`Say **${await oldPrefix}prefix**, followed by a prefix or a list of prefixes, seperated by a space to change the prefix for this server! (requires admin priviledges)\n\nexample: ${oldPrefix}prefix ? c!    (default: !)`);
     
      return {embeds: [embed]};
    };
  
    embed.setTitle('Prefix')
         .setDescription(`Changed Prefix!`);
    updateOrCreate(GuildData, { guildId: msg.guild.id }, { guildId: msg.guild.id, name: msg.guild.name, prefix: prefix });
    return {embeds: [embed]};
}
  
