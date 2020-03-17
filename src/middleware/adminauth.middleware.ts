import { Injectable, NestMiddleware } from '@nestjs/common';
import { Config } from '../config/config';

@Injectable()
export class AdminauthMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    var pathname = req.baseUrl;
    var userinfo = req.session.userinfo;
    if (userinfo && userinfo.username) {
      res.locals.userinfo = userinfo;
      next();
    } else {
      if (pathname === `/${Config.adminPath}/login` ||
        pathname === `/${Config.adminPath}/login/code` ||
        pathname === `/${Config.adminPath}/login/doLogin`) {
        next();
      } else {
        res.redirect(`/${Config.adminPath}/login`);
      }
    }
  }
}
