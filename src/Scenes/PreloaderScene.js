import Phaser from "phaser";

export default class PreloaderScene extends Phaser.Scene {
  constructor() {
    super("Preloader");
  }

  init() {
    this.readyCount = 0;
  }

  preload() {
    this.add.image(400, 200, "logo");

    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 320, 50);

    const { width } = this.cameras.main;
    const { height } = this.cameras.main;
    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: "Loading...",
      style: {
        font: "20px monospace",
        fill: "#ffffff",
      },
    });
    loadingText.setOrigin(0.5, 0.5);

    const percentText = this.make.text({
      x: width / 2,
      y: height / 2 - 5,
      text: "0%",
      style: {
        font: "18px monospace",
        fill: "#ffffff",
      },
    });
    percentText.setOrigin(0.5, 0.5);

    const assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 50,
      text: "",
      style: {
        font: "18px monospace",
        fill: "#ffffff",
      },
    });
    assetText.setOrigin(0.5, 0.5);

    this.load.on("progress", (value) => {
      percentText.setText(`${parseInt(value * 100)}%`);
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(250, 280, 300 * value, 30);
    });

    this.load.on("fileprogress", (file) => {
      assetText.setText(`Loading asset: ${file.key}`);
    });

    this.load.on("complete", () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
      this.ready();
    });

    this.timedEvent = this.time.delayedCall(3000, this.ready, [], this);

    this.load.image("blueButton1", "assets/ui/blue_button02.png");
    this.load.image("blueButton2", "assets/ui/blue_button03.png");
    this.load.image("phaserLogo", "assets/logo.png");
    this.load.image("box", "assets/ui/grey_box.png");
    this.load.image("checkedBox", "assets/ui/blue_boxCheckmark.png");
    this.load.audio("bgMusic", ["assets/TownTheme.mp3"]);

    this.load.image("sprteBg0", "assets/Background/Background-2.png");
    this.load.image("sprteBg1", "assets/Background/Background-4.png");
    this.load.audio("sndBtnOver", "assets/sndBtnOver.wav");
    this.load.audio("sndBtnDown", "assets/sndBtnDown.wav");

    this.load.image("sprBg0", "assets/sprBg0.png");
    this.load.image("sprBg1", "assets/sprBg1.png");
    this.load.spritesheet("sprExplosion", "assets/sprExplosion.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("sprEnemy0", "assets/sprEnemy0.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.image("sprEnemy1", "assets/Meteors/meteorGrey_tiny1.png");
    this.load.spritesheet("sprEnemy2", "assets/sprEnemy2.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.image("sprLaserEnemy0", "assets/sprLaserEnemy0.png");
    this.load.image("sprLaserPlayer", "assets/sprLaserPlayer.png");
    this.load.spritesheet("sprPlayer", "assets/ship.png", {
      frameWidth: 16,
      frameHeight: 24,
    });

    this.load.audio("sndExplode0", "assets/Explosion+2.mp3");
    this.load.audio("sndExplode1", "assets/Cannon+2.mp3");
    this.load.audio("sndLaser", "assets/Cannon+2.mp3");

    this.load.bitmapFont("arcade", "assets/arcade.png", "assets/arcade.xml");
  }

  ready() {
    this.scene.start("Title");
    this.readyCount += 1;
    if (this.readyCount === 2) {
      this.scene.start("Title");
    }
  }
}
