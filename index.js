import { Universe, Cell } from "wasm-game-of-life";
// Import the WebAssembly memory at the top of the file.
import { memory } from "wasm-game-of-life/wasm_game_of_life_bg";
import { universe_width } from "wasm-game-of-life/wasm_game_of_life_bg.wasm";

// const pre = document.getElementById("game-of-life-canvas");
const gob = document.getElementById("go-button");
const ssb = document.getElementById("spaceship-button");
const rpentaminob = document.getElementById("rpentamino-button");
const piheptominob = document.getElementById("piheptomino-button");
const gliderb = document.getElementById("glider-button");

// graphics
let CELL_SIZE = 15; // px
const MARGIN = 20;
const GRID_COLOR = "#CCCCCC";
const DEAD_COLOR = "#FFFFFF";
const ALIVE_COLOR = "#000000";

// Construct the universe, and get its width and height.
const universe = Universe.new();
const width = universe.width();
const height = universe.height();

// Give the canvas room for all of our cells and a 1px border
// around each of them.
const canvas = document.getElementById("game-of-life-canvas");
canvas.height = (CELL_SIZE + 1) * height + 1;
canvas.width = (CELL_SIZE + 1) * width + 1;

const ctx = canvas.getContext("2d");
let running = false;

const renderLoop = () => {
  universe.tick();

  drawGrid();
  drawCells();

  if (running) {
    requestAnimationFrame(renderLoop);
  }
};

const drawGrid = () => {
  ctx.beginPath();
  ctx.strokeStyle = GRID_COLOR;

  // Vertical lines.
  for (let i = 0; i <= width; i++) {
    ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
    ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
  }

  // Horizontal lines.
  for (let j = 0; j <= height; j++) {
    ctx.moveTo(0, j * (CELL_SIZE + 1) + 1);
    ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1);
  }

  ctx.stroke();
};
// function startAnimation() {
//   requestAnimationFrame(renderLoop);
// }
canvas.addEventListener("mousedown", function () {
  universe.tick();
  drawGrid();
  drawCells();
});
gob.addEventListener("mousedown", function () {
  if (running) {
    running = false;
    gob.innerHTML = "  Go  ";
  } else {
    running = true;
    gob.innerHTML = "Pause";
    requestAnimationFrame(renderLoop);
  }
});

ssb.addEventListener("mousedown", function () {
  running = false;
  universe.make_spaceship();
  drawGrid();
  drawCells();
  gob.innerHTML = "Go";
});

rpentaminob.addEventListener("mousedown", function () {
  running = false;
  universe.make_rpentamino();
  drawGrid();
  drawCells();
  gob.innerHTML = "Go";
});
piheptominob.addEventListener("mousedown", function () {
  running = false;
  universe.make_piheptomino();
  drawGrid();
  drawCells();
  gob.innerHTML = "Go";
});

gliderb.addEventListener("mousedown", function () {
  running = false;
  universe.make_glider();
  drawGrid();
  drawCells();
  gob.innerHTML = "Go";
});

// pre.dblclick(requestAnimationFrame(renderLoop));

const getIndex = (row, column) => {
  return row * width + column;
};

const drawCells = () => {
  const cellsPtr = universe.cells();
  const cells = new Uint8Array(memory.buffer, cellsPtr, width * height);

  ctx.beginPath();

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const idx = getIndex(row, col);

      ctx.fillStyle = cells[idx] === Cell.Dead ? DEAD_COLOR : ALIVE_COLOR;

      ctx.fillRect(
        col * (CELL_SIZE + 1) + 1,
        row * (CELL_SIZE + 1) + 1,
        CELL_SIZE,
        CELL_SIZE
      );
    }
  }

  ctx.stroke();
};

console.log("Executing top level script code");

const getCellSize = () => {
  let sizeW = Math.floor((window.innerWidth - 2 * MARGIN) / universe.width());
  let sizeH = Math.floor((window.innerHeight - 100) / universe.height());
  return Math.min(sizeW, sizeH);
};

function resizeCanvas() {
  console.log(" Resize (" + window.innerWidth + "," + window.innerHeight + ")");
  CELL_SIZE = getCellSize();
  canvas.width = (CELL_SIZE + 1) * universe.width() + 2 * MARGIN;
  canvas.height = (CELL_SIZE + 1) * universe.height();

  drawGrid();
  drawCells();
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();
