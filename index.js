/*
 * Copyright (c) 2015 by Greg Reimer <gregreimer@gmail.com>
 * MIT License. See mit-license.txt for more info.
 */

var Promise = require('native-or-bluebird')
  , slice = Array.prototype.slice

function methodPromify(target, method, arg0, arg1){
  var chopLength = 2
    , argCount = arguments.length - chopLength;
  if (argCount > 2){
    var args = slice.call(arguments, chopLength);
    return new Promise(function(resolve, reject){
      args.push(function(err, result){
        if (err) reject(err);
        else resolve(result);
      });
      target[method].apply(target, args);
    });
  } else {
    return new Promise(function(resolve, reject){
      var cb = function(err, result){
        if (err) reject(err);
        else resolve(result);
      };
      if (argCount === 2){
        target[method].call(target, arg0, arg1, cb);
      } else if (argCount === 1){
        target[method].call(target, arg0, cb);
      } else if (argCount === 0){
        target[method].call(target, cb);
      }
    });
  }
}

function functionPromify(fn, arg0, arg1){
  var chopLength = 1
    , argCount = arguments.length - chopLength;
  if (argCount > 2){
    var args = slice.call(arguments, chopLength);
    return new Promise(function(resolve, reject){
      args.push(function(err, result){
        if (err) reject(err);
        else resolve(result);
      });
      fn.apply(null, args);
    });
  } else {
    return new Promise(function(resolve, reject){
      var cb = function(err, result){
        if (err) reject(err);
        else resolve(result);
      };
      if (argCount === 2){
        fn.call(null, arg0, arg1, cb);
      } else if (argCount === 1){
        fn.call(null, arg0, cb);
      } else if (argCount === 0){
        fn.call(null, cb);
      }
    });
  }
};

module.exports = functionPromify;
module.exports.method = methodPromify;
