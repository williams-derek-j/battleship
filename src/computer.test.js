import EventEmitter from './Events'
import Computer from './Computer'

test('Attack empty board', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP)

    const listener = jest.fn()
    comp.eventsP.on('Attack', listener)

    comp.generateAttack()

    expect(listener).toHaveBeenCalled()

    expect(listener.mock.calls[0][0]).toBeGreaterThanOrEqual(0)
    expect(listener.mock.calls[0][0]).toBeLessThan(comp.board.length ** 2)
})

test('Attack lone hit', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP)
    comp.board.offense[9] = 2
        // [   0,X,0,0,0,0,0,0,
        //     X,2,X,0,0,0,0,0,
        //     0,X,0,0,0,0,0,0,
        //     0,0,0,0,0,0,0,0,
        //     0,0,0,0,0,0,0,0,
        //     0,0,0,0,0,0,0,0,
        //     0,0,0,0,0,0,0,0,
        //     0,0,0,0,0,0,0,0,    ]

    const listener = jest.fn()
    comp.eventsP.on('Attack', listener)

    comp.generateAttack()

    expect(listener).toHaveBeenCalled()
    expect([1,8,10,17]).toContain(listener.mock.calls[0][0])
    console.log(listener.mock.calls[0][0])
})

test('Attack pair of hits', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP)
    comp.board.offense[9] = 2
    comp.board.offense[10] = 2
    // [   0,0,0,0,0,0,0,0,
    //     X,2,2,X,0,0,0,0,
    //     0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,    ]

    const listener = jest.fn()
    comp.eventsP.on('Attack', listener)

    comp.generateAttack()

    expect(listener).toHaveBeenCalled()
    expect([8,11]).toContain(listener.mock.calls[0][0])
    console.log(listener.mock.calls[0][0])
})

test('Attack vertical pair of hits', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP)
    comp.board.offense[9] = 2
    comp.board.offense[17] = 2
    // [   0,X,0,0,0,0,0,0,
    //     0,2,0,0,0,0,0,0,
    //     0,2,0,0,0,0,0,0,
    //     0,X,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,    ]

    const listener = jest.fn()
    comp.eventsP.on('Attack', listener)

    comp.generateAttack()

    expect(listener).toHaveBeenCalled()
    expect([1,25]).toContain(listener.mock.calls[0][0])
    console.log(listener.mock.calls[0][0])
})

test('Attack triple of hits', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP)
    comp.board.offense[9] = 2
    comp.board.offense[10] = 2
    comp.board.offense[11] = 2
    // [   0,0,0,0,0,0,0,0,
    //     X,2,2,2,X,0,0,0,
    //     0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,    ]

    const listener = jest.fn()
    comp.eventsP.on('Attack', listener)

    comp.generateAttack()

    expect(listener).toHaveBeenCalled()
    expect([8,12]).toContain(listener.mock.calls[0][0])
    console.log(listener.mock.calls[0][0])
})

test('Attack vertical triple of hits', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP)
    comp.board.offense[10] = 2
    comp.board.offense[18] = 2
    comp.board.offense[26] = 2
    // [   0,0,X,0,0,0,0,0,
    //     0,0,2,0,0,0,0,0,
    //     0,0,2,0,0,0,0,0,
    //     0,0,2,0,0,0,0,0,
    //     0,0,X,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,    ]

    const listener = jest.fn()
    comp.eventsP.on('Attack', listener)

    comp.generateAttack()

    expect(listener).toHaveBeenCalled()
    expect([2,34]).toContain(listener.mock.calls[0][0])
    console.log(listener.mock.calls[0][0])
})

test('Attack triple of hits on wall', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP)
    comp.board.offense[8] = 2
    comp.board.offense[9] = 2
    comp.board.offense[10] = 2
    // [   0,0,0,0,0,0,0,0,
    //     2,2,2,X,0,0,0,0,
    //     0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,    ]

    const listener = jest.fn()
    comp.eventsP.on('Attack', listener)

    comp.generateAttack()

    expect(listener).toHaveBeenCalled()
    expect([11]).toContain(listener.mock.calls[0][0])
    console.log(listener.mock.calls[0][0])
})

test('Attack pair of hits on opposite wall', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP)
    comp.board.offense[13] = 2
    comp.board.offense[14] = 2
    comp.board.offense[15] = 2
    // [   0,0,0,0,0,0,0,0,
    //     0,0,0,0,X,2,2,2,
    //     0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,    ]

    const listener = jest.fn()
    comp.eventsP.on('Attack', listener)

    comp.generateAttack()

    expect(listener).toHaveBeenCalled()
    expect([12]).toContain(listener.mock.calls[0][0])
    console.log(listener.mock.calls[0][0])
})

test('Attack triple of hits on ceiling', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP)
    comp.board.offense[6] = 2
    comp.board.offense[14] = 2
    comp.board.offense[22] = 2
    // [   0,0,0,0,0,0,2,0,
    //     0,0,0,0,0,0,2,0,
    //     0,0,0,0,0,0,2,0,
    //     0,0,0,0,0,0,X,0,
    //     0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,    ]

    const listener = jest.fn()
    comp.eventsP.on('Attack', listener)

    comp.generateAttack()

    expect(listener).toHaveBeenCalled()
    expect([30]).toContain(listener.mock.calls[0][0])
    console.log(listener.mock.calls[0][0])
})

test('Attack triple of hits on floor', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP)
    comp.board.offense[46] = 2
    comp.board.offense[54] = 2
    comp.board.offense[62] = 2
    // [   0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,X,0,
    //     0,0,0,0,0,0,2,0,
    //     0,0,0,0,0,0,2,0,
    //     0,0,0,0,0,0,2,0,    ]

    const listener = jest.fn()
    comp.eventsP.on('Attack', listener)

    comp.generateAttack()

    expect(listener).toHaveBeenCalled()
    expect([38]).toContain(listener.mock.calls[0][0])
    console.log(listener.mock.calls[0][0])
})

test('Attack other side after miss', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP)
    comp.board.offense[0] = 1
    comp.board.offense[1] = 2
    comp.board.offense[2] = 2
    // [   M,2,2,X,0,0,0,0,
    //     0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,    ]

    const listener = jest.fn()
    comp.eventsP.on('Attack', listener)

    comp.generateAttack()

    expect(listener).toHaveBeenCalled()
    expect([3]).toContain(listener.mock.calls[0][0])
    console.log(listener.mock.calls[0][0])
})

test('Attack other side after miss vertical', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP)
    comp.board.offense[0] = 1
    comp.board.offense[8] = 2
    comp.board.offense[16] = 2
    // [   M,0,0,0,0,0,0,0,
    //     2,0,0,0,0,0,0,0,
    //     2,0,0,0,0,0,0,0,
    //     X,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,    ]

    const listener = jest.fn()
    comp.eventsP.on('Attack', listener)

    comp.generateAttack()

    expect(listener).toHaveBeenCalled()
    expect([24]).toContain(listener.mock.calls[0][0])
    console.log(listener.mock.calls[0][0])
})

test('Attack T', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP)
    comp.board.offense[10] = 1
    comp.board.offense[11] = 2
    comp.board.offense[12] = 2
    comp.board.offense[13] = 2
    comp.board.offense[14] = 1
    // [   0,0,0,X,X,X,0,0,
    //     0,0,M,2,2,2,M,0,
    //     0,0,0,X,X,X,0,0,
    //     0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,    ]

    const listener = jest.fn()
    comp.eventsP.on('Attack', listener)

    comp.generateAttack()

    expect(listener).toHaveBeenCalled()
    expect([3,4,5,19,20,21]).toContain(listener.mock.calls[0][0])
})

test('Attack T cont.1', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP)
    comp.board.offense[3] = 1
    comp.board.offense[10] = 1
    comp.board.offense[11] = 2
    comp.board.offense[12] = 2
    comp.board.offense[13] = 2
    comp.board.offense[14] = 1
    // [   0,0,0,M,X,X,0,0,
    //     0,0,M,2,2,2,M,0,
    //     0,0,0,X,X,X,0,0,
    //     0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,    ]

    const listener = jest.fn()
    comp.eventsP.on('Attack', listener)

    comp.generateAttack()

    expect(listener).toHaveBeenCalled()
    expect([4,5,19,20,21]).toContain(listener.mock.calls[0][0])
})

test('Attack T cont.2', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP)
    comp.board.offense[3] = 1
    comp.board.offense[4] = 1
    comp.board.offense[10] = 1
    comp.board.offense[11] = 2
    comp.board.offense[12] = 2
    comp.board.offense[13] = 2
    comp.board.offense[14] = 1
    // [   0,0,0,M,M,X,0,0,
    //     0,0,M,2,2,2,M,0,
    //     0,0,0,X,X,X,0,0,
    //     0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,    ]

    const listener = jest.fn()
    comp.eventsP.on('Attack', listener)

    comp.generateAttack()

    expect(listener).toHaveBeenCalled()
    expect([5,19,20,21]).toContain(listener.mock.calls[0][0])
})

test('Attack T cont.3', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP)
    comp.board.offense[3] = 1
    comp.board.offense[4] = 1
    comp.board.offense[10] = 1
    comp.board.offense[11] = 2
    comp.board.offense[12] = 2
    comp.board.offense[13] = 2
    comp.board.offense[14] = 1
    comp.board.offense[20] = 2
    // [   0,0,0,M,M,X,0,0,
    //     0,0,M,2,2,2,M,0,
    //     0,0,0,0,2,0,0,0,
    //     0,0,0,0,X,0,0,0,
    //     0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,0,0,0,    ]

    const listener = jest.fn()
    comp.eventsP.on('Attack', listener)

    comp.generateAttack()

    expect(listener).toHaveBeenCalled()
    expect([28]).toContain(listener.mock.calls[0][0])
})

