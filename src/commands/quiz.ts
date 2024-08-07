// import { processMessage, getPrefixes, UserData, updateOrCreate } from './commandsHelper.js';
// import renderText from '../utils/renderText.js';
// import { AttachmentBuilder } from 'discord.js';
// import getEmbedForQuiz from '../commandPages/quizPage.js';
// import { placeTone } from '../utils/parsePinyin.js';
// import QuizScheduler from '../quiz/quizScheduler.js';
// import { shuffle } from '../quiz/quizHelper.js';

// class Save {
  
//   constructor(user, save, model) {
//     this.user = user;
//     this.save = save;
//     this.model = model;
//     this.found = this.model.findOne({ where: { userId: this.user.id } })
//   }

//   getSaves() {
//     const saves = [];
//     for (let i in Array(3)) {
//       saves.push(this.found.get(`save${i + 1}`))
//     }

//     return saves;
//   }

//   UpdateSaves() {
//     const saves = this.getSaves();
//     console.log(saves);
//     for (i in Array(3)) {
//       if (!saves[i]) {
//         saves[i] = sth; //
//         break;
//       }
//     }
//   }

// }

// const processResponse = function (msg, prefix) {

//   const msgLowercase = msg.content.toLowerCase();

//   if (msgLowercase === 'skip' || msgLowercase === 's' || msgLowercase === 'ｓ' || msgLowercase === '。' || msgLowercase === '。。') {
//     return 'skip';
//   }
//   if (msgLowercase === `${prefix}stop` || msgLowercase === `${prefix}end`) {
//     return `${prefix}stop`;
//   }

//   const accentedPinyin = placeTone(msgLowercase);

//   if (!accentedPinyin) {
//     return msgLowercase;
//   } else {
//     return accentedPinyin;
//   }

// }

// const initiateQuiz = async function (msg) {
//   await UserData.sync({})

//   let args = processMessage(msg, parseArgs = true).value;
//   const chosenDeck = args[0];
//   if (args[1] == 'challenge') {
//     var challenge = true;
//   } else {
//     challenge = false;
//   }
//   if (chosenDeck) {
//     var deck = require(`../assets/quiz_json/${chosenDeck}.json`);
//   } else {
//     msg.channel.send('Please choose a deck: hsk1, hsk2, hsk3, hsk4, hsk5, hsk6')
//     return;
//   }

//   const prefixList = await JSON.parse(await getPrefixes(msg.guild));

//   const pointsRack = {};
//   const buffer = 0;
//   const timer = 14000 + buffer;
//   const cards = shuffle(deck.cards);
//   const embeds = getEmbedForQuiz(deck);

//   const schedule = new QuizScheduler(cards.length);

//   var quizRunning = true;
//   msg.channel.send({ embeds: [embeds.startQuizEmbed] })

//   while (quizRunning && cards.length > 0) {
//     let card = cards.shift()

//     const filter = msg => {
//       if (msg.author.bot) return false;
//       return true;
//     }
//     const collector = msg.channel.createMessageCollector({ filter });
//     const question = new AttachmentBuilder(renderText.render(card.question), { name: 'question.png' })
//     msg.channel.send({ embeds: [embeds.questionEmbed.setImage('attachment://question.png')], files: [question] });

//     const waitForCorrectAnswer = new Promise(
//       (resolve, reject) => collector.on('collect', m => {
//         for (let prefix of prefixList) {
//           res = processResponse(m, prefix);
//           userid = m.author.id;
//           if (res === 'skip') {
//             resolve({ scorers: [], embed: embeds.incorrectAnswerEmbed(card, skip = true, null || 10, userid) })

//             if (challenge) {
//               card['reviewPile'] = 0;
//               cards.splice(schedule.boxes[card['reviewPile']], 0, card);
//               break;
//             }
//           }
//           else if (res === `${prefix}stop`) {
//             reject(m);
//             break;
//           }
//           else if (res === `${prefix}save`) {
//             updateSave(msg.author, cards)
//           }
//           else if (card.answer.some(ans => res === ans)) {
//             var embed = embeds.correctAnswerEmbed(card, m.author, null || 10); // scoreLimit
//             resolve({ scorers: [m.author.id], embed });
//             collector.stop();

//             if (challenge) {
//               if (card['reviewPile'] < 5) {
//                 card['reviewPile'] += 1;
//               }

//               if (card['reviewPile']) {
//                 cards.splice(schedule.boxes[card['reviewPile']], 0, card);
//                 console.log(cards)
//               }
//             } // If challenge mode, add the card back at index reviewPile if it is present
//             break;
//           }
//         }
//       })
//     )

//     const waitForTimeout = new Promise(
//       (resolve) => {
//         setTimeout(() => {
//           var embed = embeds.incorrectAnswerEmbed(card, skip = false, null || 10); // scoreLimit
//           resolve({ scorers: [], embed })

//           if (challenge) {
//             card['reviewPile'] = 0;
//             cards.splice(schedule.boxes[card['reviewPile']], 0, card);
//           }
//         },
//           timer
//         )
//       }
//     );

//     await Promise.race([waitForCorrectAnswer, waitForTimeout]).then((result) => {
//       for (scorer of result.scorers) {

//         if (pointsRack[scorer]) {
//           pointsRack[scorer] += 1;

//           if (pointsRack[scorer] == 10) {
//             msg.channel.send(`<@${scorer}> got 10 points!`)
//             quizRunning = false;
//           }
//         } else {
//           pointsRack[scorer] = 1;
//         }
//       }
//       collector.channel.send({ embeds: [result.embed] })

//     }).catch((message) => {
//       message.channel.send({ embeds: [embeds.stopQuizEmbed(deck, message.author.id, pointsRack)] });
//       quizRunning = false;
//     })
//   }

//   if (cards.length == 0) {
//     message.channel.send('You have conquered this deck!');
//   }
// }

// export default initiateQuiz;
