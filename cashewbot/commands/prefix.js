const { EmbedBuilder } = require('discord.js');
const { updateOrCreate, getContent } = require('./commandsHelper.js');

const prefixHandler = async function(msg, GuildData) {
    const guildData = await GuildData.findOne({ where: { guildId: msg.guild.id } });
    if (await guildData) {
        currentPrefix = await guildData.get('prefix');
      } else {
        currentPrefix = '!';
    }

    prefix = getContent(msg);
    embed = new EmbedBuilder()
      .setColor(0xF8C8DC) // Pastel Pink
      .setAuthor({ name: '叉焼', iconURL: 'https://i.postimg.cc/W3FjFhDt/Red-Bird.jpg'})
  
    if (!prefix) {
      embed.setTitle('Set Prefix')
           .setDescription(`Say **${await currentPrefix}prefix**, followed by a prefix or a list of prefixes, seperated by a space to change the prefix for this server! (requires admin priviledges)\n\nexample: ${currentPrefix}prefix ? c!    (default: !)`);
     
      msg.channels.send({embeds: [embed]});
      return;
    };
  
    embed.setTitle('Prefix')
         .setDescription(`Changed Prefix!`);
    updateOrCreate(GuildData, { guildId: msg.guild.id }, { guildId: msg.guild.id, name: msg.guild.name, prefix: prefix });
    
    msg.channel.send({embeds: [embed]});
}
  
exports.prefixHandler = prefixHandler