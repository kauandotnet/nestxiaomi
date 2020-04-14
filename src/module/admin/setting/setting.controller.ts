import { Controller, Get, Render, Post, UseInterceptors, UploadedFiles, Body, Response } from '@nestjs/common';
import { Config } from '../../../config/config';
import { ToolsService } from '../../../service/tools/tools.service';
import { SettingService } from '../../../service/setting/setting.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller(`${Config.adminPath}/setting`)
export class SettingController {

  constructor(
    private settingService: SettingService,
    private toolsService: ToolsService,
  ) {
  }

  @Get()
  @Render('admin/setting/index')
  async index() {

    let result = await this.settingService.find({});
    return {

      list: result[0],
    };
  }

  @Post('doEdit')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'site_logo', maxCount: 1 },
    { name: 'no_picture', maxCount: 1 },
  ]))
  async doEdit(@UploadedFiles() files, @Body() body, @Response() res) {

    var updateJson = body;
    if (files.site_logo) {

      var { saveDir } = await this.toolsService.uploadFile(files.site_logo[0]);
      var siteLogoDir = saveDir;

      updateJson = Object.assign(updateJson, {
        site_logo: siteLogoDir,
      });
    }
    if (files.no_picture) {

      var { saveDir } = await this.toolsService.uploadFile(files.no_picture[0]);

      var noPictureDir = saveDir;
      updateJson = Object.assign(updateJson, {
        no_picture: noPictureDir,
      });
    }
    //更新数据
    await this.settingService.update({}, updateJson);
    this.toolsService.success(res, `/${Config.adminPath}/setting`);
  }


}
