let W = 1200
let H = 500
let Wsim = W * 0.69
let Hsim = H
let Wplot = 0.25 * W
let Hplot = 0.875 * H

let scale = 200;
let timestep = 0;
let numP = 0;
let d, sAngle;
let flag = true;
let pauseflag = false;

let plot1;
let plot2;

let lSlider, a1Slider, a2Slider, dSlider, l0Slider, gSlider, kSlider, sSlider, fSlider, m1Slider, m2Slider, startButton, stopButton, pauseButton, checkbox1;
// length, angle1, angle2, separation length, rest length spring, gravity, spring const, scale, speed/frame, mass1, mass2, start, stop, plot graphs

let par = {
  theta: [0, 0], // [Initial angle 1, Initial angle 2]
  omega: [0, 0],
  alpha: [0, 0],
  dt: 0.001, // Initial time step size
  mass: [1, 1], // [Mass of pendulum 1, Mass of pendulum 2]
  length: [1, 1], // [Pendulum length, Coupling length]
  l0: 1, //spring rest length
  k: 3 / 100, //Spring constant
  center: [269, 136], //midpoint of hinges
  hinge: [
    [169, 136], //hinge of pendulum 1
    [369, 136] //hinge of pendulum 2
  ],
  g: 9.8 / 100,
  radius: [30, 30] //radius of pendulum bob
};

function setup() {
  let bgCanvas = createCanvas(W, H)
  bgCanvas.parent("simwrapper")

  let dd = makeDropdown(bgCanvas);
  dd.parentElement.children[1].innerHTML = "Options";
  let dd1 = makeItem(dd);
  dd1.parentElement.children[1].innerHTML = "Parameters";

  //mass
  let dd11 = makeRow(dd1);
  let m1SliderContainer = makeSlider(dd11);
  m1Slider = m1SliderContainer['slider'];
  m1SliderContainer['label'].innerHTML = "Mass #1";
  [m1Slider.min, m1Slider.max, m1Slider.step, m1Slider.value] = [0.1, 10, 0.1, 1]
  m1SliderContainer['valueLabel'].innerHTML = m1Slider.value;
  m1Slider.oninput = () => {
    m1SliderContainer["valueLabel"].innerHTML = Number(m1Slider.value).toFixed(2)
    par.mass[0] = m1Slider.value
    par.radius[0] = 30 * par.mass[0] ** 0.25
  }

  let dd12 = makeRow(dd1);
  let m2SliderContainer = makeSlider(dd12);
  m2Slider = m2SliderContainer['slider'];
  m2SliderContainer['label'].innerHTML = "Mass #2";
  [m2Slider.min, m2Slider.max, m2Slider.step, m2Slider.value] = [0.1, 10, 0.1, 1]
  m2SliderContainer['valueLabel'].innerHTML = m2Slider.value;
  m2Slider.oninput = () => {
    m2SliderContainer["valueLabel"].innerHTML = Number(m2Slider.value).toFixed(2)
    par.mass[1] = m2Slider.value
    par.radius[1] = 30 * par.mass[1] ** 0.25
  }

  let dd13 = makeRow(dd1);
  let a1SliderContainer = makeSlider(dd13);
  a1Slider = a1SliderContainer['slider'];
  a1SliderContainer['label'].innerHTML = "Initial angle #1";
  [a1Slider.min, a1Slider.max, a1Slider.step, a1Slider.value] = [-90, 90, 0.1, 0]
  a1SliderContainer['valueLabel'].innerHTML = a1Slider.value;
  a1Slider.oninput = () => {
    if (flag) {
      par.theta[0] = radians(a1Slider.value)
    }
    a1SliderContainer["valueLabel"].innerHTML = Number(a1Slider.value).toFixed(2)
  }

  let dd14 = makeRow(dd1);
  let a2SliderContainer = makeSlider(dd14);
  a2Slider = a2SliderContainer['slider'];
  a2SliderContainer['label'].innerHTML = "Initial angle #2";
  [a2Slider.min, a2Slider.max, a2Slider.step, a2Slider.value] = [-90, 90, 0.1, 0]
  a2SliderContainer['valueLabel'].innerHTML = a2Slider.value;
  a2Slider.oninput = () => {
    if (flag) {
      par.theta[1] = radians(a2Slider.value)
    }
    a2SliderContainer["valueLabel"].innerHTML = Number(a2Slider.value).toFixed(2)
  }

  let dd15 = makeRow(dd1);
  let lSliderContainer = makeSlider(dd15);
  lSlider = lSliderContainer['slider'];
  lSliderContainer['label'].innerHTML = "Pendulum length";
  [lSlider.min, lSlider.max, lSlider.step, lSlider.value] = [0.1, 10, 0.1, 1]
  lSliderContainer['valueLabel'].innerHTML = lSlider.value;
  lSlider.oninput = () => {
    if (flag) {
      par.length[0] = Number(lSlider.value)
    }
    lSliderContainer["valueLabel"].innerHTML = Number(lSlider.value).toFixed(2)
  }

  let dd16 = makeRow(dd1);
  let dSliderContainer = makeSlider(dd16);
  dSlider = dSliderContainer['slider'];
  dSliderContainer['label'].innerHTML = "Separation length";
  [dSlider.min, dSlider.max, dSlider.step, dSlider.value] = [0.1, 10, 0.1, 1]
  dSliderContainer['valueLabel'].innerHTML = dSlider.value;
  dSlider.oninput = () => {
    dSliderContainer["valueLabel"].innerHTML = Number(dSlider.value).toFixed(2)
    par.length[1] = Number(dSlider.value)
    par.hinge = [
      [par.center[0] - scale * par.length[1] / 2, par.center[1]],
      [par.center[0] + scale * par.length[1] / 2, par.center[1]]
    ]

    l0Slider.value = dSlider.value
    par.l0 = Number(l0Slider.value)
    l0SliderContainer["valueLabel"].innerHTML = Number(l0Slider.value).toFixed(2)
  }

  let dd17 = makeRow(dd1);
  let l0SliderContainer = makeSlider(dd17);
  l0Slider = l0SliderContainer['slider'];
  l0SliderContainer['label'].innerHTML = "Spring rest length";
  [l0Slider.min, l0Slider.max, l0Slider.step, l0Slider.value] = [0.1, 10, 0.1, 1]
  l0SliderContainer['valueLabel'].innerHTML = l0Slider.value;
  l0Slider.oninput = () => {
    l0SliderContainer["valueLabel"].innerHTML = Number(l0Slider.value).toFixed(2)
    par.l0 = Number(l0Slider.value)
  }

  let dd18 = makeRow(dd1);
  let kSliderContainer = makeSlider(dd18);
  kSlider = kSliderContainer['slider'];
  kSliderContainer['label'].innerHTML = "Spring constant";
  [kSlider.min, kSlider.max, kSlider.step, kSlider.value] = [0, 5, 0.1, 3.0]
  kSliderContainer['valueLabel'].innerHTML = kSlider.value;
  kSlider.oninput = () => {
    kSliderContainer["valueLabel"].innerHTML = Number(kSlider.value).toFixed(2)
    par.k = kSlider.value / 100
  }

  let dd19 = makeRow(dd1);
  let gSliderContainer = makeSlider(dd19);
  gSlider = gSliderContainer['slider'];
  gSliderContainer['label'].innerHTML = "g";
  [gSlider.min, gSlider.max, gSlider.step, gSlider.value] = [0, 100, 0.1, 9.8]
  gSliderContainer['valueLabel'].innerHTML = gSlider.value;
  gSlider.oninput = () => {
    gSliderContainer["valueLabel"].innerHTML = Number(gSlider.value).toFixed(2)
    par.g = gSlider.value / 100
  }


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
    numP = 0;
  }

  let dd22 = makeRow(dd2);
  let sSliderContainer = makeSlider(dd22);
  sSlider = sSliderContainer['slider'];
  sSliderContainer['label'].innerHTML = "Scale";
  [sSlider.min, sSlider.max, sSlider.step, sSlider.value] = [1, 300, 1, 200]
  sSliderContainer['valueLabel'].innerHTML = sSlider.value;
  sSlider.oninput = () => {
    sSliderContainer["valueLabel"].innerHTML = Number(sSlider.value).toFixed(2)
    scale = sSlider.value
    par.hinge = [
      [par.center[0] - scale * par.length[1] / 2, par.center[1]],
      [par.center[0] + scale * par.length[1] / 2, par.center[1]]
    ]
  }

  let dd23 = makeRow(dd2);
  let fSliderContainer = makeSlider(dd23);
  fSlider = fSliderContainer['slider'];
  fSliderContainer['label'].innerHTML = "Speed";
  [fSlider.min, fSlider.max, fSlider.step, fSlider.value] = [0, 1000, 5, 0]
  fSliderContainer['valueLabel'].innerHTML = fSlider.value;
  fSlider.oninput = () => {
    if (flag || pauseflag) {
      fSlider.value = 0;
    }
    fSliderContainer["valueLabel"].innerHTML = Number(fSlider.value).toFixed(2)
  }

  let dd24 = makeRow(dd2)
  let startButtonContainer1 = new buttonContainer(dd24);
  startButton = startButtonContainer1.makeButton("Start", () => {
    flag = false;
    pauseflag = false;
    fSlider.value = 300;
    fSliderContainer["valueLabel"].innerHTML = Number(fSlider.value).toFixed(2)
    dd27.innerHTML = "Running. Stop to change initial angles."
  });

  let dd25 = makeRow(dd2)
  let pauseButtonContainer1 = new buttonContainer(dd25);
  pauseButton = pauseButtonContainer1.makeButton("Pause", () => {
    fSlider.value = 0;
    pauseflag = true;
    fSliderContainer["valueLabel"].innerHTML = Number(fSlider.value).toFixed(2)
    dd27.innerHTML = "Paused. Start to continue."
  });

  let dd26 = makeRow(dd2)
  let stopButtonContainer1 = new buttonContainer(dd26);
  stopButton = stopButtonContainer1.makeButton("Stop", () => {
    flag = true;
    fSlider.value = 0;
    par.theta = [radians(a1Slider.value), radians(a2Slider.value)]
    par.omega = [0, 0]
    par.alpha = [0, 0]
    fSliderContainer["valueLabel"].innerHTML = Number(fSlider.value).toFixed(2)
    dd27.innerHTML = "Stopped. Change initial angles now."
    plot1.getMainLayer().points = [];
    plot2.getMainLayer().points = [];
    numP = 0;
  });

  let dd27 = makeRow(dd2)
  dd27.innerHTML = "Stopped. Change initial angles now."

  setDropdownStyle(bgCanvas)
  simCanvas = createGraphics(Wsim, Hsim)

  plotCanvas = createGraphics(Wplot, Hplot)
  plotCanvas.background(20)
  plotCanvas.stroke(255)
  plotCanvas.strokeWeight(3)
  plotCanvas.noFill()
  plotCanvas.rect(0, 0, Wplot, Hplot)

  plot1 = new GPlot(plotCanvas);
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
  plot1.setTitleText("KE1 vs time")

  plot2 = new GPlot(plotCanvas);
  plot2.setLineColor(255);
  plot2.setBoxBgColor(20);
  plot2.title.fontColor = 255;
  plot2.title.fontSize = 15
  plot2.title.fontStyle = NORMAL
  plot2.title.fontName = "sans-serif"
  plot2.title.offset = 2

  plot2.setPos(0, Hplot / 2);
  plot2.setMar(10, 10, 22, 10);
  plot2.setOuterDim(Wplot, Hplot / 2);
  plot2.setTitleText("KE2 vs time")

  gridCanvas = createGraphics(Wsim, Hsim)
  let nDiv = 8
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
  //outer rectangle
  simCanvas.clear()
  simCanvas.stroke(255)
  simCanvas.strokeWeight(2)
  simCanvas.noFill()
  simCanvas.rect(10, 10, Wsim - 20, Hsim - 20)

  simCanvas.fill(20)
  simCanvas.strokeWeight(2)
  drawSpring(par.hinge[0][0] + scale * par.length[0] * Math.sin(par.theta[0]), par.hinge[0][1] + scale * par.length[0] * Math.cos(par.theta[0]), par.hinge[1][0] + scale * par.length[0] * Math.sin(par.theta[1]), par.hinge[1][1] + scale * par.length[0] * Math.cos(par.theta[1]), 50, simCanvas)

  simCanvas.push()
  simCanvas.translate(...par.hinge[0])
  //plotting hinge #1
  simCanvas.stroke(255)
  simCanvas.fill(20)
  simCanvas.rect(-15, -15, 30)
  simCanvas.fill(255)
  simCanvas.stroke(20)
  simCanvas.strokeWeight(2)
  simCanvas.ellipse(0, 0, 15, 15)

  //plotting pendulum #1
  simCanvas.stroke(255)
  simCanvas.fill(20)
  simCanvas.line(0, 0, scale * par.length[0] * Math.sin(par.theta[0]), scale * par.length[0] * Math.cos(par.theta[0]))
  simCanvas.ellipse(scale * par.length[0] * Math.sin(par.theta[0]), scale * par.length[0] * Math.cos(par.theta[0]), par.radius[0], par.radius[0])

  //vertical normal #1
  simCanvas.drawingContext.setLineDash([5]); // set the "dashed line" mode
  simCanvas.line(0, 15, 0, 0.5 * scale * par.length[0]); // draw the line
  simCanvas.drawingContext.setLineDash([]); // reset into "solid line" mode

  simCanvas.translate(scale * par.length[1], 0)
  //plotting hinge #2
  simCanvas.stroke(255)
  simCanvas.fill(20)
  simCanvas.strokeWeight(2)
  simCanvas.rect(-15, -15, 30)
  simCanvas.fill(255)
  simCanvas.stroke(20)
  simCanvas.strokeWeight(2)
  simCanvas.ellipse(0, 0, 15, 15)

  //plotting pendulum #2
  simCanvas.fill(20)
  simCanvas.stroke(255)
  simCanvas.line(0, 0, scale * par.length[0] * Math.sin(par.theta[1]), scale * par.length[0] * Math.cos(par.theta[1]))
  simCanvas.ellipse(scale * par.length[0] * Math.sin(par.theta[1]), scale * par.length[0] * Math.cos(par.theta[1]), par.radius[1], par.radius[1])

  //vertical normal #1
  simCanvas.drawingContext.setLineDash([5]); // set the "dashed line" mode
  simCanvas.line(0, 15, 0, 0.5 * scale * par.length[0]); // draw the line
  simCanvas.drawingContext.setLineDash([]); // reset into "solid line" mode

  simCanvas.pop();

  //grid lines
  image(gridCanvas, 0, 0)
  //sim canvas
  image(simCanvas, 0, 0);

  //plot canvas
  if (checkbox1.checked) {
    //plotting the data
    plot1.addPoint(new GPoint(timestep, 0.5 * par.mass[0] * par.length[0] ** 2 * par.omega[0] ** 2));
    plot2.addPoint(new GPoint(timestep, 0.5 * par.mass[1] * par.length[0] ** 2 * par.omega[1] ** 2));

    if (!pauseflag) {
      numP++;
    }

    if (numP > 500 && !pauseflag) {
      plot1.removePoint(0);
      plot2.removePoint(0);
    }

    plot1.beginDraw();
    plot1.drawBox();
    plot1.drawTitle();
    plot1.drawLines();
    plot1.endDraw();

    plot2.beginDraw();
    plot2.drawBox();
    plot2.drawTitle();
    plot2.drawLines();
    plot2.endDraw();

    image(plotCanvas, Wsim - Wplot - 30, 30)
  }

  for (let i = 0; i < fSlider.value; i++) {
    d = ((par.length[0] * (Math.cos(par.theta[0]) - Math.cos(par.theta[1]))) ** 2 + (par.length[1] + par.length[0] * Math.sin(par.theta[1]) - par.length[0] * Math.sin(par.theta[0])) ** 2) ** 0.5;
    sAngle = Math.atan((-Math.cos(par.theta[1]) + Math.cos(par.theta[0])) / (par.length[1] / par.length[0] + Math.sin(par.theta[1]) - Math.sin(par.theta[0])));

    par.alpha[0] = -par.g * Math.sin(par.theta[0]) / par.length[0] + par.k * (d - par.l0) * Math.cos(par.theta[0] - sAngle) / (par.mass[0] * par.length[0]);
    par.alpha[1] = -par.g * Math.sin(par.theta[1]) / par.length[0] - par.k * (d - par.l0) * Math.cos(par.theta[1] - sAngle) / (par.mass[1] * par.length[0]);
    par.omega[0] += par.alpha[0] * par.dt;
    par.omega[1] += par.alpha[1] * par.dt;
    par.theta[0] += par.omega[0] * par.dt;
    par.theta[1] += par.omega[1] * par.dt;
    timestep++;
  }

}
