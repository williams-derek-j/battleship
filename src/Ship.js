import EventEmitter from "node:events";

export default class Ship {
    constructor(length) {
        this.length = length

        this.pos = []

        this._health = length
        this.sunk = false

        this.events = new EventEmitter()
    }

    set health(health) {
        this._health = health

        if (this._health === 0) {
            this.events.emit('Sunk', this)

            this.events.removeAllListeners('Sunk')
        }
    }

    get health() {
        return this._health
    }
}