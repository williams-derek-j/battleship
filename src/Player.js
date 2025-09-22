import EventEmitter from "node:events";
import Gameboard from "./Gameboard";
import Ship from './Ship';

export default class Player {
    constructor(name, id, gameSettings) {
        this.name = name;
        this.id = id // Player 1, 2...
        this.defeated = false

        this.board = new Gameboard(gameSettings.boardLength);
        this._render = null
        this.events = new EventEmitter()

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
            // const boardLength = Math.sqrt(this.board.length)
            const render = document.createElement('div')

            if (this.allShipsPlaced === false) {
                const shipsContainer = document.createElement('div')

                this.ships.forEach((ship) => {
                    if (ship.pos.length === 0) { // check to make sure ship hasn't bene placed yet
                        ship.render
                        shipsContainer.appendChild(ship.render)
                    }
                })
                render.appendChild(shipsContainer)
            } else {
                this.board.renderOffense = this.attack

                let offense = this.board.renderOffense
                render.append(offense)

                // const offense = document.createElement('div')
                // offense.classList.add('offense')
                //
                // for (let i = 0; i < boardLength; i++) {
                //     const row = document.createElement('div')
                //
                //     for (let j = 0; j < boardLength; j++) {
                //         const index = ((offense.length * boardLength) + row.length)
                //
                //         const square = document.createElement('div')
                //         square.classList.add('square')
                //         square.classList.add('offense')
                //
                //         if (this.board.offense[index] === 1) {
                //             square.classList.add('miss')
                //         } else if (this.board.offense[index] === 2) {
                //             if (square.classList.contains('miss')) {
                //                 square.classList.remove('miss')
                //             }
                //             square.classList.add('hit')
                //         }
                //
                //         if (this.allShipsPlaced === true ) {
                //             square.addEventListener('click', (event) => {
                //                 this.attack(index)
                //             })
                //         }
                //         row.append(square)
                //     }
                //     offense.append(row)
                // }
                // render.appendChild(offense)
            }

            let defense
            if (this.allShipsPlaced === false) {
                this.board.gameStarted = false

                this.board.renderDefense = this.place
                defense = this.board.renderDefense
            } else {
                this.board.gameStarted = true

                this.board.renderDefense = undefined
                defense = this.board.renderDefense
            }
            render.append(defense)

            // const board = document.createElement('div')
            // board.classList.add('board')
            //
            // for (let i = 0; i < boardLength; i++) {
            //     const row = document.createElement('div')
            //
            //     for (let j = 0; j < boardLength; j++) {
            //         const index = ((board.length * boardLength) + row.length)
            //
            //         const square = document.createElement('div')
            //         square.classList.add('square')
            //
            //         if (this.allShipsPlaced === false ) {
            //             square.addEventListener('dragover', (event) => {
            //                 event.preventDefault()
            //             })
            //             square.addEventListener('drop', (event) => {
            //                 event.preventDefault()
            //
            //                 const dropped = JSON.parse(event.dataTransfer.getData('text'))
            //                 const length = dropped.length
            //                 const vertical = dropped.vertical
            //                 const reversed = dropped.reversed
            //
            //                 const array = []
            //                 if (!vertical) {
            //                     if (!reversed) {
            //                         for (let i = 0; i < length; i++) {
            //                             if (!reversed) {
            //                                 array.push(index + i)
            //                             }
            //                         }
            //                     } else {
            //                         for (let i = length - 1; i >= 0; i--) {
            //                             if (!reversed) {
            //                                 array.push(index - i)
            //                             }
            //                         }
            //                     }
            //                 } else {
            //                     if (!reversed) {
            //                         for (let i = 0; i < length; i++) {
            //                             array.push(index + (i * boardLength))
            //                         }
            //                     } else {
            //                         for (let i = length - 1; i >= 0; i--) {
            //                             array.push(index - (i * boardLength))
            //                         }
            //                     }
            //                 }
            //                 this.place(array)
            //             })
            //         } else {
            //             if (this.board.defense[index] === 1) {
            //                 square.classList.add('ship')
            //             } else if (this.board.defense[index] === 2) {
            //                 square.classList.add('damage')
            //             } else if (this.board.defense[index] === 3) {
            //                 square.classList.add('miss')
            //             }
            //         }
            //         row.append(square)
            //     }
            //     board.append(row)
            // }
            // render.appendChild(board)

            this._render = render
        }
    }

    get render() {
        if (this._render === null) {
            this.render = undefined // create render
        } else {
            return this._render
        }
    }

    place(array) {
        if (this.board.place(array) === true) { // if true, successful placement
            this.ships.forEach((ship) => {
                if (ship.length === array.length) { // this is a weakness, need a better way to identify ships -- would need ship drop event to transfer entire ship object
                    ship.pos = array

                    for (let ship of this.ships) { // Check for any unplaced ships
                        if (ship.pos.length === 0) {
                            return true // If any unplaced, return so code below isn't executed
                        }
                    }
                    this.events.emit('All ships placed')
                    return true
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