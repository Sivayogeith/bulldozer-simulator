let multi = () => {
  // Game state
  let playerX = CANVAS_WIDTH / 2 - CAR_WIDTH / 2;
  let playerY = CANVAS_HEIGHT - CAR_HEIGHT - 10;
  let playerSpeed = 0;
  let cars = [];
  let score = 0;
  let hearts = 5;

  //  Multi-Player Game State
  let player2X = CANVAS_WIDTH / 2 - CAR_WIDTH / 2 + 100;
  let player2Y = CANVAS_HEIGHT - CAR_HEIGHT - 10;
  let player2Speed = 0;
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
    // Move the player car
    player2X += player2Speed;
    player2X = Math.max(0, Math.min(player2X, CANVAS_WIDTH - CAR_WIDTH));
    // Draw the player car
    drawCar(ctx, playerX, playerY, "#FFFBAC");
    drawCar(ctx, player2X, player2Y, "#ed4545");

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
      if (
        checkCollision(playerX, playerY, car.x, car.y) ||
        checkCollision(player2X, player2Y, car.x, car.y)
      ) {
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
        multi();
      });
      document.body.appendChild(resetBtn);
      document.body.appendChild(h1);
    }
  }, 30);

  document.addEventListener("keydown", (event) => {
    if (event.key === "a") {
      playerSpeed = -10;
    } else if (event.key === "d") {
      playerSpeed = 10;
    } else if (event.key === "w") {
      playerY -= 10;
      playerY = Math.max(0, playerY);
    } else if (event.key === "s") {
      playerY += 10;
      playerY = Math.min(playerY, CANVAS_HEIGHT - CAR_HEIGHT);
    } else if (event.key === "ArrowLeft") {
      player2Speed = -10;
    } else if (event.key === "ArrowRight") {
      player2Speed = 10;
    } else if (event.key === "ArrowUp") {
      player2Y -= 10;
      player2Y = Math.max(0, player2Y);
    } else if (event.key === "ArrowDown") {
      player2Y += 10;
      player2Y = Math.min(player2Y, CANVAS_HEIGHT - CAR_HEIGHT);
    }
    event.preventDefault();
  });

  document.addEventListener("keyup", (event) => {
    if (event.key === "a" || event.key === "d") {
      playerSpeed = 0;
    }
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      player2Speed = 0;
    }
  });
};

// Initialize the game
document.querySelector(".play-multi").addEventListener("click", (event) => {
  event.target.classList.add("hide");
  document.querySelector(".play").classList.add("hide");
  document.querySelector("#bulldozer").classList.remove("hide");
  hearts = 6;
  multi();
});
