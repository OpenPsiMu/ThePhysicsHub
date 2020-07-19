/*!
 * npm-install-global <https://github.com/jonschlinkert/npm-install-global>
 *
 * Copyright (c) 2016-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

'use strict';

var fs = require('fs');
var path = require('path');
var gm = require('global-modules');
var spawn = require('cross-spawn');

/**
 * Execute `npm --global` with the given command and one or more package names.
 * This is the base for [install]() and [uninstall]().
 *
 * ```js
 * npm('install', 'verb', function(err) {
 *   if (err) throw err;
 * });
 * ```
 * @param {String|Array} `names` One or more package names.
 * @param {Function} `cb` Callback
 * @api public
 */

function npm(cmd, names, cb) {
  if (typeof cb !== 'function') {
    throw new TypeError('expected callback to be a function');
  }

  if (typeof names === 'string') {
    names = [names];
  }

  if (!Array.isArray(names)) {
    cb(new TypeError('expected names to be a string or array'));
    return;
  }

  var args = arrayify(cmd).concat(names);
  spawn('npm', args, {stdio: 'inherit'})
    .on('error', cb)
    .on('close', function(code, err) {
      cb(err, code);
    });
}

/**
 * Execute `npm [cmd] --global` with one or more package `names`.
 *
 * ```js
 * npm.global('install', 'generate', function(err) {
 *   if (err) throw err;
 * });
 * ```
 * @param {String} `cmd` The command to run
 * @param {String|Array} `names` One or more package names.
 * @param {Function} `cb` Callback
 * @api public
 */

npm.global = function(cmd, names, cb) {
  npm([cmd, '--global'], names, cb);
};

/**
 * Execute `npm install --global` with one or more package `names`.
 *
 * ```js
 * npm.install('generate', function(err) {
 *   if (err) throw err;
 * });
 * ```
 * @param {String|Array} `names` One or more package names.
 * @param {Function} `cb` Callback
 * @api public
 */

npm.install = function(names, cb) {
  npm.global('install', names, cb);
};

/**
 * Install the given packages if they are not already installed.
 *
 * ```js
 * npm.maybeInstall(['foo', 'bar', 'baz'], function(err) {
 *   if (err) throw err;
 * });
 * ```
 * @param {String|Array} `names` One or more package names.
 * @param {Function} `cb` Callback
 * @api public
 */

npm.maybeInstall = function(names, cb) {
  if (typeof names === 'string') {
    names = [names];
  }

  names = names.filter(function(name) {
    return !isInstalled(name);
  });

  if (names.length === 0) {
    return cb(null, []);
  }

  npm.global('install', names, function(err) {
    if (err) return cb(err);
    cb(null, names);
  });
};

/**
 * Execute `npm uninstall --global` with one or more package `names`.
 *
 * ```js
 * npm.uninstall('yeoman', function(err) {
 *   if (err) throw err;
 * });
 * ```
 * @param {String|Array} `names` One or more package names.
 * @param {Function} `cb` Callback
 * @api public
 */

npm.uninstall = function(names, cb) {
  npm.global('uninstall', names, cb);
};

/**
 * Returns true if package `name` is already installed globally
 */

function isInstalled(name) {
  return fs.existsSync(path.resolve(gm, name));
}

function arrayify(val) {
  return val ? (Array.isArray(val) ? val : [val]) : [];
}

/**
 * Expose `npm`
 */

module.exports = npm;
