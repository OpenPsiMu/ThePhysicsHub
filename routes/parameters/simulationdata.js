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
  "urlName": "collision",
  "jsfile": "collision",
  "image": "collision.png",
  "description": "A simple collision engine to explore momentum conservation.",
  "explanation": "Play around and have fun"
},{
  "name": "nBody",
  "description": "Simulation that demonstrates gravity and collisions with n bodies",
  "urlName": "nBody",
  "jsfile": "nBody",
  "image": "nBody.png",
  "explanation": getFile("nBodyExplanation.ejs")
<<<<<<< HEAD
},{
  "name": "Double pendulum 2D",
  "description": "A pendulum with another pendulum attached to its end.",
  "urlName": "doublePendulum2D",
  "jsfile": "doublePendulum2D",
  "image": "doublePendulum2D.png",
  "explanation": "-"
=======
>>>>>>> 46c5225577a08fce8d9f20f6b7275739f9ad9d32
}];


function getFile(filename) {
  str = fs.readFileSync(path.resolve(__dirname, filename), "utf-8");
  return str;
}

module.exports = simulations;
