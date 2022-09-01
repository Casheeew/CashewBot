const helpPageEmbed = require('../commandPages/createHelpPage')

const returnHelpPage = function() {
    return helpPageEmbed.helpPageEmbed()
}

exports.returnHelpPage = returnHelpPage