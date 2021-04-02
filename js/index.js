const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const bcgImg = new Image();
const playerImg = new Image();
bcgImg.src = "/images/road.png";
playerImg.src = "/images/car.png";

playerX = 210;
playerY = 500;
playerWidth = 50;
playerHeigth = 80;
playerSpeed = 5;

obstacleSpeed = 5;

class Component {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.speedX = 0;
    this.speedY = 0;
  }

  update() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  newPos() {
    if (this.x > 5 && this.x < 445) {
      this.x += this.speedX;
    }
    if (this.x <= 5 && this.speedX > 0) {
      this.x += this.speedX;
    }
    if (this.x >= 445 && this.speedX < 0) {
      this.x += this.speedX;
    }

    this.y += this.speedY;
  }

  left() {
    return this.x;
  }
  right() {
    return this.x + this.width;
  }
  top() {
    return this.y;
  }
  bottom() {
    return this.y + this.height;
  }

  crashWith(obstacle) {
    return !(
      this.bottom() < obstacle.top() ||
      this.top() > obstacle.bottom() ||
      this.right() < obstacle.left() ||
      this.left() > obstacle.right()
    );
  }
}

///////////////////////////
//CLASS CAR
class Car extends Component {
  constructor(x, y, width, heigth, image) {
    super(x, y, width, heigth);
    this.image = image;
  }

  update() {
    ctx.drawImage(this.image, this.x, this.y, 50, 120);
  }
}
///////////////////////////

class Game {
  constructor(player) {
    this.player = player;
    this.animationId;
    this.obstacles = [];
    this.frames = 0;
    this.score = 0;
  }

  startGame = () => {
    this.updateGameArea();
  };

  updateGameArea = () => {
    this.clear();
    ctx.drawImage(bcgImg, 0, 0, canvas.width, canvas.height);
    this.player.newPos();
    this.player.update();

    this.updateObstacles();

    this.updateScore();

    this.animationId = requestAnimationFrame(this.updateGameArea);

    this.checkGameOver();
  };

  updateObstacles = () => {
    for (let i = 0; i < this.obstacles.length; i++) {
      this.obstacles[i].y += obstacleSpeed;
      this.obstacles[i].update();
    }

    this.frames += 1;
    if (this.frames % 80 === 0) {
      const minWidth = 150;
      const maxWidth = 300;
      const width = Math.floor(
        Math.random() * (maxWidth - minWidth + 1) + minWidth
      );
      const posX = Math.floor(Math.random() * minWidth);

      this.obstacles.push(new Component(posX, 0, width, 20, "red"));

      this.score++;
    }
  };

  clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  checkGameOver = () => {
    const crashed = this.obstacles.some((obstacle) => {
      return this.player.crashWith(obstacle);
    });

    if (crashed) {
      cancelAnimationFrame(this.animationId);
      this.gameOver();
    }
  };

  updateScore = () => {
    ctx.font = "30px Verdana";
    ctx.fillStyle = "black";
    ctx.fillText(`Score: ${this.score}`, 50, 50);
  };

  gameOver() {
    this.clear();

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "red";
    ctx.font = "50px Verdana";
    ctx.fillText(`GAME OVER`, 100, 230);

    ctx.fillStyle = "white";
    ctx.font = "40px Verdana";
    ctx.fillText(`Final Score: ${this.score}`, 100, 290);
  }
}

window.onload = () => {
  document.getElementById("start-button").onclick = () => {
    startGame();
  };

  function startGame() {
    // let gameIntro = document.querySelector(".game-intro");
    // document.querySelector("body").removeChild(gameIntro);
    const carImage = new Image();
    carImage.src = "./images/car.png";
    const player = new Car(
      playerX,
      playerY,
      playerWidth,
      playerHeigth,
      carImage
    );
    const game = new Game(player);

    game.startGame();

    document.addEventListener("keydown", (event) => {
      switch (event.code) {
        case "ArrowRight":
          return (game.player.speedX = playerSpeed);
        case "ArrowLeft":
          return (game.player.speedX = -playerSpeed);
      }
    });

    document.addEventListener("keyup", () => {
      game.player.speedX = 0;
      game.player.speedY = 0;
    });
  }
};
