console.log('hi')

import "./style.css"
import EventEmitter from 'events'
import InitGame from './InitGame'
import Game from './Game'

const events = new EventEmitter()

const body = document.querySelector('body')

const settings = new InitGame(body, events)
events.on('settings submitted', function createGame(settings) {
    const game = new Game(body, settings)

    game.play()
})



// const game = new Game(body,{ players: 2, boardLength: 8, shipsPerPlayer: 1, shipLengths: [3] })
// game.play()