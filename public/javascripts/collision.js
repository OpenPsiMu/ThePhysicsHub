var ballRenderer, lockedBall, canvas, focusedBall, ekCheckbox, explanationCanvas;
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
let showExplanation;//Will be a checkbox

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
  let item2Row2 = makeRow(item2);
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
  setDropdownStyle(canvas);

  //Attributing function to hceckbox
  let checkbox = checkboxContainer.checkbox;
  ekCheckbox = checkbox;
  checkbox.onclick = () => {
    let size = !checkbox.checked ? H : H * 2;
    cont.style.width = String(size) + "px";
    resizeCanvas(size, H);

    cont.style.width = !checkbox.checked ? "700px" : "";
  };

  let infoCheckboxContainer = makeCheckbox(item2Row2);
  infoCheckboxContainer.setLabel("Show instructions");
  showExplanation = infoCheckboxContainer.checkbox;
  showExplanation.checked = true;


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


  if (showExplanation.checked){
    showInfo();//Instructions
  };

};

function showInfo(){
  if (explanationCanvas==undefined){
    explanationCanvas = createGraphics(H*.85, H*.85);
    setTimeout(()=>{
      showExplanation.checked = false;
      let cont = document.getElementById("Root");
      let dd = cont.parentElement.children[2];
      let item = dd.children[1];
      setTimeout(()=>{
      item.children[0].checked = true;},500);

      setTimeout(()=>{cont.checked = true;},200);

    }, 10000);
  };
  explanationCanvas.pixelDensity(2);
  let ct = explanationCanvas.elt.getContext("2d");
  ct.strokeStyle = "white";
  ct.fillStyle = "#333";
  ct.lineWidth = 20;
  ct.fillRect(0, 0, H*.85, H*.85);
  ct.beginPath();
  ct.rect(0, 0, H*.85, H*.85);
  ct.stroke();
  explanationCanvas.textSize(15);
  explanationCanvas.fill(255);
  let y = 30; let dy = 20;
  explanationCanvas.text("-To select an object, click on it.", 15, y);
  y+=dy*1.2;
  explanationCanvas.text("-To move an object, click and drag.", 15, y);
  y+=dy*1.2;
  explanationCanvas.text("-The dropdown changes the property for the", 15, y);
  y+=dy;
  explanationCanvas.text("selected ball. The only exeption being gravity.", 15, y);
  y+=dy;
  explanationCanvas.text("Which is the same for all balls.", 15, y);
  y+=dy;
  explanationCanvas.text("-Use the buttons to perform actions.", 15, y);
  y+=dy*1.2;
  explanationCanvas.text("-Delete button deletes the selected button.", 15, y);
  y+=dy*1.2;
  explanationCanvas.text("-Add button lets you add buttons by touching", 15, y);
  y+=dy;
  explanationCanvas.text("the screen while the button is green.", 15, y);
  y+=dy;
  explanationCanvas.text("Press it either activate or deactivate.", 15, y);
  y+=dy*1.5;
  explanationCanvas.textSize(20);
  explanationCanvas.text("Play to learn more :)", 15, y);
  image(explanationCanvas, H*.075, H*.075);

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
