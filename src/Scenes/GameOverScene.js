import Phaser from 'phaser';
import config from '../Config/config';
import Button from '../Objects/Button';
import { saveScore } from '../Objects/Scores';
import ScrollingBackground from '../Objects/ScrollingBackground';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOver');
    this.playerText = '';
  }

  preload() {
    this.load.image('block', 'assets/block.png');
    this.load.bitmapFont('arcade', 'assets/arcade.png', 'assets/arcade.xml');
  }

  create() {
    this.backgrounds = [];
    for (let i = 0; i < 5; i += 1) {
      const keys = ['sprBg0', 'sprBg1'];
      const key = keys[Phaser.Math.Between(0, keys.length - 1)];
      const bg = new ScrollingBackground(this, key, i * 10);
      this.backgrounds.push(bg);
    }

    this.scene.launch('InputPanel');

    this.playerText = this.add
      .bitmapText(390, 260, 'arcade', 'Enter your name', 20)
      .setTint(0xff0000)
      .setOrigin(0.5);

    this.input.keyboard.enabled = false;

    const panel = this.scene.get('InputPanel');

    panel.events.on('updateName', this.updateName, this);
    panel.events.on('submitName', this.submitName, this);

    this.title = this.add.text(this.game.config.width * 0.5, 350, 'GAME OVER', {
      fontFamily: 'monospace',
      fontSize: 48,
      fontStyle: 'bold',
      color: '#ffffff',
      align: 'center',
    });

    this.title.setOrigin(0.5);

    this.RestartButton = new Button(
      this,
      config.width / 2,
      config.height / 2 + 190,
      'blueButton1',
      'blueButton2',
      'Restart',
      'Game',
    );

    this.ExitButton = new Button(
      this,
      config.width / 2,
      config.height / 2 + 250,
      'blueButton1',
      'blueButton2',
      'Exit',
      'Title',
    );
  }

  submitName() {
    const { score } = window.game;
    const name = this.playerText.text;
    saveScore(score, name);

    this.scene.stop('InputPanel');
    this.scene.start('Leaderboard');
  }

  updateName(name) {
    this.playerText.setText(name);
  }

  update() {
    for (let i = 0; i < this.backgrounds.length; i += 1) {
      this.backgrounds[i].update();
    }
  }
}
