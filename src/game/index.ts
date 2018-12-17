import { GameEngine } from './GameEngine';
const gameWorldMap = require('./game_map_creator/default_world_map.gwm');

const canvas = <HTMLCanvasElement> document.getElementById('render-canvas');
new GameEngine(canvas).runGame(gameWorldMap);
