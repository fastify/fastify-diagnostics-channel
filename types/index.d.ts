import { RouteOptions, FastifyReply, FastifyRequest, FastifyPluginCallback } from 'fastify';

type FastifyDiagnosticsChannel = FastifyPluginCallback

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