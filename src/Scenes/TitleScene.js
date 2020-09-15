import Phaser from "phaser";
import config from "../Config/config";
import Button from "../Objects/Button";
import ScrollingBackground from "../Objects/ScrollingBackground";

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super("Title");
  }

  /* preload() {
    this.load.image("sprBg0", "assets/sprBg0.png");
    this.load.image("sprBg1", "assets/sprBg1.png");

    this.load.audio("sndBtnOver", "assets/sndBtnOver.wav");
    this.load.audio("sndBtnDown", "assets/sndBtnDown.wav");
  } */

  create() {
    this.scene.stop("InputPanel");
    
    // sound effect object
    this.sfx = {
      btnOver: this.sound.add("sndBtnOver"),
      btnDown: this.sound.add("sndBtnDown"),
    };

    // add scrolling background
    this.backgrounds = [];
    for (let i = 0; i < 5; i += 1) {
      const keys = ["sprteBg0", "sprBg1"];
      const key = keys[Phaser.Math.Between(0, keys.length - 1)];
      const bg = new ScrollingBackground(this, key, i * 10);
      this.backgrounds.push(bg);
    }

    // Title
    this.title = this.add.text(
      this.game.config.width * 0.5,
      128,
      "SPACE SHOOTER",
      {
        fontFamily: "monospace",
        fontSize: 48,
        fontStyle: "bold",
        color: "#ffffff",
        align: "center",
      }
    );

    this.title.setOrigin(0.5);

    // Game
    this.gameButton = new Button(
      this,
      config.width / 2,
      config.height / 2 - 100,
      "blueButton1",
      "blueButton2",
      "Start",
      "Game"
    );

    // Options
    this.optionsButton = new Button(
      this,
      config.width / 2,
      config.height / 2,
      "blueButton1",
      "blueButton2",
      "Options",
      "Options"
    );

    // Credits
    this.creditsButton = new Button(
      this,
      config.width / 2,
      config.height / 2 + 100,
      "blueButton1",
      "blueButton2",
      "Credits",
      "Credits"
    );

    // LeaderBoard
    this.LeaderBoardButton = new Button(
      this,
      config.width / 2,
      config.height / 2 + 200,
      "blueButton1",
      "blueButton2",
      "Top 10",
      "Leaderboard"
    );

    this.model = this.sys.game.globals.model;
    if (this.model.musicOn === true && this.model.bgMusicPlaying === false) {
      this.bgMusic = this.sound.add("bgMusic", { volume: 0, loop: true });
      this.bgMusic.play();
      this.model.bgMusicPlaying = true;
      this.sys.game.globals.bgMusic = this.bgMusic;
    }
  }

  update() {
    for (let i = 0; i < this.backgrounds.length; i += 1) {
      this.backgrounds[i].update();
    }
  }

  centerButton(gameObject, offset = 0) {
    Phaser.Display.Align.In.Center(
      gameObject,
      this.add.zone(
        config.width / 2,
        config.height / 2 - offset * 100,
        config.width,
        config.height
      )
    );
  }

  centerButtonText(gameText, gameButton) {
    Phaser.Display.Align.In.Center(gameText, gameButton);
  }
}
