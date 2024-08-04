// eslint-disable-next-line @typescript-eslint/no-require-imports
const chineseLexicon = require('chinese-lexicon');
import type { DictionaryEntry } from '../../src/commands/common/types';
import fs from 'fs';

//! Script to write CC-CEDICT

function main() {
    fs.writeFileSync('./src/assets/dictionaries/CC-CEDICT/entries.json', JSON.stringify(chineseLexicon.allEntries.map((entry: DictionaryEntry) => {
        entry.glossary = entry.definitions.join(";");
        return entry;
    }), null, 2));
}

main();