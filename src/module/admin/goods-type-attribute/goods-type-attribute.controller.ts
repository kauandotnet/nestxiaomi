import { Controller, Get, Render, Query, Post, Body, Response } from '@nestjs/common';
import { Config } from '../../../config/config';
import { GoodsTypeAttributeService } from '../../../service/goods-type-attribute/goods-type-attribute.service';
import { GoodsTypeService } from '../../../service/goods-type/goods-type.service';
import { ToolsService } from '../../../service/tools/tools.service';

@Controller(`${Config.adminPath}/goodsTypeAttribute`)

export class GoodsTypeAttributeController {
  constructor(
    private goodsTypeAttributeService: GoodsTypeAttributeService,
    private toolsService: ToolsService,
    private goodsTypeService: GoodsTypeService
  ) { }

  @Get()
  @Render('admin/goodsTypeAttribute/index')
  async index(@Query() query) {
    var id = query.id;
    var goodsTypeResult = await this.goodsTypeService.find({ '_id': id });
    return {
      goodsType: goodsTypeResult[0]
    };
  }

  @Get('add')
  @Render('admin/goodsTypeAttribute/add')
  async add(@Query() query) {
    var id = query.id;
    var goodsTypeResult = await this.goodsTypeService.find();
    return {
      goodsTypes: goodsTypeResult,
      cate_id: id
    };
  }

  @Post('doAdd')
  async doAdd(@Body() body, @Response() res) {
    var result = await this.goodsTypeAttributeService.add(body);
    if (result) {
      this.toolsService.success(res, `/goodsTypeAttribute?id=${body.cate_id}`);
    } else {
      this.toolsService.error(res, 'add fail', `/goodsTypeAttribute?id=${body.cate_id}`);
    }
  }
}
