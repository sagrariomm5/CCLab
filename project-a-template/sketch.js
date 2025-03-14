/*
Template for IMA's Creative Coding Lab 

Project A: Generative Creatures
CCLaboratories Biodiversity Atlas 
*/

let sunflower = {
    x: 400,
    y: 250,
    size: 1,
    bloom: 0,
    attention: 0,
    petals: [],
    particlesAbsorbed: 0,
    colorShift: 0,
    tentacles: [],
};

let particles = [];
let wind = 0;
let bgColor;
let mouseDist = 0;
let strongWind = false;
let intenseParticles = false;
let rainbowMode = false;
let lightMode = false;

function setup() {
    createCanvas(800, 500);
    bgColor = color(30, 10, 60);
    for (let i = 0; i < 12; i++) {
        sunflower.petals.push({ angleOffset: i * PI / 6, size: random(50, 80), petalCurve: random(10, 30) });
    }

    // Tentáculos (en forma de tallos) que se moverán
    for (let i = 0; i < 5; i++) {
        sunflower.tentacles.push({
            angle: random(TWO_PI),
            length: random(50, 100),
            curl: 0,
            curlSpeed: random(0.02, 0.05),
            speed: random(0.5, 1.5),
            color: color(random(150, 255), random(100, 200), random(50, 150))
        });
    }

    for (let i = 0; i < 50; i++) {
        particles.push({
            x: random(width),
            y: random(height),
            speedX: random(-1, 1),
            speedY: random(-1, 1),
            size: random(3, 7),
            active: true
        });
    }
}

function draw() {
    background(bgColor);
    updateSunflower();
    drawSunflower();
    updateParticles();
    drawWind();
    drawGlow();
    drawTentacles();
}

function updateSunflower() {
    let d = dist(mouseX, mouseY, sunflower.x, sunflower.y);
    sunflower.attention = constrain(map(d, 0, 300, 1, 0), 0, 1);
    sunflower.bloom = constrain(map(d, 0, 300, 1.5, 0.5), 0.5, 1.5);
    sunflower.size = 1 + sunflower.particlesAbsorbed * 0.02;
    sunflower.colorShift = sunflower.particlesAbsorbed * 5;

    let r = map(mouseX, 0, width, 30, 255);
    let g = map(mouseY, 0, height, 10, 150);
    let b = map(d, 0, 300, 60, 255);
    bgColor = color(r, g, b);

    if (rainbowMode) {
        let rainbowColor = color((frameCount * 2) % 255, 255, 255);
        bgColor = rainbowColor;
    }
}

function drawSunflower() {
    push();
    translate(sunflower.x, sunflower.y);

    // Animación de pétalos con un "oscilado" más suave
    for (let petal of sunflower.petals) {
        let osc = sin(frameCount * 0.05 + petal.angleOffset + wind) * petal.petalCurve * sunflower.attention;
        push();
        rotate(petal.angleOffset + osc * 0.1);

        let petalColor = color(255 - sunflower.colorShift, 165, 0, 200);
        if (sunflower.attention > 0.5) {
            petalColor = color(255, 200, 50, 200);
        }
        fill(petalColor);
        ellipse(40, 0, petal.size * sunflower.attention * sunflower.bloom, petal.size * sunflower.bloom);
        pop();
    }

    // Centro de la flor
    fill(255, 204 - sunflower.colorShift, 0);
    ellipse(0, 0, (80 * sunflower.attention + 10) * sunflower.bloom);
    pop();
}

function drawTentacles() {
    push();
    translate(sunflower.x, sunflower.y);

    // Los tentáculos (como raíces o tallos) se mueven con suavidad
    for (let t of sunflower.tentacles) {
        t.curl += t.curlSpeed;
        let x = t.length * cos(t.angle + sin(t.curl) * 0.3);
        let y = t.length * sin(t.angle + sin(t.curl) * 0.3);

        t.angle += t.speed;

        stroke(t.color);
        line(0, 0, x, y);
        ellipse(x, y, 15, 15);  // Puntas de los tentáculos
    }

    pop();
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        if (!p.active) continue;

        p.x += p.speedX + random(-0.2, 0.2) + wind;
        p.y += p.speedY + random(-0.2, 0.2);

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        let d = dist(p.x, p.y, sunflower.x, sunflower.y);
        if (d < 50) {
            p.active = false;
            sunflower.particlesAbsorbed++;
        }

        if (p.active) {
            fill(255, 255, 100, 150);
            ellipse(p.x, p.y, p.size);
        }
    }
}

function drawWind() {
    if (strongWind) {
        wind = sin(frameCount * 0.1) * 5;
    } else if (keyIsPressed && (key === 'w' || key === 'W')) {
        wind = sin(frameCount * 0.1) * 2;
    } else {
        wind = 0;
    }
}

function drawGlow() {
    noStroke();
    fill(255, 255, 0, map(sunflower.particlesAbsorbed, 0, 50, 0, 150));
    ellipse(sunflower.x, sunflower.y, 150 + sunflower.particlesAbsorbed * 2);
}

function mousePressed() {
    sunflower.particlesAbsorbed = 0;
    sunflower.colorShift = 0;
    bgColor = color(30, 10, 60);

    for (let i = 0; i < 20; i++) {
        particles.push({
            x: sunflower.x,
            y: sunflower.y,
            speedX: random(-3, 3),
            speedY: random(-3, 3),
            size: random(2, 5),
            active: true
        });
    }

    sunflower.bloom = 1.5;
}

function mouseMoved() {
    mouseDist = dist(mouseX, mouseY, sunflower.x, sunflower.y);

    if (mouseDist < 100 && intenseParticles) {
        particles.push({
            x: mouseX,
            y: mouseY,
            speedX: random(-1, 1),
            speedY: random(-1, 1),
            size: random(1, 3),
            active: true
        });
    }
}

function keyPressed() {
    if (key === 'A' || key === 'a') {
        sunflower.spiralEffect = true;
        sunflower.bloom = 2;
    }
    if (key === 'S' || key === 's') {
        sunflower.tiltEffect = true;
        sunflower.bloom = 0.5;
    }
    if (key === 'D' || key === 'd') {
        sunflower.colorShift = random(0, 255);
        rainbowMode = true;
    }
    if (key === 'F' || key === 'f') {
        strongWind = true;
    }
    if (key === 'G' || key === 'g') {
        intenseParticles = true;
    }
    if (key === 'H' || key === 'h') {
        lightMode = true;
    }
}

function keyReleased() {
    if (key === 'F' || key === 'f') {
        strongWind = false;
    }
    if (key === 'G' || key === 'g') {
        intenseParticles = false;
    }
    if (key === 'H' || key === 'h') {
        lightMode = false;
    }
    if (key === 'D' || key === 'd') {
        rainbowMode = false;
    }
    if (key === 'A' || key === 'a') {
        sunflower.spiralEffect = false;
    }
    if (key === 'S' || key === 's') {
        sunflower.tiltEffect = false;
    }
}

