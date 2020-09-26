/*
This file takes the canvas with an id="canvas" and places
a simple simulation with collision detection and interactivity
in it!

Any questions ask p479h
*/

//First we create the canvas and the function for the grid.
//Here we also make the
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

//Now we create an object to hold the reference points
const universe = {
  x0: 0,
  y0: 0,
  x1: canvas.width,
  y1: canvas.height,
  h: canvas.height,
  w: canvas.width,
};

universe.updatePoints = function(){
  const origin = invertCoordinates(0, 0);
  const rightBottomCorner = invertCoordinates(canvas.width, canvas.height);
  universe.x0 = origin[0];
  universe.y0 = origin[1];
  universe.x1 = rightBottomCorner[0];
  universe.y1 = rightBottomCorner[1];
  universe.h = universe.y1-universe.y0;
  universe.w = universe.x1-universe.x0;
};

function invertCoordinates(x, y){
  const t = ctx.getTransform(); //transform
  const M = t.a*t.d-t.b*t.c;//Factor that shows up a lot
  const xnew = (x*t.d-y*t.c+t.c*t.f-t.d*t.e)/M;
  const ynew = (x*t.b+y*t.a+t.b*t.e-t.a*t.f)/M;
  return [xnew, ynew];
};

//Lets define a function to clear the canvas
function clearCanvas(){
  const transform = ctx.getTransform();
  ctx.resetTransform();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.setTransform(transform);
};



//Now we make the function for the grid
function drawGrid(sideLen=50){
  const dw = sideLen;
  const ncols = Math.ceil(universe.w/dw);
  const nrows = Math.ceil(universe.h/dw);
  const w = ncols*dw;
  const h = nrows*dw;

  //Improving visibility
  ctx.strokeStyle = "gray";
  ctx.lineWidth = 1;

  //Translation to give effect of dragging
  ctx.translate(0, Math.floor(universe.y0/dw)*dw);

  //Now we make the rows
  for (let i=0; i<=nrows; i++){
    ctx.beginPath();
    ctx.moveTo(universe.x0, i*dw);
    ctx.lineTo(universe.x1, i*dw);
    ctx.closePath();
    ctx.stroke();
  };

  //Then we undo the previous transformation and apply the next
  ctx.translate(Math.floor(universe.x0/dw)*dw, -Math.floor(universe.y0/dw)*dw);

  //Now we make the columns
  for (let i=0; i<=ncols; i++){
    ctx.beginPath();
    ctx.moveTo(i*dw, universe.y0);
    ctx.lineTo(i*dw, universe.y1);
    ctx.closePath();
    ctx.stroke();
  };

  //Translate canvas back!!!!
  ctx.translate(-Math.floor(universe.x0/dw)*dw, 0);
};



//Now the functons involving canvas interactivity
function canvasPressed(e){
  //Set required tags and save required values
  canvas.isPressed = true;
  canvas.clickedCoords = invertCoordinates(e.offsetX, e.offsetY);
  canvas.initTransform = ctx.getTransform();
};

function canvasDragged(e){
  if (!canvas.isPressed){return;};

  //Update the reference coordinates in universe
  universe.updatePoints();

  //Get the displacement
  const newCoords = invertCoordinates(e.offsetX, e.offsetY);
  const dx = newCoords[0] - canvas.clickedCoords[0];
  const dy = newCoords[1] - canvas.clickedCoords[1];

  //Apply new view
  ctx.translate(dx, dy);
};

function canvasReleased(){
  canvas.isPressed = false;
};



//Now our beloved body class
function body(x, y, vx, vy, r=50){
  //This is a square body
  this.x = x; // x, y -> Center of circle
  this.y = y;
  this.vx = vx;
  this.vy = vy;
  this.m = 1; //Mass in arbitrary units
  this.fillStyle = generateColor();//"cornflowerblue";//Pretty fill color
  this.strokeStyle = "cornflowerblue"; //Edge color
  this.lineWidth = 1; //Edge width
  this.r = r; //Radius in pixels

  //this is where the array with all the bodies is stored
  this.bodies.push(this);
};

//Note that the draw function now includes linewidth
body.prototype.draw = function(){
  //First we make sure the canvas fits out objects specifications
  ctx.fillStyle = this.fillStyle;
  ctx.strokeStyle = this.strokeStyle;
  ctx.lineWidth = this.lineWidth;
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.r, 0, 6.28);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
};

body.prototype.drawAll = function(){
  //First we make sure the canvas fits out objects specifications
  for (let b of body.prototype.bodies){
    b.draw();
  };
};


body.prototype.move = function(dt = 1){
  //Moves the particle through dt seconds
  this.x+=this.vx*dt;
  this.y+=this.vy*dt;
};

body.prototype.moveAll = function(dt = 1){
  //Does the same as move, but to all blocks
  for (let b of body.prototype.bodies){
    b.move();
  };
};



body.prototype.wallDetectionAndHandling = function(){
  /*This bounces the object from the wall.*/
  if (this.x+this.r>universe.x1){
    this.vx*=-1;
    this.x = universe.x1 - this.r;
  } else if (this.x -this.r < universe.x0){
    this.vx*=-1;
    this.x = this.r+universe.x0;
  };
  if (this.y+this.r>universe.y1){
    this.vy*=-1;
    this.y = universe.y1-this.r;
  } else if (this.y -this.r < universe.y0){
    this.vy*=-1;
    this.y = this.r+universe.y0;
  };
};

body.prototype.wallDetectionAndHandlingAll = function(){
  //Does the same as move, but to all blocks
  for (let b of body.prototype.bodies){
    b.wallDetectionAndHandling();
  };
};


body.prototype.bodies = []; //Notice every created object ends here

body.prototype.checkAndHandleCollisionAll = function(){
  const bodies = body.prototype.bodies;
  for (let i=0; i < bodies.length-1; i++){
    for (let j=i+1; j < bodies.length; j++){
      let b1 = bodies[i];
      let b2 = bodies[j];
      if (Math.sqrt((b1.x-b2.x)**2+(b1.y-b2.y)**2) < b1.r+b2.r){
        b1.collideWith(b2);//This function does anything we want after collision
      };
    };
  };
};


/*
NOTE:
The math here is a bit complex.
Instead of trying to understand it
here, go to wikipedia.
https://wikimedia.org/api/rest_v1/media/math/render/svg/14d5feb68844edae9e31c9cb4a2197ee922e409c
*/

body.prototype.collideWith = function(b2){
  //This function updates velocities and positions!
  //Two bodies can't ocupy the same location

  //Here we save some values
  const vx1 = this.vx;
  const vy1 = this.vy;
  const vx2 = b2.vx;
  const vy2 = b2.vy;

  //Now we save some vectors and scalars
  const x12 = b2.x - this.x;
  const y12 = b2.y - this.y;
  const r = x12**2 +y12**2;
  const mt = this.m + b2.m;
  const dotProd = (vx1-vx2)*(this.x-b2.x) + (vy1-vy2)*(this.y-b2.y);

  //Calculate new velocities
  const newVx1 = vx1 - 2*b2.m*-x12*dotProd/(mt*r);
  const newVy1 = vy1 - 2*b2.m*-y12*dotProd/(mt*r);

  const newVx2 = vx2 - 2*this.m*x12*dotProd/(mt*r);
  const newVy2 = vy2 - 2*this.m*y12*dotProd/(mt*r);

  //Set new velocities
  this.vx = newVx1; this.vy = newVy1;
  b2.vx = newVx2; b2.vy = newVy2;

  //Make the balls no longer overlap
  const dist = Math.sqrt(r);
  b2.x = this.x+(this.r+ b2.r)*x12/dist;
  b2.y = this.y+(this.r+ b2.r)*y12/dist;
};

function generateColor(){
  let color = `rgb( ${Math.random()*255},
                      ${Math.random()*255},
                      ${Math.random()*255})`;
  return color;
};


body.prototype.evolve = function(){
  const b = body.prototype;
  b.wallDetectionAndHandlingAll();
  b.checkAndHandleCollisionAll();
  b.moveAll();
  b.drawAll();
};

//Lets make some bodies
for (let i=0; i < 5; i++){
  let b = new body(i*30, i*30, 1, i, 20);
  b.m = i*.2+1;
};

//Lets draw the grid
drawGrid();

//Lets make a loop of events
let interval = setInterval(
  ()=>{
    clearCanvas();
    drawGrid();
    body.prototype.evolve();
  },10
);

//Lets attach some mouseEvents to the canvas
function mousePressed(e){
  canvasPressed(e);
};

function mouseDragged(e){
  canvasDragged(e);
};

function mouseReleased(e){
  canvasReleased(e);
};

canvas.addEventListener("mousedown", mousePressed);
canvas.addEventListener("mousemove", mouseDragged);
canvas.addEventListener("mouseup", mouseReleased);
