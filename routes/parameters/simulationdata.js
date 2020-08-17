const fs = require('fs');
const path = require('path');


const simulations = [{
  "name": "Simple pendulum",
  "description": "A bob connected to a rigid massless rod suspended from a hinge.",
  "urlName": "simplePendulum",
  "jsfile": "simplePendulum",
  "image": "simplePendulum.png",
  "explanation": "<b> Yup, this text is bold and now <i>cursive</i></b>",
}, {
  "name": "Elastic pendulum",
  "description": "A bob connected to a spring suspended from a hinge.",
  "urlName": "elasticPendulum",
  "jsfile": "elasticPendulum",
  "image": "ellasticPendulum.png",
  "explanation": "-",
}, {
  "name": "Coupled pendulum",
  "description": "Two pendulum coupled by a spring connecting the bobs.",
  "urlName": "coupledPendulum",
  "jsfile": "coupledPendulum",
  "image": "coupledPendulum.png",
  "explanation": "-"
}, {
  "name": "Force Table",
  "description": "A force table for visualizing vector addition",
  "urlName": "force_table",
  "jsfile": "force_table",
  "image": "forceTable.png",
  "explanation": getFile("force_table_explanation.ejs")
}, {
  "name": "collision",
  "description": "Two pendulum coupled by a spring connecting the bobs.",
  "urlName": "collision",
  "jsfile": "collision",
  "image": "collision.png",
  "explanation": "Play around and have fun"
}];


function getFile(filename) {
  str = fs.readFileSync(path.resolve(__dirname, filename), "utf-8");
  return str;
}

module.exports = simulations;
