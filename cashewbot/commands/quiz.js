const { processMessage, getPrefixes, GuildData } = require('./commandsHelper.js');
const renderText = require('../utils/renderText.js');
const { AttachmentBuilder } = require('discord.js');
const { getEmbedForQuiz } = require('../quiz/quizPage.js');
const { placeTone } = require('../utils/parsePinyin.js');
const { quizScheduler } = require('../quiz/quizScheduler');
const { shuffle } = require('../quiz/quizHelper.js')

const processResponse = function (msg, prefix) {
  
  const msgLowercase = msg.content.toLowerCase();
  if (msgLowercase === 'skip' || msgLowercase === 's' || msgLowercase === 'ｓ' || msgLowercase === '。' || msgLowercase === '。。') {
    return 'skip';
  }
  if (msgLowercase === `${prefix}stop` || msgLowercase === `${prefix}end`) {
    return `${prefix}stop`;
  }
  const accentedPinyin = placeTone(msgLowercase);
  if (!accentedPinyin) {
    return msgLowercase;
  } else {
    return accentedPinyin;
  }
}

const initiateQuiz = async function (msg) {

  let args = processMessage(msg, parseArgs=true).value;
  const chosenDeck = args[0];
  if (args[1] == 'challenge') {
    var challenge = true;
    console.log('hi')
  } else {
    challenge = false;
  }
  if (chosenDeck) {
    var deck = require(`../assets/quiz_json/${chosenDeck}.json`);
  } else {
    msg.channel.send('Please choose a deck: hsk1, hsk2, hsk3, hsk4, hsk5, hsk6')
    return;
  }

  const prefixList = await JSON.parse(await getPrefixes(msg.guild));

  const pointsRack = {};
  const buffer = 0;
  const timer = 4000 + buffer;
  const cards = shuffle(deck.cards);
  const embeds = getEmbedForQuiz(deck);

  const schedule = new quizScheduler(cards.length);

  var quizRunning = true;
  msg.channel.send({ embeds: [embeds.startQuizEmbed] })

  while (quizRunning && cards.length > 0) {
    let card = cards.shift()

    const filter = msg => {
      if (msg.author.bot) return false;
      return true;
    }
    const collector = msg.channel.createMessageCollector({ filter });
    const question = new AttachmentBuilder(renderText.render(card.question), { name: 'question.png' })
    msg.channel.send({ embeds: [embeds.questionEmbed.setImage('attachment://question.png')], files: [question] });


    const waitForCorrectAnswer = new Promise(
      (resolve, reject) => collector.on('collect', m => {
        for (let prefix of prefixList) {
          res = processResponse(m, prefix);
          userid = m.author.id;
          if (res === 'skip') {
            resolve({ scorers: [], embed: embeds.incorrectAnswerEmbed(card, skip = true, null || 10, userid) })

            if (challenge) {
              card['reviewPile'] = 0;
              cards.splice(schedule.boxes[card['reviewPile']], 0, card);
              break;
            }
          }
          else if (res === `${prefix}stop`) {
            reject(m);
            break;
          }
          else if (card.answer.some(ans => res === ans)) {
            var embed = embeds.correctAnswerEmbed(card, m.author, null || 10); // scoreLimit
            resolve({ scorers: [m.author.id], embed });
            collector.stop();

            if (challenge) {
              if (card['reviewPile'] < 5) {
                card['reviewPile'] += 1;
              }

              if (card['reviewPile']) {
                cards.splice(schedule.boxes[card['reviewPile']], 0, card);
                console.log(cards)
              }
            } // If challenge mode, add the card back at index reviewPile if it is present
            break;
          }
        }
      })
    )

    const waitForTimeout = new Promise(
      (resolve) => {
        setTimeout(() => {
          var embed = embeds.incorrectAnswerEmbed(card, skip = false, null || 10); // scoreLimit
          resolve({ scorers: [], embed })

          if (challenge) {
            card['reviewPile'] = 0;
            cards.splice(schedule.boxes[card['reviewPile']], 0, card);
          }
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

  if (cards.length == 0) {
    message.channel.send('You have conquered this deck!');
  }
}

exports.initiateQuiz = initiateQuiz

