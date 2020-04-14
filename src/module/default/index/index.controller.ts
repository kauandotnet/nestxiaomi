import { Controller, Get, Render } from '@nestjs/common';


import { FocusService } from '../../../service/focus/focus.service';
import { GoodsService } from '../../../service/goods/goods.service';
import { CacheService } from '../../../service/cache/cache.service';
import { ToolsService } from '../../../service/tools/tools.service';


//文件缓存   内存缓存

@Controller('')
export class IndexController {
  constructor(
    private focusService: FocusService,
    private goodsService: GoodsService,
    private cacheService: CacheService,
    private toolsService: ToolsService,
  ) {
  }

  @Get()
  @Render('default/index/index')
  async index() {

    //测试发送短信
    // this.toolsService.sendMsg();

    //轮播图
    let focusResult = await this.cacheService.get('indexFocus');
    if (!focusResult) {
      focusResult = await this.focusService.find({}, {
        'sort': -1,
      });
      this.cacheService.set('indexFocus', focusResult, 60 * 60);
    }

    //手机
    let phoneResult = await this.cacheService.get('indexPhone');
    if (!phoneResult) {
      phoneResult = await this.goodsService.getCategoryGoods('5bbf058f9079450a903cb77b', 'hot', 8);
      this.cacheService.set('indexPhone', phoneResult, 60 * 60);
    }

    //电视
    let tvResult = await this.cacheService.get('indexTv');
    if (!tvResult) {
      tvResult = await this.goodsService.getCategoryGoods('5bbf05ac9079450a903cb77c', 'hot', 8);
      this.cacheService.set('indexTv', tvResult, 60 * 60);
    }


    return {

      focus: focusResult,
      phone: phoneResult,
    };


  }


}
