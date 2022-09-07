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

module.exports = {
    Deck,
}