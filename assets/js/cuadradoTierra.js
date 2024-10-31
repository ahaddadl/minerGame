class CuadradoTierra {
  constructor(ctx, x, y) {
    this.ctx = ctx;

    this.w = 20;
    this.h = 20;

    this.x = x;
    this.y = y;

    this.img = new Image();
    this.img.src = "/assets/images/fondo.jpg";
  }

  
  draw() {
    this.ctx.drawImage(
      this.img,
      0,
      0,
      this.img.width,
      this.img.height,
      this.x,
      this.y,
      20,
      20,

    );

    // this.ctx.fillStyle = "brown";
    // this.ctx.fillRect(this.x, this.y, 20, 20);
  }
}
  
//   draw() {
//     this.ctx.fillStyle = "brown";
//     this.ctx.fillRect(this.x, this.y, 20, 20);
//   }
// }
