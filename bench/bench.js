/*
 * Copyright (c) 2015 by Greg Reimer <gregreimer@gmail.com>
 * MIT License. See mit-license.txt for more info.
 */

'use strict';

const BluebirdPromise = require('bluebird')
  , numeral = require('numeral');

const len = 1000000;

console.log('Starting benchmarks...');

// -----------------------------------

setTimeout(function() {
  let lenA = len
    , startA = Date.now();
  (function next() {
    if (lenA-- > 0) {
      new Promise(function(resolve) { resolve(); }).then(next);
    } else {
      const endA = Date.now();
      console.log('----------------------');
      console.log('Native promises: %s iterations took %s ms.', numeral(len).format('0,0'), numeral(endA - startA).format('0,0'));
      setTimeout(function() {
        let lenB = len
          , startB = Date.now();
        (function next2() {
          if (lenB-- > 0) {
            new BluebirdPromise(function(resolve) { resolve(); }).then(next2);
          } else {
            const endB = Date.now();
            console.log('Bluebird promises: %s iterations took %s ms.', numeral(len).format('0,0'), numeral(endB - startB).format('0,0'));
            console.log('----------------------');
            console.log('So, um... yeah, there you go :)');
          }
        })();
      }, 3000);
    }
  })();
}, 0);
