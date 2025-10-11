import Player from './Player';

export default class Computer extends Player {
    constructor(id, eventsP, gameSettings) {
        super(id, eventsP, gameSettings);

        this.name = null
        this.isReal = false
    }

    generateAttack() {
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
        let hits = [] // squares that have been attacked but not sunk
        const targets = []

        for (let i = 0; i < boardLength ** 2; i++) {
            if (this.board.offense[i] === 0) { // on offense 1 is a miss, 2 is a hit, -1 is a sunken square; on defense 1 is occupied, 2 is a hit, 3 is a miss
                available.push(i) // find available targets
            } else if (this.board.offense[i] >= 2) {
                hits.push(i) // find previous hits on unsunken ships
            }
        }

        if (hits.length > 0) {
            let hit = hits[0]

            if (hits.length > 1) {
                const hitMap = {}

                for (let hit of hits) { // building adjacency list of contiguous hits
                    const adjacents = []

                    let mod = hit - (hit % boardLength)

                    let left = (hit - 1) >= mod ? hit - 1 : null // prevent wrapping
                    let right = (hit + 1) < mod + boardLength ? hit + 1 : null
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
                // console.log('hitMap',hitMap)

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
                    // console.log('horiz', horizontal, 'available', available)

                    let mostL = horizontal[0] // most left hit

                    let mod = mostL - (mostL % boardLength)

                    let adjL = mostL - 1 >= mod ? mostL - 1 : null // available square to left of horizontal chain or null, ternary check prevents wrapping
                    let endL = mostL - 1 // first unavailable square to left or end of grid/wrapped to previous row (intentionally, still works for space calculation)
                    while (available.includes(endL) && endL >= mod) {
                        endL -= 1
                    }

                    // console.log('l,adjl,endl',mostL,adjL,endL)

                    let mostR = horizontal[horizontal.length - 1] // most right hit
                    let adjR = mostR + 1 < mod + boardLength ? mostR + 1 : null  // available square to right of horizontal chain or null, ternary check prevents wrapping
                    let endR = mostR + 1 // first unavailable square to right or end of grid/wrapped to next row (intentionally, still works for space calculation)
                    while (available.includes(endR) && endR < mod + boardLength) {
                        endR += 1
                    }

                    // console.log('r,adjr,endr',mostR,adjR,endR)

                    const space = (endR - endL) - 1

                    // console.log('space', space)

                    if (available.includes(adjL)) {
                        const newLen = (mostR - adjL) + 1

                        if (newLen <= shipMax && space >= shipMin) { // for edge case, would line of hits + 1 be less than the longest length of surviving enemy ships?
                            targets.push(adjL)
                        }
                    } else { // prefer left, could rewrite to randomly pick left or right
                        if (available.includes(adjR)) {
                            const newLen = (adjR - mostL) + 1

                            if (newLen <= shipMax && space >= shipMin) {
                                targets.push(adjR)
                            }
                        }
                    }
                }
                if (targets.length === 0) { // horizontal might have been longer but had no available targets
                    // console.log('vert', vertical, 'available', available)

                    let mostT = vertical[0] // top of chain of hits
                    let adjT = mostT - boardLength // available square above top of chain or null
                    let endT = mostT - boardLength // first unavailable square or end of grid + 1
                    while (available.includes(endT) && endT >= 0) {
                        endT -= boardLength
                    }
                    // console.log('t,adjt,endT',mostT,adjT,endT)

                    let mostB =  vertical[vertical.length - 1] // bottom of chain of hits
                    let adjB = mostB + boardLength // available square below below of chain or null
                    let endB = mostB + boardLength // first unavailable square or end of grid + 1
                    while (available.includes(endB) && endB <= (boardLength ** 2)) {
                        endB += boardLength
                    }
                    // console.log('b,mostb,endb',mostB,adjB,endB)

                    const space = ((endB - endT) / boardLength) - 1
                    // console.log('space', space)

                    if (available.includes(adjT)) {
                        const newLen = ((mostB - adjT) / boardLength) + 1

                        if (newLen <= shipMax && space >= shipMin) {
                            targets.push(adjT)
                        }
                    } else { // prefer top
                        if (available.includes(adjB)) {
                            const newLen = ((adjB - mostT) / boardLength) + 1

                            if (newLen <= shipMax && space >= shipMin) {
                                targets.push(adjB)
                            }
                        }
                    }
                }
            }

            if (targets.length === 0) { // hit square was isolated or had no valid targets along chain
                let mod = hit - (hit % boardLength)

                let left = hit - 1
                let endL = left
                while (available.includes(endL) && endL >= mod) {
                    endL -= 1
                }

                let right = hit + 1
                let endR = right
                while (available.includes(endR) && endR <= mod + boardLength) {
                    endR += 1
                }

                if ((endR - endL) - 1 >= shipMin) {
                    if (available.includes(left)) {
                        targets.push(left)
                    } else if (available.includes(right)) {
                        targets.push(right)
                    }
                } else {
                    let top = hit - boardLength
                    let endT = top
                    while (available.includes(endT) && endT >= 0) {
                        endT -= boardLength
                    }

                    let bottom = hit + boardLength
                    let endB = bottom
                    while (available.includes(endB) && endB <= (boardLength ** 2)) {
                        endB += boardLength
                    }

                    if (((endB - endT) / boardLength) - 1 >= shipMin) {
                        if (available.includes(top)) {
                            targets.push(top)
                        } else if (available.includes(bottom)) {
                            targets.push(bottom)
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
                this.attack(targets[0]) // chain of hits can't not have valid targets when it gets to the else if above, if it did it would end up in the A scope for isolated hit square
            } else {
               throw Error('chain of hits somehow had more than 1 valid adjacent target assigned, something is wrong w/ logic')
            }
        } else { // no hits, pick random square or most isolated square (exploitable if not unpredictably switching between most-isolated and true random targets)
            function randomInt(min, max) {
                return Math.floor(Math.random() * (max - min) ) + min;
            }

            const valid = [] // squares adjacent to generated target who indicate that a ship fits in that direction

            while (valid.length === 0) {
                const index = randomInt(0, available.length)
                const target = available[index]
                console.log('generated random target:', target)

                // let mod = (target - (target % boardLength)) + boardLength

                // let left = target - 1) >= (mod - boardLength) ? target - 1 : target // prevent wrapping
                let left = target - 1
                // let right = (target + 1) < mod ? target + 1 : target
                let right = target + 1
                let top = target - boardLength
                let bottom = target + boardLength

                while (available.includes(left) && left !== target) { // LEFT - how much free space to left? prefer left, then right
                    left -= 1

                    if (!available.includes(left)) { // found end of free space on left
                        if (!available.includes(right)) { // found end of free space on right -- there was none
                            if ((right - left) - 1 >= shipMin) {
                                valid.push(target - 1) // no free space on right but enough on left to fit smallest ship, therefore 1 square left of hit is valid target
                            }
                        } else {
                            while (available.includes(right)) { // find free space on right
                                right += 1

                                if (!available.includes(right)) { // found end of free space on both sides
                                    if ((right - left) - 1 >= shipMin) { // amount of space can fit smallest ship? -- right and left are unavailable spaces, so don't + 1,  actually - 1
                                        valid.push(target - 1) // if so, square is valid target
                                    }
                                }
                            }
                        }
                    }
                }
                if (valid.length === 0) { // RIGHT - preferred left but was none, now check right -- can only get here if there was no valid target to left
                    while (available.includes(right) && right !== target) {
                        right += 1
                    }
                    if ((right - left) - 1 >= shipMin) { // bottom and top are both unavailable, so count squares between
                        if (available.includes(target + 1)) {
                            valid.push(target + 1)
                        }
                    }
                    if (valid.length === 0) { // TOP - prefer left, then right, then top -- can only get here if there was no valid target to left or right
                        while (available.includes(top)) {
                            top -= boardLength

                            if (!available.includes(top)) { // found end of free space on top
                                if (!available.includes(bottom)) { // found end of free space on bottom -- there was none
                                    if (((bottom - top) / boardLength) - 1 >= shipMin) {
                                        valid.push(target - boardLength) // no free space on right but enough on left to fit smallest ship, therefore 1 square above hit is valid target
                                    }
                                } else {
                                    while (available.includes(bottom)) { // find free space on bottom
                                        bottom += boardLength

                                        if (!available.includes(bottom)) { // found end of free space on both sides
                                            if (((bottom - top) / boardLength) - 1 >= shipMin) { // amount of space can fit smallest ship? -- top and bottom are unavailable spaces, so don't + 1,  actually - 1
                                                valid.push(target -  boardLength) // if so, square is valid target
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if (valid.length === 0) { // BOTTOM -- prefer left, then right, then top, finally bottom if none else
                            while (available.includes(bottom)) {
                                bottom += boardLength
                            }

                            if (((bottom - top) / boardLength) - 1 >= shipMin) { // bottom and top are both unavailable, so count squares between
                                if (available.includes(target + boardLength)) {
                                    valid.push(target + boardLength)
                                }
                            }
                        }
                    }
                }
                if (valid.length === 1) {
                    console.log('C generated target:')
                    this.attack(target) // isolated hit square had valid targets adjacent
                } else {
                    available.splice(index, 1)

                    if (available.length === 0) {
                        throw Error("Computer couldn't find valid target to generate, all available spaces invalid.")
                    } else {
                        console.log("Computer generated target didn't have space to fit smallest ship! Trying again with new target.")
                    }
                }
            }
            // write logic to find most isolated square using adjacency list, target being the node w/ most free adjacents
        }
    }

    generateHorizontal(square, ship) {
        const boardLength = this.board.length
        const coords = []

        let mod = square - (square % boardLength)
        if ((mod + boardLength) - square < ship.length) { // num is too far right on board, no space for ship
            square -= ship.length - ((mod + boardLength) - square)
        }

        coords.push(square)

        for (let i = 1; i < ship.length; i++) {
            const adjacent = square + i
            coords.push(adjacent)
        }

        return coords
    }

    generateVertical(square, ship) {
        const boardLength = this.board.length
        const coords = []

        coords.push(square)

        for (let i = boardLength; i <= (ship.length - 1) * boardLength; i += boardLength) {
            const adjacent = square + i
            coords.push(adjacent)
        }

        return coords
    }

    placeShips() { // generate a random placement for ships
        const boardLength = this.board.length
        let coords = []
        let exhausted = false

        for (let ship of this.ships) {
            function randomInt(min, max) {
                return Math.floor(Math.random() * (max - min)) + min;
            }

            let vertical, square
            if (randomInt(0, 2) === 0) { // generate 50/50 chance
                vertical = true

                square = randomInt(0, (boardLength ** 2) - ((ship.length - 1) * boardLength))
                coords = this.generateVertical(square, ship)
            } else {
                vertical = false

                square = randomInt(0, boardLength ** 2)

                let mod = square - (square % boardLength)
                if ((mod + boardLength) - square < ship.length) { // num is too far right on board, no space for ship
                    square -= ship.length - ((mod + boardLength) - square) // check this again (mod + boardLength) - square was mod - square
                }

                coords = this.generateHorizontal(square, ship)
            }

            while (this.place(coords) !== true) { // Try first orientation (i.e., vertical or horizontal). If didn't have room, try second. Still doesn't fit? Generate new square.
                if (vertical && !exhausted) {
                    exhausted = true
                    vertical = false

                    coords = this.generateHorizontal(square, ship)
                } else if (!vertical && !exhausted) {
                    exhausted = true
                    vertical = true

                    let mod = square - (square % boardLength)
                    if ((mod + boardLength) - square < ship.length) { // num is too far right on board, no space for ship
                        square -= ship.length - (mod - square)
                    }

                    coords = this.generateVertical(square, ship)
                } else {
                    if (randomInt(0, 2) === 0) { // 50/50 chance to decide horizontal or vertical ship placement
                        vertical = true
                        exhausted = false

                        square = randomInt(0, (boardLength ** 2) - ((ship.length - 1) * boardLength))
                        coords = this.generateVertical(square, ship)
                    } else {
                        vertical = false
                        exhausted = false

                        square = randomInt(0, boardLength ** 2)
                        coords = this.generateHorizontal(square, ship)
                    }
                }
            }
        }
    }
}