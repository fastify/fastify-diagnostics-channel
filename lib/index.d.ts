import { RouteOptions, HTTPMethods } from 'fastify';

export declare interface OnRouteEvent extends RouteOptions { }

export declare interface OnTimeoutEvent {
  protocol: 'http' | 'https';
  url: string;
  method: HTTPMethods | HTTPMethods[];
}

export declare interface OnErrorEvent {
  protocol: 'http' | 'https';
  url: string;
  method: HTTPMethods | HTTPMethods[];
  error: Error;
}

export declare interface OnResponseEvent {
  protocol: 'http' | 'https';
  url: string;
  method: HTTPMethods | HTTPMethods[];
  statusCode: number;
  headers: string[];
}

export declare interface onRequestEvent {
  protocol: 'http' | 'https';
  url: string;
  method: HTTPMethods | HTTPMethods[];
}
