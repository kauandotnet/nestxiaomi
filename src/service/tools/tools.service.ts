import { Injectable } from '@nestjs/common';
import * as svgCaptcha from 'svg-captcha';
import * as md5 from 'md5';
import { Config } from '../../config/config';
import { format } from 'silly-datetime';
import { join, extname } from 'path';
import * as mkdirp from 'mkdirp';
import { createWriteStream } from 'fs';

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

  getTime() {
    let date = new Date();
    return date.getTime();
  }

  uploadFile(file) {
    let day = format(new Date(), 'YYYYMMDD');
    let timestamp = this.getTime();

    let dir = join(__dirname, `../../../public/${Config.uploadDir}`, day);
    mkdirp.sync(dir);

    let uploadDir = join(dir, timestamp + extname(file.originalname));

    const writeImage = createWriteStream(uploadDir);
    writeImage.write(file.buffer);

    return join(Config.uploadDir, day, timestamp + extname(file.originalname));
  }
}