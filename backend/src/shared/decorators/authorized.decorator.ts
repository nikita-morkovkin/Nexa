import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { Request } from 'express';
import { User } from '../../../generated/prisma/client';
import type { GqlContext } from '../types/gql-context.types';

export const Authorized = createParamDecorator(
  (data: keyof User, ctx: ExecutionContext) => {
    let user: User;

    if (ctx.getType() === 'http') {
      user = ctx.switchToHttp().getRequest<Request>().user as User;
    } else {
      const context = GqlExecutionContext.create(ctx);
      user = context.getContext<GqlContext>().req.user as User;
    }

    return data ? user[data] : user;
  },
);
