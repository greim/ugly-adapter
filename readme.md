# Simple Callback => Promise Helper

Promises are your shiny new smartphone, but you're trying to plug it into the Soviet-era Dell laptop of callbacks.
So you go to the store and buy an adapter, intending to throw it away soon, but for now you need it and it will live in your backpack for like three years and get all caked with dirt but keep working.

## Install

```bash
npm install ugly-adapter
```

## Use

This library adapts any function that accepts an error-first callback to produce ES6 promises.

```js
var adapt = require('ugly-adapter')

adapt(fs.readFile, './data.txt', 'utf8').then(function(data) {
  // now you have data!
}).catch(function(err) {
  // oops, there was an error :(
});
```

This lib also exposes methods to make partial application easier.
Partial application is useful if you want to re-use an adapted version of a function.

```js
read = adapt.part(require('fs').readFile)
read('./data1', 'utf8').then(...)
read('./data2', 'utf8').then(...)
```

# API

## Call a bare function

Useful when you don't think a function cares about `this`.

```js
var promise = adapt(someFunction, ...args)

// example
adapt(fs.readFile, './data.txt', 'utf8').then(function(data) {
  // ...
})

// same thing but using a callback (for comparison purposes)
fs.readFile('./data.txt', 'utf8', function(err, data) {
  // ...
})
```

## Call a method on an object

Useful when you DO think a function cares about `this`.

```js
var promise = adapt.method(object, methodName, ...args)

// example
var user = new User()
adapt.method(user, 'authenticate', {
  userName: userName,
  password: password
}).then(function() {
  // ...
})

// same thing but using a callback (for comparison purposes)
var user = new User()
user.authenticate({
  userName: userName,
  password: password
}, function(err) {
  // ...
})
```

## Partially apply a bare function

```js
var fn = adapt.part(someFunction, ...someArgs)
  , promise = fn(...moreArgs)

// example
var statData = adapt.part(fs.stat, './data.txt', 'utf8')
statData().then(function(stat) {
  // ...
})
```

## Partially apply a method on an object

```js
var adapt = require('ugly-adapter')
  , fn = adapt.method.part(object, methodName, ...someArgs)
  , promise = fn(...moreArgs)

// example
var user = new User()
var authenticate = adapt.method.part(user, 'authenticate')
authenticate({
  userName: userName,
  password: password
}).then(function() {
  // ...
})
```

A note about partial application.
You can basically just move the `)(` around willy-nilly.

```js
// these behave identically
var promise = adapt.part(a, b)()
var promise = adapt.part(a)(b)
var promise = adapt.part()(a, b)
```
