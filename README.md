> **Note**
> This package has been deprecated;
> `diagnostics_channel` is now [built into Fastify v5](https://fastify.dev/docs/latest/Reference/Hooks/#diagnostics-channel-hooks).

# @fastify/diagnostics-channel

[![CI](https://github.com/fastify/fastify-diagnostics-channel/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/fastify/fastify-diagnostics-channel/actions/workflows/ci.yml)
[![NPM version](https://img.shields.io/npm/v/@fastify/diagnostics-channel.svg?style=flat)](https://www.npmjs.com/package/@fastify/diagnostics-channel)
[![neostandard javascript style](https://img.shields.io/badge/code_style-neostandard-brightgreen?style=flat)](https://github.com/neostandard/neostandard)

## Install
```sh
npm i @fastify/diagnostics-channel
```

### Compatibility
| Plugin version | Fastify version |
| ---------------|-----------------|
| `^5.x`         | `^5.x`          |
| `^4.x`         | `^4.x`          |
| `^1.x`         | `^3.x`          |

Please note that if a Fastify version is out of support, then so are the corresponding versions of this plugin
in the table above.
See [Fastify's LTS policy](https://github.com/fastify/fastify/blob/main/docs/Reference/LTS.md) for more details.

## Usage

Register as a plugin. This will add some hooks that provide information through [`diagnostics_channel`](https://nodejs.org/api/diagnostics_channel.html)

```js
const fastify = require('fastify')()

fastify.register(require('@fastify/diagnostics-channel'), {})
```

_**Note**: check [examples/](./examples/index.js) to further information_

## What information is provided?

1. [onRoute Channel](#onroute-channel)
2. [onResponse Channel](#onresponse-channel)
3. [onError Channel](#onerror-channel)
4. [onTimeout Channel](#ontimeout-channel)
4. [onRequest Channel](#onrequest-channel)

The channels are prefixed by: `fastify.{HOOK_NAME}`

### onRoute Channel

**Channel**: `fastify.onRoute`

This event is sent at every route registered passing a `routeOptions` object

```js
const dc = require('node:diagnostics_channel')
const onRoute = dc.channel('fastify.onRoute')

onRoute.subscribe((routeOptions) => {
  routeOptions.method
  routeOptions.schema
  routeOptions.url // the complete URL of the route, it will include the prefix if any
  routeOptions.path // `url` alias
  routeOptions.routePath // the URL of the route without the prefix
  routeOptions.bodyLimit
  routeOptions.logLevel
  routeOptions.logSerializers
  routeOptions.prefix
})
```

### onResponse Channel

**Channel**: `fastify.onResponse`

This event is sent on every response sent by the server, it propagates an object containing: [`request` object](https://fastify.dev/docs/latest/Reference/Request) and [`reply` object](https://fastify.dev/docs/latest/Reference/Reply)

```js
const dc = require('node:diagnostics_channel')
const onResponse = dc.channel('fastify.onResponse')

onResponse.subscribe((data) => {
  data.request
  data.reply
})
```

### onError Channel

**Channel**: `fastify.onError`

This event is sent when an error is thrown during the Fastify [lifecycle](https://fastify.dev/docs/latest/Reference/Lifecycle/).

The message data is an object containing a [`request` object](https://fastify.dev/docs/latest/Reference/Request), [`reply` object](https://fastify.dev/docs/latest/Reference/Reply), and Error object

```js
const dc = require('node:diagnostics_channel')
const onError = dc.channel('fastify.onError')

onError.subscribe((data) => {
  data.request
  data.reply
  data.error // error object thrown
})
```

### onTimeout Channel

**Channel**: `fastify.onTimeout`

This event is sent when a request spends more time than [`connectionTimeout`](https://fastify.dev/docs/latest/Reference/Server/#connectiontimeout) specifies. For further information about `connectionTimeout` check the Fastify documentation.

The message data is an object containing a [`request` object](https://fastify.dev/docs/latest/Reference/Request), [`reply` object](https://fastify.dev/docs/latest/Reference/Reply), and `connectionTimeout` value

Note: by default Fastify does not limit the request time.

```js
const dc = require('node:diagnostics_channel')
const onTimeout = dc.channel('fastify.onTimeout')

onTimeout.subscribe((data) => {
  data.connectionTimeout
  data.reply
  data.request
})
```

### onRequest Channel

**Channel**: `fastify.onRequest`

This event is sent when a request is received; the message data is an object containing a [`request` object](https://fastify.dev/docs/latest/Reference/Request) and [`reply` object](https://fastify.dev/docs/latest/Reference/Reply)

```js
const dc = require('node:diagnostics_channel')
const onRequest = dc.channel('fastify.onRequest')

onRequest.subscribe((data) => {
  data.request
  data.reply
})
```

## License

Licensed under [MIT](./LICENSE).
