
let sound;

function preload() {
  sound = loadSound("assets/beat.mp3");

}
function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");
}

function draw() {
  background(220);


  let vol = map(mouseY, 0, height, 1.0, 0.0, true);
  sound.setVolume(0.3);
}

function mousePressed() {
  sound.play();
}