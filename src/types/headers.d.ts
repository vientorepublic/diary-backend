import { FastifyRequest } from 'fastify';

export interface IRequest extends FastifyRequest {
  token: string;
}
