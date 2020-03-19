import { Controller, Get, Render, Post, Body, Response, Query } from '@nestjs/common';
import { RoleService } from '../../../service/role/role.service';
import { Config } from '../../../config/config';
import { ToolsService } from 'src/service/tools/tools.service';

@Controller(`${Config.adminPath}/role`)
export class RoleController {
  constructor(
    private roleService: RoleService,
    private toolsService: ToolsService
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
        this.toolsService.success(res, '/role');
      } else {
        this.toolsService.error(res, 'add failed', '/role/add');
      }
    } else {
      this.toolsService.error(res, 'title cannot be empty', '/role/add');
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
    let id = body._id;
    if (body.title != '') {
      let result = await this.roleService.update({ '_id': id }, body);
      if (result) {
        this.toolsService.success(res, '/role');
      } else {
        this.toolsService.error(res, 'edit failed', `/role/edit?id=${id}`);
      }
    } else {
      this.toolsService.error(res, 'title cannot be empty', `/role/edit?id=${id}`);
    }
  }

  @Get('delete')
  delete(@Query() query, @Response() res) {
    this.roleService.delete({ '_id': query.id });
    this.toolsService.success(res, '/role');
  }
}
