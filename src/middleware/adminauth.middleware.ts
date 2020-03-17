import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class AdminauthMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    var pathname = req.baseUrl;
    var userinfo = req.session.userinfo;
    if (userinfo && userinfo.username) {
      next();
    } else {
      if (pathname === '/admin/login' ||
        pathname === '/admin/login/code' ||
        pathname === '/admin/login/doLogin') {
        next()
      } else {
        res.redirect('/admin/login')
      }
    }
  }
}
