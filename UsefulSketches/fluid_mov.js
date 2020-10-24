const num = 7000;
const range = 6;

let Xk = [];
let Yk = [];

/*
var setup = function() {
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	canvas.onmousedown = mouseDown;
	canvas.onmouseup = mouseUp;
	canvas.onmousemove = getMousePosition;
	loopTimer = setInterval(loop, frameDelay);
}
*/

function setup() {
  createCanvas(650, 300);
  for ( let i = 0; i < num; i++ ) {
    Xk[i] = width / 2;
    Yk[i] = height / 2;
  }
  frameRate(30);
}

function draw() {
  background(51);

  
  for ( let i = 1; i < num; i++ ) {
    Xk[i - 1] = Xk[i];
    Yk[i - 1] = Yk[i];
  }

  Xk[num - 1] += random(-range, range);
  Yk[num - 1] += random(-range, range);
  Xk[num - 1] = constrain(Xk[num - 1], 0, width);
  Yk[num - 1] = constrain(Yk[num - 1], 0, height);

  
  for ( let j = 1; j < num; j++ ) {
    let val = j / num * 272.0 + 77;
    stroke(val);
    line(Xk[j - 1], Yk[j - 1], Xk[j], Yk[j]);
  }
}
