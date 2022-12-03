import { OnRouteEvent, OnErrorEvent, OnResponseEvent, OnTimeoutEvent, fastifyDiagnosticsChannel, onRequestEvent, OnRequestEvent } from ".."
import { expectDeprecated, expectError, expectType } from "tsd"
import { FastifyPluginCallback, FastifyReply, FastifyRequest, RouteOptions } from "fastify"
import { channel } from 'diagnostics_channel';

expectType<RouteOptions>({} as OnRouteEvent)

expectType<FastifyReply>(({} as OnErrorEvent)['reply'])
expectType<FastifyRequest>(({} as OnErrorEvent)['request'])
expectType<Error>(({} as OnErrorEvent)['error'])

expectType<FastifyReply>(({} as OnResponseEvent)['reply'])
expectType<FastifyRequest>(({} as OnResponseEvent)['request'])

expectType<onRequestEvent>({} as OnRequestEvent)
expectDeprecated({} as onRequestEvent)

expectType<FastifyReply>(({} as OnRequestEvent)['reply'])
expectType<FastifyRequest>(({} as OnRequestEvent)['request'])

expectType<FastifyReply>(({} as OnTimeoutEvent)['reply'])
expectType<FastifyRequest>(({} as OnTimeoutEvent)['request'])
expectType<number>(({} as OnTimeoutEvent)['connectionTimeout'])

expectType<FastifyPluginCallback>(fastifyDiagnosticsChannel)

const nonFastifyChannel = channel('my-channel')
nonFastifyChannel.subscribe((message, name) => {
  expectType<unknown>(message)
  expectType<string>(name)
})

const onRouteFastifyChannel = channel('fastify.onRoute')
onRouteFastifyChannel.subscribe((message, name) => {
  expectType<OnRouteEvent>(message)
  expectType<'fastify.onRoute'>(name)
})

const onErrorFastifyChannel = channel('fastify.onError')
onErrorFastifyChannel.subscribe((message, name) => {
  expectType<OnErrorEvent>(message)
  expectType<'fastify.onError'>(name)
})

const onResponseFastifyChannel = channel('fastify.onResponse')
onResponseFastifyChannel.subscribe((message, name) => {
  expectType<OnResponseEvent>(message)
  expectType<'fastify.onResponse'>(name)
})

const onRequestFastifyChannel = channel('fastify.onRequest')
onRequestFastifyChannel.subscribe((message, name) => {
  expectType<OnRequestEvent>(message)
  expectType<'fastify.onRequest'>(name)
})

const onTimeoutFastifyChannel = channel('fastify.onTimeout')
onTimeoutFastifyChannel.subscribe((message, name) => {
  expectType<OnTimeoutEvent>(message)
  expectType<'fastify.onTimeout'>(name)
})

function onRequestFastifyChannelListener (message: OnRequestEvent, name: 'fastify.onRequest') {
  // empty
}
onRequestFastifyChannel.subscribe(onRequestFastifyChannelListener)
expectError(onErrorFastifyChannel.subscribe(onRequestFastifyChannelListener))
