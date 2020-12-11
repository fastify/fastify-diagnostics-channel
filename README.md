# fastify-diagnostics-channel

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/) 
![CI](https://github.com/fastify/fastify-diagnostics-channel/workflows/Continuous%20Integration/badge.svg)

## Install
```sh
npm i fastify-diagnostics-channel --save
```

## Usage

Register as a plugin. This will add some hooks that provide information through [`diagnostics_channel`](https://nodejs.org/api/diagnostics_channel.html)

```js
const fastify = require('fastify')()

fastify.register(require('fastify-diagnostics-channel'), {})
```

_**Note**: check [examples/](./examples/index.js) to further information_

## Which information is provided?

1. [onRoute Channel](#onroute-channel)
2. [onResponse Channel](#onresponse-channel)
3. [onError Channel](#onerror-channel)
4. [onTimeout Channel](#ontimeout-channel)

The channels are prefixed by: `http.fastify.{HOOK_NAME}`

### onRoute Channel

**Channel**: `http.fastify.onRoute`

This event is sent at every route registered passing a `routeOptions` object

```js
const dc = require('diagnostics_channel')
const onRoute = dc.channel('http.fastify.onRoute')

onRoute.subscribe((routeOptions) => {
  routeOptions.method
  routeOptions.schema
  routeOptions.url // the complete URL of the route, it will inclued the prefix if any
  routeOptions.path // `url` alias
  routeOptions.routePath // the URL of the route without the prefix
  routeOptions.bodyLimit
  routeOptions.logLevel
  routeOptions.logSerializers
  routeOptions.prefix
})
```

### onResponse Channel

**Channel**: `http.fastify.onResponse`

This event is sent at every response sent by server, it propagate an object contaning: _protocol, method, url, statusCode, headers_

```js
const dc = require('diagnostics_channel')
const onResponse = dc.channel('http.fastify.onResponse')

onResponse.subscribe((data) => {
  data.protocol // 'http | https'
  data.method
  data.url // the complete URL of the route, it will inclued the prefix if any
  data.statusCode // statusCode sent for this request
  data.headers // headers sent for this request
})
```

### onError Channel

**Channel**: `http.fastify.onError`

This event is sent when some error is throw on the [lifecycle](https://www.fastify.io/docs/latest/Lifecycle/) of fastify.

```js
const dc = require('diagnostics_channel')
const onError = dc.channel('http.fastify.onError')

onError.subscribe((data) => {
  data.protocol // 'http | https'
  data.method
  data.url // the complete URL of the route, it will inclued the prefix if any
  data.error // error object throwed
})
```

### onTimeout Channel

**Channel**: `http.fastify.onTimeout`

This event is sent when a request spent more time that [`connectionTimeout`](https://www.fastify.io/docs/latest/Server/#connectiontimeout) specify. For further information about `connectionTimeout` check the Fastify documentation.

Note: by default the fastify does not limit the request time.

```js
const dc = require('diagnostics_channel')
const onTimeout = dc.channel('http.fastify.onTimeout')

onTimeout.subscribe((data) => {
  data.protocol // 'http | https'
  data.method
  data.url // the complete URL of the route, it will inclued the prefix if any
})
```

## License

Licensed under [MIT](./LICENSE).
