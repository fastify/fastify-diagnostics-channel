'use strict'

const dc = require('node:diagnostics_channel')

module.exports = {
  onRouteChannel: dc.channel('fastify.onRoute'),
  onTimeoutChannel: dc.channel('fastify.onTimeout'),
  onErrorChannel: dc.channel('fastify.onError'),
  onResponseChannel: dc.channel('fastify.onResponse'),
  onRequestChannel: dc.channel('fastify.onRequest')
}
