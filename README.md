# NodeCacheHelper

A helper for node-cache

## Install

Yarn
```
yarn add node-cache
yarn add node-cache-helper
```

NPM
```
npm install node-cache --save
npm install node-cache-helper --save
```

## Notice

Key DO NOT contain `_`

## Usage

See [cache.test.js](./lib/cache.test.js) File

```js
const CacheHelper = require('node-cache-helper')
const singleflight = require('node-singleflight')

let instance = new CacheHelper()

instance.register('Videos', () => singleflight.Do('Videos', someAsyncFuncReturnA))
let d = await instance.get('Videos') // d = A

// With Special Args
// split key with `_` and send them as args of function
async function getUser(id) { return id }
instance.register('User', (id) => singleflight.Do('User_' + id, () => getUser(id)))
let d1 = await instance.get('User_1')   // d1 = 1
let d2 = await instance.get('User_2')   // d2 = 2
let d3 = await instance.get('User_tmp') // d3 = tmp
```
