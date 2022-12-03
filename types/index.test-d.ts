import { OnRouteEvent, OnErrorEvent, OnResponseEvent, OnTimeoutEvent, fastifyDiagnosticsChannel, onRequestEvent, OnRequestEvent } from ".."
import { expectDeprecated, expectType } from "tsd"
import { FastifyPluginCallback, FastifyReply, FastifyRequest, RouteOptions } from "fastify"

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
