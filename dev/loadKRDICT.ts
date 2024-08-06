import "dotenv/config";
import { sequelize, KRDICT_EN } from "../src/database";
import fs from 'fs';
import path from 'path';

//! Script to load KRDICT to database
//! Assets from https://github.com/KamWithK/KrDictionaries

function processEntries(entries: any[]) {
    const numberRegex = /^[0-9]+$/;

    return entries.map((entry) => {
        const definitions = [];
        let definitionEntry = [];
        for (const line of entry.entries) {
            if (line === "") {
                continue;
            }
            if (numberRegex.test(line)) {
                if (definitionEntry.length > 0) {
                    definitions.push(definitionEntry.join('\u241E')); // record separator
                }
                definitionEntry = [];
            } else {
                definitionEntry.push(line.trim().replace(/\.\s+/, ''));
            }
        }
        if (definitionEntry.length > 0) {
            definitions.push(definitionEntry.join('\u241E')); // record separator
        }

        return {
            word: entry.word,
            hanja: entry.hanja,
            stars: entry.stars,
            partOfSpeech: entry.grammar_type,
            audioURL: entry.audio_url,
            definitions: definitions.join('\u241D'),  // group separator
        }
    })
}

async function loadToDatabase(filePath: string) {
    const rawEntries = JSON.parse(fs.readFileSync(filePath, "utf-8"))
    const entries = processEntries(rawEntries);

    while (entries.length > 0) {
        const chunk = entries.splice(0, 30000);
        await KRDICT_EN.bulkCreate(chunk);
    }

}

async function main() {
    console.log('Syncing database...');
    await sequelize.sync();

    console.log('Loading dictionary to database...')

    const dictionaryDir = path.join('src', 'assets', 'dictionaries', 'KRDICT');

    await loadToDatabase(path.join(dictionaryDir, 'krdict_korean_english.json'));
    console.log('Finished!');
}

main();