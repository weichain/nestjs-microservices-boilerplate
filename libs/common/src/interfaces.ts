import { Request, Response } from 'express';

export interface IRequest extends Request {
  user: {
    id: string;
  };
}

export interface IResponse extends Response {}

export interface IRpcErrorResponse {
  error: string;
  type: 'RPC';
}

export interface ICustomException {
  type: string;
  name: string;
  message: string;
  stack?: string;
  error?: {
    code: number;
    message: string;
  };
}

export type NoArgNoReturnFunction = () => void;
