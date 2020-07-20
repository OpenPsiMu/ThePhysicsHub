let button;
let bg = 224;
let scale = 100;

let aSlider, tSlider, lSlider; //Sliders

let simPar = {
  theta: 0.1, //angle
  omega: 0, //angular velocity
  alpha: 0, //angular acceleration
  dt: 0.01, // Initial time step size
  mass: 0.5, // mass in kg
  length: 1, // Pendulum length
  hinge: [200, 75], //hinge location
  g: 9.8 / 3600 //g adjusted
};

function linedash(x1, y1, x2, y2, list) {
  drawingContext.setLineDash(list); // set the "dashed line" mode
  line(x1, y1, x2, y2); // draw the line
  drawingContext.setLineDash([]); // reset into "solid line" mode
}

function setup() {
  var cnv = createCanvas(400, 400);
  cnv.parent('simwrapper');
  textSize(10);



  button = createButton('Start'); //START button
  button.position(270, 325);
  button.mousePressed(() => { //Updates values only when START is pressed
    simPar.theta = aSlider.value();
    simPar.dt = tSlider.value();
    simPar.length = lSlider.value();
    simPar.omega = 0;
    simPar.alpha = 0;
  })

  aSlider = createSlider(-3.14 / 2, 3.14 / 2, 3.14 / 4, 0.01); //angle slider
  aSlider.position(10, 10);
  aSlider.style('width', '90px');
  aSlider.parent('simwrapper');

  tSlider = createSlider(0.01, 1, 0.5, 0.01); //dt slider
  tSlider.position(140, 10);
  tSlider.style('width', '90px');
  tSlider.parent('simwrapper');

  lSlider = createSlider(0.01, 2, 1, 0.01); //length slider
  lSlider.position(270, 10);
  lSlider.style('width', '90px');
  lSlider.parent('simwrapper');
}

function draw() {
  //Setting up text

  background(bg);
  fill(135, 135, 154);
  rect(0, 0, 400, simPar.hinge[1])

  fill(0, 0, 0);
  text("Angle in degrees:", 10, 40);
  text((aSlider.value() * 360 / (2 * PI)).toFixed(2), 100, 40);

  text("dt in seconds:", 140, 40);
  text(tSlider.value().toFixed(2), 213, 40);

  text("length in m: ", 270, 40);
  text(lSlider.value().toFixed(2), 336, 40);

  stroke(0, 0, 0);
  line(0, simPar.hinge[1], 400, simPar.hinge[1]); //Plots background lines
  line(simPar.hinge[0], simPar.hinge[1], simPar.hinge[0] + scale * simPar.length * sin(simPar.theta), simPar.hinge[1] + scale * simPar.length * cos(simPar.theta));
  linedash(simPar.hinge[0], simPar.hinge[1], simPar.hinge[0], simPar.hinge[1] + scale * simPar.length, [5])

  fill(51, 153, 255); //Plots the pendulum
  ellipse(simPar.hinge[0] + scale * simPar.length * sin(simPar.theta), simPar.hinge[1] + scale * simPar.length * cos(simPar.theta), 20, 20);
  ellipse(simPar.hinge[0], simPar.hinge[1], 5, 5)


  fill(153, 204, 255); //plots the arc of angle made with vertical
  stroke(0, 0, 0);
  if (simPar.theta > 0) {
    arc(simPar.hinge[0], simPar.hinge[1], scale * simPar.length / 2, scale * simPar.length / 2, PI / 2 - simPar.theta, PI / 2);
  } else {
    arc(simPar.hinge[0], simPar.hinge[1], scale * simPar.length / 2, scale * simPar.length / 2, PI / 2, PI / 2 - simPar.theta);
  }
  noStroke();

  //rect(45, 325, 90, 20); //experimental; to display time
  //fill(color(255, 255, 255))
  //text("Time: " + (nIter++ * simPar.dt).toFixed(2) + " secs", 50, 340)
  simPar.length = lSlider.value();

  simPar.alpha = -simPar.g * sin(simPar.theta) / simPar.length;
  simPar.omega += simPar.alpha * simPar.dt;
  simPar.theta += simPar.omega * simPar.dt;

}