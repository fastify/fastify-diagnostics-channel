'use strict'

const { test } = require('tap')
const Fastify = require('fastify')
const dcPlugin = require('../lib/index')
const dc = require('node:diagnostics_channel')
const sget = require('simple-get').concat
const { promisify } = require('node:util')
const pget = promisify(sget)

test('Should call publish when route is registered', async t => {
  t.plan(11)
  const fastify = Fastify()

  const onRouteChannel = dc.channel('fastify.onRoute')
  let timesCalled = 0
  const routeOptions = [
    {
      method: 'GET',
      url: '/test/1',
      path: '/test/1',
      routePath: '/1',
      prefix: '/test',
      logLevel: '',
      attachValidation: false
    },
    {
      method: 'HEAD',
      url: '/test/1',
      path: '/test/1',
      routePath: '/1',
      prefix: '/test',
      logLevel: '',
      attachValidation: false
    },
    {
      method: 'POST',
      url: '/test/2',
      path: '/test/2',
      routePath: '/2',
      prefix: '/test',
      logLevel: '',
      attachValidation: false
    },
    {
      method: 'GET',
      url: '/test/:id',
      path: '/test/:id',
      routePath: '/:id',
      prefix: '/test',
      logLevel: '',
      attachValidation: false
    },
    {
      method: 'HEAD',
      url: '/test/:id',
      path: '/test/:id',
      routePath: '/:id',
      prefix: '/test',
      logLevel: '',
      attachValidation: false
    }
  ]
  const onMessage = (message) => {
    timesCalled += 1
    const actual = { ...message }
    delete actual.onSend
    t.same(actual, { ...routeOptions.shift(), handler: message.handler })
    t.equal(typeof message.handler, 'function')
  }

  onRouteChannel.subscribe(onMessage)
  await fastify.register(dcPlugin)
  fastify.register((instance, _opts, done) => {
    instance.get('/1', (_request, reply) => reply.send({}))
    instance.post('/2', (_request, reply) => reply.send({}))
    instance.get('/:id', (_request, reply) => reply.send({}))
    done()
  }, { prefix: '/test' })

  await fastify.ready()
  t.equal(timesCalled, 5)
  onRouteChannel.unsubscribe(onMessage)
})

test('Should call publish when response is sent', async t => {
  t.plan(2)
  const fastify = Fastify()

  const onResponseChannel = dc.channel('fastify.onResponse')
  const onMessage = (message) => {
    t.same(message, {
      reply: replyObj,
      request: requestObj
    })
  }

  let replyObj, requestObj
  onResponseChannel.subscribe(onMessage)

  await fastify.register(dcPlugin)
  fastify.get('/', (request, reply) => {
    replyObj = reply
    requestObj = request
    reply.send({})
  })

  const res = await fastify.inject({
    method: 'GET',
    path: '/'
  })

  t.equal(res.statusCode, 200)
  onResponseChannel.unsubscribe(onMessage)
})

test('Should call publish when some error is throw', async t => {
  t.plan(2)
  const fastify = Fastify()

  const onErrorChannel = dc.channel('fastify.onError')
  const error = new Error('test error')
  const onMessage = (message) => {
    t.same(message, {
      error,
      reply: replyObj,
      request: requestObj
    })
  }

  let replyObj, requestObj
  onErrorChannel.subscribe(onMessage)

  await fastify.register(dcPlugin)
  fastify.get('/', (request, reply) => {
    replyObj = reply
    requestObj = request
    throw error
  })

  const res = await fastify.inject({
    method: 'GET',
    path: '/'
  })
  t.equal(res.statusCode, 500)
  onErrorChannel.unsubscribe(onMessage)
})

test('Should call onRequest when some request happens', async t => {
  t.plan(3)
  const fastify = Fastify()

  const onRequestChannel = dc.channel('fastify.onRequest')
  const onMessage = (message) => {
    t.equal(typeof message.request, 'object')
    t.equal(typeof message.reply, 'object')
  }
  onRequestChannel.subscribe(onMessage)

  await fastify.register(dcPlugin)
  fastify.get('/:id', (_request, reply) => reply.send({}))

  const address = await fastify.listen({ port: 0 })
  t.teardown(() => fastify.close())

  const res = await pget({
    method: 'GET',
    url: `${address}/1`
  })
  t.equal(res.statusCode, 200)
  onRequestChannel.unsubscribe(onMessage)
})

test('Should call publish when timeout happens', async t => {
  t.plan(2)
  const fastify = Fastify({ connectionTimeout: 200 })

  const onTimeoutChannel = dc.channel('fastify.onTimeout')
  const onMessage = (message) => {
    t.same(message, {
      request: requestObj,
      reply: replyObj,
      connectionTimeout: 200
    })
  }

  let replyObj, requestObj
  onTimeoutChannel.subscribe(onMessage)

  await fastify.register(dcPlugin)
  fastify.get('/:id', async (request, reply) => {
    requestObj = request
    replyObj = reply
    await new Promise((resolve) => setTimeout(resolve, 300))
    reply.send({})
  })

  const address = await fastify.listen({ port: 0 })
  t.teardown(() => fastify.close())

  await t.rejects(pget({
    method: 'GET',
    url: `${address}/1`
  }))
  onTimeoutChannel.unsubscribe(onMessage)
})
