const express = require('express');
const router = express.Router();

router.get('/', function(req,res,next){
    res.render('simulationsite', {jsfile: '/javascripts/single_pendulum.js'});
});

module.exports = router;