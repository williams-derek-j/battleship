import EventEmitter from 'node:events';

export default class Gameboard {
    constructor(length, gameSettings = { players: 2, boardLength: 8, shipsPerPlayer: 4, shipLengths: [3,4,5,6]}) {
        this.length = length
        this.allShipsDead = false

        this.board = []
        this.boardOffense = []
        this.alive = []

        for (let i = 0; i < this.length ** 2; i++) {
            this.board.push(0)
        }

        this.events = new EventEmitter()
    }

    place(array) { // square is a decimal, 0 through board.length ** 2
        let board = this.board
        let alive = this.alive

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

            alive.push(square)
        })
        return true
    }

    attack(square, player) {
        if (player.board === this) { // If true, owner of board is attacking, so this function was called to keep track of attacks -- Don't attack self!
            this.boardOffense.push(square)

            return null
        } else {
            let board = this.board
            let alive = this.alive

            if (board[square] === 1) {
                board[square] = 2 // dead square

                for (let i = 0; i < alive.length; i++) {
                    if (alive[i] === square) {
                        alive.splice(i, 1)
                    }
                }

                if (alive.length === 0) { // check if all boats are dead
                    this.allShipsDead = true
                }

                // this.events.emit('hit', { pos: square, allShipsDead: this.allShipsDead })

                return true
            } else if (board[square] === 2 || board[square] === 3 /*3 is a previous miss*/) { // tried to attack previously-attacked square, try again w/o switching turns
                return false
            } else {
                board[square] = 3 // missed attack

                // this.events.emit('miss', { pos: square })
                return false
            }
        }
    }
}