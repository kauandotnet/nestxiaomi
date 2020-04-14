import { Injectable, NestMiddleware } from '@nestjs/common';

import { CookieService } from '../service/cookie/cookie.service';
import { UserService } from '../service/user/user.service';

@Injectable()
export class UserauthMiddleware implements NestMiddleware {
  constructor(private cookieService: CookieService, private userService: UserService) {
  }

  async use(req: any, res: any, next: () => void) {

    //1、从cookie里面获取用户信息
    let userInfo = this.cookieService.get(req, 'userinfo');
    if (userInfo && userInfo.phone) {
      //2、从用户表里面查询一下这个用户
      let userResult = await this.userService.find({ '_id': userInfo._id, 'phone': userInfo.phone });
      if (userResult && userResult.length > 0) {
        await next();
        return;
      }
      //跳转
      res.redirect('/pass/login');
      return;
    }
    //执行跳转
    res.redirect('/pass/login');
  }
}
