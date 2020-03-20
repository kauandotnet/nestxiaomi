import { Controller, Get, Render, Post, Body, Response } from '@nestjs/common';
import { Config } from '../../../config/config';
import { AccessService } from '../../../service/access/access.service';
import * as mongoose from 'mongoose';
import { ToolsService } from '../../../service/tools/tools.service';

@Controller(`${Config.adminPath}/access`)
export class AccessController {
  constructor(
    private accessService: AccessService,
    private toolsService: ToolsService
  ) { }

  @Get()
  @Render('admin/access/index')
  async index() {
    let result = await this.accessService.getModel().aggregate([{
      $match: {
        'module_id': '0'
      }
    }, {
      $lookup: {
        from: 'access',
        localField: '_id',
        foreignField: 'module_id',
        as: 'items'
      }
    }]);
    return {
      list: result
    };
  }

  @Get('add')
  @Render('admin/access/add')
  async add() {
    let result = await this.accessService.find({ 'module_id': '0' });
    return {
      moduleList: result
    };
  }

  @Post('doAdd')
  doAdd(@Body() body, @Response() res) {
    let module_id = body.module_id;
    if (module_id != '0') {
      body.module_id = mongoose.Types.ObjectId(module_id);
    }
    this.accessService.add(body);
    this.toolsService.success(res, '/access');
  }
}
