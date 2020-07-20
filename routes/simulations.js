const express = require('express');
const router = express.Router();

const simArray = [];
simArray[0] = {"name": "Single Pendulum", "description": "This is a single pendulum", "reference": "/simulations/single_pendulum"};
simArray[1] = {"name": "Double Pendulum", "description": "This is a double pendulum", "reference": "/simulations/double_pendulum"};

router.get('/', function(req,res,next){
    res.render('simulations', {simulations: simArray});
});

module.exports = router;