const NodeCache = require('node-cache')

const DefaultConfig = {
  stdTTL: 10 * 60, // cache for 10 mins
  useClones: true,
  deleteOnExpire: false,
}

class Cache {
  constructor(config = DefaultConfig) {
    this.instance = new NodeCache(config)
    this.registerMap = {}
    this.onExpired()
  }

  register(prefix, reloadFn, ttl) {
    this.registerMap[prefix] = {
      prefix,
      reloadFn,
      ttl,
    }
  }

  async resetKey(key) {
    let spl = key.split('_')
    let prefix = spl[0]
    let { reloadFn, ttl } = this.registerMap[prefix] ?? {}
    if (reloadFn == null) {
      return null
    }
    spl.shift()
    let newValue = await reloadFn(...spl)
    this.instance.set(key, newValue, ttl)
    return newValue
  }

  async get(key) {
    let v = this.instance.get(key)
    if (v != null) {
      return v
    }
    return this.resetKey(key)
  }

  onExpired() {
    this.instance.on('expired', key => {
      this.resetKey(key).then().catch(console.error)
    })
  }
}

module.exports = Cache
