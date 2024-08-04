import { Guild } from "discord.js";
import { GuildData } from "database";

export const getPrefixes = async function (guild: Guild) {
  let prefix: string;
  const guildData = await GuildData.findOne({ where: { guildId: guild.id } });
  if (guildData) {
    prefix = await guildData.get("prefix") as string;
  } else {
    prefix = JSON.stringify(["!"]);
  }
  return prefix;
};
