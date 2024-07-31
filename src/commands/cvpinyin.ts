import { placeTone } from "../utils/parsePinyin";
import { processMessage } from "./utils/commandsHelper";
import { EmbedBuilder, Message } from "discord.js";
import { Command } from "./types";

const exec = async function (msg: Message, prefix: string) {
  const processedMessage = processMessage(msg);
  // todo
  const message = processedMessage.value as string;

  if (!message) {
    const embed = new EmbedBuilder()
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
      );

    msg.channel.send({ embeds: [embed] });
    return;
  }

  await msg.channel.send(placeTone(message));
};

const command: Command = {
  id: "cvpinyin",
  names: ["cvpinyin"],
  description:
    "Convert a Japanese sentence from numbered Pinyin to accented Pinyin",
  exec,
};

export default command;
