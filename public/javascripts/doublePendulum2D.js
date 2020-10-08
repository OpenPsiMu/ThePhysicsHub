
class doublePendulum {
	constructor(initCond,color=255){
        this.l1= 1.0,
        this.l2= 1.0,
        this.m1= 1.0,
        this.m2= 1.0,
        this.g= 10.0,
        this.hinge= [240,80],
        this.scaling_factor= 100,
        this.dt=0.0001,
        this.speed= 250

		this.initCond = initCond;
        this.t = 0;
		this.ball1 = [this.l1*Math.sin(initCond[2]),this.l1*Math.cos(initCond[2])];
		this.ball2 = [this.ball1[0] + this.l2*Math.sin(initCond[3]),this.ball1[1] + this.l2*Math.cos(initCond[3])];
        this.radius1 = 18;
        this.radius2 = 20;
		this.history = [];
        this.color = color;
        this.timeWindow = [];
        this.timeSeriesValues = [];
        this.ppHistory1  = [];
        this.ppHistory2 = [];
	}

		show(canvas) { //plot the pendulum
          //canvas.translate(240,80);
        //console.log("show(): "+this.initCond[2]);
		//hinge
		canvas.rect(this.hinge[0]-5,this.hinge[1]-5,10,10,2);

		// first ball
        canvas.noStroke();
		canvas.fill(this.color);
		canvas.ellipse(this.hinge[0]+this.scaling_factor*this.ball1[0],
			 this.hinge[1] + this.scaling_factor*this.ball1[1],this.radius1);

		//first rod
        canvas.stroke(this.color)
		canvas.line(this.hinge[0],this.hinge[1],this.hinge[0]+
		this.scaling_factor*this.ball1[0],this.hinge[1]+this.scaling_factor*this.ball1[1]);

		//second ball
        canvas.noStroke();
		canvas.fill(this.color);
		canvas.ellipse(this.hinge[0]+this.scaling_factor*this.ball2[0],
			  this.hinge[1] + this.scaling_factor*this.ball2[1],this.radius2);
		//second rod
        canvas.stroke(this.color)
		canvas.line(this.hinge[0]+this.scaling_factor*this.ball1[0],this.hinge[1] + this.scaling_factor*this.ball1[1],             		  			this.hinge[0]+this.scaling_factor*this.ball2[0],this.hinge[1] + this.scaling_factor*this.ball2[1]);
	}

	sysDiffEq(x){
	  let dx = Array(4);
	  let cosine = Math.cos(x[2] - x[3]);
	  let sine = Math.sin(x[2]- x[3]);
	  let relmass = this.m2/(this.m1+this.m2);
	  let length_ratio = this.l2/this.l1;

	  dx[0] = (this.g*Math.sin(x[3])*cosine- cosine*sine*Math.pow(x[0],2) - length_ratio*sine*Math.pow(x[1],2)-1/relmass/		     			this.l1*this.g*Math.sin(x[2]))/(1/relmass -Math.pow(cosine,2)); // derivative of the angular velocity for the first angle

	  dx[1] = 1/length_ratio*(sine*Math.pow(x[0],2)-cosine*dx[0])-this.g/this.l2*Math.sin(x[3]); // derivative of the angular velocity for 															the second angle

	  dx[2] = x[0]; // derivative of the first angle

	  dx[3] = x[1]; // derivative of the second angle
	   return dx
	}

	Euler(){
	let dim = this.initCond.length; //dimension of the system
	let nextStep  = Array(dim);
	for(let i=0;i<dim;i++){
		nextStep[i] = this.initCond[i] + this.sysDiffEq(this.initCond)[i]*this.dt
	}
	return nextStep;
	}

	// RK solver
	RK(){
	// dimensions of the system
	let dim = this.initCond.length
	//create matrix that stores k values (dimension of the system x 4)
	let kMatrix = Array(dim);
	for(let i=0;i<dim;i++){
		kMatrix[i] = Array(4);
	}

	// calc the k terms for each
	for(let j=0;j<4;j++){
		switch(j) {
		//calculate k1 values
          case 0:{
			for(let i=0;i<dim;i++){
				kMatrix[i][j] = this.sysDiffEq(this.initCond)[i]; //and plug them in the matrix
			}
	      	}break;

		case 1:
	      	case 2:{
			let pluginValues = [];
			for(let i=0;i<dim;i++){
			pluginValues.push(this.initCond[i]+this.dt/2*kMatrix[i][j-1]); //calculate k2 or k3 values
			}
			for(let i=0;i<dim;i++){
			  kMatrix[i][j] = this.sysDiffEq(pluginValues)[i]; //store them in the matrix
			}
	      	}break;
	      	case 3: {
			let pluginValues = [];
			for(let i=0;i<dim;i++){
			  pluginValues.push(this.initCond[i]+this.dt*kMatrix[i][j-1]); //calculate k4 values
			}
			for(let i=0;i<dim;i++){
			  kMatrix[i][j] = this.sysDiffEq(pluginValues)[i]; //store them in the matrix
			}
	       }break;
	       }
	}
	// calc the next step for each
	let nextStep = Array(dim);
	for (let i=0;i<dim;i++){
		nextStep[i] = this.initCond[i] + 1/6*this.dt*(kMatrix[i][0]+2*kMatrix[i][0]+2*kMatrix[i][2]+ kMatrix[i][3]); // RK formula
	}
  	return nextStep;
	}

	move(solver){
		//updating the positions
		this.ball1[0] = this.l1*Math.sin(this.initCond[2]);
		this.ball1[1] = this.l1*Math.cos(this.initCond[2]);
		this.ball2[0] = this.ball1[0] + this.l2*Math.sin(this.initCond[3]);
		this.ball2[1] = this.ball1[1] + this.l2*Math.cos(this.initCond[3]);

		//choosing solver and time-evolution of the eoms
		if (solver === "RK") {
	  		for(let s=0;s<this.speed;s++){
	  			 this.initCond = this.RK();
                 this.t += this.dt
			}
		} else if (solver === "Euler"){
			for(let s=0;s<this.speed;s++){
	  			 this.initCond = this.Euler();
                 this.t += this.dt
			}
		}
	}

    drawTrace(canvas,trace_length){ //keep track of the trajectory
		let pos = createVector(this.hinge[0]+this.scaling_factor*this.ball2[0],
		  this.hinge[1]+this.scaling_factor*this.ball2[1]);

	  	this.history.push(pos);
		if(this.history.length>trace_length){
			this.history.splice(0,1);
		}
		 noFill();
		 beginShape();
		 for (var i = 0;i<this.history.length;i++) {
		 	canvas.noStroke();
		 	canvas.fill(255,i*10);
		  	stroke(255);
		  	canvas.vertex(this.history[i].x,this.history[i].y);

		 }
		 	endShape();
		 	image(canvas,0,0);
	}

    plotTimeSeries(canvas){ //plot the timeseries in theta(first angle)
      if (10*this.t<canvas.width){
        this.timeWindow.push(10*this.t);
        this.timeSeriesValues.push(canvas.height/2-45*this.initCond[2]);
      }else{
         this.timeSeriesValues.push(canvas.height/2-45*this.initCond[2]);

         this.timeSeriesValues.splice(0,1);
      }
      	canvas.noFill();
  	    canvas.beginShape();
        for(let i=0;i<this.timeSeriesValues.length;i++){
          canvas.stroke(this.color)
    	  canvas.vertex(this.timeWindow[i],this.timeSeriesValues[i]);
  	  }
        canvas.endShape();
    }

    plotPhasePortrait(canvas,variables,traceLength,scalingFactors,translateBy,history){
      let point = createVector(translateBy[0]+scalingFactors[0]*this.initCond[variables[0]],translateBy[1]-scalingFactors[1]*this.initCond[variables[1]])
      canvas.ellipse(point.x,point.y,10,10)

      history.push(point);

	  if(history.length>traceLength){
			history.splice(0,1);
	  }

	  //noFill();
	  //beginShape();
	  for (let i = 0;i<history.length;i++) {
	    canvas.noStroke();
		canvas.fill(255,i*2);
		stroke(255);
		//canvas.vertex(history[i].x,history[i].y);
        canvas.ellipse(history[i].x,history[i].y,2,2)
		}

		//endShape();
    }

    drag(){
      translate(this.hinge[0],this.hinge[1]);
      let vertical1 = createVector(0,1);
      let vmouse1 = createVector(mouseX-this.hinge[0],mouseY-this.hinge[1]);


      let d0 = dist(0,0,this.scaling_factor*this.ball2[0],this.scaling_factor*this.ball2[1])

      let d1 = dist(this.scaling_factor*this.ball1[0],
            this.scaling_factor*this.ball1[1],vmouse1.x,vmouse1.y);

      let angle1 = vmouse1.angleBetween(vertical1);

      translate(this.scaling_factor*this.ball1[0],this.scaling_factor*this.ball1[1])
      let vertical2 = createVector(0,1);
      let vmouse2 = createVector(mouseX-this.hinge[0]-this.scaling_factor*this.ball1[0],mouseY-this.hinge[1]-this.scaling_factor*this.ball1[1]);
      let angle2 = vmouse2.angleBetween(vertical2);
      let d2 = dist(this.scaling_factor*(this.ball2[0]-this.ball1[0]),
            this.scaling_factor*(this.ball2[1]-this.ball1[1]),vmouse2.x,vmouse2.y);


      if(d1<3*this.radius1){
        this.initCond[2] = angle1
        this.initCond[0] = 0;
        this.initCond[1] = 0;
       	this.ball1[0] = this.l1*Math.sin(this.initCond[2]);
		this.ball1[1] = this.l1*Math.cos(this.initCond[2]);
        this.ball2[0] = this.ball1[0] + this.l2*Math.sin(this.initCond[3]);
		this.ball2[1] = this.ball1[1] + this.l2*Math.cos(this.initCond[3]);
      }else if (d2<3*this.radius2){
        this.initCond[3] = angle2;
        this.initCond[0] = 0;
        this.initCond[1] = 0;
        this.ball1[0] = this.l1*Math.sin(this.initCond[2]);
		this.ball1[1] = this.l1*Math.cos(this.initCond[2]);
        this.ball2[0] = this.ball1[0] + this.l2*Math.sin(this.initCond[3]);
		this.ball2[1] = this.ball1[1] + this.l2*Math.cos(this.initCond[3]);
      }

    }
}


let W = 1200  //width of bgCanvas
let H = 500  //height of bgCanvas
let Wsim = W * 0.69
let Hsim = H
let Wplot = 0.25 * W
let Hplot = 0.4375 * H
let bgCanvas, simCanvas, plotCanvas;
let Wplot3 = Wplot*1.25
let Hplot3 = Hplot*0.75
let eulerCheckboxContainer;
let RKCheckboxContainer;
let chaosCheckboxContainer;
let ppCheckboxContainer1;
let ppCheckboxContainer2;
let isPlaying = false;
let chaosIsPlaying = false;


function manyPendulums(numberOfPendulums){
  let pendulums = [];
  for (let i=0;i<numberOfPendulums;i++){
    randomcolor = randomRGB();
    initColor = color(randomcolor[0],randomcolor[1],randomcolor[2])
    pendulums.push(new doublePendulum([0.0,0.0,Math.PI/4,Math.PI/1.5+i*0.01],initColor));
  }
  return pendulums;
}

function randomRGB(){
  let colors = [];
    for(let i=0;i<3;i++){
    colors.push(255*(1+Math.random())/2)
  }
  return colors
}

function defaultWindow(){
  bgCanvas = createCanvas(W, H)
  bgCanvas.parent("simwrapper")
  bgCanvas.clear()
  simCanvas = createGraphics(Wsim, Hsim)
  simCanvas.clear()

  plotCanvas1 = createGraphics(Wplot, Hplot)
  plotCanvas1.background(20)
  plotCanvas1.stroke(255)
  plotCanvas1.strokeWeight(1)
  plotCanvas1.noFill()
  plotCanvas1.rect(0, 0, Wplot, Hplot)

  //second plot window
  plotCanvas2 = createGraphics(Wplot, Hplot)
  plotCanvas2.background(20)
  plotCanvas2.stroke(255)
  plotCanvas2.strokeWeight(1)
  plotCanvas2.noFill()
  plotCanvas2.rect(0, 0, Wplot, Hplot)

  //third plot window
  plotCanvas3 = createGraphics(Wplot3, Hplot3)
  plotCanvas3.background(20)
  plotCanvas3.stroke(255)
  plotCanvas3.strokeWeight(1)
  plotCanvas3.noFill()
  plotCanvas3.rect(0, 0, Wplot3, Hplot3)

  plotCanvas3_extra = createGraphics(Wplot3, Hplot3)
  plotCanvas3_extra.clear()
  plotCanvas3_extra.stroke(255)
  plotCanvas3_extra.strokeWeight(1)
  plotCanvas3_extra.noFill()

  plotCanvas1_extra = createGraphics(Wplot, Hplot)
  plotCanvas1_extra.clear()
  plotCanvas1_extra.stroke(255)
  plotCanvas1_extra.strokeWeight(1)
  plotCanvas1_extra.noFill()

  plotCanvas2_extra = createGraphics(Wplot, Hplot)
  plotCanvas2_extra.clear()
  plotCanvas2_extra.stroke(255)
  plotCanvas2_extra.strokeWeight(1)
  plotCanvas2_extra.noFill()

  dp = new doublePendulum([0,0,Math.PI/3,Math.PI])

}



function setup() {

  defaultWindow();
  let dd = makeDropdown(bgCanvas);
  dd.setLabel("Settings");
  setDropdownStyle(bgCanvas);
  let control = makeItem(dd);
  control.setLabel("Control");
  let controlRow1 = makeRow(control);

  let controlButtons = new buttonContainer(controlRow1);
  let startButton = controlButtons.makeButton("Start",function(){isPlaying=true});
  let stopButton = controlButtons.makeButton("Stop",function(){isPlaying=false});
  let resetButton = controlButtons.makeButton("Reset",resetFunc);

  let controlRow2 = makeRow(control);
  let speedSliderContainer = makeSlider(controlRow2);
  let speedSlider = speedSliderContainer['slider'];
  speedSliderContainer.setTitleLabel("Speed of simulation");//Updates the text on the left hand side of the slider.
  speedSliderContainer.setParameters(280, 50, 5, 230);
  speedSlider.oninput = () => {
    speedSliderContainer["valueLabel"].innerHTML = Number(speedSlider.value).toFixed(2);
    dp.speed = speedSlider.value;
  }

  let parameters = makeItem(dd);
  parameters.setLabel("Parameters");
  let parametersRow1 = makeRow(parameters);

  let m1sliderContainer = makeSlider(parametersRow1);
  let m1slider = m1sliderContainer['slider'];
  m1sliderContainer.setTitleLabel("m1");//Updates the text on the left hand side of the slider.
  m1sliderContainer.setParameters(20, 1, 1, 1);
  m1slider.oninput = () => {
    m1sliderContainer["valueLabel"].innerHTML = Number(m1slider.value).toFixed(2);
    dp.m1 = m1slider.value;
    dp.radius1 = 17.5 + 0.5*dp.m1
  }

  let parametersRow2 = makeRow(parameters);

  let m2sliderContainer = makeSlider(parametersRow2);
  let m2slider = m2sliderContainer['slider'];
  m2sliderContainer.setTitleLabel("m2");//Updates the text on the left hand side of the slider.
  m2sliderContainer.setParameters(20, 1, 1, 1);
  m2slider.oninput = () => {
    m2sliderContainer["valueLabel"].innerHTML = Number(m2slider.value).toFixed(2)
    dp.m2 = m2slider.value
    dp.radius2 = 17.5 + 0.5*dp.m2
  }


  let parametersRow3 = makeRow(parameters);

  let gsliderContainer = makeSlider(parametersRow3);
  let gslider = gsliderContainer['slider'];
  gsliderContainer.setTitleLabel("g");//Updates the text on the left hand side of the slider.
  gsliderContainer.setParameters(20, 1, 1, 10);
  gslider.oninput = () => {
    gsliderContainer["valueLabel"].innerHTML = Number(gslider.value).toFixed(2)
    dp.g = gslider.value
  }


  let solvers = makeItem(dd);
  solvers.setLabel("Solvers");

  solversRow1 = makeRow(solvers);

  eulerCheckboxContainer = makeCheckbox(solversRow1);
  let eulerCheckbox = eulerCheckboxContainer['checkbox'];
  RKCheckboxContainer = makeCheckbox(solversRow1);
  let RKCheckbox = RKCheckboxContainer['checkbox'];
  eulerCheckboxContainer.setLabel("Euler");
  RKCheckboxContainer.setLabel("RK4");
  RKCheckbox.checked = true;

  eulerCheckbox.onclick = () => {
    if (RKCheckbox.checked === true){
      RKCheckbox.checked = false;
    }
  }

  RKCheckbox.onclick = () => {
    if (eulerCheckbox.checked === true){
      eulerCheckbox.checked = false;
    }
  }

  let chaos = makeItem(dd);
  chaos.setLabel("CHAOS");
  let chaosRow1 = makeRow(chaos);

  chaosCheckboxContainer = makeCheckbox(chaosRow1);
  chaosCheckboxContainer.setLabel("Show CHAOS");
  let chaosCheckbox = chaosCheckboxContainer['checkbox'];

  chaosCheckbox.onclick = () => {
    pendulums = manyPendulums(5); //init multiple pends

    // init the canvases associated with them
    chaosCanvas = createGraphics(Wsim, Hsim)
    chaosCanvas.clear()

    chaosPlotCanvas = createGraphics(0.3*Wplot, 0.8*Hplot)
    chaosPlotCanvas.background(20)
    chaosPlotCanvas.stroke(255)
    chaosPlotCanvas.strokeWeight(1)
    chaosPlotCanvas.noFill()
    chaosPlotCanvas.rect(0, 0, 0.3*Wplot, 0.8*Hplot)

    chaosPlotCanvas_extra = createGraphics(0.3*Wplot, 0.8*Hplot)
    chaosPlotCanvas_extra.clear()
    chaosPlotCanvas_extra.stroke(255)
    chaosPlotCanvas_extra.strokeWeight(1)
    chaosPlotCanvas_extra.noFill();
   }

  let chaosRow2 = makeRow(chaos);

  let chaosButtons = new buttonContainer(chaosRow2);
  let chaosStartButton = chaosButtons.makeButton("Start",function(){chaosIsPlaying=true});
  let chaosStopButton = chaosButtons.makeButton("Stop",function(){chaosIsPlaying=false});
  let chaosResetButton = chaosButtons.makeButton("Reset", () => {pendulums = manyPendulums(5)});

  let plots = makeItem(dd)
  plots.setLabel("Additional graphs");
  let plotsRow1 = makeRow(plots);

  ppCheckboxContainer1 = makeCheckbox(plotsRow1);
  //let ppCheckbox1 = ppCheckboxContainer1['checkbox'];
  ppCheckboxContainer2 = makeCheckbox(plotsRow1);
  //let ppCheckbox2 = ppCheckboxContainer2['checkbox'];
  ppCheckboxContainer1.setLabel("Phase portrait 1");
  ppCheckboxContainer2.setLabel("Phase portrait 2");

}

function resetFunc(){ //resets the pend to 0
  dp.initCond=[0,0,0,0];
  dp.ball1[0] = dp.l1*Math.sin(dp.initCond[2]);
  dp.ball1[1] = dp.l1*Math.cos(dp.initCond[2]);
  dp.ball2[0] = dp.ball1[0] + dp.l2*Math.sin(dp.initCond[3]);
  dp.ball2[1] = dp.ball1[1] + dp.l2*Math.cos(dp.initCond[3]);
}

function mouseDragged(){
  dp.drag();
}


function draw() {
  //border of simCanvas
  simCanvas.clear()
  bgCanvas.background(20);
  plotCanvas3_extra.clear()
  plotCanvas1_extra.clear()
  plotCanvas2_extra.clear()
  simCanvas.stroke(255)
  simCanvas.strokeWeight(2)
  simCanvas.noFill()
  simCanvas.rect(10, 10, Wsim - 20, Hsim - 20)

  let RKCheckbox = RKCheckboxContainer['checkbox'];
  let EulerCheckbox = eulerCheckboxContainer['checkbox'];

  dp.show(simCanvas) //drawing the dp

  if (isPlaying === true){
    if (EulerCheckbox.checked === true) {
      dp.move("Euler");
    }
    else {
      dp.move("RK");
    }
  }
  let ppCheckbox1 = ppCheckboxContainer1['checkbox'];
  let ppCheckbox2 = ppCheckboxContainer2['checkbox'];

  if (ppCheckbox1.checked === true){ //draw upper phase portrait
    dp.plotPhasePortrait(plotCanvas1_extra,[2,0],200,[20,15],[Wplot/2,Hplot/2],dp.ppHistory1)
    text("Angular velocity1",Wsim-Wplot-140,30)
    text("Angle1",Wsim-60,Hplot+30)
    image(plotCanvas1, Wsim-Wplot-30,14)
    image(plotCanvas1_extra, Wsim-Wplot-30,14)
  }


  if (ppCheckbox2.checked === true){
  //drawing bottom phase portrait
  dp.plotPhasePortrait(plotCanvas2_extra,[3,1],200,[5,10],[Wplot/2,Hplot/2],dp.ppHistory2)
    text("Angular velocity2",Wsim-Wplot-140,Hplot+30);
    text("Angle2",Wsim-60,2*Hplot+47);
    image(plotCanvas2, Wsim-Wplot-30,Hplot+35);
    image(plotCanvas2_extra, Wsim-Wplot-30,Hplot+35);
  }

  //drawing the timeseries
  dp.plotTimeSeries(plotCanvas3_extra);


  dp.drawTrace(simCanvas,300) //draw the second balls trace

  let chaosCheckbox = chaosCheckboxContainer['checkbox'];
  if (chaosCheckbox.checked === true){

    chaosCanvas.clear();
    chaosPlotCanvas_extra.clear();

    for(let i=0;i<pendulums.length;i++){
      pendulums[i].show(chaosCanvas);
      pendulums[i].plotTimeSeries(chaosPlotCanvas_extra);
      if (chaosIsPlaying === true){
        pendulums[i].move("RK");
      }
    }

    image(chaosCanvas, Wsim-60, 0);
    image(chaosPlotCanvas, Wsim+145, 300);
    image(chaosPlotCanvas_extra,Wsim+145,300);
    text("Angle(s)1", Wsim+150, 290);
    text("time", Wsim+150 + 0.3*Wplot, 270+Hplot);
  }



  //plot labels
  fill(255)
  text("Angle1",30,Hplot+70)
  text("time",Wplot3,Hplot+88+Hplot3)
  text("Give initial position by dragging!",30,30);

  image(simCanvas, 0, 0);
  image(plotCanvas3, 30, Hplot + 75)
  image(plotCanvas3_extra,30,Hplot+75)


}
