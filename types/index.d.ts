import { RouteOptions, FastifyReply, FastifyRequest } from 'fastify';

export declare interface OnRouteEvent extends RouteOptions { }

export declare interface OnTimeoutEvent {
  reply: FastifyReply;
  request: FastifyRequest;
  connectionTimeout: number;
}

export declare interface OnErrorEvent {
  reply: FastifyReply;
  request: FastifyRequest;
  error: Error;
}

export declare interface OnResponseEvent {
  reply: FastifyReply;
  request: FastifyRequest;
}

export declare interface onRequestEvent {
  reply: FastifyReply;
  request: FastifyRequest;
}
