import Player from './Player'
import Gameboard from './gameboard.js';

const board = new Gameboard(64)
board.quantity = 8
board.boatMax = 6 // default 6
board.boatMin = 3 // default 3

test('Place horizontal boat', () => {
    const board = new Gameboard(8)

    expect(board.place([0,1,2,3,4,5])).toBeTruthy()
    expect(board.alive.length).toBe(6)
})

test('Place vertical boat', () => {
    const board = new Gameboard(8)

    expect(board.place([9,17,25,33,41,49])).toBeTruthy()
    expect(board.alive.length).toBe(6)
})

test('Place invalid disjointed boat', () => {
    const board = new Gameboard(8)

    expect(board.place([0,5,6,4,8,10])).toBeFalsy()
    expect(board.alive.length).toBe(0)
})

test('Place invalid horizontal boat', () => {
    const board = new Gameboard(8)

    expect(board.place([0,1,2,4,5,6])).toBeFalsy()
    expect(board.alive.length).toBe(0)
})

test('Place invalid vertical boat', () => {
    const board = new Gameboard(8)

    expect(board.place([8,17,25,33,41,49])).toBeFalsy()
    expect(board.alive.length).toBe(0)
})

test('Place invalid offscreen horizontal boat', () => {
    const board = new Gameboard(8)

    expect(board.place([-1,0,1,2,3])).toBeFalsy()
    expect(board.alive.length).toBe(0)
})

test('Place invalid offscreen vertical boat', () => {
    const board = new Gameboard(8)

    expect(board.place([25,33,41,49,57,65])).toBeFalsy()
    expect(board.alive.length).toBe(0)
})

test('Place invalid offscreen wrapping horizontal boat', () => {
    const board = new Gameboard(8)

    expect(board.place([5,6,7,8,9])).toBeFalsy()
    expect(board.alive.length).toBe(0)
})

test('Place invalid offscreen wrapping vertical boat', () => {
    const board = new Gameboard(8)

    expect(board.place([49,57,2,10])).toBeFalsy()
    expect(board.alive.length).toBe(0)
})

test('Place invalid duplicate horizontal boat', () => {
    const board = new Gameboard(8)

    expect(board.place([0,1,2,3,4,5])).toBeTruthy()
    expect(board.alive.length).toBe(6)
    expect(board.place([0,1,2,3,4,5])).toBeFalsy()
    expect(board.alive.length).toBe(6)
})

test('Place invalid duplicate horizontal boat single overlap', () => {
    const board = new Gameboard(8)

    expect(board.place([0,1,2,3])).toBeTruthy()
    expect(board.alive.length).toBe(4)
    expect(board.place([3,4,5,6])).toBeFalsy()
    expect(board.alive.length).toBe(4)
})

test('Place invalid duplicate vertical boat', () => {
    const board = new Gameboard(8)

    expect(board.place([9,17,25,33,41,49])).toBeTruthy()
    expect(board.alive.length).toBe(6)
    expect(board.place([9,17,25,33,41,49])).toBeFalsy()
    expect(board.alive.length).toBe(6)
})

test('Place invalid duplicate vertical boat single overlap', () => {
    const board = new Gameboard(8)

    expect(board.place([9,17,25,33])).toBeTruthy()
    expect(board.alive.length).toBe(4)
    expect(board.place([33,41,49,57])).toBeFalsy()
    expect(board.alive.length).toBe(4)
})

test('Hit boat', () => {
    const player = new Player('p1', 1)
    const board = new Gameboard(8)

    const listener = jest.fn()

    board.events.on('hit', listener)

    expect(board.place([9,17,25,33,41,49])).toBeTruthy()
    expect(board.alive.length).toBe(6)
    expect(board.attack(9, player)).toBeTruthy() // Probably the board should take as little information as possible.
    expect(board.alive.length).toBe(5)

    expect(listener).toHaveBeenCalled()
    expect(listener).toHaveBeenCalledWith(expect.objectContaining({ pos: 9, allShipsDead: false })) // The listener represents either a player object or boat object that listeners for the board to emit hit events
})

test('Miss attack', () => {
    const player = new Player('p1', 1)
    const board = new Gameboard(8)

    const listener = jest.fn()

    board.events.on('miss', listener)

    expect(board.place([8,16,24,32,40,48])).toBeTruthy()
    expect(board.attack(9, player)).toBeFalsy() // Probably the board should take as little information as possible.

    expect(listener).toHaveBeenCalled()
    expect(listener).toHaveBeenCalledWith(expect.objectContaining({ pos: 9 })) // The listener represents either a player object or boat object that listeners for the board to emit hit events
})

// test('Place all boats', () => {
//     const board = new Gameboard(64)
//     board.quantity = 8 // 3, 4, 5, 6-square boat lengths
//
//     expect(board.place([0,1,2,3,4,5])).toBeTruthy() // P1, 1, 6
//     expect(board.place([0,1,2,3,4,5])).toBeTruthy() // P2, 1, 6
//     expect(board.place([9,17,25,33,41,49])).toBeTruthy() // P2, 1, 6
//     expect(board.place([10,18,26,34])).toBeTruthy() // P1, 2, 4
//     expect(board.place([11,19,27,35,43])).toBeTruthy() // P2, 2, 5
//     expect(board.place([27,28,29])).toBeFalsy() // P1, 3, 3
//     expect(board.place([]))
// })