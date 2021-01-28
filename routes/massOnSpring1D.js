const express = require('express');
const router = express.Router();
const simArray = require('./parameters/simulationdata');
const index = simArray.findIndex(function (i) { return i.urlName == "massOnSpring1D" });
const fs = require('fs');
const path = require('path');
const navbar = fs.readFileSync(path.resolve(__dirname, "parameters/navigationbar.ejs"), "utf-8");

router.get('/', function(req,res,next){
res.render('simulationsite', { sim: simArray[index], navbar: navbar });
});

module.exports = router;
