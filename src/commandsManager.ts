// import initiateQuiz from './commands/quiz.js';
// import { mandarinSearch } from './commands/search.js';
import commandsMap from "./commands/index";
import { getPrefixes } from "./commands/utils/commandsHelper";
import { Message } from "discord.js";

// const commands = {
//   'cvpinyin': convertPinyinCommand.run,
//   // 's': searchCommand.run,
//   // 'search': searchCommand.run,
//   'h': helpCommand.run,
//   'help': helpCommand.run,
//   'q': quizCommand.run,
//   'quiz': quizCommand.run,
//   'about': aboutCommand.run,
//   'prefix': prefixCommand.run,
//   'hi': hiCommand.run,
//   'j->k': jpKrCommand.run,
//   'j->j': jpJpCommand.run,
// };

async function trimPrefix(msg: string, prefixes: string[]) {
  for (const prefix of prefixes) {
    if (msg.startsWith(prefix)) {
      return { prefix, content: msg.slice(prefix.length).trim() };
    }
  }

  return { prefix: "", content: "" };
}

async function executeCommand(msg: Message) {
  // todo
  if (msg.guild === null) return;
  const prefixes = await JSON.parse(await getPrefixes(msg.guild));
  const { prefix, content } = await trimPrefix(msg.content, prefixes);
  if (content === "") return;

  const parts = content.split(" ");
  if (parts.length === 0) return;

  const commandName = parts[0];
  const command = commandsMap.get(commandName);
  console.log(commandsMap);
  if (command === undefined) return;

  await command.exec(msg, prefix);
}

export default executeCommand;
