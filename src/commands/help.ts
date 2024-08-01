import { EmbedBuilder } from "discord.js";
import type { Command } from "./common/types";

const command: Command = {
  id: "help",
  names: ["help"],
  description: "How did I get here?",
  exec: async (msg, prefix) => {
    const embed = new EmbedBuilder()
      .setColor(0xf8c8dc) // Pastel Pink
      .setAuthor({
        name: "叉焼",
        iconURL: "https://i.postimg.cc/W3FjFhDt/Red-Bird.jpg",
      })
      .setDescription("My commands:")
      .addFields(
        {
          name: `${prefix}search (alias: ${prefix}s)`,
          value: "Search for a Chinese or English word on CC-CEDICT",
        },
        {
          name: `${prefix}help (alias: ${prefix}h)`,
          value: "How did I get here?",
        },
        {
          name: `${prefix}cvpinyin`,
          value:
            "Convert a Japanese sentence from numbered Pinyin to accented Pinyin",
        },
        {
          name: `${prefix}prefix`,
          value: "Change my prefix!",
        },
        {
          name: `${prefix}about`,
          value: "Show more information about me",
        }
      )
      .setFooter({
        text: "Type !help (specific command) to see more about that command!",
        iconURL: "https://i.postimg.cc/W3FjFhDt/Red-Bird.jpgc",
      });
    await msg.channel.send({ embeds: [embed] });
  },
};

export default command;
