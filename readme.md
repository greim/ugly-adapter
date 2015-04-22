# Straightforward way to obtain promises from your standard error-first callback APIs

Large swaths of the npm ecosystem--plus node.js and io.js--have async APIs that accept callbacks.
Many people wish these APIs produced promises instead.
Whether or not that wish is someday realized, this lib meanwhile provides an easy way to obtain promises from error-first callback-driven APIs.

## Install

```bash
npm install ugly-adapter
```

## Use

```js
var adapt = require('ugly-adapter')
  , promise = adapt(fs.readFile, 'data.text', 'utf8')
```

```js
// helper for partial application
var read = adapt.part(fs.readFile)
  , promise = read('data.txt', 'utf8')
```

# API

## Call a bare function

```js
var adapt = require('ugly-adapter')
  , promise = adapt(someFunction, ...args)
```

## Call a method on an object

```js
var adapt = require('ugly-adapter')
  , promise = adapt.method(object, methodName, ...args)
```

## Partially apply a bare function

```js
var adapt = require('ugly-adapter')
  , fn = adapt.part(someFunction, ...someArgs)
  , promise = fn(...someMoreArgs)
```

## Partially apply a method on an object

```js
var adapt = require('ugly-adapter')
  , fn = adapt.method.part(object, methodName, ...someArgs)
  , promise = fn(...someMoreArgs)
```

Note about partial application. You can basically just move the `)(` around willy-nilly.

```js
// these behave identically
var promise = adapt.part(a, b)()
var promise = adapt.part(a)(b)
var promise = adapt.part()(a, b)
```

## FAQ

 1. **Aren't promises slow?** To satisfy the promises-are-slow-you-should-use-bluebird crowd, this lib will create and return [native-or-bluebird](https://www.npmjs.com/package/native-or-bluebird) promises. Either way, the API is identical. Note that this lib doesn't actually pull in or depend on Bluebird in any way. You must depend on it in your own `package.json`. There's a benchmark in this project which sucks and should be improved, but which you can run if you want.
 2. **Doesn't Lib X already do this?** Yes, and lots of other stuff besides. This lib is very minimal. If you're already using Lib X, you should probably keep using it and ignore this. If, however, you're using a generator trampoline like [co](https://www.npmjs.com/package/co) and all you want are *yieldables*, maybe this is the ticket.
 3. **Is es6 required?** Sort of. Bluebird (see above) or a global `Promise` constructor (which is part of es6) is required. If neither are found this lib will only bring cataclysm and death.
 