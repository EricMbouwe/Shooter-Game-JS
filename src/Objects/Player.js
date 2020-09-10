class Player extends Entity {
  constructor(scene, x, y, key, type) {
    super(scene, x, y, key, "Player");
    this.setData("speed", 200);
    this.play("sprPlayer");
  }
}