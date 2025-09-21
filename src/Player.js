import EventEmitter from "node:events";
import Gameboard from "./Gameboard";

export default class Player {
    constructor(name, id, gameSettings = { players: 2, boardLength: 8, shipsPerPlayer: 4, }) {
        this.name = name;
        this.id = id // Player 1, 2...

        this.board = new Gameboard(8);
        this.events = new EventEmitter()
    }

    receive(square, attacker) {
        this.board.attack(square, attacker)
    }

    attack(square) {
        this.board.attack(square, this) // keep track of your attacks

        this.events.emit('Attack', { player: id, square: square })
    }
}