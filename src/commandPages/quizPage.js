import { EmbedBuilder } from 'discord.js';
import { Deck } from '../quiz/quizHelper.js';

const startQuizEmbed = function (deckInfo) {
    const scoreLimit = null || 10; // Will change
    const unansweredQuestionLimit = null || 5;
    embed = new EmbedBuilder()
        .setTitle('Starting in 5 seconds')
        .setDescription(`${deckInfo.name}\n*${deckInfo.description}*`)
        .addFields({ name: 'Deck size', value: `${deckInfo.size}`, inline: true })
        .addFields({ name: 'Unanswered question limit', value: `${scoreLimit}`, inline: true })
        .addFields({ name: 'Playing until', value: `${unansweredQuestionLimit}`, inline: true })

    return embed;
}

const questionEmbed = function (deckInfo) {
    embed = new EmbedBuilder()
        .setTitle(`${deckInfo.name}`)
        .setDescription(`${deckInfo.instructions}`)

    return embed;
}

const correctAnswerEmbed = function (card, userid, scoreLimit) {
    embed = new EmbedBuilder()
        .setDescription(`${userid} got the correct answer first!`)
        .addFields(
            { name: 'Answers', value: `${card.answer.join('\n')}`, inline: true },
            { name: 'Scorers', value: `${userid}`, inline: true },
            { name: 'Meaning', value: `${card.meaning.join(', ')}` }
        )
        .setFooter({ text: `playing until ${scoreLimit}` })

    return embed;
}

const incorrectAnswerEmbed = function (card, skip = false, scoreLimit, userid) {
    if (skip) {
        var descriptionMessage = `<@${userid}> asked me to skip this question!`
    } else {
        var descriptionMessage = 'No one got the correct answer'
    }
    embed = new EmbedBuilder()
        .setDescription(descriptionMessage)
        .addFields(
            { name: 'Answers', value: `${card.answer.join('\n')}`, inline: true },
            { name: 'Scorers:', value: '-', inline: true },
            { name: 'Meaning', value: `${card.meaning.join(', ')}` }
        )
        .setFooter({ text: `playing until ${scoreLimit}` })

    return embed;
}

const stopQuizEmbed = function (deck, userid, pointsRack) {
    const deckInfo = new Deck(deck);
    const embed = new EmbedBuilder()
        .setTitle(`${deckInfo.name} ended`)
        .setDescription(`<@${userid}> asked me to stop the quiz.`);
    scorers = Object.keys(pointsRack);

    var scorerlog = ''
    for (scorer of scorers) {
        scorerlog += `<@${scorer}> ${pointsRack[scorer]} points\n`
    }
    if (scorerlog) {
        embed.setFields({ name: 'Scorers', value: `${scorerlog}` });
    }
    return embed;
}

export const getEmbedForQuiz = function (deck) {
    const deckInfo = new Deck(deck);

    return {
        startQuizEmbed: startQuizEmbed(deckInfo),
        questionEmbed: questionEmbed(deckInfo),
        stopQuizEmbed,
        correctAnswerEmbed,
        incorrectAnswerEmbed
    }
}


export default getEmbedForQuiz;

