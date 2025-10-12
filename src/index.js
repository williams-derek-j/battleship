import "./style.css"
import EventEmitter from 'events'
import InitGame from './InitGame'
import Game from './Game'

const body = document.querySelector('body')

const events = new EventEmitter()

new InitGame(body, events)

events.on('settings submitted', (settings)=> {
    console.log('settings submitted', settings)

    const game = new Game(body, settings)
    game.play()
})