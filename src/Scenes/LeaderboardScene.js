import Phaser from "phaser";
import config from "../Config/config";
import Button from "../Objects/Button";

export default class LeaderboardScene extends Phaser.Scene {
  constructor() {
    super("Leaderboard");
  }

  preload() {
    this.load.image("block", "assets/block.png");
    this.load.bitmapFont("arcade", "assets/arcade.png", "assets/arcade.xml");
  }

  create() {
    this.add
      .bitmapText(100, 60, "arcade", "RANK  SCORE   NAME")
      .setTint(0xff00ff);

    // dynamically add scores to the table
    this.add.bitmapText(100, 120, "arcade", "1ST   50000").setTint(0xff0000);

    // Exit
    this.ExitButton = new Button(
      this,
      config.width / 2,
      config.height / 2 + 260,
      "blueButton1",
      "blueButton2",
      "Exit",
      "Title"
    );

    this.tweens.add({
      targets: this.block,
      alpha: 0.2,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
      duration: 350,
    });

    this.scene.launch("Starfield")
  }
}
