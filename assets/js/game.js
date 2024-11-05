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
      new Gold(ctx, this.cuadradosTierra, 1),
      new Gold(ctx, this.cuadradosTierra, 10),
    ];

    this.onza = 0;
    this.highestScore = parseFloat(localStorage.getItem("highestScore")) || 0;

    this.cuadradosVacios = [];
    this.updateCuadradosVacios();

    this.hormigas = [
      new Hormiga(ctx, this.posicionInicialHormiga()),
      new Hormiga(ctx, this.posicionInicialHormiga()),
    ];

    this.setListeners();

    this.audio = new Audio("/assets/audio/ralf.mp3");
    this.audio.volume = 0.2;
    this.audio.loop = true;
    // this.audio.play();

    this.backgroundImage = new Image();
    this.backgroundImage.src = "/assets/images/fondo_juego.jpg";
  }

  start() {
    if (!this.started || this.paused) {
      this.audio.play();
      this.paused = false;
      this.started = true;
      this.interval = setInterval(() => {
        this.clear();
        this.draw();
        this.move();
        this.checkCollisions();
      }, 1000 / 60);
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
    const audioGameOver = new Audio("/assets/audio/game-over.mp3");
    audioGameOver.volume = 0.2;
    audioGameOver.play();
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

    this.moreGolds.forEach((oro) => {
      oro.draw();
      // console.log("Drawing gold at:", oro.x, oro.y);
    });

    this.miner.draw();

    this.hormigas.forEach((hormiga) => {
      hormiga.draw();
    });
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
    const randomScores = [1, 2, 5, 10];
    const randomScore =
      randomScores[Math.floor(Math.random() * randomScores.length)];
    const nuevoOro = new Gold(this.ctx, this.cuadradosTierra, randomScore);
    this.moreGolds.push(nuevoOro);
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
    const alertBox = document.getElementById("hurra-oro");
    alertBox.classList.add("alert", "alert-warning");
    alertBox.innerText = "¡Hurra Oro!";
    alertBox.style.display = "block";

    this.onza += oro.score;
    const scoreElement = document.getElementsByClassName("card-body");
    scoreElement[0].innerHTML = `<img src="/assets/images/e095ca681225c1f7cfb9aca35d3669.png" alt="Oro" class="oro-image"> ${
      this.onza
    } oz <img src="/assets/images/euro-symbol.png" alt="euro-image" class="euro-image"> ${(
      this.onza * 2549.94
    ).toLocaleString("es-ES", {
      minimumFractionDigits: 2,
    })}€.`;

    setTimeout(() => {
      alertBox.style.display = "none";
    }, 1500);

    this.addhormiga();
    this.addhormiga();
    this.addhormiga();

    if (this.onza * 2549.94 > this.highestScore) {
      this.highestScore = this.onza * 2549.94;
      localStorage.setItem("highestScore", this.highestScore);
      const score = (document.getElementById(
        "highest-score"
      ).innerText = `Highest Score: ${this.highestScore}€`);
    }
  }

  checkCollisions() {
    this.cuadradosTierra = this.cuadradosTierra.filter(
      (cuadrado) => !this.miner.collides(cuadrado)
    );

    const collectedGolds = [];

    this.moreGolds = this.moreGolds.filter((oro) => {
      if (this.miner.collides(oro)) {
        collectedGolds.push(oro);
        return false;
      }
      return true;
    });

    collectedGolds.forEach((oro) => this.onGoldCollected(oro));

    this.hormigas.forEach((hormiga) => {
      if (this.miner.collides(hormiga)) {
        console.log("prueba choque hormiga");
        this.onza -= 2;
        const scoreElement = document.getElementsByClassName("card-body");
        scoreElement[0].innerHTML = `<img src="/assets/images/e095ca681225c1f7cfb9aca35d3669.png" alt="Oro" class="oro-image"> ${
          this.onza
        }oz <img src="/assets/images/euro-symbol.png" alt="euro-image" class="euro-image">${(
          this.onza * 2549.94
        ).toLocaleString("es-ES", {
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
    this.ctx.drawImage(this.backgroundImage, 0, 0, 800, 100);
  }
}
