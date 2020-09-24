QuickSettings.useExtStyleSheet(); // function to use dark theme

const tablePeri = 500;
const massPeri = 28;
const g = 9.81;
const dt = 0.01;

let center;
let fRes;
var gui;
let rect;
let nodes;

let xRes = 0;
let yRes = 0;
let x = 300;
let y = 300;
var started = false;
var myNumber = 10;

var massGuis = [];
var numOfWeights = [1, 2, 3, 4, 5, 6];

var mass1 = "0"; // assigning string values so that user input becomes a text field instead of a slider
var mass2 = "0";
var mass3 = "0";
var mass4 = "0";
var mass5 = "0";
var mass6 = "0";

var angle1 = "0";
var angle2 = "0";
var angle3 = "0";
var angle4 = "0";
var angle5 = "0";
var angle6 = "0";



let pressed = [];
for (i = 0; i < 6; i++) {
    pressed[i] = false;
}

let nodeDefined = [];


function setup() {

    cnv = createCanvas(1200, 600);
    cnv.parent('simwrapper'); // simwrapper allows us to position our elements relative to tha canvas instead of the screen
    simwrapper = document.getElementById('simwrapper');
    rect = simwrapper.getBoundingClientRect();
    background(20);
    strokeWeight(1);
    stroke(150);
    for (i = 1; i <= 6; i++) {
        line(i * 1100 / 8, 0, i * 1100 / 8, 600); // vertical grid lines
    }
    for (i = 1; i <= 8; i++) {
        line(0, i * 500 / 7.5, 827, i * 500 / 7.5); // horizontal grid lines
    }

    gui1 = createGui('myGui');
    gui1.addGlobals('numOfWeights'); // lets user select the number of weights in the simulation
    gui1.setPosition(rect.left + 800, rect.top + 10);

    center = createVector(300, 300);
    startButton = createButton('Start!');
    startButton.position(945, 550);
    startButton.mousePressed(startSim);
    startButton.parent('simwrapper');

    resetButton = createButton("Reset");
    resetButton.position(1010, 550);
    resetButton.mousePressed(resetSim);
    resetButton.parent('simwrapper');


}

function draw() {

    for (i = 1; i <= numOfWeights; i++) { // creating a gui to set angle and mass for every mass the user wants to use in his simulation
        if (typeof massGuis[i] == 'undefined') {
            massGuis[i] = createGui('Weight' + i.toString());
            sliderRange(0, 50, 1);
            massGuis[i].addGlobals('mass' + i.toString());
            sliderRange(0, 2, 0.1);
            massGuis[i].addGlobals('angle' + i.toString());
            if (i <= 3) {
                massGuis[i].setPosition(rect.left + 800, rect.top + 96 + 150 * (i - 1));
            } else {
                massGuis[i].setPosition(rect.left + 1005, rect.top + 96 + 150 * (i - 4));
            }
            center = createVector(300, 300);


        }

    }
    nodes = [];
    appendUnits();

    fill('black');
    table = ellipse(center.x, center.y, tablePeri);

    masses = [];
    angles = [];
    forces = [];

    weight1 = createMass(mass1, angle1, '1');
    weight2 = createMass(mass2, angle2, '2');
    weight3 = createMass(mass3, angle3, '3');
    weight4 = createMass(mass4, angle4, '4');
    weight5 = createMass(mass5, angle5, '5');
    weight6 = createMass(mass6, angle6, '6');


    strokeWeight(2);
    fill(20);
    centerMass = ellipse(x, y, 40, 40);




    if (started) { // simulation only starts when startButton changes started value to true


        stroke(155);
        fRes = createVector(0, 0);
        forces.forEach(force => fRes.add(force)); // adding up all forces to resulting force
        console.log('fres '+fRes.mag());
        console.log(biggestForce().mag()*0.015);

        if(fRes.mag() < biggestForce().mag()*0.017){
            fRes = createVector(0,0);
            for(i=0; i < forces.length; i++){
                forces[i] = createVector(0,0);

            }
        }

        forces.push(fRes);

        drawForces();

        forces.forEach(function(force, index) {
          if(index == forces.length-1){
          }
            xRes += force.x * dt;
            yRes += force.y * dt;
        });

        if (mag(x - center.x, y - center.y) < 0.1 * (tablePeri)) {
            x += xRes * dt;
            y += yRes * dt;
        } else {
            textSize(14);
            fill('white');
            strokeWeight(0);
            text("Resulting force:\nx: " + fRes.x + "N" + "\ny: " + -fRes.y + "N" + "\n\nTry balancing the forces!", center.x + 40, center.y + 40);
        }
    }

}


function createMass(massStr, angleStr, num) {

    mass = parseInt(massStr);
    rad = radians(parseInt(angleStr));

    if (mass != 0) {
        masses.push(mass);
        angles.push(rad);
        fill(155);

        if (pressed[parseInt(num) - 1]) {
            rad = atan2(center.y - mouseY, mouseX - center.x);

            strokeWeight(0.5);
            let string = line(x, y, center.x + 0.5 * (tablePeri - (20 + 0.5 * mass)) * cos(rad), center.y + 0.5 * (tablePeri - (20 + 0.5 * mass)) * -sin(rad));

            strokeWeight(1);
            stroke('blue');
            
            m = ellipse(center.x + 0.5 * (tablePeri - (20 + 0.5 * mass)) * cos(rad), center.y + 0.5 * (tablePeri - (20 + 0.5 * mass)) * -sin(rad), 20 + 0.5 * mass, 20 + 0.5 * mass);
            
            switch (num) {
                case "1":
                    angle1 = degrees(rad).toString();
                    break;
                case "2":
                    angle2 = degrees(rad).toString();
                    break;
                case "3":
                    angle3 = degrees(rad).toString();
                    break;
                case "4":
                    angle4 = degrees(rad).toString();
                    break;
                case "5":
                    angle5 = degrees(rad).toString();
                    break;
                case "6":
                    angle6 = degrees(rad).toString();
                    break;

            }

            if(rad < 0){
                rad = 2*PI + rad;
            }

            let inputs = document.getElementsByClassName('qs_text_input');
            inputs[2 * (parseInt(num)-1) + 1].value = degrees(rad).toString();

            strokeWeight(0);
            stroke(155);
        } else {
            strokeWeight(0.5);
            let string = line(x, y, center.x + 0.5 * (tablePeri - (20 + 0.5 * mass)) * cos(rad), center.y + 0.5 * (tablePeri - (20 + 0.5 * mass)) * -sin(rad));
            m = ellipse(center.x + 0.5 * (tablePeri - (20 + 0.5 * mass)) * cos(rad), center.y + 0.5 * (tablePeri - (20 + 0.5 * mass)) * -sin(rad), 20 + 0.5 * mass, 20 + 0.5 * mass);
        }
        force = createVector(mass * g * cos(rad), mass * g * -sin(rad));
        forces.push(force);

        fill('white');
        text(num, center.x + 0.5 * (tablePeri - (20 + 0.5 * mass)) * cos(rad) - 3, center.y + 0.5 * (tablePeri - (20 + 0.5 * mass)) * -sin(rad) + 3);
    }
}

function biggestForce() {

    let strongestForce = createVector(0, 0);

    for (i = 0; i < forces.length; i++) {
        if (strongestForce.mag() < forces[i].mag()) {
            strongestForce = forces[i];
        }
    }
    return strongestForce;
}

function drawForces() {
    forces.forEach(function(force, index) {
        adjustedForce = createVector(force.x * 0.5 * (tablePeri-5) / (biggestForce().mag()), force.y * 0.5 * (tablePeri-5) / (biggestForce().mag()));
        if(index == forces.length-1){
            drawArrow(center,adjustedForce, 'blue');
        }else{
        drawArrow(center, adjustedForce, 'white');
        }
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
    stroke(155);
}

function startSim() {
    started = true;
}


function appendUnits() {

    nodes = document.getElementsByClassName('qs_label');

    for (i = 0; i < nodes.length; i++) {
        if (nodes[i].textContent.includes('mass') && typeof nodeDefined[i] == 'undefined') {
            var addedText = document.createElement('b');
            addedText.innerHTML = ' in kg';
            nodes[i].appendChild(addedText);
            nodeDefined[i] = true;
        }
        if (nodes[i].textContent.includes('angle') && typeof nodeDefined[i] == 'undefined') {
            var addedText = document.createElement('b');
            addedText.innerHTML = ' in degrees';
            nodes[i].appendChild(addedText);
            nodeDefined[i] = true;
        }
    }
}

async function mousePressed() {
    for (i = 0; i < angles.length; i++) {
        if (pressed[i]) {
            rad = atan2(center.y - mouseY, mouseX - center.x);
            if(rad < 0){
                rad = 2*PI + rad;
            }
            
            switch (i) {
                case 0:
                    angle1 = degrees(rad).toString();
                    break;
                case 1:
                    angle2 = degrees(rad).toString();
                    break;
                case 2:
                    angle3 = degrees(rad).toString();
                    break;
                case 3:
                    angle4 = degrees(rad).toString();
                    break;
                case 4:
                    angle5 = degrees(rad).toString();
                    break;
                case 5:
                    angle6 = degrees(rad).toString();
                    break;

            }
            strokeWeight(0);

            let inputs = document.getElementsByClassName('qs_text_input');
            inputs[2 * i + 1].value = degrees(rad).toString();

            pressed[i] = false;
        }else if (!pressed[i]) {
            if (dist(mouseX, mouseY, center.x + 0.5 * (tablePeri - (20 + 0.5 * masses[i])) * cos(angles[i]), center.y + 0.5 * (tablePeri - (20 + 0.5 * masses[i])) * -sin(angles[i])) < mag(20 + 0.5 * mass, 20 + 0.5 * mass)) {
                pressed[i] = true;
            }
        }

    }
}

function resetSim(){
    started = false;
    x = 300;
    y = 300;
    numOfWeights = [1, 2, 3, 4, 5, 6];
    forces = [];
    xRes = 0;
    yRes = 0;
    fRes = 0;
    setup();
    
}
