QuickSettings.useExtStyleSheet();

let center;
const tablePeri = 500;
const massPeri = 28;
const g = 9.81;
let xRes = 0;
let yRes = 0;
let x = 300;
let y = 300;
const dt = 0.01;
let fRes;
var gui; 
var massGuis = [];
var numOfWeights = [1, 2, 3, 4, 5, 6];
var mass1 = 0;
var mass2 = 0;
var mass3 = 0;
var mass4 = 0;
var mass5 = 0;
var mass6 = 0;
var rad1 = 0;
var rad2 = 0;
var rad3 = 0;
var rad4 = 0;
var rad5 = 0;
var rad6 = 0;
var started = false;
var myNumber = 10;
let weight1;
let rect;



function setup(){

      cnv = createCanvas(1200,600);
      cnv.parent('simwrapper');
      simwrapper = document.getElementById('simwrapper');
      rect = simwrapper.getBoundingClientRect();
      background(20);
      strokeWeight(1);
      stroke(150);
      for(i=1; i<=6; i++){
        line(i*1100/8, 0, i*1100/8, 600);
      }
      for(i=1; i<=8; i++){
        line(0, i* 500/7.5, 827, i*500/7.5);
      }
      
      gui1 = createGui('myGui');
      gui1.addGlobals('numOfWeights');
      gui1.setPosition(rect.left+800, rect.top+10);

      center = createVector(300,300);    
      startButton = createButton('Start!');
      startButton.position(985, 530);
      startButton.mousePressed(startSim);
      startButton.parent('simwrapper');

  }

  function draw(){
    
    for(i=1; i <= numOfWeights; i++){
      if(typeof massGuis[i] == 'undefined'){
      massGuis[i] = createGui('Weight'+i.toString());
      sliderRange(0,50, 1);
      massGuis[i].addGlobals('mass'+i.toString());
      sliderRange(0,2,0.1);
      massGuis[i].addGlobals('rad'+i.toString());
      if(i <= 3){
      massGuis[i].setPosition(rect.left + 800, rect.top+ 96 + 130*(i-1));
      }else{
        massGuis[i].setPosition(rect.left + 1005, rect.top + 96 + 130*(i-4));
      }
      center = createVector(300,300);  
        
    
      }

  }

      fill('black');
      table = ellipse(center.x,center.y,tablePeri);
      
      masses = [];
      forces = [];

      weight1 = createMass(mass1,rad1, '1');
      weight2 = createMass(mass2,rad2, '2');
      weight3 = createMass(mass3,rad3, '3');
      weight4 = createMass(mass4,rad4, '4');
      weight5 = createMass(mass5,rad5, '5');
      weight6 = createMass(mass6,rad6, '6');

      strokeWeight(2);
      fill(20);
      centerMass = ellipse(x, y, 40, 40);

      


      if(started){


      fRes = createVector(0,0);
      forces.forEach(force => fRes.add(force));
      forces.push(fRes);
    
    drawForces();

      forces.forEach(function(force, index){
          xRes += force.x*dt;
          yRes += force.y*dt;
      });

      if(mag(x-center.x,y-center.y) < 0.5 *(tablePeri)){
      x += xRes*dt;
      y += yRes*dt;
    }else{
        textSize(14);
        fill('white');
        strokeWeight(0);
        text("Resulting force:\nx: " + fRes.x +"N" + "\ny: "+ -fRes.y + "N" + "\n\nTry balancing the forces!", center.x + 40, center.y+40);
     }
    }

  }

  
function createMass(mass, rad, num){
    if(mass != 0){
    fill(155);

    m = ellipse(center.x+0.5*(tablePeri-(20+0.5*mass))*cos(rad*PI), center.y+0.5*(tablePeri-(20+0.5*mass))*-sin(rad*PI),20+0.5* mass, 20+0.5*mass);
    masses.push(m);

    force = createVector(mass*g*cos(rad*PI), mass*g*-sin(rad*PI));
    forces.push(force);

    fill('white');
    text(num, center.x+0.5*(tablePeri-(20+0.5*mass))*cos(rad*PI)-3, center.y+0.5*(tablePeri-(20+0.5*mass))*-sin(rad*PI)+3);
    }
}

function biggestForce(){

    let strongestForce = createVector(0,0);

    for(i = 0; i < forces.length; i++){
        if(strongestForce.mag() < forces[i].mag()){
            strongestForce = forces[i];
        }  
    }
    return strongestForce;
}

function drawForces(){
    forces.forEach(function(force, index){
        adjustedForce = createVector(force.x*0.5*tablePeri/(biggestForce().mag()),force.y*0.5*tablePeri/(biggestForce().mag()));
        drawArrow(center, adjustedForce, 'white');
    })

}


function drawArrow(base, vec, myColor) {
    push();
    stroke(myColor);
    strokeWeight(3);
    fill(myColor);
    translate(base.x, base.y);
    line(0, 0, vec.x, vec.y);
    rotate(vec.heading());
    let arrowSize = 7;
    translate(vec.mag() - arrowSize, 0);
    triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
    pop();
  }

function startSim(){
    started = true;
}