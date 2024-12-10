const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const upButton = document.getElementById('up');
const downButton = document.getElementById('down');
const startGameButton = document.getElementById('start-game');
const scoreDisplay = document.getElementById('score');

let bumblebee, obstacles, score, gameActive, rAF;
const barSpeed = 3;
const keys = { ArrowUp: false, ArrowDown: false };

function resizeCanvas() {
  canvas.width = window.innerWidth > 768 ? 400 : window.innerWidth * 0.8;
  canvas.height = 275;
}

function resetGame() {
  bumblebee = { x: 50, y: canvas.height / 2, radius: 10, speed: 3 };
  obstacles = Array.from({ length: 2 }, (_, i) => ({
    x: canvas.width + i * 200,
    y: Math.random() * (canvas.height - 50),
    width: 10,
    height: 50,
    type: 'rect',
    passed: false,
  }));
  score = 0;
  gameActive = true;
  scoreDisplay.textContent = `Score: ${score}`;
}

function startGame() {
  if (rAF) cancelAnimationFrame(rAF);
  resetGame();
  rAF = requestAnimationFrame(loop);
}

function loop() {
  if (!gameActive) return;
  rAF = requestAnimationFrame(loop);
  context.clearRect(0, 0, canvas.width, canvas.height);

  if (keys['ArrowUp']) bumblebee.y -= bumblebee.speed;
  if (keys['ArrowDown']) bumblebee.y += bumblebee.speed;
  bumblebee.y = Math.max(0, Math.min(canvas.height - bumblebee.radius * 2, bumblebee.y));

  context.fillStyle = '#F2D638';
  context.beginPath();
  context.arc(bumblebee.x, bumblebee.y + bumblebee.radius, bumblebee.radius, 0, Math.PI * 2);
  context.fill();

  for (let obstacle of obstacles) {
    obstacle.x -= barSpeed;

    if (obstacle.x + obstacle.width < bumblebee.x && !obstacle.passed) {
      obstacle.passed = true;
      score++;
      scoreDisplay.textContent = `Score: ${score}`;
    }

    if (obstacle.x < -obstacle.width) {
      obstacle.x = canvas.width;
      obstacle.y = Math.random() * (canvas.height - obstacle.height);
      obstacle.type = Math.random() > 0.5 ? 'rect' : 'circle';
      obstacle.passed = false;
    }

    if (obstacle.type === 'rect') {
      context.fillStyle = '#000';
      context.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    } else {
      context.fillStyle = '#FFF';
      context.beginPath();
      context.arc(obstacle.x, obstacle.y + obstacle.height / 2, obstacle.height / 2, 0, Math.PI * 2);
      context.fill();
    }

    if (
      bumblebee.x < obstacle.x + obstacle.width &&
      bumblebee.x + bumblebee.radius > obstacle.x &&
      bumblebee.y < obstacle.y + obstacle.height &&
      bumblebee.y + bumblebee.radius * 2 > obstacle.y
    ) {
      gameActive = false;
    }
  }
}

function setupControls() {
  upButton.addEventListener('mousedown', () => keys['ArrowUp'] = true);
  upButton.addEventListener('mouseup', () => keys['ArrowUp'] = false);
  downButton.addEventListener('mousedown', () => keys['ArrowDown'] = true);
  downButton.addEventListener('mouseup', () => keys['ArrowDown'] = false);

  upButton.addEventListener('touchstart', (e) => {
    e.preventDefault();
    keys['ArrowUp'] = true;
  });

  upButton.addEventListener('touchend', (e) => {
    e.preventDefault();
    keys['ArrowUp'] = false;
  });

  downButton.addEventListener('touchstart', (e) => {
    e.preventDefault();
    keys['ArrowDown'] = true;
  });

  downButton.addEventListener('touchend', (e) => {
    e.preventDefault();
    keys['ArrowDown'] = false;
  });
}

window.addEventListener('resize', resizeCanvas);
startGameButton.addEventListener('click', startGame);

resizeCanvas();
setupControls();
