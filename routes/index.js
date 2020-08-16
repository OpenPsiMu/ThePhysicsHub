const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const navbar = fs.readFileSync(path.resolve(__dirname, "parameters/navigationbar.ejs"), "utf-8");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { navbar: navbar });
});

module.exports = router;
