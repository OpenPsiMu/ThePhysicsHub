/*
This document is separated in sections.
Every document on the bottom of another document
may have a dependency on the top document. But not the
other way around. For example: the first document is responsable
for the dropdown. Which the files below it may depend on. But the
dropdown file does not depend on the files below it.
*/

//First we take the canvas from the document.
if (document.getElementsByTagName("canvas").length>0){
  const canvas = document.getElementsByTagName("canvas")[0];
  canvas.id = "canvas";
} else {
  //If there are no canvas in the document, we make one.
  const canvas = document.createElement("canvas");
  document.getElementById("simwrapper").appendChild(canvas);
  canvas.id = "canvas";
  canvas.style = "height: 300px;width: 500px;border: 1px solid black;background: black;display: block;";
  canvas.width = 500;
  canvas.height = 300;
};

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", {alpha: false});//alpha false optimizes
let running = true;//So we can pause the simulation
let damping = 1;


//Now we modify the canvas to simulate a p5 canvas
canvas.elt = canvas;


//Now we create an object to hold the reference points
//These are used for actions that depend on the transfomed corners of the canvas
const universe = {
  x0: 0,
  y0: 0,
  x1: canvas.width,
  y1: canvas.height,
  h: canvas.height,
  w: canvas.width,
  scale: 1,
};


//Updated universe after a transformation has been applied to the canvas
universe.updatePoints = function(){
  const origin = invertCoordinates(0, 0, ctx);
  const rightBottomCorner = invertCoordinates(canvas.width, canvas.height, ctx);
  universe.x0 = Math.floor(origin[0]);//Integers are more efficient
  universe.y0 = Math.floor(origin[1]);
  universe.x1 = Math.floor(rightBottomCorner[0]);
  universe.y1 = Math.floor(rightBottomCorner[1]);
  universe.h = universe.y1-universe.y0;
  universe.w = universe.x1-universe.x0;
};

//Gives the coordinates of x,y with inverse transform to the canvas transform
function invertCoordinates(x, y, ctx){
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


//Changes canvas dimensions and transform to improve image quality
function improveImage(scale=2){
  //Improve resolution
  canvas.width*=scale;
  canvas.height*=scale;
  ctx.scale(scale, scale);
  universe.scale*=scale;
  universe.updatePoints();
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
  for (var i=0; i<=nrows; i++){
    ctx.moveTo(universe.x0, i*dw);
    ctx.lineTo(universe.x1, i*dw);
  };

  //Then we undo the previous transformation and apply the next
  ctx.translate(Math.floor(universe.x0/dw)*dw, -Math.floor(universe.y0/dw)*dw);

  //Now we make the columns
  for (var i=0; i<=ncols; i++){
    ctx.moveTo(i*dw, universe.y0);
    ctx.lineTo(i*dw, universe.y1);
  };
  ctx.stroke();

  //Translate canvas back!!!!
  ctx.translate(-Math.floor(universe.x0/dw)*dw, 0);


  //Draw the frame!!!
  universe.updatePoints();
  ctx.strokeStyle = "white";
  ctx.lineWidth = 6/ctx.getTransform().a;
  ctx.beginPath();
  ctx.moveTo(universe.x0, universe.y0);
  ctx.lineTo(universe.x0, universe.y0+universe.h);
  ctx.lineTo(universe.x0+universe.w, universe.y0+universe.h);
  ctx.lineTo(universe.x0+universe.w, universe.y0);
  ctx.closePath();
  ctx.stroke();
};

//Canvas functions must not take action when the cursor lies outside the canvas
canvasMouseIn = function(){
  canvas.isMouseOver = true;

  //The document can no longer be scrolled
  document.body.style.overflow = "hidden";

  //Nice cursor
  canvas.style.cursor = "grab";
};

//Canvas functions must not take action when the cursor lies outside the canvas
canvasMouseOut = function(){
  canvas.isMouseOver = false;
  document.body.style.overflow = "auto";
};


//Now the functons involving canvas interactivity
function canvasPressed(e){
  //Set required tags and save required values
  if (!canvas.isMouseOver){return;};
  canvas.isPressed = true;
  canvas.clickedCoords = invertCoordinates(e.offsetX*universe.scale, e.offsetY*universe.scale, ctx);
  canvas.initTransform = ctx.getTransform();
  canvas.style.cursor = "grabbing";
};


//Function that changes canvas attributes upon mouse drag
function canvasDragged(e){
  if (!canvas.isPressed || !canvas.isMouseOver){return;};

  //Update the reference coordinates in universe
  universe.updatePoints();

  //Get the displacement
  const newCoords = invertCoordinates(e.offsetX*universe.scale, e.offsetY*universe.scale, ctx);
  const dx = newCoords[0] - canvas.clickedCoords[0];
  const dy = newCoords[1] - canvas.clickedCoords[1];

  //Apply new view
  ctx.translate(dx, dy);
};

//Handles mouse release actions that affect the canvas
function canvasReleased(){
  canvas.isPressed = false;
  canvas.style.cursor = "grab";
};


//Zoomming in and out
function canvasWheel(e){
  //Follows the untransformd mousePosition
  let t = ctx.getTransform();
  const mouseLoc = invertCoordinates(e.offsetX*universe.scale, e.offsetY*universe.scale, ctx);
  let change = e.deltaY/1000; //Change in coordinates
  const scale = 1 + change;
  if (scale*t.a>5.0 || scale*t.a<.2){
    change = 0;
    if (scale*t.a<.2){
      ctx.setTransform(.2,t.b,t.c,.2, t.e,t.f);
    } else if (scale*t.a> 5) {
      ctx.setTransform(5,t.b,t.c,5, t.e,t.f);
    };
    universe.updatePoints();
    return;
  };
  ctx.translate(...mouseLoc);
  ctx.scale(scale, scale);
  ctx.translate(-mouseLoc[0], -mouseLoc[1]);
  t = ctx.getTransform();
  // ctx.setTransform(t.a+change,t.b,t.c,t.d+change, t.e,t.f);
  universe.updatePoints();
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
  this.strokeStyle = "white"; //Edge color
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

//Draws all bodies
body.prototype.drawAll = function(){
  //First we make sure the canvas fits out objects specifications
  for (var b of body.prototype.bodies){
    b.draw();
  };
};

//Moves the body that has this funciton called by as a method!
body.prototype.move = function(dt = 1){
  //Moves the particle through dt seconds
  this.x+=this.vx*dt;
  this.y+=this.vy*dt;
};

//Moves all bodies.
body.prototype.moveAll = function(dt = 1){
  //Does the same as move, but to all blocks
  for (var b of body.prototype.bodies){
    b.move(dt);
  };
};


//Detects wall collisions and handles them
//Walls are the sides of the canvas
body.prototype.wallDetectionAndHandling = function(){
  /*This bounces the object from the wall.*/
  if (this.x+this.r>universe.x1){
    this.vx*=-1*damping;
    this.x = universe.x1 - this.r;
  } else if (this.x -this.r < universe.x0){
    this.vx*=-1*damping;
    this.x = this.r+universe.x0;
  };
  if (this.y+this.r>universe.y1){
    this.vy*=-1*damping;
    this.y = universe.y1-this.r;
  } else if (this.y -this.r < universe.y0){
    this.vy*=-1*damping;
    this.y = this.r+universe.y0;
  };
};

//Checks and handles wall collisions for all the bodies
body.prototype.wallDetectionAndHandlingAll = function(){
  //Does the same as move, but to all blocks
  for (var b of body.prototype.bodies){
    b.wallDetectionAndHandling();
  };
};

//Used to get access to all the bodies
body.prototype.bodies = []; //Notice every created object ends here

//Checks the collisions for all bodies with all other bodies
body.prototype.checkAndHandleCollisionAll = function(){
  const bodies = body.prototype.bodies;
  for (var i=0; i < bodies.length-1; i++){
    for (var j=i+1; j < bodies.length; j++){
      const b1 = bodies[i];
      const b2 = bodies[j];
      if ((b1.x-b2.x)**2>(b1.r+b2.r)**2){continue;};//efficiency
      if ((b1.y-b2.y)**2>(b1.r+b2.r)**2){continue;};
      if ((b1.x-b2.x)**2+(b1.y-b2.y)**2 < (b1.r+b2.r)**2){
        b1.collideWith(b2);//This function does anything we want after collision
      };
    };
  };
};

//Draws arror that give an indication of relative velocity
body.prototype.drawVArrow = function(){
  const speed = Math.sqrt(this.vx**2+this.vy**2);
  if (speed==0){return;};
  const sin = this.vy/speed;
  const cos = this.vx/speed;
  const len = 40*speed;
  const h = 3; //sideHeight of arrow
  ctx.strokeStyle = ctx.fillStyle = this.strokeStyle;
  ctx.lineWidth = this.lineWidth*2;
  ctx.transform(cos, sin, -sin, cos, this.x, this.y);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(len, 0);
  ctx.lineTo(len, -h);
  ctx.lineTo(len+2*h, 0);
  ctx.lineTo(len, h);
  ctx.lineTo(len, 0);
  ctx.closePath();
  ctx.stroke();
  ctx.fill();
  ctx.transform(cos, -sin, sin, cos, 0, 0);
  ctx.translate(-this.x, -this.y);
};

//Draws velocity arrows for all bodies
body.prototype.drawVArrowAll = () =>{
  for (var b of body.prototype.bodies){
    b.drawVArrow();
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
  //Two bodies can't ocupy the same location!!!

  //Here we save some values
  const vx1 = this.vx;
  const vy1 = this.vy;
  const vx2 = b2.vx;
  const vy2 = b2.vy;

  //Lets save these values
  let x12 = b2.x - this.x;
  let y12 = b2.y - this.y;

  //Make the balls no longer overlap
  //This step is VERY important
  let dist = Math.sqrt(x12**2 + y12**2);//Only used once. But not constant!
  const xOffset = (this.r+b2.r - dist)*x12/dist;
  const yOffset = (this.r+b2.r - dist)*y12/dist;
  b2.x += 1/2*xOffset;
  b2.y += 1/2*yOffset;
  this.x -= 1/2*xOffset;
  this.y -= 1/2*yOffset;

  //Constant that shows up more than once
  const mt = this.m + b2.m;
  const r = (b2.x-this.x)**2 + (b2.y-this.y)**2;
  const dotProd = (vx1-vx2)*(this.x-b2.x) + (vy1-vy2)*(this.y-b2.y);
  //Note that x12 and y12 changed!
  x12 = b2.x - this.x;
  y12 = b2.y - this.y;

  //Calculate new velocities
  const newVx1 = vx1 - 2*b2.m*-x12*dotProd/(mt*r);
  const newVy1 = vy1 - 2*b2.m*-y12*dotProd/(mt*r);

  const newVx2 = vx2 - 2*this.m*x12*dotProd/(mt*r);
  const newVy2 = vy2 - 2*this.m*y12*dotProd/(mt*r);

  //Set new velocities
  this.vx = newVx1*damping; this.vy = newVy1*damping;
  b2.vx = newVx2*damping; b2.vy = newVy2*damping;
};

//Random rbg color generator
function generateColor(){
  const color = `rgb( ${Math.random()*255},
                      ${Math.random()*255},
                      ${Math.random()*255})`;
  return color;
};


//Now we check for mouseclick
body.prototype.isMouseOver = function(e){
  const point = invertCoordinates(e.offsetX*universe.scale, e.offsetY*universe.scale, ctx);
  for (var b of body.prototype.bodies){
    if ((b.x-point[0])**2+(b.y-point[1])**2<b.r**2){
      body.prototype.unSelectBody();
      body.prototype.selectBody(b);
      return true;
    };
  };
  return false;
};

//Selects a body
body.prototype.selectBody = (b)=> {
  body.prototype.selectedBody = b;
  b.originalStroke = b.strokeStyle;
  b.strokeStyle = "cornflowerblue";
  b.lineWidth = 1.2;
  b.isBeingDragged = true;
};

//Makes a body ready to be dragged by the mouse
body.prototype.startDragging = () =>{
  if (!body.prototype.selectedBody){return};
  body.prototype.selectedBody.isBeingDragged = true;
};

//Makes a body undraggable
body.prototype.stopDragging = () =>{
  if (!body.prototype.selectedBody){return};
  body.prototype.selectedBody.isBeingDragged = false;
};

//Makes body return to unselected state
body.prototype.unSelectBody = ()=> {
  if (!body.prototype.selectedBody){return;};
  const b = body.prototype.selectedBody;
  b.strokeStyle = b.originalStroke;
  // b.fillStyle = "white";
  b.lineWidth = 1;
  b.isBeingDragged = false;
  body.prototype.selectedBody = undefined;
};

//Applies many functions to make the system evolve in time
body.prototype.evolve = function(){
  const b = body.prototype;
  for (let i=0; i<25; i++){
    b.checkAndHandleCollisionAll(); //Must be first!!
    b.wallDetectionAndHandlingAll(); //Ensures nothing moves inside the wall!!! This breaks everything!!!!
    b.moveAll();
  };
  b.drawAll();
  b.drawVArrowAll();
};

//Makes a body move to where the mouse is
body.prototype.moveToMouse = (e)=>{
  const b = body.prototype.selectedBody;
  const point = invertCoordinates(e.offsetX*universe.scale, e.offsetY*universe.scale, ctx);
  b.x = point[0];
  b.y = point[1];
};


//Lets attach some mouseEvents to the canvas
function mousePressed(e){
  const b = body.prototype.selectedBody;
  if (body.prototype.isMouseOver(e)){
    body.prototype.startDragging();
    return;
  };
  body.prototype.unSelectBody();
  canvasPressed(e);
};

//Canvas mouse drag handler
function mouseDragged(e){
  if (body.prototype.selectedBody){
    if (body.prototype.selectedBody.isBeingDragged){
      body.prototype.moveToMouse(e);
    };
    return;
  } else {
    canvasDragged(e);
  };
};

//Canvas mouse release handler
function mouseReleased(e){
  body.prototype.stopDragging();
  canvasReleased(e);
};


//Adding event listeners
canvas.addEventListener("mousedown", mousePressed);
canvas.addEventListener("mousemove", mouseDragged);
canvas.addEventListener("mouseup", mouseReleased);
canvas.addEventListener("mouseenter", canvasMouseIn);
canvas.addEventListener("mouseleave", canvasMouseOut);
canvas.addEventListener("wheel", canvasWheel);


//Lets make the canvas look fantastisch
improveImage(2);

//Lets make some bodies
for (var i=0; i < 1; i++){
  const rand = Math.random;
  for (var j =0; j<5; j++){
    const x = i*60;
    const y = j*60;
    const vx = rand()**6-rand()**6;
    const vy = rand()**6-rand()**6;
    const r = Math.floor(rand()*8+10);
    const b = new body(x, y, vx, vy, r);
    b.m = i*.2+1;
  };
};

// ctx.scale(1/2, 1/2);
// universe.updatePoints();

//Now we begin the simulation
function run(){
  clearCanvas();
  drawGrid();
  body.prototype.evolve();
  requestAnimationFrame(run);
};
run();



/*
Now we have the file that adds most of the dropdown functionality
*/
/*Time to make the dropdown*/
const dd = makeDropdown(canvas);
dd.setLabel("Your label");
setPedroStyle(canvas);

//Making the items
const parametersItem = makeItem(dd);
const displayItem = makeItem(dd);
const commandsItem = makeItem(dd);

//Making the rows on parametersItem
const vxRow = makeRow(parametersItem);
const vyRow = makeRow(parametersItem);
const rRow = makeRow(parametersItem);
const massRow = makeRow(parametersItem);
const dampingRow = makeRow(parametersItem);
const gRow = makeRow(parametersItem);
const speedRow = makeRow(parametersItem);
const colorRow = makeRow(parametersItem);

//Making display items
const EKRow = makeRow(displayItem);
const instrucRow = makeRow(displayItem);
const showVRow = makeRow(displayItem);

//Making the command rows
const startRow = makeRow(commandsItem);
const pauseRow = makeRow(commandsItem);
const removeRow = makeRow(commandsItem);
const addRow = makeRow(commandsItem);

//Nested Items
const colorItem = makeItem(colorRow);

//Rows in nest items
const redRow = makeRow(colorItem);
const greenRow = makeRow(colorItem);
const blueRow = makeRow(colorItem);


//Making the widget containers
//Parameters
const vmax = 1;
const vxSliderContainer = makeSlider(vxRow, vmax, -vmax, .01, 0, "Vx");
const vySliderContainer = makeSlider(vyRow, vmax, -vmax, .01, 0, "Vy");
const rSliderContainer = makeSlider(rRow, 50, 1, .01, 1, "Radius");
const mSliderContainer = makeSlider(massRow, 20, 1, .01, 5, "Mass");
const dampingSliderContainer = makeSlider(dampingRow, 1, 0.01, .01, 1, "Damp");
const gSliderContainer = makeSlider(gRow, 10, 0., .01, 0, "g");
const speedSliderContainer = makeSlider(speedRow, 7, 0.1, .01, 2, "Speed");
//Colors
const redSliderContainer = makeSlider(redRow, 255, 0, 1, 0, "Red");
const greenSliderContainer = makeSlider(greenRow, 255, 0, 1, 0, "Green");
const blueSliderContainer = makeSlider(blueRow, 255, 0, 1, 0, "Blue");

//display
const EKCheckboxContainer = makeCheckbox(EKRow);
const instrucCheckboxContainer = makeCheckbox(instrucRow);
const showVCheckboxContainer = makeCheckbox(showVRow);

//Commands
const startButtonContainer = new buttonContainer(startRow);
const pauseButtonContainer = new buttonContainer(pauseRow);
const removeCheckboxContainer = makeCheckbox(removeRow);
const addCheckboxContainer = makeCheckbox(addRow);


//Making some buttons
//The function that makes a button requires a dummy function
const dummyFunc = ()=>{null;};
//Making the buttons
const startButton = startButtonContainer.makeButton("Start", dummyFunc);
const pauseButton = pauseButtonContainer.makeButton("Pause", dummyFunc);

//Giving the labels
dd.setLabel("Options");

parametersItem.setLabel("Parameters");
displayItem.setLabel("Diplay");
commandsItem.setLabel("Commands");

colorItem.setLabel("Colors");

EKCheckboxContainer.setLabel("Show kinetic energy");
instrucCheckboxContainer.setLabel("Show Instructions");
showVCheckboxContainer.setLabel("Show velocity");
removeCheckboxContainer.setLabel("Remove");
addCheckboxContainer.setLabel("Add");


//Adding functionality to the dropdown
//First we need to make sure that the parameters refer to the selected body.
//Hence we overwrite the original selectBody() function.
//Before we make a function that sets all the sliders accordingly
function setSlidersToSelectedBody(){
  if (!body.prototype.selectedBody){return;};
  const b = body.prototype.selectedBody;
  vxSliderContainer.slider.value = b.vx;
  vySliderContainer.slider.value = b.vy;
  mSliderContainer.slider.value = b.m;
  rSliderContainer.slider.value = b.r;
  dampingSliderContainer.slider.value = 0; //Still need to add damping

  updateSliderLabels();
};
//Lets get access to all sliders at once
const sliderContainers = [
  vxSliderContainer,
  vySliderContainer,
  mSliderContainer,
  rSliderContainer,
  dampingSliderContainer,
  speedSliderContainer,
  redSliderContainer,
  blueSliderContainer,
  greenSliderContainer
];

//function to update slider labels
function updateSliderLabels(){
  //Updating labels
  for (sliderContainer of sliderContainers){
    sliderContainer.updateValueLabel();
  };
};

//Setting default
showVCheckboxContainer.checkbox.checked = true;

//overwritting the original selectBody function
body.prototype.selectBody = (b)=> {
  body.prototype.selectedBody = b;
  b.originalStroke = b.strokeStyle;
  b.strokeStyle = "cornflowerblue";
  b.lineWidth = 1.2;
  setSlidersToSelectedBody();
  b.isBeingDragged = true;
};

//Giving functions to SLIDERS
function updateVx(){
  const b = body.prototype.selectedBody;
  if (!b){return;};
  b.vx = Number(vxSliderContainer.slider.value);
  updateSliderLabels();
};
vxSliderContainer.slider.oninput = updateVx;

function updateVy(){
  const b = body.prototype.selectedBody;
  if (!b){return;};
  b.vy = Number(vySliderContainer.slider.value);
  updateSliderLabels();
};
vySliderContainer.slider.oninput = updateVy;

function updateM(){
  const b = body.prototype.selectedBody;
  if (!b){return;};
  b.m = Number(mSliderContainer.slider.value);
  updateSliderLabels();
};
mSliderContainer.slider.oninput = updateM;

function updateR(){
  const b = body.prototype.selectedBody;
  if (!b){return;};
  b.r = Number(rSliderContainer.slider.value);
  updateSliderLabels();
};
rSliderContainer.slider.oninput = updateR;

//Now the color sliders
function updateColor(){
  if (!body.prototype.selectedBody){return;};
  const r = redSliderContainer.slider.value;
  const g = greenSliderContainer.slider.value;
  const b = blueSliderContainer.slider.value;
  const color = `rgb(${r}, ${g}, ${b})`;
  body.prototype.selectedBody.fillStyle = color;
  updateSliderLabels();
};

for (var sliderContainer of [redSliderContainer,
                              blueSliderContainer,
                              greenSliderContainer]){
  sliderContainer.slider.oninput = updateColor;
};

//Now, to make the collisions work properly we give it a function that changes the global damping
dampingSliderContainer.slider.oninput = function(){
  damping = Number(this.value);
  dampingSliderContainer.updateValueLabel();
};

//Now the commands functionality
startButton.onclick = function(){
  running = true;
};
pauseButton.onclick = function(){
  running = false;
};

//To make the function responsive to changing the running tag we overwrite body.evolve
body.prototype.evolve = function(){
  const b = body.prototype;
  b.checkAndHandleCollisionAll(); //Must be first!!
  b.wallDetectionAndHandlingAll(); //Ensures nothing moves inside the wall!!! This breaks everything!!!!

  if (running){
    b.addVerticalAcceleration(); //Handling gravity
    b.moveAll(Number(speedSliderContainer.slider.value));
  };

  b.drawAll();
  if (showVCheckboxContainer.checkbox.checked){
    b.drawVArrowAll();
  };
};


//For the addingMode we must override the original canvasClick funciton.
//This time it will balls if the checkbox is ticked
function addBody(e){
  const point = invertCoordinates(e.offsetX*universe.scale, e.offsetY*universe.scale, ctx);
  const b = new body(...point, 0, 0, 10);
};
//Lets do the same to remove object
function removeSelectedBody(){
  if (!body.prototype.selectedBody){return;};
  //eLSE
  const b = body.prototype.selectedBody;
  const index = body.prototype.bodies.indexOf(b);
  body.prototype.bodies.splice(index, 1);
  //The data does not have to be deleted bevause js is garbage collected.
};
//Lets attach some mouseEvents to the canvas
function mousePressed(e){
  if (!canvas.isMouseOver){return;};
  const b = body.prototype.selectedBody;
  if (body.prototype.isMouseOver(e)){
    if (!removeCheckboxContainer.checkbox.checked){
      body.prototype.startDragging();
    } else {
      removeSelectedBody();
      body.prototype.unSelectBody();
    };
    return;
  };
  body.prototype.unSelectBody();
  if (addCheckboxContainer.checkbox.checked){
    addBody(e);
  };
  canvasPressed(e);
};
canvas.onmousedown = mousePressed;

//Now we also want a function that gives acceleration to bodies. (Mostly because this is how we add gravitational acceleration)
body.prototype.addVerticalAcceleration = function(){
  const g = Number(gSliderContainer.slider.value);
  const dvy = g*Number(speedSliderContainer.slider.value)/1000;
  for (var b of body.prototype.bodies){
    b.vy+=dvy;
  };
};


//Now we have the plotting
const CanvasParent = canvas.parentElement;
{
  const canvas = document.createElement("canvas");
  CanvasParent.appendChild(canvas);
  canvas.id = "plottingCanvas";
  canvas.style = "height: 300px; width: 500px; border: 2px solid white; background: black; display: inline-block; transition-duration: .5s; position: absolute; z-index:-1; margin: 0;";
  canvas.width = 500;
  canvas.height = 300;
};

const plottingCanvas = document.getElementById("plottingCanvas");
const plottingCtx = plottingCanvas.getContext("2d", {alpha: false});//alpha false optimizes
let parent = canvas.parentElement;
plottingCanvas.parentElement = parent;
parent.appendChild(plottingCanvas);

function setLims(x0, x1, y0, y1){
  //Does not work with enhanced image!!!
  const kx = plottingCanvas.width/(x1-x0);
  const ky = plottingCanvas.height/(y1-y0);
  const dx = -x0*kx;
  const dy = y0*ky;
  plottingCtx.setTransform(kx, 0, 0, -ky, dx, dy+plottingCanvas.height);
};

//Now lets create a function just like invertCoordinates. But it does the transformation
function transformCoords(transform, x, y){
  let xArray = [];
  let yArray = [];
  for (var i =0; i<x.length; i++){
    xArray.push(x[i]*transform.a+transform.e);
    yArray.push(y[i]*transform.d+transform.f);
  };
  return [xArray, yArray];
};

function plotPoints(x, y){
  //PLOTS LINE
  let trans = plottingCtx.getTransform();
  let points = transformCoords(trans, x, y);
  plottingCtx.resetTransform();
  let x_ = points[0];
  let y_ = points[1];
  plottingCtx.moveTo(x_[0], y_[0]);
  plottingCtx.beginPath();
  plottingCtx.lineWidth = 3;
  for (var i=1; i<x.length; i++){
    plottingCtx.lineTo(x_[i], y_[i]);
  };
  plottingCtx.stroke();
  plottingCtx.setTransform(trans);
};


function drawPlottingGrid(sideLen=.2, canvas=plottingCanvas, ctx=plottingCtx){
  const dw = sideLen*50;
  const dh = sideLen;
  const transform = ctx.getTransform();
  const ncols = Math.ceil(canvas.width/transform.a/dw);
  const nrows = Math.ceil(-canvas.height/transform.d/dh);
  const w = ncols*dw;
  const h = nrows*dh;

  //Improving visibility
  ctx.strokeStyle = "gray";
  ctx.lineWidth = 1;

  const leftTopCorner = invertCoordinates(0, 0, ctx);
  const x0 = leftTopCorner[0];
  const y0 = leftTopCorner[1];
  const rightBottomCorner = invertCoordinates(canvas.width, canvas.height, ctx);
  const x1 = rightBottomCorner[0];
  const y1 = rightBottomCorner[1];

  //Making the rows translatabble
  ctx.translate(0, Math.floor(y0/dw)*dh);

  //Now we make the rows
  for (var i=0; i<=nrows; i++){
    ctx.moveTo(x0, i*dh);
    ctx.lineTo(x1, i*dh);
  };

  //Then we undo the previous transformation and apply the next
  ctx.translate(Math.floor(x0/dw)*dw, -Math.floor(y0/dw)*dh);

  //Now we make the columns
  for (var i=0; i<=ncols; i++){
    ctx.moveTo(i*dw, y0);
    ctx.lineTo(i*dw, y1);
  };
  ctx.save();
  ctx.resetTransform();
  ctx.stroke();
  ctx.restore();

  //Translate canvas back!!!!
  ctx.translate(-Math.floor(x0/dw)*dw, 0);
  ctx.restore();
};

function clearPlottingCanvas(){
  const t = plottingCtx.getTransform();
  plottingCtx.resetTransform();
  plottingCtx.clearRect(0, 0, plottingCanvas.width, plottingCanvas.height);
  plottingCtx.setTransform(t);
};



//Now we add the plotting to the existing funcitons
//Here we add the plotting functions to body!!!

//We define a starting time
let t = 0;
let dt = 1;

//We define a time array
const tArray = [t];

//We give ekArrays for every body:
for (let b of body.prototype.bodies){
  b.ekArray = [b.m*(b.vx**2+b.vy**2)];
  b.ekArray.length = tArray.length;
};

//We define a function to get the maximun Ek out of every body
body.prototype.getEkLimits = function(){
  let max = 0;
  let min = 0;
  for (let b of body.prototype.bodies){
    maxInB = Math.max(...b.ekArray);
    minInB = Math.min(...b.ekArray);
    max = (maxInB>max)? maxInB:max;
    min = (minInB<min)? minInB:min;
  };
  if (max == min || max<min){
    min = 0;
    max = 1;
  };
  return [min, max];
};

//We define a maximun and minimun EK for resizing
body.prototype.ekLimits = body.prototype.getEkLimits();

//We make it possible to plot!!!
body.prototype.plotEnergies = function(){
  const t = plottingCtx.getTransform();
  for (var b of body.prototype.bodies){
    plottingCtx.strokeStyle = b.fillStyle;
    plotPoints(tArray, b.ekArray);
  };
  //Now lets plot circles on the ends to make it prettier
  //For this we need to reset the transform temporarily. Otherwise we do not get circles. We get ovals
  plottingCtx.resetTransform();
  plottingCtx.strokeStyle = "white";
  plottingCtx.lineWidth = 1;
  for (var b of body.prototype.bodies){
    plottingCtx.fillStyle = b.fillStyle;
    let index = b.ekArray.length-1;
    let y = b.ekArray[index];
    let x = tArray[index];
    plottingCtx.beginPath();
    plottingCtx.arc(x*t.a+t.e, y*t.d+t.f, 5, 0, 6.28);
    plottingCtx.closePath();
    plottingCtx.fill();
    plottingCtx.stroke();
  };
  plottingCtx.setTransform(t);
};

//Now lets make a funciton that handles updating t and ekArray
let counter,xlims,ylims;
function handlePlotting(){
  //We need some gloabl variables
  if (!counter){
    counter = 0;
  };
  if (!ylims){
    ylims = body.prototype.getEkLimits();
  };
  if (!xlims){
    xlims = [t - speedSliderContainer.slider.value*50, t];
  };

  //Now the actual plotting
  let length = 100;
  if (tArray.length==length){
    tArray.shift();
    for (let b of body.prototype.bodies){
      b.ekArray.shift();
    };
  };
  for (let b of body.prototype.bodies){
    b.ekArray.push(b.m*(b.vx**2+b.vy**2));
  };
  tArray.push(t);
  t+=dt;

  //Now we still have to plot what we have!!! AND handle the limits
  //We create a variable called counter so we don't check for maxima too
  //often. We also define the variable ylims and xlims
  if (counter%2==0){
    counter = 0;
    ylims = body.prototype.getEkLimits();
  };
  counter++

  //Now we set the limits
  xlims = [t - dt*length, t+20*dt];
  setLims(...xlims, ...ylims);

  // Now we plot what we have
  clearPlottingCanvas();
  drawPlottingGrid();
  body.prototype.plotEnergies();
};


//Now we modify the function that runs when the system is running
//This is done by modifying body.prototype.evolve

//To make the function responsive to changing the running tag we overwrite body.evolve
body.prototype.evolve = function(){
  const b = body.prototype;
  const dt = Number(speedSliderContainer.slider.value);
  b.checkAndHandleCollisionAll(); //Must be first!!
  b.wallDetectionAndHandlingAll(); //Ensures nothing moves inside the wall!!! This breaks everything!!!!

  if (running){
    b.addVerticalAcceleration();
    b.moveAll(dt);
  };

  b.drawAll();
  if (showVCheckboxContainer.checkbox.checked){
    b.drawVArrowAll();
  };

  //Here comes the code where we handle kinetic energies
  if (EKCheckboxContainer.checkbox.checked){
    handlePlotting(); //This makes use of dt, which is available from this scope
  };
};

//Note that the above function breaks the function to add objects to the simulation.
//Hence we must fix it by overriding the beast
function addBody(e){
  const point = invertCoordinates(e.offsetX*universe.scale, e.offsetY*universe.scale, ctx);
  const b = new body(...point, 0, 0, 10);
  b.ekArray = [];
  b.ekArray.length = 50;
};

//Also, now we need a function that only makes the plotting canvas visible when
//The button that asks for showing the kinetic energy is pressed.
EKCheckboxContainer.checkbox.onclick = () => {
  //First we add the plottingCanvas to the same container as the canvas
  if (EKCheckboxContainer.checkbox.checked){
    // plottingCanvas.style.display = "inline-block";
    plottingCanvas.style.transform = "translate(75%, 25%) scale(.5, .5)";
    plottingCanvas.style["z-index"] = "1";
  } else {
    // plottingCanvas.style.display = "none";
    plottingCanvas.style.transform = "translate(0%, 0%) scale(.1, .1)";
    plottingCanvas.style["z-index"] = "-1";
  };
};

const explanation = `
<h3>Instructions</h3>
<ul>
  <li>Click and hold to select and drag objects</li>
  <li>Use the dropdown to change individual and global parameters</li>
  <li>Play and discover more!</li>
</ul>
`;

//Now we add some explanation
const explanationBox = document.createElement("div");
canvas.parentElement.appendChild(explanationBox);
explanationBox.parentElement = canvas.parentElement;
explanationBox.style = `
height: 300px;
width: 500px;
background-color: black;
border: 2px solid white;
position: absolute;
display: inline-block;
color:white;
transition-duration: .5s;
z-index: -1;
transform: scale(.1, .1);
margin: 0;
font-family: georgia;
font-size: 25px;
`;
explanationBox.innerHTML = explanation;
instrucCheckboxContainer.checkbox.onclick = ()=>{
  //First we add the plottingCanvas to the same container as the canvas
  if (instrucCheckboxContainer.checkbox.checked){
    // plottingCanvas.style.display = "inline-block";
    explanationBox.style.transform = "translate(75%, -25%) scale(0.5, 0.5)";
    explanationBox.style["z-index"] = "1";
  } else {
    // plottingCanvas.style.display = "none";
    explanationBox.style.transform = "translate(0%, 0%) scale(.1, .1)";
    explanationBox.style["z-index"] = "-1";
  };
};

dd.open();
displayItem.open();
instrucCheckboxContainer.checkbox.checked = true;
instrucCheckboxContainer.checkbox.onclick();
