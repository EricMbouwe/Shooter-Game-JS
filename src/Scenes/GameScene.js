import "phaser";
import Player from "../Objects//Hero/Player";
import ChaserShip from "../Objects/Enemies/ChaserShip";
import GunShip from "../Objects/Enemies/GunShip";
import CarrierShip from "../Objects/Enemies/CarrierShip";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("Game");
  }

  preload() {
    // load images
    this.load.image("darkPurpleBg", "assets/Background/darkPurpleBg.png");
    this.load.image("purpleBg", "assets/Background/purpleBg.png");
    this.load.spritesheet(
      "sprExplosion",
      "assets/Damage/playerShip1_damage3.png",
      {
        frameWidth: 32,
        frameHeight: 32,
      }
    );
    this.load.spritesheet("sprEnemy0", "assets/Enemies/enemyBlack1.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.image("sprEnemy1", "assets/Enemies/enemyRed3.png");
    this.load.spritesheet("sprEnemy2", "assets/Enemies/enemyGreen2.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.image("sprLaserEnemy0", "assets/Lasers/laserBlue08.png");
    this.load.image("sprLaserPlayer", "assets/Lasers/laserGreen15.png");
    this.load.spritesheet("sprPlayer", "assets/Hero/playerShip1_orange.png", {
      frameWidth: 16,
      frameHeight: 16,
    });

    //load sounds
    this.load.audio("sndExplode0", "assets/Explosion+2.mp3");
    this.load.audio("sndExplode1", "assets/Cannon+2.mp3");
    this.load.audio("sndLaser", "assets/Cannon+2.mp3");
  }

  create() {
    // create our animations
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

    // add sound to variable objects
    this.sfx = {
      explosions: [
        this.sound.add("sndExplode0"),
        this.sound.add("sndExplode1"),
      ],
      laser: this.sound.add("sndLaser"),
    };

    // create a player
    this.player = new Player(
      this,
      this.game.config.width * 0.5,
      this.game.config.height * 0.5,
      "sprPlayer"
    );

    // initialize moves key variables
    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keySpace = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    // allow the player to shoot
    if (this.keySpace.isDown) {
      this.player.setData("isShooting", true);
    } else {
      this.player.setData(
        "timerShootTick",
        this.player.getData("timerShootDelay") - 1
      );
      this.player.setData("isShooting", false);
    }

    // create a Group to hold our enemies, the lasers shot by enemies, and the lasers shot by the player
    this.enemies = this.add.group();
    this.enemyLasers = this.add.group();
    this.playerLasers = this.add.group();

    // create an event (it will act as a timer) which will spawn our enemies
    this.time.addEvent({
      delay: 100, // this can be changed to a higher value like 1000
      callback: function () {
        var enemy = null;

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

    // add collisions between game objects
    // enemy vs playerLaser (1- check the state of objects)
    this.physics.add.collider(this.playerLasers, this.enemies, function (
      playerLaser,
      enemy
    ) {
      if (enemy) {
        if (enemy.onDestroy !== undefined) {
          enemy.onDestroy();
        }

        enemy.explode(true);
        playerLaser.destroy();
      }
    });

    // enemy vs playerLaser (2- add a collider between this.player and this.enemies)
    this.physics.add.overlap(this.player, this.enemies, function (
      player,
      enemy
    ) {
      if (!player.getData("isDead") && !enemy.getData("isDead")) {
        player.explode(false);
        enemy.explode(true);
      }
    });

    // enemyLaser vs player (2- add a collider between this.player and this.enemies)
    this.physics.add.overlap(this.player, this.enemyLasers, function (
      player,
      laser
    ) {
      if (!player.getData("isDead") && !laser.getData("isDead")) {
        player.explode(false);
        laser.destroy();
      }
    });
  }

  // spawn the chaser ship
  getEnemiesByType(type) {
    var arr = [];
    for (var i = 0; i < this.enemies.getChildren().length; i++) {
      var enemy = this.enemies.getChildren()[i];
      if (enemy.getData("type") == type) {
        arr.push(enemy);
      }
    }
    return arr;
  }

  update() {
    if (!this.player.getData("isDead")) {
      this.player.update();
      if (this.keyW.isDown) {
        this.player.moveUp();
      } else if (this.keyS.isDown) {
        this.player.moveDown();
      }
      if (this.keyA.isDown) {
        this.player.moveLeft();
      } else if (this.keyD.isDown) {
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

    for (var i = 0; i < this.enemies.getChildren().length; i++) {
      var enemy = this.enemies.getChildren()[i];
      enemy.update();

      // add frustum culling
      // if (
      //   enemy.x < -enemy.displayWidth ||
      //   enemy.x > this.game.config.width + enemy.displayWidth ||
      //   enemy.y < -enemy.displayHeight * 4 ||
      //   enemy.y > this.game.config.height + enemy.displayHeight
      // ) {
      //   if (enemy) {
      //     if (enemy.onDestroy !== undefined) {
      //       enemy.onDestroy();
      //     }

      //     enemy.destroy();
      //   }
      // }
    }

    for (var i = 0; i < this.enemyLasers.getChildren().length; i++) {
      var laser = this.enemyLasers.getChildren()[i];
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

    for (var i = 0; i < this.playerLasers.getChildren().length; i++) {
      var laser = this.playerLasers.getChildren()[i];
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
