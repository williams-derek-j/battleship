import Player from './Player';

export default class Computer extends Player {
    constructor(id, eventsP, gameSettings) {
        super(id, eventsP, gameSettings);

        this.name = null
        this.isReal = false
    }

    generateAttack() { // I should generate an adjacency list of a map of available squares. If no previous hits are found, target the square w/ most adjacents, i.e., most isolated square farthest away from nearest sink
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
        const targets = []

        for (let i = 0; i < boardLength ** 2; i++) {
            if (this.board.offense[i] === 0) { // 1 is a miss, -1 is a sunken square
                available.push(i) // find available targets
            } else if (this.board.offense[i] >= 2) {
                hits.push(i) // find previous hits on unsunken shits
            }
        }

        if (hits.length > 0) {
            let hit = hits[0]

            if (hits.length > 1) {
                const hitMap = {}

                for (let hit of hits) { // building adjacency list of contiguous hits
                    const adjacents = []

                    let mod = 0
                    while (mod <= hit) {
                        mod += boardLength
                    }

                    let left = (hit - 1) >= (mod - boardLength) ? hit - 1 : null // prevent wrapping
                    let right = (hit + 1) < mod ? hit + 1 : null
                    let top = hit - boardLength
                    let bottom = hit + boardLength

                    let adjacent = [] // adjacents array is grouped into subarrays: left, right, top, bottom
                    while (hits.includes(left)) {
                        adjacent.push(left)

                        left -= 1
                    }
                    adjacents.push(adjacent)

                    adjacent = []
                    while (hits.includes(right)) {
                        adjacent.push(right)

                        right +=  1
                    }
                    adjacents.push(adjacent)

                    adjacent = []
                    while (hits.includes(top)) {
                        adjacent.push(top)

                        top -= boardLength
                    }
                    adjacents.push(adjacent)

                    adjacent = []
                    while(hits.includes(bottom)) {
                        adjacent.push(bottom)

                        bottom += boardLength
                    }
                    adjacents.push(adjacent)

                    hitMap[hit] = adjacents
                }

                let current = Object.keys(hitMap)[0]
                for (let hit in hitMap) {
                    if (hitMap[hit].reduce((total, current) => { return total + current.length }, 0) > hitMap[current].reduce((total, current) => { return total + current.length }, 0)) {
                        current = hit
                    }
                }
                hit = Number(current)

                const horizontal = [...hitMap[hit][0], Number(hit), ...hitMap[hit][1]] // left, hit, right
                const vertical = [...hitMap[hit][2], Number(hit), ...hitMap[hit][3]] // top, hit, bottom

                if (horizontal.length >= vertical.length) {
                    let left = horizontal[0]

                    let mod = boardLength
                    while (mod <= left) {
                        mod += boardLength
                    }
                    let adjL = left - 1 > mod - boardLength ? left - 1 : null // ternary check prevents wrapping

                    let right = horizontal[horizontal.length - 1]
                    let adjR = right + 1 < mod ? right + 1 : null

                    if (available.includes(adjL)) {
                        if ((right - adjL) + 1 <= shipMax) { // for edge case, would line of hits + 1 be less than the longest length of surviving enemy ships?
                            targets.push(adjL)
                        }
                    } else { // prefer left, could rewrite to randomly pick left or right
                        if (available.includes(adjR)) {
                            if ((adjR - left) + 1 <= shipMax) {
                                targets.push(adjR)
                            }
                        }
                    }
                } else if (targets.length === 0) { // horizontal might have been longer but had no available targets
                    let top = vertical[0]
                    let adjT = top - boardLength
                    let bottom =  vertical[vertical.length - 1]
                    let adjB = bottom + boardLength

                    if (available.includes(adjT)) {
                        if (((bottom - adjT) / boardLength) + 1 <= shipMax) {
                            targets.push(adjT)
                        }
                    } else { // prefer top
                        if (available.includes(adjB)) {
                            if (((adjB - top) / boardLength) + 1 <= shipMax) {
                                targets.push(adjB)
                            }
                        }
                    }
                }
            }

            if (targets.length === 0) { // hit square was isolated
                let mod = 0
                while (mod <= hit) {
                    mod += boardLength
                }

                let left = (hit - 1) >= (mod - boardLength) ? hit - 1 : null // prevent wrapping
                let right = (hit + 1) < mod ? hit + 1 : null
                let top = hit - boardLength
                let bottom = hit + boardLength

                while (available.includes(left)) { // how much free space to left?
                    left -= 1

                    if (!available.includes(left)) { // found end of free space on left
                        if (!available.includes(right)) { // found end of free space on right -- there was none
                            if ((right - left) - 1 >= shipMin) {
                                targets.push(hit - 1) // no free space on right but enough on left to fit smallest ship, therefore 1 square left of hit is valid target
                            }
                        } else {
                            while (available.includes(right)) { // find free space on right
                                right += 1

                                if (!available.includes(right)) { // found end of free space on both sides
                                    if ((right - left) - 1 >= shipMin) { // amount of space can fit smallest ship? -- right and left are unavailable spaces, so don't + 1,  actually - 1
                                        targets.push(hit - 1) // if so, square is valid target
                                    }
                                }
                            }
                        }
                    }
                }
                if (targets.length === 0) { // prefer left, then right -- can only get here if there was no valid target to left
                    while (available.includes(right)) {
                        right += 1
                    }
                    if ((right - left) - 1 >= shipMin) { // bottom and top are both unavailable, so count squares between
                        if (available.includes(hit + 1)) {
                            targets.push(hit + 1)
                        }
                    }
                    if (targets.length === 0) { // prefer left, then right, then top -- can only get here if there was no valid target to left or right
                        while (available.includes(top)) {
                            top -= boardLength

                            if (!available.includes(top)) { // found end of free space on top
                                if (!available.includes(bottom)) { // found end of free space on bottom -- there was none
                                    if (((bottom - top) / boardLength) - 1 >= shipMin) {
                                        targets.push(hit - boardLength) // no free space on right but enough on left to fit smallest ship, therefore 1 square above hit is valid target
                                    }
                                } else {
                                    while (available.includes(bottom)) { // find free space on bottom
                                        bottom += boardLength

                                        if (!available.includes(bottom)) { // found end of free space on both sides
                                            if (((bottom - top) / boardLength) - 1 >= shipMin) { // amount of space can fit smallest ship? -- top and bottom are unavailable spaces, so don't + 1,  actually - 1
                                                targets.push(hit -  boardLength) // if so, square is valid target
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if (targets.length === 0) { // prefer left, then right, then top, finally bottom if none else
                            while (available.includes(bottom)) {
                                bottom += boardLength
                            }

                            if (((bottom - top) / boardLength) - 1 >= shipMin) { // bottom and top are both unavailable, so count squares between
                                if (available.includes(hit + boardLength)) {
                                    targets.push(hit + boardLength)
                                }
                            }
                        }
                    }
                }
                if (targets.length === 1) {
                    console.log('A generated target:', targets[0])
                    this.attack(targets[0]) // isolated hit square had valid targets adjacent
                } else {
                    throw Error(`isolated hit square somehow had no valid adjacent targets or had more than 1 assigned, something is wrong w/ logic -- targets.length: ${targets.length}`)
                }
            } else if (targets.length === 1) {
               console.log('B generated target:', targets[0])
                this.attack(targets[0]) // chain of hits had valid targets adjacent
            } else {
               throw Error('chain of hits somehow had more than 1 valid adjacent target assigned, something is wrong w/ logic')
            }
        } else { // no hits, pick random square or most isolated square (exploitable if not unpredictably switching between most-isolated and true random targets)
            function randomInt(min, max) {
                return Math.floor(Math.random() * (max - min) ) + min;
            }

            // write logic to find most isolated square using adjacency list, target being the node w/ most free adjacents

            const target = available[randomInt(0, available.length)]

            console.log('C generated target:', target)
            this.attack(target) // no previous hits, random target
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