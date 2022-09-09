class Deck {
    constructor(deck) {
        this.deck = deck;
    };
    get size() { return this.deck.cards.length };
    get name() { return this.deck.name };
    get description() { return this.deck.description };
    get instructions() { return this.deck.instructions };
    get cards() { return this.deck.cards };
}

function shuffle(arr) {
    let currentIndex = arr.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [arr[currentIndex], arr[randomIndex]] = [
        arr[randomIndex], arr[currentIndex]];
    }
  
    return arr;
  }

module.exports = {
    Deck,
    shuffle
}

