import Player from './Player';

export default class Computer extends Player {
    constructor(id, eventsP, gameSettings) {
        super(id, eventsP, gameSettings);

        this.name = null
    }

    generatePlacement() { // generate a random placement for ships
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
                        const num = randomInt(0, boardLength ** 2)

                        let mod = boardLength
                        while (mod <= num) {
                            mod += boardLength
                        }
                        if (mod - num < ship.length) { // num is too far right on board, no space for ship
                            continue // reset & skip rest of loop
                        }

                        if (available.includes(num)) { // if false, restart loop
                            coords.push(num)
                            available.splice(num, 1)

                            for (let i = 1; i < ship.length; i++) {
                                if (available.includes(num + i)) {
                                    coords.push(num + i)
                                    available.splice(num + i, 1)
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
                        const num = randomInt(0, boardLength ** 2)

                        let mod = boardLength
                        while (mod <= num) {
                            mod += boardLength
                        }
                        if ((mod - boardLength) + num < ship.length) { // num is too far left on board, no space for ship
                            continue // reset & skip rest of loop
                        }

                        if (available.includes(num)) { // if false, restart loop
                            coords.push(num)
                            available.splice(num, 1)

                            for (let i = 1; i < ship.length; i++) {
                                if (available.includes(num - i)) {
                                    coords.push(num - i)
                                    available.splice(num - i, 1)
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
                        const num = randomInt(0, (boardLength ** 2) - (ship.length - 1 * boardLength))

                        if (available.includes(num)) { // if false, restart loop
                            coords.push(num)
                            available.splice(num, 1)

                            for (let i = 1; i < ship.length; i++) {
                                if (available.includes(num + boardLength)) {
                                    coords.push(num + boardLength)
                                    available.splice(num + boardLength, 1)
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
                        const num = randomInt((ship.length - 1 * boardLength), boardLength ** 2)

                        if (available.includes(num)) { // if false, restart loop
                            coords.push(num)
                            available.splice(num, 1)

                            for (let i = 1; i < ship.length; i++) {
                                if (available.includes(num - boardLength)) {
                                    coords.push(num - boardLength)
                                    available.splice(num - boardLength, 1)
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
        }
    }
}