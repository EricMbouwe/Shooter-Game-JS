import Phaser from "phaser";
import ScrollingBackground from "../Objects/ScrollingBackground";
import Player from "../Objects/Hero/Player";
import ChaserShip from "../Objects/Enemies/ChaserShip";
import GunShip from "../Objects/Enemies/GunShip";
import CarrierShip from "../Objects/Enemies/CarrierShip";
import { setScore } from "../Objects/Scores";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("Game");
  }

  create() {
    this.scene.stop("InputPanel");

    this.score = 0;
    this.scoreLabel = this.add.bitmapText(10, 5, "arcade", "SCORE 0000", 18);

    this.anims.create({
      key: "sprEnemy0",
      frames: this.anims.generateFrameNumbers("sprEnemy0"),
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: "sprEnemy2",
      frames: this.anims.generateFrameNumbers("sprEnemy2"),
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: "sprExplosion",
      frames: this.anims.generateFrameNumbers("sprExplosion"),
      frameRate: 20,
      repeat: 0,
    });

    this.anims.create({
      key: "sprPlayer",
      frames: this.anims.generateFrameNumbers("sprPlayer"),
      frameRate: 20,
      repeat: -1,
    });

    this.sfx = {
      explosions: [
        this.sound.add("sndExplode0"),
        this.sound.add("sndExplode1"),
      ],
      laser: this.sound.add("sndLaser"),
    };

    this.backgrounds = [];
    for (let i = 0; i < 5; i += 1) {
      const bg = new ScrollingBackground(this, "sprBg0", i * 10);
      this.backgrounds.push(bg);
    }

    this.player = new Player(
      this,
      this.game.config.width * 0.5,
      this.game.config.height * 0.5,
      "sprPlayer"
    );

    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keySpace = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    this.keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.keyDown = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.DOWN
    );
    this.keyLeft = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.LEFT
    );
    this.keyRight = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.RIGHT
    );
    this.keySpace = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    if (this.keySpace.isDown) {
      this.player.setData("isShooting", true);
    } else {
      this.player.setData(
        "timerShootTick",
        this.player.getData("timerShootDelay") - 1
      );
      this.player.setData("isShooting", false);
    }

    this.enemies = this.add.group();
    this.enemyLasers = this.add.group();
    this.playerLasers = this.add.group();

    // create an event (it will act as a timer) which will spawn our enemies
    this.time.addEvent({
      delay: 600,
      callback() {
        let enemy = null;

        if (Phaser.Math.Between(0, 10) >= 3) {
          enemy = new GunShip(
            this,
            Phaser.Math.Between(0, this.game.config.width),
            0
          );
        } else if (Phaser.Math.Between(0, 10) >= 5) {
          if (this.getEnemiesByType("ChaserShip").length < 5) {
            enemy = new ChaserShip(
              this,
              Phaser.Math.Between(0, this.game.config.width),
              0
            );
          }
        } else {
          enemy = new CarrierShip(
            this,
            Phaser.Math.Between(0, this.game.config.width),
            0
          );
        }

        if (enemy !== null) {
          enemy.setScale(Phaser.Math.Between(10, 20) * 0.1);
          this.enemies.add(enemy);
        }
      },
      callbackScope: this,
      loop: true,
    });

    // enemy vs playerLaser (1- check the state of objects)
    this.physics.add.collider(
      this.playerLasers,
      this.enemies,
      (playerLaser, enemy) => {
        if (enemy) {
          if (enemy.onDestroy !== undefined) {
            enemy.onDestroy();
          }

          enemy.explode(true);
          playerLaser.destroy();
          this.score = setScore(this, 100);
          const scoreFormated = this.zeroPad(this.score, 4);
          this.scoreLabel.text = `SCORE ${scoreFormated}`;
          window.game.score = scoreFormated;
        }
      }
    );

    // enemy vs playerLaser (2- add a collider between this.player and this.enemies)
    this.physics.add.overlap(this.player, this.enemies, (player, enemy) => {
      if (!player.getData("isDead") && !enemy.getData("isDead")) {
        player.explode(false);
        player.onDestroy();
        enemy.explode(true);
      }
    });

    // enemyLaser vs player (2- add a collider between this.player and this.enemiesLasers)
    this.physics.add.overlap(this.player, this.enemyLasers, (player, laser) => {
      if (!player.getData("isDead") && !laser.getData("isDead")) {
        player.explode(false);
        player.onDestroy();
        laser.destroy();
      }
    });
  }

  zeroPad(number, size) {
    let stringNumber = String(number);
    while (stringNumber.length < (size || 2)) {
      stringNumber = "0" + stringNumber;
    }
    return stringNumber;
  }

  getEnemiesByType(type) {
    const arr = [];
    for (let i = 0; i < this.enemies.getChildren().length; i += 1) {
      const enemy = this.enemies.getChildren()[i];
      if (enemy.getData("type") === type) {
        arr.push(enemy);
      }
    }
    return arr;
  }

  update() {
    for (let i = 0; i < this.backgrounds.length; i += 1) {
      this.backgrounds[i].update();
    }

    if (!this.player.getData("isDead")) {
      this.player.update();

      if (this.keyW.isDown || this.keyUp.isDown) {
        this.player.moveUp();
      } else if (this.keyS.isDown || this.keyDown.isDown) {
        this.player.moveDown();
      }
      if (this.keyA.isDown || this.keyLeft.isDown) {
        this.player.moveLeft();
      } else if (this.keyD.isDown || this.keyRight.isDown) {
        this.player.moveRight();
      }

      if (this.keySpace.isDown) {
        this.player.setData("isShooting", true);
      } else {
        this.player.setData(
          "timerShootTick",
          this.player.getData("timerShootDelay") - 1
        );
        this.player.setData("isShooting", false);
      }
    }

    for (let i = 0; i < this.enemies.getChildren().length; i += 1) {
      const enemy = this.enemies.getChildren()[i];
      enemy.update();

      // add frustum culling to avoid lagging
      if (
        enemy.x < -enemy.displayWidth ||
        enemy.x > this.game.config.width + enemy.displayWidth ||
        enemy.y < -enemy.displayHeight * 4 ||
        enemy.y > this.game.config.height + enemy.displayHeight
      ) {
        if (enemy) {
          if (enemy.onDestroy !== undefined) {
            enemy.onDestroy();
          }

          enemy.destroy();
        }
      }
    }

    for (let i = 0; i < this.enemyLasers.getChildren().length; i += 1) {
      const laser = this.enemyLasers.getChildren()[i];
      laser.update();

      if (
        laser.x < -laser.displayWidth ||
        laser.x > this.game.config.width + laser.displayWidth ||
        laser.y < -laser.displayHeight * 4 ||
        laser.y > this.game.config.height + laser.displayHeight
      ) {
        if (laser) {
          laser.destroy();
        }
      }
    }

    for (let i = 0; i < this.playerLasers.getChildren().length; i += 1) {
      const laser = this.playerLasers.getChildren()[i];
      laser.update();

      if (
        laser.x < -laser.displayWidth ||
        laser.x > this.game.config.width + laser.displayWidth ||
        laser.y < -laser.displayHeight * 4 ||
        laser.y > this.game.config.height + laser.displayHeight
      ) {
        if (laser) {
          laser.destroy();
        }
      }
    }
  }
}
