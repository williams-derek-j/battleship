import Gameboard from './gameboard.js';

const board = new Gameboard(64)
board.quantity = 6
board.boatMax = 7
board.boatMin = 3

test('Place horizontal boat', () => {
    const board = new Gameboard(64)

    expect(board.place([0,1,2,3,4,5,6])).toBeTruthy()
})

test('Place vertical boat', () => {
    const board = new Gameboard(64)

    expect(board.place([9,17,25,33,41,49])).toBeTruthy()
})

test('Place all boats', () => {
    const board = new Gameboard(64)
    board.quantity = 6

    expect(board.place([0,1,2,3,4,5,6])).toBeTruthy()
    expect(board.place([0,1,2,3,4,5,6])).toBeFalsy()
    expect(board.place([9,17,25,33,41,49])).toBeTruthy()
    expect(board.place([10,18,26,34])).toBeTruthy()
    expect(board.place([]))
})

test('Hit boat', () => {
    const board = new Gameboard(64)

    const listener = jest.fn()

    board.events.on('hit', listener)

    expect(board.place([9,17,25,33,41,49])).toBeTruthy()
    expect(board.hit(9)).toBeTruthy() // Probably the board should take as little information as possible. Each player can listen and check if they possess a boat in the position of the successful hit, which I don't think should be too costly, even for both players each hit.

    expect(listener).toHaveBeenCalled()
    expect(listener).toHaveBeenCalledWith(expect.objectContaining({ pos: 9, turn: 0, dead: false, gameFinished: false })) // The listener represents either a player object or boat object that listeners for the board to emit hit events
})