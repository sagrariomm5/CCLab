/*
Template for IMA's Creative Coding Lab 

Project A: Generative Creatures
CCLaboratories Biodiversity Atlas 
*/

//variables for the flower position
let followCenter = false;
let rotationAngle = 0;
let backgroundFade = 0;
let stemAlpha = 255;
let showText = true;
let speedX = 2;
let speedY = 1;
let flowerX = 400;
let flowerY = 300;
let floating = false;
let flowerSizes = [];
let flowerXPositions = [];
let flowerYPositions = [];
let flowerSpeeds = [];
let flowerAlphas = [];
let flowerAngles = [];
//variable for particles simulating polen
let particles = [];
//variable to change the background
let nightMode = false;
let x, y;

function setup() {
    let canvas = createCanvas(800, 500);
    canvas.id("p5-canvas");
    canvas.parent("p5-canvas-container");
    x = width / 2;
    y = height / 2;
}

function draw() {
    drawBackground();

    //text 
    if (showText) {
        fill(255);
        textSize(20);
        textAlign(CENTER, CENTER);
        text("Interact by pressing the mouse and then the space bar", width / 2, 30);
    }
    //draw the stem
    if (!floating) {
        stemAlpha = 255;
    } else if (stemAlpha > 0) {
        stemAlpha -= 5;
    }
    if (stemAlpha > 0) {
        drawStem(width / 2, height - 100, 25, 600, stemAlpha);
    }
    //draw the grass
    drawGrass();

    if (floating) {
        moveSunflower();
    }


    //draw  the flower
    drawSunflower(flowerX, flowerY, 150, color(235, 204, 28));
    drawSunflower(flowerX, flowerY, 100, color(252, 222, 50));
    drawSunflower(flowerX, flowerY, 50, color(222, 159, 9));
    drawSunflower(flowerX, flowerY, 25, color(237, 169, 7));

    //
    drawCenter(flowerX, flowerY);

    // draw the mini flowers
    for (let i = 0; i < flowerXPositions.length; i++) {
        push();
        translate(flowerXPositions[i], flowerYPositions[i]);
        rotate(flowerAngles[i]); // Rotación del pétalo

        fill(6, 92, 12, flowerAlphas[i]);
        ellipse(0, 0, flowerSizes[i] * 0.1, flowerSizes[i]);
        ellipse(1, 2, flowerSizes[i] * 0.1, flowerSizes[i]);
        ellipse(2, 3, flowerSizes[i] * 0.2, flowerSizes[i]);

        pop();

        flowerSizes[i] = sin(frameCount * flowerSpeeds[i]);
        flowerSizes[i] = map(flowerSizes[i], -1, 1, 0, 100);


        flowerYPositions[i] += 1;
        flowerAngles[i] += 0.02;

        if (flowerAlphas[i] > 0) {
            flowerAlphas[i] -= 2;

        }
    }

    //
    drawBlob(flowerX, flowerY, 50, 50, 0);
    drawBlob(flowerX, flowerY, 50, 50, 60);
    drawBlob(flowerX, flowerY, 50, 50, 120);
    drawBlob(flowerX, flowerY, 50, 50, 180);
    drawBlob(flowerX, flowerY, 50, 50, 240);
    drawBlob(flowerX, flowerY, 50, 50, 300);

    //
    drawPolens(flowerX, flowerY);
    drawPolens(flowerX, flowerY);
    drawPolens(flowerX, flowerY);

    //draw the particles for polen
    for (let i = particles.length - 1; i >= 0; i--) {
        updateParticle(particles[i]);
        displayParticle(particles[i]);
        if (particles[i].lifetime <= 0) {
            particles.splice(i, 1);
        }
    }
}

//flower movements:
function moveSunflower() {
    flowerX += speedX;
    flowerY += speedY;
    //sprin 
    if (flowerX <= 0 || flowerX >= width)
        speedX = -speedX;

    if (flowerY <= 0 || flowerX >= height)
        speedY = -speedY;

    if (floating) {
        rotationAngle += 0.02;

    }
}


function keyPressed() {
    if (key === ' ') {
        floating = true;
        followCenter = true;
        generatePolen();
        showText = false;
    }
}

function drawCenter(x, y) {
    push();
    translate(x, y);

    let dia = map(mouseX, 0, width, 10, 200);

    stroke(212, 100, 25);
    fill(0, 212, 100, 25);
    circle(0, 0, dia);

    pop();
}

function drawBlob(x, y, w, h, deg) {
    push();
    translate(x, y);
    rotate(frameCount * 0.01); // spinning

    push();
    rotate(radians(deg));
    stroke(252, 198, 68);
    fill(252, 0, 198, 68);
    ellipse(20, 10, w, h);
    pop();

    pop();
}

function drawPolens(x, y) {
    push();
    translate(x, y);

    let angle = random(TWO_PI);
    let rad = random(30, 70);

    let posX = cos(angle) * rad;
    let posY = sin(angle) * rad;

    stroke(0);
    fill(0, 100);
    line(0, 0, posX, posY);
    circle(posX, posY, 10);

    pop();
}

function drawBackground() {
    noStroke();

    //change the background depending the mode
    if (nightMode) {
        //degraded to dark blue (night)
        for (let y = 0; y < height; y++) {
            let c = map(y, 0, height, 0, 30);
            fill(c, c, 50);
            rect(0, y, width, 1);
        }
    } else {
        //degraded to light blue (day)
        for (let y = 0; y < height; y++) {
            let c = map(y, 0, height, 135, 255);
            fill(c, c, 255);
            rect(0, y, width, 1);
        }
    }
    if (floating) {
        backgroundFade = min(backgroundFade + 5, 100);
    } else {
        backgroundFade = max(backgroundFade - 5, 0);
    }

    drawFloatingEffect(backgroundFade);
}

function drawFloatingEffect(alpha) {
    let s = 30;
    stroke(0, 0, alpha);
    noFill();

    for (let i = 0; i < width; i += s) {
        for (let j = 0; j < height; j += s) {
            let d = dist(flowerX, flowerY, i, j);
            let f = map(d, 0, sqrt(width * width + height * height), 0.1, 3);
            let h = map(d, 0, width, 0, 100);
            let angle = map(d, 0, sqrt(width * width + height * height), 0, TWO_PI);
            push();
            translate(i, j);
            rotate(angle);
            line(0, 0, s * f, s * f);
            pop();
        }
    }
}

function drawStem(x, y, w, h, alpha) {
    fill(34, 139, 34, alpha);
    noStroke();
    rect(x - w / 2, y, w, h);
}

function drawGrass() {
    fill(34, 139, 34);

    //draw the triangles
    for (let i = 0; i < width; i += 20) {
        let x1 = i;
        let y1 = height;
        let x2 = i + 10;
        let y2 = height - random(10, 30);
        let x3 = i + 20;
        let y3 = height;

        //draw each triangle
        triangle(x1, y1, x2, y2, x3, y3);
    }
}

//background change effect
function mousePressed() {
    nightMode = !nightMode;
    generatePolen();
    if (floating) {
        flowerXPositions.push(mouseX);
        flowerYPositions.push(mouseY);
        flowerSizes.push(100);
        flowerSpeeds.push(random(0.05, 0.1));
        flowerAlphas.push(255);
        flowerAngles.push(random(TWO_PI));
    }
}

//function to generate polen particles
function generatePolen() {
    let numberOfParticles = 50;

    for (let i = 0; i < numberOfParticles; i++) {
        let angle = random(TWO_PI);
        let rad = random(50, 30);

        let posX = cos(angle) * rad;
        let posY = sin(angle) * rad;
        let dx = flowerX - (flowerX + posX);
        let dy = flowerY - (flowerY + posY);

        let p = {
            x: flowerX + posX,
            y: flowerY + posY,
            dx: dx * 0.10,
            dy: dy * 0.10,
            color: color(random(255), random(255), 0),
            lifetime: 255,
        };
        particles.push(p);
    }
}
//function to update the particle's position and lifetime
function updateParticle(p) {
    p.x += p.dx;
    p.y += p.dy;
    p.lifetime -= 2;
}

//function to display the particle
function displayParticle(p) {
    fill(p.color.levels[0], p.color.levels[1], p.color.levels[2], p.lifetime);
    noStroke();
    ellipse(p.x, p.y, 5, 5);
}

function drawSunflower(u, v, s, c) {
    push();
    translate(u, v);
    rotate(rotationAngle);
    strokeWeight(2);
    stroke(28, 8, 5);
    fill(c);
    circle(0, 0, s);

    for (let a = 0; a < 2 * PI; a += PI / 6) {
        push();
        rotate(a);
        circle(s * 0.5, s * 0.3, s * 0.5);
        pop();
    }
    //circle inside the 1st figure
    fill(125, 68, 1);
    noStroke(0);
    circle(0, 0, 25);
    //little circle in the middle
    fill(99, 54, 2);
    noStroke();
    circle(0, 0, 10);
    //last circle
    fill(56, 31, 1);
    noStroke();
    circle(0, 0, 5);

    pop();
}

