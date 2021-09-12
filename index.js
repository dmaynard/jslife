import { Universe, Cell } from "wasm-game-of-life";
import { memory } from "wasm_game_of_life_bg";
// import { Universe, Cell } from "@davidsmaynard/wasm-game-of-life";
// import { memory } from "@davidsmaynard/wasm-game-of-life/wasm_game_of_life_bg";
// import { universe_width } from "wasm-game-of-life/wasm_game_of_life_bg.wasm";

const playfield = document.getElementById("game-of-life-canvas");
const gob = document.getElementById("go-button");
const ssb = document.getElementById("spaceship-button");
const rpentaminob = document.getElementById("rpentamino-button");
const piheptominob = document.getElementById("piheptomino-button");
const gliderb = document.getElementById("glider-button");
const testb = document.getElementById("test-button");
const sizeb = document.getElementById("universe-size");
const stepb = document.getElementById("step-button");
// graphics
let CellSize = 16; // px
const MARGIN = 20;
const GRID_COLOR = "#CCCCCC";
const DEAD_COLOR = "#FFFFFF";
const ALIVE_COLOR = "#000000";

// Construct the universe, and get its width and height.
const MINUSIZE = 10;
const MAXUSIZE = 1000;
let universe = Universe.new(32, 32);
let width = universe.width();
let height = universe.height();
let fixedUniverseSize = true;

// Give the canvas room for all of our cells and a 1px border
// around each of them.
const canvas = document.getElementById("game-of-life-canvas");
canvas.height = (CellSize + 1) * height + 1;
canvas.width = (CellSize + 1) * width + 1;

const ctx = canvas.getContext("2d");
let animationId = null;

const renderLoop = () => {
  fps.render(); //new
  universe.tick();
  drawGrid();
  drawCells();
  animationId = requestAnimationFrame(renderLoop);
};
const isPaused = () => {
  return animationId === null;
};
const pause = () => {
  gob.textContent = "▶";
  cancelAnimationFrame(animationId);
  animationId = null;
};

const play = () => {
  gob.textContent = "⏸";
  renderLoop();
};

const drawGrid = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.strokeStyle = GRID_COLOR;

  // Vertical lines.
  for (let i = 0; i <= width; i++) {
    ctx.moveTo(i * (CellSize + 1) + 1, 0);
    ctx.lineTo(i * (CellSize + 1) + 1, (CellSize + 1) * height + 1);
  }

  // Horizontal lines.
  for (let j = 0; j <= height; j++) {
    ctx.moveTo(0, j * (CellSize + 1) + 1);
    ctx.lineTo((CellSize + 1) * width + 1, j * (CellSize + 1) + 1);
  }

  ctx.stroke();
};
// function startAnimation() {
//   requestAnimationFrame(renderLoop);
// }
stepb.addEventListener("mousedown", function () {
  universe.tick();
  drawGrid();
  drawCells();
});
gob.addEventListener("click", (event) => {
  if (isPaused()) {
    play();
  } else {
    pause();
  }
});

ssb.addEventListener("mousedown", function () {
  pause();
  universe.make_spaceship();
  drawGrid();
  drawCells();
  gob.innerHTML = "▶";
});

rpentaminob.addEventListener("mousedown", function () {
  pause();
  universe.make_rpentamino();
  drawGrid();
  drawCells();
  gob.innerHTML = "▶";
});
piheptominob.addEventListener("mousedown", function () {
  pause();
  universe.make_piheptomino();
  drawGrid();
  drawCells();
  gob.innerHTML = "▶";
});

gliderb.addEventListener("mousedown", function () {
  pause();
  universe.make_glider();
  drawGrid();
  drawCells();
  gob.innerHTML = "▶";
});

sizeb.addEventListener("input", function () {
  console.log(" Universe Size " + sizeb.value);
  let newSize = parseInt(sizeb.value);
  if (newSize >= MINUSIZE && newSize <= MAXUSIZE) {
    universe = Universe.new(newSize, newSize);
    width = universe.width();
    height = universe.height();
    CellSize = getCellSize();
    drawGrid();
    drawCells();
    pause();
  }
});
canvas.addEventListener("click", (event) => {
  const boundingRect = canvas.getBoundingClientRect();

  const scaleX = canvas.width / boundingRect.width;
  const scaleY = canvas.height / boundingRect.height;

  const canvasLeft = (event.clientX - boundingRect.left) * scaleX;
  const canvasTop = (event.clientY - boundingRect.top) * scaleY;

  const row = Math.min(Math.floor(canvasTop / (CellSize + 1)), height - 1);
  const col = Math.min(Math.floor(canvasLeft / (CellSize + 1)), width - 1);

  console.log(" row: " + row + " col " + col);
  universe.toggle_cell(row, col);

  drawGrid();
  drawCells();
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
        col * (CellSize + 1) + 1,
        row * (CellSize + 1) + 1,
        CellSize,
        CellSize
      );
    }
  }

  ctx.stroke();
};

console.log("Executing top level script code");

const getCellSize = () => {
  let sizeW = Math.floor(canvas.width / universe.width());
  let sizeH = Math.floor(canvas.height / universe.height());
  return Math.min(sizeW, sizeH) - 1; // -1 to allow for the gridding between cells
};

function resizeCanvas() {
  console.log(" Resize (" + window.innerWidth + "," + window.innerHeight + ")");
  let minDim = Math.min(
    window.innerWidth - 2 * MARGIN,
    window.innerHeight - 5 * MARGIN
  );
  canvas.width = minDim;
  canvas.height = minDim;
  console.log(" Canvas: (" + canvas.width + "," + canvas.height + ")");
  if (fixedUniverseSize) {
    CellSize = getCellSize();
    drawGrid();
    drawCells();
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let canvasDim = Math.min(
      canvas.getBoundingClientRect().width,
      canvas.getBoundingClientRect().height
    );
    let newWidth = Math.floor(canvasDim / CellSize);
    universe = Universe.new(newWidth, newWidth);
    console.log("canvasDim: " + canvasDim + " newWidth: " + newWidth);
    width = universe.width();
    height = universe.height();
    drawGrid();
    drawCells();
  }
}
const fps = new (class {
  constructor() {
    this.fps = document.getElementById("fps");
    this.fps2 = document.getElementById("fps2");
    this.frames = [];
    this.lastFrameTimeStamp = performance.now();
  }

  render() {
    // Convert the delta time since the last frame render into a measure
    // of frames per second.
    const now = performance.now();
    const delta = now - this.lastFrameTimeStamp;
    this.lastFrameTimeStamp = now;
    const fps = (1 / delta) * 1000;

    // Save only the latest 100 timings.
    this.frames.push(fps);
    if (this.frames.length > 100) {
      this.frames.shift();
    }

    // Find the max, min, and mean of our 100 latest timings.
    let min = Infinity;
    let max = -Infinity;
    let sum = 0;
    for (let i = 0; i < this.frames.length; i++) {
      sum += this.frames[i];
      min = Math.min(this.frames[i], min);
      max = Math.max(this.frames[i], max);
    }
    let mean = sum / this.frames.length;

    // Render the statistics.
    this.fps2.textContent = `
Frames per Second: ${Math.round(mean)}
`.trim();
  }
})();
window.addEventListener("resize", resizeCanvas);
resizeCanvas();
