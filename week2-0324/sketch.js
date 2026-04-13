let grasses = [];
let tinyBubbles = [];
let fishes = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // 海草顏色：高對比的深綠色系列
  let grassColors = [
    [20, 100, 50, 200], 
    [40, 150, 80, 180], 
    [10, 80, 40, 220],
    [120, 200, 120, 160]
  ];

  // 初始化海草：高度範圍縮小，使其看起來高度一致
  for (let i = 0; i < 100; i++) {
    grasses.push({
      x: random(-20, width + 20),
      h: random(height * 0.25, height * 0.3), // 高度盡量一致
      w: random(10, 20),
      color: random(grassColors),
      noiseOffset: random(10000)
    });
  }

  // 初始化大量小氣泡
  for (let i = 0; i < 120; i++) {
    tinyBubbles.push(new TinyPopBubble());
  }

  for (let i = 0; i < 4; i++) {
    fishes.push(new Fish());
  }
}

function draw() {
  background(2, 6, 12); // 深海黑藍色

  // 1. 繪製並更新魚類
  for (let f of fishes) f.update(), f.display();

  // 2. 繪製海草（幅度提高到 100）
  for (let g of grasses) {
    drawSteadyGrass(g);
  }

  // 3. 繪製會破掉的小氣泡
  for (let tb of tinyBubbles) {
    tb.update();
    tb.display();
  }
}

function drawSteadyGrass(g) {
  push();
  // 微弱發光增強質感
  drawingContext.shadowBlur = 12;
  drawingContext.shadowColor = color(g.color[0], g.color[1], g.color[2]);
  
  noFill();
  stroke(g.color);
  strokeWeight(g.w);
  strokeCap(ROUND);

  let time = frameCount * 0.007; 
  let mouseSway = map(mouseX, 0, width, -2, 2); 

  beginShape();
  for (let i = 0; i <= 10; i++) {
    let t = i / 10; 
    
    // 擺動幅度調整至 100
    let nx = g.noiseOffset + time + (t * 1.2); 
    let sway = (noise(nx) - 0.5) * 100 * t + (mouseSway * 30 * t);
    
    let vx = g.x + sway;
    let vy = height - (t * g.h);
    
    curveVertex(vx, vy);
    if (i === 0 || i === 10) curveVertex(vx, vy);
  }
  endShape();
  pop();
}

// 會破掉的小氣泡類別
class TinyPopBubble {
  constructor() {
    this.reset();
    this.y = random(height); // 初始隨機分佈
  }
  reset() {
    this.x = random(width);
    this.y = height + 10;
    this.r = random(2, 5); // 氣泡尺寸較小
    this.speed = random(1, 2.5);
    this.popY = random(height * 0.2, height * 0.7); // 隨機破裂高度
    this.isPopping = false;
    this.popTimer = 0;
  }
  update() {
    if (!this.isPopping) {
      this.y -= this.speed;
      this.x += sin(frameCount * 0.04 + this.x) * 0.8;
      if (this.y < this.popY) {
        this.isPopping = true;
      }
    } else {
      this.popTimer++;
      if (this.popTimer > 8) this.reset();
    }
  }
  display() {
    noStroke();
    if (!this.isPopping) {
      fill(255, 255, 255, 120);
      circle(this.x, this.y, this.r * 2);
    } else {
      // 小氣泡破裂：散開的小點
      fill(255, 255, 255, 150 - this.popTimer * 20);
      let pDist = this.popTimer * 2;
      circle(this.x + pDist, this.y, 1);
      circle(this.x - pDist, this.y, 1);
      circle(this.x, this.y + pDist, 1);
      circle(this.x, this.y - pDist, 1);
    }
  }
}

class Fish {
  constructor() {
    this.x = random(width);
    this.y = random(height * 0.1, height * 0.6);
    this.speed = random(0.7, 1.4);
    this.c = color(255, 140, 0);
  }
  update() {
    this.x += this.speed;
    if (this.x > width + 100) {
      this.x = -100;
      this.y = random(height * 0.1, height * 0.6);
    }
  }
  display() {
    push();
    translate(this.x, this.y + sin(frameCount * 0.05) * 8);
    fill(this.c);
    noStroke();
    ellipse(0, 0, 25, 12);
    triangle(-12, 0, -20, -8, -20, 8);
    fill(255, 180);
    rect(-4, -6, 3, 12);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}