var assert = require('assert')
  , co = require('co')
  , me = require('../index')

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
  var self = this
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

describe('yieldme', function(){

  describe('test functions', function(){

    it('should say()', function(done){

      say('hello', function(err, message){
        if (err) done(err)
        assert.strictEqual(message, 'hello')
        done()
      })
    })

    it('should getSelf()', function(done){

      var thisThing = {}
      getSelf.call(thisThing, function(err, thatThing){
        if (err) done(err)
        assert.strictEqual(thisThing, thatThing)
        done()
      })
    })

    it('should fail()', function(done){

      var thisThing = {}
      fail(function(err){
        assert.ok(err)
        done()
      })
    })

    it('should arrayify()', function(done){

      arrayify(1,2,3,function(err, array){
        if (err) done(err)
        assert.deepEqual(array, [1,2,3])
        done()
      })
    })
  })

  describe('functions', function(){

    it('should work', function(done){

      co(function*(){
        var m = yield me(say, 'hi')
        assert.equal(m, 'hi')
        done()
      }).catch(done)
    })

    it('should return a promise', function(){

      var p = me(say, 'hi')
      assert.ok(p.then && typeof p.then === 'function', 'not a promise')
    })

    it('should pass context', function(done){

      co(function*(){
        var self = yield me(getSelf)
        assert.strictEqual(self, global)
        done()
      }).catch(done)
    })

    it('should pass arguments', function(done){

      co(function*(){
        var array = yield me(arrayify, 'a', 'b', 'c')
        assert.deepEqual(array, ['a','b','c'])
        done()
      }).catch(done)
    })

    it('should error', function(done){

      co(function*(){
        yield me(fail)
        done(new Error('failed to fail'))
      }).catch(function(){
        done()
      })
    })
  })

  describe('methods', function(){

    it('should work', function(done){

      co(function*(){
        var fakeLib = { say: say }
        var m = yield me.method(fakeLib, 'say', 'hi')
        assert.equal(m, 'hi')
        done()
      }).catch(done)
    })

    it('should return a promise', function(){

      var fakeLib = { say: say }
      var p = me.method(fakeLib, 'say', 'hi')
      assert.ok(p.then && typeof p.then === 'function', 'not a promise')
    })

    it('should pass context', function(done){

      co(function*(){
        var fakeLib = { getSelf: getSelf }
        var self = yield me.method(fakeLib, 'getSelf')
        assert.strictEqual(self, fakeLib)
        done()
      }).catch(done)
    })

    it('should pass arguments', function(done){

      co(function*(){
        var fakeLib = { arrayify: arrayify }
        var array = yield me.method(fakeLib, 'arrayify', 'a', 'b', 'c')
        assert.deepEqual(array, ['a','b','c'])
        done()
      }).catch(done)
    })

    it('should error', function(done){

      co(function*(){
        var fakeLib = { fail: fail }
        yield me.method(fakeLib, 'fail')
        done(new Error('failed to fail'))
      }).catch(function(){
        done()
      })
    })
  })
})

