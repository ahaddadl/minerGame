class Game {
  constructor(ctx) {
    this.ctx = ctx;
    this.miner = new Miner(ctx);

    this.interval = null;
    this.started = false;
    this.paused = false;

    this.cuadradosTierra = [];
    for (let j = 5; j < 40; j++) {
      for (let i = 0; i < 40; i++) {
        this.cuadradosTierra.push(new CuadradoTierra(ctx, i * 20, j * 20));
      }
    }

    this.moreGolds = [
      new Gold(ctx, this.cuadradosTierra, 10),
      new Gold(ctx, this.cuadradosTierra, 100),
    ];
    this.onza = 0;

    this.cuadradosVacios = [];
    this.updateCuadradosVacios();

    this.hormigas = [new Hormiga(ctx, this.posicionInicialHormiga())];

    this.setListeners();

    this.audio = new Audio("/assets/audio/ralf.mp3");
    this.audio.volume = 0.2;
    this.audio.loop = true;

    this.backgroundImage = new Image();
    this.backgroundImage.src = "/assets/images/fondo_juego.jpg";
  }

  start() {
    if (!this.started || this.paused) {
      // this.audio.play()
      this.paused = false;
      this.started = true;
      this.interval = setInterval(() => {
        this.clear();
        this.draw();
        this.move();
        this.checkCollisions();
      }, 1000 / 40);
      console.log("Game started");
    }
  }

  pause() {
    if (this.started && !this.paused) {
      this.audio.pause();
      clearInterval(this.interval);
      this.paused = true;
      console.log("Game paused");
    }
  }

  gameOver() {
    // const audioGameOver = new Audio("/assets/audio");
    // audioGameOver.volume = 0.2;
    // audioGameOver.play();
    this.pause();
    document.getElementById("gameOver").style.display = "block";
  }

  clear() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }
  draw() {
    this.drawBackground();
    this.cuadradosTierra.forEach((cuadrado) => {
      cuadrado.draw();
    });

    this.moreGolds.forEach((oro) => oro.draw());
    // this.gold.draw();
    this.miner.draw();

    this.hormigas.forEach((hormiga) => {
      hormiga.draw();
    });

    // console.log(this.moreGolds)
  }

  move() {
    this.miner.move();
    this.updateCuadradosVacios();
    this.hormigas.forEach((hormiga) => {
      hormiga.move(this.cuadradosVacios);
    });
  }

  addhormiga() {
    const nuevaHormiga = new Hormiga(this.ctx, this.posicionInicialHormiga());
    this.hormigas.push(nuevaHormiga);
  }

  addGold() {
    const nuevoOro = new Gold(this.ctx, this.cuadradosTierra, 10);
    this.moreGolds.push(nuevoOro);
    console.log(nuevoOro, this.moreGolds);
  }

  posicionInicialHormiga() {
    return this.cuadradosVacios[
      Math.floor(Math.random() * this.cuadradosVacios.length)
    ];
  }

  updateCuadradosVacios() {
    const emptySpaces = [];

    for (let j = 80; j < this.ctx.canvas.height; j += 20) {
      for (let i = 0; i < this.ctx.canvas.width; i += 20) {
        const isOccupiedByTierra = this.cuadradosTierra.some(
          (cuadrado) => cuadrado.x === i && cuadrado.y === j
        );
        // const isOccupiedByMiner = this.miner.x === i && this.miner.y === j;
        // const isOccupiedByAnt = this.hormiga.x === i && this.hormiga.y === j;

        if (!isOccupiedByTierra) {
          //&& !isOccupiedByMiner) {
          // && !isOccupiedByAnt) {
          emptySpaces.push({ x: i, y: j });
        }
      }
    }

    this.cuadradosVacios = emptySpaces;
  }

  onGoldCollected(oro) {
    this.addGold();
    this.addGold();
    this.addGold();
    this.addGold();
    const alertBox = document.getElementById("hurra-oro");
    alertBox.classList.add("alert", "alert-warning");
    alertBox.innerText = "¡Hurra Oro!";
    alertBox.style.display = "block";

    this.onza += oro.score;
    const scoreElement = document.getElementsByClassName("card-body");
    scoreElement[0].innerHTML = `Onzas de <span style="color: gold;">Oro</span>: ${
      this.onza
    } oz Euros: ${(this.onza * 2549.94).toLocaleString("es-ES", {
      minimumFractionDigits: 2,
    })}€.`;

    setTimeout(() => {
      alertBox.style.display = "none";
    }, 1500);

    this.addhormiga();
  }

  checkCollisions() {
    this.cuadradosTierra = this.cuadradosTierra.filter(
      (cuadrado) => !this.miner.collides(cuadrado)
    );

    this.moreGolds = this.moreGolds.filter((oro) => {
      if (this.miner.collides(oro)) {
        this.onGoldCollected(oro);
        return false;
      } else {
        return true;
      }
    });

    // if (this.miner.collides(this.gold)) {
    //   const alertBox = document.getElementById("hurra-oro");
    //   alertBox.classList.add("alert", "alert-warning");
    //   alertBox.innerText = "¡Hurra Oro!";
    //   alertBox.style.display = "block";

    //   this.onza += 1;
    //   const scoreElement = document.getElementsByClassName("card-body");
    //   scoreElement[0].innerHTML = `Onzas de <span style="color: gold;">Oro</span>: ${
    //     this.onza
    //   } oz Euros: ${(this.onza * 2549.94).toLocaleString("es-ES", {
    //     minimumFractionDigits: 2,
    //   })}€.`;

    //   setTimeout(() => {
    //     alertBox.style.display = "none";
    //   }, 1500);

    //   this.gold = new Gold(this.ctx, this.cuadradosTierra);
    //   console.log("Hurra ORO");

    //   this.addhormiga();
    //   this.addhormiga();
    // }

    this.hormigas.forEach((hormiga) => {
      if (this.miner.collides(hormiga)) {
        console.log("prueba choque hormiga");
        this.onza -= 0.5;
        const scoreElement = document.getElementsByClassName("card-body");
        scoreElement[0].innerHTML = `Onzas de <span style="color: gold;">Oro</span>: ${
          this.onza
        } oz Euros: ${(this.onza * 2549.94).toLocaleString("es-ES", {
          minimumFractionDigits: 2,
        })}€.`;

        const alertBoxHormiga = document.getElementById("hurra-hormiga");
        alertBoxHormiga.classList.add("alert", "alert-success");
        alertBoxHormiga.innerText = "¡El Oro es nuestro!";
        alertBoxHormiga.style.display = "block";

        setTimeout(() => {
          alertBoxHormiga.style.display = "none";
        }, 1500);

        if (this.onza <= -5) {
          this.gameOver();
        }
      }
    });
  }

  setListeners() {
    document.addEventListener("keydown", (event) => {
      this.miner.onKeyDown(event.keyCode);
    });

    document.addEventListener("keyup", (event) => {
      this.miner.onKeyUp(event.keyCode);
    });
  }

  drawBackground() {
    // Draw the background in the top half of the canvas
    this.ctx.drawImage(this.backgroundImage, 0, 0, 800, 100);
  }
}
