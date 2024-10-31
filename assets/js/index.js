console.log("The Miner");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const game = new Game(ctx);

// game.start();

const startButton = document.getElementById("startButtonGame");
console.log(startButton);

document.getElementById("gameOver").style.display = "none";

startButton.addEventListener("click", (e) => {
  console.log(e);
  if (game.started === false) {
    document.getElementById("presentation").style.display = "none";
  
    game.start();
  } else {
    game.pause();
  }
});

const playAgainButton = document.getElementById("play-again-button");
playAgainButton.addEventListener("click", (e) => {
  document.getElementById("gameOver").style.display = "none";
  game.start();
});
