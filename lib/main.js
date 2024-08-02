const chineseLexicon = require('chinese-lexicon');
const fs = require('fs');

// Script to write CC-CEDICT

fs.writeFileSync('./src/assets/dictionaries/CC-CEDICT/entries.json', JSON.stringify(chineseLexicon.allEntries.map(entry => {
    entry.glossary = entry.definitions.join(";");
    return entry;
}), null, 2));