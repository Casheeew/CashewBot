import type { Awaitable, EmbedBuilder, Message } from "discord.js";

type Execute = (msg: Message, prefix: string) => Awaitable<void>;

export type Command = {
  id: string;
  /**
   * All names that can be used to run this command.
   */
  names: string[];
  /**
   * A brief description that is displayed in the Help All page.
   */
  description: string;
  /**
   * The function that is called when this command is run.
   */
  exec: Execute;
  /**
   * Cooldown of this command in seconds.
   */
  cooldown?: number;
};
