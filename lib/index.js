'use strict'

const fp = require('fastify-plugin')
const {
  onRouteChannel,
  onTimeoutChannel,
  onErrorChannel,
  onResponseChannel,
} = require('./channels')

function fastifySensible (fastify, _opts, next) {
  fastify.addHook('onRoute', (routeOptions) => {
    onRouteChannel.publish(routeOptions)
  })

  fastify.addHook('onTimeout', (request, _reply, done) => {
    onTimeoutChannel.publish({
      protocol: request.protocol,
      method: request.method,
      url: request.url,
    })

    done()
  })

  fastify.addHook('onError', (request, _reply, error, done) => {
    onErrorChannel.publish({
      protocol: request.protocol,
      method: request.method,
      url: request.url,
      error: error,
    })

    done()
  })

  fastify.addHook('onResponse', (request, reply, done) => {
    debugger
    onResponseChannel.publish({
      protocol: request.protocol,
      method: request.method,
      url: request.url,
      statusCode: reply.statusCode,
      headers: reply.getHeaders(),
    })
    done()
  })

  next()
}

module.exports = fp(fastifySensible, {
  name: 'fastify-diagnostics-channel',
  fastify: '>=3.x'
})
