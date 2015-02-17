# Tool to get promises out of standard callback APIs

**Here:**
*Where we are now.*
API methods return `undefined` and accept a callback as the last arg having a signature of `(err, result)`.

**There:**
*Where we want to be.*
API methods don't require callbacks as the last arg, and instead return promise objects.

This lib is a temporary, ugly, intermediate hack to get from *here* to *there*, until such time as the APIs available to us return promises and don't require callbacks.
That's all.

## Install

```bash
npm install ugly-adapter
```

## Use

```js
var adapt = require('ugly-adapter')
  , promise = yield adapt(fs.readFile, 'data.text', 'utf8')
```

# API

## Call a function, return a promise.

```js
yield adapt(someFunc, ...args)
```

## Call a method, return a promise

```js
var adapt = require('ugly-adapter')
  , promise = adapt.method(object, methodName, ...args)
```

## FAQ

 1. **Aren't promises slow?** Yieldme will return [Bluebird](https://www.npmjs.com/package/bluebird) promises if they're available.
 2. **Doesn't another lib already do this?** Yes, and lots of other stuff besides. This lib is very minimal.
 3. **Wouldn't "pretty" be better?** Native promises *will* happen someday, at which point things can be pretty. When it comes time to refactor my own modules to support that, I don't want to have to unpush a magic button, and until then I'd prefer my code to treat deficiencies in the platform explicitly.
