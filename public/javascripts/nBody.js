let t = 0;
let dt = 1 /1800;
let H = 500;
let scalingFactor = 2;
let speed = 10;
let canvas, arena, b1, b2, running = true,
  lockedBall, trailRenderer, trailContext;
let i1r4checkboxCont; //FUSION OF BALLS
let i1r5checkboxCont; //Collision with walls
let i3r1checkBoxCont; //kinetic energyu
let plotCanvas, axes; //kinetic energy


function setup() {
  canvas = createCanvas(H, H);
  canvas.transX = 0;
  canvas.transY = 0;
  canvas.secretX = canvas.transX;
  canvas.secretY = canvas.transY;
  let mouseWheelOriginal = mouseWheel;
  canvas.elt.onmouseenter = () => {
    canvas.isMouseOver = true;
    document.body.style.overflow = "hidden";
    mouseWheel = mouseWheelOriginal;
  };
  canvas.elt.onmouseleave = () => {
    document.body.style.overflow = "auto";
    canvas.isMouseOver = false;
    mouseWheel = () => {
      null
    };
  };
  canvas.isMouseOver = false;
  canvas.parent("simwrapper");
  trailRenderer = createGraphics(H, H);
  trailContext = trailRenderer.elt.getContext("2d");

  arena = createGraphics(H, H);
  pixelDensity(2);
  trailRenderer.pixelDensity(2);
  arena.pixelDensity(2);

  for (let i = 0; i < 3; i++) {
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
  setDropdownStyle(canvas);

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
  i3r1checkBoxCont = makeCheckbox(i3r1); //Ek
  let i3r2checkBoxCont = makeCheckbox(i3r2); //ep
  i3r1checkBoxCont.setLabel("Show kinetic energy");
  i3r2checkBoxCont.setLabel("Show potential energy");
  // i3r1checkBoxCont.checkbox.disabled = true;
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

  //Here starts the plot
  let parent = canvas.elt.parentElement;
  plotCanvas = document.createElement("canvas");
  plotCanvas.height =plotCanvas.width = H*2;
  plotCanvas.style.height = String(H)+"px";
  plotCanvas.style.width = String(H)+"px";
  plotCanvas.style.background = "#000";
  plotCanvas.style.outline = "5px solid white";
  plotCanvas.style.outlineOffset = "-2.5px";

  plotCanvas.style.display="none";
  parent.appendChild(plotCanvas);
  let ekCheck = i3r1checkBoxCont.checkbox;
  let epCheck = i3r2checkBoxCont.checkbox;
  i3r1checkBoxCont;
  if (ekCheck.checked&&epCheck.checked){
    plotCanvas.style.display="flex";
  } else if (ekCheck.checked||epCheck.checked){
    plotCanvas.style.display="block";
  } else {
    plotCanvas.style.display="none";
  };

  axes = document.createElement("canvas");
  axes.height =plotCanvas.width = H*4;
  axes.width =plotCanvas.width = H*4;
  axes.style.height = String(H*.75)+"px";
  axes.style.width = String(H*.75)+"px";
  axes.style.background = "#000";
};

function setLimits(canvas, x0, y0, x1, y1){
      let xscale = canvas.width/(x1-x0);
      let yscale = canvas.height/(y0-y1);
      let ctx = canvas.getContext("2d");
      ctx.setTransform(xscale,0, 0, yscale, -xscale*x0, canvas.height-yscale*y0);
      //Translation is done before scaling!
      canvas.savedLimits = [x0, y0, x1, y1];
    };
    function resizeCanvasImage(canvas, x0, y0, x1, y1){
      // Here the coords are the new ones
      if (canvas.savedLimits==undefined){
        canvas.savedLimits = [0, -canvas.height, canvas.width, 0];
        };
      let dummyCtx, dummyCanvas;//Do not let them scape this scop!
      if (canvas.dummyCanvas==undefined){
        canvas.dummyCanvas = document.createElement("canvas");
        for (attr of ["height", "width", 'style']){
          canvas.dummyCanvas[attr] = canvas[attr];
        };
      };
      dummyCanvas = canvas.dummyCanvas;
      dummyCtx = dummyCanvas.getContext("2d");
      let ctx = canvas.getContext("2d");
      let savedTransform = ctx.getTransform();
      let savedLimits = canvas.savedLimits;
      let x0old = savedLimits[0], x1old=savedLimits[2], y1old=savedLimits[3], y0old=savedLimits[1];

      dummyCtx.fillRect(0, 0, canvas.width, canvas.height);
      dummyCtx.drawImage(canvas, 0, 0);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(dummyCanvas, (-x0+x0old)*canvas.width/(x1-x0), (y1-y1old)*canvas.height/(y1-y0), canvas.width*(x1old-x0old)/(x1-x0), canvas.height*(y1old-y0old)/(y1-y0));
      setLimits(canvas, ...savedLimits);
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
    for (let b of body.prototype.bodyArray){
      b.lastEk = b.ek;};
    for (let i = 0; i <= speed; i++) {
      body.prototype.applyGAcc();
      body.prototype.move(dt);
      t+=dt;
      if (i1r5checkboxCont.checkbox.checked) {
        body.prototype.borderCollision();
      };
  };body.prototype.drawTrail();
  }else {
    for (b of body.prototype.bodyArray) {
      b.fx = b.fy = b.accX = b.accY = 0;
    };
    body.prototype.applyGAcc();
  };
  if (i3r1checkBoxCont.checkbox.checked){
    plotCanvas.style.display = "flex";
    let ctx = plotCanvas.getContext("2d");
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, plotCanvas.width, plotCanvas.height);
    body.prototype.plotEk(axes);
    plotCanvas.getContext("2d").drawImage(axes, H*.25, H*.25, H*4, H*1.5);
    ctx.strokeStyle = "white";
    ctx.font = "40px Consolas";
    ctx.fillStyle = "white";
    ctx.fillText("Relative Kinetic Energy", plotCanvas.width/2.5, plotCanvas.height*.1);
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(H*.25, H*.25);
    ctx.lineTo(H*.25, H*1.75);
    ctx.lineTo(H*3.75, H*1.75);
    ctx.lineTo(H*3.75, H*.25);
    ctx.closePath();
    ctx.stroke();
    body.prototype.drawEkBalls();
  } else {
    plotCanvas.style.display = "none";
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
  if (!canvas.isMouseOver){return null;};
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

  body.prototype.drawEkBalls = () =>{
    let plottingCanvas = axes.dummyCanvas;
    let ctx = plottingCanvas.getContext("2d");
    let c = [ctx.fillStyle, ctx.strokeStyle];
    ctx.clearRect(0, 0, plottingCanvas.width, plottingCanvas.width);
    ctx.lineWidth =4;
    for (let b of body.prototype.bodyArray){
      ctx.fillStyle = b.fillColor;
      ctx.strokeStyle = b.lineColor;
      let x=(t-axes.savedLimits[0])/(axes.savedLimits[2]-axes.savedLimits[0])*axes.width;
      let y=(1-(b.ek-axes.savedLimits[1])/(axes.savedLimits[3]-axes.savedLimits[1]))*axes.height;
      ctx.beginPath();
      ctx.arc(x, y, 30, 0, 6.28);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    };
    ctx.fillStyle = c[0];
    ctx.strokeStyle = c[1];
    plotCanvas.getContext('2d').drawImage(plottingCanvas, H*.25, H*.25, H*4, H*1.5);
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
      if(BODY.ek > ekMax) {body.prototype.ekMax = ekMax = BODY.ek};
    };
    if(plot.needsUpdate == undefined){
      plot.needsUpdate = 0;
    };
    if (plot.needsUpdate==0){
      resizeCanvasImage(plot, t-2,  0, t+1, ekMax+10);
      setLimits(plot,...[t-2,  0, t+1, ekMax+10]);
      plot.needsUpdate = 1;
    }else {plot.needsUpdate = 0;};
    let xTransform = (x)=>{
      return (x-plot.savedLimits[0])/(plot.savedLimits[2]-plot.savedLimits[0])*plot.width;
    };
    let yTransform = (y)=>{
      return (1-(y-plot.savedLimits[1])/(plot.savedLimits[3]-plot.savedLimits[1]))*plot.height;
    };
    let axesC = plot.getContext("2d");
    axesC.setTransform(1, 0, 0, 1, 0, 0);
    axesC.lineWidth = 18;
    for (BODY of body.prototype.bodyArray) {
      axesC.strokeStyle = BODY.fillColor;
      axesC.beginPath();
      axesC.moveTo(xTransform(t-speed*dt),yTransform(BODY.lastEk));
      axesC.lineTo(xTransform(t),yTransform(BODY.ek));
      // axesC.moveTo(t-speed*dt,BODY.lastEk);
      // axesC.lineTo(t,BODY.ek);
      axesC.closePath();
      axesC.stroke();
    };
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
