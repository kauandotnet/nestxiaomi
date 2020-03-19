import { Injectable } from '@nestjs/common';
import * as svgCaptcha from 'svg-captcha';
import * as md5 from 'md5';
import { Config } from '../../config/config';

@Injectable()
export class ToolsService {
  getCaptcha() {
    var captcha = svgCaptcha.create({
      size: 1,
      fontSize: 50,
      width: 100,
      height: 34,
      background: '#cc9966'
    });
    return captcha;
  }

  getMd5(str: string) {
    return md5(str);
  }

  async success(res, redirectPath) {
    await res.render('admin/public/success', {
      'redirectUrl': `/${Config.adminPath}` + redirectPath
    });
  }

  async error(res, message, redirectPath) {
    await res.render('admin/public/error', {
      'message': message,
      'redirectUrl': `/${Config.adminPath}` + redirectPath
    });
  }
}