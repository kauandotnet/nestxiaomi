import { Controller, Get, Render, Post, Body, Response, Query } from '@nestjs/common';
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

  @Get('edit')
  @Render('admin/access/edit')
  async edit(@Query() query) {
    let moduleList = await this.accessService.find({ 'module_id': '0' });
    let accessResult = await this.accessService.find({ '_id': query.id });
    return {
      moduleList,
      list: accessResult[0]
    };
  }

  @Post('doEdit')
  doEdit(@Body() body, @Response() res) {
    let module_id = body.module_id;
    let _id = body._id;
    try {
      if (module_id != '0') {
        body.module_id = mongoose.Types.ObjectId(module_id);
      }
      this.accessService.update({ '_id': _id }, body);
      this.toolsService.success(res, '/access');
    } catch (error) {
      console.log(error);
      this.toolsService.error(res, 'illegal request', `/access/edit?id=${_id}`);
    }
  }

  @Get('delete')
  delete(@Query() query, @Response() res) {
    try {
      this.accessService.delete({ '_id': query.id });
      this.toolsService.success(res, '/access');
    } catch (error) {
      this.toolsService.error(res, 'illegal request', `/access/delete?id=${query.id}`);
    }
  }
}
