# Summon the LORD of Promises up from the murky depths of the callback API underworld

Once summoned, He will transmute your leaden callback APIs into golden promises, if you can bear His ugly countenance.
As of the year of the LORD 2015 A.D., users of node.js/io.js who desire Promises stand at the brink of a great chasm:

**Here:**
API methods return undefined and accept a callback as the last arg having a signature of `(err, result)`.

**There:**
API methods don't require callbacks as the last arg, and instead return promise objects.

This lib is a temporary, ugly, intermediate, minimal hack to get from *here* to *there*, until such time as the APIs available to us return promises and don't require callbacks.
That's all.

## Install

```bash
npm install ugly-adapter
```

## Use

```js
var adapt = require('ugly-adapter')
  , promise = adapt(fs.readFile, 'data.text', 'utf8')
```

# API

## Call a bare function, return a promise.

```js
var adapt = require('ugly-adapter')
  , promise = adapt(someFunction, ...args)
```

## Call a method on an object, return a promise

```js
var adapt = require('ugly-adapter')
  , promise = adapt.method(object, methodName, ...args)
```

## FAQ

 1. **Aren't promises slow?** This lib will return [Bluebird](https://www.npmjs.com/package/bluebird) promises if available, otherwise native. What is Bluebird? It's a ridiculously tricked-out/hyper-optimized-for-v8 drop-in replacement (among other things) for the native ES6 `Promise` constructor which *by comparison* is slow. I mean seriously, don't look at [its source code](https://github.com/petkaantonov/bluebird/blob/master/src/promise.js) unless you're intimately familiar with v8 internals; it will only pollute your brain and confuse you. Either way, the promise API is the same. This lib doesn't actually pull in Bluebird. You must pull it in from your own `package.json`, in which case it will be auto-detected and used by this lib.
 2. **Doesn't Lib X already do this?** Yes, and lots of other stuff besides. This lib is very minimal. If you're already using Lib X, you should probably keep using it and ignore this. If, however, you're using a generator trampoline like [co](https://www.npmjs.com/package/co) and all you want are *yieldables*, maybe this is the ticket.
 3. **Is es6 required?** Sort of. Bluebird (see above) or a global `Promise` constructor (which is part of es6) is required. If neither are found this lib will bring cataclysm and death.
 4. **Wouldn't "pretty" be better?** Node.js / io.js will natively support promises one day, at which point things can be pretty. When it comes time to refactor my own modules to support that, I'd prefer my code to be explicit about its hacks and workarounds, instead of using various forms of trickery to pretend current APIs return promises.