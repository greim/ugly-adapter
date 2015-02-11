var Promise = require('native-or-bluebird')
  , slice = Array.prototype.slice

function methodPromify(target, method){
  var args = slice.call(arguments, 2);
  return new Promise(function(resolve, reject){
    args.push(function(err, result){
      if (err) reject(err);
      else resolve(result);
    });
    target[method].apply(target, args);
  });
}

function functionPromify(fn){
  var args = slice.call(arguments, 1);
  return new Promise(function(resolve, reject){
    args.push(function(err, result){
      if (err) reject(err);
      else resolve(result);
    });
    fn.apply(null, args);
  });
};

module.exports = functionPromify;
module.exports.method = methodPromify;
