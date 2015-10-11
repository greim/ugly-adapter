/*
 * Copyright (c) 2015 by Greg Reimer <gregreimer@gmail.com>
 * MIT License. See mit-license.txt for more info.
 */

/*eslint-env node, mocha */

import assert from 'assert';
import adapt from '../index';
import pkg from '../package';
import fs from 'fs';

async function assertAsyncThrows(fn, message) {
  try { await fn(); }
  catch(ex) { return; }
  throw new Error(message || 'missing expected exception');
}

function say(mess, cb) {
  setImmediate(() => {
    cb(null, mess);
  });
}

function getSelf() {
  const cb = [].slice.call(arguments).pop();
  setImmediate(() => {
    cb(null, this);
  });
}

function fail(cb) {
  setImmediate(() => {
    cb(new Error('oops'));
  });
}

function arrayify() {
  const args = [].slice.call(arguments)
    , cb = args.pop();
  setImmediate(() => {
    cb(null, args);
  });
}

const arrayifyLib = { arrayify };

describe('test helpers', () => {

  it('should say()', done => {

    say('hello', (err, message) => {
      if (err) {
        done(err);
      } else {
        assert.strictEqual(message, 'hello');
        done();
      }
    });
  });

  it('should getSelf()', done => {

    const thisThing = {};
    getSelf.call(thisThing, (err, thatThing) => {
      if (err) {
        done(err);
      } else {
        assert.strictEqual(thisThing, thatThing);
        done();
      }
    });
  });

  it('should fail()', done => {

    fail(err => {
      assert.ok(err);
      done();
    });
  });

  it('should arrayify() 0 args', done => {

    arrayify((err, array) => {
      if (err) {
        done(err);
      } else {
        assert.deepEqual(array, []);
        done();
      }
    });
  });

  it('should arrayify() 1 arg', done => {

    arrayify(1, (err, array) => {
      if (err) {
        done(err);
      } else {
        assert.deepEqual(array, [1]);
        done();
      }
    });
  });

  it('should arrayify() 2 args', done => {

    arrayify(1, 2, (err, array) => {
      if (err) {
        done(err);
      } else {
        assert.deepEqual(array, [1,2]);
        done();
      }
    });
  });

  it('should arrayify() 3 args', done => {

    arrayify(1, 2, 3, (err, array) => {
      if (err) {
        done(err);
      } else {
        assert.deepEqual(array, [1,2,3]);
        done();
      }
    });
  });

  it('should arrayify() 4 args', done => {

    arrayify(1, 2, 3, 4, (err, array) => {
      if (err) {
        done(err);
      } else {
        assert.deepEqual(array, [1,2,3,4]);
        done();
      }
    });
  });

  it('should arrayify() falsy args', done => {

    arrayify(null, undefined, false, (err, array) => {
      if (err) {
        done(err);
      } else {
        assert.deepEqual(array, [null, undefined, false]);
        done();
      }
    });
  });
});

describe(pkg.name, () => {

  describe('bare functions', () => {

    it('should work', async function() {
      const m = await adapt(say, 'hi');
      assert.equal(m, 'hi');
    });

    it('should return a promise', () => {
      const p = adapt(say, 'hi');
      assert.ok(p.then && typeof p.then === 'function', 'not a promise');
    });

    it('should pass undefined context (in strict mode)', async function() {
      const self = await adapt(getSelf);
      assert.strictEqual(self, undefined);
    });

    it('should pass 0 arguments', async function() {
      const array = await adapt(arrayify);
      assert.deepEqual(array, []);
    });

    it('should pass 1 argument', async function() {
      const array = await adapt(arrayify, 'a');
      assert.deepEqual(array, ['a']);
    });

    it('should pass 2 arguments', async function() {
      const array = await adapt(arrayify, 'a', 'b');
      assert.deepEqual(array, ['a','b']);
    });

    it('should pass 3 arguments', async function() {
      const array = await adapt(arrayify, 'a', 'b', 'c');
      assert.deepEqual(array, ['a','b','c']);
    });

    it('should pass 4 arguments', async function() {
      const array = await adapt(arrayify, 'a', 'b', 'c', 'd');
      assert.deepEqual(array, ['a','b','c','d']);
    });

    it('should pass falsy arguments', async function() {
      const array = await adapt(arrayify, null, undefined, false);
      assert.deepEqual(array, [null, undefined, false]);
    });

    it('should error', async function() {
      await assertAsyncThrows(async function() {
        await adapt(fail);
      });
    });

    it('should partially apply', async function() {
      assert.deepEqual(await adapt.part(arrayify,0,1,2,3,4,5,6)(),[0,1,2,3,4,5,6]);
      assert.deepEqual(await adapt.part(arrayify,0,1,2,3,4,5)(6),[0,1,2,3,4,5,6]);
      assert.deepEqual(await adapt.part(arrayify,0,1,2,3,4)(5,6),[0,1,2,3,4,5,6]);
      assert.deepEqual(await adapt.part(arrayify,0,1,2,3)(4,5,6),[0,1,2,3,4,5,6]);
      assert.deepEqual(await adapt.part(arrayify,0,1,2)(3,4,5,6),[0,1,2,3,4,5,6]);
      assert.deepEqual(await adapt.part(arrayify,0,1)(2,3,4,5,6),[0,1,2,3,4,5,6]);
      assert.deepEqual(await adapt.part(arrayify,0)(1,2,3,4,5,6),[0,1,2,3,4,5,6]);
      assert.deepEqual(await adapt.part(arrayify)(0,1,2,3,4,5,6),[0,1,2,3,4,5,6]);
      assert.deepEqual(await adapt.part()(arrayify,0,1,2,3,4,5,6),[0,1,2,3,4,5,6]);
    });

    it('partial application should error', async function() {
      assertAsyncThrows(async function() {
        await adapt.part()(fail);
      });
    });

    it('partial application should pass undefined context (in strict mode)', async function() {
      assert.strictEqual(await adapt.part(getSelf)(), undefined);
      assert.strictEqual(await adapt.part()(getSelf), undefined);
      assert.strictEqual(await adapt.part(getSelf,1,2,3,4,5,6,7,8,9)(), undefined);
      assert.strictEqual(await adapt.part()(getSelf,1,2,3,4,5,6,7,8,9), undefined);
    });
  });

  describe('methods on objects', () => {

    it('should work', async function() {
      const fakeLib = { say }
        , m = await adapt.method(fakeLib, 'say', 'hi');
      assert.equal(m, 'hi');
    });

    it('should return a promise', () => {

      const fakeLib = { say }
        , p = adapt.method(fakeLib, 'say', 'hi');
      assert.ok(p.then && typeof p.then === 'function', 'not a promise');
    });

    it('should pass context', async function() {
      const fakeLib = { getSelf }
        , self = await adapt.method(fakeLib, 'getSelf');
      assert.strictEqual(self, fakeLib);
    });

    it('should pass 0 arguments', async function() {
      const fakeLib = { arrayify }
        , array = await adapt.method(fakeLib, 'arrayify');
      assert.deepEqual(array, []);
    });

    it('should pass 1 argument', async function() {
      const fakeLib = { arrayify }
        , array = await adapt.method(fakeLib, 'arrayify', 'a');
      assert.deepEqual(array, ['a']);
    });

    it('should pass 2 arguments', async function() {
      const fakeLib = { arrayify }
        , array = await adapt.method(fakeLib, 'arrayify', 'a', 'b');
      assert.deepEqual(array, ['a','b']);
    });

    it('should pass 3 arguments', async function() {
      const fakeLib = { arrayify }
        , array = await adapt.method(fakeLib, 'arrayify', 'a', 'b', 'c');
      assert.deepEqual(array, ['a','b','c']);
    });

    it('should pass 4 arguments', async function() {
      const fakeLib = { arrayify }
        , array = await adapt.method(fakeLib, 'arrayify', 'a', 'b', 'c', 'd');
      assert.deepEqual(array, ['a','b','c','d']);
    });

    it('should pass falsy arguments', async function() {
      const fakeLib = { arrayify }
        , array = await adapt.method(fakeLib, 'arrayify',null,undefined,false);
      assert.deepEqual(array, [null,undefined,false]);
    });

    it('should error', async function() {
      const fakeLib = { fail };
      assertAsyncThrows(async function() {
        await adapt.method(fakeLib, 'fail');
      });
    });

    it('should partially apply', async function() {
      assert.deepEqual(await adapt.method.part(arrayifyLib,'arrayify',1,2,3,4,5,6,7,8,9,10)(), [1,2,3,4,5,6,7,8,9,10]);
      assert.deepEqual(await adapt.method.part(arrayifyLib,'arrayify',1,2,3,4,5,6,7,8,9)(10), [1,2,3,4,5,6,7,8,9,10]);
      assert.deepEqual(await adapt.method.part(arrayifyLib,'arrayify',1,2,3,4,5,6,7,8)(9,10), [1,2,3,4,5,6,7,8,9,10]);
      assert.deepEqual(await adapt.method.part(arrayifyLib,'arrayify',1,2,3,4,5,6,7)(8,9,10), [1,2,3,4,5,6,7,8,9,10]);
      assert.deepEqual(await adapt.method.part(arrayifyLib,'arrayify',1,2,3,4,5,6)(7,8,9,10), [1,2,3,4,5,6,7,8,9,10]);
      assert.deepEqual(await adapt.method.part(arrayifyLib,'arrayify',1,2,3,4,5)(6,7,8,9,10), [1,2,3,4,5,6,7,8,9,10]);
      assert.deepEqual(await adapt.method.part(arrayifyLib,'arrayify',1,2,3,4)(5,6,7,8,9,10), [1,2,3,4,5,6,7,8,9,10]);
      assert.deepEqual(await adapt.method.part(arrayifyLib,'arrayify',1,2,3)(4,5,6,7,8,9,10), [1,2,3,4,5,6,7,8,9,10]);
      assert.deepEqual(await adapt.method.part(arrayifyLib,'arrayify',1,2)(3,4,5,6,7,8,9,10), [1,2,3,4,5,6,7,8,9,10]);
      assert.deepEqual(await adapt.method.part(arrayifyLib,'arrayify',1)(2,3,4,5,6,7,8,9,10), [1,2,3,4,5,6,7,8,9,10]);
      assert.deepEqual(await adapt.method.part(arrayifyLib,'arrayify')(1,2,3,4,5,6,7,8,9,10), [1,2,3,4,5,6,7,8,9,10]);
      assert.deepEqual(await adapt.method.part(arrayifyLib)('arrayify',1,2,3,4,5,6,7,8,9,10), [1,2,3,4,5,6,7,8,9,10]);
      assert.deepEqual(await adapt.method.part()(arrayifyLib,'arrayify',1,2,3,4,5,6,7,8,9,10), [1,2,3,4,5,6,7,8,9,10]);
    });

    it('partial application should error', async function() {
      const fakeLib = { fail };
      assertAsyncThrows(async function() {
        await adapt.part()(fakeLib, 'fail');
      });
    });

    it('partial application should pass context', async function() {
      const fakeLib = { getSelf };
      assert.strictEqual(await adapt.method.part(fakeLib, 'getSelf')(), fakeLib);
      assert.strictEqual(await adapt.method.part(fakeLib)('getSelf'), fakeLib);
      assert.strictEqual(await adapt.method.part()(fakeLib, 'getSelf'), fakeLib);
      assert.strictEqual(await adapt.method.part()(fakeLib, 'getSelf',1,2,3,4,5,6,7,8), fakeLib);
      assert.strictEqual(await adapt.method.part(fakeLib, 'getSelf',1,2,3,4,5,6,7,8)(), fakeLib);
    });
  });

  describe('library promisification', () => {

    it('should promisify all of fs', async function() {
      const pfs = adapt.promify(fs)
        , stat = await pfs.stat(__dirname);
      assert.ok(stat.isDirectory());
      assert.strictEqual(typeof pfs.readdir, 'function');
      assert.strictEqual(typeof pfs.readFile, 'function');
    });

    it('should promisify named methods of fs', async function() {
      const pfs = adapt.promify(fs, 'stat', 'readdir')
        , stat = await pfs.stat(__dirname);
      assert.ok(stat.isDirectory());
      assert.strictEqual(typeof pfs.readdir, 'function');
      assert.strictEqual(typeof pfs.readFile, 'undefined');
    });

    it('should promisify a fake lib', () => {
      const fakeLib = { qux: () => {} }
        , pFakeLib = adapt.promify(fakeLib);
      assert.strictEqual(typeof pFakeLib.qux, 'function');
    });

    it('should carry over non-functions', () => {
      const fakeLib = {
        foo: 'bar',
        qux: () => {},
      };
      const pFakeLib = adapt.promify(fakeLib);
      assert.strictEqual(pFakeLib.foo, 'bar');
    });
  });
});

