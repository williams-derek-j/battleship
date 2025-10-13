import EventEmitter from "./events"
import Player from './Player'
import Computer from './Computer'

export default class Game {
    constructor(container, settings = { playerCount: 2, boardLength: 8, shipLengths: [3,4,5,6] }) {
        console.log('gs in game', settings)
        if (Object.keys(settings).length !== 3) {
            throw Error('Missing one or more required game settings!')
        }
        if (settings.shipLengths[settings.shipLengths - 1] < settings.shipLengths[0]) {
            settings.shipLengths = [...settings.shipLengths].reverse()
        }

        this.container = container
        this.events = new EventEmitter()

        this.players = []
        this.survivors = []
        for (let i = 1; i <= settings.playerCount; i++) {
            const player = new Player(i, this.events, settings, `Player${i}`);

            player.events.on('Hit received', this.sendHit.bind(this))
            player.events.on('Miss received', this.sendMiss.bind(this))
            player.events.on('Sunk', this.sendSink.bind(this))
            player.events.on('Defeated', this.sendDefeat.bind(this))

            this.survivors.push(player)
            this.players.push(player)
        }
        if (settings.playerCount === 1) {
            const computer = new Computer(2, this.events, settings)

            computer.events.on('Hit received', this.sendHit.bind(this))
            computer.events.on('Miss received', this.sendMiss.bind(this))
            computer.events.on('Sunk', this.sendSink.bind(this))
            computer.events.on('Defeated', this.sendDefeat.bind(this))

            this.survivors.push(computer)
            this.players.push(computer)
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
        console.log('*************************************************************pl', this.turn, this, this.events)

        if (this.survivors.length > 1) {
            let render // why is this all the way up here?
            const player = this.survivors[this.turn - 1] // turn is counted starting at 1, but players start at 0
            console.log('player',player)

            if (player.allShipsPlaced === false) {
                this.events.on('All ships placed', () => {
                    this.turn += 1
                    setTimeout(this.play.bind(this), 1000)
                })

                if (player.isReal === false) {
                    player.placeShips()
                }
            } else {
                if (player.isReal === true) {
                    this.events.on('Attack', (square) => {
                        const boardLength = player.board.length
                        const mod = square - (square % boardLength)
                        const lastMod = boardLength * (boardLength - 1)

                        const row = (boardLength - 1) - Math.floor((lastMod - mod) / boardLength)
                        const column = square - mod

                        const render = player.board.renderOffense.children[row].children[column] // victim square in attacker offense DOM (attack history)
                        render.classList.add('waiting')
                        render.style['z-index'] = -1
                        console.log('test')

                        const ship = this.sendAttempt({ square: square, player: player }) // sendAttempt will change attacker and victim board data to be rendered later

                        console.log('ship',ship)
                        if (ship) { // render result immediately in attacker DOM
                            if (ship.health > 0) {
                                setTimeout(() => {
                                    render.classList.add('hit')

                                    render.classList.remove('waiting')
                                }, 500)
                            } else if (ship.health <= 0) {
                                setTimeout(() => {
                                    render.classList.add('sunk')

                                    render.classList.remove('waiting')
                                }, 500)
                            }
                        } else {
                            setTimeout(() => {
                                render.classList.add('miss')

                                render.classList.remove('waiting')
                            }, 500)
                        }

                        this.turn += 1

                        setTimeout(this.play.bind(this), 1000)
                    })
                } else if (player.isReal === false) {
                    this.events.on('Attack', (square) => {
                        this.sendAttempt({ square: square, player: player }) // sendAttempt will change attacker and victim board data to be rendered later

                        this.turn = 1

                        this.play.bind(this)()
                    })

                    player.generateAttack()
                }
            }

            if (player.isReal === true) {
                while (this.container.firstChild) {
                    console.log('clearing container')

                    this.container.removeChild(this.container.lastChild)
                }

                player.render = undefined // create render (by setting to undefined)
                render = player.render

                this.container.textContent = `PLAYER ${player.id}`
                this.container.appendChild(render)
            }
        } else {
            return false // only 1 player
        }
    }

    sendAttempt(data) {
        console.log('sendAttempt', data, 'pID', data.player.id, this)

        const attacker = data.player

        let hits = 0
        let victimShip
        this.players.some(victim => {
            if (victim !== attacker) { // everyone who isn't the player sending the attempt
                console.log('player about to receive, pID', victim.id, ' data.pID (attacker?)', attacker.id)

                const ship = victim.receive(data.square)
                console.log('shiphere',ship)
                if (ship) { // victim will send out a hit or miss event to change attacker backend
                    // attacker.markHit(data.square)
                    hits += 1
                    victimShip = ship
                }
            }
        })
        if (hits > 0) {
            return victimShip
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