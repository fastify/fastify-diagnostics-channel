const dc = require('diagnostics_channel')

module.exports = {
  onRouteChannel: dc.channel('http.fastify.onRoute'),
  onTimeoutChannel: dc.channel('http.fastify.onTimeout'),
  onErrorChannel: dc.channel('http.fastify.onError'),
  onResponseChannel: dc.channel('http.fastify.onResponse'),
}
