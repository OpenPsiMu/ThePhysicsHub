const express = require('express');
const router = express.Router();

router.get('/', function(req,res,next){
    res.render('simulationsite', {jsfile: '/javascripts/spring_double_pendulum.js'});
});

module.exports = router;
