import { Controller, Get, Render, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Config } from '../../../config/config';
import { ToolsService } from '../../../service/tools/tools.service';

@Controller(`${Config.adminPath}/focus`)
export class FocusController {
  constructor(private toolsService: ToolsService) { }

  @Get()
  index() {
    return 'focus';
  }

  @Get('add')
  @Render('admin/focus/add')
  add() {
    return {}
  }

  @Post('doAdd')
  @UseInterceptors(FileInterceptor('focus_img'))
  doAdd(@UploadedFile() file) {
    return this.toolsService.uploadFile(file);
  }
}
