/*
    cnpm install request crypto xml2js --save
    cnpm install request qr-image --save
    cnpm install express-xml-bodyparser --save
*/

import { Controller, Get, Request, Response, Post } from '@nestjs/common';
import { WechatPay } from '../../../extend/wechatPay';
import * as  qr from 'qr-image';

@Controller('wxpay')
export class WxpayController {
  @Get('')
  async index(@Request() req, @Response() res) {
    var config = {
      mch_id: '1502539541',
      wxappid: 'wx7bf3787c783116e4',
      wxpaykey: 'zhongyuantengitying6666666666666',
    };
    var pay = new WechatPay(config);

    pay.createOrder({
      openid: '',
      notify_url: 'http://pay.apiying.com/wxpay/notify', //微信支付完成后的回调
      out_trade_no: new Date().getTime(), //订单号
      attach: '微信购买信息名称222',
      body: '微信购买信息名称222',
      total_fee: '3', // 此处的额度为分
      spbill_create_ip: req.connection.remoteAddress.replace(/::ffff:/, ''),
    }, function(error, responseData) {
      console.log(responseData);
      if (error) {
        console.log(error);
      }
      //生成二维码
      var codeImg = qr.imageSync(responseData.code_url, { type: 'png' });
      res.status(200);
      res.type('image/png');
      res.send(codeImg);
    });

  }

  @Post('notify')
  async weixinNotify(@Request() req) {

    /*
    注意：
        1、域名必须备案 
        2、微信商户平台 产品中心->Native 支付->产品设置->扫码支付 扫码回调链接 必须配置
     */
    var config = {
      mch_id: '1502539541',
      wxappid: 'wx7bf3787c783116e4',
      wxpaykey: 'zhongyuantengitying6666666666666',
    };
    var pay = new WechatPay(config);

    var notifyObj = req.body.xml;

    var signObj = {};
    for (var attr in notifyObj) {
      if (attr != 'sign') {
        signObj[attr] = notifyObj[attr][0];
      }
    }

    console.log(pay.getSign(signObj));
    console.log('--------------------------');
    console.log(req.body.xml.sign[0]);
    console.log(notifyObj);

  }

}
