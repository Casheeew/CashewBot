const { EmbedBuilder } = require('discord.js');
const { Deck } = require('./quizHelper.js')

const startQuizEmbed = function(deckInfo) {
    const scoreLimit = null || 10; // Will change
    const unansweredQuestionLimit = null || 5;
    embed = new EmbedBuilder()
    .setTitle('Starting in 5 seconds')
    .setDescription(`${deckInfo.name}\n*${deckInfo.description}*`)
    .addFields({name: 'Deck size', value: `${deckInfo.size}`, inline: true})
    .addFields({name: 'Unanswered question limit', value: `${scoreLimit}`, inline: true})
    .addFields({name: 'Playing until', value: `${unansweredQuestionLimit}`, inline: true})

    return embed;
}

const cardEmbed = function(deckInfo) {
    embed = new EmbedBuilder() 
        .setTitle(`${deckInfo.name}`)
        .setDescription(`${deckInfo.instructions}`)

    return embed;
}

const correctAnswerEmbed = function(card, user, scoreLimit) {
    embed = new EmbedBuilder()  
    .setDescription(`<@${user.id} got the correct answer first!`)
    .addFields(
        {name: 'Answers', value: `${card.answer.join('\n')}`, inline: true},
        {name: 'Scorers', value: `<@${user.id}>`},
        {name: 'Meaning', value: `${card.meaning}`}
    )
    .setFooter({text: `playing until ${scoreLimit}`})

    return embed;
}


const incorrectAnswerEmbed = function(card, scoreLimit) {
    embed = new EmbedBuilder()  
    .setDescription(`No one got the correct answer`)
    .addFields(
        {name: 'Answers', value: `${card.answer.join('\n')}`, inline: true},
        {name: 'Meaning', value: `${card.meaning}`}
    )
    .setFooter({text: `playing until ${scoreLimit}`})

    return embed;
}

const getEmbedForQuiz = function(deck) {
    const deckInfo = new Deck(deck);
    return {
        startQuizEmbed: startQuizEmbed(deckInfo),
        cardEmbed: cardEmbed(deckInfo),
    }
}

module.exports = {
    getEmbedForQuiz,
    correctAnswerEmbed,
    incorrectAnswerEmbed
}