import naverLookupEmbed from "../commandPages/naverLookupPage";
import { processMessage } from "./utils/commandsHelper";
import { EmbedBuilder } from "discord.js";
import { Command } from "./types";

const command: Command = {
  id: "JPtoKR",
  names: ["jptokr", "jtok"],
  description: "Lookup a Japanese word on Naver JP Dict",
  exec: async (msg, prefix) => {
    const processedMessage = processMessage(msg);
    const query = processedMessage.value as string;
    let embed: EmbedBuilder;

    if (!query) {
      embed = new EmbedBuilder()
        .setColor(0x0099ff) // Sky Blue
        .setAuthor({
          name: "叉焼",
          iconURL: "https://i.postimg.cc/W3FjFhDt/Red-Bird.jpg",
        })
        .setTitle("JP to KR Search")
        .setDescription(
          `Say **${prefix}s** or **${prefix}search** to search!\n\nexample: **${prefix}s 蔀**`
        );
    } else embed = await naverLookupEmbed(query) as EmbedBuilder;

    await msg.channel.send({ embeds: [embed] });
  },
};

export default command;
