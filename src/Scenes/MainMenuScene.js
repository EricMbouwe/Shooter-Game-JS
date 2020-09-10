import 'phaser';

export default class MainmenuScene extends Phaser.Scene {
  constructor() {
    super('Mainmenu');
  }

  preload() {
    this.load.image('logo', 'assets/zenva_logo.png');
    this.load.image("sprBtnPlay", "assets/sprBtnPlay.png");
    this.load.image("sprBtnPlayHover", "assets/sprBtnPlayHover.png");
    this.load.image("sprBtnPlayDown", "assets/sprBtnPlayDown.png");
    this.load.image("sprBtnRestart", "assets/sprBtnRestart.png");
    this.load.image("sprBtnRestartHover", "assets/sprBtnRestartHover.png");
    this.load.image("sprBtnRestartDown", "assets/sprBtnRestartDown.png");

    this.load.audio("sndBtnOver", "content/sndBtnOver.wav");
    this.load.audio("sndBtnDown", "content/sndBtnDown.wav");
  }

  create() {
    this.scene.start('Preloader');
  }
}