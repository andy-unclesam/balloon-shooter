import '../style.css'
import { GameLoop } from './game/GameLoop.js'

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const gameLoop = new GameLoop(canvas);
    gameLoop.start();
});
