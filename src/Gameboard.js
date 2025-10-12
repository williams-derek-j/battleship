import sort from './sort'
import disableClick from './disableClick'

export default class Gameboard {
    constructor(length, parent) {
        this.length = length
        this.parent = parent

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
                const boardLength = this.length
                const board = document.createElement('div')
                board.classList.add('board')
                board.classList.add('defense')

                for (let i = 0; i < boardLength; i++) {
                    const row = document.createElement('div')
                    row.classList.add('row')

                    for (let j = 0; j < boardLength; j++) {
                        const index = ((board.children.length * boardLength) + row.children.length) // gives 0 - 63 or 0 - whatever board length ** 2 is
                        const value = this.defense[index] // value of square corresponding to render we are creating

                        const square = document.createElement('div')
                        square.classList.add('square')
                        square.classList.add('defense')
                        square.setAttribute('data-index', index.toString())

                        if (callback !== undefined) { // initial render for ship placement
                            square.addEventListener('dragover', (event) => {
                                event.preventDefault()

                                const dragged = this.parent.ships.find((ship) => ship.dragging === true )
                                const len = dragged.length
                                const vertical = dragged.vertical
                                const reversed = dragged.reversed

                                let current = square

                                let valid = true
                                let foundOccupied = false

                                if (square.classList.contains('occupied')) {
                                    valid = false
                                }
                                if (valid) {
                                    if (!vertical) {
                                        if (!reversed) {
                                            if (boardLength - j >= len) {
                                                square.classList.add('highlighted') // render selected square on DOM immediately

                                                for (let k = 1; k < len; k++) {
                                                    current = current.nextElementSibling

                                                    if (!current.classList.contains('occupied')) {
                                                        current.classList.add('highlighted')
                                                    } else {
                                                        valid = false
                                                        foundOccupied = true
                                                    }
                                                }
                                            } else {
                                                valid = false
                                            }
                                        } else {
                                            if (j + 1 >= len) {
                                                square.classList.add('highlighted') // render selected square on DOM immediately

                                                for (let k = 1; k < len; k++) {
                                                    current = current.previousElementSibling

                                                    if (!current.classList.contains('occupied')) {
                                                        current.classList.add('highlighted')
                                                    } else {
                                                        valid = false
                                                        foundOccupied = true
                                                    }
                                                }
                                            } else {
                                                valid = false
                                            }
                                        }
                                    } else {
                                        if (!reversed) {
                                            if (boardLength - i >= len) {
                                                square.classList.add('highlighted')

                                                for (let k = 1; k < len; k++) {
                                                    current = current.parentElement.nextElementSibling.children[j]

                                                    if (!current.classList.contains('occupied')) {
                                                        current.classList.add('highlighted')
                                                    } else {
                                                        valid = false
                                                        foundOccupied = true
                                                    }
                                                }
                                            } else {
                                                valid = false
                                            }
                                        } else {
                                            if (i + 1 >= len) {
                                                square.classList.add('highlighted')

                                                for (let k = 1; k < len; k++) {
                                                    current = current.parentElement.previousElementSibling.children[j]

                                                    if (!current.classList.contains('occupied')) {
                                                        current.classList.add('highlighted')
                                                    } else {
                                                        valid = false
                                                        foundOccupied = true
                                                    }
                                                }
                                            } else {
                                                valid = false
                                            }
                                        }
                                    }
                                }
                                if (valid === false) {
                                    if (foundOccupied) {
                                        const highlights = document.querySelectorAll('.square.highlighted')

                                        highlights.forEach(highlight => {
                                            highlight.classList.remove('highlighted')
                                        })
                                    }

                                    square.classList.add('invalidPlacement') // render selected square on DOM immediately

                                    let current = square

                                    if (!vertical) {
                                        if (!reversed) {
                                            let lenShortened

                                            if (!current.classList.contains('occupied')) {
                                                lenShortened = boardLength - j
                                            } else {
                                                lenShortened = len
                                            }

                                            for (let k = 1; k < lenShortened; k++) {
                                                current = current.nextElementSibling
                                                current.classList.add('invalidPlacement')

                                                if (current.classList.contains('occupied')) {
                                                    lenShortened = len // reconfigure length of for-loop, lenShortened is usually for off-grid calculation
                                                }
                                            }
                                        } else {
                                            let lenShortened

                                            if (!current.classList.contains('occupied')) {
                                                lenShortened = j + 1
                                            } else {
                                                lenShortened = len
                                            }

                                            for (let k = 1; k < lenShortened; k++) {
                                                current = current.previousElementSibling

                                                if (!current.classList.contains('occupied')) {
                                                    current.classList.add('invalidPlacement')
                                                } else {
                                                    current.classList.add('invalidPlacement')
                                                    lenShortened = len  // reconfigure length of for-loop, lenShortened is usually for off-grid calculation
                                                }
                                            }
                                        }
                                    } else {
                                        if (!reversed) {
                                            let lenShortened

                                            if (!current.classList.contains('occupied')) {
                                                lenShortened = boardLength - i
                                            } else {
                                                lenShortened = len
                                            }

                                            for (let k = 1; k < lenShortened; k++) {
                                                current = current.parentElement.nextElementSibling.children[j]

                                                if (!current.classList.contains('occupied')) {
                                                    current.classList.add('invalidPlacement')
                                                } else {
                                                    current.classList.add('invalidPlacement')
                                                    lenShortened = len  // reconfigure length of for-loop, lenShortened is usually for off-grid calculation
                                                }
                                            }
                                        } else {
                                            let lenShortened

                                            if (!current.classList.contains('occupied')) {
                                                lenShortened = i + 1
                                            } else {
                                                lenShortened = len
                                            }

                                            for (let k = 1; k < lenShortened; k++) {
                                                current = current.parentElement.previousElementSibling.children[j]

                                                if (!current.classList.contains('occupied')) {
                                                    current.classList.add('invalidPlacement')
                                                } else {
                                                    current.classList.add('invalidPlacement')
                                                    lenShortened = len  // reconfigure length of for-loop, lenShortened is usually for off-grid calculation
                                                }
                                            }
                                        }
                                    }
                                }
                                // ship.dragging = false
                            })
                            square.addEventListener('dragleave', (event) => {
                                event.preventDefault()

                                const highlights = document.querySelectorAll('.square.highlighted')

                                highlights.forEach(highlight => {
                                    highlight.classList.remove('highlighted')
                                })

                                const invalids = document.querySelectorAll('.square.invalidPlacement')

                                invalids.forEach((invalid) => {
                                    invalid.classList.remove('invalidPlacement')
                                })
                            })
                            square.addEventListener('drop', (event) => {
                                event.preventDefault()

                                const highlights = document.querySelectorAll('.square.highlighted')

                                highlights.forEach((highlight) => {
                                    highlight.classList.remove('highlighted')
                                })

                                const invalids = document.querySelectorAll('.square.invalidPlacement')

                                invalids.forEach((invalid) => {
                                    invalid.classList.remove('invalidPlacement')
                                })

                                const dropped = JSON.parse(event.dataTransfer.getData('text'))
                                const length = dropped.length
                                const vertical = dropped.vertical
                                const reversed = dropped.reversed
                                // console.log('dropped', dropped)

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
                                            array.push(index + (i * boardLength))
                                        }
                                    } else {
                                        for (let i = length - 1; i >= 0; i--) {
                                            array.push(index - (i * boardLength))
                                        }
                                    }
                                }
                                if (array[0] > array[1]) { // this is never used, visually-reversed ships don't have reversed arrays
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
                                        let mod = array[0] - (array[0] % boardLength) // find index of square in row

                                        const index = array[0] - mod

                                        if (reversed === false) { // V down, top to bottom
                                            for (let i = 1; i < array.length; i++) { // starts at 1 because we are filling squares adjacent to the square we've dropped our ship on, e.g., if 5 then 6, 7, 8 for ship length of 4
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
                                    // console.log('invalid placement')
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
        document.removeEventListener('click', disableClick, true); // reset to allow clicking again

        if (callback !== null) {
            if (typeof callback !== 'function') {
                if (callback === undefined) {
                    throw Error('Callback is undefined! Callback must be a function for squares to call upon click event.')
                } else {
                    this._renderOffense = callback // callback is actually a reference to a DOM element
                }
            } else {
                const boardLength = this.length
                const board = document.createElement('div')
                board.classList.add('board')
                board.classList.add('offense')

                for (let i = 0; i < boardLength; i++) {
                    const row = document.createElement('div')

                    for (let j = 0; j < boardLength; j++) {
                        const index = ((board.children.length * boardLength) + row.children.length)
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

                                document.addEventListener('click', disableClick, true) // disable clicking so multiple squares aren't clicked at once
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
        if (array.length === 0) {
            return false
        } else if (array[array.length - 1] < array[0]) {
            array = [...array].reverse()
        }
        const boardLength = this.length
        const board = this.defense

        let orientation
        for (let i = array.length - 1; i > 0; i--) {
            if (array[i] - array[i - 1] !== 1 && (array[i] - array[i - 1]) / boardLength !== 1) { // check if boat is disjointed, i.e., skips a square

                return false
            }
            if (array[i] - array[i - 1] === 1) {
                orientation = 'horizontal'
            } else if ((array[i] - array[i - 1]) % boardLength === 0) {
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
            let mod = (array[0] - (array[0] % boardLength) + boardLength) // find index of square in row

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

    attack(square, attackSelf = false) {
        // console.log('board attack', square, 'attackSelf', attackSelf)

        if (attackSelf === true) { // If true, parent of board is attacking, so this function was called to keep track of attacks -- Don't attack self!
            // console.log('self attack')

            return this.offense[square] === 0;
        } else { // parent of board is being attacked
            // console.log('enemy attack')

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