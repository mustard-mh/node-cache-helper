const Cache = require('./cache')
const singleflight = require('node-singleflight')

test('GOOD: Register cache with singleflight, call api only once', async () => {
  apiTimes = 0
  let instance = getNewInstance()
  instance.register('Videos', () => singleflight.Do('Videos', getVideo))
  let tasks = Array.apply(null, Array(5)).map(e => instance.get('Videos'))
  let list = await Promise.all(tasks)
  // call api only once
  expect(apiTimes).toBe(1)
  expect(list.length).toBe(5)
  expect(list[0].length).toBe(3)
})

test('BAD: Register cache with normal fn, call api with 5 times', async () => {
  apiTimes = 0
  let instance = getNewInstance()
  instance.register('Videos', () => getVideo())
  let tasks = Array.apply(null, Array(5)).map(e => instance.get('Videos'))
  let list = await Promise.all(tasks)
  // call api only five times
  expect(apiTimes).toBe(5)
  expect(list.length).toBe(5)
  expect(list[0].length).toBe(3)
})

test('GOOD: Register cache with special args', async () => {
  apiTimes = 0
  let instance = getNewInstance()
  instance.register('video', async (id, tmp) => {
    expect(tmp).toBe('t' + id)
    let ret = await singleflight.Do('video_' + id, async () => {
      let d = await getVideo(id)
      return d
    })
    return ret
  })

  // split key with `_` and send them as args of function
  let data = await Promise.all([
    instance.get('video_1_t1'),
    instance.get('video_2_t2'),
  ])
  expect(apiTimes).toBe(2)
  expect(data[0].id).toBe(1)
  expect(data[1].id).toBe(2)
})

test('Expired', async () => {
  apiTimes = 0

  let instance = getNewInstance()
  instance.register('Videos', () => singleflight.Do('Videos', getVideo))
  let tasks = Array.apply(null, Array(5)).map(e => instance.get('Videos'))

  let d = await instance.get('Videos')
  await instance.get('Videos')
  await instance.get('Videos')
  await sleep(TTL)
  let d2 = await instance.get('Videos')
  expect(apiTimes).toBe(2)
  expect(d.length).toBe(3)
  expect(d2.length).toBe(3)
})

const TTL = 2

const getNewInstance = () =>
  new Cache({
    stdTTL: TTL, // cache for 10s
    useClones: true,
    deleteOnExpire: false,
  })

const mockApiResp = [
  { id: 1, name: 'A' },
  { id: 2, name: 'B' },
  { id: 3, name: 'C' },
]

const sleep = s => new Promise(resolve => setTimeout(resolve, s * 1000))

let apiTimes = 0

async function getVideo(id = null) {
  apiTimes++
  await sleep(0.1)
  if (id == null) {
    return mockApiResp
  }
  return mockApiResp[id - 1]
}
