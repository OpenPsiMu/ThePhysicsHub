let L = 800; //x length of canvas
let W = 400; //y length of canvas
let scale = 100;
let count = 0;
let pos = [];
var plot1 = undefined;
var plot2 = undefined;

let lSlider, l0Slider, kSlider, fSlider, mInput, aInput, sButton, cButton;

let par = {
  theta: 0, //angle
  omega: 0, //angular velocity
  r: 1, //radius
  v: 0, //radial velocity
  k: 9.8 / 100, //spring constant
  l0: 0.5, //spring rest length
  dt: 0.001, //time step
  mass: 1, //mass
  g: 9.8 / 100, //adjusted g
  hinge: [L / 3, 3 * W / 10] //hinge position
}


function linedash(x1, y1, x2, y2, list) {
  drawingContext.setLineDash(list); // set the "dashed line" mode
  line(x1, y1, x2, y2); // draw the line
  drawingContext.setLineDash([]); // reset into "solid line" mode
}

function setup() {
  simCanvas = createCanvas(L, W);

  lSlider = createSlider(0.1, 2.0, 0.5, 0.1); //init length slider
  lSlider.position(10, 10);
  lSlider.style('width', '90px');

  l0Slider = createSlider(0.1, 2.0, 1.0, 0.1); //rest length slider
  l0Slider.position(10, 30);
  l0Slider.style('width', '90px');

  kSlider = createSlider(10, 100, 30, 0.1); //spring const slider
  kSlider.position(10, 50);
  kSlider.style('width', '90px');

  fSlider = createSlider(1, 500, 50, 1); //frameskip slider
  fSlider.position(L / 3 - 50, 373);
  fSlider.style('width', '90px');

  mInput = createInput(); //mass input
  mInput.position(10, 364);
  mInput.size(20);

  aInput = createInput(); //initial angle input
  aInput.position(2 * L / 3 - 84, 364);
  aInput.size(20);

  sButton = createButton('Start'); //START button
  sButton.position(425, 30);
  sButton.mousePressed(() => { //Updates values only when START is pressed
    par.theta = (aInput.value() % 90) * PI / 180
    par.r = lSlider.value();
    par.mass = mInput.value();
    par.k = kSlider.value() / 100;
    par.omega = 0;
    par.v = 0;
    par.l0 = l0Slider.value();
    plot1.getMainLayer().points = [];
    plot2.getMainLayer().points = [];
    pos = [];
  });

  cButton = createButton('Clear'); //CLEAR button
  cButton.position(325, 30);
  cButton.mousePressed(() => { //Clears plots when it is pressed
    plot1.getMainLayer().points = [];
    plot2.getMainLayer().points = [];
    pos = [];
  })

  plot1 = new GPlot(this);
  plot1.setPos(2 * L / 3, 0);
  plot1.setMar(30, 40, 30, 10);
  plot1.setOuterDim(this.width / 3, this.height / 2);
  plot1.setAxesOffset(4);
  plot1.setTicksLength(4);

  plot1.setTitleText("Phase Space (r vs. v)");

  plot2 = new GPlot(this);
  plot2.setPos(2 * L / 3, W / 2);
  plot2.setMar(30, 40, 30, 10);
  plot2.setOuterDim(this.width / 3, this.height / 2);
  plot2.setAxesOffset(4);
  plot2.setTicksLength(4);

  plot2.setTitleText("Phase Space (theta vs. omega)");
	
  simCanvas.parent("simwrapper")
  lSlider.parent("simwrapper")
  l0Slider.parent("simwrapper")
  kSlider.parent("simwrapper")
  fSlider.parent("simwrapper")
  mInput.parent("simwrapper")
  aInput.parent("simwrapper")
  sButton.parent("simwrapper")
  cButton.parent("simwrapper")
}

function draw() {
  background(204, 229, 255);
  strokeWeight(offset * 2);
  stroke(0, 128, 255);

  fill(102, 178, 255);
  rect(0, 0, L, W / 5);

  fill(204, 229, 255);
  rect(0, W / 5, 2 * L / 3, 7 * W / 10);

  fill(102, 178, 255);
  rect(0, 9 * W / 10, 2 * L / 3, W / 10);

  fill(153, 204, 255);
  rect(2 * L / 3, W / 5, L / 3, 4 * W / 5);

  noFill();
  rect(0 + offset, 0 + offset, L - 2 * offset, W - 2 * offset);

  fill(0, 0, 0);
  strokeWeight(0);
  text("Initial length (m): " + lSlider.value().toFixed(2), 110, 25);
  text("Spring rest length (m): " + l0Slider.value().toFixed(2), 110, 45);
  text("Spring constant (N/m): " + kSlider.value().toFixed(2), 110, 65);
  text("Mass (kg)", 95, 384);
  text("Initial angle (°)", 2 * L / 3 - 180, 384)
  text("Frameskip : " + fSlider.value(), L / 3 - 50, 374)

  strokeWeight(3);
  stroke(0, 0, 0);

  //line of suspension of pendulum
  strokeWeight(1);
  fill(125);
  rect(par.hinge[0] - 10, par.hinge[1] - 10, 20, 20);
  fill(0);
  ellipse(...par.hinge, 5, 5);
  stroke(0);
  strokeWeight(2);

  //trajectory
  stroke(50)
  for (let i = 0; i < pos.length - 1; i++) {
    line(...pos[i], ...pos[i + 1]);
  }

  stroke(0)
  //pendulum
  linedash(...par.hinge, par.hinge[0] + scale * par.r * sin(par.theta), par.hinge[1] + scale * par.r * cos(par.theta), [5])
  fill(51, 153, 255); //Plots the pendulum
  ellipse(par.hinge[0] + scale * par.r * sin(par.theta), par.hinge[1] + scale * par.r * cos(par.theta), 15 * (par.mass) ** 0.25, 15 * (par.mass) ** 0.25);
  pos.push([par.hinge[0] + scale * par.r * sin(par.theta), par.hinge[1] + scale * par.r * cos(par.theta)]);

  //update values of parameters
  par.l0 = l0Slider.value();
  par.k = kSlider.value() / 100;


  //code to evolve in time; Euler scheme
  for (let i = 0; i < fSlider.value(); i++) {
    par.v += (par.g * cos(par.theta) - par.k * (par.r - par.l0) / par.mass + par.r * par.omega ** 2) * par.dt;
    par.omega += (-par.g * sin(par.theta) - 2 * par.v * par.omega) * par.dt / par.r;

    par.r += par.v * par.dt;
    par.theta += par.omega * par.dt;
    count++;
  }

  //plotting the data
  plot1.addPoint(new GPoint(par.r, par.v));
  plot2.addPoint(new GPoint(par.theta, par.omega));

  plot1.beginDraw();
  plot1.drawBox();
  plot1.drawXAxis();
  plot1.drawYAxis();
  plot1.drawTitle();
  plot1.drawLines();
  plot1.endDraw();
  plot2.beginDraw();
  plot2.drawBox();
  plot2.drawXAxis();
  plot2.drawYAxis();
  plot2.drawTitle();
  plot2.drawLines();
  plot2.endDraw();

}
