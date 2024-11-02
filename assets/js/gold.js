class Gold {
  constructor(ctx, cuadradosTierra, score = 1) {
    this.ctx = ctx;
    this.score = score;

    this.w = 20;
    this.h = 20;

    const randomTierra =
      cuadradosTierra[Math.floor(Math.random() * cuadradosTierra.length)];
    this.x = randomTierra.x;
    this.y = randomTierra.y;

    // this.x =
    //   20 *
    //   Math.floor((Math.random() * (this.ctx.canvas.width - this.w)) / this.w);

    // this.y =
    //   (this.ctx.canvas.height * 2) / 3 +
    //   20 *
    //     Math.floor(
    //       (Math.random() * ((this.ctx.canvas.height * 1) / 3 - this.h)) / this.h
    //     );
  }

  draw() {
    switch (this.score) {
      case 2:
        this.ctx.fillStyle = "green";
        break;
      case 5:
        this.ctx.fillStyle = "blue";
        break;
      case 10:
        this.ctx.fillStyle = "red";
        break;
      default:
        this.ctx.fillStyle = "gold";
        break;
    }

    this.ctx.fillRect(this.x, this.y, this.w, this.h);
  }

  collides(el) {
    const colX = el.x < this.x + this.w && el.x + el.w > this.x;
    const colY = el.y < this.y + this.h && el.y + el.h > this.y;

    return colX && colY;
  }
}
