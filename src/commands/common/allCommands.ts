    import type { Command } from './types';
import path from 'path';
import fs from 'fs';

const commands: Command[] = [];
const commandsDir = path.join(__dirname, '..');

for (const file of fs.readdirSync(commandsDir)) {
    if (!file.endsWith(".js") && !file.endsWith(".ts")) continue;
    if (file.endsWith("quiz.js") || file.endsWith("quiz.ts")) continue;

    const filePath = path.join(commandsDir, file);
    const command = (require(filePath) as { default: Command }).default;
    commands.push(command);
}

export default commands;