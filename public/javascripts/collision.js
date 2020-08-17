var ball1, ballRenderer, lockedBall, canvas, focusedBall, ekCheckbox;
let t = 0;
let dt = 1 / 60;
var H = 450;
let g = 0;
let plot;
let running = false;
let checkboxContainer;
let sliderContainer1, sliderContainer2, sliderContainer3, sliderContainer4,
  sliderContainer5;
let someBall;

function setup() {
  canvas = createCanvas(H, H);
  canvas.parent("simwrapper");

  //Making dropdown
  let dd = makeDropdown(canvas);
  dd.parentElement.style['margin-top'] = "1em";
  let cont = dd.parentElement.parentElement.parentElement;
  let check = document.getElementById("Root");
  check.onclick = () => {
    checkbox.onclick();
    cont.style.width = (check.checked & !ekCheckbox.checked) ? "700px" : "";
    dd.parentElement.style["margin-top"] = check.checked ? "0em" : "1em";
  };

  //Making items
  let item1 = makeItem(dd);
  let row1 = makeRow(item1);
  let row2 = makeRow(item1);
  let row3 = makeRow(item1);
  let row4 = makeRow(item1);
  let row5 = makeRow(item1);
  let row6 = makeRow(item1);
  let item2 = makeItem(dd);
  item2.setLabel("Display");
  let item2Row1 = makeRow(item2);
  dd.setLabel("Dropdown");
  item1.setLabel("Parameters");
  let item3 = makeItem(dd);
  item3.setLabel("Commands");
  let item3Row1 = makeRow(item3);
  let item3Row2 = makeRow(item3);
  let item3Row3 = makeRow(item3);
  let item3Row4 = makeRow(item3);

  let row7 = makeRow(item1);
  let innerItem = makeItem(row7);
  let row7_1 = makeRow(innerItem);
  let row7_2 = makeRow(innerItem);
  let row7_3 = makeRow(innerItem);
  innerItem.setLabel("Color");


  //making sliders
  sliderContainer1 = makeSlider(row1);
  sliderContainer1.setTitleLabel("Velocity x ms-1");
  sliderContainer1.setParameters(20, -20, .1, 10);
  sliderContainer1.slider.oninput = () => {
    if (focusedBall != undefined) {
      focusedBall.vx = Number(sliderContainer1.slider.value);
      focusedBall.speed = sqrt(focusedBall.vy ** 2 + focusedBall.vx ** 2);
    };
    sliderContainer1.setValueLabel(sliderContainer1.slider.value);
  };

  sliderContainer2 = makeSlider(row2);
  sliderContainer2.setTitleLabel("Velocity y ms-1");
  sliderContainer2.setParameters(20, -20, .1, 10);
  sliderContainer2.slider.oninput = () => {
    if (focusedBall != undefined) {
      focusedBall.vy = Number(sliderContainer2.slider.value);
      focusedBall.speed = sqrt(focusedBall.vy ** 2 + focusedBall.vx ** 2);
    };
    sliderContainer2.setValueLabel(sliderContainer2.slider.value);
  };

  //Making the rmd slders
  sliderContainer3 = makeSlider(row3);
  sliderContainer3.setTitleLabel("radius m");
  sliderContainer3.setParameters(10, 1, .1, 10);
  sliderContainer3.slider.oninput = () => {
    if (focusedBall != undefined) {
      focusedBall.r = Number(sliderContainer3.slider.value) * 10;
    };
    sliderContainer3.setValueLabel(sliderContainer3.slider.value);
  };

  //Making the mass slider
  sliderContainer4 = makeSlider(row4);
  sliderContainer4.setTitleLabel("Mass kg");
  sliderContainer4.setParameters(100, 1, .1, 10);
  sliderContainer4.slider.oninput = () => {
    if (focusedBall != undefined) {
      focusedBall.m = Number(sliderContainer4.slider.value);
    };
    sliderContainer4.setValueLabel(sliderContainer4.slider.value);
  };

  //Making the damping slider
  sliderContainer5 = makeSlider(row5);
  sliderContainer5.setTitleLabel("Damping");
  sliderContainer5.setParameters(1, 0, 0.01, 0);
  sliderContainer5.slider.oninput = () => {
    if (focusedBall != undefined) {
      focusedBall.damping = focusedBall.bodyDamping = Number(sliderContainer5
        .slider.value);
    };
    sliderContainer5.setValueLabel(sliderContainer5.slider.value);
  };

  //Making gravity slider
  sliderContainer6 = makeSlider(row6);
  sliderContainer6.setTitleLabel("g ms-2");
  sliderContainer6.setParameters(100, 0, 0.01, 9.8);
  sliderContainer6.slider.oninput = () => {

    g = Number(sliderContainer6.slider.value);
    sliderContainer6.setValueLabel(sliderContainer6.slider.value);
  };

  //Time for the color ones
  let colorCont1 = makeSlider(row7_1);
  let colorCont2 = makeSlider(row7_2);
  let colorCont3 = makeSlider(row7_3);
  colorCont1.setTitleLabel("Red");
  colorCont2.setTitleLabel("Green");
  colorCont3.setTitleLabel("Blue");

  for (let item of[colorCont1, colorCont2, colorCont3]) {
    item.setParameters(255, 1, 1, 255);
    item.setValueLabel(255);
    let slider = item.slider;
    slider.oninput = () => {
      if (focusedBall != undefined) {
        let red = colorCont1.slider.value;
        let green = colorCont2.slider.value;
        let blue = colorCont3.slider.value;
        focusedBall.lineColor = "rgb(" + red + "," + green + "," + blue + ")";
      };
      item.setValueLabel(String(item.slider.value));
    };
  };

  //Making checkbox
  checkboxContainer = makeCheckbox(item2Row1);
  checkboxContainer.setLabel("Kinetic Energy plot");
  setPedroStyle(canvas);

  //Attributing function to hceckbox
  let checkbox = checkboxContainer.checkbox;
  ekCheckbox = checkbox;
  checkbox.onclick = () => {
    let size = !checkbox.checked ? H : H * 2;
    cont.style.width = String(size) + "px";
    resizeCanvas(size, H);

    cont.style.width = !checkbox.checked ? "700px" : "";
  };

  //Making buttons
  let buttonContainer1 = new buttonContainer(item3Row1);
  let button = buttonContainer1.makeButton("Start", () => {
    if (button.innerHTML == "Start") {
      button.innerHTML = "Pause";
      running = true;
    } else {
      button.innerHTML = "Start";
      running = false;
    };
  });

  let buttonContainer2 = new buttonContainer(item3Row2);
  let button2 = buttonContainer2.makeButton("Descelect", () => {
    focusedBall = undefined;
    mouseReleased();
  });

  let buttonContainer3 = new buttonContainer(item3Row3);
  let button3 = buttonContainer3.makeButton("Remove", () => {});

  button3.onmouseenter = () => {
    let bg = button3.style['background-color'];
    let c = button3.style['color'];
    button3.onmouseleave = () => {
      button3.style['background-color'] = bg;
      button3.style.color = c;
    };
    button3.onmousedown = () => {
      button3.style['background-color'] = "darkred";
      button3.style.color = "white";
    };
    button3.style['background-color'] = "tomato";
    button3.style.color = "white";
  };

  button3.onclick = () => {
    if (focusedBall != undefined) {
      let index = body.prototype.bodyArray.indexOf(focusedBall);
      body.prototype.bodyArray.splice(index, 1);
    };
    setTimeout(() => {
      button3.style.backgroundColor = 'tomato';
    }, 10);
  };


  let buttonContainer4 = new buttonContainer(item3Row4);
  let button4 = buttonContainer4.makeButton("Add", () => {});

  button4.onmouseenter = () => {
    let bg = button4.style['background-color'];
    let c = button4.style['color'];
    button4.onmouseleave = () => {
      button4.style['background-color'] = bg;
      button4.style.color = c;
    };
    button4.onmousedown = () => {
      button4.style['background-color'] = "darkgreen";
      button4.style.color = "white";
    };
    button4.style['background-color'] = "green";
    button4.style.color = "white";
  };

  button4.onclick = () => {
    let scopedFunc = button4.onclick;
    let oldMousePressed = mousePressed;
    let oldOnmouseleave = button4.onmouseleave;
    let oldOnmouseenter = button4.onmouseenter;
    button4.backgroundColor = "darkGreen";
    button4.onmouseleave = () => {
      null
    };
    mousePressed = () => {
      if (mouseX < H && mouseX > 0 && mouseY < H && mouseY > 0) {
        let ball = new body(ballRenderer);
        ball.x = mouseX - 10;
        ball.y = mouseY - 10;
        console.log(ball);
      };
    };
    button4.onclick = () => {
      mousePressed = oldMousePressed;
      button4.backgroundColor = "green";
      button4.onmouseleave = oldOnmouseleave;
      button4.onmouseenter = oldOnmouseenter;
      button4.onclick = scopedFunc;
    };
  };


  //Making renderer
  ballRenderer = createGraphics(H * .95, H * .95);


  //Making drawingCanvas
  plot = new makePlot(canvas);
  plot.build([H * 1.1, H * .9, H * 1.9, H * .1]);

  //Improve image quality
  pixelDensity(2);
  ballRenderer.pixelDensity(2);
  for (let i = 0; i < 3; i++) {
    someBall = new body(ballRenderer);
    someBall.x = random(20, 280);
    someBall.y = random(20, 280);
    someBall.vx = random(2, 18);
    someBall.vy = random(2, 18);
    someBall.r = random(10, 40);
    someBall.m = someBall.r * 2;
    someBall.speed = sqrt(someBall.vx ** 2 + someBall.vy ** 2);
    someBall.lineColor = "rgba(" + random(0, 255) + "," + random(0, 255) + "," +
      random(0, 255) + ")";
  };
};

function updateSliders() {
  if (focusedBall != undefined) {
    let slidervx = sliderContainer1.slider;
    let slidervy = sliderContainer2.slider;
    let sliderr = sliderContainer3.slider;
    let sliderm = sliderContainer4.slider;
    let sliderDamping = sliderContainer5.slider;
    slidervx.value = focusedBall.vx;
    slidervy.value = focusedBall.vy;
    sliderr.value = focusedBall.r / 10;
    sliderm.value = focusedBall.m;
    sliderDamping.value = focusedBall.damping;
    sliderContainer1.setValueLabel(slidervx.value);
    sliderContainer2.setValueLabel(slidervy.value);
    sliderContainer3.setValueLabel(sliderr.value);
    sliderContainer4.setValueLabel(sliderm.value);
    sliderContainer5.setValueLabel(sliderDamping.value);
  };
};

function mousePressed() {
  for (ball of body.prototype.bodyArray) {
    if (sqrt((mouseX - 10 - ball.x) ** 2 + (mouseY - 10 - ball.y) ** 2) <
      ball.r) {
      lockedBall = ball;
      focusedBall = ball;
      ball.fillColor = 'darkblue';
      ball.initvx = ball.vx;
      ball.initvy = ball.vy;
      ball.initX = ball.x;
      ball.initY = ball.y;
      ball.initMouseX = mouseX - 10;
      ball.initMouseY = mouseY - 10;
      updateSliders();
      break;
    };
  };
};

function mouseDragged() {
  if (lockedBall != undefined) {
    let ball = lockedBall;
    ball.vx = ball.vy = 0;
    ball.x = mouseX + ball.initX - ball.initMouseX - 10;
    ball.y = mouseY + ball.initY - ball.initMouseY - 10;
  };
};

function mouseReleased() {
  if (lockedBall != undefined) {
    lockedBall.vx = lockedBall.initvx;
    lockedBall.vy = lockedBall.initvy;
  };
  lockedBall = undefined;
  for (ball of body.prototype.bodyArray) {
    if (focusedBall != ball) {
      ball.fillColor = "#000";
    };
  };
};

function drawGrid(renderer) {
  let h = renderer.height;
  let w = renderer.width;
  let n = 9;
  let dh = h / (n + 1);
  let dw = w / (n + 1);
  let rendererContext = renderer.elt.getContext("2d");

  rendererContext.strokeStyle = "rgba(200, 200, 200, .5)";
  rendererContext.lineWidth = 1;
  for (let i = 1; i <= n; i++) {
    rendererContext.moveTo(0, i * dh);
    rendererContext.lineTo(w, i * dh);
  };
  for (let i = 1; i <= n; i++) {
    rendererContext.moveTo(i * dw, 0);
    rendererContext.lineTo(i * dw, h);
  };
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
};

function draw() {
  background("black");
  ballRenderer.elt.getContext("2d").globalAlpha -= .7;
  ballRenderer.background("black");
  ballRenderer.elt.getContext("2d").globalAlpha = 1;
  drawGrid(ballRenderer);
  if (running) {
    body.prototype.borderCollision();
    body.prototype.bodyCollision();
    body.prototype.move(dt, 0, 0, 0, g);
    t += dt;
  };
  body.prototype.draw();
  image(ballRenderer, H * .025, H * .025);

  if (ekCheckbox.checked) {
    body.prototype.plotEk(plot);
  };
};


function body(renderer, radius = 1, mass = 10, fillColor = "#000", lineWidth =
  2, lineColor = "darkgray") {
  //Other bodies
  if (body.prototype.bodyArray == undefined) {
    body.prototype.bodyArray = [];
  };

  this.bodyArray = body.prototype.bodyArray;
  this.bodyArray.push(this);

  //body params
  this.x = 0;
  this.y = 0;
  this.vx = 0;
  this.vy = 0;
  this.speed = 0;
  this.m = mass;
  this.r = radius * 10; //10 px per meter
  this.ek = 0; //Kinetic energy
  this.lastEk = 0;
  this.damping = 1; //walls
  this.bodyDamping = 1; //other bodies

  //html context
  this.renderer = renderer;
  this.context = renderer.elt.getContext("2d");

  //rendering
  this.fillColor = fillColor;
  this.lineWidth = lineWidth;
  this.lineColor = lineColor;

  //flag
  this.isColliding = false;

  /*Section where all body functions are defined below*/
  body.prototype.draw = (velocityArrow = true) => {
    for (BODY of body.prototype.bodyArray) {
      BODY.draw();
      if (velocityArrow) {
        BODY.displayVelocityArrow()
      };
    };
  };
  body.prototype.move = (dt, fx, fy, ax, ay) => {
    for (BODY of body.prototype.bodyArray) {
      BODY.move(dt, fx, fy, ax, ay);
    };
  };
  body.prototype.borderCollision = () => {
    for (BODY of body.prototype.bodyArray) {
      BODY.borderCollision();
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
  //SHow velocity as an arrow
  this.displayVelocityArrow = () => {
    //Makes an arrow whose length is its speed+tip
    this.context.strokeStyle = this.lineColor;
    this.context.beginPath();
    this.context.translate(this.x, this.y);
    this.context.moveTo(0, 0);
    this.context.lineTo(this.vx, this.vy);
    this.context.closePath();
    this.context.stroke();
    this.context.beginPath();
    this.context.strokeStyle = this.fillColor;
    this.context.lineWidth = 5;
    this.context.lineTo(this.vx + 3 * this.vy / this.speed, -3 * this.vx /
      this.speed + this.vy);
    this.context.lineTo((this.speed + 6) * this.vx / this.speed, (this.speed +
      6) * this.vy / this.speed);
    this.context.lineTo(this.vx - 3 * this.vy / this.speed, 3 * this.vx /
      this.speed + this.vy);
    this.context.lineTo(this.vx, this.vy);
    this.context.closePath();
    this.context.stroke();
    this.context.fillStyle = this.lineColor;
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
  this.move = (dt, fx = 0, fy = 0, ax = 0, ay = 0) => {
    this.vx += (fx / this.m + ax) * dt;
    this.vy += (fy / this.m + ay) * dt;
    this.x += this.vx * dt * 10; //10px per meter
    this.y += this.vy * dt * 10;
    this.speed = sqrt(this.vx ** 2 + this.vy ** 2);
    this.lastEk = this.ek * 1;
    this.ek = 1 / 2 * this.m * this.speed ** 2;
  };

  //Collide with sides of canvas
  this.borderCollision = () => {
    let xlim = this.renderer.width;
    let ylim = this.renderer.height;
    let damping = this.damping;

    if (this.x - this.r < 0) {
      this.x = this.r;
      this.vx *= -damping;
    } else if (this.x + this.r > xlim) {
      this.x = xlim - this.r;
      this.vx *= -damping;
    };

    if (this.y + this.r > ylim) {
      this.y = ylim - this.r;
      this.vy *= -damping;
    } else if (this.y - this.r < 0) {
      this.y = this.r;
      this.vy *= -damping
    };
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



//Now the plotting functions

function makePlot(canvas) {
  //First let's declare some global variables for a plot
  //This is mainly for readibility
  let figure, axes, bbox;
  let contextPoint = this.contextPoint = [0, 0]; //Used for continuity!

  /*bbox = [x0, y0, x1, y1];
  x0 and y0 lie at the top left corner
  x1 and y1 lie at the bottom right corner
  Used for scaling and positioning*/
  this.xlim = [0, 100];
  this.ylim = [0, 100];

  this.displayGrid = (rows = 4, columns = 4) => {
    let rowStep = figure.height / (rows + 1);
    let columnStep = figure.width / (columns + 1);

    figure.context.lineWidth = 3;
    figure.context.strokeStyle = "rgba(255, 255, 255, .2)";
    this.figure.context.moveTo(0, rowStep);
    for (let row = 1; row <= rows; row++) {
      figure.context.moveTo(0, row * rowStep);
      figure.context.lineTo(figure.width, row * rowStep);
    };
    for (let col = 1; col <= columns; col++) {
      figure.context.moveTo(col * columnStep, 0);
      figure.context.lineTo(col * columnStep, figure.height);
    };
    figure.context.stroke();
    figure.context.beginPath();
    figure.context.closePath();
  };

  this.build = (bbox) => {
    this.bbox = (arguments.length > 0) ? bbox : [0, 0, 0, 0];
    //Sets bbox for display later
    pixelDensity(2);

    figure = createGraphics(300, 300);
    figure.pixelDensity(window.pixelDensity());
    figure.context = figure.elt.getContext("2d");
    figure.bg = "rgba(0, 0, 0, 1)";
    figure.context.strokeStyle = '#fff';
    figure.context.lineWidth = 6;
    figure.background(figure.bg);
    this.figure = figure;

    axes = createGraphics(500, 500);
    axes.pixelDensity(window.pixelDensity());
    axes.context = axes.elt.getContext("2d");
    axes.context.strokeStyle = "white";
    axes.bg = "rgba(0, 0, 0, 1)";
    axes.background(axes.bg);
    this.axes = axes;

    axes.mousePressed = function() {
      console.log(axes.mouseX);
    };
  };

  this.displayFrame = () => {
    this.figure.context.lineWidth = 4;
    figure.context.strokeStyle = "rgba(255, 255, 255, .8)";
    this.figure.context.moveTo(0, 0);
    this.figure.context.lineTo(0, this.figure.height);
    this.figure.context.lineTo(this.figure.width, this.figure.height);
    this.figure.context.lineTo(this.figure.width, 0);
    this.figure.context.lineTo(0, 0);
    this.figure.context.stroke();

    figure.context.beginPath();
    figure.context.closePath();
  };

  this.displayAxis = () => {
    figure.context.lineWidth = 4;
    figure.context.strokeStyle = "rgba(255, 255, 255, .8)";
    figure.context.moveTo(0, 0);
    figure.context.lineTo(0, this.figure.height);
    figure.context.lineTo(figure.width, figure.height);
    figure.context.stroke();
    figure.context.beginPath();
    figure.context.closePath();
  };

  this.display = () => {
    let scale = window.pixelDensity();
    canvas.elt.getContext('2d').setTransform(scale, 0, 0, scale, 0, 0);

    figure.background(0);

    this.figure.image(axes,
      this.figure.width / 20,
      this.figure.height / 20,
      this.figure.width * 0.9,
      this.figure.height * 0.9);

    this.displayFrame();
    this.displayGrid();

    image(this.figure,
      this.bbox[0], this.bbox[1],
      this.bbox[2] - this.bbox[0],
      this.bbox[3] - this.bbox[1]);
  };

  this.setAxLimits = (xlim = [10, 100], ylim = [0, 100]) => {
    /*This is just a bunch of scaling and translating
    I never had linear algebra so I don't know the terms*/
    let xdist = xlim[1] - xlim[0];
    let ydist = ylim[1] - ylim[0];
    axes.context.setTransform(window.pixelDensity(), 0, 0, window.pixelDensity(),
      0, 0);
    axes.context.scale(axes.width / xdist, -axes.height / ydist);
    axes.context.translate(-xlim[0], -ydist);

    /*The comment is for TESTING in case a glitch is found*/
    //     axes.ellipse(50, 10, 5, 5);
    //     axes.fill(0, 250, 0);
    //     axes.ellipse(50, 20, 5, 5);

    //     axes.fill(0, 0, 0, 0);
    //     axes.rect(xlim[0]*1.1, ylim[0]*1.1, xdist*0.8, ydist*0.8)
    /*End of testing*/


    //Now we use the OLD lims to resize the current drawing
    //Negative signs are odd because of coordinate system

    axes.scale(1, -1);
    axes.context.drawImage(axes.elt,
      this.xlim[0], -this.ylim[1],
      this.xlim[1] - this.xlim[0],
      this.ylim[1] - this.ylim[0]);
    axes.scale(1, -1);

    //We also need to avoid ANNYING connections between old and new lines we draw
    axes.context.beginPath();
    axes.context.closePath();
    axes.context.moveTo(...this.contextPoint);

    //Now we don't need the old lims anymore
    this.xlim = xlim;
    this.ylim = ylim;
  };

  this.addLineTo = (arr) => {
    //Draws a line between the last drawn point and point
    axes.context.lineTo(...arr);
    axes.context.stroke();
    this.contextPoint = arr;
  };

  this.startLine = (arr) => {
    axes.context.moveTo(...arr);
  };

  this.plot = (arr) => {
    if (arr.length == 0) {
      return null
    };
    axes.context.moveTo(...arr[0]);
    for (Point of arr) {
      axes.context.lineTo(...Point);
    };
    axes.context.stroke();
  };
};



//Now the dropdown
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
  if (document.body == canvas.elt.parentElement || canvas.elt.parentElement ==
    document.body.getElementsByTagName("main")[0]) {
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

  obj.setParameters = function sliderValues(max = 100, min = 0, step = .1,
    value = 2) {
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
  style.innerHTML =
    `
        /*Making it go inside the canvas*/
        #SomeCreativeID{
          position: absolute;
          display: flex;
          min-width: 17em;
          max-height: 100%;
          z-index: 99;
          overflow-y: auto;
          overflow-x: hidden;
          margin-left: auto;
          right: 0%;
        }
        #SomeCreativeID>div{
          padding-left: 0;
        }

        #${id}{
          position:relative;
          background-color: darkgray;
          display: inline-flex;
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
          width: 30%;
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
          width: 50%;
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
