import { Controller, Request, Render, Get, Response, Query, Post, Body } from '@nestjs/common';
import { ToolsService } from '../../../service/tools/tools.service';
import { UserService } from '../../../service/user/user.service';
import { UserTempService } from '../../../service/user-temp/user-temp.service';
import { CookieService } from '../../../service/cookie/cookie.service';

@Controller('pass')
export class PassController {
  constructor(
    private toolsService: ToolsService,
    private userService: UserService,
    private userTempService: UserTempService,
    private cookieService: CookieService,
  ) {
  }

  @Get('code')
  getCode(@Query() query, @Request() req, @Response() res) {
    let widht = query.width || 100;
    let height = query.height || 52;
    let svgCaptcha = this.toolsService.getCaptcha(1, widht, height);
    //设置session
    req.session.identify_code = svgCaptcha.text;
    res.type('image/svg+xml');
    res.send(svgCaptcha.data);
  }

  //登录页面
  @Get('login')
  @Render('default/pass/login')
  login(@Request() req) {
    return {
      prevPage: req.prevPage || '',
    };
  }

  //退出登录
  @Get('loginOut')
  loginOut(@Response() res) {
    this.cookieService.set(res, 'userinfo', '');
    res.redirect('/');
  }

  //执行登录
  @Post('doLogin')
  async doLogin(@Body() body, @Response() res, @Request() req) {
    var username = body.username;
    var password = body.password;
    var identify_code = body.identify_code;
    if (identify_code != req.session.identify_code) {
      //后端重新生成验证码
      let svgCaptcha = this.toolsService.getCaptcha(1, 80, 40);
      req.session.identify_code = svgCaptcha.text;
      res.send({
        success: false,
        msg: 'wrong captcha',
      });
    } else {
      password = this.toolsService.getMd5(password);
      let userInfo = await this.userService.find({
        'phone': username,
        'password': password,
      }, '_id phone last_ip add_time email status');
      if (userInfo && userInfo.length > 0) {
        this.cookieService.set(res, 'userinfo', userInfo[0]);
        res.send({
          success: true,
          msg: 'success',
        });
      } else {
        let svgCaptcha = this.toolsService.getCaptcha(1, 80, 40);
        req.session.identify_code = svgCaptcha.text;
        res.send({
          success: false,
          msg: 'wrong username or password',
        });
      }
    }
  }


  @Get('registerStep1')
  @Render('default/pass/register_step1')
  register1() {
    return {};
  }

  @Get('registerStep2')
  // @Render('default/pass/register_step2')
  async register2(@Query() qeury, @Response() res) {
    let sign = qeury.sign;
    let identify_code = qeury.identify_code;
    let userTempResult = await this.userTempService.find({ 'sign': sign });
    if (userTempResult.length > 0) {
      await res.render('default/pass/register_step2', {
        phone: userTempResult[0].phone,
        identify_code: identify_code,
        sign: sign,
      });
    } else {
      res.redirect('/pass/registerStep1');
    }
  }

  @Get('registerStep3')
  // @Render('default/pass/register_step3')
  async register3(@Query() qeury, @Request() req, @Response() res) {
    let sign = qeury.sign;
    let phone_code = qeury.phone_code;
    //1、判断手机收到的验证码是否正确
    if (req.session.phone_code != phone_code) {
      res.redirect('/pass/registerStep1');
      return;
    }

    //2、验证传过来的参数是否正确
    let userTempResult = await this.userTempService.find({ 'sign': sign });
    if (userTempResult && userTempResult.length > 0) {
      await res.render('default/pass/register_step3', {
        phone: userTempResult[0].phone,
        phone_code: phone_code,
        sign: sign,
      });
    } else {
      res.redirect('/pass/registerStep1');
    }
  }

  //验证验证码
  @Get('validatePhoneCode')
  async validatePhoneCode(@Query() query, @Request() req) {
    var sign = query.sign;
    var phone_code = query.phone_code;
    var add_day = await this.toolsService.getDay();         //年月日
    //1、验证数据是否合法
    var userTempResult = await this.userTempService.find({ 'sign': sign, add_day: add_day });
    if (userTempResult.length == 0) {
      return {
        success: false,
        msg: '参数错误',
      };
    }

    //2、验证验证码是否正确
    if (req.session.phone_code != phone_code) {
      return {
        success: false,
        msg: '输入的验证码错误',
      };
    }
    //3、判断验证码有没有过期
    var nowTime = await this.toolsService.getTime();
    if ((nowTime - userTempResult[0].add_time) / 1000 / 60 > 15) {
      return {
        success: false,
        msg: '验证码已经过期',
      };
    }
    return {
      success: true,
      msg: '验证码输入正确',
      sign: sign,
      phone_code: phone_code,
    };

  }


  //发送短信验证码
  @Get('sendCode')
  async sendCode(@Query() query, @Request() req) {
    let phone = query.phone;
    let identify_code = query.identify_code;
    //1、验证图形验证码是否合法
    if (req.session.identify_code != identify_code) {
      return {
        success: false,
        msg: '输入的图形验证码不正确',
      };
    }
    //2、判断手机格式是否合法
    var reg = /^[\d]{11}$/;
    if (!reg.test(phone)) {
      return {
        success: false,
        msg: '手机号格式不合法',
      };
    }
    //3、验证手机号是否注册
    let userResult = await this.userService.find({ 'phone': phone });
    if (userResult && userResult.length > 0) {
      return {
        success: false,
        msg: '此用户已经存在',
      };
    }
    //4、判断手机号发送验证码次数
    var add_day = await this.toolsService.getDay();         //年月日
    var sign = await this.toolsService.getMd5(phone + add_day);  //签名
    var ip = req.ip.replace(/::ffff:/, '');     //获取客户端ip
    var phone_code = await this.toolsService.getRandomNum();  //发送短信的随机码

    let userTempResult = await this.userTempService.find({ 'phone': phone, sign: sign, add_day: add_day });

    let ipCount = await this.userTempService.count({ 'ip': ip, add_day: add_day });
    if (userTempResult && userTempResult.length > 0) {
      if (ipCount > 10) {
        return {
          success: false,
          msg: '发送失败',
          sign: sign,
        };
      }

      if (userTempResult[0].send_count < 4) {
        let send_count = userTempResult[0].send_count + 1;
        await this.userTempService.update({ 'phone': phone, sign: sign, add_day: add_day }, { send_count: send_count });
        // 发送验证码 保存验证
        // this.toolsService.sendMsg()
        req.session.phone_code = phone_code;
        console.log(phone_code);
        return {
          success: true,
          msg: '短信发送成功',
          sign: sign,
        };
      } else {
        return {
          success: false,
          msg: '当前手机号发送短信的次数太多了',
          sign: sign,
        };
      }


    } else {
      //发送验证码 保存验证
      console.log(phone_code);
      // this.toolsService.sendMsg()
      req.session.phone_code = phone_code;
      this.userTempService.add({
        phone,
        add_day,
        sign,
        ip,
        send_count: 1,
      });
      return {
        success: true,
        msg: '短信发送成功',
        sign: sign,
      };

    }


  }

  @Post('doRegister')
  async doRegister(@Body() body, @Request() req, @Response() res) {
    let sign = body.sign;
    let phone_code = body.phone_code;
    let password = body.password;
    let rpassword = body.rpassword;
    let ip = req.ip.replace(/::ffff:/, '');

    //1、判断手机收到的验证码是否正确
    if (req.session.phone_code != phone_code) {
      res.redirect('/pass/registerStep1');
      return;
    }

    //2、获取sign对应的手机信息
    let userTempResult = await this.userTempService.find({ 'sign': sign });
    if (userTempResult.length > 0) {
      //完成注册

      let userResult = await this.userService.add(
        {
          phone: userTempResult[0].phone,
          password: this.toolsService.getMd5(password),
          last_ip: ip,
        },
      );
      //执行登录
      if (userResult) {
        let userInfo = await this.userService.find({ 'phone': userTempResult[0].phone }, '_id phone last_ip add_time email status');
        this.cookieService.set(res, 'userinfo', userInfo[0]);
        res.redirect('/');
      }

    } else {
      res.redirect('/pass/registerStep1');
    }
  }
}
