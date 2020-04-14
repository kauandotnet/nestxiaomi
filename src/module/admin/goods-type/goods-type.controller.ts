import { Controller, Get, Render, Post, Body, Response, Query } from '@nestjs/common';
import { Config } from '../../../config/config';
import { GoodsTypeService } from '../../../service/goods-type/goods-type.service';
import { ToolsService } from '../../../service/tools/tools.service';

@Controller(`${Config.adminPath}/goodsType`)
export class GoodsTypeController {
  constructor(private goodsTypeService: GoodsTypeService, private toolsService: ToolsService) {
  }

  @Get()
  @Render('admin/goodsType/index')
  async index() {
    //获取所有的商品类型
    let result = await this.goodsTypeService.find({});
    return {
      list: result,
    };
  }

  @Get('add')
  @Render('admin/goodsType/add')
  async add() {

    return {};
  }

  @Post('doAdd')
  async doAdd(@Body() body, @Response() res) {
    let result = await this.goodsTypeService.add(body);

    if (result) {
      this.toolsService.success(res, `/${Config.adminPath}/goodsType`);
    } else {
      this.toolsService.error(res, '增加失败', `/${Config.adminPath}/goodsType`);
    }
  }

  @Get('edit')
  @Render('admin/goodsType/edit')
  async edit(@Query() query) {
    let result = await this.goodsTypeService.find({ '_id': query.id });
    return {
      list: result[0],
    };
  }

  @Post('doEdit')
  async doEdit(@Body() body, @Response() res) {

    let id = body._id;
    let result = await this.goodsTypeService.update({ '_id': id }, body);
    if (result) {
      this.toolsService.success(res, `/${Config.adminPath}/goodsType`);
    } else {
      this.toolsService.error(res, '增加失败', `/${Config.adminPath}/goodsType`);
    }
  }

  @Get('delete')
  async delete(@Query() query, @Response() res) {
    let result = await this.goodsTypeService.delete({ '_id': query.id });
    this.toolsService.success(res, `/${Config.adminPath}/goodsType`);
  }
}
