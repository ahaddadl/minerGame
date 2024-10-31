class Hormiga {
  constructor(ctx, posicionHormiga) {
    this.ctx = ctx;
    this.w = 20;
    this.h = 20;

    this.x = posicionHormiga.x;
    this.y = posicionHormiga.y;

    this.vx = 20; 
    this.vy = 20; 

    this.moveCounter = 0; 
    this.moveFrequency = 5; 
    this.direction = 'right'; 
    this.preferDown = true; 
  }

  draw() {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(this.x, this.y, this.w, this.h);
  }

  move(cuadrosVacios) {
    if (this.moveCounter < this.moveFrequency) {
      this.moveCounter++;
      return;
    }
    this.moveCounter = 0; 

    if (this.preferDown) {
      const nextYDown = this.y + this.vy;
      const canMoveDown = cuadrosVacios.some(
        (square) => square.x === this.x && square.y === nextYDown
      );

      if (canMoveDown) {
        this.y = nextYDown;
        return;
      }
    }

    const nextX = this.x + (this.direction === 'right' ? this.vx : -this.vx);
    const canMoveHorizontally = cuadrosVacios.some(
      (square) => square.x === nextX && square.y === this.y
    );

    if (canMoveHorizontally) {
      this.x = nextX;

      this.preferDown = Math.random() < 0.5;
      return;
    }

    const nextYUp = this.y - this.vy;
    const canMoveUp = cuadrosVacios.some(
      (square) => square.x === this.x && square.y === nextYUp
    );

    if (canMoveUp) {
      this.y = nextYUp;
      this.preferDown = false; 
      return;
    }

     this.direction = this.direction === 'right' ? 'left' : 'right';
    
  }

  collides(el) {
    const colX = el.x < this.x + this.w && el.x + el.w > this.x;
    const colY = el.y < this.y + this.h && el.y + el.h > this.y;

    return colX && colY;
  }
}
