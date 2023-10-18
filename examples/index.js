'use strict'

const fastify = require('fastify')({ logger: true, connectionTimeout: 2000 })
const dc = require('node:diagnostics_channel')

const channels = [
  dc.channel('fastify.onRoute'),
  dc.channel('fastify.onTimeout'),
  dc.channel('fastify.onError'),
  dc.channel('fastify.onResponse'),
  dc.channel('fastify.onRequest')
]

channels.forEach(channel => {
  channel.subscribe((message, name) => {
    console.info('Triggered:', name, message)
  })
})

fastify.register(require('../lib/index'))

fastify.get('/params/:id', (_request, reply) => {
  reply.send({})
})

fastify.get('/error', (_request, _reply) => {
  throw new Error('error example')
})

fastify.get('/timeout', async (_request, _reply) => {
  await new Promise((resolve) => setTimeout(resolve, 5000))
})

fastify.listen({ port: 3000 }, '0.0.0.0', (err) => {
  if (err) throw err
})
