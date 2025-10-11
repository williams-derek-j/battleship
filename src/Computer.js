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
                console.log('hitMap',hitMap)

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
                    console.log('horiz', horizontal, 'available', available)

                    let mostL = horizontal[0] // most left hit

                    let mod = mostL - (mostL % boardLength)

                    let adjL = mostL - 1 >= mod ? mostL - 1 : null // available square to left of horizontal chain or null, ternary check prevents wrapping
                    let endL = mostL - 1 // first unavailable square to left or end of grid/wrapped to previous row (intentionally, still works for space calculation)
                    while (available.includes(endL) && endL >= mod) {
                        endL -= 1
                    }

                    console.log('l,adjl,endl',mostL,adjL,endL)

                    let mostR = horizontal[horizontal.length - 1] // most right hit
                    let adjR = mostR + 1 < mod + boardLength ? mostR + 1 : null  // available square to right of horizontal chain or null, ternary check prevents wrapping
                    let endR = mostR + 1 // first unavailable square to right or end of grid/wrapped to next row (intentionally, still works for space calculation)
                    while (available.includes(endR) && endR < mod + boardLength) {
                        endR += 1
                    }

                    console.log('r,adjr,endr',mostR,adjR,endR)

                    const space = (endR - endL) - 1

                    console.log('lrspace', space)

                    if (available.includes(adjL)) {
                        const newLen = (mostR - adjL) + 1
                        console.log('lnewlen',newLen,'shipMax',shipMax,'shipMin',shipMin)

                        if (newLen <= shipMax && space >= shipMin) { // for edge case, would line of hits + 1 be less than the longest length of surviving enemy ships?
                            targets.push(adjL)
                        }
                    }
                    if (available.includes(adjR) && targets.length === 0) { // prefer left, could rewrite to randomly pick left or right
                        if (available.includes(adjR)) {
                            const newLen = (adjR - mostL) + 1
                            console.log('lnewlen',newLen,'shipMax',shipMax,'shipMin',shipMin)

                            if (newLen <= shipMax && space >= shipMin) {
                                targets.push(adjR)
                            }
                        }
                    }
                }
                if (targets.length === 0) { // horizontal might have been longer but had no available targets
                    console.log('vert', vertical, 'available', available)

                    let mostT = vertical[0] // top of chain of hits
                    let adjT = mostT - boardLength // available square above top of chain or null
                    let endT = mostT - boardLength // first unavailable square or end of grid + 1
                    while (available.includes(endT) && endT >= 0) {
                        endT -= boardLength
                    }
                    console.log('t,adjt,endT',mostT,adjT,endT)

                    let mostB =  vertical[vertical.length - 1] // bottom of chain of hits
                    let adjB = mostB + boardLength // available square below below of chain or null
                    let endB = mostB + boardLength // first unavailable square or end of grid + 1
                    while (available.includes(endB) && endB < (boardLength ** 2)) {
                        endB += boardLength
                    }
                    console.log('b,mostb,endb',mostB,adjB,endB)

                    const space = ((endB - endT) / boardLength) - 1
                    console.log('tbspace', space)

                    if (available.includes(adjT)) {
                        const newLen = ((mostB - adjT) / boardLength) + 1
                        console.log('TnewLen',newLen,'shipMax',shipMax,'shipMin',shipMin)

                        if (newLen <= shipMax && space >= shipMin) {
                            targets.push(adjT)
                        }
                    }
                    if (available.includes(adjB) && targets.length === 0) { // prefer top
                        if (available.includes(adjB)) {
                            const newLen = ((adjB - mostT) / boardLength) + 1
                            console.log('BnewLen',newLen,'shipMax',shipMax,'shipMin',shipMin)

                            if (newLen <= shipMax && space >= shipMin) {
                                targets.push(adjB)
                            }
                        }
                    }
                }
                if (targets.length === 0) {
                    console.log("hit chain had no valid adjacent targets -- fake line/ship (i.e., row of squares from multiple vertical ships")
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
                while (available.includes(endR) && endR < mod + boardLength) {
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
                    while (available.includes(endB) && endB < (boardLength ** 2)) {
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
        } else { // no standing hits on board, only empty squares or sunken ships, so pick random square or most isolated square (exploitable if not unpredictably switching between most-isolated and true random targets)
            function randomInt(min, max) {
                return Math.floor(Math.random() * (max - min) ) + min;
            }

            let valid = false // squares adjacent to generated target who indicate that a ship fits in that direction

            while (valid === false) {
                const index = randomInt(0, available.length)
                const target = available[index]
                console.log('generated random target:', target, 'available', available)

                let mod = target - (target % boardLength)
                console.log('mod',mod)

                let left = target - 1
                let endL = left
                while (available.includes(endL) && endL >= mod) {
                    endL -= 1
                }
                console.log('l,endL',left,endL)

                let right = target + 1
                let endR = right
                while (available.includes(endR) && endR < mod + boardLength) {
                    endR += 1
                }
                console.log('r,endR',right,endR)

                if ((endR - endL) - 1 >= shipMin) {
                    if (available.includes(target)) {
                        valid = true
                    }
                } else {
                    let top = target - boardLength
                    let endT = top
                    while (available.includes(endT) && endT >= 0) {
                        endT -= boardLength
                    }

                    let bottom = target + boardLength
                    let endB = bottom
                    while (available.includes(endB) && endB < (boardLength ** 2)) {
                        endB += boardLength
                    }

                    if (((endB - endT) / boardLength) - 1 >= shipMin) {
                        if (available.includes(target)) {
                            valid = true
                        }
                    }
                }
                if (valid) {
                    console.log('C generated target:')

                    this.attack(target) // isolated hit square had valid targets adjacent
                } else {
                    available.splice(index, 1)

                    if (available.length === 0) {
                        throw Error("Computer couldn't find valid target to generate, all available spaces invalid.")
                    } else {
                        // this.board.offense[target] = -2 // mark as an invalid square so we don't have to recheck later

                        console.log("Computer generated target didn't have space to fit smallest ship! Trying again with new target.")
                    }
                }
            }
        }
    }

    generateHorizontal(square, len, available, reversed = false) {
        const boardLength = this.board.length
        const coords = []

        let mod = square - (square % boardLength) // e.g., 0 w/ boardL of 8

        if ((mod + boardLength) - square < len) { // not enough space on right?
            if (square - (mod - 1) < len) { // not enough space on left?
                return []
            } else {
                reversed = true
            }
        } else {
            reversed = false
        }

        coords.push(square)

        for (let i = 1; i < len; i++) {
            if (!reversed) {
                const adjacent = square + i

                if (available.includes(adjacent)) {
                    coords.push(adjacent)
                } else {
                    break
                }
            } else {
                const adjacent = square - i

                if (available.includes(adjacent)) {
                    coords.push(adjacent)
                } else {
                    break
                }
            }
        }

        if (coords.length === len) {
            if (!reversed) {
                return coords
            } else {
                return coords.reverse()
            }
        } else {
            return []
        }
    }

    generateVertical(square, len, available, reversed = false) {
        const boardLength = this.board.length
        const coords = []

        const mod = square - (square % boardLength) // e.g., 0 w/ boardL of 8
        const modH = (mod + boardLength) - 1 // e.g., 7 w/ boardL of 8

        const max = (boardLength ** 2) - 1

        if (((max - modH) / boardLength) < len) { // enough space on bottom?
            if ((mod / boardLength) + 1 < len) { // enough space on top?
                return []
            } else {
                reversed = true
            }
        } else {
            reversed = false
        }

        coords.push(square)

        for (let i = boardLength; i <= (len - 1) * boardLength; i += boardLength) {
            if (!reversed) {
                const adjacent = square + i

                if (available.includes(adjacent)) {
                    coords.push(adjacent)
                } else {
                    break
                }
            } else {
                const adjacent = square - i

                if (available.includes(adjacent)) {
                    coords.push(adjacent)
                } else {
                    break
                }
            }
        }

        if (coords.length === len) {
            if (!reversed) {
                return coords
            } else {
                return coords.reverse()
            }
        } else {
            return []
        }
    }

    placeShips() { // generate a random placement for ships
        const boardLength = this.board.length

        const available = []
        for (let i = 0; i < boardLength ** 2; i++) {
            available.push(i)
        }
        let possible = [...available]

        let shipsReversed = []
        if (this.ships[this.ships.length - 1].length > this.ships[0].length) { // place longest ship first, more efficient and otherwise might introduce bug with not having room left for longest ships
            shipsReversed = [...this.ships].reverse() // reverse for longest ship first
        }

        for (let ship of shipsReversed) {
            // console.log('available remaining:',available.length,'-- possible remaining',possible.length)

            function randomInt(min, max) {
                return Math.floor(Math.random() * (max - min)) + min;
            }
            const len = ship.length

            while (true) {
                possible = [...available]

                let coords = []

                let index = randomInt(0, available.length - 1)
                let square = possible[index]
                // console.log('square',square)

                let vertical
                vertical = randomInt(0, 2) === 0;
                // console.log('vertical',vertical)

                if (!vertical) {
                    coords = this.generateHorizontal(square, len, available)
                    if (coords.length === 0) {
                        coords = this.generateVertical(square, len, available)
                    }
                } else {
                    coords = this.generateVertical(square, len, available)
                    if (coords.length === 0) {
                        coords = this.generateHorizontal(square, len, available)
                    }
                }

                // console.log('coords gen',coords)
                if (coords.length === len) {
                    const result = this.place(coords)

                    if (result) {
                        for (const square of coords) {
                            available.splice(available.indexOf(square), 1)
                            possible.splice(possible.indexOf(square), 1)
                        }
                        break
                    }
                } else {
                    possible.splice(possible.indexOf(square), 1)
                    // console.log('recheck', square, possible)
                }
            }
        }
    }
}