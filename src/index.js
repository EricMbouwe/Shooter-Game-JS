import 'phaser';
import './main.scss'
import config from './Config/config';
import GameScene from './Scenes/GameScene';

class Game extends Phaser.Game {
  constructor() {
    super(config);
    this.scene.add('Game', GameScene);
    this.scene.start('Game');
  }
}

window.game = new Game();



// import 'phaser';
// import { GameScene } from './scenes/GameScene'

// const gameConfig = {
//   width: 680,
//   height: 600,
//   scene: SimpleScene
// };

// new Phaser.Game(gameConfig)