import { Controller, Render, Get, Query, Param, Response } from '@nestjs/common';
import { GoodsService } from '../../../service/goods/goods.service';
import { GoodsCateService } from '../../../service/goods-cate/goods-cate.service';
import * as mongoose from 'mongoose';

@Controller('category')
export class CategoryController {

  constructor(private goodsService: GoodsService, private goodsCateService: GoodsCateService) {
  }

  @Get(':pid')
  // @Render('default/category/list')
  async index(@Query() query, @Param() params, @Response() res) {

    console.log(params);
    var pid = params.pid;
    let page = query.page || 1;
    let pageSize = 12;
    let limit = (page - 1) * pageSize;

    var cateResult = await this.goodsService.getCategoryGoods(pid, '', pageSize, limit);
    // 1、获取当前分类
    var currentCateResult = await this.goodsCateService.find({ '_id': pid });
    if (currentCateResult[0].pid == '0') {
      //2、获取它下面的子分类
      var subCateResult = await this.goodsCateService.find({ 'pid': mongoose.Types.ObjectId(pid) });
    } else {
      //2、获取它的顶级分类
      //3、再获取顶级分类下面的自分类
      var subCateResult = await this.goodsCateService.find({ 'pid': mongoose.Types.ObjectId(currentCateResult[0].pid) });

    }
    //指定模板渲染
    let tpl = currentCateResult[0].template ? currentCateResult[0].template : 'default/category/list';

    res.render(tpl, {
      goodsList: cateResult,
      subCate: subCateResult,
      currentCate: currentCateResult[0],
    });

  }
}
