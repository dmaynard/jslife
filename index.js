import { Universe } from "wasm-game-of-life";

const pre = document.getElementById("game-of-life-canvas");
const gob = document.getElementById("go-button");
const universe = Universe.new();
const renderLoop = () => {
  pre.textContent = universe.render();
  universe.tick();
  requestAnimationFrame(renderLoop);
};
// function startAnimation() {
//   requestAnimationFrame(renderLoop);
// }
pre.addEventListener("mousedown", function () {
  universe.tick();
  pre.textContent = universe.render();
});
gob.addEventListener("mousedown", function () {
  requestAnimationFrame(renderLoop);
});
// universe.make_spaceship();
// universe.make_spaceship();
pre.textContent = universe.render();

// pre.dblclick(requestAnimationFrame(renderLoop));
//
