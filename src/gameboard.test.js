import Gameboard from './gameboard.js';

const board = new Gameboard(64)
board.quantity = 8
board.boatMax = 6 // default 6
board.boatMin = 3 // default 3

test('Place horizontal boat', () => {
    const board = new Gameboard(64)

    expect(board.place([0,1,2,3,4,5,6], 1)).toBeTruthy()
})

test('Place vertical boat', () => {
    const board = new Gameboard(64)

    expect(board.place([9,17,25,33,41,49], 1)).toBeTruthy()
})

// test('Place all boats', () => {
//     const board = new Gameboard(64)
//     board.quantity = 4 // 3, 4, 5, 6-square boat lengths
//
//     expect(board.place([0,1,2,3,4,5])).toBeTruthy() // P1, 1, 6
//     expect(board.place([0,1,2,3,4,5])).toBeTruthy() // P2, 1, 6
//     expect(board.place([9,17,25,33,41,49])).toBeTruthy() // P2, 1, 6
//     expect(board.place([10,18,26,34])).toBeTruthy() // P1, 2, 4
//     expect(board.place([11,19,27,35,43])).toBeTruthy() // P2, 2, 5
//     expect(board.place([27,28,29])).toBeFalsy() // P1, 3, 3
//     expect(board.place([]))
// })

test('Hit boat', () => {
    const board = new Gameboard(64)
    board.turn = 1 // for testing so P2 attacks P1

    const listener = jest.fn()

    board.events.on('hit', listener)

    expect(board.place([9,17,25,33,41,49], 1)).toBeTruthy()
    expect(board.attack(9)).toBeTruthy() // Probably the board should take as little information as possible.

    expect(listener).toHaveBeenCalled()
    expect(listener).toHaveBeenCalledWith(expect.objectContaining({ pos: 9, turn: 1, gameFinished: false })) // The listener represents either a player object or boat object that listeners for the board to emit hit events
})