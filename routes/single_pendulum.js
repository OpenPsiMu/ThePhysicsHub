const express = require('express');
const router = express.Router();

router.get('/', function(req,res,next){
    res.render('single_pendulum');
});

module.exports = router;