// Game settings
const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 600;
const CAR_WIDTH = 50;
const CAR_HEIGHT = 100;
const MAX_SPEED = 10;
const CAR_SPACING = 200;
const CAR_COLORS = ["#FD8A8A", "#F7C8E0", "#95a832", "#B4E4FF", "#95BDFF"];

// Draw a car at the specified location and color
let drawCar = (ctx, x, y, color) => {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, CAR_WIDTH, CAR_HEIGHT);
};

// Check for collision between two cars
let checkCollision = (x1, y1, x2, y2) => {
  return (
    x1 < x2 + CAR_WIDTH &&
    x1 + CAR_WIDTH > x2 &&
    y1 < y2 + CAR_HEIGHT &&
    y1 + CAR_HEIGHT > y2
  );
};

let drawText = (ctx, text, x, y, font, color, textAlign = "left") => {
  ctx.fillStyle = color;
  ctx.font = font;
  ctx.textAlign = textAlign;
  ctx.fillText(text, x, y);
};

let setHighScore = (score) => {
  localStorage.setItem("highScore", score);
  let high = document.querySelector(".highScore");
  high.innerHTML = `Highest Score: ${score}`;
};

if (!localStorage.getItem("highScore")) {
  localStorage.setItem("highScore", 0);
}
setHighScore(parseInt(localStorage.getItem("highScore")));
let init = () => {
  // Game state
  let playerX = CANVAS_WIDTH / 2 - CAR_WIDTH / 2;
  let playerY = CANVAS_HEIGHT - CAR_HEIGHT - 10;
  let playerSpeed = 0;
  let cars = [];
  let score = 0;
  let hearts = 1;

  // Get the canvas and context
  const canvas = document.getElementById("bulldozer");
  const ctx = canvas.getContext("2d");
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

  // Start the game loop
  let interval = setInterval(() => {
    // Clear the canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Move the player car
    playerX += playerSpeed;
    playerX = Math.max(0, Math.min(playerX, CANVAS_WIDTH - CAR_WIDTH));

    // Draw the player car
    drawCar(ctx, playerX, playerY, "#FFFBAC");

    // Generate new cars as needed
    while (cars.length < 2) {
      const newCar = {
        x: Math.random() * (CANVAS_WIDTH - CAR_WIDTH),
        y: -CAR_HEIGHT - Math.random() * CAR_SPACING,
        speed: Math.random() * MAX_SPEED,
        color: CAR_COLORS[Math.floor(Math.random() * CAR_COLORS.length)],
      };
      cars.push(newCar);
    }

    // Move and draw the cars
    for (let i = 0; i < cars.length; i++) {
      const car = cars[i];
      car.y += car.speed;

      // Check for collision with player car
      if (checkCollision(playerX, playerY, car.x, car.y)) {
        // Player hit a car
        cars.splice(i, 1);
        i--;
        score += 1;
        if (parseInt(localStorage.getItem("highScore")) < score) {
          setHighScore(score);
        }
      }

      // Remove cars that have gone off the bottom of the screen
      if (car.y > CANVAS_HEIGHT) {
        cars.splice(i, 1);
        i--;
        hearts -= 1;
        continue;
      }

      // Draw the car
      drawCar(ctx, car.x, car.y, car.color);
    }

    // Draw score and hearts
    drawText(ctx, "Score: " + score, 10, 30, "20px Arial", "#fff");
    drawText(ctx, "Hearts: " + hearts, 10, 60, "20px Arial", "#fff");

    // Check for game over
    if (hearts <= 0) {
      // Game over
      clearInterval(interval);
      const h1 = document.createElement("h3");
      h1.classList.add("gameover-p");
      h1.innerText = "Game Over!";
      h1.style.left = `${CANVAS_WIDTH / 2}px`;
      h1.style.top = `${CANVAS_HEIGHT / 2}px`;
      // Add reset button
      const resetBtn = document.createElement("button");
      resetBtn.classList.add("btn", "btn-light", "gameover-btn");
      resetBtn.textContent = "Play again";
      resetBtn.style.left = `${CANVAS_WIDTH / 2 + 30}px`;
      resetBtn.style.top = `${CANVAS_HEIGHT / 2 + 60}px`;
      resetBtn.addEventListener("click", () => {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        resetBtn.classList.add("hide");
        h1.classList.add("hide");
        init();
      });
      document.body.appendChild(resetBtn);
      document.body.appendChild(h1);
    }
  }, 30);

  document.addEventListener("keydown", (event) => {
    if (event.key === "a" || event.key === "ArrowLeft") {
      playerSpeed = -10;
    } else if (event.key === "d" || event.key === "ArrowRight") {
      playerSpeed = 10;
    } else if (event.key === "w" || event.key === "ArrowUp") {
      playerY -= 10;
      playerY = Math.max(0, playerY);
    } else if (event.key === "s" || event.key === "ArrowDown") {
      playerY += 10;
      playerY = Math.min(playerY, CANVAS_HEIGHT - CAR_HEIGHT);
    }
    event.preventDefault();
  });

  document.addEventListener("keyup", (event) => {
    if (
      event.key === "a" ||
      event.key === "d" ||
      event.key === "ArrowRight" ||
      event.key === "ArrowLeft"
    ) {
      playerSpeed = 0;
    }
  });
};

// Initialize the game
document.querySelector(".play").addEventListener("click", (event) => {
  event.target.classList.add("hide");
  document.querySelector(".play-multi").classList.add("hide");
  document.querySelector("#bulldozer").classList.remove("hide");
  init();
});
