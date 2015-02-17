# Get promises out of callback APIs

**Here:**
*Where we are now.*
API methods return undefined and accept a callback as the last arg having a signature of `(err, result)`.

**There:**
*Where we want to be.*
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

 1. **Aren't promises slow?** This lib will return [Bluebird](https://www.npmjs.com/package/bluebird) promises if you've added them to your project, otherwise native. Either way the API is the same. This lib does not however explicitly depend on Bluebird; it has to be reachable by name from your project, in which case it will be auto-detected.
 2. **Doesn't Lib X already do this?** Yes, and lots of other stuff besides. This lib is very minimal. If you're already using Lib X, you should probably use it and not this.
 3. **Is es6 required?** Sort of. Bluebird (see above) or a global `Promise` constructor (which is part of es6) is required. If neither are found this lib will bounce down the runway and burst into flames.
 4. **Wouldn't "pretty" be better?** Native promises will happen someday, at which point things can be pretty. When it comes time to refactor my own modules to support that, I don't want to have to unpush a magic button, and until then I'd prefer my code to be explicit about its hacks and workarounds.