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
        this.events.on('All ships placed', (event) => {
            this.allShipsPlaced = true
        })

        this.ships = []
        for (let length of gameSettings.shipLengths) {
            const ship = new Ship(length)

            ship.events.on('Sunk', this.scuttle)

            this.ships.push(ship)
        }
        this.survivors = this.ships.length
        this.dead = []
    }

    set render(render) {
        if (render !== undefined) {
            this._render = render
        } else {
            const render = document.createElement('div')
            render.classList.add('player')

            if (this.allShipsPlaced === false) {
                const shipsContainer = document.createElement('div')
                shipsContainer.classList.add('shipsContainer')

                this.ships.forEach((ship) => {
                    if (ship.pos.length === 0) { // check to make sure ship hasn't bene placed yet
                        ship.render = undefined
                        shipsContainer.appendChild(ship.render)
                    }
                })
                render.appendChild(shipsContainer)
            } else {
                this.board.renderOffense = this.attack.bind(this)

                let offense = this.board.renderOffense
                render.append(offense)
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
            render.append(defense)

            this._render = render
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
            console.log('ww')
            for (let ship of this.ships) {
                if (ship.length === array.length) { // this is a weakness, need a better way to identify ships -- would need ship drop event to transfer entire ship object
                    console.log('?')
                    ship.pos = array

                    for (let ship of this.ships) { // Check for any unplaced ships
                        if (ship.pos.length === 0) {
                            console.log('ship', ship)
                            return true // If any unplaced, return so code below isn't executed
                        }
                    }
                    this.events.emit('All ships placed')
                    return true
                }
            }
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
            this.eventsP.emit('Hit received', square)
        } else {
            this.eventsP.emit('Miss received', square)
        }
    }

    attack(square) {
        if (this.board.attack(square, this) === true) { // keep track of your attacks
            this.eventsP.emit('Attack', { square: square, player: this })
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

            this.eventsP.emit('Defeated', this)
            // this.eventsP.removeEventListener('Defeated', this)
        }
    }
}