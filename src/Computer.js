import Player from './Player';

export default class Computer extends Player {
    constructor(id, eventsP, gameSettings) {
        super(id, eventsP, gameSettings);

        this.name = null
    }

    generateAttack() {
        function randomInt(min, max) {
            return Math.floor(Math.random() * (max - min) ) + min;
        }
        const boardLength = this.board.length

        const alive = []
        for (let ship of this.ships) {
            if (ship.sunk === false) {
                alive.push(ship)
            }
        }
        const shipMax = alive[alive.length - 1].length

        const available = [] // available targets, i.e., never been attacked before
        const hits = [] // best targets, i.e., squares that have been attacked but not sunk

        for (let i = 0; i < boardLength ** 2; i++) {
            if (this.board.offense[i] === 0) {
                available.push(i)
            } else if (this.board.offense[i] >= 2) {
                hits.push(i)
            }
        }

        if (hits.length > 0) {
            let index = randomInt(0, hits.length) // random index

            const square = hits[index]

            let left = square - 1
            let right = square + 1
            let top = square - boardLength
            let bottom = square + boardLength

            const best = []

            while (hits.includes(left)) { // find if there are multiple hits in a row, meaning most likely another ship square is aligned
                left = left - 1

                if (available.includes(left)) { // left of left
                    if ((square - left) + 1 < shipMax) {
                        best.push(left - 1)
                    }
                }
            }
            while (hits.includes(right)) {
                right = right + 1

                if (available.includes(right)) { // right of right
                    if ((right - square) + 1 < shipMax) {
                        best.push(right + 1)
                    }
                }
            }
            while (hits.includes(top)) {
                top = top - boardLength

                if (available.includes(top)) { // top of top
                    if (((square - top) / boardLength) + 1 < shipMax) {
                        best.push(top - boardLength)
                    }
                }
            }
            while (hits.includes(bottom)) {
                bottom = bottom + boardLength

                if (available.includes(bottom)) { // end of chain?
                    if (((bottom - square) / boardLength) + 1 <= shipMax) { // chain longer than max possible ship?
                        best.push(bottom)
                    }
                }
            }

            if (best.length === 0) { // hit square was isolated, i.e., first hit on a ship
                if (available.includes(left)) {
                    best.push(left)
                }
                if (available.includes(right)) {
                    best.push(right)
                }
                if (available.includes(top)) {
                    best.push(top)
                }
                if (available.includes(bottom)) {
                    best.push(bottom)
                }
            }

            index = randomInt(0, best.length) // random index
            const target = best[index]

            this.attack(target)
        }
    }

    placeShips() { // generate a random placement for ships
        function randomInt(min, max) {
            return Math.floor(Math.random() * (max - min) ) + min;
        }

        const available = []
        for (let i = 0; i < this.board.length ** 2; i++) {
            available.push(i)
        }

        for (let ship of this.ships) {
            const coords = []
            let vertical = false
            let reversed = false
            const boardLength = this.board.length

            if (randomInt(0, 2) === 0) { // generate 50/50 chance
                vertical = true
            }
            if (randomInt(0, 2) === 0) { // generate 50/50 chance
                reversed = true
            }

            if (!vertical) {
                if (!reversed) { // horizontal -->
                    while (true) {
                        const square = randomInt(0, boardLength ** 2)

                        let mod = boardLength
                        while (mod <= square) {
                            mod += boardLength
                        }
                        if (mod - square < ship.length) { // num is too far right on board, no space for ship
                            continue // reset & skip rest of loop
                        }

                        if (available.includes(square)) { // if false, restart loop
                            coords.push(square)
                            available.splice(square, 1)

                            for (let i = 1; i < ship.length; i++) {
                                const adjacent = square + i

                                if (available.includes(adjacent)) {
                                    coords.push(adjacent)
                                    available.splice(adjacent, 1)
                                } else {
                                    i = ship.length // restart loop
                                }
                            }
                            if (coords.length === ship.length) {
                                break
                            }
                        }
                    }
                } else { // horizontal <--
                    while (true) {
                        const square = randomInt(0, boardLength ** 2)

                        let mod = boardLength
                        while (mod <= square) {
                            mod += boardLength
                        }
                        if ((mod - boardLength) + square < ship.length) { // num is too far left on board, no space for ship
                            continue // reset & skip rest of loop
                        }

                        if (available.includes(square)) { // if false, restart loop
                            coords.push(square)
                            available.splice(square, 1)

                            for (let i = 1; i < ship.length; i++) {
                                const adjacent = square - 1

                                if (available.includes(adjacent)) {
                                    coords.push(adjacent)
                                    available.splice(adjacent, 1)
                                } else {
                                    i = ship.length // restart loop
                                }
                            }
                            if (coords.length === ship.length) {
                                break
                            }
                        }
                    }
                }
            } else {
                if (!reversed) { // vertical V top to bottom
                    while (true) {
                        const square = randomInt(0, (boardLength ** 2) - (ship.length - 1 * boardLength))

                        if (available.includes(square)) { // if false, restart loop
                            coords.push(square)
                            available.splice(square, 1)

                            for (let i = boardLength; i <= (ship.length - 1) * boardLength; i + boardLength) {
                                const adjacent = square + i

                                if (available.includes(adjacent)) {
                                    coords.push(adjacent)
                                    available.splice(adjacent, 1)
                                } else {
                                    i = ship.length // restart loop
                                }
                            }
                            if (coords.length === ship.length) {
                                break
                            }
                        }
                    }
                } else { // vertical ^ bottom to top
                    while (true) {
                        const square = randomInt((ship.length - 1 * boardLength), boardLength ** 2)

                        if (available.includes(square)) { // if false, restart loop
                            coords.push(square)
                            available.splice(square, 1)

                            for (let i = boardLength; i <= (ship.length - 1) * boardLength; i + boardLength) {
                                const adjacent = square - i

                                if (available.includes(adjacent)) {
                                    coords.push(adjacent)
                                    available.splice(adjacent, 1)
                                } else {
                                    i = ship.length // restart loop
                                }
                            }
                            if (coords.length === ship.length) {
                                break
                            }
                        }
                    }
                }
            }

            if (this.place(coords) !== true) { // place ship in backend, & if last ship, 'all ships placed' will be fired to game object's event listener and next round will start
                throw Error('Generated supposedly valid ship coordinates that failed to place!') // something is wrong w/ logic above
            }
        }
    }
}