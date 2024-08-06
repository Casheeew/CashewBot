import "dotenv/config";
import { sequelize, CEDICT } from "../../src/database";
import fs from 'fs';
import path from 'path';

//! Script to load CEDICT to database

async function loadToDatabase(filePath: string) {
    const entries = JSON.parse(fs.readFileSync(filePath, "utf-8"))

    while (entries.length > 0) {
        const chunk = entries.splice(0, 30000);
        await CEDICT.bulkCreate(chunk);
    }
    
}

async function main() {
    console.log('Syncing database...');
    await sequelize.sync();

    console.log('Loading dictionary to database...')

    const dictionaryDir = path.join('src', 'assets', 'dictionaries', 'CC-CEDICT');

    await loadToDatabase(path.join(dictionaryDir, 'entries.json'));
    console.log('Finished!');
}

main();