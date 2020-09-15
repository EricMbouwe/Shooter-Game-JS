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
      .bitmapText(100, 260, "arcade", "RANK  SCORE   NAME")
      .setTint(0xff00ff);

    // dynamically add scores  
    this.add.bitmapText(100, 310, "arcade", "1ST   50000").setTint(0xff0000);

    // Exit
    this.LeaderBoardButton = new Button(
      this,
      config.width / 2,
      config.height / 2 + 200,
      "blueButton1",
      "blueButton2",
      "Exit",
      "Title"
    );
  }
}
