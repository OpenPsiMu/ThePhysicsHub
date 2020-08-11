const express = require('express');
const router = express.Router();
const simArray = require('./parameters/simulationdata');
const index = simArray.findIndex(function (i) { return i.urlName == "elasticPendulum" });

router.get('/', function(req,res,next){
res.render('simulationsite', { sim: simArray[index] });
});

module.exports = router;