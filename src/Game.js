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
        for (let i = 1; i <= settings.players; i++) {
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
        this.events.events = {}
        console.log('***************pl', this.turn, this, this.events)

        if (this.survivors.length > 1) {
            let render
            const player = this.survivors[this.turn - 1]
            console.log('player',player)

            if (player.allShipsPlaced === false) {
                this.events.on('All ships placed', (data) => {
                    this.turn += 1
                    setTimeout(this.play.bind(this), 2000)
                })
            } else {
                this.events.on('Attack', (data) => {
                    console.log('h', data)
                    let length = player.board.length
                    let mod = length
                    let i = 0
                    while (mod <= data.square) {
                        mod += length
                        i++
                    }
                    player.board.renderOffense.children[i].children[data.square].classList.add('miss')
                    this.sendAttempt(data)
                    this.turn += 1
                    setTimeout(this.play.bind(this), 2000)
                })
            }

            player.render = undefined // create render
            render = player.render

            while (this.container.firstChild) {
                console.log('clearing container')
                this.container.removeChild(this.container.lastChild)
            }
            this.container.textContent = `PLAYER ${player.id}`
            console.log('play(); current player render:', render)
            this.container.appendChild(render)

        }
    }

    sendAttempt(data) {
        console.log('sendAttempt', data, 'pID', data.player.id, this)
        // this.turn += 1

        this.players.forEach(player => {
            if (player.id !== data.player.id) { // everyone who isn't the player sending the attempt
                console.log('player about to receive, pID', player.id, 'data.pID (attacker?)', data.player.id)
                player.receive(data.square, data.player)
            }
        })
        // this.play()
    }

    sendHit(data) {
        console.log('sendHit', data)

    }

    sendMiss(data) {
        console.log('sendMiss', data)

    }

    sendSink(data) {
        console.log('sendSink', data)
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