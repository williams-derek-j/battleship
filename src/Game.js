import Player from './Player'
import EventEmitter from "./events";

export default class Game {
    constructor(container, settings = { players: 2, boardLength: 8, shipsPerPlayer: 4, shipLengths: [3,4,5,6] }) {
        if (Object.keys(settings).length !== 4) {
            throw Error('Missing one or more required game settings!')
        }
        while (settings.shipsPerPlayer !== settings.shipLengths.length) {
            settings.shipLengths.forEach(length => {
                settings.shipLengths.push(length)
            })
        }
        this.container = container
        this.events = new EventEmitter()

        this.players = []
        this.survivors = []
        for (let i = 0; i < settings.players; i++) {
            const player = new Player(`Player${i}`, i, this.events, settings);

            player.events.on('Hit', this.sendHit)
            player.events.on('Miss', this.sendMiss)
            player.events.on('Sunk', this.sendSink)
            player.events.on('Defeated', this.sendDefeat)

            this.survivors.push(player)
            this.players.push(player)
        }

        this._turn = 1
    }

    set turn(val) {
        if (val <= this.survivors.length) {
            this._turn = val
        } else {
            this._turn = 1
        }
    }

    get turn() {
        return this._turn
    }

    play() {
        console.log('play() called')
        if (this.survivors.length > 1) {
            const player = this.survivors[this.turn]

            player.render = undefined // create render
            const render = player.render

            while (this.container.firstChild) {
                this.container.removeChild(this.container.lastChild)
            }
            console.log('play(); current player render:', render)
            this.container.appendChild(render)

            this.events.on('Attack', (event) => {
                this.turn += 1
                this.play()
            })
        }
    }

    sendAttempt(data) {
        this.players.forEach(player => {
            if (player !== data.player) { // everyone who isn't the player sending the attempt
                player.receive(data.square, data.player)
            }
        })
    }

    sendHit(data) {

    }

    sendDefeat(defeated) {
        for (let i = 0; i < this.survivors.length; i++) {
            if (this.survivors[i] === defeated.id) {
                this.survivors.splice(i, 1)
            }
        }
        if (this.survivors.length === 1) {
            this.players.forEach(player => {
                if (player.id === this.survivors[0]) {
                    this.events.emit('Game Over', player)
                }
            })
        }
    }
}