/**
 * [drawspring description]
 * @param  Number xa   [x coordinate of 1st point]
 * @param  Number ya   [y coordinate of 2nd point]
 * @param  Number xb   [x coordinate of 1st point]
 * @param  Number yb   [y coordinate of 2nd point]
 * @param  Number rlen [rest length of spring]
 * @param  Canvas canv [canvas instance to plot on]
 * @return
 */

function drawSpring(xa, ya, xb, yb, rlen, canv) {
  let n = parseInt(20 * rlen / 100)
  let step = ((xa - xb) ** 2 + (ya - yb) ** 2) ** 0.5 / n; //steps between vertices
  let ang = atan((yb - ya) / (xb - xa)); //angle between two points
  step = (xa > xb) ? (-step) : step; //step is increased from a to b
  let flag = (xa > xb) ? -1 : 1;

  canv.noFill();

  canv.push();
  canv.translate(xa, ya);
  canv.rotate(ang, createVector(0, 0, 1));

  canv.beginShape();
  canv.vertex(0, 0);
  canv.vertex(step / 2, 0)
  for (let i = 1; i < n; i++) {
    canv.vertex(step * i, flag * 5 * (-1) ** i)
  }
  canv.vertex((n - 0.5) * step, 0);
  canv.vertex(n * step, 0);
  canv.endShape();

  canv.pop();
}