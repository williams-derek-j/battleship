import EventEmitter from 'node:events';

export default class Gameboard {
    constructor(length) {
        this.length = length

        this.defense = []
        this.offense = []

        for (let i = 0; i < this.length ** 2; i++) {
            this.defense.push(0)
            this.offense.push(0)
        }

        // this.events = new EventEmitter()
    }

    place(array) { // square is a decimal, 0 through board.length ** 2
        const board = this.defense

        let orientation
        for (let i = array.length - 1; i > 0; i--) {
            if (array[i] - array[i - 1] !== 1 && (array[i] - array[i - 1]) / this.length !== 1) { // check if boat is disjointed, i.e., skips a square

                return false
            }
            if (array[i] - array[i - 1] === 1) {
                orientation = 'horizontal'
            } else if ((array[i] - array[i - 1]) % this.length === 0) {
                orientation = 'vertical'
            }
        }

        let sum = 0 // check if any of squares occupied
        for (let square of array) {
            if (board[square] !== undefined) {
                sum += board[square]

                if (sum > 0) { // found occupied square
                    return false
                }
            } else { // boat offscreen
                return false
            }
        }

        if (orientation === 'horizontal') { // check to make sure horizontal boat doesn't wrap
            let mod = this.length

            while (array[0] > mod) { // determine row: mod * 1 = row 0, mod * 2 = row 1
                mod *= 2
            }

            for (let square of array) {
                if (square > mod) {
                    return false // horizontal boat wraps around from right to left
                }
            }
        }

        array.forEach((square) => {
            board[square] = 1 // fill empty squares with boat
        })
        return true
    }

    attack(square, player) {
        if (player.board === this) { // If true, parent of board is attacking, so this function was called to keep track of attacks -- Don't attack self!
            const board = this.offense

            if (board[square] === 0) { // check validity of attack
                board[square] = 1

                return true
            } else if (board[square] === 1) {
                board[square] = 2 // successful attack

                return null
            } else {
                return false
            }
        } else { // parent of board is being attacked
            const board = this.defense

            if (board[square] === 1) {
                board[square] = 2 // dead square

                return true
            } else if (board[square] === 2 || board[square] === 3 /*3 is a previous miss*/) { // tried to attack previously-attacked square, try again w/o switching turns
                return false
            } else {
                board[square] = 3 // missed attack

                return false
            }
        }
    }
}