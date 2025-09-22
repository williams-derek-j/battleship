import Player from './Player'

export default class Game {
    constructor(gameSettings = { players: 2, boardLength: 8, shipsPerPlayer: 4, shipLengths: [3,4,5,6] }) {
        if (gameSettings.length !== 4) {
            throw Error('Missing one or more required game settings!')
        }

        this.players = []
        for (let i = 0; i < gameSettings.players; i++) {
            const player = new Player(`Player${i}`, i, gameSettings);

            player.events.on('Attack', this.sendAttempt)
            player.events.on('Hit', this.sendAttack)
            player.events.on('Miss', this.sendMiss)
            player.events.on('Sunk', this.sendSink)
            player.events.on('Defeated', this.sendDefeat)

            this.players.push(player)
        }

        this.survivors = this.players.length
    }

    play() {

    }
}