import EventEmitter from "node:events";
import Gameboard from "./Gameboard";
import Ship from './Ship';

export default class Player {
    constructor(name, id, gameSettings) {
        this.name = name;
        this.id = id // Player 1, 2...
        this.defeated = false

        this.board = new Gameboard(8);
        this.events = new EventEmitter()

        this.ships = []
        for (let length of gameSettings.shipLengths) {
            const ship = new Ship(length)

            ship.events.on('Sunk', this.scuttle)

            this.ships.push(ship)
        }
        this.survivors = this.ships.length
        this.dead = []
    }

    render() {
        const render = document.createElement('div')
    }

    place(array) {
        if (this.board.place(array) === true) { // if true, successful placement
            ships.forEach((ship) => {
                if (ship.length === array.length) {
                    ship.pos = array
                }
            })
        } else {
            return false
        }
    }

    receive(square, attacker) {
        if (this.board.attack(square, attacker) === true) { // if true, successful attack
            for (let ship of this.ships) {
                if (ship.pos.contains(square)) {
                    ship.health -= 1
                    break
                }
            }
            this.events.emit('Hit', square)
        } else {
            this.events.emit('Miss', square)
        }
    }

    attack(square) {
        if (this.board.attack(square, this) === true) { // keep track of your attacks
            this.events.emit('Attack', { square: square, player: this })
        } else {
            throw Error('Invalid square!')
        }
    }

    attackSuccess(square) {

    }

    scuttle(ship) {
        this.survivors -= 1

        this.dead.push(ship)

        this.events.emit('Sunk', ship)

        if (this.survivors.length === 0) {
            this.defeated = true

            this.events.emit('Defeated', this)
            this.events.removeAllListeners('Defeated')
        }
    }
}