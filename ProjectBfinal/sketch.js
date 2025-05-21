let video;
let particles = [];
let mic;
let vol = 0;



function setup() {
  let canvas = createCanvas(800, 500);
  //canvas.parent("p5-canvas-container");
  video = createCapture(VIDEO);
  video.size(700, 400);

  //video.hide();
  mic = new p5.AudioIn();
  mic.start();
  noStroke();
}

function draw() {
  background(0);
  vol = mic.getLevel();
  video.loadPixels();


  // Create less particles 
  for (let i = 0; i < 200; i++) {
    let x = floor(random(video.width));
    let y = floor(random(video.height));

    let index = (x + y * video.width) * 4;

    let r = video.pixels[index + 0];
    let g = video.pixels[index + 1];
    let b = video.pixels[index + 2];

    let brightness = (r + g + b) / 6;

    if (brightness < 80) {
      let px = map(x, 0, video.width, 0, width);
      let py = map(y, 0, video.height, 0, height);
      particles.push(new Particle(px, py));
    }
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();
    if (particles[i].isDead()) {
      particles.splice(i, 1);
    }
  }
}

// Particle Class
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.alpha = 255;
    this.offset = random(TWO_PI); // for a smooth movement 

    // React to the voice 
    if (vol > 0.1) {
      this.col = color(255, 0, 0, this.alpha);
      this.size = random(8, 11);
    } else {
      this.col = color(random(100, 255), random(100, 255), random(100, 255), this.alpha);
      this.size = random(4, 8); // bigger particles with the sound 
    }
  }

  update() {
    this.alpha -= 3;

    // Movement 
    this.x += sin(frameCount * 0.05 + this.offset) * 0.5;
    this.y += cos(frameCount * 0.05 + this.offset) * 0.5;

    this.col.setAlpha(this.alpha);
  }

  display() {
    fill(this.col);
    ellipse(this.x, this.y, this.size, this.size);
  }

  isDead() {
    return this.alpha <= 0;
  }
} 