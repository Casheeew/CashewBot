import { readdirSync } from "fs";
import path from "path";
import type { Command } from "../commands/types";

const commandsDir = path.join(__dirname, "../commands");
const commandsMap = new Map<string, Command>();

for (const file of readdirSync(commandsDir)) {
  if (!file.endsWith(".js") && !file.endsWith(".ts")) continue;
  if (file.endsWith("index.js") || file.endsWith("index.ts")) continue;
  if (file.endsWith("quiz.ts")) continue;
  if (file.endsWith("search.ts")) continue;
  if (file.endsWith("types.ts")) continue;
//   if (file.endsWith("types.ts")) continue;
  
  const filePath = path.join(commandsDir, file);
  console.log(filePath);
  const command = (require(filePath) as { default: Command }).default;
  for (const name of command.names) {
    commandsMap.set(name, command);
  }
}

export default commandsMap;
