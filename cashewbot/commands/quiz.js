const { processMessage } = require('./commandsHelper.js');
const renderText = require('../utils/renderText.js');
const { AttachmentBuilder } = require('discord.js');
const { getEmbedForQuiz } = require('../quiz/quizPage.js')
const { placeTone } = require('../utils/parsePinyin.js')

const processResponse = function (msg) {
  const msgLowercase = msg.content.toLowerCase();
  if (msgLowercase === 'skip' || msgLowercase === 's' || msgLowercase === 'ｓ' || msgLowercase === '。' || msgLowercase === '。。') {
    return 'skip';
  }
  if (msgLowercase === 'stop' || msgLowercase === 'end') {
    return 'stop';
  }
  const accentedPinyin = placeTone(msgLowercase);
  if (!accentedPinyin) {
    return msgLowercase;
  } else {
    return accentedPinyin;
  }
}

const getGenerator = function* (list) {
  for (let idx = 0; idx < list.length; idx += 1) {
    yield list[idx];
  }
}
const initiateQuiz = async function (msg) {
  chosenDeck = processMessage(msg).value;
  if (chosenDeck) {
    var deck = require(`../assets/quiz_json/${chosenDeck}.json`);
  } else {
    msg.channel.send('Please choose a deck: hsk1, hsk2, hsk3, hsk4, hsk5, hsk6')
    return;
  }
  const pointsRack = {}
  const buffer = 0
  const timer = 4000 + buffer
  const cards = deck.cards;
  const embeds = getEmbedForQuiz(deck);
  const cardGenerator = getGenerator(cards);
  var quizRunning = true;
  msg.channel.send({ embeds: [embeds.startQuizEmbed] })

  while (quizRunning) {
    var nextCard = cardGenerator.next();
    if (nextCard.done) break;

    var card = nextCard.value;

    const filter = msg => {
      if (msg.author.bot) return false;
      return true;
    }
    const collector = msg.channel.createMessageCollector({ filter });
    const question = new AttachmentBuilder(renderText.render(card.question), { name: 'question.png' })
    msg.channel.send({ embeds: [embeds.questionEmbed.setImage('attachment://question.png')], files: [question] });


    const waitForCorrectAnswer = new Promise(
      (resolve, reject) => collector.on('collect', m => {
        res = processResponse(m);
        userid = m.author.id;
        if (res === 'skip') resolve({ scorers: [], embed: embeds.incorrectAnswerEmbed(card, skip = true, null || 10, userid) })
        else if (res === 'stop') {
          reject(m)
        }
        else if (card.answer.some(ans => res === ans)) {
          var embed = embeds.correctAnswerEmbed(card, m.author, null || 10); // scoreLimit
          resolve({ scorers: [m.author.id], embed });
          collector.stop();
        }
      })
    )

    const waitForTimeout = new Promise(
      (resolve) => {
        setTimeout(() => {
          var embed = embeds.incorrectAnswerEmbed(card, skip = false, null || 10); // scoreLimit
          resolve({ scorers: [], embed })
        },
          timer
        )
      }
    );

    await Promise.race([waitForCorrectAnswer, waitForTimeout]).then((result) => {
      for (scorer of result.scorers) {
        if (pointsRack[scorer]) {
          pointsRack[scorer] += 1;
          if (pointsRack[scorer] == 10) {
            msg.channel.send(`<@${scorer}> got 10 points!`)
            quizRunning = false;
          }
        } else {
          pointsRack[scorer] = 1;
        }
      }
      collector.channel.send({ embeds: [result.embed] })
    }).catch((message) => {
      message.channel.send({ embeds: [embeds.stopQuizEmbed(deck, message.author.id, pointsRack)] });
      quizRunning = false;
    })
  }
}

exports.initiateQuiz = initiateQuiz

