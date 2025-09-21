import EventEmitter from 'node:events';

export default class Gameboard {
    constructor(length, quantity = 8 /*quantity is total boats, half per player*/, boatMax = 6, boatMin = 3) {
        this.length = length
        this.turn = 0
        this.gameFinished = false

        this.search = {}

        this.boardP1 = []
        this.aliveP1 = [] // surviving boats

        this.boardP2 = []
        this.aliveP2 = [] // surviving boats

        for (let i = 0; i < this.length ** 2; i++) {
            this.boardP1.push(0)
            this.boardP2.push(0)
        }

        this.events = new EventEmitter()
    }

    place(array, player) { // square is a decimal, 0 through board.length ** 2
        let board, alive

        if (player === 1) {
            board = this.boardP1
            alive = this.aliveP1
        } else if (player === 2) {
            board = this.boardP2
            alive = this.aliveP2
        } else {
            throw new Error('Invalid player specified')
        }

        let orientation
        for (let i = array.length - 1; i > 0; i--) {
            if (array[i] - array[i - 1] !== 1 && (array[i] - array[i - 1]) % this.length !== 0) { // check if boat is disjointed, i.e., skips a square
                i = 0

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

        if (sum > 0) {
            return false
        } else {
            array.forEach((square) => {
                board[square] = 1 // fill empty squares with boat

                this.search[`${square} ${player}`] = alive.length
                alive.push(square)
            })
            return true
        }
    }

    attack(square) {
        let board, alive, player

        if (this.turn % 2 === 0) {
            player = 1
            board = this.boardP2
            alive = this.aliveP2
        } else {
            player = 2
            board = this.boardP1
            alive = this.aliveP1
        }

        if (board[square] === 1) {
            board[square] = 2 // dead square

            const index = this.search[`${square} ${(this.turn % 2) + 1}`] // remove square from surviving boats
            alive.splice(index, 1)

            if (alive.length === 0) { // check if all boats are dead
                this.gameFinished = true

                this.winner = player
            } else {
                if (player === 1) { // switch players to indicate the targeted player
                    player = 2
                } else {
                    player = 1
                }
            }

            this.events.emit('hit', { pos: square, turn: this.turn, gameFinished: this.gameFinished, player: player })
            this.turn++

            return true
        } else if (board[square] === 2 || board[square] === 3 /*3 is a previous miss*/) { // tried to attack previously-attacked square, try again w/o switching turns
            return false
        }
    }
}