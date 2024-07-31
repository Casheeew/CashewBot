import { EmbedBuilder } from "discord.js";
import {
  updateOrCreate,
  processMessage,
  getPrefixes,
  GuildData,
} from "./utils/commandsHelper";
import { Command } from "./types";

const command: Command = {
  id: "prefix",
  names: ["prefix"],
  description: "Change my prefix!",
  exec: async (msg, prefix) => {
    if (msg.guild === null) return;
    const prefixList = await JSON.parse(await getPrefixes(msg.guild));
    const processedMessage = processMessage(msg).value;
    let newPrefix;
    if (processedMessage) {
      // todo
      newPrefix = (processedMessage as string).split(" ");
    }

    const currentDisplayedPrefix = prefix;

    const embed = new EmbedBuilder()
      .setColor(0xf8c8dc) // Pastel Pink
      .setAuthor({
        name: "叉焼",
        iconURL: "https://i.postimg.cc/W3FjFhDt/Red-Bird.jpg",
      });

    if (!newPrefix) {
      embed
        .setTitle("Set Prefix")
        .setDescription(
          `Say **${currentDisplayedPrefix}prefix**, followed by a prefix or a list of prefixes, seperated by space, to change the prefix for this server! (requires admin priviledges)\n\nexample: ${currentDisplayedPrefix}prefix ? c!    (default: !)`
        )
        .addFields({
          name: "current prefixes",
          value: prefixList.join(", "),
        });
      msg.channel.send({ embeds: [embed] });
      return;
    }

    embed.setTitle("Prefix").setDescription(`Changed Prefix!`);

    const id = msg.guild !== null ? msg.guild : msg.author;
    const name = msg.guild !== null ? msg.guild : msg.author;

    updateOrCreate(
      GuildData,
      {
        guildId: id,
      },
      {
        guildId: id,
        name,
        prefix: JSON.stringify(newPrefix),
      }
    );

    await msg.channel.send({ embeds: [embed] });
  },
};

export default command;
