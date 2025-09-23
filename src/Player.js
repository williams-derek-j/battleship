import EventEmitter from "./events";
import Gameboard from "./Gameboard";
import Ship from './Ship';

export default class Player {
    constructor(name, id, eventsP, gameSettings) {
        this.name = name;
        this.id = id // Player 1, 2...
        this.defeated = false

        this.board = new Gameboard(gameSettings.boardLength);
        this._render = null
        this.events = new EventEmitter()
        this.eventsP = eventsP;

        this.allShipsPlaced = false

        this.ships = []
        for (let length of gameSettings.shipLengths) {
            const ship = new Ship(length)

            ship.events.on('Sunk', this.scuttle.bind(this))

            this.ships.push(ship)
        }
        this.survivors = this.ships.length
        this.dead = []
    }

    set render(renderX) {
        console.log('render player', this)

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
                    for (let shipRender of shipsContainer.children) {
                        shipRender.classList.toggle('vertical')

                        if (!shipRender.classList.contains('vertical')) {
                            shipRender.classList.toggle('reversed')
                        }
                    }
                    this.ships.forEach(ship => {
                        ship.vertical = !ship.vertical

                        if (ship.vertical !== true) {
                            ship.reversed = !ship.reversed
                        }
                    })
                })
                renderX.append(button)

                this.ships.forEach((ship) => {
                    if (ship.pos.length === 0) { // check to make sure ship hasn't bene placed yet
                        ship.render = undefined
                        shipsContainer.appendChild(ship.render)
                    }
                })

                renderX.appendChild(shipsContainer)
            } else { // all ships placed
                this.board.renderOffense = this.attack.bind(this)

                let offense = this.board.renderOffense
                console.log('append offense', offense)
                renderX.append(offense)
            }

            let defense
            if (this.allShipsPlaced === false) {
                this.board.gameStarted = false

                this.board.renderDefense = this.place.bind(this)
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
        console.log(array, this)
        if (this.board.place(array) === true) { // if true, successful placement
            for (let ship of this.ships) {
                if (ship.length === array.length) { // this is a weakness, need a better way to identify ships -- would need ship drop event to transfer entire ship object
                    ship.pos = array

                    for (let ship of this.ships) { // Check for any unplaced ships
                        if (ship.pos.length === 0) {
                            return true // If any unplaced, return so code below isn't executed
                        }
                    }
                    console.log("All ships placed event emitting")
                    this.allShipsPlaced = true
                    this.eventsP.emit("All ships placed")
                    return true
                }
            }
        } else {
            return false
        }
    }

    receive(square, attacker) {
        console.log('receive', square, 'attacker:', attacker, "this:", this)

        if (this.board.attack(square, attacker) === true) { // if true, successful attack
            for (let ship of this.ships) {
                if (ship.pos.includes(square)) {
                    ship.health -= 1
                    break
                }
            }
            this.eventsP.emit("Hit received", square)
            return true
        } else {
            this.eventsP.emit("Miss received", square)
            return false
        }
    }

    attack(square) {
        console.log('player attack', square, this)
        if (this.board.attack(square, this) === true) { // keep track of your attacks
            console.log('emitting attack')
            this.eventsP.emit('Attack', { square: square, player: this })
        } else {
            throw Error("Invalid square!")
        }
    }

    attackSuccess(square) {
        if (this.board.offense[square] === 1) {
            this.board.offense[square] = 2

            return true
        } else {
            throw Error("No previous attack found! Can't mark successful")
        }
    }

    scuttle(ship) {
        console.log('scuttle', this, ship)
        this.survivors -= 1

        ship.sunk = true
        this.dead.push(ship)

        this.events.emit('Sunk', ship)

        if (this.survivors.length === 0) {
            this.defeated = true

            this.eventsP.emit('Defeated', this)
            // this.eventsP.removeEventListener('Defeated', this)
        }
    }
}