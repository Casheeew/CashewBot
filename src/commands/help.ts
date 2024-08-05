import { EmbedBuilder } from "discord.js";
import type { Command } from "./common/types";
import commands from "./common/allCommands";
import CommandError from "./common/error";

const command: Command = {
  id: "help",
  names: ["help"],
  description: "How did I get here?",
  exec: async (msg, prefix, _body, args) => {
    if (args.length > 1) {
      throw new CommandError('Arguments do not match');
    } else if (args.length === 1) {
      const command = commands.find((cmd) => cmd.names.includes(args[0].toLowerCase()));
      if (command === undefined) throw new CommandError('Invalid command name');

      const helpEmbed = command.getHelp !== undefined
        ? await command.getHelp(prefix, msg)
        : new EmbedBuilder() // Default help embed
          .setColor(0x0099ff) // Sky Blue
          .setAuthor({ name: "叉焼", iconURL: "https://i.postimg.cc/W3FjFhDt/Red-Bird.jpg" })
          .setTitle(command.id)
          .setDescription(command.description);
      await msg.channel.send({ embeds: [helpEmbed] });
      return;
    }

    const embed = new EmbedBuilder()
      .setColor(0xf8c8dc) // Pastel Pink
      .setAuthor({
        name: "叉焼",
        iconURL: "https://i.postimg.cc/W3FjFhDt/Red-Bird.jpg",
      })
      .setDescription("My commands:")
      .setFooter({
        text: "Type *!help <command>* to see more about that command!",
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
  getHelp: (prefix: string) => new EmbedBuilder()
    .setColor(0xf8c8dc) // Pastel Pink
    .setAuthor({
      name: "叉焼",
      iconURL: "https://i.postimg.cc/W3FjFhDt/Red-Bird.jpg",
    })
    .setDescription(
      `Say **${prefix}help** for a list of all commands, or **${prefix} <command>** to see more about that command!`
    ),
};

export default command;
