import { placeTone } from "../utils/parsePinyin";
import { EmbedBuilder } from "discord.js";
import type { Command } from "./common/types";
import CommandError from "./common/error";

const command: Command = {
  id: "cvpinyin",
  names: ["cvpinyin"],
  description:
    "Convert a Japanese sentence from numbered Pinyin to accented Pinyin",
  exec: async (msg, _prefix, body) => {
    if (body === null) throw new CommandError("Arguments do not match");

    await msg.channel.send(placeTone(body));
  },
  getHelp: (prefix) => new EmbedBuilder()
    .setColor(0x0099ff) // Sky Blue
    .setAuthor({
      name: "叉焼",
      iconURL: "https://i.postimg.cc/W3FjFhDt/Red-Bird.jpg",
    })
    .setTitle(
      "Convert ugly pinyin with numbers to beautiful, accented pinyin!"
    )
    .setDescription(
      `Say **${prefix}cvpinyin** to convert a Chinese sentence from numbered Pinyin to accented Pinyin!\n\nexample: **${prefix}cvpinyin han4 zi4**`
    )
};

export default command;
