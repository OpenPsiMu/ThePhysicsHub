let W = 1200 //background canvas width
let H = 500 //background canvas height
let Wsim = W * 0.69 //sim canvas width
let Hsim = H //sim canvas height
let Wplot = 0.25 * W //plotting canvas width
let Hplot = 0.875 * H //plotting canvas height

let scale = 100; //scaling factor for display on canvas ( 1 meter = x pixels)

let pos1, pos2; //last two position points for tracing background
let plot1, plot2; //phase plots
let plot1Point, plot2Point; //last point plotted on the phase plots

let dd15; //length display row

let l0Slider, gSlider, kSlider, sSlider, fSlider, mSlider, cButton, checkbox1;
//rest length, gravity, spring const, scale, frameskip, mass, clear, showplots

let par = {
  theta: 0, //angle
  omega: 0, //angular velocity
  r: 0.5, //radius
  v: 0, //radial velocity
  k: 9.8 / 100, //spring constant
  l0: 0.5, //spring rest length
  dt: 0.001, //time step
  mass: 1, //mass
  g: 9.8 / 100, //adjusted g
  hinge: [217, 136], //hinge position
  radius: 30 //radius of bob
}


function setup() {
  let bgCanvas = createCanvas(W, H)
  bgCanvas.parent("simwrapper") //wrapping the canvas so elements appear relative to canvas and not the webpage.

  // --constructing the dropdown menu--

  let dd = makeDropdown(bgCanvas);
  dd.parentElement.children[1].innerHTML = "Options";
  let dd1 = makeItem(dd);
  dd1.parentElement.children[1].innerHTML = "Parameters";

  //Length
  dd15 = makeRow(dd1)
  dd15.innerHTML = "Initial length (m) = " + Number(par.r).toFixed(2);

  //Mass
  let dd11 = makeRow(dd1);
  let mSliderContainer = makeSlider(dd11);
  mSlider = mSliderContainer['slider'];
  mSliderContainer['label'].innerHTML = "Mass";
  [mSlider.min, mSlider.max, mSlider.step, mSlider.value] = [1, 10, 0.1, 1]
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
    par.g = gSlider.value / 100
  }

  //Rest length of spring
  let dd13 = makeRow(dd1);
  let l0SliderContainer = makeSlider(dd13);
  l0Slider = l0SliderContainer['slider'];
  l0SliderContainer['label'].innerHTML = "Spring rest length";
  [l0Slider.min, l0Slider.max, l0Slider.step, l0Slider.value] = [0.1, 2.00, 0.01, 1.0]
  l0SliderContainer['valueLabel'].innerHTML = l0Slider.value;
  l0Slider.oninput = () => {
    l0SliderContainer["valueLabel"].innerHTML = Number(l0Slider.value).toFixed(2)
    par.l0 = l0Slider.value
  }

  //Spring constant
  let dd14 = makeRow(dd1);
  let kSliderContainer = makeSlider(dd14);
  kSlider = kSliderContainer['slider'];
  kSliderContainer['label'].innerHTML = "Spring constant";
  [kSlider.min, kSlider.max, kSlider.step, kSlider.value] = [10, 100, 1, 9.8]
  kSliderContainer['valueLabel'].innerHTML = kSlider.value;
  kSlider.oninput = () => {
    kSliderContainer["valueLabel"].innerHTML = Number(kSlider.value).toFixed(2)
    par.k = kSlider.value / 100
  }

  //plot toggle
  let dd2 = makeItem(dd);
  dd2.parentElement.children[1].innerHTML = "UI";
  let dd21 = makeRow(dd2);
  let checkboxContainer = makeCheckbox(dd21);
  checkbox1 = checkboxContainer['checkbox'];
  checkboxContainer['label'].innerHTML = "Show plots";
  checkbox1.checked = true
  checkbox1.onchange = () => {
    plot1.getMainLayer().points = [];
    plot2.getMainLayer().points = [];
  }

  //Scale of display
  let dd22 = makeRow(dd2);
  let sSliderContainer = makeSlider(dd22);
  sSlider = sSliderContainer['slider'];
  sSliderContainer['label'].innerHTML = "Scale";
  [sSlider.min, sSlider.max, sSlider.step, sSlider.value] = [1, 300, 1, 100]
  sSliderContainer['valueLabel'].innerHTML = sSlider.value;
  sSlider.oninput = () => {
    sSliderContainer["valueLabel"].innerHTML = Number(sSlider.value).toFixed(2)
    scale = sSlider.value
    traceCanvas.clear()
  }

  //Simulation speed
  let dd23 = makeRow(dd2);
  let fSliderContainer = makeSlider(dd23);
  fSlider = fSliderContainer['slider'];
  fSliderContainer['label'].innerHTML = "Simulation speed";
  [fSlider.min, fSlider.max, fSlider.step, fSlider.value] = [1, 500, 5, 200]
  fSliderContainer['valueLabel'].innerHTML = fSlider.value;
  fSlider.oninput = () => {
    fSliderContainer["valueLabel"].innerHTML = Number(fSlider.value).toFixed(2)
  }

  //clear plots
  let dd24 = makeRow(dd2)
  let cButtonContainer1 = new buttonContainer(dd24);
  cButton = cButtonContainer1.makeButton("Clear plots", () => {
    plot1.getMainLayer().points = [];
    plot2.getMainLayer().points = [];
  });

  setDropdownStyle(bgCanvas) //styling the dropdown elements

  //--end construction of dropdown menu--

  simCanvas = createGraphics(Wsim, Hsim)

  traceCanvas = createGraphics(Wsim, Hsim) //setting up tracecanvas
  traceCanvas.translate(...par.hinge)

  plotCanvas = createGraphics(Wplot, Hplot) //setting up plot canvas
  plotCanvas.background(20)
  plotCanvas.stroke(255)
  plotCanvas.strokeWeight(3)
  plotCanvas.noFill()
  plotCanvas.rect(0, 0, Wplot, Hplot)

  plot1 = new GPlot(plotCanvas); //setting up tangential vel vs pos phase plot
  plot1.setLineColor(255);
  plot1.setBoxBgColor(20);
  plot1.title.fontColor = 255;
  plot1.title.fontSize = 15
  plot1.title.fontStyle = NORMAL
  plot1.title.fontName = "sans-serif"
  plot1.title.offset = 2
  plot1.setPointColor(255);
  plot1.setPointSize(7);

  plot1.setPos(0, 0);
  plot1.setMar(10, 10, 22, 10);
  plot1.setOuterDim(Wplot, Hplot / 2);
  plot1.setTitleText("Phase-space (v/r)")

  plot2 = new GPlot(plotCanvas); //setting up angular vel vs pos phase plot
  plot2.setLineColor(255);
  plot2.setBoxBgColor(20);
  plot2.title.fontColor = 255;
  plot2.title.fontSize = 15
  plot2.title.fontStyle = NORMAL
  plot2.title.fontName = "sans-serif"
  plot2.title.offset = 2
  plot2.setPointColor(255);
  plot2.setPointSize(7);

  plot2.setPos(0, Hplot / 2);
  plot2.setMar(10, 10, 22, 10);
  plot2.setOuterDim(Wplot, Hplot / 2);
  plot2.setTitleText("Phase-space (w/Q)")

  //plotting grids over simCanvas
  gridCanvas = createGraphics(Wsim, Hsim)
  let nDiv = 8
  gridCanvas.clear()
  gridCanvas.stroke(150)
  gridCanvas.strokeWeight(1)
  for (let i = 0; i < nDiv; i++) {
    gridCanvas.line(10 + i * Wsim / nDiv, 10, 10 + i * Wsim / nDiv, Hsim - 10)
    gridCanvas.line(10, 10 + i * Hsim / nDiv, Wsim - 10, 10 + i * Hsim / nDiv)
  }

  //initialize first points in traceCanvas
  pos1 = [scale * par.r * sin(par.theta), scale * par.r * cos(par.theta)];
  pos2 = [...pos1]
}

function draw() {
  background(20)

  //outer rectangle
  simCanvas.clear()
  simCanvas.stroke(255)
  simCanvas.strokeWeight(2)
  simCanvas.noFill()
  simCanvas.rect(10, 10, Wsim - 20, Hsim - 20)

  //hinge
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

  //pendulum
  drawSpring(0, 0, scale * par.r * sin(par.theta), scale * par.r * cos(par.theta), 50, simCanvas)

  simCanvas.fill(20)
  simCanvas.ellipse(scale * par.r * sin(par.theta), scale * par.r * cos(par.theta), par.radius, par.radius)

  simCanvas.pop()

  //plotting the trace of the pendulum's path
  pos1 = [scale * par.r * sin(par.theta), scale * par.r * cos(par.theta)]
  traceCanvas.stroke(200)
  traceCanvas.strokeWeight(1)
  traceCanvas.line(...pos1, ...pos2);
  pos2 = [...pos1]

  //grid lines
  image(gridCanvas, 0, 0)
  //background lines
  image(traceCanvas, 0, 0)
  //sim canvas
  image(simCanvas, 0, 0);

  //plotting canvas
  if (checkbox1.checked) {
    //plotting the data
    plot1Point = new GPoint(par.r, par.v)
    plot1.addPoint(plot1Point);

    plot2Point = new GPoint(par.theta, par.omega)
    plot2.addPoint(plot2Point);

    image(plotCanvas, Wsim - Wplot - 30, 30)
  }

  //code to evolve in time; Euler scheme
  for (let i = 0; i < fSlider.value; i++) {
    par.v += (par.g * cos(par.theta) - par.k * (par.r - par.l0) / par.mass + par.r * par.omega ** 2) * par.dt;
    par.omega += (-par.g * sin(par.theta) - 2 * par.v * par.omega) * par.dt / par.r;

    par.r += par.v * par.dt;
    par.theta += par.omega * par.dt;
  }

  //plotting the grafica plots
  plot1.beginDraw();
  plot1.drawBox();
  plot1.drawTitle();
  plot1.drawPoint(plot1Point);
  plot1.drawLines();
  plot1.endDraw();

  plot2.beginDraw();
  plot2.drawBox();
  plot2.drawTitle();
  plot2.drawPoint(plot2Point);
  plot2.drawLines();
  plot2.endDraw();
}

//setting initial conditions on mouse click
function mouseClicked() {
  if (mouseX > 0 && mouseX < Wsim && mouseY > 0 && mouseY < Hsim) {
    par.r = ((mouseX - par.hinge[0]) ** 2 + (mouseY - par.hinge[1]) ** 2) ** 0.5 / scale
    par.theta = PI / 2 - atan2((mouseY - par.hinge[1]), (mouseX - par.hinge[0]))
    par.omega = 0
    par.v = 0
    pos1 = [scale * par.r * sin(par.theta), scale * par.r * cos(par.theta)]
    pos2 = [...pos1]

    plot1.getMainLayer().points = [];
    plot2.getMainLayer().points = [];
    traceCanvas.clear()
    dd15.innerHTML = "Initial length (m) = " + Number(par.r).toFixed(2);
  }
}
