import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CurrentUserType } from '../types/current-user';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/is-public';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.isPublic(context)) {
      return true;
    }
    const ctx = GqlExecutionContext.create(context).getContext();

    const token = this.extractTokenFromHeader(ctx.req.headers);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      ctx.req.user = (await this.jwtService.verifyAsync(
        token,
      )) as CurrentUserType;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private isPublic(context: ExecutionContext) {
    return this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  }

  private extractTokenFromHeader(
    headers: Request['headers'],
  ): string | undefined {
    const [type, token] = headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
