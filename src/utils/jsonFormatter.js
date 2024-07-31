var normalizedPath = require('path').join('assets', 'quiz_json')
const fs = require("fs");
var files = {};
fs.readdirSync(normalizedPath).forEach(function (file) {
    files[file] = require("../assets/quiz_json/" + file);
});
function renameKey(array, oldKey, newKey) {

    const arr = array;
    arr.forEach(obj => {
        obj[newKey] = obj[oldKey];
        delete obj[oldKey];
    });
    const updatedJson = arr;
    return JSON.stringify(updatedJson);
}

function wrapInList(array, key) {
    const arr = array;
    arr.forEach((obj) => {
        obj[key] = new Array(obj[key]);
    });
}

function rewriteFile(file, content) {
    fs.writeFile(file, content, err => {
        if (err) {
            console.error(err);
        }
    })
}

function wrapMetadata() { }

module.exports = {
    renameKey, wrapInList, rewriteFile
}