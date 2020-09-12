import "phaser";
import Entity from "../Entities";

export default class ChaserShip extends Entity {
  constructor(scene, x, y) {
    super(scene, x, y, "sprEnemy1", "ChaserShip");
    this.body.velocity.y = Phaser.Math.Between(50, 100);
  }

  update() {
    if (!this.getData("isDead") && this.scene.player) {
      console.log(this);
      // if (
      //   Phaser.Math.Distance.Between(
      //     this.x,
      //     this.y,
      //     this.scene.player.x,
      //     this.scene.player.y
      //   ) < 320
      // ) {
      //   this.state = this.states.CHASE;
      // }

      // if (this.state == this.states.CHASE) {
      //   var dx = this.scene.player.x - this.x;
      //   var dy = this.scene.player.y - this.y;

      //   var angle = Math.atan2(dy, dx);

      //   var speed = 100;
      //   this.body.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
      // }

      // chasing the player(rotate)
      if (this.x < this.scene.player.x) {
        this.angle -= 5;
      } else {
        this.angle += 5;
      }
    }
  }
}
