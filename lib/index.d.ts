import { RouteOptions, HTTPMethods } from 'fastify';

export declare interface OnRouteEvent extends RouteOptions { }

export declare interface OnTimeoutEvent {
  protocol: 'http' | 'https';
  url: string;
  method: HTTPMethods | HTTPMethods[];
  route: string;
}

export declare interface OnErrorEvent {
  protocol: 'http' | 'https';
  url: string;
  method: HTTPMethods | HTTPMethods[];
  error: Error;
  route: string;
}

export declare interface OnResponseEvent {
  protocol: 'http' | 'https';
  url: string;
  method: HTTPMethods | HTTPMethods[];
  statusCode: number;
  route: string;
  headers: string[];
}

export declare interface onRequestEvent {
  protocol: 'http' | 'https';
  url: string;
  method: HTTPMethods | HTTPMethods[];
  route: string;
}
