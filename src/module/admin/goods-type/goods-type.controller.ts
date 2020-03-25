import { Controller, Get, Render, Post, Body, Response, Query } from '@nestjs/common';
import { Config } from '../../../config/config';
import { GoodsTypeService } from '../../../service/goods-type/goods-type.service';
import { ToolsService } from '../../../service/tools/tools.service';

@Controller(`${Config.adminPath}/goodsType`)
export class GoodsTypeController {
  constructor(
    private goodsTypeService: GoodsTypeService,
    private toolsService: ToolsService
  ) { }

  @Get()
  @Render('admin/goodsType/index')
  async index() {
    let result = await this.goodsTypeService.find({});
    return {
      list: result
    };
  }

  @Get('add')
  @Render('admin/goodsType/add')
  async add() {
    return {};
  }

  @Post('doAdd')
  async doAdd(@Body() body, @Response() res) {
    await this.goodsTypeService.add(body);
    this.toolsService.success(res, '/goodsType');
  }

  @Get('edit')
  @Render('admin/goodsType/edit')
  async edit(@Query() query) {
    let result = await this.goodsTypeService.find({ '_id': query.id });
    return {
      list: result[0]
    };
  }

  @Post('doEdit')
  async doEdit(@Body() body, @Response() res) {
    let id = body._id;
    await this.goodsTypeService.update({ '_id': id }, body);
    this.toolsService.success(res, '/goodsType');
  }

  @Get('delete')
  async delete(@Query() query, @Response() res) {
    await this.goodsTypeService.delete({ '_id': query.id });
    this.toolsService.success(res, '/goodsType');
  }
}
