//properties of displays
const display = {
  W: 1200,
  H: 500
}

const simDisplay = {
  borderLeft: 0,
  borderUp: 0,
  W: 800,
  H: display.H
}

const plotDisplay = {
  borderLeft: simDisplay.borderLeft + simDisplay.W,
  borderUp: 0,
  W: display.W - simDisplay.W - simDisplay.borderLeft,
  H: display.H
}

let mainColor = {
  r : 244,
  g : 0,
  b : 97
}

let heightSlider, angleSlider;

//parameters
let params = {
  θ: 60, //initial angle [°]
  v: 40, //initial velocity [m/s]
  y0 : 10, //initial height [m]
  drag : true, //apply drag
  trajectory : true, //display trajectory
  r: 2, //Sphere radius [m]
  m: 20000, //mass of Sphere [kg]
  shape: 'Cone', //shape for drag
  dt: .0001, //time step [s]
  scale: 0.001 * 3780, // scale - 1 m = value in pixels
  speed: 2, //speed of animation relative to time step
  maxTrajectoryCount: 1, //max number of trajectorys at a time
  trajectoryPeriod: .5000 //period of displaying points of the trajectory
}

const constants = {
  //gravitational acceleration [m/s^2]
  g: 9.80665, //you are gonna mess with this one
  defaultG : 9.80665, //you are not gonna mess with this one
  //air density [kg/m^3]
  ρ: 1.225, //you are gonna mess with this one
  defaultρ: 1.225 //you are not gonna mess with this one
}

const dragCoefficients = {
  Hemisphere: 0.42,
  Sphere: 0.47,
  Cone: 0.50,
  AngledCube: 0.80,
  Cube: 1.05
  
}

let points = [];
let plotTime = 0;
let moveProjectile = true;
//Projectile properties
//t = time of flight
let projectile = {
  x: 0, //x coordinate
  y: display.H - params.y0, //y coordinate
  v: params.v, //speed at specific time [m/s]
  vy: params.v * Math.sin(params.θ * Math.PI / 180), //vertical component of speed [m/s]
  vx: params.v * Math.cos(params.θ * Math.PI / 180), //horizontal component of speed [m/s]
  θ: params.θ, //angle between speed vector and x axis at speficic time
  t: 0, //time of flight
  dθ: 0, //change of angle -> rotation
  Cx: dragCoefficients[params.shape], //drag coefficient
  trajectory: [], //array containing coordinates of points of the flight trajectory
  trajectoryCount: 0, //number of 'flights'
  trajectorydt: 0 //delta time for displaying points of the trajectory
}

function setup() {
  frameRate(60)

  //multiple canvases
  outerCanvas = createCanvas(display.W, display.H);
  outerCanvas.parent("simwrapper");

  simCanvas = createGraphics(simDisplay.W, simDisplay.H); //used to display the simulation
  plotCanvas = createGraphics(plotDisplay.W, plotDisplay.H); //for graphing

  projectileCanvas = createGraphics(params.r * 4 * params.scale, params.r * 4 * params.scale);
  projectileCanvas.translate(params.r * 2 * params.scale, params.r * 2 * params.scale);
  projectileCanvas.rotate(-params.θ);
  if(params.shape == 'AngledCube'){
    projectileCanvas.rotate(-params.θ);
  }
  projectileCanvas.fill(mainColor.r, mainColor.g, mainColor. b);
  projectileCanvas.noStroke();
  projectileCanvas.background(20);
  projectileCanvas.rectMode(CENTER);

  textSize(20);
  plotCanvas.textSize(textSize())

  gridCanvas = createGraphics(simDisplay.W, simDisplay.H)
  let step = 38

  gridCanvas.clear()
  gridCanvas.stroke(255, 50)
  gridCanvas.strokeWeight(1)
  for (let i = 0; i <= simDisplay.H / step; i++) {
    gridCanvas.line(2 * i * step, 0,2 * i * step, simDisplay.H)
    gridCanvas.line(0,simDisplay.H - i * step, simDisplay.W - 2,simDisplay.H - i * step)
  }

  let dd = makeDropdown(outerCanvas);
  dd.setLabel('Settings');
  setPedroStyle(outerCanvas);
  
  /*
    let buttonContainer1 = new buttonContainer(row);
    let button1 = buttonContainer1.makeButton(label, func);
    where label is the name inside the button and func is the function performed by the button when it is pressed.
    button1 is an html element so you can do whatever you want with it. Examples below:
      button1.innerHTML= "my title";
      button1.onclick = function (){"do something"};
      button1.style = 'write your own css here';
  */
  let i1 = makeItem(dd);
  i1.setLabel('Parameters');
  let i2 = makeItem(dd);
  i2.setLabel('User Interface');
  let i3 = makeItem(dd);
  i3.setLabel('Constants');
  
  //shape slider
  let i1r1 = makeRow(i1); //shape
  let i1r2 = makeRow(i1); //velocity
  let i1r3 = makeRow(i1); //angle
  let i1r4 = makeRow(i1); //initial height
  let i1r5 = makeRow(i1); //checkbox for drag
  let i1r6 = makeRow(i1); //frontal area
  let i1r7 = makeRow(i1); //mass
  let i1r8 = makeRow(i1);
  i1r8.setLabel('Projectile density: ' + Math.round(calculateDensity() / 10) * 10 + ' kg/m³');

  let i2r1 = makeRow(i2); //scale
  let i2r2 = makeRow(i2); //speed
  let i2r3 = makeRow(i2); //display trajectory
  let i2r4 = makeRow(i2); //trajectory count
  let i2r5 = makeRow(i2); //trajectory period
  let i2r6 = makeRow(i2)
  let buttonRow = new buttonContainer(i2r6);

  let i3r1 = makeRow(i3); //g
  let i3r2 = makeRow(i3); //g label
  i3r2.setLabel('Gravitational acceleration: ' + constants.g.toFixed(2) + ' m/s²');
  let i3r3 = makeRow(i3); //air density
  let i3r4 = makeRow(i3); // display density
  i3r4.setLabel('Air density: ' + constants.ρ.toFixed(2) + ' kg/m³');

  let shapeMenu = makeItem(i1r1);
  shapeMenu.setLabel('Shape: ' + params.shape);

  let shape1 = makeRow(shapeMenu);
  let shape2 = makeRow(shapeMenu);
  let shape3 = makeRow(shapeMenu);
  let shape4 = makeRow(shapeMenu);
  let shape5 = makeRow(shapeMenu);

  shape1.setLabel(Object.keys(dragCoefficients)[0] + ' (Cx = ' + dragCoefficients[Object.keys(dragCoefficients)[0]] + ')');
  shape1.onclick = () => {
    if(params.shape == 'AngledCube'){
      projectileCanvas.rotate(params.θ);
    }
    params.shape = shape1.innerHTML.split(' ')[0];
    shapeMenu.setLabel('Shape: ' + params.shape);
    projectile.Cx = dragCoefficients[params.shape];
    i1r8.setLabel('Projectile density: ' + Math.round(calculateDensity() / 10) * 10 + ' kg/m³');
  }
  shape2.setLabel(Object.keys(dragCoefficients)[1]  + ' (Cx = ' + dragCoefficients[Object.keys(dragCoefficients)[1]] + ')');
  shape2.onclick = () => {
    if(params.shape == 'AngledCube'){
      projectileCanvas.rotate(params.θ);
    }
    params.shape = shape2.innerHTML.split(' ')[0];
    shapeMenu.setLabel('Shape: ' + params.shape);
    projectile.Cx = dragCoefficients[params.shape];
    i1r8.setLabel('Projectile density: ' + Math.round(calculateDensity() / 10) * 10 + ' kg/m³');
  }
  shape3.setLabel(Object.keys(dragCoefficients)[2]  + ' (Cx = ' + dragCoefficients[Object.keys(dragCoefficients)[2]] + ')');
  shape3.onclick = () => {
    if(params.shape == 'AngledCube'){
      projectileCanvas.rotate(params.θ);
    }
    params.shape = shape3.innerHTML.split(' ')[0];
    shapeMenu.setLabel('Shape: ' + params.shape);
    projectile.Cx = dragCoefficients[params.shape];
    i1r8.setLabel('Projectile density: ' + Math.round(calculateDensity() / 10) * 10 + ' kg/m³');
  }
  shape4.setLabel(Object.keys(dragCoefficients)[3]  + ' (Cx = ' + dragCoefficients[Object.keys(dragCoefficients)[3]] + ')');
  shape4.onclick = () => {
    params.shape = shape4.innerHTML.split(' ')[0];
    shapeMenu.setLabel('Shape: ' + params.shape);
    projectileCanvas.rotate(-params.θ);
    projectile.Cx = dragCoefficients[params.shape];
    i1r8.setLabel('Projectile density: ' + Math.round(calculateDensity() / 10) * 10 + ' kg/m³');
  }
  shape5.setLabel(Object.keys(dragCoefficients)[4]  + ' (Cx = ' + dragCoefficients[Object.keys(dragCoefficients)[4]] + ')');
  shape5.onclick = () => {
    if(params.shape == 'AngledCube'){
      projectileCanvas.rotate(params.θ);
    }
    params.shape = shape5.innerHTML.split(' ')[0];
    shapeMenu.setLabel('Shape: ' + params.shape);
    projectile.Cx = dragCoefficients[params.shape];
    i1r8.setLabel('Projectile density: ' + Math.round(calculateDensity() / 10) * 10 + ' kg/m³');
  }

  //initial velocity slider
  let velocityCont = makeSlider(i1r2);
  velocityCont.setTitleLabel('Initial velocity [m/s]');
  velocityCont.setParameters(50, 1, 1, params.v)
  velocityCont.slider.oninput = () =>{
    velocityCont.setValueLabel(velocityCont.slider.value)
    params.v = velocityCont.slider.value;
  }

  //angle slider
  angleSlider = makeSlider(i1r3);
  angleSlider.setTitleLabel('Angle [°]');
  angleSlider.setParameters(90, -90, 1, params.θ)
  angleSlider.slider.oninput = () =>{
    angleSlider.setValueLabel(angleSlider.slider.value)
    params.θ = angleSlider.slider.value;
  }

  //h0
  heightSlider = makeSlider(i1r4);
  heightSlider.setTitleLabel('Initial height [m]');
  heightSlider.setParameters(130, 0, 1, params.y0)
  heightSlider.slider.oninput = () =>{
    heightSlider.setValueLabel(heightSlider.slider.value)
    params.y0 = heightSlider.slider.value;
  }

  //drag
  let dragCont = makeCheckbox(i1r5);
  dragCont.setLabel('Apply Drag');
  let applyDrag = dragCont.checkbox;
  applyDrag.checked = params.drag ? true : false;
  applyDrag.onclick = () => {
    params.drag = applyDrag.checked ? true : false
  }

  //frontal area
  let areaCont = makeSlider(i1r6);
  areaCont.setTitleLabel('Frontal area [m²]');
  areaCont.setParameters(50, 1, 1, (PI*params.r**2).toFixed(0))
  areaCont.slider.oninput = () =>{
    areaCont.setValueLabel(areaCont.slider.value)
    params.r = sqrt(areaCont.slider.value/PI);
    projectileCanvas.resizeCanvas(params.r * 4 * params.scale, params.r * 4 * params.scale);
    projectileCanvas.translate(params.r * 2 * params.scale, params.r * 2 * params.scale);
    projectileCanvas.rotate(-projectile.θ);
    i1r8.setLabel('Projectile density: ' + Math.round(calculateDensity() / 10) * 10 + ' kg/m³');
  }

  //mass
  let massCont = makeSlider(i1r7);
  massCont.setTitleLabel('Mass [kg]');
  massCont.setParameters(50000, 100, 100, params.m)
  massCont.slider.oninput = () =>{
    massCont.setValueLabel(massCont.slider.value)
    params.m = massCont.slider.value;
    i1r8.setLabel('Projectile density: ' + Math.round(calculateDensity() / 10) * 10 + ' kg/m³');
  }

  let scaleCont = makeSlider(i2r1);
  scaleCont.setTitleLabel('Scale');
  scaleCont.setParameters(0.005, 0.001, 0.001, (params.scale / 3780).toFixed(3))
  scaleCont.slider.oninput = () =>{
    scaleCont.setValueLabel(scaleCont.slider.value)
    projectile.trajectory = [];
    projectile.trajectoryCount = 0;
    params.scale = 3780 * scaleCont.slider.value;
    projectileCanvas.resizeCanvas(params.r * 4 * params.scale, params.r * 4 * params.scale);
    projectileCanvas.translate(params.r * 2 * params.scale, params.r * 2 * params.scale);
    projectileCanvas.rotate(-projectile.θ);
  }

  let speedCont = makeSlider(i2r2);
  speedCont.setTitleLabel('Speed');
  speedCont.setParameters(10, .1, .1, params.speed)
  speedCont.slider.oninput = () =>{
    speedCont.setValueLabel(speedCont.slider.value)
    params.speed = speedCont.slider.value;
  }

  let trajectoryCont = makeCheckbox(i2r3);
  trajectoryCont.setLabel('Display trajectory');
  let applyTrajectory = trajectoryCont.checkbox;
  applyTrajectory.checked = params.trajectory ? true : false;
  applyTrajectory.onclick = () => {
    params.trajectory = applyTrajectory.checked ? true : false
  }
  
  let countCont = makeSlider(i2r4);
  countCont.setTitleLabel('Trail ratio');
  countCont.setParameters(10, 1, 1, params.maxTrajectoryCount)
  countCont.slider.oninput = () =>{
    countCont.setValueLabel(countCont.slider.value);
    params.maxTrajectoryCount = countCont.slider.value;
  }

  let periodCont = makeSlider(i2r5);
  periodCont.setTitleLabel('Trail drawing period');
  periodCont.setParameters(1, .1, .1, params.trajectoryPeriod)
  periodCont.slider.oninput = () =>{
    periodCont.setValueLabel(periodCont.slider.value);
    projectile.trajectorydt = 0;
    params.trajectoryPeriod = Number(periodCont.slider.value).toFixed(4);
  }

  let btnPause = buttonRow.makeButton('Pause', NaN);
  btnPause.onclick = () => {
    moveProjectile = false
  }
  let btnPlay = buttonRow.makeButton('Play', NaN);
  btnPlay.onclick = () => {
    moveProjectile = true
  }
  let btnReset = buttonRow.makeButton('Reset', NaN);
  btnReset.onclick = () => {
    params.θ = 60
    params.v = 40
    params.y0 = 10
    params.drag = true
    params.trajectory = true
    params.r = 2
    params.m = 20000
    params.shape = 'Cone'
    params.dt = .0001
    params.scale = 0.001 * 3780
    params.speed = 2
    params.maxTrajectoryCount = 1
    params.trajectoryPeriod = .5000
    resetCanvas(projectileCanvas);
    reset();
    projectile.trajectory = []
    plot1.setPoints([])
  }

  let gCont = makeSlider(i3r1);
  gCont.setTitleLabel("g scale");
  gCont.setParameters(10, 0.1, .1, 1)
  gCont.setValueLabel(gCont.slider.value + 'x')
  gCont.slider.oninput = () =>{
    gCont.setValueLabel(gCont.slider.value + 'x')
    constants.g =  gCont.slider.value * constants.defaultG;
    i3r2.setLabel('Gravitational acceleration: ' + constants.g.toFixed(2) + ' m/s²');
  }

  let airCont = makeSlider(i3r3);
  airCont.setTitleLabel('Air density scale');
  airCont.setParameters(10, 0.1, .1, 1)
  airCont.setValueLabel(airCont.slider.value + 'x')
  airCont.slider.oninput = () =>{
    airCont.setValueLabel(airCont.slider.value + 'x');
    constants.ρ = airCont.slider.value * constants.defaultρ;
    i3r4.setLabel('Air density: ' + constants.ρ.toFixed(2) + ' kg/m³');
  }
  /*
  let Cont = makeSlider();
  Cont.setTitleLabel('');
  Cont.setParameters(, , , params.)
  Cont.slider.oninput = () =>{
    Cont.setValueLabel(Cont.slider.value)
    params. = Cont.slider.value;
  }
  */
    plot1 = new GPlot(plotCanvas); //setting up plotting window (grafica.js)
    plot1.setLineColor(255);
    plot1.setBoxBgColor(20);
    plot1.setBoxLineColor(150)
    plot1.title.fontColor = 255;
    plot1.title.fontSize = 20
    plot1.title.fontStyle = NORMAL
    plot1.title.offset = 2

    plot1.setPos(0, 220);
    plot1.setMar(10, 10, 22, 10);
    plot1.setOuterDim(plotDisplay.W, plotDisplay.H/2);
    plot1.setTitleText("Velocity in time")

    plot1.addPoint(new GPoint(projectile.t + plotTime, projectile.v));
}

function draw() {
  background(20);

  drawGraphics(simCanvas, projectileCanvas);

  image(simCanvas, simDisplay.borderLeft, simDisplay.borderUp)
  if(moveProjectile){
    updateParams()
  }

  image(gridCanvas, 0, 0)

  drawPlots(plotCanvas);

  image(plotCanvas, simDisplay.W, 30)

  noStroke()
  fill(255)
  textSize(20)
  text('scale ' + ((params.scale / 3780)).toFixed(3) + 'x', display.W - 385, 25);
}

function drawProjectile(canvas){
  if (params.shape == 'Sphere') {
    canvas.circle(0, 0, params.r*2*params.scale)
  } else if (params.shape == 'Cube' || params.shape == 'AngledCube') {
    canvas.rect(0, 0, params.r * sqrt(PI) * params.scale);
  } else if (params.shape == 'Hemisphere') {
    canvas.arc(0, 0, params.r*2*params.scale, params.r*2*params.scale, -PI/2, PI/2)
  } else if (params.shape == 'Cone') {
    canvas.triangle(-1/3 * params.r * sqrt(3)* params.scale, params.r* params.scale, 2/3 * params.r * sqrt(3)* params.scale, 0, -1/3 * params.r * sqrt(3)* params.scale, -params.r* params.scale)
  }
}

function drawPlatform(canvas){
  // draw platform with angle display
  canvas.drawingContext.setLineDash([5])
  canvas.strokeWeight(2);
  canvas.fill(0, 97, 244, 50);
  canvas.stroke(0, 97, 244, 100);
  if(params.θ > 0){
    canvas.arc(0, display.H - params.scale * params.y0, 152, 152, -radians(params.θ), 0);
  }
  else if(params.θ == 0){
    canvas.line(0, display.H - params.scale * params.y0 , 76, display.H - params.scale * params.y0);
  }
  else{
    canvas.arc(0, display.H - params.scale * params.y0, 152, 152, 0, -radians(params.θ));
  }
  canvas.line(0, display.H - params.scale * params.y0 , 76 * cos(radians(params.θ)), display.H - params.scale * params.y0 - 76 * sin(radians(params.θ)));
  canvas.stroke(0, 244, 244, 150);
  canvas.line(0, display.H - params.scale * params.y0 , 76, display.H - params.scale * params.y0);
  canvas.drawingContext.setLineDash([])
}

//simpler than typing simDisplay.{sth} 10000 times
function drawGraphics(c, pc) {
  //c = simCanvas
  //pc = projectileCanvas
  c.background(20);
  pc.background(20, 255);

  if(moveProjectile){
    pc.rotate(projectile.dθ); // rotate projectile
  }
  drawProjectile(pc);

  c.image(pc, projectile.x * params.scale - params.r * 2 * params.scale, display.H + params.scale * (projectile.y - display.H) - params.r * 2 * params.scale); // upload projectile

  c.rectMode(CORNER)
  c.noFill();
  c.stroke(255, 50);
  c.strokeWeight(4)
  c.rect(0, 0, simDisplay.W, simDisplay.H);

  drawPlatform(c)
  //draw projectile trajectory
  c.noStroke()
  if (params.trajectory){
    for (let i = 1; i <= projectile.trajectory.length; i++) {
      c.fill(mainColor.r, mainColor.g, mainColor. b, 255 * (i / projectile.trajectory.length));
      c.circle(projectile.trajectory[i-1][0], projectile.trajectory[i-1][1], params.r * params.scale)
    }
  }

  c.fill(255);
  c.noStroke()
}

function drawPlots(c){
  c.background(20)

  c.fill(255)
  c.noStroke()
  
  c.text('time = ' + projectile.t.toFixed(1) + ' s', 7*c.textSize(), 4 * c.textSize());
  c.text('distance = ' + projectile.x.toFixed(0) + ' m', 7*c.textSize(), 5 * c.textSize());
  c.text('height = ' + (display.H - projectile.y).toFixed(0) + ' m', 7*c.textSize(), 6 * c.textSize());
  c.text('velocity = ' + (sqrt(projectile.vy**2 + projectile.vx**2)).toFixed(0) + ' m/s', 7*c.textSize(), 7 * c.textSize());
  
  if(params.drag){
    c.text('drag = ' + ((projectile.drag*params.m/100).toFixed(0)*100) + ' N', 7*c.textSize(), 8 * c.textSize());
  }
  
  //points[points.length] = ;
  
  plot1.addPoint(new GPoint(projectile.t + plotTime, (sqrt(projectile.vy**2 + projectile.vx**2))));
  if(plot1.getPoints().length > 500){
    plot1.removePoint(0)
  }

  plot1.beginDraw();
  plot1.drawBox();
  plot1.drawTitle();
  plot1.drawLines();
  plot1.endDraw();
}

//Updating position and velocity
function updateParams() {
  projectile.dθ = 0;
  for (let i = 0; i < (((1/params.dt)*params.speed)/60); i++) {
    if (params.drag) {
      projectile.drag = calculateDrag(projectile, constants.ρ);
    }
    else{
      projectile.drag = 0;
    }
    projectile.dθ += projectile.θ - asin(projectile.vy / projectile.v)
    projectile.θ = asin(projectile.vy / projectile.v)
    projectile.x += projectile.vx * params.dt;
    projectile.y -= projectile.vy * params.dt;
    projectile.vx -= cos(projectile.θ) * projectile.drag * params.dt
    projectile.vy -= constants.g * params.dt + sin(projectile.θ) * projectile.drag * params.dt;
    projectile.v = sqrt(projectile.vy ** 2 + projectile.vx ** 2);
    projectile.t += params.dt;
    projectile.trajectorydt += params.dt;

    if (projectile.trajectorydt.toFixed(4) == params.trajectoryPeriod) {
      projectile.trajectorydt = 0;
      projectile.trajectory.push([projectile.x * params.scale, display.H + params.scale * (projectile.y - display.H)])
      if (projectile.trajectoryCount >= params.maxTrajectoryCount) {
        projectile.trajectory.shift();
      }
    }

    if (display.H < projectile.y) {
      plotTime += projectile.t
      resetCanvas(projectileCanvas);

      reset()
      if (projectile.trajectoryCount < params.maxTrajectoryCount) {
        projectile.trajectoryCount++;
      }
      i = (((1/params.dt)*params.speed)/60)
    }
  }
}

function calculateDensity() {
  if (params.shape == 'Sphere') {
    return params.m / (4 / 3 * PI * params.r ** 3);
  } else if (params.shape == 'Cube' || params.shape == 'AngledCube') {
    return params.m / ((params.r * sqrt(PI)) ** 3);
  } else if (params.shape == 'Hemisphere') {
    return params.m / (1 / 2 * 4 / 3 * PI * params.r ** 3);
  } else if (params.shape == 'Cone') {
    return (sqrt(3) * params.m) / (PI * params.r ** 3);
  }
}

function calculateDrag(pr) {
  // pr = projectile
  return PI * (params.r ** 2) * pr.Cx * constants.ρ * pr.v ** 2 / (2 * params.m);
}

function calculateHeightAndDistance(v, g) {
  let vy = sin(v) * v;
  let vx = cos(v) * v;
  let t = vy / g; //time to make y-velocity 0
  let h = g * (t ** 2) / 2 + vy * t; //max height
  let d = 2 * vx * t; //distance
  return [h, d]
}

function resetCanvas(canvas) {
  canvas.resetMatrix();
  canvas.translate(params.r * 2 * params.scale, params.r * 2 * params.scale);
  canvas.rotate(-params.θ);
  if(params.shape == 'AngledCube'){
    canvas.rotate(-params.θ);
  }
}

//reset projectile
function reset(){
  projectile.x = 0;
  projectile.y = display.H - params.y0;
  projectile.v = params.v;
  projectile.vy = params.v * sin(radians(params.θ));
  projectile.vx = params.v * cos(radians(params.θ));
  projectile.θ = params.θ;
  projectile.t = 0;
  projectile.trajectorydt = 0;
}

function isMouseClickedAndOnPlatform(){
  return mouseIsPressed && mouseX < 50 && mouseX > 0 && mouseY < display.H - params.y0 * params.scale + 25 && display.H - params.y0*params.scale - 25 < mouseY && mouseY < display.H && mouseY > 0
}

function isMouseOnSimDisplay(){
  return mouseX > 0 && mouseY > 0 && mouseX < simDisplay.W && mouseY < simDisplay.H
}

//adjust initial height with draggable platform
function mousePressed() {
  if(isMouseClickedAndOnPlatform()){
    dragPlatform()
  }
}

function mouseDragged(){
  if(isMouseClickedAndOnPlatform()){
    dragPlatform()
  }
}

//adjust angle with mouse wheel
function mouseWheel(event){
  if(isMouseOnSimDisplay()){
    let factor = event.delta/20
    if(params.θ - factor  <= 90 && params.θ - factor >= -90){
      params.θ -= event.delta/20
      angleSlider.setValueLabel((params.θ).toFixed(0))
      angleSlider.slider.value = (params.θ).toFixed(0)
    }
  }
}

function dragPlatform(){
  params.y0 = (display.H - mouseY)/params.scale;
  heightSlider.setValueLabel((params.y0).toFixed(0))
  heightSlider.slider.value = (params.y0).toFixed(0)
}
