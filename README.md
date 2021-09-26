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

## Usage

See [cache.test.js](./lib/cache.test.js) File

```js
const CacheHelper = require('node-cache-helper')
const singleflight = require('node-singleflight')

let instance = new CacheHelper()

instance.register('Videos', () => singleflight.Do('Videos', someAsyncFuncReturnA))
let d = await instance.get('Videos') // d = A
```
