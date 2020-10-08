let W = 1200;  //width of bgCanvas
let H = 500;  //height of bgCanvas
let Wsim = 900; //1000
let Hsim = H;
let Wplot = 0.25 * W;
let Hplot = 0.875 * H;



range = 800;// xlimit
deltaX = 1.0;/// x step
deltaT = .1;//time step
let numOfPoints = range*1.0/deltaX;//number of points
let m1Slider, m2Slider;//mass 1 and mass 2 slider
let fixedEnd =true;//is the end of the string fixed
let started = false;//start the simulation?
string1 = {
  mass:400,
  length:400,
  tension:100,
};
string2 = {
  mass:800,
  length:400,
  tension:100,
};

function InitialPos(x){
  return 0// initial position (at rest)
}
let t = 0;
let T = 0
function WaveGen(t){//sends a pulse
  omega = 20
  if(t<omega){
  //if( t%(2*omega)<=omega ){
    r = Math.abs(80*Math.sin(Math.PI*t/omega))
  }
  else{
    return 0;
  }



  return r;
}
let x = math.zeros(numOfPoints); // x vector
let y = math.zeros(2,numOfPoints); // y vector

function setup(){
  for(i=0;i<numOfPoints;i++){
    xpos = i*deltaX+10;
    x.subset(math.index(i),xpos);
    y.subset(math.index(0,i), InitialPos(xpos));
  }
  y.subset(math.index(0,0),WaveGen(t));
  for(i=1;i<numOfPoints-1;i++){

    if(i<numOfPoints/2){
      T = string1.tension
      u = string1.mass/(string1.length)
      c = math.sqrt( T/u  )// wave speed
      C = c*deltaT/deltaX
    }else {
      T = string2.tension
      u = string2.mass/(string2.length)
      c = math.sqrt( T/u  )// wave speed
      C = c*deltaT/deltaX
    }
    y.subset(math.index(1,i), //physics solving wave eq using FDM
       math.subset(y,math.index(0,i) )
         +.5*C*C*(
           math.subset(y,math.index(0,i+1))
           -2*math.subset(y,math.index(0,i))
           +math.subset(y,math.index(0,i-1))

         )
       );
  }

  let bgCanvas = createCanvas(W,H)
  bgCanvas.parent("simwrapper")

  let dd = makeDropdown(bgCanvas);
  dd.parentElement.children[1].innerHTML = "Options";
  let dd1 = makeItem(dd);
  dd1.parentElement.children[1].innerHTML = "Parameters";

  let dd11 = makeRow(dd1);
  let m1SliderContainer = makeSlider(dd11);
  m1Slider = m1SliderContainer['slider'];
  m1SliderContainer['valueLabel'].innerHTML = m1Slider.value;
  m1SliderContainer['label'].innerHTML = "Red Mass";
  [m1Slider.min, m1Slider.max, m1Slider.step, m1Slider.value] = [400, 800, 50,400 ]
  m1Slider.oninput = () => {
    m1SliderContainer["valueLabel"].innerHTML = Number(m1Slider.value).toFixed(0)
    string1.mass = m1Slider.value
  }

  let dd12 = makeRow(dd1);
  let m2SliderContainer = makeSlider(dd12);
  m2Slider = m2SliderContainer['slider'];
  m2SliderContainer['valueLabel'].innerHTML = m2Slider.value;
  m2SliderContainer['label'].innerHTML = "Blue Mass";
  [m2Slider.min, m2Slider.max, m2Slider.step, m2Slider.value] = [400, 800, 50, 400]
  m2Slider.oninput = () => {
    m2SliderContainer["valueLabel"].innerHTML = Number(m2Slider.value).toFixed(0)
    string2.mass = m2Slider.value
  }
    let dd13 = makeRow(dd1);
    let checkboxContainer = makeCheckbox(dd13);
    let checkbox = checkboxContainer['checkbox'];
    checkboxContainer.setLabel("Fixed End");
    let checkV  = checkboxContainer.checkbox;
    checkV.checked = true;
    checkV.oninput = () => {
      if(checkV.checked){
        fixedEnd = true;
      }else{
        fixedEnd = false;
      }
    }

    setDropdownStyle(bgCanvas) //applies styling to dropdown menu.
    simCanvas = createGraphics(Wsim, Hsim)

    plotCanvas = createGraphics(Wplot, Hplot) //setting up the plotting canvas
    plotCanvas.background(20)
    plotCanvas.stroke(255)
    plotCanvas.strokeWeight(3)
    plotCanvas.noFill()
    plotCanvas.rect(0, 0, Wplot, Hplot)


  //drawing static grid over simCanvas
    gridCanvas = createGraphics(Wsim, Hsim)
    let nDiv = 10 // #gridlines

    gridCanvas.clear()
    gridCanvas.stroke(150)
    gridCanvas.strokeWeight(1)
    for (let i = 0; i < nDiv; i++) {
      gridCanvas.line(10 + i * Wsim / nDiv, 10, 10 + i * Wsim / nDiv, Hsim - 10)
      gridCanvas.line(10, 10 + i * Hsim / nDiv, Wsim - 10, 10 + i * Hsim / nDiv)
    }

    startButton = createButton('Start!');
    startButton.position(945, 350);
    startButton.mousePressed(startSim);
    startButton.parent('simwrapper');

    resetButton = createButton("Reset");
    resetButton.position(1010, 350);
    resetButton.mousePressed(resetSim);
    resetButton.parent('simwrapper');
}
function startSim() {
    started = true;//start sim
}
function resetSim(){
    started = false;//restart sim
    t = 0
    let x = math.zeros(numOfPoints); // x vector
    let y = math.zeros(2,numOfPoints); // y vector
    setup();
  }
function draw(){
  //
  // y(xi,t(n+1)) = -u(i,n-1) + 2*u(n,i)
  // + C**2(u(n,i+1) - 2u(n,i) + u(n,i-1) )
  //+ deltaT**2+f(n,i) where f is a driving function

  if(started){
  nextY = math.zeros(numOfPoints)
  nextY.subset(math.index(0),WaveGen(t));

    for(i=1;i<numOfPoints-1;i++){
      if(i<numOfPoints/2){
        T = string1.tension
        u = string1.mass/(string1.length)
        c = math.sqrt( T/u  )
        C = c*deltaT/deltaX
      }else {
        T = string2.tension
        u = string2.mass/(string2.length)
        c = math.sqrt( T/u  )
        C = c*deltaT/deltaX
      }

      nextY.subset( math.index(i),
        -math.subset( y,math.index(0,i)  )
        +2*math.subset( y, math.index(1,i) )
        +C*C*(math.subset(y,math.index(1,i+1))
          -2*math.subset(y,math.index(1,i))
          +math.subset(y,math.index(1,i-1))
        )

      );

    }
    if(!fixedEnd){ //if its fixed then the boundry cond is y=0, otherwise just continue
      nextY.subset( math.index(numOfPoints-1),
        -math.subset(y,math.index(0,numOfPoints-1))
        +2*math.subset(y,math.index(1,numOfPoints-1))
        +2*C*C*(
          math.subset(y,math.index(1,numOfPoints-2))
          -math.subset(y,math.index(1,numOfPoints-1))
        )
      );
    }




  for(i=0;i<numOfPoints;i++){// move over new y vector
    y.subset( math.index(0,i),math.subset( y,math.index(1,i) ));
    y.subset( math.index(1,i),math.subset( nextY,math.index(i) ));

  }
  t= t+deltaT;
  }
  background(20)

  simCanvas.clear()
  simCanvas.stroke(255)
  simCanvas.strokeWeight(2)
  simCanvas.noFill()
  simCanvas.rect(10, 10, Wsim - 20, Hsim - 20)



    for(i=1;i<numOfPoints;i++){

      simCanvas.line(
      math.subset(x,math.index(i-1)),
      -math.subset(y,math.index(0,i-1))+250,
      math.subset(x,math.index(i)),
      -math.subset(y,math.index(0,i))+250
    )
    if(i<numOfPoints/2){
      simCanvas.stroke('red');
    }
    else{
      simCanvas.stroke('blue');
    }

    }
    if(fixedEnd){
      simCanvas.stroke('white')
      simCanvas.fill('grey');
      simCanvas.rect(800,100 , 50,300);

    }
  image(gridCanvas, 0, 0)
  //sim canvas
  image(simCanvas, 0, 0);

  }
