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
    expect(listener.mock.calls[0][0]).toBeLessThan(comp.board.length ** 2 - 1)
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

test('Attack pair of hits on wall', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP)
    comp.board.offense[8] = 2
    comp.board.offense[9] = 2
    // [   0,0,0,0,0,0,0,0,
    //     2,2,X,0,0,0,0,0,
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
    expect([10]).toContain(listener.mock.calls[0][0])
    console.log(listener.mock.calls[0][0])
})

test('Attack pair of hits on opposite wall', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP)
    comp.board.offense[14] = 2
    comp.board.offense[15] = 2
    // [   0,0,0,0,0,0,0,0,
    //     0,0,0,0,0,X,2,2,
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
    expect([13]).toContain(listener.mock.calls[0][0])
    console.log(listener.mock.calls[0][0])
})

//    comp.board.offense =
//         [   0,0,0,0,0,
//             0,0,0,0,0,
//             0,0,0,0,0,
//             0,0,0,0,0,
//             0,0,0,0,0   ]

