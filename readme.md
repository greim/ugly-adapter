# Turn any callback into a promise

The idea of promises as *thenables* is okay, I guess.
But with generators I'm more excited about promises as *yieldables*.

The impetus for this lib is that I want to convert error-first-callback functions into promises on the fly, which I can then yield from `co()` and the like (and eventually async/await), *consistently across my codebase*.
Anyhow, to get a yieldable:

## I can either use a wrapper lib...

...for which there's modules like `mz`

```js
var fs = require('mz/fs')
co(function*(){
  var data = yield fs.readFile('data.json', 'utf8')
})
```

But since shipping modified versions of libraries isn't scalable, I'll end up using `mz` in some places but not others.

## Or I can manually wrap the lib...

...for which there's modules like `promisify-node`

```js
var promisify = require('promisify-node');
var fs = promisify('fs');
co(function*(){
  var data = yield fs.readFile('./foo.js', 'utf8')
})
```

But this makes assumptions about the structure of the lib.
`fs.exists()` would be mysteriously broken unless they special-cased it, for example.
And anyway these all feel too magical.

## Or I can use this "yieldme" hack.

```js
var fs = require('fs')
  , me = require('yieldme')
co(function*(){
  var data = yield me(fs.readFile, './foo.js', 'utf8')
})
```

It's explicit, and allows me to apply the same pattern everywhere without performing alchemy on all my dependencies.

# API

## Calling a function.

```js
yield me(someFunc, ...args)
```

Calls `someFunc(...args)`, best for when `this` is unimportant in the function.
Returns a promise.

```js
var fs = require('fs')
yield me(fs.readFile, './foo.js')
```

## Calling a method

```js
yield me.method(object, methodName, ...args)
```

Calls `object[methodName](...args)`, best for when `this` is important in the function.
Returns a promise.

```js
var client = Client({ token:'xxx', secret:'yyy' })
var results = yield me.method(client, 'searchUsers', { filter: '*alex*' })
```
