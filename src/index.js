console.log('hi')

import "./style.css";
import Game from './Game';

const body = document.querySelector('body')

const game = new Game(body,{ players: 2, boardLength: 8, shipsPerPlayer: 1, shipLengths: [3] })
game.play()