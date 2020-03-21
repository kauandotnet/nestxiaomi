import { Injectable, NestMiddleware } from '@nestjs/common';
import { Config } from '../config/config';
import { AdminService } from '../service/admin/admin.service';

@Injectable()
export class AdminauthMiddleware implements NestMiddleware {
  constructor(
    private adminService: AdminService
  ) { }

  async use(req: any, res: any, next: () => void) {
    var pathname = req.baseUrl;
    var userinfo = req.session.userinfo;

    if (userinfo && userinfo.username) {
      res.locals.userinfo = userinfo;
      let hasAuth = await this.adminService.checkAuth(req);
      if (hasAuth) {
        next();
      } else {
        res.send('you are not allowed to visit this part');
      }
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
