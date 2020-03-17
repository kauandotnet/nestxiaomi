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
        this.toolsService.error(res, 'illegal username or password');
      } else {
        if (code.toLowerCase() == req.session.code.toLowerCase()) {
          password = this.toolsService.getMd5(password);
          var userResult = await this.adminService.find({
            'username': username,
            'password': password
          });
          // console.log(userResult);

          if (userResult.length > 0) {
            req.session.userinfo = userResult[0];
            this.toolsService.success(res);
          } else {
            this.toolsService.error(res, 'wrong username or password');
          }
        } else {
          this.toolsService.error(res, 'captcha is wrong');
        }
      }
    } catch (error) {
      console.log(error);
      res.redirect('/admin/login');
    }
  }

  @Get('loginOut')
  loginOut(@Request() req, @Response() res) {
    req.session.userinfo = null;
    res.redirect('/admin/login');
  }
}
