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

## Which information is provided?

// TODO

## License

Licensed under [MIT](./LICENSE).
