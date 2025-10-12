import EventEmitter from "./events";
import Gameboard from "./Gameboard";
import Ship from './Ship';

export default class Player {
    constructor(id = 1, eventsP = null, gameSettings, name = `Player${id}`) {
        this.name = name;
        this.id = id // Player 1, 2...
        this.defeated = false
        this.isReal = true

        this.board = new Gameboard(gameSettings.boardLength, this);
        this._render = null
        this.events = new EventEmitter()
        this.eventsP = eventsP;

        this.allShipsPlaced = false

        if (gameSettings.shipLengths[gameSettings.shipLengths - 1] < gameSettings.shipLengths[0]) {
            gameSettings.shipLengths = [...gameSettings.shipLengths].reverse();
        }

        this.ships = []
        this.enemyShips = []
        for (let length of gameSettings.shipLengths) {
            const ship = new Ship(length)
            const enemyShip = new Ship(length)

            ship.events.on('Sunk', this.scuttle.bind(this))

            this.ships.push(ship)
            this.enemyShips.push(enemyShip)
        }
        this.survivors = this.ships.length
        this.dead = []
    }

    set render(renderX) {
        // console.log('render player', this)

        if (renderX !== undefined) {
            this._render = renderX
        } else {
            const renderX = document.createElement('div')
            renderX.classList.add('player')

            if (this.allShipsPlaced === false) {
                const shipsContainer = document.createElement('div')
                shipsContainer.classList.add('shipsContainer')

                const button = document.createElement('button')
                button.classList.add('rotate')
                button.innerText = 'Rotate'
                button.addEventListener('click', () => {
                    console.log('click')
                    for (let shipRender of shipsContainer.children) {
                        shipRender.classList.toggle('vertical')

                        if (!shipRender.classList.contains('vertical')) {
                            shipRender.classList.toggle('reversed')
                        }
                    }
                    this.ships.forEach(ship => {
                        ship.vertical = !ship.vertical
                        console.log('hi',ship.vertical,ship.length)

                        if (ship.vertical !== true) {
                            ship.reversed = !ship.reversed
                        }
                    })
                })
                renderX.append(button)

                this.ships.forEach((ship) => {
                    if (ship.pos.length === 0) { // check to make sure ship hasn't been placed yet -- why? how would it ever have been placed
                        ship.render = undefined
                        shipsContainer.appendChild(ship.render)
                    }
                })

                renderX.appendChild(shipsContainer)
            } else { // all ships placed
                this.board.renderOffense = this.attack.bind(this)  /// render offense

                let offense = this.board.renderOffense
                // console.log('append offense', offense)
                renderX.append(offense)
            }

            let defense
            if (this.allShipsPlaced === false) {
                this.board.gameStarted = false

                this.board.renderDefense = this.place.bind(this) /// render defense
                defense = this.board.renderDefense
            } else {
                this.board.gameStarted = true

                this.board.renderDefense = undefined
                defense = this.board.renderDefense
            }
            renderX.append(defense)

            this._render = renderX
        }
    }

    get render() {
        // if (this._render === null) {
        //     this.render = undefined // create render
        // }
        return this._render
    }

    place(array) {
        console.log('place, array:', array)

        if (this.board.place(array) === true) { // if true, successful placement
            for (let ship of this.ships) {
                if (ship.length === array.length && ship.pos.length === 0) { // this is a weakness, can't have multiple ships of same length -- need a better way to identify ships, but would need ship drop event to transfer entire ship object
                    ship.pos = array

                    for (let ship of this.ships) { // Check for any unplaced ships
                        if (ship.pos.length === 0) {
                            return true // If any unplaced, return so code below isn't executed
                        }
                    }
                    // console.log("All ships placed event emitting")

                    this.allShipsPlaced = true
                    this.eventsP.emit("All ships placed")
                    return true
                }
            }
        } else {
            return false
        }
    }

    attack(square) {
        // console.log('player attack', square, 'playerID', this.id)

        if (this.board.attack(square, true) === true) { // keep track of your attacks
            // console.log('emitting attack')

            if (this.eventsP !== null) {
                this.eventsP.emit('Attack', square)
            } else {
                throw Error('Player has no parent events object to which it can emit attack event!')
            }
        } else {
            throw Error("Invalid square!")
        }
    }

    receive(square) {
        // console.log('receive', square, 'attacker:', attacker, "this:", this)

        if (this.board.attack(square) === true) { // if true, successful attack is now saved on backend
            for (let ship of this.ships) { // save successful attack on ship itself
                if (ship.pos.includes(square)) {
                    this.events.emit("Hit received", { square: square, player: this }) // must send hit event before changing ship, which may send sunk event

                    ship.health -= 1
                    break
                }
            }
            return true
        } else {
            this.events.emit("Miss received", { square: square, player: this })
            return false
        }
    }

    markHit(square) {
        // console.log('markhit', square, this)

        if (this.board.offense[square] !== -1) {
            if (this.board.offense[square] >= 2) {
                this.board.offense[square] += 1
            } else {
                this.board.offense[square] = 2
            }
            return true
        } else {
            throw Error("Tried to mark hit on sunken square! Can't mark successful")
        }
    }

    markMiss(square) { // mark miss on offense board, i.e., you hit an enemy ship
        // console.log('markmiss', square, this)

        if (this.board.offense[square] >= 0) {
            this.board.offense[square] = 1 // 1 is a miss, 2+ is a hit, -1 is a sunken square
        } else {
            throw Error('Tried to mark miss on an invalid square!')
        }
    }

    markSink(ship) { // mark sink on offense board, i.e., you sank an enemy ship
        console.log('marksink', ship, this)

        ship.pos.forEach((square) => {
            this.board.offense[square] = -1
        })

        const enemyShip = this.enemyShips.find((enemyShip) => enemyShip.length === ship.length)
        enemyShip.sunk = true
    }

    scuttle(ship) {
        console.log('scuttle', this, ship)

        this.survivors -= 1

        ship.sunk = true
        this.dead.push(ship)

        for (const square of ship.pos) {
            this.board.defense[square] = -1
        }

        this.events.emit('Sunk', { ship: ship, player: this })

        if (this.survivors === 0) {
            this.defeated = true

            this.events.emit('Defeated', this)
            // this.eventsP.removeEventListener('Defeated', this)
        }
    }
}

// const square = ship.pos[0]
// const boardLength = this.board.length
// const mod = square - (square % boardLength)
// const lastMod = boardLength * (boardLength - 1)
//
// const row = (boardLength - 1) - Math.floor((lastMod - mod) / 8)
// const column = square - mod