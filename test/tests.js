/*
 * Copyright (c) 2015 by Greg Reimer <gregreimer@gmail.com>
 * MIT License. See mit-license.txt for more info.
 */

'use strict'

var assert = require('assert')
  , co = require('co')
  , adapt = require('../index')
  , pkg = require('../package')

function say(mess, cb){
  setImmediate(function(){
    cb(null, mess)
  })
}

function getSelf(cb){
  var self = this
  setImmediate(function(){
    cb(null, self)
  })
}

function fail(cb){
  setImmediate(function(){
    cb(new Error('oops'))
  })
}

function arrayify(){
  var args = [].slice.call(arguments)
    , cb = args.pop()
  setImmediate(function(){
    cb(null, args)
  })
}


describe('test helpers', function(){

  it('should say()', function(done){

    say('hello', function(err, message){
      if (err) {
        done(err)
      }
      assert.strictEqual(message, 'hello')
      done()
    })
  })

  it('should getSelf()', function(done){

    var thisThing = {}
    getSelf.call(thisThing, function(err, thatThing){
      if (err) {
        done(err)
      }
      assert.strictEqual(thisThing, thatThing)
      done()
    })
  })

  it('should fail()', function(done){

    fail(function(err){
      assert.ok(err)
      done()
    })
  })

  it('should arrayify() 0 args', function(done){

    arrayify(function(err, array){
      if (err) {
        done(err)
      }
      assert.deepEqual(array, [])
      done()
    })
  })

  it('should arrayify() 1 arg', function(done){

    arrayify(1,function(err, array){
      if (err) {
        done(err)
      }
      assert.deepEqual(array, [1])
      done()
    })
  })

  it('should arrayify() 2 args', function(done){

    arrayify(1,2,function(err, array){
      if (err) {
        done(err)
      }
      assert.deepEqual(array, [1,2])
      done()
    })
  })

  it('should arrayify() 3 args', function(done){

    arrayify(1,2,3,function(err, array){
      if (err) {
        done(err)
      }
      assert.deepEqual(array, [1,2,3])
      done()
    })
  })

  it('should arrayify() 4 args', function(done){

    arrayify(1,2,3,4,function(err, array){
      if (err) {
        done(err)
      }
      assert.deepEqual(array, [1,2,3,4])
      done()
    })
  })

  it('should arrayify() falsy args', function(done){

    arrayify(null, undefined, false,function(err, array){
      if (err) {
        done(err)
      }
      assert.deepEqual(array, [null, undefined, false])
      done()
    })
  })
})

describe(pkg.name, function(){

  describe('bare functions', function(){

    it('should work', function(done){

      co(function*(){
        var m = yield adapt(say, 'hi')
        assert.equal(m, 'hi')
        done()
      }).catch(done)
    })

    it('should return a promise', function(){

      var p = adapt(say, 'hi')
      assert.ok(p.then && typeof p.then === 'function', 'not a promise')
    })

    it('should pass undefined context (in strict mode)', function(done){

      co(function*(){
        var self = yield adapt(getSelf)
        assert.strictEqual(self, undefined)
        done()
      }).catch(done)
    })

    it('should pass 0 arguments', function(done){

      co(function*(){
        var array = yield adapt(arrayify)
        assert.deepEqual(array, [])
        done()
      }).catch(done)
    })

    it('should pass 1 argument', function(done){

      co(function*(){
        var array = yield adapt(arrayify, 'a')
        assert.deepEqual(array, ['a'])
        done()
      }).catch(done)
    })

    it('should pass 2 arguments', function(done){

      co(function*(){
        var array = yield adapt(arrayify, 'a', 'b')
        assert.deepEqual(array, ['a','b'])
        done()
      }).catch(done)
    })

    it('should pass 3 arguments', function(done){

      co(function*(){
        var array = yield adapt(arrayify, 'a', 'b', 'c')
        assert.deepEqual(array, ['a','b','c'])
        done()
      }).catch(done)
    })

    it('should pass 4 arguments', function(done){

      co(function*(){
        var array = yield adapt(arrayify, 'a', 'b', 'c', 'd')
        assert.deepEqual(array, ['a','b','c','d'])
        done()
      }).catch(done)
    })

    it('should pass falsy arguments', function(done){

      co(function*(){
        var array = yield adapt(arrayify, null, undefined, false)
        assert.deepEqual(array, [null, undefined, false])
        done()
      }).catch(done)
    })

    it('should error', function(done){

      co(function*(){
        yield adapt(fail)
        done(new Error('failed to fail'))
      }).catch(function(){
        done()
      })
    })

    it('should curry', function(done){

      co(function*(){
        var curried = adapt.curry(say, 'hi')
        var m = yield curried()
        assert.equal(m, 'hi')
        done()
      }).catch(done)
    })

    it('should curry just one arg', function(done){

      co(function*(){
        var curried = adapt.curry(say)
        var m = yield curried('hi')
        assert.equal(m, 'hi')
        done()
      }).catch(done)
    })

    it('should curry no args', function(done){

      co(function*(){
        var curried = adapt.curry()
        var m = yield curried(say, 'hi')
        assert.equal(m, 'hi')
        done()
      }).catch(done)
    })

    it('curry should error', function(done){

      co(function*(){
        yield adapt.curry()(fail)
        done(new Error('failed to fail'))
      }).catch(function(){
        done()
      })
    })
  })

  describe('methods on objects', function(){

    it('should work', function(done){

      co(function*(){
        var fakeLib = { say: say }
        var m = yield adapt.method(fakeLib, 'say', 'hi')
        assert.equal(m, 'hi')
        done()
      }).catch(done)
    })

    it('should return a promise', function(){

      var fakeLib = { say: say }
      var p = adapt.method(fakeLib, 'say', 'hi')
      assert.ok(p.then && typeof p.then === 'function', 'not a promise')
    })

    it('should pass context', function(done){

      co(function*(){
        var fakeLib = { getSelf: getSelf }
        var self = yield adapt.method(fakeLib, 'getSelf')
        assert.strictEqual(self, fakeLib)
        done()
      }).catch(done)
    })

    it('should pass 0 arguments', function(done){

      co(function*(){
        var fakeLib = { arrayify: arrayify }
        var array = yield adapt.method(fakeLib, 'arrayify')
        assert.deepEqual(array, [])
        done()
      }).catch(done)
    })

    it('should pass 1 argument', function(done){

      co(function*(){
        var fakeLib = { arrayify: arrayify }
        var array = yield adapt.method(fakeLib, 'arrayify', 'a')
        assert.deepEqual(array, ['a'])
        done()
      }).catch(done)
    })

    it('should pass 2 arguments', function(done){

      co(function*(){
        var fakeLib = { arrayify: arrayify }
        var array = yield adapt.method(fakeLib, 'arrayify', 'a', 'b')
        assert.deepEqual(array, ['a','b'])
        done()
      }).catch(done)
    })

    it('should pass 3 arguments', function(done){

      co(function*(){
        var fakeLib = { arrayify: arrayify }
        var array = yield adapt.method(fakeLib, 'arrayify', 'a', 'b', 'c')
        assert.deepEqual(array, ['a','b','c'])
        done()
      }).catch(done)
    })

    it('should pass 4 arguments', function(done){

      co(function*(){
        var fakeLib = { arrayify: arrayify }
        var array = yield adapt.method(fakeLib, 'arrayify', 'a', 'b', 'c', 'd')
        assert.deepEqual(array, ['a','b','c','d'])
        done()
      }).catch(done)
    })

    it('should pass falsy arguments', function(done){

      co(function*(){
        var fakeLib = { arrayify: arrayify }
        var array = yield adapt.method(fakeLib, 'arrayify',null,undefined,false)
        assert.deepEqual(array, [null,undefined,false])
        done()
      }).catch(done)
    })

    it('should error', function(done){

      co(function*(){
        var fakeLib = { fail: fail }
        yield adapt.method(fakeLib, 'fail')
        done(new Error('failed to fail'))
      }).catch(function(){
        done()
      })
    })

    it('should curry', function(done){

      co(function*(){
        var fakeLib = { say: say }
        var curried = adapt.method.curry(fakeLib, 'say', 'hi')
        var m = yield curried()
        assert.equal(m, 'hi')
        done()
      }).catch(done)
    })

    it('should curry just two args', function(done){

      co(function*(){
        var fakeLib = { say: say }
        var curried = adapt.method.curry(fakeLib, 'say')
        var m = yield curried('hi')
        assert.equal(m, 'hi')
        done()
      }).catch(done)
    })

    it('should curry just one arg', function(done){

      co(function*(){
        var fakeLib = { say: say }
        var curried = adapt.method.curry(fakeLib)
        var m = yield curried('say', 'hi')
        assert.equal(m, 'hi')
        done()
      }).catch(done)
    })

    it('should curry no args', function(done){

      co(function*(){
        var fakeLib = { say: say }
        var curried = adapt.method.curry()
        var m = yield curried(fakeLib, 'say', 'hi')
        assert.equal(m, 'hi')
        done()
      }).catch(done)
    })

    it('curry should error', function(done){

      co(function*(){
        var fakeLib = { fail: fail }
        yield adapt.curry()(fakeLib, 'fail')
        done(new Error('failed to fail'))
      }).catch(function(){
        done()
      })
    })
  })
})

