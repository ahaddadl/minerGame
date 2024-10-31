class Miner {
  constructor(ctx) {
    this.ctx = ctx;

    this.img = new Image();
    this.img.frames = 10;
    this.img.frameIndex = 0;
    this.img.src = "/assets/images/Minning.png";

    this.tick = 0;

    this.drawCount = 3;

    this.w = 20;
    this.h = 20;

    this.x = 400;
    this.y = 60;

    this.vx = 0;
    this.vy = 0;

    this.ax = 0;
    this.ay = 0;
  }

  draw() {
    this.ctx.drawImage(
      this.img,
      this.img.frameIndex * (this.img.width / this.img.frames),
      20,
      this.img.width / this.img.frames,
      this.img.height,

      this.x,
      this.y,
      this.w * 3,
      this.h * 3
    );

    this.tick++;

    if (this.tick > 10) {
      this.tick = 0;

      this.img.frameIndex++;
      if (this.img.frameIndex >= this.img.frames) {
        this.img.frameIndex = 0;
      }
    }
  }

  move() {
    if (this.tick++ > this.drawCount) {
      this.tick = 0;
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0) this.x = 0;
      if (this.x + this.w > this.ctx.canvas.width)
        this.x = this.ctx.canvas.width - this.w;
      if (this.y < 0) this.y = 0;
      if (this.y + this.h > this.ctx.canvas.height)
        this.y = this.ctx.canvas.height - this.h;
    }
  }

  gameOver() {
    console.error("game over");
  }

  collides(el) {
    const colX = el.x < this.x + this.w && el.x + el.w > this.x;
    const colY = el.y < this.y + this.h && el.y + el.h > this.y;

    return colX && colY;
  }

  checkCollisions() {}

  onKeyDown(code) {
    switch (code) {
      case KEY_RIGHT:
        this.vx = 20;
        break;
      case KEY_LEFT:
        this.vx = -20;
        break;
      case KEY_UP:
        this.vy = -20;
        break;
      case KEY_DOWN:
        this.vy = +20;
        break;

      default:
        break;
    }
  }

  onKeyUp(code) {
    switch (code) {
      case KEY_RIGHT:
      case KEY_LEFT:
        this.vx = 0;
        break;
      case KEY_UP:
      case KEY_DOWN:
        this.vy = 0;
        break;

      default:
        break;
    }
  }
}
