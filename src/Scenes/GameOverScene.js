import 'phaser';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOver');
  }

  preload() {
    // load images
    this.load.image('logo', 'assets/logo.png');
  }

  create() {
    this.add.image(400, 300, 'logo');
  }
}
