// eslint-disable-next-line @typescript-eslint/no-require-imports
const chineseLexicon = require('chinese-lexicon');
import fs from 'fs';

//! Script to write CC-CEDICT

function main() {
    fs.writeFileSync('./src/assets/dictionaries/CC-CEDICT/entries.json', JSON.stringify(chineseLexicon.allEntries.map((entry: any) => {
        entry.definitions = entry.definitions.join('\u241D');
        return entry;
    }), null, 2));
}

main();