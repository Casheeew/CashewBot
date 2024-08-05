import type { Awaitable, EmbedBuilder, Message } from "discord.js";

type Execute = (msg: Message, prefix: string, body: string | null, args: string[]) => Awaitable<void>;

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

// CC-CEDICT
export type DictionaryEntry = {
  simp: string;
  trad: string;
  definitions: string[];
  glossary: string;
  pinyin: string;
  searchablePinyin: string;
  pinyinTones: string;
  statistics: {
    hskLevel: number;
    topWords: object[];
    movieWordCount?: number;
    movieWordCountPercent?: number;
    movieWordRank?: number;
    movieWordContexts?: number;
    movieWordContextsPercent?: number;
    bookWordCount?: number;
    bookWordCountPercent?: number;
    bookWordRank?: number;
    movieCharCount?: number;
    movieCharCountPercent?: number;
    movieCharRank?: number;
    movieCharContexts?: number;
    movieCharContextsPercent?: number;
    bookCharCount?: number;
    bookCharCountPercent?: number;
    bookCharRank?: number;
    pinyinFrequency?: number;
  };
  boost: number;
  relevance?: number;
  usedAsComponentIn: object;
};