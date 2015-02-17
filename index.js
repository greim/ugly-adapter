/*
 * Copyright (c) 2015 by Greg Reimer <gregreimer@gmail.com>
 * MIT License. See mit-license.txt for more info.
 */

var Promise = require('native-or-bluebird')
  , slice = Array.prototype.slice

function methodPromify(target, method, arg0, arg1){
  var argCount = arguments.length - 2;
  if (argCount > 2){
    var args = slice.call(arguments, 2);
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
  var argCount = arguments.length - 1;
  if (argCount > 2){
    var args = slice.call(arguments, 1);
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
