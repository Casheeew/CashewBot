import type { Awaitable, EmbedBuilder, Message } from "discord.js";

type Execute = (msg: Message, prefix: string, body: string, args: string[]) => Awaitable<void>;

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
   * A custom help embed that is sent when not enough arguments are passed.
   */
  getHelp?: (prefix: string, message: Message) => Awaitable<EmbedBuilder>;
  /**
   * Cooldown of this command in seconds.
   */
  cooldown?: number;
};
