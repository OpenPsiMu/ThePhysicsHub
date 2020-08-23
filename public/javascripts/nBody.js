/*Simulation is still incomplete. Any questions? Ask Pedro*/
let t = 0;
let dt = 1 / 1960;
let H = 500;
let scalingFactor = 2;
let speed = 10;
let canvas, arena, b1, b2, running = true,
  lockedBall, trailRenderer, trailContext;
let i1r4checkboxCont; //FUSION OF BALLS
let i1r5checkboxCont; //Collision with walls


function setup() {
  canvas = createCanvas(H, H);
  canvas.transX = 0;
  canvas.transY = 0;
  canvas.secretX = canvas.transX;
  canvas.secretY = canvas.transY;
  let mouseWheelOriginal = mouseWheel;
  canvas.elt.onmouseenter = () => {
    document.body.style.overflow = "hidden";
    mouseWheel = mouseWheelOriginal;
  };
  canvas.elt.onmouseleave = () => {
    document.body.style.overflow = "auto";
    mouseWheel = () => {
      null
    };
  };
  canvas.isMouseOver = true;
  canvas.parent("simwrapper");
  trailRenderer = createGraphics(H, H);
  trailContext = trailRenderer.elt.getContext("2d");

  arena = createGraphics(H, H);
  pixelDensity(2);
  trailRenderer.pixelDensity(2);
  arena.pixelDensity(2);

  for (let i = 0; i < 6; i++) {
    someBall = new body(arena);
    someBall.x = random(20, 380);
    someBall.y = random(20, 380);
    someBall.vx = random(-2, 2);
    someBall.vy = random(-2, 2);
    someBall.r = random(5, 25);
    someBall.m = someBall.r;
    someBall.speed = sqrt(someBall.vx ** 2 + someBall.vy ** 2);
    let r = random(0, 255);
    let g = random(0, 255);
    let b = random(0, 255);
    someBall.fillColor = "rgb(" + r + "," + g + "," + b + ")";
    someBall.fillColorArr = [r, g, b];
    someBall.trailContext = trailContext;
    someBall.trailRenderer = trailRenderer;
  };

  /*Time to make the dropdown*/
  let dd = makeDropdown(canvas);
  dd.parentElement.parentElement.onmouseenter = () => {
    canvas.isMouseOver = false;
    mouseWheel = () => {
      null
    };
    if (lockedBall == undefined) {
      return null;
    };
    let b = lockedBall;
    i2r1sliderCont.slider.value = Number(b.vx);
    i2r2sliderCont.slider.value = Number(b.vy);
    i2r3sliderCont.slider.value = Number(b.m);
    i2r4sliderCont.slider.value = Number(b.r);
    slContainerRed.slider.value = Number(b.fillColorArr[0]);
    slContainerGreen.slider.value = Number(b.fillColorArr[1]);
    slContainerBlue.slider.value = Number(b.fillColorArr[2]);

    for (let slC of [i2r1sliderCont, i2r2sliderCont, i2r3sliderCont, i2r4sliderCont, slContainerRed, slContainerGreen, slContainerBlue]) {
      slC.setValueLabel(String(slC.slider.value));
    };
  };
  dd.parentElement.parentElement.onmouseleave = () => {
    canvas.isMouseOver = true;
    mouseWheel = mouseWheelOriginal;
  };
  dd.setLabel("Options");
  setPedroStyle(canvas);

  let i1 = makeItem(dd); //Global Parameters
  let i2 = makeItem(dd); //Obj Parameters
  let i3 = makeItem(dd); //Display
  let i4 = makeItem(dd); //Commands
  i1.setLabel("Global parameters");
  i2.setLabel("Selected object parameters");
  i3.setLabel("Display");
  i4.setLabel("Commands");

  let i1r1 = makeRow(i1); //G
  let i1r2 = makeRow(i1); //speed
  let i1r3 = makeRow(i1); //damping
  let i1r4 = makeRow(i1); //Ellastic collision
  let i1r5 = makeRow(i1); //Collide with walls

  let i2r1 = makeRow(i2); //vx
  let i2r2 = makeRow(i2); //vy
  let i2r3 = makeRow(i2); //m
  let i2r4 = makeRow(i2); //r
  let i2r5 = makeRow(i2); //Show velocity
  let i2r6 = makeRow(i2); //Show net force
  let i2r7 = makeRow(i2); //color

  let i3r1 = makeRow(i3); //Ek
  let i3r2 = makeRow(i3); //Ep total
  let i3r3 = makeRow(i3); //Velocity arrows and Force
  let i3r4 = makeRow(i3); //Velocity arrows and Force

  let i4r1 = makeRow(i4); //BUttons
  let i4r2 = makeRow(i4); //Add mode
  let i4r3 = makeRow(i4); //Delete mode

  //Now we start with i1
  i1r1sliderCont = makeSlider(i1r1); //G
  i1r2sliderCont = makeSlider(i1r2); //Sim speed
  i1r3sliderCont = makeSlider(i1r3); //Damping
  i1r1sliderCont.setTitleLabel("G");
  i1r2sliderCont.setTitleLabel("Speed");
  i1r3sliderCont.setTitleLabel("Damping");
  i1r1sliderCont.setParameters(6000, 0, 1, 2000);
  i1r2sliderCont.setParameters(100, 1, 1, 10);
  i1r3sliderCont.setParameters(1, 0, 0.01, 0.0);
  i1r1sliderCont.slider.oninput = () => {
    if (lockedBall = undefined) {
      return null;
    };
    body.prototype.G = Number(i1r1sliderCont.slider.value);
    i1r1sliderCont.setValueLabel(String(i1r1sliderCont.slider.value));
  };
  i1r2sliderCont.slider.oninput = () => {
    if (lockedBall = undefined) {
      return null;
    };
    speed = Number(i1r2sliderCont.slider.value);
    i1r2sliderCont.setValueLabel(String(i1r2sliderCont.slider.value));
  };
  i1r3sliderCont.slider.oninput = () => {
    if (lockedBall = undefined) {
      return null;
    };
    let d = Number(i1r3sliderCont.slider.value);
    for (let b of body.prototype.bodyArray) {
      b.damping = b.bodyDamping = 1 - d;
    };
    i1r3sliderCont.setValueLabel(String(d));
  };
  i1r4checkboxCont = makeCheckbox(i1r4); //Ellastic colli
  i1r5checkboxCont = makeCheckbox(i1r5); //Coli ith walls
  i1r4checkboxCont.setLabel("Allow fusion");
  i1r5checkboxCont.setLabel("Bounce on walls");
  i1r5checkboxCont.checkbox.checked = true;


  //Time for i2
  i2r1sliderCont = makeSlider(i2r1); //vx
  i2r1sliderCont.setTitleLabel("vx");
  i2r1sliderCont.setParameters(40, -40, .1, 0);
  i2r2sliderCont = makeSlider(i2r2); //vy
  i2r2sliderCont.setTitleLabel("vy");
  i2r2sliderCont.setParameters(40, -40, .1, 0);
  i2r3sliderCont = makeSlider(i2r3); //m
  i2r3sliderCont.setTitleLabel("Relative mass");
  i2r3sliderCont.setParameters(200, 1, .1, 0);
  i2r4sliderCont = makeSlider(i2r4); //r
  i2r4sliderCont.setTitleLabel("Relative radius");
  i2r4sliderCont.setParameters(100, 1, .1, 0);
  let applyFunc = (sliderCont, tag, func) => {
    sliderCont.slider.oninput = () => {
      let val = String(sliderCont.slider.value);
      sliderCont.setValueLabel(val);
      if (lockedBall == undefined) {
        return null; //Stops execution!!!
      };
      func(val, tag);
    };
  };
  let vFunc = (val, tag) => {
    let b = lockedBall;
    b[tag] = Number(val);
    b.speed = sqrt(b.vx ** 2 + b.vy ** 2);
  };
  let mrFunc = (val, tag) => {
    let b = lockedBall;
    b[tag] = Number(val);
  };

  applyFunc(i2r1sliderCont, "vx", vFunc);
  applyFunc(i2r2sliderCont, "vy", vFunc);
  applyFunc(i2r3sliderCont, "m", mrFunc);
  applyFunc(i2r4sliderCont, "r", mrFunc);

  //Time for arrows
  let i2r5checkBoxCont = makeCheckbox(i2r5); //Vel vect
  let i2r6checkBoxCont = makeCheckbox(i2r6); //F vector
  i2r5checkBoxCont.setLabel("Show velocity");
  i2r6checkBoxCont.setLabel("Show net force");
  let checkV = i2r5checkBoxCont.checkbox;
  checkV.onclick = () => {
    if (lockedBall == undefined) {
      return null;
    };
    if (checkV.checked) {
      lockedBall.showV = true;
    } else {
      lockedBall.showV = false;
    };
  };
  let checkF = i2r6checkBoxCont.checkbox;
  checkF.onclick = () => {
    if (lockedBall == undefined) {
      return null;
    };
    if (checkF.checked) {
      lockedBall.showF = true;
    } else {
      lockedBall.showF = false;
    };
  };

  //Adding support to choose colors
  let i2r7i1 = makeItem(i2r7); //Where colors will be
  i2r7i1.setLabel("Colors");
  let i2r7i1r1 = makeRow(i2r7i1); //red
  let i2r7i1r2 = makeRow(i2r7i1); //green
  let i2r7i1r3 = makeRow(i2r7i1); //blue

  let slContainerRed = makeSlider(i2r7i1r1); //Red
  let slContainerGreen = makeSlider(i2r7i1r2); //Green
  let slContainerBlue = makeSlider(i2r7i1r3); //Blue
  slContainerRed.setTitleLabel("Red");
  slContainerGreen.setTitleLabel("Green");
  slContainerBlue.setTitleLabel("Blue");
  let colorChange = () => {
    if (lockedBall == undefined) {
      return null;
    };
    let r = slContainerRed.slider.value;
    let g = slContainerGreen.slider.value;
    let b = slContainerBlue.slider.value;
    let c = "rgb(" + r + "," + g + "," + b + ")";
    lockedBall.fillColor = c;
    lockedBall.fillColorArr = [r, g, b];
  };

  for (let slC of [slContainerRed, slContainerGreen, slContainerBlue]) {
    slC.setParameters(255, 0, 1, 100);
    let slider = slC.slider;
    slider.oninput = () => {
      colorChange();
      slC.setValueLabel(String(slider.value));
    };
  };



  //Now lets go into display
  let i3r1checkBoxCont = makeCheckbox(i3r1); //Ek
  let i3r2checkBoxCont = makeCheckbox(i3r2); //ep
  i3r1checkBoxCont.setLabel("Show kinetic energy");
  i3r2checkBoxCont.setLabel("Show potential energy");
  i3r1checkBoxCont.checkbox.disabled = true;
  i3r2checkBoxCont.checkbox.disabled = true;
  let i3r3buttonCont = new buttonContainer(i3r3);
  let i3r4buttonCont = new buttonContainer(i3r4);
  let showVButton = i3r3buttonCont.makeButton("Show ALL velocities", () => {
    for (b of body.prototype.bodyArray) {
      b.showV = true;
    };
  });
  let hideVButton = i3r4buttonCont.makeButton("Hide ALL velocities", () => {
    for (b of body.prototype.bodyArray) {
      b.showV = false;
    };
  });
  let showFButton = i3r3buttonCont.makeButton("Show ALL forces", () => {
    for (b of body.prototype.bodyArray) {
      b.showF = true;
    };
  });
  let hideFButton = i3r4buttonCont.makeButton("Hide ALL forces", () => {
    for (let b of body.prototype.bodyArray) {
      b.showF = false;
    };
  });

  //Now we go to the commands section
  //Pause play; clear vanvas, replay, deleter, adders
  let butCont = new buttonContainer(i4r1);
  let deleterCont = makeCheckbox(i4r2);
  let adderCont = makeCheckbox(i4r3);

  let playButon = butCont.makeButton("Play", () => {
    running = true;
  });
  let pauseButon = butCont.makeButton("Pause", () => {
    running = false;
  });
  let clearButon = butCont.makeButton("Clear", () => {
    trailRenderer.clear();
  });
  let replayButon = butCont.makeButton("Replay", () => {
    body.prototype.bodyArray = [];
    alert("NEED FUNCITON FOR REPLAY BUTTON AND ENERGIES");
  });
  deleterCont.setLabel("Deleter mode");
  adderCont.setLabel("Add mode");

  deleterCont.checkbox.onclick = () => {
    if (adderCont.checkbox.checked) {
      adderCont.checkbox.checked = false;
      // let i = body.prototype.bodyArray.length-1;
      // body.prototype.bodyArray.splice(i, 1);
    };
    if (deleterCont.checkbox.checked) {
      mousePressed = mousePressedDelete;
    } else {
      mousePressed = mousePressedOriginal
    };
  };

  adderCont.checkbox.onclick = () => {
    if (deleterCont.checkbox.checked) {
      deleterCont.checkbox.checked = false;
    };
    if (adderCont.checkbox.checked) {
      mousePressed = mousePressedAdd;
    } else {
      mousePressed = mousePressedOriginal;
      // let i = body.prototype.bodyArray.length-1;
      // body.prototype.bodyArray.splice(i, 1);
    };
  };

  /*Here ends the dropdown*/

};

function draw() {
  background(0);
  arena.clear();
  canvas.translate(canvas.transX, canvas.transY);
  let dx = canvas.transX/scalingFactor*2;
  let dy = canvas.transY/scalingFactor*2;
  arena.translate(dx, dy);
  trailRenderer.translate(dx, dy);
  if (running) {
    for (let i = 0; i <= speed; i++) {
      body.prototype.applyGAcc();
      body.prototype.move(dt);
      if (i1r5checkboxCont.checkbox.checked) {
        body.prototype.borderCollision();
      };
      body.prototype.drawTrail();
    };
  } else {
    for (b of body.prototype.bodyArray) {
      b.fx = b.fy = b.accX = b.accY = 0;
    };
    body.prototype.applyGAcc();
  };
  body.prototype.fadeTrail();
  body.prototype.draw();
  image(trailRenderer, -canvas.transX, -canvas.transY);
  drawGrid(canvas);
  image(arena, -canvas.transX, -canvas.transY);
  arena.translate(-dx, -dy);
  trailRenderer.translate(-dx, -dy);
};

function mouseWheel(event) {
  let previousScalingFactor = scalingFactor;
  if ((scalingFactor >= .3)&&(scalingFactor <= 4)) {
    scalingFactor += event.delta / 1000;
  } else if (scalingFactor <= .3){
    scalingFactor = .3;
  } else {scalingFactor = 4;};
  arena.elt.getContext("2d").setTransform(scalingFactor, 0, 0, scalingFactor, 0, 0);
  canvas.elt.getContext("2d").setTransform(2, 0, 0, 2, 0, 0);

  let s = H / previousScalingFactor * 2;
  trailContext.setTransform(scalingFactor, 0, 0, scalingFactor, 0, 0);
  let dummyCanvas = document.createElement("canvas");
dummyCanvas.height = dummyCanvas.width = H;
  dummyCanvas.getContext("2d").clearRect(0, 0, dummyCanvas.width, dummyCanvas.height);
  dummyCanvas.getContext("2d").drawImage(trailRenderer.elt, 0, 0, dummyCanvas.width, dummyCanvas.height);
  trailRenderer.clear();
  trailContext.drawImage(dummyCanvas, 0, 0, s, s);
  delete dummyCanvas;
};

function mousePressed() {
  if (!canvas.isMouseOver) {
    return null
  };
  lockedBall = undefined;
  canvas.initX = mouseX;
  canvas.initY = mouseY;
  canvas.secretX = canvas.transX;
  canvas.secretY = canvas.transY;
  mouseX /= scalingFactor / 2;
  mouseY /= scalingFactor / 2;
  mouseX -= canvas.secretX*2/scalingFactor;
  mouseY -= canvas.secretY*2/scalingFactor;
  for (ball of body.prototype.bodyArray) {
    if (sqrt((mouseX - ball.x) ** 2 + (mouseY - ball.y) ** 2) <
      ball.r) {
      lockedBall = ball;
      focusedBall = ball;
      ball.lineColor = 'lightgray';
      ball.initvx = ball.vx;
      ball.initvy = ball.vy;
      ball.initX = ball.x;
      ball.initY = ball.y;
      ball.initMouseX = mouseX;
      ball.initMouseY = mouseY;
      break;
    };
  };
};

var mousePressedOriginal = mousePressed;

function mousePressedDelete() {
  if (!canvas.isMouseOver) {
    return null
  };
  lockedBall = undefined;
  canvas.initX = mouseX;
  canvas.initY = mouseY;
  canvas.secretX = canvas.transX;
  canvas.secretY = canvas.transY;
  mouseX /= scalingFactor / 2;
  mouseY /= scalingFactor / 2;
  mouseX -= canvas.secretX*2/scalingFactor;
  mouseY -= canvas.secretY*2/scalingFactor;
  for (ball of body.prototype.bodyArray) {
    if (sqrt((mouseX - ball.x) ** 2 + (mouseY - ball.y) ** 2) < ball.r) {
      let index = body.prototype.bodyArray.indexOf(ball);
      body.prototype.bodyArray.splice(index, 1);
    };
  };
};

function mousePressedAdd() {
  if (!canvas.isMouseOver) {
    return null
  };
  canvas.initX = mouseX;
  canvas.initY = mouseY;
  canvas.secretX = canvas.transX;
  canvas.secretY = canvas.transY;
  mouseX /= scalingFactor / 2;
  mouseY /= scalingFactor / 2;
  mouseX -= canvas.secretX*2/scalingFactor;
  mouseY -= canvas.secretY*2/scalingFactor;
  for (ball of body.prototype.bodyArray) {
    if (sqrt((mouseX - ball.x) ** 2 + (mouseY - ball.y) ** 2) <
      ball.r) {
      lockedBall = ball;
      focusedBall = ball;
      ball.lineColor = 'lightgray';
      ball.initvx = ball.vx;
      ball.initvy = ball.vy;
      ball.initX = ball.x;
      ball.initY = ball.y;
      ball.initMouseX = mouseX;
      ball.initMouseY = mouseY;
      break;
    } else {lockedBall = undefined};
  };
  if (lockedBall==undefined){
    let ball = new body(arena);
    ball.x = mouseX;
    ball.y = mouseY;
    ball.trailContext = trailContext;
    ball.trailRenderer = trailRenderer;
  };
};

function mouseDragged() {
  if (!canvas.isMouseOver) {
    return null
  };
  if (lockedBall != undefined) {
    let ball = lockedBall;
    mouseX /= scalingFactor / 2;
    mouseY /= scalingFactor / 2;
    mouseX -= canvas.secretX*2/scalingFactor;
    mouseY -= canvas.secretY*2/scalingFactor;
    ball.lastX = ball.x;
    ball.lastY = ball.y;
    ball.vx = ball.vy = 0;
    ball.x = mouseX + ball.initX - ball.initMouseX;
    ball.y = mouseY + ball.initY - ball.initMouseY;
    ball.trailContext.translate(canvas.transX*2/scalingFactor, canvas.transY*2/scalingFactor);
    ball.drawTrail();
    ball.trailContext.translate(-canvas.transX*2/scalingFactor, -canvas.transY*2/scalingFactor);
  } else {
    canvas.transX = canvas.secretX + mouseX - canvas.initX;
    canvas.transY = canvas.secretY + mouseY - canvas.initY;
  };
};

function mouseReleased() {
  if (!canvas.isMouseOver) {
    return null;
  };
  if (lockedBall != undefined) {
    lockedBall.vx = lockedBall.initvx;
    lockedBall.vy = lockedBall.initvy;
  };
  for (ball of body.prototype.bodyArray) {
    ball.lineColor = (ball != lockedBall) ? "white" : "cornflowerblue";
  };
  canvas.secretX = canvas.transX;
  canvas.secretY = canvas.transY;
};


function drawGrid(renderer) {
  let h = renderer.height;
  let w = renderer.width;
  let s = 50 * scalingFactor/2;
  let n = (h / s).toFixed(0);
  let dh = s; //h / (n + 1);
  let dw = s; //w / (n + 1);
  let rendererContext = renderer.elt.getContext("2d");

  rendererContext.strokeStyle = "rgba(200, 200, 200, .4)";
  rendererContext.lineWidth = 2;
  let transX = -s*((renderer.transX/s).toFixed(0));
  let transY = -s*((renderer.transY/s).toFixed(0));
  rendererContext.translate(transX, transY);
  for (let i = 0; i <=n; i++) {
    rendererContext.moveTo(-s*2, i * dh);
    rendererContext.lineTo(w+s*2, i * dh);
  };
  for (let i = 0; i <=n; i++) {
    rendererContext.moveTo(i * dw, -s*2);
    rendererContext.lineTo(i * dw, h+s*2);
  };
  rendererContext.translate(-transX, -transY);
  rendererContext.translate(-canvas.transX, -canvas.transY);
  rendererContext.stroke();
  rendererContext.beginPath();
  rendererContext.closePath();

  rendererContext.moveTo(0, 0);
  rendererContext.lineTo(0, h);
  rendererContext.lineTo(w, h);
  rendererContext.lineTo(w, 0);
  rendererContext.lineTo(0, 0);
  rendererContext.strokeStyle = "white";
  rendererContext.lineWidth = 5;
  rendererContext.stroke();
  rendererContext.translate(canvas.transX, canvas.transY);
};

function body(renderer, radius = 1, mass = 10, fillColor = "yellow", lineWidth =
  2, lineColor = "white") {
  //Other bodies
  if (body.prototype.bodyArray == undefined) {
    body.prototype.bodyArray = [];
  };

  this.bodyArray = body.prototype.bodyArray;
  this.bodyArray.push(this);

  //body params
  this.x = 0;
  this.lastX = 0;
  this.y = 0;
  this.lastY = 0;
  this.vx = 0;
  this.vy = 0;
  this.speed = 0;
  this.m = mass;
  this.r = radius * 10; //10 px per meter
  this.ek = 0; //Kinetic energy
  this.lastEk = 0;
  this.ep = 0;
  this.accX = 0;
  this.accY = 0;
  this.fx = 0;
  this.fy = 0;
  this.lastEp = 0;
  this.damping = 1; //walls
  this.bodyDamping = 1; //other bodies

  //html context
  this.renderer = renderer;
  this.context = renderer.elt.getContext("2d");

  //rendering
  this.fillColor = fillColor;
  this.fillColorArr = [255, 255, 0];
  this.lineWidth = lineWidth;
  this.lineColor = lineColor;
  this.showV = true;
  this.showF = true;

  //flag
  this.isColliding = false;

  body.prototype.G = 2000;


  /*Section where all body functions are defined below*/
  body.prototype.draw = (velocityArrow = true, forceArrow = true) => {
    for (BODY of body.prototype.bodyArray) {
      BODY.draw();
      if (BODY.showV) {
        BODY.displayVelocityArrow()
      };
      if (BODY.showF) {
        BODY.displayForceArrow()
      };
    };
  };
  body.prototype.move = (dt, fx, fy) => {
    for (BODY of body.prototype.bodyArray) {
      BODY.move(dt, fx, fy);
    };
  };
  body.prototype.borderCollision = () => {
    for (BODY of body.prototype.bodyArray) {
      BODY.borderCollision();
    };
  };

  body.prototype.drawTrail = () => {
    for (BODY of body.prototype.bodyArray) {
      BODY.drawTrail();
    };
  };

  body.prototype.fadeTrail = () => {
    if (body.prototype.trailContext == undefined) {
      body.prototype.trailContext = body.prototype.bodyArray[0].trailContext;
      body.prototype.fadeTrail = () => {
        body.prototype.trailContext.fillStyle = "rgba(0, 0, 0, .04)";
        let sx2 = canvas.width/scalingFactor*2;
        let sy2 = canvas.height/scalingFactor*2;
        let sx = canvas.transX/scalingFactor*2;
        let sy = canvas.transY/scalingFactor*2;
        body.prototype.trailContext.fillRect(-sx, -sy, sx2, sy2);
      };
    };
    body.prototype.trailContext.fillStyle = "rgba(0, 0, 0, .02)";
    let s = H / scalingFactor * 2;
    body.prototype.trailContext.fillRect(0, 0, s, s);
  };

  body.prototype.applyGAcc = () => {
    //LETS every object affect every object
    if (body.prototype.bodyArray.length < 2) {
      for (let BODY of body.prototype.bodyArray) {
        BODY.fx = 0;
        BODY.fy = 0;
        BODY.ax = 0;
        BODY.ay = 0;
      };
      return null;
    };
    for (let i = 0; i < this.bodyArray.length; i++) {
      for (let j = i + 1; j < this.bodyArray.length; j++) {
        let b1 = this.bodyArray[i]; //Body1
        let b2 = this.bodyArray[j]; //Body2
        let rx = b2.x - b1.x;
        let ry = b2.y - b1.y;
        let dist = sqrt(rx ** 2 + ry ** 2);
        if (dist < b1.r + b2.r) {
          if (i1r4checkboxCont.checkbox.checked) {
            body.prototype.detectUnionBetween(b1, b2);
          }; //Checks if they need to fuse
          let x12 = b2.x - b1.x;
          let y12 = b2.y - b1.y;
          let distp2 = x12 ** 2 + y12 ** 2; //Distance power 2
          if ((b1.x != undefined) && (b2.x != undefined)) {
            //If the balls intersect
            //get other vectors
            let x21 = -x12;
            let y21 = -y12;
            let vx12 = b2.vx - b1.vx;
            let vy12 = b2.vy - b1.vy;
            let vx21 = -vx12;
            let vy21 = -vy12;
            let dotv12_12 = vx12 * x12 + vy12 * y12;
            let dotv21_21 = vx21 * x21 + vy21 * y21;
            let M = b1.m + b2.m;
            let u1x, u1y, u2x, u2y; //New v placeholders

            //Calculating normal unit vector
            let nx = x12 / dist;
            let ny = y12 / dist;

            //Calculating perp unit vector
            // let px = ny;
            // let py = -nx;

            //Make sure they are no longer touching
            b1.x = b2.x - nx * (b1.r + b2.r);
            b1.y = b2.y - ny * (b1.r + b2.r);
            // b2.x = b1.x + nx * (b1.r + b2.r);
            // b2.y = b1.y + ny * (b1.r + b2.r);

            //calculating new velocities
            u1x = b1.vx - 2 * b2.m / M * dotv21_21 / distp2 * x21;
            u1y = b1.vy - 2 * b2.m / M * dotv21_21 / distp2 * y21;

            u2x = b2.vx - 2 * b1.m / M * dotv12_12 / distp2 * x12;
            u2y = b2.vy - 2 * b1.m / M * dotv21_21 / distp2 * y12;


            b1.vx = u1x * b1.bodyDamping;
            b1.vy = u1y * b1.bodyDamping;
            b2.vx = u2x * b2.bodyDamping;
            b2.vy = u2y * b2.bodyDamping;
          } else {
            continue;
          };
        };
        let G = body.prototype.G;
        let ax = G * rx / (dist ** 3);
        let ay = G * ry / (dist ** 3);
        b1.accX += b2.m * ax;
        b1.accY += b2.m * ay;

        b2.accX -= b1.m * ax;
        b2.accY -= b1.m * ay;

        b1.fx = b1.accX * b1.m;
        b1.fy = b1.accY * b1.m;

        b2.fx = b2.accX * b2.m;
        b2.fy = b2.accY * b2.m;
      };
    };
  };

  body.prototype.detectUnionBetween = (b1, b2) => {
    if ((b1.vx - b2.vx) ** 2 + (b1.vy - b2.vy) ** 2 < 10) {
      let momentumX = b1.m * b1.vx + b2.m * b2.vx;
      let momentumY = b1.m * b1.vy + b2.m * b2.vy;
      let arr = body.prototype.bodyArray;
      let V1 = b1.r ** 3;
      let V2 = b2.r ** 3;
      let VFinal = V1 + V2;
      let rFinal = (VFinal) ** (1 / 2.98);
      let mFinal = b1.m + b2.m;
      if (b1.m >= b2.m) {
        arr.splice(arr.indexOf(b2), 1);
        b1.r = rFinal;
        b1.m = mFinal;
        b1.vx = momentumX / mFinal;
        b1.vy = momentumY / mFinal;
        b2.x = b2.y = b2.r = undefined;
      } else {
        arr.splice(arr.indexOf(b1), 1);
        b2.r = rFinal;
        b2.m = mFinal;
        b2.vx = momentumX / mFinal;
        b2.vy = momentumY / mFinal;
        b1.x = b1.r = b1.y = undefined;
      };
    };
  };

  body.prototype.bodyCollision = () => {
    //Optimizing for lonely bodies
    if (this.bodyArray.length < 2) {
      return null
    };

    //More bodies
    for (let i = 0; i < this.bodyArray.length; i++) {
      for (let j = i + 1; j < this.bodyArray.length; j++) {
        let b1 = this.bodyArray[i]; //Body1
        let b2 = this.bodyArray[j]; //Body2
        let x12 = b2.x - b1.x;
        let y12 = b2.y - b1.y;
        let distp2 = x12 ** 2 + y12 ** 2; //Distance power 2
        let distp1 = sqrt(x12 ** 2 + y12 ** 2); //Distance power 1
        if (distp1 < b1.r + b2.r) {
          //If the balls intersect
          //get other vectors
          let x21 = -x12;
          let y21 = -y12;
          let vx12 = b2.vx - b1.vx;
          let vy12 = b2.vy - b1.vy;
          let vx21 = -vx12;
          let vy21 = -vy12;
          let dotv12_12 = vx12 * x12 + vy12 * y12;
          let dotv21_21 = vx21 * x21 + vy21 * y21;
          let M = b1.m + b2.m;
          let u1x, u1y, u2x, u2y; //New v placeholders

          //Calculating normal unit vector
          let nx = x12 / distp1;
          let ny = y12 / distp1;

          //Calculating perp unit vector
          // let px = ny;
          // let py = -nx;

          //Make sure they are no longer touching
          b1.x = b2.x - nx * (b1.r + b2.r);
          b1.y = b2.y - ny * (b1.r + b2.r);
          b2.x = b1.x + nx * (b1.r + b2.r);
          b2.y = b1.y + ny * (b1.r + b2.r);

          //calculating new velocities
          u1x = b1.vx - 2 * b2.m / M * dotv21_21 / distp2 * x21;
          u1y = b1.vy - 2 * b2.m / M * dotv21_21 / distp2 * y21;

          u2x = b2.vx - 2 * b1.m / M * dotv12_12 / distp2 * x12;
          u2y = b2.vy - 2 * b1.m / M * dotv21_21 / distp2 * y12;


          b1.vx = u1x * b1.bodyDamping;
          b1.vy = u1y * b1.bodyDamping;
          b2.vx = u2x * b2.bodyDamping;
          b2.vy = u2y * b2.bodyDamping;
        };
      };
    };
  };
  body.prototype.ekMax = 0;
  body.prototype.plotEk = (plot) => {
    let ekMax = body.prototype.ekMax;
    for (BODY of body.prototype.bodyArray) {
      (BODY.ek > ekMax) ? body.prototype.ekMax = ekMax = BODY.ek: null;
    };
    plot.setAxLimits([t - 20, t + 10], [0, ekMax + 10]);
    let axesC = plot.axes.context;
    axesC.lineWidth = .7;
    for (BODY of body.prototype.bodyArray) {
      axesC.strokeStyle = BODY.lineColor;
      axesC.fillStyle = BODY.lineColor;
      axesC.fillRect(t, BODY.ek, .5, ekMax / 40);
      axesC.stroke();
      axesC.fill();
    };
    plot.display();
  };



  /*Section where single body functions are defined below*/

  //Calculate  net acc due to other planets
  this.applyGAcc = () => {
    //LETS EVERY OTHER OBJECT AFTER THE CALLER. BUT NOT ONE ANOTHER
    if (body.prototype.bodyArray.length < 2) {
      return null
    };
    for (BODY of body.prototype.bodyArray) {
      let rx = BODY.x - this.x;
      let ry = BODY.y - this.y;
      let dist = sqrt(rx ** 2 + ry ** 2);
      if (dist < this.r + BODY.r) {
        if (this != BODY) {
          this.bodyCollision();
        };
        continue;
      };
      let G = body.prototype.G;
      let ax = G * rx / (dist ** 3);
      let ay = G * ry / (dist ** 3);
      this.accX += BODY.m * ax;
      this.accY += BODY.m * ay;
      BODY.accX -= this.m * ax;
      BODY.accY -= this.m * ay;
    };
  };

  //SHow velocity as an arrow
  this.displayVelocityArrow = () => {
    //Makes an arrow whose length is its speed+tip

    this.context.beginPath();
    this.context.lineWidth = 3;
    this.context.strokeStyle = this.fillColor;
    this.context.translate(this.x, this.y);
    this.context.moveTo(0, 0);
    this.context.lineTo(this.vx, this.vy);
    this.context.stroke();
    this.context.strokeStyle = this.lineColor;
    this.context.lineWidth = 1;
    this.context.lineTo(0, 0);
    this.context.closePath();
    this.context.stroke();
    this.context.beginPath();

    this.context.lineWidth = 2;
    this.context.strokeStyle = this.fillColor;
    this.context.lineTo(this.vx + 3 * this.vy / this.speed, -3 * this.vx /
      this.speed + this.vy);
    this.context.lineTo((this.speed + 6) * this.vx / this.speed, (this.speed +
      6) * this.vy / this.speed);
    this.context.lineTo(this.vx - 3 * this.vy / this.speed, 3 * this.vx /
      this.speed + this.vy);
    this.context.lineTo(this.vx, this.vy);
    this.context.closePath();
    this.context.fillStyle = this.lineColor;
    this.context.stroke();
    this.context.fill();
    this.context.translate(-this.x, -this.y);
  };


  this.displayForceArrow = () => {
    //Makes an arrow whose length is its speed+tip
    this.fMag = (this.fx ** 2 + this.fy ** 2) ** (1 / 2);
    this.fMag *= 0.01;
    let fx = this.fx * .01;
    let fy = this.fy * .01;
    this.context.beginPath();
    this.context.lineWidth = 3;
    this.context.strokeStyle = this.fillColor;
    this.context.translate(this.x, this.y);
    this.context.moveTo(0, 0);
    this.context.lineTo(fx, fy);
    this.context.stroke();
    this.context.strokeStyle = "black";
    this.context.lineWidth = 1;
    this.context.lineTo(0, 0);
    this.context.closePath();
    this.context.stroke();
    this.context.beginPath();

    this.context.lineWidth = 2;
    this.context.strokeStyle = this.fillColor;
    this.context.lineTo(fx + 3 * fy / this.fMag, -3 * fx /
      this.fMag + fy);
    this.context.lineTo((this.fMag + 6) * fx / this.fMag, (this.fMag +
      6) * fy / this.fMag);
    this.context.lineTo(fx - 3 * fy / this.fMag, 3 * fx /
      this.fMag + fy);
    this.context.lineTo(fx, fy);
    this.context.closePath();
    this.context.fillStyle = "black";
    this.context.stroke();
    this.context.fill();

    this.context.translate(-this.x, -this.y);
  };


  //display
  this.draw = () => {
    this.context.fillStyle = this.fillColor;
    this.context.lineWidth = this.lineWidth;
    this.context.strokeStyle = this.lineColor;
    this.context.beginPath();
    this.context.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    this.context.closePath();
    this.context.fill();
    this.context.stroke();
  };

  //Move
  this.move = (dt, fx = 0, fy = 0) => {
    this.lastX = this.x;
    this.lastY = this.y;
    this.vx += (fx / this.m + this.accX) * dt;
    this.vy += (fy / this.m + this.accY) * dt;
    this.accX = 0;
    this.accY = 0;
    this.x += this.vx * dt * 10; //10px per meter
    this.y += this.vy * dt * 10;
    this.speed = sqrt(this.vx ** 2 + this.vy ** 2);
    this.lastEk = this.ek * 1;
    this.ek = 1 / 2 * this.m * this.speed ** 2;
  };

  //Collide with sides of canvas
  this.borderCollision = () => {
    let xlim = this.renderer.width-canvas.transX;
    let ylim = this.renderer.height-canvas.transY;
    let damping = this.damping;
    xlim/=scalingFactor/2;
    ylim/=scalingFactor/2;
    let dx = canvas.transX/scalingFactor*2;
    let dy = canvas.transY/scalingFactor*2;

    if (this.x - this.r < -dx) {
      this.x = this.lastX = this.r-dx;
      this.vx *= -damping;
    } else if (this.x + this.r > xlim) {
      this.x = this.lastX = xlim - this.r;
      this.vx *= -damping;
    };

    if (this.y + this.r > ylim) {
      this.y = this.lastY = ylim - this.r;
      this.vy *= -damping;
    } else if (this.y - this.r < -dy) {
      this.y = this.lastY = this.r-dy;
      this.vy *= -damping
    };
  };

  this.drawTrail = () => {
    if (this.trailRenderer == undefined) {
      return null
    };
    this.trailContext.lineWidth = 2;
    this.trailContext.closePath();
    this.trailContext.globalAlpha = .5;
    this.trailContext.strokeStyle = this.fillColor;
    this.trailContext.beginPath();
    this.trailContext.moveTo(this.lastX, this.lastY);
    this.trailContext.lineTo(this.x, this.y);
    this.trailContext.stroke();
    this.trailContext.closePath();
    this.trailContext.globalAlpha = 1;
  };

  this.bodyCollision = () => {
    //Optimizing for lonely bodies
    if (this.bodyArray.length < 2) {
      return null
    };

    //More bodies
    for (let i = 0; i < this.bodyArray.length; i++) {
      if (this.bodyArray[i] != this) {
        let b1 = this; //Body1
        let b2 = this.bodyArray[i]; //Body2
        let x12 = b2.x - b1.x;
        let y12 = b2.y - b1.y;
        let distp2 = x12 ** 2 + y12 ** 2; //Distance power 2
        let distp1 = sqrt(x12 ** 2 + y12 ** 2); //Distance power 1
        if (distp1 < b1.r + b2.r) {
          //If the balls intersect
          //get other vectors
          let x21 = -x12;
          let y21 = -y12;
          let vx12 = b2.vx - b1.vx;
          let vy12 = b2.vy - b1.vy;
          let vx21 = -vx12;
          let vy21 = -vy12;
          let dotv12_12 = vx12 * x12 + vy12 * y12;
          let dotv21_21 = vx21 * x21 + vy21 * y21;
          let M = b1.m + b2.m;
          let u1x, u1y, u2x, u2y; //New v placeholders

          //Calculating normal unit vector
          let nx = x12 / distp1;
          let ny = y12 / distp1;

          //Calculating perp unit vector
          // let px = ny;
          // let py = -nx;

          //Make sure they are no longer touching
          b1.x = b2.x - nx * (b1.r + b2.r);
          b1.y = b2.y - ny * (b1.r + b2.r);
          b2.x = b1.x + nx * (b1.r + b2.r);
          b2.y = b1.y + ny * (b1.r + b2.r);

          //calculating new velocities
          u1x = b1.vx - 2 * b2.m / M * dotv21_21 / distp2 * x21;
          u1y = b1.vy - 2 * b2.m / M * dotv21_21 / distp2 * y21;

          u2x = b2.vx - 2 * b1.m / M * dotv12_12 / distp2 * x12;
          u2y = b2.vy - 2 * b1.m / M * dotv21_21 / distp2 * y12;


          b1.vx = u1x * b1.bodyDamping;
          b1.vy = u1y * b1.bodyDamping;
          b2.vx = u2x * b2.bodyDamping;
          b2.vy = u2y * b2.bodyDamping;
        };
      };
    };
  };
};

//Time for the dropdown, which will be different from the other simulations
/*This file contains many functions that can be used to
add a wonderful dropdown to a p5 canvas!!!

follows instructions for use:

INSTRUCTION MANUAL FOR DROPDOWN
-------------------------------

1. Creating the dropdown:
	To make the dropdown you must make use of the function makeDropdown();
	This function takes a p5 canvas element as argument.

	makeDropdown(canvas); --> returns html element for placement of items.
	In case the canvas is placed directly on the body of the document, a
	new canvas container will be created!!! This is necessary for technical
	reasons. So MAKE SURE THE CANVAS IS ALREADY IN IT's FINAL CONTAINER before
	using this function!!!!

	Changing the text inside the main dropdown button:
		let dd = makeDropdown(canvas);
		dd.setLabel("Your label");

  After making the dropdown, you can use the function setPedroStyle(canvas);
  this makes it look pretty.


2. Adding items to the dropdown
	To add items to the dropdown, you must make use of the function makeItem();
	This function takes an html dropdown contents container returned by makeDropdown();

	makeItem(makeDropdown(canvas)) --> returns html container for ITEM

	If you wish to change the title inside this item you must do as follows:
		let dd = makeDropdown(canvas);
		let item1 = makeItem(dd);
		item1.setLabel("Your label");

3. Adding rows to dropdown Item
	To add a row to an html item, which lies inside the dropdown,
	you must make use of the function makeRow(), which takes it's parent
	html item as an argument.
	The flow could be seen like this:
		let dd = makeDropdown(canvas);
		let item1 = makeItem(dd);
		let item1Row1 = makeRow(item1);

	This function returns the html element that represents the row inside item.

	To add text to this element simply write:
		item1Row1.setLabel("YORU label")

	To add a widget to this element, use one of the functions pedro will provide.

	As of right now there is only one widget available which is the SLIDER!!!
	To make a slider inside a row element simply use the function makeSlider();
		exmple:
			sliderContainer = makeSlider(rowElement);
	sliderContainer.["label"].innerHTML is the title of your slider
	sliderContainer.['slider'] is your html slider
	sliderContainer.['valueLabel'].innerHTML is the place allocated for showing the current value of the slider

  Also, you can change this tewxt using:
    sliderContainer.setTitleLabel("The text on the left of slider");
    sliderContainer.setValueLabel("The text on the right of slider");
    sliderContainer.slider gives the slider HTML slement;
    sliderContainer.getSlider() also returns the html element;
    sliderContainer.getValueLabel() returns valueLabel html element"text on the right";
    sliderContainer.getTitleLabel() returns the text element in the left of the slider;

4. Making the slider look pretty!
	After making the dropdown, you can use the function setPedroStyle(canvas);
	to add the css styling to the dropdown and make it look and work like a dropdown.


	+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	NOTE: MAKE SURE TO ONLY USE THIS FUNCTION AFTER makeDropdown(canvas) IS USED!
	+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

5. Adding checkboxes to the dropdown:
  it is pretty simple actually, follow the same procedures as the dropdown.

  makeDropdown(row); --> return {"label": label, "checkbox": checkBox};
  let row = makeRow(item);
  let checkboxContainer = createCheckbox(row);
  let checkbox1 = checkboxContainer['checkbox'];
  Change the label with
  checkboxContainer.setLabel("My label");
  Google event's that you can attach to your html checkbox!

6. Adding buttons!!!!

  To add a button it is necessary to create a container designed for buttons!!!!
  To make such a container use new buttonContainer(row);
  where row is a row of an item in a dropdown element!

  To make a button inside the container use:
    let buttonContainer1 = new buttonContainer(row);
    let button1 = buttonContainer1.makeButton(label, func);
    where label is the name inside the button and func is the function performed by the button when it is pressed.
    button1 is an html element so you can do whatever you want with it. Examples below:
      button1.innerHTML= "my title";
      button1.onclick = function (){"do something"};
      button1.style = 'write your own css here';

EXAMPLE OF A SIMPLE DROPDOWN:
	//Creating canvas and dropdown
	let canvas = createCanvas(500, 400);
	let dd = makeDropdown(canvas);

	//Changing the name of dropdown button
	dd.setLabel("LOOK LABEL");

	//Setting style
	setPedroStyle(canvas);

	//Further adding to the dropdown
	let item1 = makeItem(dd);
	let row1 = makeRow(item1);
	let sliderContainer = makeSlider(row1);
	let slider = sliderContainer.['slider'];

	//Using slider as we wish:
	slider.max = 200;
	slider.min = 100;
	slider.step = 0.1;
	slider.value = 150;

    //This step can also be performed using sliderContainer.setParameters(max, min, step, value);
    sliderContainer.setParameters(200, 100, .1, 150);

	slider.oninput = () => {sliderValue.innerHTML = Number(slider.value).toFixed(0)};
	sliderContainer.setValueLabel('NAN')//Updates the text to the new slider value
	sliderContainer.setTitleLabel("TITLE");//Updates the text on the left hand side of the slider.



Additional information:
	if you want to add another dropdown inside a row of an item you can simply
	use makeItem(), and the supply your row as an argument.

	if you wish to delete an element or create an element in run time you can simply
	do so in run time...
	To delete elements, use the `.remove()` method, which removes an html element from
	html. For example:
		let dd = makeDropdown(canvas);
		let item = makeItem(dd);
		let row = makeRow(item);
		let sliderContainer = makeSlider(row);
		sliderContainer.remove();//removes the sliderContainer with slider and labels
		row.remove();//Removes the entire row with its contents;
		item.remove();//REmoves the entire item with its rows;
		dd.remove(); //Removes the entire dropdown :)

	If you wish to add a random html element into a row of the dropdown
	you can follow the same steps I will follow below. In this case
	I will use an html BUTTON as for the example. But this works for any
	html element OTHER THAN A CANVAS!

		let button = document.createElement("button");
		button.innerHTML = "HELLO";
		row = makeRow(item);
		row.appendChild(button);

*/
function makeCheckbox(parent) {
    /*Takes a row object as an argument and returns this object:
    {"label": label, "checkbox": checkBox} where both label and checkbox are html objects*/
    if (arguments.length == 0) {
        parent = document.body;
    };

    //Now since we must have a parent
    let cbContainer = document.createElement("label");
    cbContainer.className += "cbContainer";
    parent.appendChild(cbContainer);

    //now we make labels and checkbox
    let label = document.createElement("span");
    label.innerHTML = "Property";
    cbContainer.appendChild(label);

    let checkBox = document.createElement("input");
    checkBox.setAttribute("type", "checkbox");
    cbContainer.appendChild(checkBox);

    let obj = {
        "label": label,
        "checkbox": checkBox
    };

    obj.setLabel = (newlabel) => {
        label.innerHTML = newlabel;
    };
    obj.getLabel = () => label;
    obj.getCheckbox = () => checkBox;
    return obj;

    obj.remove = () => {
        cbContainer.parentElement.removeChild(cbContainer);
    };
};

function makeRow(parent) {
    //Makes a row in the returned element from makeItem
    let row = document.createElement("li");
    parent.appendChild(row);

    row.setLabel = (label) => {
        row.innerHTML = label;
    };

    return row;
};


function makeItem(parent) {
    /*Takes the dropdown object as an argument and returns
    an item object that can hold row objects in the dropdown.

    To change the label of this object you can use:
    item.parentElement.children[1].innerHTML = "your title" */

    //First make a variabel responsable for naming rows
    if (typeof ddItemCount == "undefined") {
        window.ddItemCount = 0; //It is a global variable
    };

    //This function let's you define rows in a parent.
    //This parent could be the returned element of makeDropdown OR
    //a row from another ITEM.
    let item = document.createElement("div");
    item.className = "item";
    parent.appendChild(item);

    //Differenciates between droped and normal states
    let itemCheck = document.createElement("input");
    itemCheck.type = "checkbox";
    itemCheck.id = "checkbox" + ddItemCount; //Needed for labels
    item.appendChild(itemCheck);

    //Making the label
    let itemCheckLabel = document.createElement("label");
    itemCheckLabel.innerHTML += String(ddItemCount);
    itemCheckLabel.setAttribute("for", "checkbox" + ddItemCount);
    ddItemCount++;
    //Increase itemCount by one!!!
    item.appendChild(itemCheckLabel);


    //Making a container for the rows
    /*THIS IS THE PARENT FOR THE ROWS!!!!!!*/
    let rowContainer = document.createElement("ul");
    item.appendChild(rowContainer);

    rowContainer.setLabel = (label) => {
        itemCheckLabel.innerHTML = label;
    };

    rowContainer.getLabel = () => itemCheckLabel;
    rowContainer.remove = () => {
        rowContainer.parentElement.remove()
    };

    rowContainer.open = () => {
        itemCheck.checked = true;
    };
    rowContainer.close = () => {
        itemCheck.checked = false;
    };

    return rowContainer;
};

function makeDropdown(canvas) {
    /*Takes a canvas object as an argument and returns
    a dropdown element, which can hold item elements from makeItem()

    In order for this funciton to work, it must be used AFTER the canvas
    is placed in its final container.

    To change the name of the dropdown do:
    dropdown.parentElement.children[1].innerHTML = "Your title"*/
    let div = document.createElement("div");

    //Creating a canvas container for easier placement!!!
    let canvasContainer; //Only ysed if canvas is in body
    if (document.body == canvas.elt.parentElement || canvas.elt.parentElement == document.body.getElementsByTagName("main")[0]) {
        canvasContainer = document.createElement("div");
        canvasContainer.id = "VeryUniqueOriginalCanvasContainer";
        document.body.appendChild(canvasContainer);

        canvas.elt.parentNode.removeChild(canvas.elt);
        canvasContainer.appendChild(canvas.elt);
        //Leaving canvas without a parent for the "if" statement
    } else {
        canvasContainer = canvas.elt.parentElement;
    };

    let positionContainer = document.createElement('div');
    positionContainer.id = "SomeCreativeID"; //CSS reasons
    canvasContainer.appendChild(positionContainer);

    //This contains the ENTIRE dropdown.
    let ddContainer = document.createElement('div');
    ddContainer.className = "ddContainer";
    positionContainer.appendChild(ddContainer);

    //Now we make the dropdown Button
    let mainDdButton = document.createElement("input");
    mainDdButton.type = "checkbox";
    mainDdButton.id = "Root";
    ddContainer.appendChild(mainDdButton);

    let mainDdButtonLabel = document.createElement("label");
    mainDdButtonLabel.setAttribute("for", "Root");
    mainDdButtonLabel.style = "font-size: 1.5em; margin-left: 1em;";
    mainDdButtonLabel.innerHTML = "Options";
    ddContainer.appendChild(mainDdButtonLabel);

    //This is the parent elemnt for any "ITEM" elements you make
    let ddContents = document.createElement("div");
    ddContents.className = "dd";
    ddContainer.appendChild(ddContents);

    ddContents.setLabel = (label) => {
        mainDdButtonLabel.innerHTML = label;
    };

    ddContents.getLabel = () => mainDdButtonLabel;
    ddContents.remove = () => {
        ddContents.parentElement.remove();
    };
    ddContents.open = () => {
        mainDdButton.checked = true;
    };
    ddContents.close = () => {
        mainDdButton.checked = false;
    };

    return ddContents; //This is the parent of ITEM!!!
};

function makeSlider(parent, max = 100, min = 0, step = .1, value = 2, title) {
    /*Returns the container that has 3 elements accesible by
    element.children[index]. Where index=0: title,
    index=1: slider, index=2: number;
    This is the returned object:
    {"label": sliderTitle, "slider": slider, "valueLabel": sliderValue}
    */
    if (typeof numberSliders == "undefined") {
        window.numberSliders = 0;
    };
    let sliderContainer = document.createElement("div");
    sliderContainer.classList.add("sliderContainer");
    sliderContainer.id = `slider${numberSliders}`;

    let sliderTitle = document.createElement("span");
    sliderTitle.className = "sliderTitle";
    sliderTitle.innerHTML = "slider" + numberSliders++;
    if (title != undefined) {
        sliderTitle.innerHTML = title;
    };

    let slider = document.createElement("input");
    slider.type = "range";
    slider.class = "slider";

    slider.max = max;
    slider.min = min;
    slider.value = value;
    slider.step = step;

    slider.oninput = () => {
        sliderValue.innerHTML = slider.value;
    };

    let sliderValue = document.createElement("span");
    sliderValue.innerHTML = slider.value;
    sliderValue.className = "rangeValue";

    sliderContainer.appendChild(sliderTitle);
    sliderContainer.appendChild(slider);
    sliderContainer.appendChild(sliderValue);

    parent.appendChild(sliderContainer);


    let obj = {
        "label": sliderTitle,
        "slider": slider,
        "valueLabel": sliderValue
    };

    obj.setTitleLabel = function title(titlelabel) {
        //The label to the left of slider
        this.label.innerHTML = titlelabel;
    };
    obj.setValueLabel = function Valuelabel(newLabel) {
        //Set the new value label to a slider
        this.valueLabel.innerHTML = newLabel;
    };
    obj.getSlider = function getSlider() {
        //Returns the slider contained in the html object
        return this.slider;
    };
    obj.remove = () => {
        sliderContainer.remove();
    };
    //Removes slider

    obj.setParameters = function sliderValues(max = 100, min = 0, step = .1, value = 2) {
        let slider = this.slider;
        slider.max = max;
        slider.min = min;
        slider.step = step, slider.value = value;
        this.valueLabel.innerHTML = String(value);
    };
    obj.getValue = function getValue() {
        return this.slider.value;
    };
    return obj;
};

function buttonContainer(parent) {
    /*This function works a little differently from the others
    This function must be instanciated by new.

    buttonCont = new buttonContainer(row);

    this instanciation can hold up to 3 buttons. Which are added using
    buttonCont.makeButton(), which returns an html button element*/

    if (parent == undefined) {
        alert("YOU need to place this inside a row!");
        return null;
    };

    let container = document.createElement("div");
    parent.appendChild(container);
    container.style = parent.style;
    container.style["padding"] = "0";
    container.style['display'] = "flex";
    container.style['min-width'] = "100%";

    this.container = container;

    this.makeButton = (label, func) => {
        let button = document.createElement("button");
        container.appendChild(button);
        button.innerHTML = label;
        button.onclick = func;
        return button;
    };
    this.remove = () => {
        this.container.remove()
    };

};


function setPedroStyle(canvas) {
    //Sets the CSS required for the dropdown


    //Canvas is the element you get from createCanvas();
    let id; //Necesary for canvas positioning
    if (arguments.length == 0) {
        id = "VeryUniqueOriginalCanvasContainer";
    } else {
        id = canvas.elt.parentNode.id;
        //In case canvas is already inside another element.
    };
    //NOW THE CSS
    var style = document.createElement('style');
    style.innerHTML = `
        /*Making it go inside the canvas*/
        #SomeCreativeID{
          position: absolute;
          display: flex;
          width: 17em;
          max-height: 100%;
          z-index: 99;
          overflow-y: auto;
          overflow-x: hidden;
          right: 0%; top: .6%;
          background-color: #333;
          transition-duration: .2s;
          border-radius: 0.2em;
          transform : translateX(93%);
        }
        #SomeCreativeID>div{
          padding-left: 0;
        }
        #SomeCreativeID:hover{
          transform : translateX(0%);
          background-color: transparent;
        }

        #${id}{
          position:relative;
          background-color: darkgray;
          display: inline-flex;
          overflow: hidden;
        }

        /*functionality*/
        .item, li, label{
          cursor: pointer;
          z-index: 3;
        }

        /*Functionality*/
        .ddContainer>input[type="checkbox"], .dd>.item>input[type=checkbox], .item>ul, .dd{
          display: none;
        }

        #Root:checked ~ .dd, .item>input:checked ~ ul{
          display: block;
        }

        #Root:checked ~ label{
          background-color: #222;
        }

        #Root:checked ~ label::before, .item>input:checked ~ label::before{
          transform: rotate(-90deg);
          display: inline-block;
          transition-duration: .2s;
          transform: rotate(-180deg);
        }

        #Root:not(:checked) ~ label::before, .item>input:not(:checked)~label::before{
          transform: rotate(-90deg);
          display: inline-block;
          transition-duration: .2s;
        }

        /*Making it pretty*/
        .ddContainer{
          background-color: none;
          display: inline-flex;
          width: 100%;
          height: 100%;
          padding: 0;
          flex-direction: column;
          font-size: .99em;
          color:white;
          font-family: sans-serif;
        }

        .ddContainer>label{
          min-height: 1.5em;
          font-weight: 600;
          display: flex;
          margin: 0;
          padding: 0;
          align-items: center;
          justify-contents: center;
          border-radius: 0.2em;
        }
        .item{
          margin: 0;
          padding: 0;
        }

        .item>ul>li>.item>input{
          display: none;
        }

        .item>ul>li>.item, .item>ul>li>.item>*{
          width: 100%;
        }


        .item>label{
          font-weight: 600;
          font-size: 1em;
          padding-left: 0.3em;
          background-color: #222;
          display: flex;
          align-items: center;
          border-bottom: 0.05em solid #333;
          border-top: 0.05em solid #333;
          border-radius: 0.2em;
          margin-top: 0.025em;
          margin-bottom: 0.05em;
          padding: 0.5em;
          min-height: 1.5em;
        }


        div.item>ul>li{
          border-radius: 0.2em;
          min-height: 2em;
          padding-left: .4em;
          padding-right: 1em;
          margin-top: 0;
          margin-bottom: 0;
          background: #222;
          display: flex;
          align-items: center;
          font-size: .8em;
        }

        .item>label::before, .ddContainer>label::before{
          content: "‹";
          margin-left: 0.4em;
          margin-right: 0.4em;
        }


        .item>ul{
          list-style: none;
          padding-left: 9%;
          margin: 0;
          min-height: 1em;
          background-color: #222;
          border-radius: .2em;
        }

        .item>ul>li:hover, .item:hover ~ ul, .item>label:hover{
          background-color: #333;
        }

         label:hover{
          transform: scale(1.01);
          background-color: #333;
        }

        /* width */
        #SomeCreativeID::-webkit-scrollbar{
          width: .5em;
        }

        /* Handle */
        #SomeCreativeID::-webkit-scrollbar-thumb {
          background: #666;
        }

        /* Handle on hover */
        #SomeCreativeID::-webkit-scrollbar-thumb:hover {
          background: #444;
        }


        /*NOW WE HAVE THE SLIDERS*/
        .rangeValue, .sliderTitle{
          display: flex;
          text-align: center;
          margin: 0;
          width: 40%;
          padding: 0;
        }
        .rangeValue{
          width: 10%;
          padding-left: 6%;
        }

        .sliderContainer{
          display: flex;
          justify-content: space-around;
          align-items: center;
          color: white;
          margin: 0em;
          padding: .4em;
          border-radius: 0.5em;
          width: 100%;
          opacity: 0.85;
        }

        .sliderContainer:hover{
          opacity:1;
        }

        .sliderContainer>input[type=range]{
          -webkit-appearance: none;
          background: transparent;
          width: 40%;
        }
        .sliderContainer>input[type=range]:focus {
          outline: none;
        }
        .sliderContainer>input[type=range]::-webkit-slider-runnable-track {
          width: 100%;
          height: .3em;
          cursor: pointer;
          background: #3071a9;
          border-radius: .9em;
          border: .05em solid #010101;
        }
        .sliderContainer>input[type=range]::-webkit-slider-thumb {
          border: 1px solid #000000;
          height: 1.3em;
          width: 1.3em;
          border-radius: 1.3em;
          background: #ffffff;
          cursor: pointer;
          -webkit-appearance: none;
          margin-top: -0.55em;
          transition-duration: .2s;
        }

        .sliderContainer>input[type=range]::-webkit-slider-thumb:hover{
          transform: scale(1.1);
        }
        .sliderContainer>input[type=range]::-moz-range-thumb:hover{
          transform: scale(1.1);
        }

        .sliderContainer>input[type=range]::-ms-thumb:hover{
          transform: scale(1.1);
        }

        .sliderContainer>input[type=range]::-moz-range-track{
          width: 100%;
          height: .3em;
          cursor: pointer;
          background: #3071a9;
          border-radius: .9em;
          border: .05em solid #010101;
        }

        .sliderContainer>input[type=range]::-moz-range-thumb {
          border: 1px solid #000000;
          height: 1.3em;
          width: 1.3em;
          border-radius: 1.3em;
          background: #ffffff;
          cursor: pointer;
          -webkit-appearance: none;
          margin-top: -0.55em;
          transition-duration: .2s;
        }

        .sliderContainer>input[type=range]::-ms-track {
         width: 100%;
          height: .3em;
          cursor: pointer;
          background: #3071a9;
          border-radius: .9em;
          border: .05em solid #010101;
        }
        .sliderContainer>input[type=range]::-ms-fill-lower {
          background: #2a6495;
          border: 0.2px solid #010101;
          border-radius: 2.6px;
          box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
        }
        .sliderContainer>input[type=range]::-ms-fill-upper {
          background: #3071a9;
          border: 0.2px solid #010101;
          border-radius: 2.6px;
          box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
        }
        .sliderContainer>input[type=range]::-ms-thumb {
         border: 1px solid #000000;
          height: 1.3em;
          width: 1.3em;
          border-radius: 1.3em;
          background: #ffffff;
          cursor: pointer;
          -webkit-appearance: none;
          margin-top: -0.55em;
          transition-duration: .2s;
        }

        /*NOW TIME FOR CHECKBOXES*/
        .cbContainer{
          display: flex;
          min-height: 2em;
          width: 100%;
          height: 100%;
          color: white;
          align-items: center;
          opacity: 0.8;
          transition-duration: .2s;
        }
        .cbContainer:hover{
          opacity: 1;
        }

        .cbContainer input[type=checkbox]{
          margin-left: auto;
          margin-right: .5em;
        }

        .cbContainer span{
          margin-left: .5em;
          margin-right: auto;
        }

        .item ul li button {
          border-radius: .4em;
          background-color: #333;
          border: .1em solid grey;
          outline: none;
          color: #ccc;
          transition-duration: .2s;
          font: inherit;
          font-weight: 600;
          padding: .2em .4em .2em .4em;
          width: 30%;
          margin: .2em;
        }

        .item ul li button:hover {
          color: white;
          background: #444;
        }
        `;
    document.head.appendChild(style);
};
