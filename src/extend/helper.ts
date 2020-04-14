import {
  format,
} from 'silly-datetime';

let showdown = require('showdown');

import { extname } from 'path';

export class Helper {

  static title = '我是全局的title';

  static substring(str: string, start: number, end: number) {

    if (end) {
      return str.substring(start, end);
    } else {
      return str.substring(start);
    }
  }

  static formatTime(params) {

    return format(params, 'YYYY-MM-DD HH:mm');
  }

  static formatImg(dir, width, height) {

    height = height || width;
    return dir + '_' + width + 'x' + height + extname(dir);
  }

  static formatAttr(str) {

    let converter = new showdown.Converter();
    let html = converter.makeHtml(str);
    return html;
  }


}