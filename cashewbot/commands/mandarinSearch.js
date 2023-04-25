const { returnLookUpWordEmbed } = require('../commandPages/mandarinSearchPage.js');
const { EmbedBuilder } = require('discord.js');
const { processMessage } = require('./commandsHelper.js');

class ReactionCommand {
  constructor(name, id) {
    this.name = name;
    this.id = id;
  };
};

const openBook = new ReactionCommand('OpenBook', '1015246188359979108')
const arrowLeft = new ReactionCommand('LeftArrow', '1015443770113806491')
const arrowRight = new ReactionCommand('RightArrow', '1015443768012455976')

const lookup = async function (message, pageIdx, prefix) {
  if (!message) {
    embed = new EmbedBuilder()
      .setColor(0x0099FF) // Sky Blue
      .setAuthor({ name: '叉焼', iconURL: 'https://i.postimg.cc/W3FjFhDt/Red-Bird.jpg' })
      .setTitle('Mandarin Search')
      .setDescription(`Say **${prefix}s** or **${prefix}search** to search a Mandarin or English word!\n\nexample: **${prefix}s 蔀**`);

    return { embed, maxPageIdx: -1, help: true };
  };
  result = await returnLookUpWordEmbed(message, pageIdx * 4)
  return { embed: result.embed, maxPageIdx: Math.floor(result.entriesCount / 4), help: false }; // Each page has max. 4 entries
};

const mandarinSearch = async function (msg, prefix) {
  const processedMessage = processMessage(msg);
  var pageIdx = 0;
  var searchResult = await lookup(processedMessage.value, pageIdx, prefix);
  const result = await msg.channel.send({ embeds: [await searchResult.embed] });

  if (searchResult.help) return;
  const switchBetweeenReactions = async function (reaction) {
    switch (reaction.emoji.name) {
      case openBook.name:
        break;
      case arrowLeft.name:
        if (pageIdx > 0) pageIdx -= 1;
        searchResult = await lookup(processedMessage.value, pageIdx, prefix);
        result.edit({ embeds: [await searchResult.embed] });
        break;
      case arrowRight.name:
        if (pageIdx < searchResult.maxPageIdx) pageIdx += 1;
        searchResult = await lookup(processedMessage.value, pageIdx, prefix);
        result.edit({ embeds: [await searchResult.embed] });
        break;
    };
  }

  result.react(openBook.id)
    .then(() => result.react(arrowLeft.id))
    .then(() => result.react(arrowRight.id))
    .catch((error) => console.error('One of the emojis failed to react:', error));

  const filter = (reaction, user) => {
    return [openBook.name, arrowLeft.name, arrowRight.name].includes(reaction.emoji.name) && user.id === msg.author.id;
  }

  const collector = result.createReactionCollector({ filter, idle: 180000, dispose: true });
  collector.on('collect', async (reaction, user) => {
    switchBetweeenReactions(reaction);
  });
  collector.on('remove', async (reaction, user) => {
    switchBetweeenReactions(reaction);
  });
}
exports.mandarinSearch = mandarinSearch;
