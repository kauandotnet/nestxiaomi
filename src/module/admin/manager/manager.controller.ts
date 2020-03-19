import { Controller, Get, Render, Post, Body, Response, Query } from '@nestjs/common';
import { Config } from '../../../config/config';
import { AdminService } from '../../../service/admin/admin.service';
import { RoleService } from '../../../service/role/role.service';
import { ToolsService } from '../../../service/tools/tools.service';

@Controller(`${Config.adminPath}/manager`)
export class ManagerController {
  constructor(
    private adminService: AdminService,
    private roleService: RoleService,
    private toolsService: ToolsService
  ) { }

  @Get()
  @Render('admin/manager/index')
  async index() {
    let result = await this.adminService.getModel().aggregate([{
      $lookup: {
        from: 'role',
        localField: 'role_id',
        foreignField: '_id',
        as: 'role'
      }
    }]);
    return {
      adminResult: result
    }
  }

  @Get('add')
  @Render('admin/manager/add')
  async add() {
    return {
      roleList: await this.roleService.find()
    };
  }

  @Post('doAdd')
  async doAdd(@Body() body, @Response() res) {
    if (body.username == '' || body.password.length < 6) {
      this.toolsService.error(res, 'username or password is illegal', '/manager/add');
    } else {
      let adminResult = await this.adminService.find({ 'username': body.username });
      if (adminResult.length > 0) {
        this.toolsService.error(res, 'this username exists', '/manager/add');
      } else {
        body.password = this.toolsService.getMd5(body.password);
        this.adminService.add(body);
        this.toolsService.success(res, '/manager');
      }
    }
  }

  @Get('edit')
  @Render('admin/manager/edit')
  async edit(@Query() query) {
    let adminResult = await this.adminService.find({ '_id': query.id });
    return {
      adminResult: adminResult[0],
      roleList: await this.roleService.find()
    };
  }

  @Post('doEdit')
  async doEdit(@Body() body, @Response() res) {
    let id = body._id;
    let password = body.password;
    let mobile = body.mobile;
    let email = body.email;
    let role_id = body.role_id;

    if (password != '') {
      if (password.length < 6) {
        this.toolsService.error(res, 'password length < 6', `/manager/edit?id=${id}`);
        return;
      } else {
        this.adminService.update({ '_id': id }, {
          password: this.toolsService.getMd5(password),
          mobile,
          email,
          role_id
        });
      }
    } else {
      this.adminService.update({ '_id': id }, {
        mobile,
        email,
        role_id
      });
    }
    this.toolsService.success(res, '/manager');
  }

  @Get('delete')
  delete(@Query() query, @Response() res) {
    this.adminService.delete({ '_id': query.id });
    this.toolsService.success(res, '/manager');
  }
}
