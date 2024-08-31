import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { isJWT } from 'class-validator';
import { AuthService } from 'src/module/auth/auth.service';

@Injectable()
export class AddUserToReqWOV implements NestMiddleware {
  constructor(private authService: AuthService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const token = this.extractToken(req);
    if (!token) return next();
    try {
      req.user = await this.authService.validateAccessToken(token);
    } catch (error) {
      console.log(error);
    }
    next();
  }

  protected extractToken(req: Request) {
    const { authorization } = req.headers;
    if (!authorization || authorization?.trim() == '') {
      return null;
    }
    const [bearer, token] = authorization?.split(' ');

    if (bearer?.toLocaleLowerCase() !== 'bearer' || !token || !isJWT(token))
      return null;

    return token;
  }
}
