import { Controller, Get, Render, Post, Body, Response, Query } from '@nestjs/common';
import { RoleService } from '../../../service/role/role.service';
import { Config } from '../../../config/config';
import { ToolsService } from 'src/service/tools/tools.service';

@Controller(`${Config.adminPath}/role`)
export class RoleController {
  constructor(
    private roleService: RoleService,
    private toolService: ToolsService
  ) { }

  @Get()
  @Render('admin/role/index')
  async index() {
    return {
      roleList: await this.roleService.find()
    }
  }

  @Get('add')
  @Render('admin/role/add')
  async add() {
    return {};
  }

  @Post('doAdd')
  async doAdd(@Body() body, @Response() res) {
    if (body.title != '') {
      let result = await this.roleService.add(body);
      if (result) {
        this.toolService.success(res, '/role');
      } else {
        this.toolService.error(res, 'add failed', '/role');
      }
    } else {
      this.toolService.error(res, 'title cannot be empty', '/role');
    }
  }

  @Get('edit')
  @Render('admin/role/edit')
  async edit(@Query() query) {
    let result = await this.roleService.find({ '_id': query.id });
    return {
      roleList: result[0]
    }
  }

  @Post('doEdit')
  async doEdit(@Body() body, @Response() res) {
    if (body.title != '') {
      let result = await this.roleService.update({ '_id': body._id }, body);
      if (result) {
        this.toolService.success(res, '/role');
      } else {
        this.toolService.error(res, 'edit failed', '/role/add');
      }
    } else {
      this.toolService.error(res, 'title cannot be empty', '/role/add');
    }
  }

  @Get('delete')
  async delete(@Query() query, @Response() res) {
    let result = await this.roleService.delete({ '_id': query.id });
    this.toolService.success(res, '/role');
  }
}
