const express = require('express');
const router = express.Router();
const simArray = require('./parameters/simulationdata');

router.get('/', function(req,res,next){
    res.render('simulations', {simulations: simArray});
});

module.exports = router;
