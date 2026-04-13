let sparks = [];
let particles = [];

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('p5-canvas');
  
  for (let i = 0; i < 50; i++) {
    sparks.push(new BioLight());
  }
}

function draw() {
  background(2, 2, 10);
  
  // 1. 繪製環境氛圍
  drawEnvironment();
  
  // 2. 繪製核心串連線 (Connecting Neural Lines)
  drawNeuralHub();

  // 3. 顯示發光生物
  for (let s of sparks) {
    s.update();
    s.display();
  }
}

function drawEnvironment() {
    // 增加一點掃描線感
    stroke(0, 255, 255, 15);
    for(let i=0; i<height; i+=20){
        line(0, i, width, i);
    }
}

function drawNeuralHub() {
  push();
  noFill();
  strokeWeight(2);
  // 設定霓虹發光
  drawingContext.shadowBlur = 20;
  drawingContext.shadowColor = 'cyan';
  
  let startX = 220; // 按鈕區的邊界
  let targetX = 240; // iframe 的起點
  
  // 使用 vertex 繪製一條主垂直導線，串連所有 WEEK 區域
  stroke(0, 255, 255, 80);
  beginShape();
  vertex(startX - 20, 0);
  vertex(startX - 20, height);
  endShape();

  // 繪製從主導線「分叉」出去指向 iframe 的分支
  let yPositions = [height*0.25, height*0.4, height*0.55, height*0.7]; // 對應四個按鈕高度
  
  for (let i = 0; i < yPositions.length; i++) {
    let y = yPositions[i];
    
    // 如果滑鼠靠近該高度，線條變亮 (互動感)
    if (abs(mouseY - y) < 40) {
        stroke(0, 255, 255, 255);
        strokeWeight(3);
    } else {
        stroke(0, 255, 255, 50);
        strokeWeight(1);
    }
    
    beginShape();
    vertex(startX - 20, y);
    vertex(startX + 10, y);
    vertex(startX + 30, y - 20); // 這裡使用了斜角，展現 vertex 技術
    endShape();
  }
  pop();
}

class BioLight {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(random(-0.5, 0.5), random(-0.2, -1));
    this.size = random(2, 5);
  }
  update() {
    this.pos.add(this.vel);
    if (this.pos.y < 0) this.pos.y = height;
  }
  display() {
    noStroke();
    fill(0, 200, 255, 150);
    ellipse(this.pos.x, this.pos.y, this.size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}