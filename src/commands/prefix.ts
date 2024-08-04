import { EmbedBuilder } from "discord.js";
import { getPrefixes } from "./common/utils";
import { GuildData, updateOrCreate } from "database";
import type { Command } from "./common/types";

const command: Command = {
  id: "prefix",
  names: ["prefix"],
  description: "Change my prefix!",
  exec: async (msg, prefix, _body, args) => {
    // todo!
    if (msg.guild === null) return;

    const embed = new EmbedBuilder()
      .setColor(0xf8c8dc) // Pastel Pink
      .setAuthor({
        name: "叉焼",
        iconURL: "https://i.postimg.cc/W3FjFhDt/Red-Bird.jpg",
      })
      .setTitle("Prefix")
      .setDescription(`Changed Prefix!`);

    const id = msg.guild !== null ? msg.guild.id : msg.author.id;
    const name = msg.guild !== null ? msg.guild.name : msg.author.username;

    updateOrCreate(
      GuildData,
      {
        guildId: id,
      },
      {
        guildId: id,
        name,
        prefix: JSON.stringify(args),
      }
    );

    await msg.channel.send({ embeds: [embed] });
  },
  getHelp: async (prefix, message) => {
    // todo
    const prefixes: string[] = message.guild !== null ? JSON.parse(await getPrefixes(message.guild)) : [];
    return new EmbedBuilder()
      .setColor(0xf8c8dc) // Pastel Pink
      .setAuthor({
        name: "叉焼",
        iconURL: "https://i.postimg.cc/W3FjFhDt/Red-Bird.jpg",
      })
      .setTitle("Set Prefix")
      .setDescription(
        `Say **${prefix}prefix**, followed by a prefix or a list of prefixes, seperated by space, to change the prefix for this server! (requires admin priviledges)\n\nexample: ${prefix}prefix ? c!    (default: !)`
      )
      .addFields({
        name: "current prefixes",
        value: prefixes.join(", "),
      })
  }
};

export default command;
