import {ExecutionContext} from '@nestjs/common';
import {Request} from 'express';
import {GqlExecutionContext} from '@nestjs/graphql';

const AuthorizationHeader = 'Authorization';
const AppHeader = 'App';
const PlatformHeader = 'Platform';

export function getRequest(context: ExecutionContext): Request | undefined {
  let request = context.switchToHttp().getRequest<Request>();
  if (request) return request;

  const gqlContext = GqlExecutionContext.create(context);
  request = gqlContext.getContext().req;
  return request;
}

function getHeader(context: ExecutionContext, header: string) {
  const request = getRequest(context);
  if (!request) return undefined;

  return request.header(header);
}

export function extractJwtFromContext(context: ExecutionContext): string | undefined {
  return getHeader(context, AuthorizationHeader);
}

export function extractAppFromContext(context: ExecutionContext): string | undefined {
  return getHeader(context, AppHeader);
}

export function extractPlatformHeaderFromContext(
  context: ExecutionContext,
): string | undefined {
  return getHeader(context, PlatformHeader);
}
