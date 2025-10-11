import EventEmitter from './Events'
import Computer from './Computer'

test('Place ships', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP, { playerCount: 2, boardLength: 8, shipsPerPlayer: 4, shipLengths: [3,4,5,6,7,8] })

    const listener = jest.fn()
    comp.eventsP.on("All ships placed", listener)

    comp.placeShips()

    expect(listener).toHaveBeenCalled()
    expect(comp.allShipsPlaced).toEqual(true)
})

test('Attack empty board', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP, { playerCount: 2, boardLength: 8, shipsPerPlayer: 4, shipLengths: [3,4,5,6] })

    const listener = jest.fn()
    comp.eventsP.on('Attack', listener)

    comp.generateAttack()

    expect(listener).toHaveBeenCalled()

    expect(listener.mock.calls[0][0]).toBeGreaterThanOrEqual(0)
    expect(listener.mock.calls[0][0]).toBeLessThan(comp.board.length ** 2)
})

test('Attack lone hit', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP, { playerCount: 2, boardLength: 8, shipsPerPlayer: 4, shipLengths: [3,4,5,6] })

    comp.board.offense[9] = 2
        // [   0 _,X,_,_,_,_,_,_,8
        //     8 X,H,X,_,_,_,_,_,16
        //     16_,X,_,_,_,_,_,_,24
        //     24_,_,_,_,_,_,_,_,32
        //     32_,_,_,_,_,_,_,_,40
        //     40_,_,_,_,_,_,_,_,48
        //     48_,_,_,_,_,_,_,_,56
        //     56_,_,_,_,_,_,_,_,64  ]

    const listener = jest.fn()
    comp.eventsP.on('Attack', listener)

    comp.generateAttack()

    expect(listener).toHaveBeenCalled()
    expect([1,8,10,17]).toContain(listener.mock.calls[0][0])
})

test('Attack w/ empty space measurement', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP, { playerCount: 2, boardLength: 8, shipsPerPlayer: 4, shipLengths: [3,4,5,6] })

    for (let i = 0; i < comp.board.offense.length; i++) {
        comp.board.offense[i] = -1
    }
    comp.board.offense[10] = 0
    comp.board.offense[11] = 0

    // [   S,S,S,S,S,S,S,S,
    //     S,S,_,_,S,S,S,S,
    //     S,S,S,S,S,S,S,S,
    //     S,S,S,S,S,S,S,S,
    //     S,S,S,S,S,S,S,S,
    //     S,S,S,S,S,S,S,S,
    //     S,S,S,S,S,S,S,S,
    //     S,S,S,S,S,S,S,S,    ]

    const listener = jest.fn()
    comp.eventsP.on('Attack', listener)

    expect(listener).not.toHaveBeenCalled()
    expect(() => comp.generateAttack()).toThrow()
})

test('Attack pair of hits', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP, { playerCount: 2, boardLength: 8, shipsPerPlayer: 4, shipLengths: [3,4,5,6] })

    comp.board.offense[9] = 2
    comp.board.offense[10] = 2

    // [   _,_,_,_,_,_,_,_,
    //     X,H,H,X,_,_,_,_,
    //     _,_,_,_,_,_,_,_,
    //     _,_,_,_,_,_,_,_,
    //     _,_,_,_,_,_,_,_,
    //     _,_,_,_,_,_,_,_,
    //     _,_,_,_,_,_,_,_,
    //     _,_,_,_,_,_,_,_,    ]

    const listener = jest.fn()
    comp.eventsP.on('Attack', listener)

    comp.generateAttack()

    expect(listener).toHaveBeenCalled()
    expect([8,11]).toContain(listener.mock.calls[0][0])
})

test('Attack vertical pair of hits', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP, { playerCount: 2, boardLength: 8, shipsPerPlayer: 4, shipLengths: [3,4,5,6] })

    comp.board.offense[9] = 2
    comp.board.offense[17] = 2

    // [   0 _,X,_,_,_,_,_,_,8
    //     8 _,H,_,_,_,_,_,_,16
    //     16_,H,_,_,_,_,_,_,24
    //     24_,X,_,_,_,_,_,_,32
    //     32_,_,_,_,_,_,_,_,40
    //     40_,_,_,_,_,_,_,_,48
    //     48_,_,_,_,_,_,_,_,56
    //     54_,_,_,_,_,_,_,_,64  ]

    const listener = jest.fn()
    comp.eventsP.on('Attack', listener)

    comp.generateAttack()

    expect(listener).toHaveBeenCalled()
    expect([1,25]).toContain(listener.mock.calls[0][0])
})

test('Attack triple of hits', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP, { playerCount: 2, boardLength: 8, shipsPerPlayer: 4, shipLengths: [3,4,5,6] })

    comp.board.offense[9] = 2
    comp.board.offense[10] = 2
    comp.board.offense[11] = 2

    // [   _,_,_,_,_,_,_,_,
    //     X,H,H,H,X,_,_,_,
    //     _,_,_,_,_,_,_,_,
    //     _,_,_,_,_,_,_,_,
    //     _,_,_,_,_,_,_,_,
    //     _,_,_,_,_,_,_,_,
    //     _,_,_,_,_,_,_,_,
    //     _,_,_,_,_,_,_,_,    ]

    const listener = jest.fn()
    comp.eventsP.on('Attack', listener)

    comp.generateAttack()

    expect(listener).toHaveBeenCalled()
    expect([8,12]).toContain(listener.mock.calls[0][0])
})

test('Attack quadruple of hits', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP, { playerCount: 2, boardLength: 8, shipsPerPlayer: 4, shipLengths: [3,4,5,6] })

    comp.board.offense[52] = 2
    comp.board.offense[53] = 2
    comp.board.offense[54] = 2
    comp.board.offense[55] = 2

    // [   0_,_,_,_,_,_,_,_,8
    //     8_,_,_,_,_,_,_,_,16
    //     16_,_,_,_,_,_,_,_,24
    //     24_,_,_,_,_,_,_,_,32
    //     32_,_,_,_,_,_,_,_,40
    //     40_,_,_,_,_,_,_,_,48
    //     48_,_,_,X,H,H,H,H,56
    //     56_,_,_,_,_,_,_,_,64  ]

    const listener = jest.fn()
    comp.eventsP.on('Attack', listener)

    comp.generateAttack()

    expect(listener).toHaveBeenCalled()
    expect([51]).toContain(listener.mock.calls[0][0])
})

test('Attack vertical triple of hits', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP, { playerCount: 2, boardLength: 8, shipsPerPlayer: 4, shipLengths: [3,4,5,6] })

    comp.board.offense[10] = 2
    comp.board.offense[18] = 2
    comp.board.offense[26] = 2

    // [   _,_,X,_,_,_,_,_,
    //     _,_,H,_,_,_,_,_,
    //     _,_,H,_,_,_,_,_,
    //     _,_,H,_,_,_,_,_,
    //     _,_,X,_,_,_,_,_,
    //     _,_,_,_,_,_,_,_,
    //     _,_,_,_,_,_,_,_,
    //     _,_,_,_,_,_,_,_,    ]

    const listener = jest.fn()
    comp.eventsP.on('Attack', listener)

    comp.generateAttack()

    expect(listener).toHaveBeenCalled()
    expect([2,34]).toContain(listener.mock.calls[0][0])
})

test('Attack triple of hits on wall', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP, { playerCount: 2, boardLength: 8, shipsPerPlayer: 4, shipLengths: [3,4,5,6] })

    comp.board.offense[8] = 2
    comp.board.offense[9] = 2
    comp.board.offense[10] = 2

    // [   _,_,_,_,_,_,_,_,
    //     H,H,H,X,_,_,_,_,
    //     _,_,_,_,_,_,_,_,
    //     _,_,_,_,_,_,_,_,
    //     _,_,_,_,_,_,_,_,
    //     _,_,_,_,_,_,_,_,
    //     _,_,_,_,_,_,_,_,
    //     _,_,_,_,_,_,_,_,    ]

    const listener = jest.fn()
    comp.eventsP.on('Attack', listener)

    comp.generateAttack()

    expect(listener).toHaveBeenCalled()
    expect([11]).toContain(listener.mock.calls[0][0])
})

test('Attack pair of hits on opposite wall', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP, { playerCount: 2, boardLength: 8, shipsPerPlayer: 4, shipLengths: [3,4,5,6] })

    comp.board.offense[13] = 2
    comp.board.offense[14] = 2
    comp.board.offense[15] = 2

    // [   0 _,_,_,_,_,_,_,_,8
    //     8 _,_,_,_,X,H,H,H,16
    //     16_,_,_,_,_,_,_,_,24
    //     24_,_,_,_,_,_,_,_,32
    //     32_,_,_,_,_,_,_,_,40
    //     40_,_,_,_,_,_,_,_,48
    //     48_,_,_,_,_,_,_,_,56
    //     56_,_,_,_,_,_,_,_,64  ]

    const listener = jest.fn()
    comp.eventsP.on('Attack', listener)

    comp.generateAttack()

    expect(listener).toHaveBeenCalled()
    expect([12]).toContain(listener.mock.calls[0][0])
})

test('Attack triple of hits on ceiling', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP, { playerCount: 2, boardLength: 8, shipsPerPlayer: 4, shipLengths: [3,4,5,6] })

    comp.board.offense[6] = 2
    comp.board.offense[14] = 2
    comp.board.offense[22] = 2

    // [   _,_,_,_,_,_,H,_,
    //     _,_,_,_,_,_,H,_,
    //     _,_,_,_,_,_,H,_,
    //     _,_,_,_,_,_,X,_,
    //     _,_,_,_,_,_,_,_,
    //     _,_,_,_,_,_,_,_,
    //     _,_,_,_,_,_,_,_,
    //     _,_,_,_,_,_,_,_,    ]

    const listener = jest.fn()
    comp.eventsP.on('Attack', listener)

    comp.generateAttack()

    expect(listener).toHaveBeenCalled()
    expect([30]).toContain(listener.mock.calls[0][0])
})

test('Attack triple of hits on floor', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP, { playerCount: 2, boardLength: 8, shipsPerPlayer: 4, shipLengths: [3,4,5,6] })

    comp.board.offense[46] = 2
    comp.board.offense[54] = 2
    comp.board.offense[62] = 2

    // [   _,_,_,_,_,_,_,_,
    //     _,_,_,_,_,_,_,_,
    //     _,_,_,_,_,_,_,_,
    //     _,_,_,_,_,_,_,_,
    //     _,_,_,_,_,_,X,_,
    //     _,_,_,_,_,_,H,_,
    //     _,_,_,_,_,_,H,_,
    //     _,_,_,_,_,_,H,_,    ]

    const listener = jest.fn()
    comp.eventsP.on('Attack', listener)

    comp.generateAttack()

    expect(listener).toHaveBeenCalled()
    expect([38]).toContain(listener.mock.calls[0][0])
})

test('Attack other side after miss', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP, { playerCount: 2, boardLength: 8, shipsPerPlayer: 4, shipLengths: [3,4,5,6] })

    comp.board.offense[0] = 1
    comp.board.offense[1] = 2
    comp.board.offense[2] = 2

    // [   M,H,H,X,_,_,_,_,
    //     _,_,_,_,_,_,_,_,
    //     _,_,_,_,_,_,_,_,
    //     _,_,_,_,_,_,_,_,
    //     _,_,_,_,_,_,_,_,
    //     _,_,_,_,_,_,_,_,
    //     _,_,_,_,_,_,_,_,
    //     _,_,_,_,_,_,_,_,    ]

    const listener = jest.fn()
    comp.eventsP.on('Attack', listener)

    comp.generateAttack()

    expect(listener).toHaveBeenCalled()
    expect([3]).toContain(listener.mock.calls[0][0])
})

test('Attack other side after miss vertical', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP, { playerCount: 2, boardLength: 8, shipsPerPlayer: 4, shipLengths: [3,4,5,6] })

    comp.board.offense[0] = 1
    comp.board.offense[8] = 2
    comp.board.offense[16] = 2

    // [   M,_,_,_,_,_,_,_,
    //     H,_,_,_,_,_,_,_,
    //     H,_,_,_,_,_,_,_,
    //     X,_,_,_,_,_,_,_,
    //     _,_,_,_,_,_,_,_,
    //     _,_,_,_,_,_,_,_,
    //     _,_,_,_,_,_,_,_,
    //     _,_,_,_,_,_,_,_,    ]

    const listener = jest.fn()
    comp.eventsP.on('Attack', listener)

    comp.generateAttack()

    expect(listener).toHaveBeenCalled()
    expect([24]).toContain(listener.mock.calls[0][0])
})

test('Attack fake line', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP, { playerCount: 2, boardLength: 8, shipsPerPlayer: 4, shipLengths: [3,4,5,6] })

    comp.board.offense[10] = 1
    comp.board.offense[11] = 2
    comp.board.offense[12] = 2
    comp.board.offense[13] = 2
    comp.board.offense[14] = 1

    // [   _,_,_,X,_,_,_,_,
    //     _,_,M,H,H,H,M,_,
    //     _,_,_,_,_,_,_,_,
    //     _,_,_,_,_,_,_,_,
    //     _,_,_,_,_,_,_,_,
    //     _,_,_,_,_,_,_,_,
    //     _,_,_,_,_,_,_,_,
    //     _,_,_,_,_,_,_,_,    ]

    const listener = jest.fn()
    comp.eventsP.on('Attack', listener)

    comp.generateAttack()

    expect(listener).toHaveBeenCalled()
    expect([3,4,5,19,20,21]).toContain(listener.mock.calls[0][0])
})

test('Attack double vertical', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP, { playerCount: 2, boardLength: 8, shipsPerPlayer: 4, shipLengths: [3,4,5,6] })

    comp.board.offense[3] = 1
    comp.board.offense[4] = 1
    comp.board.offense[10] = 1
    comp.board.offense[11] = 2
    comp.board.offense[12] = 2
    comp.board.offense[13] = 1
    comp.board.offense[19] = 2
    comp.board.offense[20] = 0
    comp.board.offense[27] = 0
    comp.board.offense[28] = 0
    comp.board.offense[35] = 0
    comp.board.offense[36] = 0

    // [   0 _,_,_,M,M,_,_,_,8
    //     8 _,_,M,H,H,M,_,_,16
    //     16_,_,_,H,o,_,_,_,24
    //     24_,_,_,X,o,_,_,_,32
    //     32_,_,_,o,o,_,_,_,40
    //     40_,_,_,_,_,_,_,_,48
    //     48_,_,_,_,_,_,_,_,56
    //     56_,_,_,_,_,_,_,_,64    ]

    const listener = jest.fn()
    comp.eventsP.on('Attack', listener)

    comp.generateAttack()

    expect(listener).toHaveBeenCalled()
    expect([27]).toContain(listener.mock.calls[0][0])
})

test('Attack double vertical on left wall', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP, { playerCount: 2, boardLength: 8, shipsPerPlayer: 4, shipLengths: [3,4,5,6] })

    comp.board.offense[0] = 1
    comp.board.offense[1] = 1
    comp.board.offense[8] = 2
    comp.board.offense[9] = 2
    comp.board.offense[10] = 1

    // [   0 M,M,_,_,_,_,_,_,8
    //     8 H,H,M,_,_,_,_,_,16
    //     16X,_,_,_,_,_,_,_,24
    //     24_,_,_,_,_,_,_,_,32
    //     32_,_,_,_,_,_,_,_,40
    //     40_,_,_,_,_,_,_,_,48
    //     48_,_,_,_,_,_,_,_,56
    //     56_,_,_,_,_,_,_,_,64    ]

    const listener = jest.fn()
    comp.eventsP.on('Attack', listener)

    comp.generateAttack()

    expect(listener).toHaveBeenCalled()
    expect([16,17]).toContain(listener.mock.calls[0][0])
    expect([16]).toContain(listener.mock.calls[0][0])
})

test('Attack double vertical on right wall', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP, { playerCount: 2, boardLength: 8, shipsPerPlayer: 4, shipLengths: [3,4,5,6] })

    comp.board.offense[6] = 1
    comp.board.offense[7] = 1
    comp.board.offense[13] = 1
    comp.board.offense[14] = 2
    comp.board.offense[15] = 2

    // [   0 _,_,_,_,_,_,M,M,8
    //     8 _,_,_,_,_,M,H,H,16
    //     16_,_,_,_,_,_,X,_,24
    //     24_,_,_,_,_,_,_,_,32
    //     32_,_,_,_,_,_,_,_,40
    //     40_,_,_,_,_,_,_,_,48
    //     48_,_,_,_,_,_,_,_,56
    //     56_,_,_,_,_,_,_,_,64    ]

    const listener = jest.fn()
    comp.eventsP.on('Attack', listener)

    comp.generateAttack()

    expect(listener).toHaveBeenCalled()
    expect([22,23]).toContain(listener.mock.calls[0][0])
    expect([22]).toContain(listener.mock.calls[0][0])
})

test('Attack double vertical on right wall with gap but ship too long for horizontal placement', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP, { playerCount: 2, boardLength: 8, shipsPerPlayer: 4, shipLengths: [4,5,6] })

    comp.board.offense[5] = 1
    comp.board.offense[6] = 1
    comp.board.offense[12] = 1
    comp.board.offense[13] = 2
    comp.board.offense[14] = 2

    // [   0 _,_,_,_,_,M,M,_,8
    //     8 _,_,_,_,M,H,H,_,16
    //     16_,_,_,_,_,X,o,_,24
    //     24_,_,_,_,_,o,o,_,32
    //     32_,_,_,_,_,_,o,_,40
    //     40_,_,_,_,_,_,_,_,48
    //     48_,_,_,_,_,_,_,_,56
    //     56_,_,_,_,_,_,_,_,64    ]

    const listener = jest.fn()
    comp.eventsP.on('Attack', listener)

    comp.generateAttack()

    expect(listener).toHaveBeenCalled()
    expect([21,22]).toContain(listener.mock.calls[0][0])
    expect([21]).toContain(listener.mock.calls[0][0])
})

test('Attack double vertical on left wall with gap but ship too long for horizontal placement', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP, { playerCount: 2, boardLength: 8, shipsPerPlayer: 4, shipLengths: [4,5,6] })

    comp.board.offense[1] = 1
    comp.board.offense[2] = 1
    comp.board.offense[9] = 2
    comp.board.offense[10] = 2
    comp.board.offense[11] = 1

    // [   0 _,M,M,_,_,_,_,_,8
    //     8 _,H,H,M,_,_,_,_,16
    //     16_,X,o,_,_,_,_,_,24
    //     24_,o,o,_,_,_,_,_,32
    //     32_,o,_,_,_,_,_,_,40
    //     40_,_,_,_,_,_,_,_,48
    //     48_,_,_,_,_,_,_,_,56
    //     56_,_,_,_,_,_,_,_,64    ]

    const listener = jest.fn()
    comp.eventsP.on('Attack', listener)

    comp.generateAttack()

    expect(listener).toHaveBeenCalled()
    expect([17,18]).toContain(listener.mock.calls[0][0])
    expect([17]).toContain(listener.mock.calls[0][0])
})

test('Attack double/triple row on top', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP, { playerCount: 2, boardLength: 8, shipsPerPlayer: 4, shipLengths: [3, 4,5,6] })

    comp.board.offense[0] = 2
    comp.board.offense[1] = 2
    comp.board.offense[8] = 2
    comp.board.offense[9] = 2
    comp.board.offense[16] = 1
    comp.board.offense[17] = 2
    comp.board.offense[25] = 1

    // [   0 H,H,V,_,_,_,_,_,8
    //     8 H,H,X,_,_,_,_,_,16
    //     16M,H,X,_,_,_,_,_,24
    //     24_,M,_,_,_,_,_,_,32
    //     32_,_,_,_,_,_,_,_,40
    //     40_,_,_,_,_,_,_,_,48
    //     48_,_,_,_,_,_,_,_,56
    //     56_,_,_,_,_,_,_,_,64    ]

    const listener = jest.fn()
    comp.eventsP.on('Attack', listener)

    comp.generateAttack()

    expect(listener).toHaveBeenCalled()
    expect([2,10,18]).toContain(listener.mock.calls[0][0])
    expect([2]).toContain(listener.mock.calls[0][0])
})

test('Attack double row on bottom with gap but ship too long for vertical placement', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP, { playerCount: 2, boardLength: 8, shipsPerPlayer: 4, shipLengths: [4,5,6] })

    comp.board.offense[36] = 1
    comp.board.offense[44] = 2
    comp.board.offense[45] = 1
    comp.board.offense[52] = 2
    comp.board.offense[53] = 1

    // [   0 _,_,_,_,_,_,_,_,8
    //     8 _,_,_,_,_,_,_,_,16
    //     16_,_,_,_,_,_,_,_,24
    //     24_,_,_,_,_,_,_,_,32
    //     32_,_,_,_,M,_,_,_,40
    //     40_,_,o,X,H,M,_,_,48
    //     48_,o,o,o,H,M,_,_,56
    //     56_,_,_,_,_,_,_,_,64    ]

    const listener = jest.fn()
    comp.eventsP.on('Attack', listener)

    comp.generateAttack()

    expect(listener).toHaveBeenCalled()
    expect([43,51]).toContain(listener.mock.calls[0][0])
    expect([43]).toContain(listener.mock.calls[0][0])
})

test('Attack T', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP, { playerCount: 2, boardLength: 8, shipsPerPlayer: 4, shipLengths: [3,4,5,6] })

    comp.board.offense[3] = 1
    comp.board.offense[10] = 1
    comp.board.offense[11] = 2
    comp.board.offense[12] = 2
    comp.board.offense[13] = 2
    comp.board.offense[14] = 1

    // [   _,_,_,M,_,_,_,_,
    //     _,_,M,H,H,H,M,_,
    //     _,_,_,X,_,_,_,_,
    //     _,_,_,_,_,_,_,_,
    //     _,_,_,_,_,_,_,_,
    //     _,_,_,_,_,_,_,_,
    //     _,_,_,_,_,_,_,_,
    //     _,_,_,_,_,_,_,_,    ]

    const listener = jest.fn()
    comp.eventsP.on('Attack', listener)

    comp.generateAttack()

    expect(listener).toHaveBeenCalled()
    expect([4,5,19,20,21]).toContain(listener.mock.calls[0][0])
    expect([19]).toContain(listener.mock.calls[0][0])
})

test('Attack T 2', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP, { playerCount: 2, boardLength: 8, shipsPerPlayer: 4, shipLengths: [3,4,5,6] })

    comp.board.offense[3] = 1
    comp.board.offense[10] = 1
    comp.board.offense[11] = 2
    comp.board.offense[12] = 2
    comp.board.offense[13] = 2
    comp.board.offense[14] = 1
    comp.board.offense[19] = 2

    // [   0 _,_,_,M,_,_,_,_,
    //     8 _,_,M,H,H,H,M,_,
    //     16_,_,_,H,_,_,_,_,
    //     24_,_,_,X,_,_,_,_,
    //     32_,_,_,_,_,_,_,_,
    //     40_,_,_,_,_,_,_,_,
    //     48_,_,_,_,_,_,_,_,
    //     54_,_,_,_,_,_,_,_,    ]

    const listener = jest.fn()
    comp.eventsP.on('Attack', listener)

    comp.generateAttack()

    expect(listener).toHaveBeenCalled()
    expect([4,5,20,21,27]).toContain(listener.mock.calls[0][0])
    expect([27]).toContain(listener.mock.calls[0][0])
})

test('Attack lineup', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP, { playerCount: 2, boardLength: 8, shipsPerPlayer: 4, shipLengths: [3,4,5,6] })

    comp.board.offense[3] = 1
    comp.board.offense[10] = 1
    comp.board.offense[11] = -1
    comp.board.offense[12] = 2
    comp.board.offense[13] = 2
    comp.board.offense[14] = 1
    comp.board.offense[19] = -1
    comp.board.offense[27] = -1

    // [   _,_,_,M,X,_,_,_,
    //     _,_,M,S,H,H,M,_,
    //     _,_,_,S,_,_,_,_,
    //     _,_,_,S,_,_,_,_,
    //     _,_,_,_,_,_,_,_,
    //     _,_,_,_,_,_,_,_,
    //     _,_,_,_,_,_,_,_,
    //     _,_,_,_,_,_,_,_,    ]

    const listener = jest.fn()
    comp.eventsP.on('Attack', listener)

    comp.generateAttack()

    expect(listener).toHaveBeenCalled()
    expect([4,5,20,21]).toContain(listener.mock.calls[0][0])
    expect([4]).toContain(listener.mock.calls[0][0])
})

test('Attack lineup 2', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP, { playerCount: 2, boardLength: 8, shipsPerPlayer: 4, shipLengths: [3,4,5,6] })

    comp.board.offense[27] = 1
    comp.board.offense[28] = 1
    comp.board.offense[34] = 1
    comp.board.offense[35] = -1
    comp.board.offense[36] = 2
    comp.board.offense[37] = 2
    comp.board.offense[38] = 2
    comp.board.offense[39] = 1
    comp.board.offense[43] = -1
    comp.board.offense[51] = -1

    // [   0 _,_,_,_,_,_,_,_,
    //     8 _,_,_,_,_,_,_,_,
    //     16_,_,_,_,_,_,o,_,
    //     24_,_,_,M,M,o,o,_,
    //     32_,_,M,S,H,H,H,M,
    //     40_,_,_,S,X,o,o,_,
    //     48_,_,_,S,o,o,o,_,
    //     54_,_,_,_,o,o,o,_,    ]

    const listener = jest.fn()
    comp.eventsP.on('Attack', listener)

    comp.generateAttack()

    expect(listener).toHaveBeenCalled()
    expect([44,45,29,30]).toContain(listener.mock.calls[0][0])
    expect([44]).toContain(listener.mock.calls[0][0])
})

test('Attack lineup 3', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP, { playerCount: 2, boardLength: 8, shipsPerPlayer: 4, shipLengths: [3,4,5,6] })

    comp.board.offense[27] = 1
    comp.board.offense[28] = 1
    comp.board.offense[34] = 1
    comp.board.offense[35] = -1
    comp.board.offense[36] = 2
    comp.board.offense[37] = 2
    comp.board.offense[38] = 2
    comp.board.offense[39] = 1
    comp.board.offense[43] = -1
    comp.board.offense[44] = 2
    comp.board.offense[51] = -1

    // [   0 _,_,_,_,_,o,_,_,
    //     8 _,_,_,_,_,o,_,_,
    //     16_,_,_,_,_,o,_,_,
    //     24_,_,_,M,M,o,o,_,
    //     32_,_,M,S,H,H,H,M,
    //     40_,_,_,S,H,o,o,_,
    //     48_,_,_,S,X,_,o,_,
    //     54_,_,_,_,o,_,o,_,    ]

    const listener = jest.fn()
    comp.eventsP.on('Attack', listener)

    comp.generateAttack()

    expect(listener).toHaveBeenCalled()
    expect([45,52,29,30]).toContain(listener.mock.calls[0][0])
    expect([52]).toContain(listener.mock.calls[0][0])
})

test('Attack lineup 4', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP, { playerCount: 2, boardLength: 8, shipsPerPlayer: 4, shipLengths: [3,4,5,6] })

    comp.board.offense[27] = 1
    comp.board.offense[28] = 1
    comp.board.offense[34] = 1
    comp.board.offense[35] = -1
    comp.board.offense[43] = -1
    comp.board.offense[51] = -1
    comp.board.offense[36] = -1
    comp.board.offense[44] = -1
    comp.board.offense[52] = -1
    comp.board.offense[37] = 2
    comp.board.offense[38] = 2
    comp.board.offense[39] = 1

    // [   0 _,_,_,_,_,o,_,_,
    //     8 _,_,_,_,_,o,_,_,
    //     16_,_,_,_,_,o,_,_,
    //     24_,_,_,M,M,X,o,_,
    //     32_,_,M,S,S,H,H,M,
    //     40_,_,_,S,S,o,o,_,
    //     48_,_,_,S,S,_,o,_,
    //     54_,_,_,_,S,_,o,_,    ]

    const listener = jest.fn()
    comp.eventsP.on('Attack', listener)

    comp.generateAttack()

    expect(listener).toHaveBeenCalled()
    expect([29,30,45,46]).toContain(listener.mock.calls[0][0])
    expect([29]).toContain(listener.mock.calls[0][0])
})

test('Attack lineup 5', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP, { playerCount: 2, boardLength: 8, shipsPerPlayer: 4, shipLengths: [3,4,5,6] })

    comp.board.offense[27] = 1
    comp.board.offense[28] = 1
    comp.board.offense[29] = 2
    comp.board.offense[34] = 1
    comp.board.offense[35] = -1
    comp.board.offense[36] = -1
    comp.board.offense[37] = 2
    comp.board.offense[38] = 2
    comp.board.offense[39] = 1
    comp.board.offense[43] = -1
    comp.board.offense[44] = -1
    comp.board.offense[51] = -1
    comp.board.offense[52] = -1
    comp.board.offense[60] = -1

    // [   0 _,_,_,_,_,o,_,_7
    //     8 _,_,_,_,_,o,_,_15
    //     16_,_,_,_,_,X,_,_23
    //     24_,_,_,M,M,H,o,_31
    //     32_,_,M,S,S,H,H,M39
    //     40_,_,_,S,S,o,o,_47
    //     48_,_,_,S,S,_,o,_55
    //     56_,_,_,_,S,_,o,_63   ]

    const listener = jest.fn()
    comp.eventsP.on('Attack', listener)

    comp.generateAttack()

    expect(listener).toHaveBeenCalled()
    expect([21,30,45,46]).toContain(listener.mock.calls[0][0])
    expect([21]).toContain(listener.mock.calls[0][0])
})

test('Attack end to end', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP, { playerCount: 2, boardLength: 8, shipsPerPlayer: 4, shipLengths: [3,4,5,6] })

    comp.board.offense[32] = -1
    comp.board.offense[33] = -1
    comp.board.offense[34] = -1
    comp.board.offense[35] = -1
    comp.board.offense[36] = 2

    // [   0 _,_,_,_,_,_,_,_7
    //     8 _,_,_,_,_,_,_,_15
    //     16_,_,_,_,_,_,_,_23
    //     24_,_,_,_,_,_,_,_31
    //     32S,S,S,S,H,X,_,_39
    //     40_,_,_,_,_,_,_,_47
    //     48_,_,_,_,_,_,_,_55
    //     56_,_,_,_,_,_,_,_63   ]

    const listener = jest.fn()
    comp.eventsP.on('Attack', listener)

    comp.generateAttack()

    expect(listener).toHaveBeenCalled()
    expect([37]).toContain(listener.mock.calls[0][0])
})

test('Attack end to end 2', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP, { playerCount: 2, boardLength: 8, shipsPerPlayer: 4, shipLengths: [3,4,5,6] })

    comp.board.offense[32] = -1
    comp.board.offense[33] = -1
    comp.board.offense[34] = -1
    comp.board.offense[35] = -1
    comp.board.offense[36] = 2
    comp.board.offense[37] = -1
    comp.board.offense[38] = -1
    comp.board.offense[39] = -1

    // [   0 _,_,_,_,_,_,_,_7
    //     8 _,_,_,_,_,_,_,_15
    //     16_,_,_,_,_,_,_,_23
    //     24_,_,_,_,X,_,_,_31
    //     32S,S,S,S,H,S,S,S39
    //     40_,_,_,_,_,_,_,_47
    //     48_,_,_,_,_,_,_,_55
    //     56_,_,_,_,_,_,_,_63   ]

    const listener = jest.fn()
    comp.eventsP.on('Attack', listener)

    comp.generateAttack()

    expect(listener).toHaveBeenCalled()
    expect([28]).toContain(listener.mock.calls[0][0])
})

test('Attack cross', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP, { playerCount: 2, boardLength: 8, shipsPerPlayer: 4, shipLengths: [3,4,5,6] })

    comp.board.offense[12] = 1
    comp.board.offense[20] = 2
    comp.board.offense[28] = 2
    comp.board.offense[32] = -1
    comp.board.offense[33] = -1
    comp.board.offense[34] = -1
    comp.board.offense[35] = -1
    comp.board.offense[36] = 2
    comp.board.offense[37] = -1
    comp.board.offense[38] = -1
    comp.board.offense[39] = -1

    // [   0 _,_,_,_,_,_,_,_7
    //     8 _,_,_,_,M,_,_,_15
    //     16_,_,_,_,H,_,_,_23
    //     24_,_,_,_,H,_,_,_31
    //     32S,S,S,S,H,S,S,S39
    //     40_,_,_,_,X,_,_,_47
    //     48_,_,_,_,_,_,_,_55
    //     56_,_,_,_,_,_,_,_63   ]

    const listener = jest.fn()
    comp.eventsP.on('Attack', listener)

    comp.generateAttack()

    expect(listener).toHaveBeenCalled()
    expect([44]).toContain(listener.mock.calls[0][0])
})

test('Attack cross 2', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP, { playerCount: 2, boardLength: 8, shipsPerPlayer: 4, shipLengths: [3,4,5,6] })

    comp.board.offense[12] = 1
    comp.board.offense[20] = 2
    comp.board.offense[28] = 2
    comp.board.offense[32] = -1
    comp.board.offense[33] = -1
    comp.board.offense[34] = -1
    comp.board.offense[35] = -1
    comp.board.offense[36] = -1
    comp.board.offense[37] = -1
    comp.board.offense[38] = -1
    comp.board.offense[39] = -1
    comp.board.offense[44] = -1
    comp.board.offense[52] = -1
    comp.board.offense[60] = -1

    // [   0 _,_,_,_,_,_,_,_7
    //     8 _,_,_,_,M,_,_,_15
    //     16_,_,_,X,H,o,o,o23
    //     24_,_,o,o,H,_,_,_31
    //     32S,S,S,S,S,S,S,S39
    //     40_,_,_,_,S,_,_,_47
    //     48_,_,_,_,S,_,_,_55
    //     56_,_,_,_,S,_,_,_63   ]

    const listener = jest.fn()
    comp.eventsP.on('Attack', listener)

    comp.generateAttack()

    expect(listener).toHaveBeenCalled()
    expect([19]).toContain(listener.mock.calls[0][0])
})

test('Attack cross 3', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP, { playerCount: 2, boardLength: 8, shipsPerPlayer: 4, shipLengths: [3,4,5,6] })

    comp.board.offense[4] = 1
    comp.board.offense[12] = 2
    comp.board.offense[20] = 2
    comp.board.offense[28] = -1
    comp.board.offense[32] = -1
    comp.board.offense[33] = -1
    comp.board.offense[34] = -1
    comp.board.offense[35] = -1
    comp.board.offense[36] = -1
    comp.board.offense[37] = -1
    comp.board.offense[38] = -1
    comp.board.offense[39] = -1
    comp.board.offense[44] = -1
    comp.board.offense[52] = -1
    comp.board.offense[60] = 2

    // [   0 _,_,_,_,M,_,_,_7
    //     8 o,o,o,X,H,_,_,_15
    //     16_,_,_,o,H,o,o,_23
    //     24_,_,_,_,S,_,_,_31
    //     32s,s,s,s,S,s,s,s39
    //     40_,_,_,_,S,_,_,_47
    //     48_,_,_,_,S,_,_,_55
    //     56_,_,_,o,H,o,o,_63   ]

    const listener = jest.fn()
    comp.eventsP.on('Attack', listener)

    comp.generateAttack()

    expect(listener).toHaveBeenCalled()
    expect([11]).toContain(listener.mock.calls[0][0])
})

test('Attack cross 4', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP, { playerCount: 2, boardLength: 8, shipsPerPlayer: 4, shipLengths: [3,4,5,6] })

    comp.board.offense[4] = 1
    comp.board.offense[8] = -1
    comp.board.offense[9] = -1
    comp.board.offense[10] = -1
    comp.board.offense[11] = -1
    comp.board.offense[12] = -1
    comp.board.offense[20] = 2
    comp.board.offense[28] = -1
    comp.board.offense[32] = -1
    comp.board.offense[33] = -1
    comp.board.offense[34] = -1
    comp.board.offense[35] = -1
    comp.board.offense[36] = -1
    comp.board.offense[37] = -1
    comp.board.offense[38] = -1
    comp.board.offense[39] = -1
    comp.board.offense[44] = -1
    comp.board.offense[52] = -1
    comp.board.offense[60] = 2

    // [   0 _,_,_,_,M,_,_,_7
    //     8 S,S,S,S,S,_,_,_15
    //     16_,_,_,X,H,o,o,_23
    //     24_,_,_,_,S,_,_,_31
    //     32s,s,s,s,S,s,s,s39
    //     40_,_,_,_,S,_,_,_47
    //     48_,_,_,_,S,_,_,_55
    //     56_,_,_,o,H,o,o,_63   ]

    const listener = jest.fn()
    comp.eventsP.on('Attack', listener)

    comp.generateAttack()

    expect(listener).toHaveBeenCalled()
    expect([19]).toContain(listener.mock.calls[0][0])
})

test('Attack cross 5', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP, { playerCount: 2, boardLength: 8, shipsPerPlayer: 4, shipLengths: [3,4,5,6] })

    comp.board.offense[4] = 1
    comp.board.offense[8] = -1
    comp.board.offense[9] = -1
    comp.board.offense[10] = -1
    comp.board.offense[11] = -1
    comp.board.offense[12] = -1
    comp.board.offense[20] = 2
    comp.board.offense[28] = -1
    comp.board.offense[32] = -1
    comp.board.offense[33] = -1
    comp.board.offense[34] = -1
    comp.board.offense[35] = -1
    comp.board.offense[36] = -1
    comp.board.offense[37] = -1
    comp.board.offense[38] = -1
    comp.board.offense[39] = -1
    comp.board.offense[44] = -1
    comp.board.offense[52] = -1
    comp.board.offense[60] = 2

    // [   0 _,_,_,_,M,_,_,_7
    //     8 S,S,S,S,S,_,_,_15
    //     16_,_,_,X,H,o,o,_23
    //     24_,_,_,_,S,_,_,_31
    //     32s,s,s,s,S,s,s,s39
    //     40_,_,_,_,S,_,_,_47
    //     48_,_,_,_,S,_,_,_55
    //     56_,_,_,o,H,o,o,_63   ]

    const listener = jest.fn()
    comp.eventsP.on('Attack', listener)

    comp.generateAttack()

    expect(listener).toHaveBeenCalled()
    expect([19]).toContain(listener.mock.calls[0][0])
})

test('Attack cross 6', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP, { playerCount: 2, boardLength: 8, shipsPerPlayer: 4, shipLengths: [3,4,5,6] })

    comp.board.offense[4] = 1
    comp.board.offense[8] = -1
    comp.board.offense[9] = -1
    comp.board.offense[10] = -1
    comp.board.offense[11] = -1
    comp.board.offense[12] = -1
    comp.board.offense[19] = -1
    comp.board.offense[20] = -1
    comp.board.offense[21] = -1
    comp.board.offense[22] = -1
    comp.board.offense[28] = -1
    comp.board.offense[32] = -1
    comp.board.offense[33] = -1
    comp.board.offense[34] = -1
    comp.board.offense[35] = -1
    comp.board.offense[36] = -1
    comp.board.offense[37] = -1
    comp.board.offense[38] = -1
    comp.board.offense[39] = -1
    comp.board.offense[44] = -1
    comp.board.offense[52] = -1
    comp.board.offense[60] = 2

    // [   0 _,_,_,_,M,_,_,_7
    //     8 S,S,S,S,S,_,_,_15
    //     16_,_,_,s,s,s,s,_23
    //     24_,_,_,_,S,_,_,_31
    //     32s,s,s,s,S,s,s,s39
    //     40_,_,_,_,S,_,_,_47
    //     48_,_,_,_,S,_,_,_55
    //     56_,_,_,X,H,o,o,_63   ]

    const listener = jest.fn()
    comp.eventsP.on('Attack', listener)

    comp.generateAttack()

    expect(listener).toHaveBeenCalled()
    expect([59]).toContain(listener.mock.calls[0][0])
})

test('Attack fake line too long', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP, { playerCount: 2, boardLength: 8, shipsPerPlayer: 4, shipLengths: [3, 3, 3, 3]})

    comp.board.offense[3] = 2
    comp.board.offense[4] = 2
    comp.board.offense[5] = 2

    // [   0 _,_,_,H,H,H,_,_7
    //     8 _,_,_,X,o,o,_,_15
    //     16_,_,_,o,o,o,_,_23
    //     24_,_,_,_,_,_,_,_31
    //     32_,_,_,_,_,_,_,_39
    //     40_,_,_,_,_,_,_,_47
    //     48_,_,_,_,_,_,_,_55
    //     56_,_,_,_,_,_,_,_63   ]

    const listener = jest.fn()
    comp.eventsP.on('Attack', listener)

    comp.generateAttack()

    expect(listener).toHaveBeenCalled()
    expect([11,12,13]).toContain(listener.mock.calls[0][0])
    expect([11]).toContain(listener.mock.calls[0][0])
})
// [   0 _,_,_,_,_,_,_,_7
//     8 _,_,_,_,_,_,_,_15
//     16_,_,_,_,_,_,_,_23
//     24_,_,_,_,_,_,_,_31
//     32_,_,_,_,_,_,_,_39
//     40_,_,_,_,_,_,_,_47
//     48_,_,_,_,_,_,_,_55
//     56_,_,_,_,_,_,_,_63   ]

// [   0 _,_,_,_,_,_,_,_,8
//     8 _,_,_,_,_,_,_,_,16
//     16_,_,_,_,_,_,_,_,24
//     24_,_,_,_,_,_,_,_,32
//     32_,_,_,_,_,_,_,_,40
//     40_,_,_,_,_,_,_,_,48
//     48_,_,_,_,_,_,_,_,56
//     56_,_,_,_,_,_,_,_,64    ]

