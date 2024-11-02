console.log("The Miner");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const game = new Game(ctx);

// game.start();

if (sessionStorage.getItem("gameStarted") === "true") {
  document.getElementById("presentation").style.display = "none";
  game.start();
}

const startButton = document.getElementById("startButtonGame");
console.log(startButton);

document.getElementById("gameOver").style.display = "none";

startButton.addEventListener("click", (e) => {
  console.log(e);
  if (game.started === false) {
    document.getElementById("presentation").style.display = "none";
    sessionStorage.setItem("gameStarted", "true");
    game.start();
  } else {
    game.pause();
  }
});

const playAgainButton = document.getElementById("play-again-button");
playAgainButton.addEventListener("click", (e) => {
  document.getElementById("gameOver").style.display = "none";
  location.reload();
});

document.addEventListener("DOMContentLoaded", () => {
  const highestScore = parseFloat(localStorage.getItem("highestScore")) || 0;
  document.getElementById("highest-score").innerText = `Highest Score: ${highestScore.toLocaleString("es-ES", { minimumFractionDigits: 2 })} €`;
});

