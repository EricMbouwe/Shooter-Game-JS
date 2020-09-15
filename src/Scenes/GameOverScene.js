import Phaser from "phaser";
import config from "../Config/config";
import Button from "../Objects/Button";
import ScrollingBackground from "../Objects/ScrollingBackground";

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super("GameOver");
    this.playerText;
  }

  preload() {
    this.load.image("block", "assets/block.png");
    this.load.bitmapFont("arcade", "assets/arcade.png", "assets/arcade.xml");
  }

  create() {
    // sound effect object
    this.sfx = {
      btnOver: this.sound.add("sndBtnOver"),
      btnDown: this.sound.add("sndBtnDown"),
    };

    // add scrolling background
    this.backgrounds = [];
    for (let i = 0; i < 5; i += 1) {
      const keys = ["sprBg0", "sprBg1"];
      const key = keys[Phaser.Math.Between(0, keys.length - 1)];
      const bg = new ScrollingBackground(this, key, i * 10);
      this.backgrounds.push(bg);
    }

    // start input scene
    this.scene.launch("InputPanel");

    // Set the player text
    // this.playerText = this.add
    //   .bitmapText(580, 310, "arcade", "")
    //   .setTint(0xff0000);

    this.playerText = this.add
      .bitmapText(350, 260, "arcade", "NAME", 20)
      .setTint(0xff0000);

    //  Do this, otherwise this Scene will steal all keyboard input
    this.input.keyboard.enabled = false; //input

    let panel = this.scene.get("InputPanel");

    //  Listen to events from the Input Panel scene
    panel.events.on("updateName", this.updateName, this);
    panel.events.on("submitName", this.submitName, this);

    // Title
    this.title = this.add.text(this.game.config.width * 0.5, 350, "GAME OVER", {
      fontFamily: "monospace",
      fontSize: 48,
      fontStyle: "bold",
      color: "#ffffff",
      align: "center",
    });

    this.title.setOrigin(0.5);

    //  Restart Game
    this.RestartButton = new Button(
      this,
      config.width / 2,
      config.height / 2 + 190,
      "blueButton1",
      "blueButton2",
      "Restart",
      "Game"
    );

    // Exit
    this.ExitButton = new Button(
      this,
      config.width / 2,
      config.height / 2 + 250,
      "blueButton1",
      "blueButton2",
      "Exit",
      "Title"
    );
  }

  submitName() {
    // call the score api to add the new score of the current player

    // populate the leaderboard
    
    this.scene.stop("InputPanel");
    this.add
      .bitmapText(100, 360, "arcade", "2ND   40000    ANT")
      .setTint(0xff8200);

    // start the leaderboard scene
    this.scene.start('Leaderboard')
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
