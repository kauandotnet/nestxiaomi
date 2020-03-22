import { Controller, Get, Render, Post, UseInterceptors, UploadedFile, Body, Response, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Config } from '../../../config/config';
import { ToolsService } from '../../../service/tools/tools.service';
import { FocusService } from '../../../service/focus/focus.service';

@Controller(`${Config.adminPath}/focus`)
export class FocusController {
  constructor(
    private toolsService: ToolsService,
    private focusService: FocusService
  ) { }

  @Get()
  @Render('admin/focus/index')
  async index() {
    let focusList = await this.focusService.find();
    return {
      focusList
    }
  }

  @Get('add')
  @Render('admin/focus/add')
  add() {
    return {}
  }

  @Post('doAdd')
  @UseInterceptors(FileInterceptor('focus_img'))
  doAdd(@Body() body, @UploadedFile() file, @Response() res) {
    let saveDir = this.toolsService.uploadFile(file);

    this.focusService.add(Object.assign(body, {
      focus_img: saveDir
    }));

    this.toolsService.success(res, '/focus');
  }

  @Get('edit')
  @Render('admin/focus/edit')
  async edit(@Query() query) {
    try {
      let result = await this.focusService.find({ '_id': query.id });
      return {
        focus: result[0]
      };
    } catch (error) {
      console.log(error);
    }
  }

  @Post('doEdit')
  @UseInterceptors(FileInterceptor('focus_img'))
  doEdit(@Body() body, @UploadedFile() file, @Response() res) {
    let _id = body._id;

    if (file) {
      let saveDir = this.toolsService.uploadFile(file);
      this.focusService.update({
        '_id': _id
      }, Object.assign(body, {
        focus_img: saveDir
      }));
    } else {
      this.focusService.update({
        '_id': _id
      }, body);
    }
    this.toolsService.success(res, '/focus');
  }

  @Get('delete')
  delete(@Query() query, @Response() res) {
    this.focusService.delete({ '_id': query.id });
    this.toolsService.success(res, '/focus');
  }
}
