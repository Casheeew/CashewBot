// import initiateQuiz from './commands/quiz.js';
// import { mandarinSearch } from './commands/search.js';
import { getPrefixes } from "./commands/common/utils";
import { Message } from "discord.js";
import { readdirSync } from "fs";
import path from "path";
import type { Command } from "./commands/common/types";

const commandsDir = path.join(__dirname, "./commands");
const commandsMap = new Map<string, Command>();

for (const file of readdirSync(commandsDir)) {
    if (!file.endsWith(".js") && !file.endsWith(".ts")) continue;
    if (file.endsWith("quiz.ts")) continue;

    const filePath = path.join(commandsDir, file);
    const command = (require(filePath) as { default: Command }).default;
    for (const name of command.names) {
        commandsMap.set(name, command);
    }
}


async function trimPrefix(msg: string, prefixes: string[]) {
    for (const prefix of prefixes) {
        if (msg.startsWith(prefix)) {
            return { prefix, content: msg.slice(prefix.length) };
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

    const args = content.split(" ");
    const commandName = args.shift();
    if (commandName === undefined) return;

    const command = commandsMap.get(commandName);
    if (command === undefined) return;

    const body = content.slice(commandName.length).trim();

    await command.exec(msg, prefix, body, args);
}

export default executeCommand;
