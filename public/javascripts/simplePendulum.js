let W = 1200 //background canvas width
let H = 500 //background canvas height
let Wsim = W * 0.69 //sim canvas width
let Hsim = H //sim canvas height
let Wplot = 0.25 * W //plotting canvas width
let Hplot = 0.875 * H //plotting canvas height

let scale = 200; //scaling factor for display on canvas ( 1 meter = x pixels)

let timestep = 0 //number of timesteps progressed
let numP = 0 //keeping track of number of points on plot
let dd14; //display row for length
let plot1, plot2; //energy plot, phase plot
let plot2Point; //latest point to be added to phase plot


let tSlider, mSlider, FSlider, wSlider, gSlider, bSlider, pSlider, checkbox1, sSlider, fSlider; //all elements in dropdown

let par = {
  theta: 0.785, // Angle
  omega: 0, // Angular velocity
  alpha: 0, // Angular acceleration
  dt: 0.001, // Initial time step size
  mass: 0.5, // Mass in kg
  length: 1, // Pendulum length
  hinge: [217, 136], // Hinge location
  g: 9.8 / 3600, // g adjusted
  radius: 30, //radius of bob
  b: 0 //drag coefficient
};


function setup() {

  let bgCanvas = createCanvas(W, H)
  bgCanvas.parent("simwrapper") //wrapping the canvas so elements appear relative to canvas and not the webpage.

  // --constructing the dropdown menu--

  let dd = makeDropdown(bgCanvas);
  dd.parentElement.children[1].innerHTML = "Options";
  let dd1 = makeItem(dd);
  dd1.parentElement.children[1].innerHTML = "Parameters";

  //Length
  dd14 = makeRow(dd1)
  dd14.innerHTML = "Length (m) = " + Number(par.length).toFixed(2);

  //Mass
  let dd11 = makeRow(dd1);
  let mSliderContainer = makeSlider(dd11);
  mSlider = mSliderContainer['slider'];
  mSliderContainer['label'].innerHTML = "Mass";
  [mSlider.min, mSlider.max, mSlider.step, mSlider.value] = [0.1, 10, 0.1, 1]
  mSliderContainer['valueLabel'].innerHTML = mSlider.value;  
  mSlider.oninput = () => {
    mSliderContainer["valueLabel"].innerHTML = Number(mSlider.value).toFixed(2)
    par.mass = mSlider.value
    par.radius = 30 * par.mass ** 0.25
  }
  

  //Acceleration due to gravity
  let dd12 = makeRow(dd1);
  let gSliderContainer = makeSlider(dd12);
  gSlider = gSliderContainer['slider'];
  gSliderContainer['label'].innerHTML = "g (m/s^2)";
  [gSlider.min, gSlider.max, gSlider.step, gSlider.value] = [0, 20, 0.1, 9.8]
  gSliderContainer['valueLabel'].innerHTML = gSlider.value;
  gSlider.oninput = () => {
    gSliderContainer["valueLabel"].innerHTML = Number(gSlider.value).toFixed(2)
    par.g = gSlider.value / 3600
  }

  //Drag coefficient
  let dd13 = makeRow(dd1);
  let bSliderContainer = makeSlider(dd13);
  bSlider = bSliderContainer['slider'];
  bSliderContainer['label'].innerHTML = "Drag coefficient";
  [bSlider.min, bSlider.max, bSlider.step, bSlider.value] = [0, 0.005, 0.0005, 0]
  bSliderContainer['valueLabel'].innerHTML = bSlider.value;
  bSlider.oninput = () => {
    bSliderContainer["valueLabel"].innerHTML = Number(bSlider.value).toFixed(2)
    par.b = bSlider.value
  }

  //toggle option for showing plots
  let dd2 = makeItem(dd);
  dd2.parentElement.children[1].innerHTML = "UI";
  let dd21 = makeRow(dd2);
  let checkboxContainer = makeCheckbox(dd21);
  checkbox1 = checkboxContainer['checkbox'];
  checkboxContainer['label'].innerHTML = "Show plots";
  checkbox1.checked = true //plots displayed on startup
  checkbox1.onclick = () => {
    plot1.getMainLayer().points = [] //wipe all data points
    plot2.getMainLayer().points = []
    numP = 0; //reset number of points
    timestep = 0; //reset timestep
  }

  //Scale of display
  let dd22 = makeRow(dd2);
  let sSliderContainer = makeSlider(dd22);
  sSlider = sSliderContainer['slider'];
  sSliderContainer['label'].innerHTML = "Scale";
  [sSlider.min, sSlider.max, sSlider.step, sSlider.value] = [1, 300, 1, 200]
  sSliderContainer['valueLabel'].innerHTML = sSlider.value;
  sSlider.oninput = () => {
    sSliderContainer["valueLabel"].innerHTML = Number(sSlider.value).toFixed(2)
    scale = sSlider.value
  }

  //speed of simulation
  let dd23 = makeRow(dd2);
  let fSliderContainer = makeSlider(dd23);
  fSlider = fSliderContainer['slider'];
  fSliderContainer['label'].innerHTML = "Speed";
  [fSlider.min, fSlider.max, fSlider.step, fSlider.value] = [1, 5000, 5, 1000]
  fSliderContainer['valueLabel'].innerHTML = fSlider.value;
  fSlider.oninput = () => {
    fSliderContainer["valueLabel"].innerHTML = Number(fSlider.value).toFixed(2)
  }


  setDropdownStyle(bgCanvas) //applies styling to dropdown menu.

  //--end construction of dropdown menu--

  simCanvas = createGraphics(Wsim, Hsim)

  plotCanvas = createGraphics(Wplot, Hplot) //setting up the plotting canvas
  plotCanvas.background(20)
  plotCanvas.stroke(255)
  plotCanvas.strokeWeight(3)
  plotCanvas.noFill()
  plotCanvas.rect(0, 0, Wplot, Hplot)

  plot1 = new GPlot(plotCanvas); //setting up plotting window (grafica.js)
  plot1.setLineColor(255);
  plot1.setBoxBgColor(20);
  plot1.title.fontColor = 255;
  plot1.title.fontSize = 15
  plot1.title.fontStyle = NORMAL
  plot1.title.fontName = "sans-serif"
  plot1.title.offset = 2

  plot1.setPos(0, 0);
  plot1.setMar(10, 10, 22, 10);
  plot1.setOuterDim(Wplot, Hplot / 2);
  plot1.setTitleText("KE vs. time")

  plot2 = new GPlot(plotCanvas); //setting up plotting window (grafica.js)
  plot2.setLineColor(255);
  plot2.setBoxBgColor(20);
  plot2.title.fontColor = 255;
  plot2.title.fontSize = 15
  plot2.title.fontStyle = NORMAL
  plot2.title.fontName = "sans-serif"
  plot2.title.offset = 2
  plot2.setPointColor(255);
  plot2.setPointSize(7)

  plot2.setPos(0, Hplot / 2);
  plot2.setMar(10, 10, 22, 10);
  plot2.setOuterDim(Wplot, Hplot / 2);
  plot2.setTitleText("Phase space (w/Q)")

  //drawing static grid over simCanvas
  gridCanvas = createGraphics(Wsim, Hsim)
  let nDiv = 8 // #gridlines

  gridCanvas.clear()
  gridCanvas.stroke(150)
  gridCanvas.strokeWeight(1)
  for (let i = 0; i < nDiv; i++) {
    gridCanvas.line(10 + i * Wsim / nDiv, 10, 10 + i * Wsim / nDiv, Hsim - 10)
    gridCanvas.line(10, 10 + i * Hsim / nDiv, Wsim - 10, 10 + i * Hsim / nDiv)
  }
}

function draw() {
  background(20)

  //drawing outer rectangle
  simCanvas.clear()
  simCanvas.stroke(255)
  simCanvas.strokeWeight(2)
  simCanvas.noFill()
  simCanvas.rect(10, 10, Wsim - 20, Hsim - 20)

  //drawing hinge
  simCanvas.push()
  simCanvas.translate(...par.hinge)
  simCanvas.rect(-15, -15, 30)
  simCanvas.fill(255)
  simCanvas.stroke(0)
  simCanvas.strokeWeight(1)
  simCanvas.ellipse(0, 0, 15, 15)


  simCanvas.stroke(255)
  simCanvas.fill(20)
  simCanvas.strokeWeight(2)

  //drawing vertical normal
  simCanvas.drawingContext.setLineDash([5]); // set the "dashed line" mode
  simCanvas.line(0, 15, 0, 0.5 * scale * par.length); // draw the line
  simCanvas.drawingContext.setLineDash([]); // reset into "solid line" mode

  //drawing pendulum
  simCanvas.line(0, 0, scale * par.length * Math.sin(par.theta), scale * par.length * Math.cos(par.theta))

  simCanvas.ellipse(scale * par.length * Math.sin(par.theta), scale * par.length * Math.cos(par.theta), par.radius, par.radius)

  simCanvas.pop()

  //grid lines
  image(gridCanvas, 0, 0)
  //sim canvas
  image(simCanvas, 0, 0);


  //plotting Updates
  plot1.addPoint(new GPoint(timestep, 0.5 * par.mass * par.omega ** 2 * par.length ** 2));

  plot1.beginDraw();
  plot1.drawBox();
  plot1.drawTitle();
  plot1.drawLines();
  plot1.endDraw();

  plot2Point = new GPoint(par.theta, par.omega)
  plot2.addPoint(plot2Point);

  plot2.beginDraw();
  plot2.drawBox();
  plot2.drawTitle();
  plot2.drawPoint(plot2Point);
  plot2.drawLines();
  plot2.endDraw();

  numP++; //counting number of points on plot. (can also be accessed by plot1.getMainLayer().points.length)

  if (numP > 200) {
    plot1.removePoint(0) //max 200 points on the graph
  }

  //plotting window toggle
  if (checkbox1.checked) {
    image(plotCanvas, Wsim - Wplot - 30, 30)
  }

  //Euler scheme to solve differential equation, aka, the driving physics of the simulation.
  for (let i = 0; i < fSlider.value; i++) {
    par.alpha = -par.g * Math.sin(par.theta) / par.length - par.b * par.omega / par.mass;
    par.omega += par.alpha * par.dt;
    par.theta += par.omega * par.dt;
    timestep++; //tracking number of timesteps
  }

}

//setting initial conditions on mouse click
function mouseClicked() {
  if (mouseX > 0 && mouseX < Wsim && mouseY > 0 && mouseY < Hsim) {
    par.length = ((mouseX - par.hinge[0]) ** 2 + (mouseY - par.hinge[1]) ** 2) ** 0.5 / scale
    par.theta = PI / 2 - Math.atan2((mouseY - par.hinge[1]), (mouseX - par.hinge[0]))
    par.omega = 0
    par.alpha = 0

    plot1.getMainLayer().points = [] //wipe all data points
    plot2.getMainLayer().points = []
    numP = 0; //reset number of points
    timestep = 0; //reset timestep
    dd14.innerHTML = "Length (m) = " + Number(par.length).toFixed(2);
  }
}
