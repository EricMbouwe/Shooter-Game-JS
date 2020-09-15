import Phaser from "phaser";
import config from "../Config/config";
import Button from "../Objects/Button";
import { getTopScores } from "../Objects/Scores";

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

    getTopScores().then((response) => {
      const data = response.result;
      const height = 120;
      data
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map((item, i) =>
          this.add
            .bitmapText(
              150,
              `${height + (i*50)}`,
              "arcade",
              `${i + 1}    ${item.score}    ${item.user}`
            )
            .setTint(0xff0000)
        );
    });

    this.ExitButton = new Button(
      this,
      config.width / 2,
      config.height / 2 + 220,
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

    this.scene.launch("Starfield");
  }
}
