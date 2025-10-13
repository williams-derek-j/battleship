import "./style.css"
import EventEmitter from 'events'
import InitGame from './InitGame'
import Game from './Game'

const body = document.querySelector('body')

const game1 = document.createElement('div')
const game2 = document.createElement('div')

body.appendChild(game1)
body.appendChild(game2)

const events = new EventEmitter()
const events2 = new EventEmitter

new InitGame(game1, events)
// new InitGame(game2, events2)

events.on('settings submitted', (settings)=> {
    console.log('settings submitted', settings)

    const game = new Game(game1, settings)
    game.play()
})

events2.on('settings submitted', (settings)=> {
    console.log('settings submitted', settings)

    const game = new Game(game2, settings)
    game.play()
})