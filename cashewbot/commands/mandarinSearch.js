const mandarinSearch = require('../commandPages/createMandarinSearchPage.js')

const search = function(message){
    return mandarinSearch.returnLookUpWordEmbed(message, mandarinSearch.wordSearchEmbed)
}
exports.search = search