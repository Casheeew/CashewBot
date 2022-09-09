const ACCENTED = {
    '1': { 'a': '\u0101', 'e': '\u0113', 'i': '\u012B', 'o': '\u014D', 'u': '\u016B', 'ü': '\u01D6' },
    '2': { 'a': '\u00E1', 'e': '\u00E9', 'i': '\u00ED', 'o': '\u00F3', 'u': '\u00FA', 'ü': '\u01D8' },
    '3': { 'a': '\u01CE', 'e': '\u011B', 'i': '\u01D0', 'o': '\u01D2', 'u': '\u01D4', 'ü': '\u01DA' },
    '4': { 'a': '\u00E0', 'e': '\u00E8', 'i': '\u00EC', 'o': '\u00F2', 'u': '\u00F9', 'ü': '\u01DC' },
    '5': { 'a': 'a', 'e': 'e', 'i': 'i', 'o': 'o', 'u': 'u', 'ü': 'ü' },
};

const getPosition = function (token) {
    if (token.length === 1) {
        return 0;
    }
    const precedence = ['a', 'e', 'o'];
    for (let i of precedence) {
        var pos = token.indexOf(i);
        if (pos >= 0) {
            return pos;
        }
    }
    const u = token.indexOf('u');
    const i = token.indexOf('i');
    const ü = token.indexOf('ü');
    if (ü >= 0) {
        return ü;
    }
    if (i < u) {
        return u;
    } else {
        return i;
    }
}

const getSyllables = function (accentList, pinyin) {
    var syllables = [];
    var remaining = pinyin;
    for (let i of accentList) {
        let idx = remaining.indexOf(i);
        let syllable = remaining.slice(0, idx + 1);
        remaining = remaining.slice(idx + 1);

        syllables.push(syllable);
    }

    return syllables;
}
const placeTone = function (numberedPinyin) {

    var accentKeys = numberedPinyin.match(/[0-9]/g);
    if (!accentKeys) {
        return undefined;
    }
    const syllables = getSyllables(accentKeys, numberedPinyin);

    const results = [];
    for (let syllable of syllables) {
        let toneIdx = syllable.charAt(syllable.length - 1);
        let accentPosition = getPosition(syllable);
        if (accentPosition == undefined) {
            return undefined;
        }
        let accentedChar = ACCENTED[toneIdx][syllable.charAt(accentPosition)];
        let accentedPinyin = `${syllable.slice(0, accentPosition)}${accentedChar}${syllable.slice(accentPosition + 1, -1)}`;

        results.push(accentedPinyin);
    }
    return `${results.join('')}`
}

exports.placeTone = placeTone;