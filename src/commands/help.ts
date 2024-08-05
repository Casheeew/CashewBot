import { EmbedBuilder } from "discord.js";
import type { Command } from "./common/types";
import commands from "./common/allCommands";

const command: Command = {
  id: "help",
  names: ["help"],
  description: "How did I get here?",
  exec: async (msg) => {
    const embed = new EmbedBuilder()
      .setColor(0xf8c8dc) // Pastel Pink
      .setAuthor({
        name: "叉焼",
        iconURL: "https://i.postimg.cc/W3FjFhDt/Red-Bird.jpg",
      })
      .setDescription("My commands:")
      .setFooter({
        text: "Type !help (specific command) to see more about that command!",
        iconURL: "https://i.postimg.cc/W3FjFhDt/Red-Bird.jpgc",
      });

    for (const command of commands) {
      embed.addFields({
        name: command.id,
        value: command.description,
      });
    };

    await msg.channel.send({ embeds: [embed] });
  },
};

export default command;
