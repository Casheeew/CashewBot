import returnLookupWordEmbed from "./search/mandarinSearchPage";
import { EmbedBuilder, Message, MessageReaction, User } from "discord.js";
import { Command } from "./common/types";

type ReactionCommand = {
  name: string;
  id: string;
};

const openBook: ReactionCommand = { name: "OpenBook", id: "1015246188359979108" };
const arrowLeft: ReactionCommand = { name: "LeftArrow", id: "1015443770113806491" };
const arrowRight: ReactionCommand = { name: "RightArrow", id: "1015443768012455976" };

const lookup = async function (query: string, pageIdx: number) {
  const result = await returnLookupWordEmbed(query, pageIdx * 4);
  const maxPageIdx = Math.floor(result.entriesCount / 4);

  result.embed.setDescription(`Page ${pageIdx + 1} of ${maxPageIdx + 1}`);

  return {
    embed: result.embed,
    maxPageIdx,
    entriesCount: result.entriesCount,
  }; // Each page has max. 4 entries
};

const exec = async function (msg: Message, prefix: string, body: string | null) {
  if (body === null) throw new Error('Not enough arguments');

  let pageIdx = 0;
  let query = body;
  const beforeLookup = performance.now();
  let searchResult = await lookup(body, pageIdx);
  const afterLookup = performance.now();

  console.log(`Call to lookup took ${afterLookup - beforeLookup}ms.`);

  // While no entries found, return entries from a smaller substring
  while (searchResult.entriesCount == 0 && query.length > 1) {
    query = query.slice(0, query.length - 1);
    searchResult = await lookup(query, pageIdx);
  }

  // If no entries found at all, return the original lookup
  if (searchResult.entriesCount == 0 && query.length == 1) {
    searchResult = await lookup(query, pageIdx);
  }

  const result = await msg.channel.send({ embeds: [searchResult.embed] });

  const switchBetweeenReactions = async function (reaction: MessageReaction) {
    switch (reaction.emoji.name) {
      case openBook.name:
        break;
      case arrowLeft.name:
        if (pageIdx > 0) pageIdx -= 1;
        searchResult = await lookup(query, pageIdx);
        result.edit({ embeds: [searchResult.embed] });
        break;
      case arrowRight.name:
        if (pageIdx < searchResult.maxPageIdx) pageIdx += 1;
        searchResult = await lookup(query, pageIdx);
        result.edit({ embeds: [searchResult.embed] });
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
  collector.on("collect", async (reaction) => {
    switchBetweeenReactions(reaction);
  });
  collector.on("remove", async (reaction) => {
    switchBetweeenReactions(reaction);
  });
};

const command: Command = {
  id: 'search',
  names: ['search', 's'],
  description: 'Search for a Chinese or English word on CC-CEDICT',
  exec,
  getHelp: (prefix) => new EmbedBuilder()
    .setColor(0x0099ff) // Sky Blue
    .setAuthor({
      name: "叉焼",
      iconURL: "https://i.postimg.cc/W3FjFhDt/Red-Bird.jpg",
    })
    .setTitle("Mandarin Search")
    .setDescription(
      `Say **${prefix}s** or **${prefix}search** to search a Mandarin or English word!\n\nexample: **${prefix}s 蔀**`
    )
}

export default command;
