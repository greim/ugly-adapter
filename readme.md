# Straightforward way to obtain promises from your standard error-first callback functions

Large swaths of the node/io.js ecosystem use callbacks.
Many people wish they used promises instead.
Whether or not that wish is someday fulfilled, this lib provides an easy way to get promises from callback APIs.

## Install

```bash
npm install ugly-adapter
```

## Use

```js
var adapt = require('ugly-adapter')
  , promise = adapt(fs.readFile, './data.txt', 'utf8')
```

```js
// helper for partial application
var read = adapt.part(fs.readFile)
  , promise = read('./data.txt', 'utf8')
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
```

## Call a method on an object

```js
// method sees proper 'this'
var adapt = require('ugly-adapter')
  , promise = adapt.method(object, methodName, ...args)

// example
var user = new User()
adapt.method(user, 'authenticate').then(function(isAuthenticated) {
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
authenticate().then(function(isAuthenticated) {
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
