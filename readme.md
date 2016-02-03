# Universal Callback => Promise Adapter

With [Koa](http://koajs.com/) and [ES7 async functions](https://jakearchibald.com/2014/es7-async-functions/) gaining prominence, the JavaScript world is poised to transition to promises.
That means we need a sane way to convert callback-based APIs to promise-based ones.
Rather than using lots of different wrappers, each specific to a different API, this lib provides a single way to convert any API that adheres to the error-first callback convention which is practically universal in Node.

## Install

```bash
npm install ugly-adapter
```

## Use

```js
var fs = require('ugly-adapter');
var adapt = require('ugly-adapter');

// ...using callbacks
fs.readFile('./data.txt', 'utf8', (err, data) => {
  if (err) { handle(err); }
  else { doStuffWith(data); }
});

// ...using promises
adapt(fs.readFile, './data.txt', 'utf8').then(
  data => doStuffWith(data),
  err => handle(err)
);
```

There's more stuff in the API, but that's the gist.

# Error handling

Some Node.js error-first callback API functions sometimes have dual error handling behavior if things go wrong, like so:

```js
// throws synchronously
foo.bar('invalid', 'arguments', function(err, result) {});

// calls back with err
foo.bar('valid', 'arguments', function(err, result) {});
```

Ugly adapter behaves the same in either case—a rejected promise—in order to facilitate a single error handling path.

# API

## Call a bare function: `adapt()`

Useful when you don't think a function cares about `this`.

```js
// signature
var promise = adapt(<function>, ...args);

// example
var promise = adapt(fs.readFile, './data.txt', 'utf8');
```

## Call a method on an object: `adapt.method()`

Useful when you think a function cares about `this`.

```js
// signature
var promise = adapt.method(<object>, <string>, ...args);

// example
var user = new User();
var promise = adapt.method(user, 'authenticate', {
  userName: userName,
  password: password
});
```

## Partially apply a bare function: `adapt.part()`

```js
// signature
var fn = adapt.part(<function>, ...args);

// example
var stat = adapt.part(fs.stat, './data.txt', 'utf8');
var promise = stat();
```

## Partially apply a method on an object: `adapt.method.part()`

```js
// signature
var fn = adapt.method.part(<object>, <string>, ...args);

// example
var user = new User();
var authenticate = adapt.method.part(user, 'authenticate');
var promise = authenticate({
  userName: userName,
  password: password
});
```

A note about partial application.
You can essentially move the `)(` around willy-nilly.
All of these behave identically:

```js
var promise = adapt.part(a,b,c)();
var promise = adapt.part(a,b)(c);
var promise = adapt.part(a)(b,c);
var promise = adapt.part()(a,b,c);
```

## Promify a library: `adapt.promify(lib)`

When a module is a namespace object with functions on it—such as `fs`—you can "promify" it.
It will return an object with all the same properties and functions.
The functions return promises and have the same signature, except for the callbacks.

```js
import adapt from 'ugly-adapter');
import fscb = from 'fs';
var fs = adapt.promify(fs);
...
await fs.stat('./data.txt');
var data = await fs.readFile('./data.txt', 'utf8');
await fs.unlink('./data.txt');
```

Alternatively, declare a whitelist to of functions to be converted:

```js
import adapt from 'ugly-adapter');
import fscb = from 'fs';
var fs = adapt.promify(fs, 'stat', 'readFile'); // <-- whitelist
...
await fs.stat('./data.txt');
var data = await fs.readFile('./data.txt', 'utf8');
await fs.unlink('./data.txt'); // error, not in whitelist!
```

# Async/Await Example

Now that we can convert callbacks to promises, we can write async functions everywhere.

```js
async function jsonReadFile(path, encoding) {
  let data = await adapt(fs.readFile, encoding);
  data = JSON.parse(data);
  return data;
}
```

# Any Promise

The ugly adapter uses [any-promise](https://github.com/kevinbeaty/any-promise) promises.
This is something you can safely ignore and everything works normally.
However, if you want to polyfill/replace your environment's Promise for whatever reason, this allows you swap in whatever conforming Promise you want and this library will use it.
