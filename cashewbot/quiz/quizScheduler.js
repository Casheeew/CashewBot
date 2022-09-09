// 5-box Leitner system

class quizScheduler {
    constructor (deckSize) {
        this.deckSize = deckSize;
        this.boxes = [];

        for (const i of Array(5).keys()) {
            let interval = Math.max( Math.min( 12*(i+1), Math.floor(deckSize*(i+1)/12) ), 5*(i+1) ) 
            this.boxes.push(interval);
        }
    }

}

module.exports = {
    quizScheduler,
}