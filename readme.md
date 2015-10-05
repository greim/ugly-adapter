# Simple Callback => Promise Adapter

With [ES7 async functions](https://jakearchibald.com/2014/es7-async-functions/) gaining attention, the JavaScript world is poised to transition to promises.
Unfortunately the error-first callback pattern is still mainstream, so for the foreseeable future we'll need a way to bridge the gap.
This library accomplishes that in a straightforward, non-magical, easy-to-use way.

## Install

```bash
npm install ugly-adapter
```

## Use

```js
import adapt from 'ugly-adapter';
adapt(fs.readFile, './data.txt', 'utf8').then(data => {
  // do something with `data`
});
```

This lib also exposes methods to make partial application easier.
Which is useful if you want to re-use an adapted version of a function.

```js
var read = adapt.part(fs.readFile);
await read('./data1', 'utf8').then(...);
await read('./data2', 'utf8').then(...);
```

# API

## Call a bare function

Useful when you don't think a function cares about `this`.

```js
// signature
var promise = adapt(<function>, ...args)

// example
adapt(fs.readFile, './data.txt', 'utf8').then(...)
```

## Call a method on an object

Useful when you think a function definitely cares about `this`.

```js
// signature
var promise = adapt.method(<object>, <string>, ...args)

// example
var user = new User()
adapt.method(user, 'authenticate', {
  userName: userName,
  password: password
}).then(...)
```

## Partially apply a bare function

```js
// signature
var fn = adapt.part(<function>, ...args)

// example
var stat = adapt.part(fs.stat, './data.txt', 'utf8')
stat().then(...)
```

## Partially apply a method on an object

```js
// signature
var fn = adapt.method.part(<object>, <string>, ...args)

// example
var user = new User()
var authenticate = adapt.method.part(user, 'authenticate')
authenticate({
  userName: userName,
  password: password
}).then(...)
```

A note about partial application.
You can basically move the `)(` around willy-nilly.

```js
// these behave identically
var promise = adapt.part(a,b,c)()
var promise = adapt.part(a,b)(c)
var promise = adapt.part(a)(b,c)
var promise = adapt.part()(a,b,c)
```

# ES7 Async/Await Example

```js
async function jsonReadFile(path, encoding) {
  let data = await adapt(fs.readFile, encoding);
  data = JSON.parse(data);
  return data;
}
```
