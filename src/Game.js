import EventEmitter from "./events";
import Player from './Player'

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
            const player = new Player(i, this.events, settings, `Player${i}`);

            player.events.on('Hit received', this.sendHit.bind(this))
            player.events.on('Miss received', this.sendMiss.bind(this))
            player.events.on('Sunk', this.sendSink.bind(this))
            player.events.on('Defeated', this.sendDefeat.bind(this))

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
                this.events.on('All ships placed', () => {
                    this.turn += 1
                    setTimeout(this.play.bind(this), 2000)
                })
            } else {
                this.events.on('Attack', (square) => {
                    let boardLength = player.board.length
                    let mod = square - (square % boardLength)
                    // let mod = length
                    //
                    // let row = 0 // index of row
                    // while (mod <= square) { // board length of 8 * row >= victim square? must be second row -- first row: [0,1,2,3,4,5,6,7]
                    //     mod += length
                    //     row++
                    // }
                    const row = (boardLength - 1) - ((boardLength * (boardLength - 1)) - mod)
                    const column = boardLength - (mod - square)

                    const render = player.board.renderOffense.children[row].children[column] // victim square in attacker offense DOM (attack history)

                    const result = this.sendAttempt({ square: square, player: player }) // sendAttempt will change attacker and victim board data to be rendered later

                    if (result !== false /*&& !square.classList.contains('sunk')*/) { // render result immediately in attacker DOM
                        render.classList.add('hit')
                        render.classList.add(`q${result}`) // 1+ hits
                    } else {
                        render.classList.add('miss')
                    }

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
            this.container.appendChild(render)
        } else {
            return false // only 1 player
        }
    }

    sendAttempt(data) {
        console.log('sendAttempt', data, 'pID', data.player.id, this)

        const attacker = data.player

        let hits = 0
        this.players.forEach(victim => {
            if (victim !== attacker) { // everyone who isn't the player sending the attempt
                console.log('player about to receive, pID', victim.id, ' data.pID (attacker?)', attacker.id)

                if (victim.receive(data.square) === true) { // victim will send out a hit or miss event to change attacker backend
                    // attacker.markHit(data.square)
                    hits += 1
                }
            }
        })
        if (hits > 0) {
            return hits
        } else {
            return false
        }
    }

    sendHit(data) {
        console.log('sendHit', data)

        this.players.forEach(player => {
            if (player !== data.player) {
                player.markHit(data.square)
            }
         })
    }

    sendMiss(data) {
        console.log('sendMiss', data)

        this.players.forEach(player => {
            if (player !== data.player) {
                player.markMiss(data.square)
            }
        })
    }

    sendSink(data) {
        console.log('sendSink', data)

        this.players.forEach(player => {
            if (player !== data.player) {
                player.markSink(data.ship)
            }
        })
    }

    sendDefeat(defeated) {
        console.log('sendDefeat', defeated)

        for (let i = 0; i < this.survivors.length; i++) {
            if (this.survivors[i] === defeated) {
                this.survivors.splice(i, 1)
            }
        }
        if (this.survivors.length === 1) {
            this.players.forEach(player => {
                if (player === this.survivors[0]) {
                    this.gameOver(player)
                }
            })
        }
    }

    gameOver(winner) {
        while (this.container.firstChild) { // clear screen container
            console.log('clearing container')
            this.container.removeChild(this.container.lastChild)
        }

        winner.render = undefined // generate render

        this.container.textContent = `WINNER: PLAYER ${winner.id}`
        this.container.appendChild(winner.render)
    }
}