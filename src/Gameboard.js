import EventEmitter from 'node:events';

export default class Gameboard {
    constructor(length, quantity = 8 /*quantity is total boats, half per player*/, boatMax = 6, boatMin = 3) {
        this.length = length
        this.turn = 0
        this.gameFinished = false

        this.alive = [] // surviving boats
        this.search = {}

        this.boardP1 = []
        this.boardP2 = []
        for (let i = 0; i < this.length ** 2; i++) {
            this.boardP1.push(0)
            this.boardP2.push(0)
        }

        this.events = new EventEmitter()
    }

    place(array, player) { // square is a decimal, 0 through board.length ** 2
        let board
        if (player === 1) {
            board = this.boardP1
        } else if (player === 2) {
            board = this.boardP2
        } else {
            throw new Error('Invalid player specified')
        }

        let sum = 0 // check if any of squares occupied
        array.forEach((square) => {
            sum += board[square]
        })

        if (sum > 0) {
            return false
        } else {
            array.forEach((square) => {
                board[square] = 1 // fill empty squares with boat

                this.search[`${square} ${player}`] = this.alive.length
                this.alive.push(square)
            })
            return true
        }
    }

    attack(square) {
        let board
        if (this.turn % 2 === 0) {
            board = this.boardP2
        } else {
            board = this.boardP1
        }

        if (board[square] === 1) {
            board[square] = 2 // dead square

            const index = this.search[`${square} ${(this.turn % 2) + 1}`] // remove square from surviving boats
            this.alive.splice(index, 1)

            if (this.alive.length === 0) { // check if all boats are dead
                this.gameFinished = true
            }

            this.events.emit('hit', { pos: square, turn: this.turn, gameFinished: this.gameFinished })
            this.turn++

            return true
        } else if (board[square] === 2 || board[square] === 3 /*3 is a previous miss*/) { // tried to attack previously-attacked square, try again w/o switching turns
            return false
        }
    }
}