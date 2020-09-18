import Phaser from 'phaser';

export default class InputPanelScene extends Phaser.Scene {
  constructor() {
    super('InputPanel');

    this.chars = [
      ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
      ['K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'],
      ['U', 'V', 'W', 'X', 'Y', 'Z', '.', '-', '<', '>'],
    ];

    this.cursor = new Phaser.Math.Vector2();

    this.text = '';
    this.block = '';

    this.name = '';
    this.charLimit = 5;
  }

  preload() {
    this.load.image('block', 'assets/block.png');
    this.load.image('rub', 'assets/rub.png');
    this.load.image('end', 'assets/end.png');
  }

  create() {
    const text = this.add.bitmapText(
      130,
      50,
      'arcade',
      'ABCDEFGHIJ\n\nKLMNOPQRST\n\nUVWXYZ.-',
    );

    text.setLetterSpacing(20);
    text.setInteractive();

    this.add.image(text.x + 430, text.y + 148, 'rub');
    this.add.image(text.x + 482, text.y + 148, 'end');

    this.block = this.add.image(text.x - 10, text.y - 2, 'block').setOrigin(0);

    this.text = text;

    text.on('pointermove', this.moveBlock, this);
    text.on('pointerup', this.pressKey, this);

    this.input.keyboard.on('keyup', this.anyKey, this);
  }

  moveBlock(pointer, x, y) {
    const cx = Phaser.Math.Snap.Floor(x, 52, 0, true);
    const cy = Phaser.Math.Snap.Floor(y, 64, 0, true);

    this.cursor.set(cx, cy);

    this.block.x = this.text.x - 10 + cx * 52;
    this.block.y = this.text.y - 2 + cy * 64;
  }

  pressKey() {
    const { x } = this.cursor;
    const { y } = this.cursor;
    const nameLength = this.name.length;

    this.block.x = this.text.x - 10 + x * 52;
    this.block.y = this.text.y - 2 + y * 64;

    if (x === 9 && y === 2 && nameLength > 0) {
      this.events.emit('submitName', this.name);
    } else if (x === 8 && y === 2 && nameLength > 0) {
      this.name = this.name.substr(0, nameLength - 1);
      this.events.emit('updateName', this.name);
    } else if (this.name.length < this.charLimit) {
      this.name = this.name.concat(this.chars[y][x]);
      this.events.emit('updateName', this.name);
    }
  }

  anyKey(event) {
    let code = event.keyCode;

    if (code === Phaser.Input.Keyboard.KeyCodes.PERIOD) {
      this.cursor.set(6, 2);
      this.pressKey();
    } else if (code === Phaser.Input.Keyboard.KeyCodes.MINUS) {
      this.cursor.set(7, 2);
      this.pressKey();
    } else if (
      code === Phaser.Input.Keyboard.KeyCodes.BACKSPACE
      || code === Phaser.Input.Keyboard.KeyCodes.DELETE
    ) {
      this.cursor.set(8, 2);
      this.pressKey();
    } else if (
      code >= Phaser.Input.Keyboard.KeyCodes.A
      && code <= Phaser.Input.Keyboard.KeyCodes.Z
    ) {
      code -= 65;

      const y = Math.floor(code / 10);
      const x = code - y * 10;

      this.cursor.set(x, y);
      this.pressKey();
    }
  }
}
