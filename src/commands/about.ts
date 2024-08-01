import { EmbedBuilder } from "discord.js";
import type { Command } from "./common/types";
const support_url = process.env.SUPPORT_URL;

const embed = new EmbedBuilder()
  .setColor(0xf8c8dc) // Pastel Pink
  .setAuthor({
    name: "叉焼",
    iconURL: "https://i.postimg.cc/W3FjFhDt/Red-Bird.jpg",
  })
  .setTitle("About me")
  .setDescription(
    `Make suggestions, report bugs, ask for help here: [Support server](${support_url})\n\n**叉焼** uses data from: \n- CC-CEDICT`
  );

const command: Command = {
  id: "about",
  names: ["about"],
  description: "Show more information about me",
  exec: async (msg) => {
    await msg.channel.send({ embeds: [embed] });
  },
};

export default command;
