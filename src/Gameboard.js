import EventEmitter from './events';
import sort from './sort'

export default class Gameboard {
    constructor(length) {
        this.length = length

        this.defense = []
        this.offense = []

        for (let i = 0; i < this.length ** 2; i++) {
            this.defense.push(0)
            this.offense.push(0)
        }

        this._renderDefense = null
        this._renderOffense = null

        this.gameStarted = false

        // this.events = new EventEmitter()
    }

    set renderDefense(callback) {
        if (callback !== null) {
            if (callback || callback === undefined) {
                const board = document.createElement('div')
                board.classList.add('board')
                board.classList.add('defense')

                for (let i = 0; i < this.length; i++) {
                    const row = document.createElement('div')
                    row.classList.add('row')

                    for (let j = 0; j < this.length; j++) {
                        const index = ((board.children.length * this.length) + row.children.length) // gives 0 - 63 or 0 - whatever board length ** 2 is
                        const value = this.defense[index] // value of square corresponding to render we are creating

                        const square = document.createElement('div')
                        square.classList.add('square')
                        square.classList.add('defense')
                        square.setAttribute('data-index', index.toString())

                        if (callback !== undefined) { // initial render for ship placement
                            square.addEventListener('dragover', (event) => {
                                event.preventDefault()
                            })
                            square.addEventListener('drop', (event) => {
                                event.preventDefault()

                                const dropped = JSON.parse(event.dataTransfer.getData('text'))
                                const length = dropped.length
                                const vertical = dropped.vertical
                                const reversed = dropped.reversed
                                console.log('dropped', dropped)

                                let array = []
                                if (!vertical) {
                                    if (!reversed) {
                                        for (let i = 0; i < length; i++) {
                                            array.push(index + i)
                                        }
                                    } else {
                                        for (let i = length - 1; i >= 0; i--) {
                                            array.push(index - i)
                                        }
                                    }
                                } else {
                                    if (!reversed) {
                                        for (let i = 0; i < length; i++) {
                                            array.push(index + (i * this.length))
                                        }
                                    } else {
                                        for (let i = length - 1; i >= 0; i--) {
                                            array.push(index - (i * this.length))
                                        }
                                    }
                                }
                                if (array[0] > array[1]) {
                                    array = sort(array)
                                }

                                const result = callback(array)
                                if(result === true) {
                                    square.classList.add('occupied') // render selected square on DOM immediately

                                    let current = square // render rest of squares
                                    if (vertical === false) { // horizontal
                                        if (reversed === false) { // --->
                                            for (let i = 1; i < array.length; i++) {
                                                let next = current.nextElementSibling

                                                next.classList.add('occupied')

                                                current = next
                                            }
                                        } else if (reversed === true) { // <---
                                            for (let i = 1; i < array.length; i++) {
                                                let previous = current.previousElementSibling

                                                previous.classList.add('occupied')

                                                current = previous
                                            }
                                        }
                                    } else if (vertical === true) { // vertical
                                        let mod = this.length // find index of square in row
                                        while (mod <= array[0]) {
                                            mod += this.length
                                        }
                                        const index = this.length - (mod - array[0])

                                        if (reversed === false) { // V down, top to bottom
                                            for (let i = 1; i < array.length; i++) {
                                                let next = current.parentElement.nextElementSibling.children[index]

                                                next.classList.add('occupied')

                                                current = next
                                            }
                                        } else { // ^ up, bottom to top
                                            for (let i = 1; i < array.length; i++) {
                                                let previous = current.parentElement.previousElementSibling.children[index]

                                                previous.classList.add('occupied')

                                                current = previous
                                            }
                                        }
                                    }
                                } else {
                                    console.log('invalid placement')
                                }
                            })
                        } else { // already playing, don't need to render ship placement
                            if (value === 1) {
                                square.classList.add('occupied')
                            } else if (value === 2) {
                                square.classList.add('hit')
                            } else if (value === 3) {
                                square.classList.add('miss')
                            } else if (value === -1) {
                                square.classList.add('sunk')
                            }
                        }
                        row.append(square)
                    }
                    board.append(row)
                }
                this._renderDefense = board
            } else if (typeof callback !== 'function') {
                this._renderDefense = callback // callback is actually a DOM element
            }
        } else {
            this._renderDefense = null
        }
    }

    get renderDefense() {
        // if (this._renderDefense === null) {
        //     this.renderDefense = undefined
        // }
        return this._renderDefense
    }

    set renderOffense(callback) {
        if (callback !== null) {
            if (typeof callback !== 'function') {
                if (callback === undefined) {
                    throw Error('Callback is undefined! Callback must be a function for squares to call upon click event.')
                } else {
                    this._renderOffense = callback // callback is actually a reference to a DOM element
                }
            } else {
                const board = document.createElement('div')
                board.classList.add('board')
                board.classList.add('offense')

                for (let i = 0; i < this.length; i++) {
                    const row = document.createElement('div')

                    for (let j = 0; j < this.length; j++) {
                        const index = ((board.children.length * this.length) + row.children.length)
                        const value = this.offense[index]

                        const square = document.createElement('div')
                        square.classList.add('square')
                        square.classList.add('offense')

                        if (value === 1) {
                            square.classList.add('miss')
                        } else if (value >= 2) {
                            if (square.classList.contains('miss')) {
                                square.classList.remove('miss')
                            }
                            square.classList.add('hit')
                            square.classList.add(`q${value - 1}`)
                        } else if (value === -1) {
                            if (square.classList.contains('hit')) {
                                square.classList.remove('hit')
                            }
                            square.classList.add('sunk')
                        }

                        if (value === 0) {
                            square.addEventListener('click', (event) => {
                                callback(index)
                            })
                        }
                        row.append(square)
                    }
                    board.append(row)
                }
                this._renderOffense = board
            }
        } else {
            this._renderOffense = null
        }
    }

    get renderOffense() {
        // if (this._renderDefense === null) {
        //     this.renderDefense = undefined
        // }
        return this._renderOffense
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
                if (board[square] === 1) {
                    sum += board[square]
                }

                if (sum > 0) { // found occupied square
                    return false
                }
            } else { // boat offscreen
                return false
            }
        }

        if (orientation === 'horizontal') { // check to make sure horizontal boat doesn't wrap
            let mod = this.length

            while (array[0] >= mod) { // determine row: mod * 1 = row 0, mod * 2 = row 1
                mod += this.length
            }

            for (let square of array) {
                if (square >= mod) {
                    return false // horizontal boat wraps around from right to left
                }
            }
        }

        array.forEach((square) => {
            board[square] = 1 // fill empty squares with boat
        })
        return true
    }

    attack(square, attacker) {
        console.log('board attack', square, 'attacker', attacker, 'this', this)

        if (attacker.board === this) { // If true, parent of board is attacking, so this function was called to keep track of attacks -- Don't attack self!
            console.log('self attack')
            const board = this.offense

            if (board[square] === 0) { // check validity of attack
                // board[square] = 1 // 1 is a missed attack, set it for default --- update: don't do anything, let the miss event handle it

                return true
            } /*else if (board[square] === 1) {
                board[square] = 2 // mark successful hit
                return true
            }*/ else {
                return false
            }
        } else { // parent of board is being attacked
            console.log('enemy attack')
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