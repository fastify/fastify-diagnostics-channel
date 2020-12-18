'use strict'

const fp = require('fastify-plugin')
const {
  onRouteChannel,
  onTimeoutChannel,
  onErrorChannel,
  onResponseChannel,
  onRequestChannel
} = require('./channels')

function fastifyDiagnostics (fastify, _opts, next) {
  fastify.addHook('onRoute', (routeOptions) => {
    onRouteChannel.publish(routeOptions)
  })

  fastify.addHook('onTimeout', (request, reply, done) => {
    onTimeoutChannel.publish({ request, reply, fastify })

    done()
  })

  fastify.addHook('onError', (request, reply, error, done) => {
    onErrorChannel.publish({ request, reply, error })
    done()
  })

  fastify.addHook('onResponse', (request, reply, done) => {
    onResponseChannel.publish({ request, reply })
    done()
  })

  fastify.addHook('onRequest', (request, reply, done) => {
    onRequestChannel.publish({ request, reply })
    done()
  })

  next()
}

module.exports = fp(fastifyDiagnostics, {
  name: 'fastify-diagnostics-channel',
  fastify: '>=3.x'
})
