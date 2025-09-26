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
        // [   _,X,_,_,_,_,_,_,
        //     X,H,X,_,_,_,_,_,
        //     _,X,_,_,_,_,_,_,
        //     _,_,_,_,_,_,_,_,
        //     _,_,_,_,_,_,_,_,
        //     _,_,_,_,_,_,_,_,
        //     _,_,_,_,_,_,_,_,
        //     _,_,_,_,_,_,_,_,    ]

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
    console.log(listener.mock.calls[0][0])
})

test('Attack vertical pair of hits', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP)
    comp.board.offense[9] = 2
    comp.board.offense[17] = 2
    // [   _,X,_,_,_,_,_,_,
    //     _,H,_,_,_,_,_,_,
    //     _,H,_,_,_,_,_,_,
    //     _,X,_,_,_,_,_,_,
    //     _,_,_,_,_,_,_,_,
    //     _,_,_,_,_,_,_,_,
    //     _,_,_,_,_,_,_,_,
    //     _,_,_,_,_,_,_,_,    ]

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
    console.log(listener.mock.calls[0][0])
})

test('Attack vertical triple of hits', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP)
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
    console.log(listener.mock.calls[0][0])
})

test('Attack triple of hits on wall', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP)
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
    console.log(listener.mock.calls[0][0])
})

test('Attack pair of hits on opposite wall', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP)
    comp.board.offense[13] = 2
    comp.board.offense[14] = 2
    comp.board.offense[15] = 2
    // [   _,_,_,_,_,_,_,_,
    //     _,_,_,_,X,H,H,H,
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
    expect([12]).toContain(listener.mock.calls[0][0])
    console.log(listener.mock.calls[0][0])
})

test('Attack triple of hits on ceiling', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP)
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
    console.log(listener.mock.calls[0][0])
})

test('Attack triple of hits on floor', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP)
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
    console.log(listener.mock.calls[0][0])
})

test('Attack other side after miss', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP)
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
    console.log(listener.mock.calls[0][0])
})

test('Attack other side after miss vertical', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP)
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
    console.log(listener.mock.calls[0][0])
})

test('Attack fake line', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP)
    comp.board.offense[10] = 1
    comp.board.offense[11] = 2
    comp.board.offense[12] = 2
    comp.board.offense[13] = 2
    comp.board.offense[14] = 1
    // [   _,_,_,X,X,X,_,_,
    //     _,_,M,H,H,H,M,_,
    //     _,_,_,X,X,X,_,_,
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

test('Attack fake line cont', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP)
    comp.board.offense[3] = 1
    comp.board.offense[10] = 1
    comp.board.offense[11] = 2
    comp.board.offense[12] = 2
    comp.board.offense[13] = 2
    comp.board.offense[14] = 1
    // [   _,_,_,M,X,X,_,_,
    //     _,_,M,H,H,H,M,_,
    //     _,_,_,X,X,X,_,_,
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
})

test('Attack T', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP)
    comp.board.offense[3] = 1
    comp.board.offense[10] = 1
    comp.board.offense[11] = 2
    comp.board.offense[12] = 2
    comp.board.offense[13] = 2
    comp.board.offense[14] = 1
    // [   _,_,_,M,X,X,_,_,
    //     _,_,M,H,H,H,M,_,
    //     _,_,_,V,X,X,_,_,
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

    const comp = new Computer(0, eventsP)
    comp.board.offense[3] = 1
    comp.board.offense[10] = 1
    comp.board.offense[11] = -1
    comp.board.offense[12] = 2
    comp.board.offense[13] = 2
    comp.board.offense[14] = 1
    comp.board.offense[19] = -1
    comp.board.offense[27] = -1
    // [   _,_,_,M,V,X,_,_,
    //     _,_,M,S,H,H,M,_,
    //     _,_,_,S,X,X,_,_,
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

test('Attack T 3', () => {
    const eventsP = new EventEmitter()

    const comp = new Computer(0, eventsP)

    comp.board.offense[27] = 1
    comp.board.offense[28] = 1
    comp.board.offense[34] = 1
    comp.board.offense[35] = -1
    comp.board.offense[36] = 2
    comp.board.offense[37] = 2
    comp.board.offense[38] = 2
    comp.board.offense[39] = 1
    comp.board.offense[43] = -1
    comp.board.offense[44] = 1
    comp.board.offense[51] = -1
    comp.board.offense[52] = 1

    // [   0 _,_,_,_,_,O,_,_, // this doesn't actually occur naturally without min ship length 2
    //     8 _,_,_,_,_,O,_,_,
    //     16_,_,_,_,_,0,_,_,
    //     24_,_,_,M,M,V,X,_,
    //     32_,_,M,S,2,2,2,M,
    //     40_,_,_,S,M,X,0,_,
    //     48_,_,_,S,M,_,0,_,
    //     54_,_,_,_,_,_,0,_,    ]

    const listener = jest.fn()
    comp.eventsP.on('Attack', listener)

    comp.generateAttack()

    expect(listener).toHaveBeenCalled()
    expect([29,30,53]).toContain(listener.mock.calls[0][0])
    expect([29]).toContain(listener.mock.calls[0][0])
})

// test('Attack cluster', () => {
//     const eventsP = new EventEmitter()
//
//     const comp = new Computer(0, eventsP)
//     comp.board.offense[3] = 1
//     comp.board.offense[4] = 1
//     comp.board.offense[10] = 1
//     comp.board.offense[11] = 2
//     comp.board.offense[12] = 2
//     comp.board.offense[13] = 2
//     comp.board.offense[14] = 1
//     comp.board.offense[20] = 2
//     // [   _,_,_,M,M,X,_,_,
//     //     _,_,M,2,2,2,M,_,
//     //     _,_,_,X,X,X,_,_,
//     //     _,_,_,_,X,_,_,_,
//     //     _,_,_,_,_,_,_,_,
//     //     _,_,_,_,_,_,_,_,
//     //     _,_,_,_,_,_,_,_,
//     //     _,_,_,_,_,_,_,_,    ]
//
//     const listener = jest.fn()
//     comp.eventsP.on('Attack', listener)
//
//     comp.generateAttack()
//
//     expect(listener).toHaveBeenCalled()
//     expect([28]).toContain(listener.mock.calls[0][0])
// })

