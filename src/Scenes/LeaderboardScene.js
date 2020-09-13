import Phaser from 'phaser';

export default class LeaderboardScene extends Phaser.Scene {
  constructor() {
    super('Leaderboard');
  }

  preload() {
    this.load.image('logo', 'assets/zenva_logo.png');
  }

  create() {
    this.scene.start('Preloader');
  }
}