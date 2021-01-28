//First we take the canvas from the document.
if (document.getElementsByTagName("canvas").length>0){
  const canvas = document.getElementsByTagName("canvas")[0];
  canvas.id = "canvas";
} else {
  //If there are no canvas in the document, we make one.
  const canvas = document.createElement("canvas");
  document.getElementById("simwrapper").appendChild(canvas);
  canvas.id = "canvas";
  canvas.style = "height: 400px;width: 650px;border: 1px solid black;background: black;display: block;";
  canvas.width = 650;
  canvas.height = 400;
};

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", {alpha: false});//alpha false optimizes
//Now we modify the canvas to simulate a p5 canvas
canvas.elt = canvas;
ctx.lineCap = "round";

const scale_factor =2;//Improving canvas resolution
canvas.height*=scale_factor;
canvas.width*=scale_factor;

let t = 0; //Time should be accesible from everywhere
let running = true; //Used to pause the simulation

const leftWall = {
  edgecolor: "white",
  width: 2,
  x1:canvas.width/15,
  x2:canvas.width/15,
  y1:canvas.height/3,
  y2:2*canvas.height/3,
  getY: function(){//Vertical center of the wall
    return (this.y1+this.y2)/2;
  },
  draw: function(){
    ctx.strokeStyle = this.edgecolor;
    ctx.lineWidth = this.width;
    ctx.beginPath();
    ctx.moveTo(this.x1, this.y1);
    ctx.lineTo(this.x2, this.y2);

    //Drawing the nice stripes on the side
    let dy = (this.y2 - this.y1)/8
    for (var i = -1; i< 8; i++){
      ctx.moveTo(this.x1/2, this.y1+i*dy);
      ctx.lineTo(this.x2, this.y1+(i+1)*dy);
    }

    //Rendering
    ctx.closePath();
    ctx.stroke();
  }
}

const spring = {
  edgecolor: "white",
  activecolor: "blue",
  selectedcolor: "white",
  currentcolor: "white",
  active: false,
  selected: false,
  damping: 0,
  width: 2,
  k: 5,
  x1: leftWall.x1,
  x2: leftWall.x1+canvas.width/4,
  y1: leftWall.getY(),
  y2: leftWall.getY(),
  draw: function(){
    //Note that ctx is a global variable
    ctx.strokeStyle = this.currentcolor;
    ctx.lineWidth = this.width;
    ctx.beginPath();
    if (this.pathx){
      ctx.moveTo(this.pathx[0], this.pathy[0]);
      for (var i = 1; i < this.pathx.length; ++i){
        ctx.lineTo(this.pathx[i], this.pathy[i]);
      };
    } else{
      ctx.moveTo(this.x1, this.y1);
      ctx.lineTo(this.x2, this.y2);
    };
    ctx.stroke();
  },
  make_path: function(){
    const xpoints = [this.x1];
    const ypoints = [this.y1];
    let dx = (this.x2 - this.x1)/8,
      dy = (this.y2 - this.y1)/8;
    for (var i = 1; i < 9; ++i){ //Equivalent to linspace
      xpoints[i] = xpoints[i-1]+dx;
      ypoints[i] = ypoints[i-1]+dy;
    };
    const up = [2, 4, 6];
    const down = [3, 5];
    let offset = canvas.width/20;
    for (var i = 1; i < 8; ++i){ //Equivalent to linspace
      if (up.includes(i)){
        ypoints[i]-=offset;
      } else if (down.includes(i)){
        ypoints[i]+=offset;
      };
    };
    return [xpoints, ypoints];
  },
  assign_path: function(){
    points = this.make_path();
    this.pathx = points[0];
    this.pathy = points[1];
  }
}

const block = {
  // Side length of the block
  side_len: canvas.width/4,
  facecolor: "cornflowerblue",
  edgecolor: "lightblue",
  activecolor: "lightblue",
  selectedcolor: "white",
  currentcolor: "cornflowerblue",
  active: false,
  selected: false,
  width: 2,
  mass: 25, //Kg
  cx: 100, //Center relative to equilibrium
  cy: 0,
  vx: 0,
  vy: 0,
  ax: 0,
  ay: 0,
  x0: spring.x2 + canvas.width/4/2, //Center relative to initial drawing position
  y0: spring.y2,
  px: spring.x2 + canvas.width/4/2, //Center where to draw
  py: spring.y2,
  update_drawing_pos: function(){
    this.px = this.x0 + this.cx;
    this.py = this.y0 + this.cy;
  },
  draw: function(){
    //Note that ctx is a global variable
    let cx = this.px - this.side_len/2; // Top left of the cube
    let cy = this.py - this.side_len/2;
    ctx.strokeStyle = this.edgecolor;
    ctx.fillStyle = this.currentcolor;
    ctx.lineWidth = this.width;
    ctx.beginPath();
    ctx.translate(cx, cy);
    ctx.fillRect(0, 0, this.side_len, this.side_len); //Inside
    ctx.rect(0, 0, this.side_len, this.side_len); //Frame
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.translate(-cx, -cy);
  },
  update: function(dt = .0001){
    this.ax = -this.cx*spring.k/this.mass;
    this.ay = -this.cy*spring.k/this.mass;
    this.vx +=this.ax*dt;
    this.vy +=this.ay*dt;
    this.cx +=this.vx*dt;
    this.cy +=this.vy*dt;
    t+=dt;
  },
  drawVelocityArrow: function(){
    let len = Math.sqrt(this.vx**2+this.vy**2);
    if (len == 0){return};
    const sine = this.vy/len;
    const cosine = this.vx/len;
    const headLen = canvas.width/100;
    len*=2;
    ctx.lineWidth = this.width*3;
    ctx.transform(cosine, sine, -sine, cosine, this.px, this.py);
    ctx.beginPath();
    ctx.fillStyle = "lightblue";
    ctx.strokeStyle = "black";
    ctx.moveTo(0, 0);
    ctx.lineTo(len, 0);
    ctx.lineTo(len, -headLen);
    ctx.lineTo(len + 2*headLen, 0);
    ctx.lineTo(len, headLen);
    ctx.lineTo(len, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.transform(cosine, -sine, sine, cosine, 0, 0);
    ctx.translate(-this.px, -this.py);
  },
  drawAccArrow: function(){
    let len = Math.sqrt(this.ax**2+this.ay**2);
    if (len == 0){return};
    const sine = this.ay/len;
    const cosine = this.ax/len;
    const headLen = canvas.width/100;
    len*=2;
    ctx.fillStyle = "lightblue";
    ctx.strokeStyle = "white";
    ctx.lineWidth = this.width*3;
    ctx.transform(cosine, sine, -sine, cosine, this.px, this.py);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(len, 0);
    ctx.lineTo(len, -headLen);
    ctx.lineTo(len + 2*headLen, 0);
    ctx.lineTo(len, headLen);
    ctx.lineTo(len, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.transform(cosine, -sine, sine, cosine, 0, 0);
    ctx.translate(-this.px, -this.py);
  }
}

letters = {
  xeqx: block.x0,
  xeqy: leftWall.y2*1.3,
  yeqx: 2.4*spring.x2,
  yeqy: block.y0,
  xeq_string: "x_0",
  yeq_string: "y_0",
  color: "white",
  width: 4,
  font_size: 10,
  xpath: new Path2D("M -2.48 0.89 Q -2.41 1.31 -1.94 1.86 T -0.78 2.42 Q -0.43 2.42 -0.14 2.24 T 0.29 1.79 Q 0.71 2.42 1.3 2.42 Q 1.67 2.42 1.94 2.2 T 2.22 1.61 Q 2.22 1.32 2.08 1.14 T 1.81 0.92 T 1.58 0.88 Q 1.39 0.88 1.27 0.99 T 1.15 1.28 Q 1.15 1.74 1.65 1.91 Q 1.54 2.04 1.25 2.04 Q 1.12 2.04 1.06 2.02 Q 0.68 1.86 0.5 1.36 Q -0.1 -0.85 -0.1 -1.22 Q -0.1 -1.5 0.06 -1.62 T 0.41 -1.74 Q 0.78 -1.74 1.14 -1.41 T 1.63 -0.6 Q 1.66 -0.5 1.69 -0.49 T 1.85 -0.47 H 1.89 Q 2.04 -0.47 2.04 -0.55 Q 2.04 -0.56 2.02 -0.66 Q 1.86 -1.23 1.4 -1.67 T 0.33 -2.11 Q -0.37 -2.11 -0.73 -1.48 Q -1.14 -2.1 -1.67 -2.1 H -1.73 Q -2.22 -2.1 -2.43 -1.84 T -2.65 -1.29 Q -2.65 -0.97 -2.46 -0.77 T -2.01 -0.57 Q -1.58 -0.57 -1.58 -0.99 Q -1.58 -1.19 -1.7 -1.34 T -1.93 -1.54 T -2.06 -1.59 L -2.09 -1.6 Q -2.09 -1.61 -2.03 -1.64 T -1.87 -1.71 T -1.68 -1.74 Q -1.32 -1.74 -1.06 -1.29 Q -0.97 -1.13 -0.83 -0.61 T -0.55 0.47 T -0.39 1.13 Q -0.34 1.4 -0.34 1.52 Q -0.34 1.8 -0.49 1.92 T -0.83 2.04 Q -1.23 2.04 -1.58 1.72 T -2.07 0.9 Q -2.09 0.81 -2.12 0.8 T -2.28 0.78 H -2.42 Q -2.48 0.84 -2.48 0.89 Z M 1.5304 -1.696 Q 1.6648 -1.5016 1.8976 -1.5016 Q 2.0128 -1.5016 2.128 -1.564 T 2.3152 -1.7848 Q 2.404 -1.984 2.404 -2.332 Q 2.404 -2.704 2.3008 -2.9008 Q 2.2528 -3.0016 2.1688 -3.0616 T 2.0224 -3.136 T 1.9 -3.1528 Q 1.8376 -3.1528 1.7752 -3.1384 T 1.6288 -3.0616 T 1.4968 -2.9008 Q 1.3936 -2.704 1.3936 -2.332 Q 1.3936 -1.9144 1.5304 -1.696 Z M 2.0704 -1.6672 Q 1.9984 -1.5904 1.9 -1.5904 Q 1.7992 -1.5904 1.7272 -1.6672 Q 1.6672 -1.7296 1.648 -1.84 T 1.6288 -2.3008 Q 1.6288 -2.68 1.648 -2.8 T 1.7344 -2.9896 Q 1.8016 -3.0616 1.9 -3.0616 Q 1.996 -3.0616 2.0632 -2.9896 Q 2.1328 -2.9176 2.1496 -2.788 T 2.1688 -2.3008 Q 2.1688 -1.9528 2.1496 -1.8424 T 2.0704 -1.6672 Z"),
  ypath: new Path2D("M -2.79 2.87 Q -2.79 3.01 -2.64 3.35 T -2.16 4.06 T -1.42 4.42 Q -1.01 4.42 -0.76 4.19 T -0.5 3.55 Q -0.52 3.36 -0.53 3.34 Q -0.53 3.31 -0.69 2.88 T -1.02 1.91 T -1.18 1.05 Q -1.18 0.62 -1.04 0.45 T -0.62 0.27 Q -0.39 0.27 -0.19 0.38 T 0.12 0.61 T 0.39 0.94 Q 0.39 0.95 0.44 1.14 T 0.58 1.73 T 0.77 2.47 Q 1.15 3.97 1.19 4.04 Q 1.32 4.31 1.62 4.31 Q 1.75 4.31 1.83 4.24 T 1.94 4.12 T 1.96 4.03 Q 1.96 3.9 1.47 1.93 T 0.91 -0.23 Q 0.63 -1.06 -0.06 -1.55 T -1.44 -2.05 Q -1.89 -2.05 -2.23 -1.83 T -2.57 -1.17 Q -2.57 -0.95 -2.5 -0.8 T -2.31 -0.58 T -2.11 -0.48 T -1.94 -0.45 Q -1.5 -0.45 -1.5 -0.87 Q -1.5 -1.07 -1.62 -1.22 T -1.85 -1.42 T -1.98 -1.47 L -2.01 -1.48 Q -1.99 -1.53 -1.82 -1.6 T -1.48 -1.67 H -1.4 Q -1.23 -1.67 -1.14 -1.65 Q -0.81 -1.56 -0.53 -1.27 T -0.1 -0.65 T 0.13 -0.09 T 0.21 0.21 L 0.15 0.17 Q 0.09 0.13 -0.04 0.06 T -0.3 -0.06 Q -0.5 -0.11 -0.69 -0.11 Q -1.15 -0.11 -1.5 0.11 T -1.96 0.82 Q -1.97 0.89 -1.97 1.13 Q -1.97 1.7 -1.62 2.62 T -1.27 3.79 Q -1.27 3.8 -1.27 3.81 Q -1.27 3.9 -1.27 3.93 T -1.31 4 T -1.42 4.04 H -1.46 Q -1.69 4.04 -1.88 3.85 T -2.18 3.44 T -2.35 3.02 T -2.43 2.8 Q -2.45 2.78 -2.59 2.78 H -2.73 Q -2.79 2.84 -2.79 2.87 M 1.13 -1.6 Q 1.26 -1.4 1.5 -1.4 Q 1.61 -1.4 1.73 -1.46 T 1.92 -1.68 Q 2 -1.88 2 -2.23 Q 2 -2.6 1.9 -2.8 Q 1.85 -2.9 1.77 -2.96 T 1.62 -3.04 T 1.5 -3.05 Q 1.44 -3.05 1.38 -3.04 T 1.23 -2.96 T 1.1 -2.8 Q 0.99 -2.6 0.99 -2.23 Q 0.99 -1.81 1.13 -1.6 Z M 1.67 -1.57 Q 1.6 -1.49 1.5 -1.49 Q 1.4 -1.49 1.33 -1.57 Q 1.27 -1.63 1.25 -1.74 T 1.23 -2.2 Q 1.23 -2.58 1.25 -2.7 T 1.33 -2.89 Q 1.4 -2.96 1.5 -2.96 Q 1.6 -2.96 1.66 -2.89 Q 1.73 -2.82 1.75 -2.69 T 1.77 -2.2 Q 1.77 -1.85 1.75 -1.74 T 1.67 -1.57 Z"),
  draw: function(){
    //X0
    ctx.strokeStyle = this.color;
    ctx.fillStyle = this.color;
    ctx.lineWidth = this.width;
    ctx.translate(this.xeqx, this.xeqy);
    ctx.moveTo(0, -30);
    ctx.lineTo(0, -60);
    ctx.stroke();
    ctx.scale(10, -10); //This scaling comes from the fact that the paths were "made" in a smaller scale
    ctx.fill(this.xpath);
    ctx.scale(.1, -.1);
    ctx.translate(-this.xeqx, -this.xeqy);

    //Y0
    ctx.translate(this.yeqx, this.yeqy);
    ctx.moveTo(-30, 0);
    ctx.lineTo(-60, 0);
    ctx.stroke();
    ctx.scale(10, -10); //This scaling comes from the fact that the paths were "made" in a smaller scale
    ctx.fill(this.ypath);
    ctx.scale(.1, -.1);
    ctx.translate(-this.yeqx, -this.yeqy);
  }
};

const objects = {
  walls: [leftWall],
  springs: [spring],
  blocks: [block],
  letters: [letters],
  update_drawing_pos: function(){
    this.blocks[0].update_drawing_pos();
    this.springs[0].x2 = this.blocks[0].px - this.blocks[0].side_len/2;
    this.springs[0].y2 = this.blocks[0].py;
    this.springs[0].assign_path(); //Makes the wavy pattern!
  },
  update: function(N){
    // Updates the position, speed.... Of block N times
    let i;
    for (i =0; i< N; ++i){
      this.blocks[0].update();
    }
    if (t>100000000){ //In case too much time passes we don't get Inf
      t = 0;
    }
  },
  draw: function(){
    let wall, spring, block, letter;
    this.update_drawing_pos();
    for (wall of this.walls){
      wall.draw();
    }
    for (spring of this.springs){
      spring.draw();
    }
    for (block of this.blocks){
      block.draw();
      block.drawVelocityArrow();
      block.drawAccArrow();
    }
    for (letter of this.letters){
      letter.draw();
    }
  }
}

// function run(){
//   ctx.clearRect(0, 0, canvas.width, canvas.height); //Clearing the drawing area
//   if (running){
//     objects.update(10); //Let time pass while physics are applied to the system
//   };
//   objects.draw(); //Rendering all the objects. Later there will be "if" clauses that lets one select what gets rendered
//   requestAnimationFrame(run);//Needed for "infinite" animation
// }
// run();


/*
  Up to here the code runs fine but there is no interactivity.
  Bellow there is the code that adds interactivity to this simulation.
*/

//Adding region that has to be clicked for the block to be selected
function isOnBlock(e){
  // Returns boolean saying if the mouseclick was in fact on top of the box
  let x0 = block.cx - block.side_len/2 + block.px;
  let y0 = block.cy - block.side_len/2 + block.py;
  let x1 = block.cx + block.side_len/2 + block.px;
  let y1 = block.cy + block.side_len/2 + block.py;
  let ex = e.offsetX*scale_factor;
  let ey = e.offsetY*scale_factor;
  if ((ex>x0 && ex<x1) && (ey>y0 && ey<y1)){
    return true;
  }
  return false;
}

function isOnSpring(e){
  // Returns boolean saying if the mouseclick was in fact on top of the box
  let x0 = spring.x1;
  let y0 = block.cy - block.side_len/2 + block.py;
  let x1 = block.cx - block.side_len/2 + block.px;
  let y1 = block.cy + block.side_len/2 + block.py;
  let ex = e.offsetX*scale_factor;
  let ey = e.offsetY*scale_factor;
  if ((ex>x0 && ex<x1) && (ey>y0 && ey<y1)){
    return true;
  }
  return false;
}

block.handleActive = function(){
  if (this.selected || this.active){
    return;
  };
  this.active = true;
  this.currentcolor = this.activecolor;
}
spring.handleActive = block.handleActive;

block.deactivate = function(){
  this.currentcolor = this.facecolor;
  this.active = false;
};
spring.deactivate = function(){
  this.currentcolor = this.edgecolor;
  this.active = false;
};

block.select = spring.select = function(){
  if (this.selected){return;};
  this.currentcolor = this.selectedcolor;
  this.selected = true;
};

block.unselect = function(){
  this.currentcolor = this.facecolor;
  this.selected = false;
};

spring.unselect = function(){
  this.currentcolor = this.edgecolor;
  this.selected = false;
};

block.startDragging = function(e){
  if (!this.selected){return;};
  this.beingDragged = true;
  this.init_coords_drag = [e.offsetX*scale_factor, e.offsetY*scale_factor];
  this.vx = 0;
  this.vy = 0;
  running = false;
}
block.updateDuringDrag = function(e){
  if (!this.selected){return;};
  let dx, dy;
  dx = e.offsetX*scale_factor - this.init_coords_drag[0];
  dy = e.offsetY*scale_factor - this.init_coords_drag[1];
  this.px = this.init_coords_drag[0] + dx;
  this.py = this.init_coords_drag[1] + dy;
  this.cx = this.px - this.x0;
  this.cy = this.py - this.y0;
  this.update(); //Updates the acceleration arrow
  this.vx = 0;
  this.vy = 0;
}
block.stopDragging = function(e){
  running = true;
  this.beingDragged = true;
}

function handleSelection(e){
  if (isOnBlock(e)){
    spring.unselect();
    block.select();
  // } else if (isOnSpring(e) && !spring.selected){
  //   block.unselect();
  //   spring.select();
  } else {
    block.unselect();
    spring.unselect();
  };
}

function handleActivation(e){
  if (block.selected || spring.selected){return;};
  if (isOnBlock(e)){
    spring.deactivate();
    spring.unselect();
    block.handleActive();
  // } else if (isOnSpring(e)){
  //   block.deactivate();
  //   block.unselect();
  //   spring.handleActive();
  } else {
    block.deactivate();
    spring.deactivate();
  }
}

function handleMove(e){
  handleActivation(e);
  if (block.beingDragged){
    block.updateDuringDrag(e);
  };
}

function handleMouseDown(e){
  handleSelection(e);
  if (block.selected){
    block.startDragging(e);
  };
}

function handleMouseUp(e){
  handleSelection(e);
  if (block.beingDragged){
    block.stopDragging(e);
    block.unselect();
    block.deactivate();
  }
}

canvas.addEventListener("mousemove", handleMove);
canvas.addEventListener("mousedown", handleMouseDown);
canvas.addEventListener("mouseup", handleMouseUp);

function run(){
  ctx.clearRect(0, 0, canvas.width, canvas.height); //Clearing the drawing area
  if (running){
    objects.update(10); //Let time pass while physics are applied to the system
  };
  objects.draw(); //Rendering all the objects. Later there will be "if" clauses that lets one select what gets rendered
  requestAnimationFrame(run);//Needed for "infinite" animation
}


////////////////////NOw adding the widt
if (canvas == undefined){
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
}
canvas.elt = canvas; //For the dropdown
const dd = makeDropdown(canvas);
dd.setLabel("Options");
setPedroStyle(canvas);

//Making the items
const parametersItem = makeItem(dd);
const displayItem = makeItem(dd);
const commandsItem = makeItem(dd);

//Making the rows on parametersItem
const massRow = makeRow(parametersItem);
const dampingRow = makeRow(parametersItem);
const kRow = makeRow(parametersItem);//Spring constant

//Making display items
const EKRow = makeRow(displayItem);
const EPRow = makeRow(displayItem);
const instrucRow = makeRow(displayItem);
const showVRow = makeRow(displayItem);
const showARow = makeRow(displayItem);

//Making the command rows
const startRow = makeRow(commandsItem);
const pauseRow = makeRow(commandsItem);
const restartRow = makeRow(commandsItem);


//Adding the widgets to parameters
const mSliderContainer = makeSlider(massRow, 20, 1, .01, 5, "Mass");
const dampingSliderContainer = makeSlider(dampingRow, 1, 0.0, .01, 0, "Damp");
const kSliderContainer = makeSlider(kRow, 5, .01, .1, 1, "k");

//Adding widgets to display
const EKCheckboxContainer = makeCheckbox(EKRow);
const EPCheckboxContainer = makeCheckbox(EPRow);
const instrucCheckboxContainer = makeCheckbox(instrucRow);
const showVCheckboxContainer = makeCheckbox(showVRow);
const showACheckboxContainer = makeCheckbox(showARow);

//Adding widgets to commands
const startButtonContainer = new buttonContainer(startRow);
const pauseButtonContainer = new buttonContainer(pauseRow);
const restartButtonContainer = new buttonContainer(restartRow);

//Making some buttons
//The function that makes a button requires a dummy function
const dummyFunc = ()=>{null;};
//Making the buttons
const startButton = startButtonContainer.makeButton("Start", dummyFunc);
const pauseButton = pauseButtonContainer.makeButton("Pause", dummyFunc);
const restartButton = restartButtonContainer.makeButton("Restart", dummyFunc);


//Giving appropriate labels
//Parent rows
parametersItem.setLabel("Parameters");
displayItem.setLabel("Diplay");
commandsItem.setLabel("Commands");

//Children rows
//displayItem
EKCheckboxContainer.setLabel("Show kinetic energy");
EPCheckboxContainer.setLabel("Show potential energy");
instrucCheckboxContainer.setLabel("Show Instructions");
showVCheckboxContainer.setLabel("Show velocity");
showACheckboxContainer.setLabel("Show acceleration");


//Now we make some functions
function stopAnimation(){//Used with the stop button
  running = false;
}

function restartAnimation(){
  block.cx = 0;
  block.cy = 0;
  block.vx = 0;
  block.vy = 0;
}

function startAnimation(){//Used with the start button
  running = true;
}
//Attach these two functions to the buttons
startButton.onclick = startAnimation;
pauseButton.onclick = stopAnimation;
restartButton.onclick = restartAnimation;

let sliderContainers = [
  mSliderContainer,
  kSliderContainer,
  dampingSliderContainer
]

function updateSliderLabels(){//Update the values on the sliders after they are changed
  for (var sliderContainer of sliderContainers){
    sliderContainer.updateValueLabel();
  }
}

function changeK(){//Changing the spring constant of the spring
  spring.k = Number(kSliderContainer.slider.value);
  updateSliderLabels();
}

function changeM(){//Change the mass
  block.mass = Number(mSliderContainer.slider.value);
  updateSliderLabels();
}

function changeDamping(){//Changes the damp of the sping
  spring.damping = Number(dampingSliderContainer.slider.value);
  updateSliderLabels();
}

mSliderContainer.slider.oninput = changeM;
kSliderContainer.slider.oninput = changeK;
dampingSliderContainer.slider.oninput = changeDamping;

//At this very moment the simulation does not account for damping lets change that
objects.update =  function(N){
  // Updates the position, speed.... Of block N times
  let i;
  for (i =0; i< N; ++i){
    this.blocks[0].update();
    this.blocks[0].vx*=(1-spring.damping/50000);
    this.blocks[0].vy*=(1-spring.damping/50000);
  }
  if (t>100000000){ //In case too much time passes we don't get Inf
    t = 0;
  }
}


//Now we make the functions for displaying the arrows
function showAccArrow(){
  block.showAccArrow = true;
}
function hideAccArrow(){
  block.showAccArrow = false;
}

function showVelArrow(){
  block.showVelArrow = true;
}

function hideVelArrow(){
  block.showVelArrow = false;
}

function updateDisplay(){
  //Updates all things that have to be displayed
  if (showVCheckboxContainer.checkbox.checked){ //Velocity arrow
    showVelArrow();
  } else {
    hideVelArrow();
  };
  if (showACheckboxContainer.checkbox.checked){ //Acceleration arrow
    showAccArrow();
  } else {
    hideAccArrow();
  };
}

showVCheckboxContainer.checkbox.onclick = showACheckboxContainer.checkbox.onclick = updateDisplay;


objects.draw = function(){ //Overiding the original function
  let wall, spring, block, letter;
  this.update_drawing_pos();
  for (wall of this.walls){
    wall.draw();
  }
  for (spring of this.springs){
    spring.draw();
  }
  for (block of this.blocks){
    block.draw();
    if (block.showVelArrow){
      block.drawVelocityArrow();
    };
    if (block.showAccArrow){
      block.drawAccArrow();
    };
  }
  for (letter of this.letters){
    letter.draw();
  }
}

const explanation = `
<h3>Instructions</h3>
<ul>
  <li>Click and hold to select and drag objects</li>
  <li>Use the dropdown to change parameters</li>
  <li>Play and discover more!</li>
</ul>
`;

//Now we add some explanation
const explanationBox = document.createElement("div");
canvas.parentElement.appendChild(explanationBox);
explanationBox.parentElement = canvas.parentElement;
explanationBox.style = `
height: 400px;
width: 650px;
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

function hideExplanationBox(){
  explanationBox.style.transform = "translate(0%, 0%) scale(.1, .1)";
  explanationBox.style["z-index"] = "-1";
  instrucCheckboxContainer.checkbox.checked = false;
};

function showExplanationBox(){
  explanationBox.style.transform = "translate(75%, -25%) scale(0.5, 0.5)";
  explanationBox.style["z-index"] = "1";
  instrucCheckboxContainer.checkbox.checked = true;
};

explanationBox.onclick = () =>{ //Nicer than having to open the thing again
  hideExplanationBox();
}

showExplanationBox();

instrucCheckboxContainer.checkbox.onclick = ()=>{
  if (instrucCheckboxContainer.checkbox.checked){
    showExplanationBox();
  } else {
    hideExplanationBox();
  }
}

const energyPlot = document.createElement("canvas");
energyPlot.ctx = energyPlot.getContext("2d");
energyPlot.height = canvas.height;
energyPlot.width = canvas.width;
energyPlot.parentElement = canvas.parentElement;
canvas.parentElement.appendChild(energyPlot);
energyPlot.style = "height: 400px; width: 650px; border: 2px solid white; background: black; display: inline-block; transition-duration: .5s; position: absolute; z-index:-1; margin: 0;";
energyPlot.transformationParams = {
  y0: 0,
  y1: 100,
  x0: 0,
  x1: 100,
  pix_to_cord_ratio_x: 100,
  pix_to_cord_ratio_y: 100,
}
energyPlot.dataSets = [
  {}, //EK
  {}, //EP
];
energyPlot.dataSets[0] = { //EK
  points: [],
  transformedPoints: [], //Points ready for rendering under current transformation parameters
  lineColor: "cornflowerblue",
  contour: "white",
  max_p: 50 //MAXIMUM AMMOUNT OF POINTS STORED IN EACH DATASET
};
energyPlot.dataSets[1] = { //EP
  points: [],
  transformedPoints: [], //Points ready for rendering under current transformation parameters
  lineColor: "tomato",
  contour: "white",
  max_p: 50 //MAXIMUM AMMOUNT OF POINTS STORED IN EACH DATASET
}
energyPlot.addPoint = function(dataSet, point){ //Adds points to the objects to be drawn
  let dset = this.dataSets[dataSet]; //Select the object corresponding to that index
  if (dset.points.length == dset.max_p){ //Exceeded maximum number of points
    dset.points.shift();
    dset.transformedPoints.shift();
  }
  dset.points.push(point);
  dset.transformedPoints.push(this.transformPoint(...point));
};

energyPlot.addPoints = function(dataSet, points){
  let point;
  for (point of points){
    energyPlot.addPoint(dataSet, point);
  };
}

energyPlot.drawPoints = function(clip){
  let i, dset;

  if (clip){
    this.ctx.save();
    let innerCorners = this.innerCorners;
    this.ctx.moveTo(...innerCorners[0]);
    for (i = 1; i < 4; ++i){
      this.ctx.lineTo(...innerCorners[i]);
    }
    this.ctx.lineTo(...innerCorners[0]);
    this.ctx.clip();
  };
  //Draws the points stored in energyPlot.points
  this.ctx.lineWidth = this.width/200;//LINEWIDTH
  for (i = 0; i < this.dataSets.length; i++){
    if (i == 0 && !EKCheckboxContainer.checkbox.checked){continue;};
    if (i == 1 && !EPCheckboxContainer.checkbox.checked){continue;};
    dset = this.dataSets[i];
    if (dset.points.length == 0){continue;};
    this.ctx.strokeStyle = dset.lineColor;

    //Drawing the line
    this.ctx.beginPath();
    let p;
    this.ctx.moveTo(...dset.transformedPoints[0]);
    for (p of dset.transformedPoints){
      this.ctx.lineTo(...p);
    };
    this.ctx.stroke();

    //Drawing the round top
    this.ctx.strokeStyle = dset.contour;
    this.ctx.fillStyle = dset.lineColor;
    this.ctx.beginPath();
    this.ctx.arc(...p, this.width/40, 0, 6.28);//Note that the last point is taken
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();
  };
  this.ctx.restore();
};

energyPlot.updateTransformedPoints = function(){
  let dset;
  for (dset of this.dataSets){
    dset.transformedPoints = this.transformPoints(dset.points);
  }
}
energyPlot.updateLims = function(x0, x1, y0, y1){
  this.transformationParams.x0 = x0;
  this.transformationParams.x1 = x1;
  this.transformationParams.y0 = y0;
  this.transformationParams.y1 = y1;
  this.transformationParams.pix_to_coord_ratio_x = this.width/(x1-x0);
  this.transformationParams.pix_to_coord_ratio_y = this.height/(y1-y0); //Remember that the image has to be inverted still
}
energyPlot.transformPoint = function(x, y){
  //Transforms points from coordinate space to pixel space
  const xpix = (x - this.transformationParams.x0)*this.transformationParams.pix_to_coord_ratio_x;
  const ypix = (this.transformationParams.y1 - y)*this.transformationParams.pix_to_coord_ratio_y;
  return [xpix, ypix];
}
energyPlot.transformPoints = function(points){
  //Note that points is an Nx2 array
  let point, i;
  let transformedPoints = [];
  for (i = 0; i<points.length; ++i){
    transformedPoints[i] = this.transformPoint(...points[i]);
  };
  return transformedPoints;
}
function showEnergyPlot(){
  energyPlot.style.transform = "translate(75%, 25%) scale(.5, .5)";
  energyPlot.style["z-index"] = "1";
}
function hideEnergyPlot(){
  energyPlot.style.transform = "translate(0%, 0%) scale(.1, .1)";
  energyPlot.style["z-index"] = "-1";
}

EKCheckboxContainer.checkbox.onclick = EPCheckboxContainer.checkbox.onclick = function(){
  if (EKCheckboxContainer.checkbox.checked || EPCheckboxContainer.checkbox.checked){
    showEnergyPlot();
  } else {
    hideEnergyPlot();
  }
}

energyPlot.onclick = hideEnergyPlot;

energyPlot.innerCorners = [
  [1.5*energyPlot.width/18, 16*energyPlot.height/18],
  [1.5*energyPlot.width/18, 2*energyPlot.height/18],
  [16.5*energyPlot.width/18, 2*energyPlot.height/18],
  [16.5*energyPlot.width/18, 16*energyPlot.height/18],
];

energyPlot.fancyText = {
  E: new Path2D("M 4.6 4.35 Q 3.6 4.35 3.6 3.7 Q 3.6 3.5 3.85 2.5 T 4.1 0.75 Q 4.1 -0.8 3.05 -1.15 T -1.8 -1.5 H -4.4 Q -4.45 -1.4 -6.15 5.4 T -7.85 12.4 Q -7.85 12.6 -7.3 12.6 T -3.3 12.7 Q 1.4 12.7 2.9 12.6 T 5.9 11.95 Q 8.35 11.15 9.95 9.15 T 13.5 2.6 Q 14 1.5 14.15 1.4 Q 14.5 1.3 14.9 1.3 Q 15.9 1.3 15.9 1.95 Q 10.65 14.65 10.4 14.9 Q 10.25 15 -3.9 15 H -13.35 Q -18.45 15 -18.45 14.45 Q -18.45 14.35 -18.3 13.75 Q -18.1 12.95 -17.9 12.85 T -16.75 12.7 Q -15.4 12.7 -13.75 12.55 Q -13.05 12.4 -12.8 11.95 Q -12.7 11.7 -9.25 -2.1 T -5.75 -16.1 Q -5.75 -16.45 -5.95 -16.45 Q -6.35 -16.6 -8.6 -16.7 H -10.15 Q -10.45 -17 -10.45 -17.1 T -10.35 -17.95 Q -10.15 -18.8 -9.85 -19 H 17.85 Q 18.2 -18.8 18.2 -18.45 Q 18.2 -18.2 17.55 -12.85 T 16.85 -7.35 Q 16.75 -7 15.85 -7 H 15.25 Q 14.9 -7.25 14.9 -7.65 L 15.05 -8.8 Q 15.2 -10 15.2 -11.4 Q 15.2 -12.9 14.85 -13.9 T 13.9 -15.45 T 12.15 -16.25 T 9.8 -16.6 T 6.6 -16.7 H 4.25 Q -0.15 -16.65 -0.4 -16.55 Q -0.6 -16.45 -0.7 -16.1 Q -0.75 -15.95 -2.25 -9.95 T -3.8 -3.85 Q -2.65 -3.8 -1.4 -3.8 H -0.1 Q 3.2 -3.8 4.45 -4.55 T 6.7 -8.6 Q 6.9 -9.4 7 -9.5 T 7.85 -9.65 Q 8.1 -9.65 8.25 -9.65 T 8.5 -9.6 T 8.6 -9.55 T 8.7 -9.35 T 8.85 -9.15 L 7.2 -2.55 Q 5.55 4.1 5.4 4.2 Q 5.25 4.35 4.6 4.35 Z"),
  t: new Path2D("M -10.44 -5.01 Q -10.9 -5.47 -10.9 -5.67 Q -10.9 -5.93 -10.71 -6.72 T -10.38 -7.63 Q -10.25 -7.96 -9.79 -7.96 T -6.44 -8.03 H -2.96 L -1.72 -13.28 Q -1.52 -14 -1.26 -15.18 T -0.8 -16.89 T -0.41 -18.2 T 0.12 -19.31 T 0.78 -20.1 T 1.69 -20.69 T 2.88 -20.82 Q 4.06 -20.76 4.51 -20.1 T 4.97 -18.85 Q 4.97 -18.39 4.38 -15.77 T 3.07 -10.59 L 2.42 -8.16 Q 2.42 -8.03 5.7 -8.03 H 9.04 Q 9.5 -7.57 9.5 -7.31 Q 9.5 -5.86 8.65 -5.01 H 1.63 L -0.73 4.5 Q -3.29 15 -3.29 15.79 Q -3.29 18.54 -1.52 18.54 Q 0.78 18.54 2.94 16.31 T 6.42 10.8 Q 6.55 10.41 6.75 10.34 T 7.73 10.21 H 7.99 Q 8.98 10.21 8.98 10.74 Q 8.98 10.93 8.78 11.52 Q 8.45 12.57 7.6 14.02 T 5.37 17.1 T 2.02 19.86 T -1.98 20.97 Q -3.95 20.97 -5.72 19.99 T -8.28 16.58 Q -8.41 16.05 -8.41 14.8 V 13.62 L -6.11 4.44 Q -3.82 -4.81 -3.75 -4.88 Q -3.75 -5.01 -7.1 -5.01 H -10.44 Z")
}

energyPlot.drawGrid = function(){
  this.ctx.save();
  let innerCorners = this.innerCorners;
  this.ctx.moveTo(...innerCorners[0]);
  for (var i = 1; i < 4; ++i){
    this.ctx.lineTo(...innerCorners[i]);
  }
  this.ctx.lineTo(...innerCorners[0]);
  this.ctx.clip();

  let nxGrids = 9;
  let dx = this.width/(nxGrids-1);
  let excess = (this.transformationParams.x0*this.transformationParams.pix_to_coord_ratio_x) % dx;
  this.ctx.strokeStyle = "gray";
  this.ctx.lineWidth = 3;
  // this.ctx.beginPath();
  for (i = 0; i < nxGrids; ++i){
    this.ctx.moveTo(i*dx - excess, 0);
    this.ctx.lineTo(i*dx - excess, this.height);
  };

  //Now the y grids
  let nyGrids = 7;
  let dy = this.height/(nyGrids-1);
  excess = (this.transformationParams.y0*this.transformationParams.pix_to_coord_ratio_y) % dy;
  for (i = 0; i < nyGrids; ++i){
    this.ctx.moveTo(0, this.height - (i*dy - excess));
    this.ctx.lineTo(this.width, this.height - (i*dy - excess));
  };
  this.ctx.stroke();
  this.ctx.restore();
}

energyPlot.drawAxis = function(){
  //First the spines
  let tside = this.width/100; //Side length of the triangle tip
  let x0 = this.innerCorners[0][0];
  let y0 = this.innerCorners[0][1];
  let x1 = this.innerCorners[3][0];
  let y1 = this.innerCorners[1][1];
  this.ctx.fillStyle = "white";
  this.ctx.strokeStyle = "white";
  this.ctx.lineWidth = 2;

  //y
  this.ctx.beginPath();
  this.ctx.moveTo(x0, y0);
  this.ctx.lineTo(...this.innerCorners[1]);
  this.ctx.lineTo(x0+tside, y1);
  this.ctx.lineTo(x0, y1-2*tside);
  this.ctx.lineTo(x0-tside, y1);
  this.ctx.lineTo(x0, y1);
  this.ctx.closePath();
  this.ctx.stroke();
  this.ctx.fill();

  //x
  this.ctx.beginPath();
  this.ctx.moveTo(x0, y0);
  this.ctx.lineTo(...this.innerCorners[3]);
  this.ctx.lineTo(x1, y0-tside);
  this.ctx.lineTo(x1+2*tside, y0);
  this.ctx.lineTo(x1, y0+tside);
  this.ctx.lineTo(x1, y0);
  this.ctx.closePath();
  this.ctx.stroke();
  this.ctx.fill();

  //Now the fancy text
  this.ctx.translate(x0/2, y0/2);
  this.ctx.fill(this.fancyText.E);
  this.ctx.translate(-x0/2, -y0/2);

  //More fancy text
  this.ctx.translate(x1/2, y0*1.05);
  this.ctx.fill(this.fancyText.t);
  this.ctx.translate(-x1/2, -y0*1.05);
}

energyPlot.clear = function(){
  this.ctx.clearRect(0, 0, this.width, this.height);
};
// energyPlot.drawGrid();
// energyPlot.drawAxis();

energyPlot.maxEnergy = 1/2*spring.k*(block.cx**2+block.cy**2)+1/2*block.mass*(block.vx**2+block.vy**2);
//The above will be used for setting appropriate limits. Every time one changes the position of th block. The limits will be readjusted
function handleMouseUp(e){
  handleSelection(e);
  if (block.beingDragged){
    block.stopDragging(e);
    block.unselect();
    block.deactivate();
  }
  energyPlot.maxEnergy = 1/2*spring.k*(block.cx**2+block.cy**2)+1/2*block.mass*(block.vx**2+block.vy**2);
}
canvas.addEventListener("mouseup", handleMouseUp)


//Now we overide run to add dropdown functionality
function run(){
  ctx.clearRect(0, 0, canvas.width, canvas.height); //Clearing the drawing area
  energyPlot.clear();
  if (running){
    objects.update(1000); //Let time pass while physics are applied to the system
    energyPlot.updateLims(t-5, t+2, -energyPlot.maxEnergy, 2*energyPlot.maxEnergy);
    energyPlot.addPoint(0, [t, 1/2*block.mass*(block.vx**2+block.vy**2)]);
    energyPlot.addPoint(1, [t, 1/2*spring.k*(block.cx**2+block.cy**2)]);
  };
  objects.draw(); //Rendering all the objects. Later there will be "if" clauses that lets one select what gets rendered

  //Rendering the plots
  energyPlot.drawGrid();
  energyPlot.drawAxis();
  energyPlot.updateTransformedPoints();
  energyPlot.drawPoints(clip=true);
  requestAnimationFrame(run);//Needed for "infinite" animation
}
run();
