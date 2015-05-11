# Straightforward way to obtain promises from your standard error-first callback functions

Large swaths of the node/io.js ecosystem use callbacks for asynchronous flow.
Many people wish these methods returned promises instead or in addition to accepting callbacks.
Whether or not that wish is someday fulfilled, this lib provides an easy way to get promises from callback APIs.

## Install

```bash
npm install ugly-adapter
```

## Use

This library adapts any function that accepts an error-first callback to produce plain old [ES6 promises](http://www.2ality.com/2014/10/es6-promises-api.html) instead.
Its uses JavaScript's native promise implementation.

```js
var adapt = require('ugly-adapter')

adapt(fs.readFile, './data.txt', 'utf8')
.then(function(data) {
  // now you have data!
})
.catch(function(err) {
  // oops, there was an error :(
})
```

This lib also exposes `part()` methods, which provide a convenient way to do [partial application](http://ejohn.org/blog/partial-functions-in-javascript/).
This is useful if you want to re-use an adapted version of a function.

```js
get = adapt.part(require('http').get)
get('http://localhost/foo').then(...)
get('http://localhost/bar').then(...)
```

# API

## Call a bare function

```js
var adapt = require('ugly-adapter')
  , promise = adapt(someFunction, ...args)

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

```js
// method sees proper 'this'
var adapt = require('ugly-adapter')
  , promise = adapt.method(object, methodName, ...args)

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
var adapt = require('ugly-adapter')
  , fn = adapt.part(someFunction, ...someArgs)
  , promise = fn(...moreArgs)

// example
var readData = adapt.part(fs.readFile, './data.txt', 'utf8')
readData().then(function(data) {
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

Note about partial application. You can basically just move the `)(` around willy-nilly.

```js
// these behave identically
var promise = adapt.part(a, b)()
var promise = adapt.part(a)(b)
var promise = adapt.part()(a, b)
```
