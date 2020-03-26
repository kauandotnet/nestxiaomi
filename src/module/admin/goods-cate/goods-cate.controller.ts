import { Controller, Get, Render, Post, Body, Response, UseInterceptors, UploadedFile, } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Config } from '../../../config/config';
import { GoodsCateService } from '../../../service/goods-cate/goods-cate.service';
import { ToolsService } from '../../../service/tools/tools.service';
import * as mongoose from 'mongoose';

@Controller(`${Config.adminPath}/goodsCate`)
export class GoodsCateController {
  constructor(private goodsCateService: GoodsCateService, private toolsService: ToolsService) { }

  @Get()
  @Render('admin/goodsCate/index')
  index() {
    return {};
  }

  @Get('add')
  @Render('admin/goodsCate/add')
  async add() {
    let result = await this.goodsCateService.find({ 'pid': '0' });
    return {
      cateList: result
    };
  }

  @Post('doAdd')
  @UseInterceptors(FileInterceptor('cate_img'))
  async doAdd(@Body() body, @UploadedFile() file, @Response() res) {

    let pid = body.pid;
    let saveDir = this.toolsService.uploadFile(file);
    try {
      if (pid != 0) {
        body.pid = mongoose.Types.ObjectId(pid);   //注意
      }
      await this.goodsCateService.add(Object.assign(body, {
        cate_img: saveDir
      }));
      this.toolsService.success(res, '/goodsCate');

    } catch (error) {
      console.log(error);
      this.toolsService.error(res, '非法请求', '/goodsCate/add');
    }
  }
}
