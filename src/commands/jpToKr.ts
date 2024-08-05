import naverLookupEmbed from "./JPtoKR/naverLookupPage";
import { EmbedBuilder } from "discord.js";
import type { Command } from "./common/types";

const command: Command = {
  id: "JPtoKR",
  names: ["jptokr", "jtok"],
  description: "Lookup a Japanese word on Naver JP Dict",
  exec: async (msg, _prefix, body) => {
    if (body === null) throw new Error('Not enough arguments');

    const embed = await naverLookupEmbed(body);
    if (embed === undefined) return;
    await msg.channel.send({ embeds: [embed] });
  },
  getHelp: (prefix) => new EmbedBuilder()
    .setColor(0x0099ff) // Sky Blue
    .setAuthor({
      name: "叉焼",
      iconURL: "https://i.postimg.cc/W3FjFhDt/Red-Bird.jpg",
    })
    .setTitle("JP to KR Search")
    .setDescription(
      `Say **${prefix}s** or **${prefix}search** to search!\n\nexample: **${prefix}s 蔀**`
    )
};

export default command;
