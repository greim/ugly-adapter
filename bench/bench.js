/*
 * Copyright (c) 2015 by Greg Reimer <gregreimer@gmail.com>
 * MIT License. See mit-license.txt for more info.
 */

var BluebirdPromise = require('bluebird')
  , numeral = require('numeral')
  , len = 1000000

console.log('Starting benchmarks...')

// -----------------------------------

setTimeout(function(){
  var lenA = len
    , startA = Date.now();
  (function next(){
    if (lenA-- > 0){
      new Promise(function(resolve, reject){resolve()}).then(next)
    } else {
      var endA = Date.now()
      console.log('----------------------')
      console.log('Native promises: %s iterations took %s ms.', numeral(len).format('0,0'), numeral(endA - startA).format('0,0'))
      setTimeout(function(){
        var lenB = len
          , startB = Date.now();
        (function next(){
          if (lenB-- > 0){
            new BluebirdPromise(function(resolve, reject){resolve()}).then(next)
          } else {
            var endB = Date.now()
            console.log('Bluebird promises: %s iterations took %s ms.', numeral(len).format('0,0'), numeral(endB - startB).format('0,0'))
            console.log('----------------------')
            console.log('So, um... yeah, there you go :)')
          }
        })()
      }, 3000)
    }
  })()
}, 0)
