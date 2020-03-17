import { Controller, Get, Render, Request, Response, Post, Body } from '@nestjs/common';
import { ToolsService } from '../../../service/tools/tools.service';
import { AdminService } from '../../../service/admin/admin.service';

@Controller('admin/login')
export class LoginController {
  constructor(
    private toolsService: ToolsService,
    private adminService: AdminService
  ) { }

  @Get()
  @Render('admin/login')
  async index() {
    // console.log(await this.adminService.find());
    return {};
  }

  @Get('code')
  getCode(@Request() req, @Response() res) {
    var svgCaptcha = this.toolsService.getCaptcha();
    req.session.code = svgCaptcha.text;
    // res.type('image/svg+xml');
    res.type('svg');
    res.send(svgCaptcha.data);
  }

  @Post('doLogin')
  async doLogin(@Body() body, @Request() req, @Response() res) {
    try {
      let code: string = body.code;
      let username: string = body.username;
      let password: string = body.password;
      // console.log(body);

      if (username == '' || password.length < 6) {
        console.log('illegal username or password');
        res.redirect('/admin/login');
      } else {
        if (code.toLowerCase() == req.session.code.toLowerCase()) {
          password = this.toolsService.getMd5(password);
          var userResult = await this.adminService.find({
            'username': username,
            'password': password
          });

          // console.log(userResult);

          if (userResult.length > 0) {
            console.log('login success');
            req.session.userinfo = userResult[0];
            res.redirect('/admin/main');
          } else {
            console.log('wrong username or password');
            res.redirect('/admin/login');
          }
        } else {
          console.log('captcha is wrong');
          res.redirect('/admin/login');
        }
      }
    } catch (error) {
      console.log(error);
      res.redirect('/admin/login');
    }
  }
}
