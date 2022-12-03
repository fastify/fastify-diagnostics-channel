import { RouteOptions, FastifyReply, FastifyRequest, FastifyPluginCallback } from 'fastify';

type FastifyDiagnosticsChannel = FastifyPluginCallback

declare module 'diagnostics_channel' {
  type FastifyChannelListener<N, T> = (message: T, name: N) => void;

  // @ts-ignore Enforce extending from private Class Channel
  class FastifyChannel<N extends string, T> extends Channel {
    subscribe(onMessage: FastifyChannelListener<N, T>): void;
    unsubscribe(onMessage: FastifyChannelListener<N, T>): void;
  }

  function channel(name: 'fastify.onRoute'): FastifyChannel<'fastify.onRoute', fastifyDiagnosticsChannel.OnRouteEvent>;
  function channel(name: 'fastify.onTimeout'): FastifyChannel<'fastify.onTimeout', fastifyDiagnosticsChannel.OnTimeoutEvent>;
  function channel(name: 'fastify.onError'): FastifyChannel<'fastify.onError', fastifyDiagnosticsChannel.OnErrorEvent>;
  function channel(name: 'fastify.onResponse'): FastifyChannel<'fastify.onResponse', fastifyDiagnosticsChannel.OnResponseEvent>;
  function channel(name: 'fastify.onRequest'): FastifyChannel<'fastify.onRequest', fastifyDiagnosticsChannel.OnRequestEvent>;
}

declare namespace fastifyDiagnosticsChannel {
  export interface OnRouteEvent extends RouteOptions { }
  
  export interface OnTimeoutEvent {
    reply: FastifyReply;
    request: FastifyRequest;
    connectionTimeout: number;
  }
  
  export interface OnErrorEvent {
    reply: FastifyReply;
    request: FastifyRequest;
    error: Error;
  }
  
  export interface OnResponseEvent {
    reply: FastifyReply;
    request: FastifyRequest;
  }

  
  export interface OnRequestEvent {
    reply: FastifyReply;
    request: FastifyRequest;
  }
  /**
   * @deprecated Use OnRequestEvent instead
   */
  export type onRequestEvent = OnRequestEvent;

  export const fastifyDiagnosticsChannel: FastifyDiagnosticsChannel
  export { fastifyDiagnosticsChannel as default }
}

declare function fastifyDiagnosticsChannel(...params: Parameters<FastifyDiagnosticsChannel>): ReturnType<FastifyDiagnosticsChannel>

export = fastifyDiagnosticsChannel