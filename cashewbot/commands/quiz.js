const { processMessage } = require('./commandsHelper.js');
const renderText = require('../utils/renderText.js');
const { AttachmentBuilder, discordSort } = require('discord.js');
const { getEmbedForQuiz, correctAnswerEmbed, incorrectAnswerEmbed } = require('../quiz/quizPage.js')

const processResponse = function(msg) {
    if (!QuizManager.hasQuizSession(msg.channel.id)) {
      return false;
    }
    const userName = `${msg.author.username}#${msg.author.discriminator}`;
    const result = QuizManager.processUserInput(
      msg.channel.id,
      msg.author.id,
      userName,
      msg.content,
    );

    if (result) {
      return true;
    }
    const msgLowercase = msg.content.toLowerCase();
    if (msgLowercase === 'skip' || msgLowercase === 's' || msgLowercase === 'ｓ' || msgLowercase === '。' || msgLowercase === '。。') {
      return QuizManager.skip(msg.channel.id);
    }
    const isDm = !msg.channel.guild;
    if (isDm) {
      return 'Wrong answer in DM';
    }
    return false;
}

const getGenerator = function* (list) {
    for (let idx = 0; idx < list.length; idx += 1) {
        yield list[idx];
    }
}
const initiateQuiz = async function (msg) {
    var deck = require('../assets/2k.json');
    var cards = deck.cards;
    var embeds = getEmbedForQuiz(deck);
    const cardGenerator = getGenerator(cards);
    while (true) {
        var nextCard = await cardGenerator.next();
        if (nextCard.done) break;

        var card = nextCard.value;

        const filter = msg => !msg.author.bot;
        const collector = msg.channel.createMessageCollector({ filter, idle: 6000 });
        const question = new AttachmentBuilder(renderText.render(card.question), {name: 'question.png'})
        msg.channel.send({embeds: [embeds.cardEmbed.setImage('attachment://question.png')], files: [question]});
        const waitForCorrectAnswer = new Promise(
          (resolve, reject) => collector.on('collect', async m => {
              if (card.answer.some(ans => ans === m.content)) {
                  var embed = correctAnswerEmbed(card, m.author, null || 10); // scoreLimit
                  collector.channel.send({embeds: [embed]});
                  resolve(m.author.id);
                  collector.stop();
              } 
          })
        );
        
        const waitForCollectorEnd = new Promise(
          (resolve, reject) => collector.on('end', collected => {
            var embed = incorrectAnswerEmbed(card, null || 10); // scoreLimit
            collector.channel.send({embeds: [embed]});
            resolve()
          })
        );
        const result = await Promise.race([waitForCorrectAnswer, waitForCollectorEnd]);
        console.log(result)
    }
}

exports.initiateQuiz = initiateQuiz

