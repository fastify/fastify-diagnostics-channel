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

  fastify.addHook('onTimeout', (request, _reply, done) => {
    onTimeoutChannel.publish({
      protocol: request.protocol,
      method: request.method,
      url: request.url
    })

    done()
  })

  fastify.addHook('onError', (request, _reply, error, done) => {
    onErrorChannel.publish({
      protocol: request.protocol,
      method: request.method,
      url: request.url,
      error: error
    })

    done()
  })

  fastify.addHook('onResponse', (request, reply, done) => {
    onResponseChannel.publish({
      protocol: request.protocol,
      method: request.method,
      url: request.url,
      statusCode: reply.statusCode,
      headers: reply.getHeaders()
    })
    done()
  })

  fastify.addHook('onRequest', (request, _reply, done) => {
    onRequestChannel.publish({
      protocol: request.protocol,
      method: request.method,
      url: request.url
    })
    done()
  })

  next()
}

module.exports = fp(fastifyDiagnostics, {
  name: 'fastify-diagnostics-channel',
  fastify: '>=3.x'
})
