QuickSettings.useExtStyleSheet();
//Movement function
let fr = 0;
let fps = 0;

var cam;

function preload() {
  font = loadFont('OpenSans-SemiBold.ttf');
}

//CONSTANTSt
//step size
const h = 0.0001;

csc = x => 1 / Math.sin(x)
cot = x => 1 / Math.tan(x)

//speed of simulation (how many times it runs every draw loop)
//Initialise variables for maths

var pi = 3.141592653589793238462643383279502884197169399375105820974944592307816406286208998628034825342117067982148086513282306647093844609550582231725359408128481117450284102701938521105559644622948954930381964428810975665933446128475648233786783165271201909145648566923460348610454326648213393607260249141273724587006606315588174881520920962829254091715364367892590360011330530548820466521384146951941511609433057270365759591;

var displayed = {
  //Masses of pendulum bobs
  θ1: pi / 2,
  θ1Min: 0.01,
  θ1Max: 2 * pi,
  θ1Step: 0.01,

  φ1: pi,
  φ1Min: 0.01,
  φ1Max: 2 * pi,
  φ1Step: 0.01,

  mass_1: 20,
  mass_1Min: 10,
  mass_1Max: 50,
  mass_1Step: 5,

  //Lengths of each pendulum
  length_1: 125,
  length_1Min: 25,
  length_1Max: 500,
  length_1Step: 5,

  θ2: pi / 8,
  θ2Min: 0.01,
  θ2Max: pi * 2,
  θ2Step: 0.01,

  φ2: pi / 6,
  φ2Min: 0.01,
  φ2Max: pi * 2,
  φ2Step: 0.01,

  mass_2: 20,
  mass_2Min: 10,
  mass_2Max: 50,
  mass_2Step: 5,


  length_2: 125,
  length_2Min: 25,
  length_2Max: 500,
  length_2Step: 5,

  g: 9.8,
  gMin: 0,
  gMax: 50,
  gStep: 0.1,

}

var vars = {
  s1: pi / 2,
  t1: 0,
  u1: pi / 6,
  v1: 0,
  s2: pi / 4,
  t2: 0,
  u2: pi / 2,
  v2: 0,
  m1: 20,
  m2: 20,
  l1: 125,
  l2: 125,
  g: 9.8,
}

var advancedMenu = {
  //Camera Zoom
  zoom: 2250,
  zoomMin: 150,
  zoomMax: 2750,
  zoomStep: 50,
  
  stepSize: 0.0001,
  steSizeMin: 0.00002,
  stepSizeMax: 0.0001,
  stepSizeStep: 0.000001,

  speed: 1200,
  speedMin: 600,
  speedMax: 2400,
  speedStep: 50,

  trail1: [84, 50, 130],
  trail2: [253, 0, 89],

  showAxis: true,
  showTrails: true,
  dampening: false,

}


var sim1 = false;
var sim2 = true;
var visible = true;

var advanced_menu = false;
var checker = advanced_menu;


function setup() {
  scale(1, -1);
  createCanvas(500, 500, WEBGL);
  smooth();
  cam = createEasyCam();

  setLockedRotationShift();

  main = createGui("Controls");
  main.addObject(displayed);
  main.addGlobals('advanced_menu');
  main.setPosition(510, 0);
  main.prototype.setGlobalChangeHandler(guiClicked);

  advanced = createGui("advanced");
  advanced.addObject(advancedMenu);
  advanced.setPosition(715, 0);


  welcome = createGui("Welcome");
  welcome.prototype.addHTML("Hi there", "Welcome to the double spherical pendulum simulation <br><br> Controls: <ul><li>Space - play/pause</li><li>P - hide/show controls </li><li>Drag - move camera</li><li>Double Tap - reset camera</li></ul>");
  welcome.prototype.addButton("Hide", function(value) {
    welcome.hide()
  });
  welcome.setPosition(width / 2 - 100, height / 4);

  p1 = new Particle(0, 0, 0);
  p2 = new Particle(0, 0, 0);

  pixelDensity(2);

}

function pendulum(x1, y1, z1, x2, y2, z2) {
  //larger strokeweight for pendulum
  strokeWeight(1.5);
  //white stroke
  stroke(255);
  //first pendulum line
  line(0, 0, 0, x1, y1, z1);
  //translate so can place sphere
  translate(x1, y1, z1);
  strokeWeight(0.001);
  noStroke();
  fill(255);
  sphere(vars.m1 / 1.5);
  //reverse translation
  translate(-x1, -y1, -z1);
  //draw second line
  strokeWeight(1.5);
  stroke(255);
  line(x1, y1, z1, x2, y2, z2);
  translate(x2, y2, z2);
  strokeWeight(0.01)
  sphere(vars.m2 / 1.5);
  //reverse translation
  translate(-x2, -y2, -z2);
}

function axis() {
  // A  X   I   S
  strokeWeight(2);
  //Y - RED
  stroke(255, 0, 0);
  line(0, 0, 0, 0, 250, 0);
  stroke(150, 0, 0);
  line(0, 0, 0, 0, -250, 0);

  //X - GREEN
  stroke(0, 255, 0);
  line(0, 0, 0, 250, 0, 0);
  stroke(0, 150, 0);
  line(0, 0, 0, -250, 0, 0);

  //Z - BLUE
  stroke(0, 0, 255);
  line(0, 0, 0, 0, 0, 250);
  stroke(0, 0, 150);
  line(0, 0, 0, 0, 0, -250);
}

let storeAdvanced = true;
//pause function
function keyPressed() {
  switch (keyCode) {
    case 32:
      sim1 = !sim1;
      sim2 = true;
      //console.log(sim2)
      break;
    case 80:
      visible = !visible;
      if (visible) {
        main.show();
        storeAdvanced = true;
      } else {
        main.hide();
        storeAdvanced = false;
      }
      break;
    case 71:
      console.log("not finished");
  }
}


//Functions of the equations of motion
function s1d(t1) {
  return t1;
}

function t1d(s1, t1, u1, v1, s2, t2, u2, v2) {
  return (8 * (vars.g * (-4 * vars.m1 - 3 * vars.m2 - 2 * vars.m2 * Math.cos(2 * s2) * Math.pow(Math.cos(u1 - u2), 2) + vars.m2 * Math.cos(2 * (u1 - u2))) * Math.sin(s1) + 4 * vars.l2 * vars.m2 * Math.pow(t2, 2) * (-(Math.cos(s2) * Math.sin(s1)) + Math.cos(s1) * Math.cos(u1 - u2) * Math.sin(s2)) + 4 * vars.l2 * vars.m2 * Math.pow(v2, 2) * Math.pow(Math.sin(s2), 2) * (-(Math.cos(s2) * Math.sin(s1)) + Math.cos(s1) * Math.cos(u1 - u2) * Math.sin(s2)) + 2 * vars.g * vars.m2 * Math.cos(s1) * Math.cos(u1 - u2) * Math.sin(2 * s2) + vars.l1 * Math.pow(v1, 2) * ((2 * vars.m1 + vars.m2 - vars.m2 * Math.cos(2 * s2)) * Math.sin(2 * s1) - 2 * vars.m2 * Math.cos(u1 - u2) * Math.pow(Math.sin(s1), 2) * Math.sin(2 * s2)) - vars.l1 * vars.m2 * Math.pow(t1, 2) * (Math.cos(s1) * Math.cos(2 * s2) * (3 + Math.cos(2 * (u1 - u2))) * Math.sin(s1) - 2 * Math.cos(2 * s1) * Math.cos(u1 - u2) * Math.sin(2 * s2) + Math.sin(2 * s1) * Math.pow(Math.sin(u1 - u2), 2)))) / (4 * vars.l1 * (8 * vars.m1 + 5 * vars.m2) - 2 * vars.l1 * vars.m2 * (2 * Math.cos(2 * s1) + 3 * Math.cos(2 * (s1 - s2)) + 2 * Math.cos(2 * s2) + 3 * Math.cos(2 * (s1 + s2)) + 8 * Math.cos(2 * (u1 - u2)) * Math.pow(Math.sin(s1), 2) * Math.pow(Math.sin(s2), 2) + 8 * Math.cos(u1 - u2) * Math.sin(2 * s1) * Math.sin(2 * s2)));
}

function u1d(v1) {
  return v1;
}

function v1d(s1, t1, u1, v1, s2, t2, u2, v2) {
  return -(vars.l1 * t1 * v1 * (-(vars.m2 * Math.pow(csc(s1), 4) * Math.sin(4 * s1)) + 4 * cot(s1) * (6 * vars.m2 * Math.cos(2 * s2) + (8 * vars.m1 + 5 * vars.m2 - 4 * vars.m2 * Math.cos(2 * s2)) * Math.pow(csc(s1), 2) - 4 * vars.m2 * Math.cos(2 * (u1 - u2)) * Math.pow(Math.sin(s2), 2)) - 32 * vars.m2 * Math.cos(u1 - u2) * Math.pow(cot(s1), 2) * Math.sin(2 * s2)) + 8 * vars.l1 * vars.m2 * Math.pow(t1, 2) * Math.pow(csc(s1), 2) * (cot(s1) * Math.sin(2 * s2) * Math.sin(u1 - u2) + Math.pow(Math.sin(s2), 2) * Math.sin(2 * (u1 - u2))) + 8 * vars.m2 * (2 * vars.l2 * Math.pow(t2, 2) * Math.pow(csc(s1), 3) * Math.sin(s2) * Math.sin(u1 - u2) + 2 * vars.l2 * Math.pow(v2, 2) * Math.pow(csc(s1), 3) * Math.pow(Math.sin(s2), 3) * Math.sin(u1 - u2) + (vars.l1 * Math.pow(v1, 2) + vars.g * cot(s1) * csc(s1)) * (cot(s1) * Math.sin(2 * s2) * Math.sin(u1 - u2) + Math.pow(Math.sin(s2), 2) * Math.sin(2 * (u1 - u2))))) / (2 * vars.l1 * (vars.m2 + 8 * vars.m1 * Math.pow(csc(s1), 2) - vars.m2 * (Math.pow(cot(s1), 2) - 5 * Math.pow(csc(s1), 2) + Math.cos(2 * s2) * (-6 + 4 * Math.pow(csc(s1), 2)) + 4 * Math.cos(2 * (u1 - u2)) * Math.pow(Math.sin(s2), 2) + 8 * Math.cos(u1 - u2) * cot(s1) * Math.sin(2 * s2))));
}

function s2d(t2) {
  return t2;
}

function t2d(s1, t1, u1, v1, s2, t2, u2, v2) {
  return (4 * (8 * vars.l1 * (vars.m1 + vars.m2) * Math.pow(t1, 2) * (Math.cos(s2) * Math.cos(u1 - u2) * Math.sin(s1) - Math.cos(s1) * Math.sin(s2)) + 4 * (vars.m1 + vars.m2) * (2 * vars.l1 * Math.pow(v1, 2) * Math.pow(Math.sin(s1), 2) * (Math.cos(s2) * Math.cos(u1 - u2) * Math.sin(s1) - Math.cos(s1) * Math.sin(s2)) + vars.g * (Math.cos(s2) * Math.cos(u1 - u2) * Math.sin(2 * s1) - 2 * Math.pow(Math.cos(s1), 2) * Math.sin(s2))) + 2 * vars.l2 * Math.pow(v2, 2) * (-2 * vars.m2 * Math.cos(u1 - u2) * Math.sin(2 * s1) * Math.pow(Math.sin(s2), 2) + (2 * vars.m1 + vars.m2 - vars.m2 * Math.cos(2 * s1)) * Math.sin(2 * s2)) + vars.l2 * vars.m2 * Math.pow(t2, 2) * (4 * Math.cos(2 * s2) * Math.cos(u1 - u2) * Math.sin(2 * s1) - Math.sin(2 * s2) * (Math.cos(2 * s1) * (3 + Math.cos(2 * (u1 - u2))) + 2 * Math.pow(Math.sin(u1 - u2), 2))))) / (4 * vars.l2 * (8 * vars.m1 + 5 * vars.m2) - 2 * vars.l2 * vars.m2 * (2 * Math.cos(2 * s1) + 3 * Math.cos(2 * (s1 - s2)) + 2 * Math.cos(2 * s2) + 3 * Math.cos(2 * (s1 + s2)) + 8 * Math.cos(2 * (u1 - u2)) * Math.pow(Math.sin(s1), 2) * Math.pow(Math.sin(s2), 2) + 8 * Math.cos(u1 - u2) * Math.sin(2 * s1) * Math.sin(2 * s2)));
}

function u2d(v2) {
  return v2;
}

function v2d(s1, t1, u1, v1, s2, t2, u2, v2) {
  return (4 * (vars.l2 * t2 * v2 * (2 * (-8 * vars.m1 - 5 * vars.m2 + vars.m2 * Math.cos(2 * s2) + vars.m2 * Math.cos(2 * s1) * (1 + 3 * Math.cos(2 * s2))) * cot(s2) + 4 * vars.m2 * (4 * Math.pow(Math.cos(s2), 2) * Math.cos(u1 - u2) * Math.sin(2 * s1) + Math.cos(2 * (u1 - u2)) * Math.pow(Math.sin(s1), 2) * Math.sin(2 * s2))) + 8 * Math.sin(s1) * (vars.l1 * (vars.m1 + vars.m2) * Math.pow(t1, 2) * csc(s2) + vars.l2 * vars.m2 * Math.pow(t2, 2) * (Math.cos(s1) * cot(s2) + Math.cos(u1 - u2) * Math.sin(s1)) + (vars.m1 + vars.m2) * csc(s2) * (vars.g * Math.cos(s1) + vars.l1 * Math.pow(v1, 2) * Math.pow(Math.sin(s1), 2))) * Math.sin(u1 - u2) + 8 * vars.l2 * vars.m2 * Math.pow(v2, 2) * Math.sin(s1) * (Math.cos(s1) * cot(s2) + Math.cos(u1 - u2) * Math.sin(s1)) * Math.pow(Math.sin(s2), 2) * Math.sin(u1 - u2))) / (4 * vars.l2 * (8 * vars.m1 + 5 * vars.m2) - 2 * vars.l2 * vars.m2 * (2 * Math.cos(2 * s1) + 3 * Math.cos(2 * (s1 - s2)) + 2 * Math.cos(2 * s2) + 3 * Math.cos(2 * (s1 + s2)) + 8 * Math.cos(2 * (u1 - u2)) * Math.pow(Math.sin(s1), 2) * Math.pow(Math.sin(s2), 2) + 8 * Math.cos(u1 - u2) * Math.sin(2 * s1) * Math.sin(2 * s2)));
}



function draw() {

  //Inverts y axis
  scale(1, -1);
  //lights to look good
  lights();
  //Sets distance to the zoom variable with no animation
  //backround white
  background(0);

  if (advanced_menu && storeAdvanced) {
    advanced.show();
  } else {
    advanced.hide();
  }

  //Declare xyz values for each of the pendulums
  let x1 = (vars.l1 * Math.sin(vars.s1) * Math.cos(vars.u1));
  let z1 = (vars.l1 * Math.sin(vars.s1) * Math.sin(vars.u1));
  let y1 = (-vars.l1 * Math.cos(vars.s1));

  let x2 = (x1 + vars.l2 * Math.sin(vars.s2) * Math.cos(vars.u2));
  let z2 = (z1 + vars.l2 * Math.sin(vars.s2) * Math.sin(vars.u2));
  let y2 = (y1 - vars.l2 * Math.cos(vars.s2));

  if (advancedMenu.showAxis) axis();

  pendulum(x1, y1, z1, x2, y2, z2);

  if (fr % 7 == 0) fps = ceil(frameRate())

  fr++;

  //box
  let a = 10;
  translate(0, a / 2, 0);
  fill(255);
  noStroke();
  box(10);
  translate(0, -a / 2, 0);

  //HUD displaying fps.
  cam.beginHUD();
  textFont(font);
  textSize(32);
  fill(255, 50);
  text("fps: " + fps, 10, 32);
  cam.endHUD();

  if (advancedMenu.showTrails) {
    p1.show(advancedMenu.trail1);
    p2.show(advancedMenu.trail2);
  }
  cam.setDistance(advancedMenu.zoomMax - advancedMenu.zoom, 0);

  //box();

  //check for pause
  if (sim1 && sim2) {
    //MATHS
    p1.update(x1, y1, z1);
    p2.update(x2, y2, z2);
    for (let r = 0; r < advancedMenu.speed; r++) {
      //RK4 step one for pendulum #1
      k1s1 = s1d(vars.t1);
      k1t1 = t1d(vars.s1, vars.t1, vars.u1, vars.v1, vars.s2, vars.t2, vars.u2, vars.v2);
      k1u1 = u1d(vars.v1);
      k1v1 = v1d(vars.s1, vars.t1, vars.u1, vars.v1, vars.s2, vars.t2, vars.u2, vars.v2);


      //RK4 step one for pendulum #2
      k1s2 = s2d(vars.t2);
      k1t2 = t2d(vars.s1, vars.t1, vars.u1, vars.v1, vars.s2, vars.t2, vars.u2, vars.v2);
      k1u2 = u2d(vars.v2);
      k1v2 = v2d(vars.s1, vars.t1, vars.u1, vars.v1, vars.s2, vars.t2, vars.u2, vars.v2);



      //RK4 step two for pendulum #1
      k2s1 = s1d(vars.t1 + h * 0.5 * k1t1);
      k2t1 = t1d(vars.s1 + h * 0.5 * k1s1, vars.t1 + h * 0.5 * k1t1, vars.u1 + h * 0.5 * k1u1, vars.v1 + h * 0.5 * k1v1, vars.s2 + h * 0.5 * k1s2, vars.t2 + h * 0.5 * k1t2, vars.u2 + h * 0.5 * k1u2, vars.v2 + h * 0.5 * k1v2);
      k2u1 = u1d(vars.v1 + h * 0.5 * k1v1);
      k2v1 = v1d(vars.s1 + h * 0.5 * k1s1, vars.t1 + h * 0.5 * k1t1, vars.u1 + h * 0.5 * k1u1, vars.v1 + h * 0.5 * k1v1, vars.s2 + h * 0.5 * k1s2, vars.t2 + h * 0.5 * k1t2, vars.u2 + h * 0.5 * k1u2, vars.v2 + h * 0.5 * k1v2);


      //RK4 step two for pendulum #2
      k2s2 = s2d(vars.t2 + h * 0.5 * k1t2);
      k2t2 = t2d(vars.s1 + h * 0.5 * k1s1, vars.t1 + h * 0.5 * k1t1, vars.u1 + h * 0.5 * k1u1, vars.v1 + h * 0.5 * k1v1, vars.s2 + h * 0.5 * k1s2, vars.t2 + h * 0.5 * k1t2, vars.u2 + h * 0.5 * k1u2, vars.v2 + h * 0.5 * k1v2);
      k2u2 = u2d(vars.v2 + h * 0.5 * k1v2);
      k2v2 = v2d(vars.s1 + h * 0.5 * k1s1, vars.t1 + h * 0.5 * k1t1, vars.u1 + h * 0.5 * k1u1, vars.v1 + h * 0.5 * k1v1, vars.s2 + h * 0.5 * k1s2, vars.t2 + h * 0.5 * k1t2, vars.u2 + h * 0.5 * k1u2, vars.v2 + h * 0.5 * k1v2);


      //RK4 step three for pendulum #1
      k3s1 = s1d(vars.t1 + h * 0.5 * k2t1);
      k3t1 = t1d(vars.s1 + h * 0.5 * k2s1, vars.t1 + h * 0.5 * k2t1, vars.u1 + h * 0.5 * k2u1, vars.v1 + h * 0.5 * k2v1, vars.s2 + h * 0.5 * k2s2, vars.t2 + h * 0.5 * k2t2, vars.u2 + h * 0.5 * k2u2, vars.v2 + h * 0.5 * k2v2);

      k3u1 = u1d(vars.v1 + h * 0.5 * k2v1);
      k3v1 = v1d(vars.s1 + h * 0.5 * k2s1, vars.t1 + h * 0.5 * k2t1, vars.u1 + h * 0.5 * k2u1, vars.v1 + h * 0.5 * k2v1, vars.s2 + h * 0.5 * k2s2, vars.t2 + h * 0.5 * k2t2, vars.u2 + h * 0.5 * k2u2, vars.v2 + h * 0.5 * k2v2);


      //RK4 step three for pendulum #2
      k3s2 = s2d(vars.t2 + h * 0.5 * k2t2);
      k3t2 = t2d(vars.s1 + h * 0.5 * k2s1, vars.t1 + h * 0.5 * k2t1, vars.u1 + h * 0.5 * k2u1, vars.v1 + h * 0.5 * k2v1, vars.s2 + h * 0.5 * k2s2, vars.t2 + h * 0.5 * k2t2, vars.u2 + h * 0.5 * k2u2, vars.v2 + h * 0.5 * k2v2);

      k3u2 = u2d(vars.v2 + h * 0.5 * k2v2);
      k3v2 = v2d(vars.s1 + h * 0.5 * k2s1, vars.t1 + h * 0.5 * k2t1, vars.u1 + h * 0.5 * k2u1, vars.v1 + h * 0.5 * k2v1, vars.s2 + h * 0.5 * k2s2, vars.t2 + h * 0.5 * k2t2, vars.u2 + h * 0.5 * k2u2, vars.v2 + h * 0.5 * k2v2);

      //RK4 step four for pendulum #1
      k4s1 = s1d(vars.t1 + h * k3t1);
      k4t1 = t1d(vars.s1 + h * k3s1, vars.t1 + h * k3t1, vars.u1 + h * k3u1, vars.v1 + h * k3v1, vars.s2 + h * k3s2, vars.t2 + h * k3t2, vars.u2 + h * k3u2, vars.v2 + h * k3v2);
      k4u1 = u1d(vars.v1 + h * k3v1);
      k4v1 = v1d(vars.s1 + h * k3s1, vars.t1 + h * k3t1, vars.u1 + h * k3u1, vars.v1 + h * k3v1, vars.s2 + h * k3s2, vars.t2 + h * k3t2, vars.u2 + h * k3u2, vars.v2 + h * k3v2);


      //RK4 step four for pendulum #2
      k4s2 = s2d(vars.t2 + h * k3t2);
      k4t2 = t2d(vars.s1 + h * k3s1, vars.t1 + h * k3t1, vars.u1 + h * k3u1, vars.v1 + h * k3v1, vars.s2 + h * k3s2, vars.t2 + h * k3t2, vars.u2 + h * k3u2, vars.v2 + h * k3v2);
      k4u2 = u2d(vars.v2 + h * k3v2);
      k4v2 = v2d(vars.s1 + h * k3s1, vars.t1 + h * k3t1, vars.u1 + h * k3u1, vars.v1 + h * k3v1, vars.s2 + h * k3s2, vars.t2 + h * k3t2, vars.u2 + h * k3u2, vars.v2 + h * k3v2);



      //setting new values based on on all teh previous functions
      vars.s1 = vars.s1 + h * (k1s1 + 2 * k2s1 + 2 * k3s1 + k4s1) / 6.0;
      vars.t1 = vars.t1 + h * (k1t1 + 2 * k2t1 + 2 * k3t1 + k4t1) / 6.0;
      vars.u1 = vars.u1 + h * (k1u1 + 2 * k2u1 + 2 * k3u1 + k4u1) / 6.0;
      vars.v1 = vars.v1 + h * (k1v1 + 2 * k2v1 + 2 * k3v1 + k4v1) / 6.0;

      vars.s2 = vars.s2 + h * (k1s2 + 2 * k2s2 + 2 * k3s2 + k4s2) / 6.0;
      vars.t2 = vars.t2 + h * (k1t2 + 2 * k2t2 + 2 * k3t2 + k4t2) / 6.0;
      vars.u2 = vars.u2 + h * (k1u2 + 2 * k2u2 + 2 * k3u2 + k4u2) / 6.0;
      vars.v2 = vars.v2 + h * (k1v2 + 2 * k2v2 + 2 * k3v2 + k4v2) / 6.0;

      if (vars.s1 > 2 * PI) vars.s1 = vars.s1 - 2 * PI;
      if (vars.s1 < 0) vars.s1 = vars.s1 + 2 * PI;
      if (vars.u1 > 2 * PI) vars.u1 = vars.u1 - 2 * PI;
      if (vars.u1 < 0) vars.u1 = vars.u1 + 2 * PI;
      if (vars.s2 > 2 * PI) vars.s2 = vars.s2 - 2 * PI;
      if (vars.s2 < 0) vars.s2 = vars.s2 + 2 * PI;
      if (vars.u2 > 2 * PI) vars.u2 = vars.u2 - 2 * PI;
      if (vars.u2 < 0) vars.u2 = vars.u2 + 2 * PI;

      if (advancedMenu.dampening) damp();

    }

  }

  displayed.θ1 = vars.s1;
  displayed.φ1 = vars.u1;
  displayed.θ2 = vars.s2;
  displayed.φ2 = vars.u2;

  main.prototype.setValuesFromJSON(displayed);
  //speed is how many times it runs every draw function
}

function setLockedRotation() {
  cam.mouse.solveConstraint = function() {
    var dx = this.dist[0];
    var dy = this.dist[1];

    // YAW, PITCH
    if (!cam.SHIFT_CONSTRAINT && Math.abs(dx - dy) > 1) {
      cam.SHIFT_CONSTRAINT = Math.abs(dx) > Math.abs(dy) ? cam.AXIS.YAW : cam.AXIS.PITCH;
    }

    // define constraint by increasing priority
    cam.DRAG_CONSTRAINT = cam.AXIS.ALL;
    if (cam.FIXED_CONSTRAINT) cam.DRAG_CONSTRAINT = cam.FIXED_CONSTRAINT;
    if (cam.SHIFT_CONSTRAINT) cam.DRAG_CONSTRAINT = cam.SHIFT_CONSTRAINT;
  }
}

function setLockedRotationShift() {
  cam.mouse.solveConstraint = function() {
    var dx = this.dist[0];
    var dy = this.dist[1];

    // YAW, PITCH
    if (!this.shiftKey && !cam.SHIFT_CONSTRAINT && Math.abs(dx - dy) > 1) {
      cam.SHIFT_CONSTRAINT = Math.abs(dx) > Math.abs(dy) ? cam.AXIS.YAW : cam.AXIS.PITCH;
    }

    // define constraint by increasing priority
    cam.DRAG_CONSTRAINT = cam.AXIS.ALL;
    if (cam.FIXED_CONSTRAINT) cam.DRAG_CONSTRAINT = cam.FIXED_CONSTRAINT;
    if (cam.SHIFT_CONSTRAINT) cam.DRAG_CONSTRAINT = cam.SHIFT_CONSTRAINT;
  }
}

function guiClicked() {

  if (checker == advanced_menu) {
    sim2 = false;
    //console.log("hey there"); 
    
    vars.s1 = displayed.θ1;
    vars.u1 = displayed.φ1;
    vars.s2 = displayed.θ2;
    vars.u2 = displayed.φ2;
    vars.m1 = displayed.mass_1;
    vars.m2 = displayed.mass_2;
    vars.l1 = displayed.length_1;
    vars.l2 = displayed.length_2;
    vars.g = displayed.g;


    vars.t1 = vars.t1/10;
    vars.v1 = vars.v1/10;
    vars.t2 = vars.t2/10;
    vars.v2 = vars.v2/10;

    if (displayed.length_1 < 25 && displayed.length_2 < 50) {
      vars.t1 = 0.01;
      vars.v1 = 0.1;
      vars.t2 = 0.01;
      vars.v2 = 0.1;
    }

    let x1 = (vars.l1 * Math.sin(vars.s1) * Math.cos(vars.u1));
    let z1 = (vars.l1 * Math.sin(vars.s1) * Math.sin(vars.u1));
    let y1 = (-vars.l1 * Math.cos(vars.s1));

    let x2 = (x1 + vars.l2 * Math.sin(vars.s2) * Math.cos(vars.u2));
    let z2 = (z1 + vars.l2 * Math.sin(vars.s2) * Math.sin(vars.u2));
    let y2 = (y1 - vars.l2 * Math.cos(vars.s2));

    // p1.show([84, 50, 130]);
    // p2.show([253, 0, 89]);
    // p1.update(x1, y1, z1);
    // p2.update(x2, y2, z2);
    p1.history = [];
    p2.history = [];
  }

  checker = advanced_menu;

}

function mouseReleased() {
  sim2 = true;
}

function damp() {
  Math.pow(vars.t1, 0.95);
  Math.pow(vars.v1, 0.95);
  Math.pow(vars.t1, 0.95);
  Math.pow(vars.v1, 0.95);
}

class Particle {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.history = [];
  }

  update(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;

    // WIGGLY PARTICLES IF BALLS (LOOKS KINDA COOL)
    // this.x = this.x + random(-1, 1);
    // this.y = this.y + random(-1, 1);
    // this.y = this.y + random(-1, 1);

    let v = createVector(this.x, this.y, this.z);

    this.history.push(v);
    //console.log(this.history.length);

    if (this.history.length > 500) {
      this.history.splice(0, 1);
    }
  }

  show(shade) {
    beginShape();
    this.c = shade;
    for (let i = 0; i < this.history.length; i++) {
      let pos = this.history[i];
      //translate(pos.x, pos.y, pos.z);
      noFill();
      stroke(this.c);
      strokeWeight(2);
      vertex(pos.x, pos.y, pos.z);
      //translate(-pos.x, -pos.y, -pos.z);
    }
    endShape();

    noStroke();
    fill(200);
  }
}