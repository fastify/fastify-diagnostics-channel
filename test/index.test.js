'use strict'

const { test } = require('tap')
const Fastify = require('fastify')
const dcPlugin = require('../lib/index')
const dc = require('diagnostics_channel')
const sget = require('simple-get').concat

test('Should call publish when route is registered', t => {
  t.plan(8)
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
    }
  ]
  const onMessage = (message) => {
    timesCalled += 1
    t.deepEqual(message, { ...routeOptions.shift(), handler: message.handler })
    t.strictEqual(typeof message.handler, 'function')
  }

  onRouteChannel.subscribe(onMessage)
  fastify.register(dcPlugin)
  fastify.register((instance, _opts, done) => {
    instance.get('/1', (_request, reply) => reply.send({}))
    instance.post('/2', (_request, reply) => reply.send({}))
    instance.get('/:id', (_request, reply) => reply.send({}))
    done()
  }, { prefix: '/test' })

  fastify.ready(err => {
    t.error(err)
    t.equal(timesCalled, 3)
    onRouteChannel.unsubscribe(onMessage)
  })
})

test('Should call publish when response is sent', t => {
  t.plan(3)
  const fastify = Fastify()

  const onResponseChannel = dc.channel('fastify.onResponse')
  const onMessage = (message) => {
    t.deepEqual(message, {
      protocol: 'http',
      method: 'GET',
      url: '/',
      route: '/',
      statusCode: 200,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'content-length': '2'
      }
    })
  }

  onResponseChannel.subscribe(onMessage)
  fastify.register(dcPlugin)
  fastify.get('/', (_request, reply) => reply.send({}))

  fastify.inject({
    method: 'GET',
    path: '/'
  }, (err, res) => {
    t.error(err)
    t.equal(res.statusCode, 200)
    onResponseChannel.unsubscribe(onMessage)
  })
})

test('Should call publish when some error is throw', t => {
  t.plan(3)
  const fastify = Fastify()

  const onErrorChannel = dc.channel('fastify.onError')
  const error = new Error('test error')
  const onMessage = (message) => {
    t.deepEqual(message, {
      error,
      protocol: 'http',
      method: 'GET',
      url: '/',
      route: '/'
    })
  }

  onErrorChannel.subscribe(onMessage)
  fastify.register(dcPlugin)
  fastify.get('/', (_request) => {
    throw error
  })

  fastify.inject({
    method: 'GET',
    path: '/'
  }, (err, res) => {
    t.error(err)
    t.equal(res.statusCode, 500)
    onErrorChannel.unsubscribe(onMessage)
  })
})

test('Should call onRequest when some request happens', t => {
  t.plan(4)
  const fastify = Fastify()

  const onRequestChannel = dc.channel('fastify.onRequest')
  const onMessage = (message) => {
    t.deepEqual(message, {
      protocol: 'http',
      method: 'GET',
      url: '/1',
      route: '/:id'
    })
  }

  onRequestChannel.subscribe(onMessage)
  fastify.register(dcPlugin)
  fastify.get('/:id', (_request, reply) => reply.send({}))

  fastify.listen(0, (err, address) => {
    t.error(err)
    t.tearDown(() => fastify.close())

    sget({
      method: 'GET',
      url: `${address}/1`
    }, (err, res) => {
      t.error(err)
      t.equal(res.statusCode, 200)
      onRequestChannel.unsubscribe(onMessage)
    })
  })
})

test('Should call publish when timeout happens', t => {
  t.plan(3)
  const fastify = Fastify({ connectionTimeout: 200 })

  const onTimeoutChannel = dc.channel('fastify.onTimeout')
  const onMessage = (message) => {
    t.deepEqual(message, {
      protocol: 'http',
      method: 'GET',
      url: '/1',
      route: '/:id'
    })
  }

  onTimeoutChannel.subscribe(onMessage)
  fastify.register(dcPlugin)
  fastify.get('/:id', async (_request, reply) => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    reply.send({})
  })

  fastify.listen(0, (err, address) => {
    t.error(err)
    t.tearDown(() => fastify.close())

    sget({
      method: 'GET',
      url: `${address}/1`
    }, (err) => {
      t.ok(err)
      onTimeoutChannel.unsubscribe(onMessage)
    })
  })
})
