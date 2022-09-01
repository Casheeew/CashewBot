const mandarinSearch = require('../commandPages/createMandarinSearchPage.js')

const search = async function(message){
    return await mandarinSearch.returnLookUpWordEmbed(message, mandarinSearch.wordSearchEmbed)
}
exports.search = search