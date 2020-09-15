import Phaser from "phaser";
import "./main.scss";
import config from "./Config/config";
import GameScene from "./Scenes/GameScene";
import GameOverScene from "./Scenes/GameOverScene";
import InputPanelScene from "./Scenes/InputPanelScene";
import LeaderboardScene from "./Scenes/LeaderboardScene";
import Starfield from "./Scenes/Starfield";
import BootScene from "./Scenes/BootScene";
import PreloaderScene from "./Scenes/PreloaderScene";
import TitleScene from "./Scenes/TitleScene";
import OptionsScene from "./Scenes/OptionsScene";
import CreditsScene from "./Scenes/CreditsScene";
import Model from "./Model";

class Game extends Phaser.Game {
  constructor() {
    super(config);
    const model = new Model();
    this.globals = { model, bgMusic: null };
    this.scene.add("Boot", BootScene);
    this.scene.add("Preloader", PreloaderScene);
    this.scene.add("Title", TitleScene);
    this.scene.add("Options", OptionsScene);
    this.scene.add("Credits", CreditsScene);
    this.scene.add("Game", GameScene);
    this.scene.add("GameOver", GameOverScene);
    this.scene.add("InputPanel", InputPanelScene);
    this.scene.add("Leaderboard", LeaderboardScene);
    this.scene.add("Starfield", Starfield);
    this.scene.start("Boot");
  }
}

window.game = new Game();
