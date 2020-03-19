import { Controller, Get, Render, Post, Body, Response } from '@nestjs/common';
import { Config } from '../../../config/config';
import { AdminService } from '../../../service/admin/admin.service';
import { RoleService } from '../../../service/role/role.service';
import { ToolsService } from '../../../service/tools/tools.service';

@Controller(`${Config.adminPath}/manager`)
export class ManagerController {
  constructor(
    private adminService: AdminService,
    private roleService: RoleService,
    private toolService: ToolsService
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
    console.log(result);
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
      this.toolService.error(res, 'username or password is illegal', '/manager/add');
    } else {
      let adminResult = await this.adminService.find({ 'username': body.username });
      if (adminResult.length > 0) {
        this.toolService.error(res, 'this username exists', '/manager/add');
      } else {
        body.password = this.toolService.getMd5(body.password);
        this.adminService.add(body);
        this.toolService.success(res, '/manager');
      }
    }
  }

  @Get('edit')
  @Render('admin/manager/edit')
  edit() {
    return {};
  }
}
