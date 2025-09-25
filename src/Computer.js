import Player from './Player';

export default class Computer extends Player {
    constructor(id, eventsP, gameSettings) {
        super(id, eventsP, gameSettings);

        this.name = null
    }

    generateAttack() { // I should generate an adjacency list of a map of available squares. If no previous hits are found, target the square w/ most adjacents, i.e., most isolated square farthest away from nearest sink
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
        const shipMin = alive[0].length
        const shipMax = alive[alive.length - 1].length

        const available = [] // available targets, i.e., never been attacked before
        const hits = [] // squares that have been attacked but not sunk

        for (let i = 0; i < boardLength ** 2; i++) {
            if (this.board.offense[i] === 0) {
                available.push(i)
            } else if (this.board.offense[i] >= 2) {
                hits.push(i)
            }
        }

        if (hits.length > 0) {
            const square = hits[randomInt(0, hits.length)]

            let left = square - 1
            let right = square + 1
            let top = square - boardLength
            let bottom = square + boardLength

            const targets = []

            while (hits.includes(left)) { // find if there are multiple hits in a row, meaning most likely another ship square is aligned we ought to attack
                left = left - 1

                if (available.includes(left)) { // left of left
                    targets.push(left - 1)
                }
            }
            while (hits.includes(right)) {
                right = right + 1

                if (available.includes(right)) { // right of right
                    targets.push(right + 1)
                }
            }
            while (hits.includes(top)) {
                top = top - boardLength

                if (available.includes(top)) { // top of top
                    targets.push(top - boardLength)
                }
            }
            while (hits.includes(bottom)) {
                bottom = bottom + boardLength

                if (available.includes(bottom)) { // end of chain?
                    targets.push(bottom)
                }
            }

            if (targets.length === 0) { // hit square was isolated, i.e., first hit on a ship
                while (available.includes(left)) { // how much free space to left?
                    left = left - 1

                    if (!available.includes(left)) { // found end of free space
                        if (square - left <= shipMax) { // amount of space can fit largest ship?
                            targets.push(square) // if so, square is valid target
                        }
                    }
                }
                if (targets.length === 0) {
                    while (available.includes(right)) {
                        right = right + 1

                        if (!available.includes(right)) {
                            if (right - square <= shipMax) {
                                targets.push(square)
                            }
                        }
                    }
                    if (targets.length === 0) {
                        while (available.includes(top)) {
                            top = top - boardLength

                            if (!available.includes(top)) { //
                                if ((square - top / boardLength) <= shipMax) {
                                    targets.push(square)
                                }
                            }
                        }
                        if (targets.length === 0) {
                            if (available.includes(bottom)) {
                                bottom = bottom + boardLength

                                if (!available.includes(bottom)) {
                                    if ((bottom - square) / boardLength <= shipMax) {
                                        targets.push(square)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } else {
            // logic to find most isolated square
        }

        const target = targets[randomInt(0, targets.length)]

        this.attack(target)
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