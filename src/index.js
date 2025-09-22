import "./style.css";
import Game from './Game';

const body = document.querySelector('body')

const game = new Game(body,{ players: 2, boardLength: 8, shipsPerPlayer: 4, shipLengths: [3,4,5,6] })
game.play()