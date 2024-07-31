import returnLookupWordEmbed from "./search/mandarinSearchPage";
import { EmbedBuilder, Message, MessageReaction, User } from "discord.js";
import { processMessage } from "./utils/commandsHelper";

type ReactionCommand = {
  name: string;
  id: string;
};

const openBook: ReactionCommand = {
  name: "LeftArrow",
  id: "1015443770113806491",
};
const arrowLeft: ReactionCommand = {
  name: "LeftArrow",
  id: "1015443770113806491",
};
const arrowRight: ReactionCommand = {
  name: "RightArrow",
  id: "1015443768012455976",
};

const lookup = async function (query: string, pageIdx: number, prefix: string) {
  if (!query) {
    const embed = new EmbedBuilder()
      .setColor(0x0099ff) // Sky Blue
      .setAuthor({
        name: "叉焼",
        iconURL: "https://i.postimg.cc/W3FjFhDt/Red-Bird.jpg",
      })
      .setTitle("Mandarin Search")
      .setDescription(
        `Say **${prefix}s** or **${prefix}search** to search a Mandarin or English word!\n\nexample: **${prefix}s 蔀**`
      );

    return { embed, maxPageIdx: -1, help: true };
  }
  const result = await returnLookupWordEmbed(query, pageIdx * 4);
  return {
    embed: result.embed,
    maxPageIdx: Math.floor(result.entriesCount / 4),
    entriesCount: result.entriesCount,
    help: false,
  }; // Each page has max. 4 entries
};

const mandarinSearch = async function (msg: Message, prefix: string) {
  const processedMessage = processMessage(msg);
  // todo
  var query = processedMessage.value as string;
  var pageIdx = 0;

  var searchResult = await lookup(query, pageIdx, prefix);

  // While no entries found, return entries from a smaller substring
  while (
    searchResult.entriesCount == 0 &&
    query.length > 1 &&
    !searchResult.help
  ) {
    query = query.slice(0, query.length - 1);
    searchResult = await lookup(query, pageIdx, prefix);
  }

  // If no entries found at all, return the original lookup
  if (
    searchResult.entriesCount == 0 &&
    query.length == 1 &&
    !searchResult.help
  ) {
    searchResult = await lookup(processedMessage.value as string, pageIdx, prefix);
  }

  const result = await msg.channel.send({ embeds: [await searchResult.embed] });
  if (searchResult.help) return;

  const switchBetweeenReactions = async function (reaction: MessageReaction) {
    switch (reaction.emoji.name) {
      case openBook.name:
        break;
      case arrowLeft.name:
        if (pageIdx > 0) pageIdx -= 1;
        searchResult = await lookup(query, pageIdx, prefix);
        result.edit({ embeds: [await searchResult.embed] });
        break;
      case arrowRight.name:
        if (pageIdx < searchResult.maxPageIdx) pageIdx += 1;
        searchResult = await lookup(query, pageIdx, prefix);
        result.edit({ embeds: [await searchResult.embed] });
        break;
    }
  };

  result
    .react(openBook.id)
    .then(() => result.react(arrowLeft.id))
    .then(() => result.react(arrowRight.id))
    .catch((error) =>
      console.error("One of the emojis failed to react:", error)
    );

  const filter = (reaction: MessageReaction, user: User) => {
    if (reaction.emoji.name === null) return false;
    return (
      [openBook.name, arrowLeft.name, arrowRight.name].includes(
        reaction.emoji.name
      ) && user.id === msg.author.id
    );
  };

  const collector = result.createReactionCollector({
    filter,
    idle: 180000,
    dispose: true,
  });
  collector.on("collect", async (reaction, user) => {
    switchBetweeenReactions(reaction);
  });
  collector.on("remove", async (reaction, user) => {
    switchBetweeenReactions(reaction);
  });
};
exports.mandarinSearch = mandarinSearch;
