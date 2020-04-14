import { Controller, Get, Render, Post, Body, Response, Query, Request } from '@nestjs/common';
import { Config } from '../../../config/config';
import { ToolsService } from '../../../service/tools/tools.service';
import { NavService } from '../../../service/nav/nav.service';

@Controller(`${Config.adminPath}/nav`)
export class NavController {

  constructor(
    private navService: NavService,
    private toolsService: ToolsService,
  ) {
  }

  @Get()
  @Render('admin/nav/index')
  async index(@Query() query) {

    let page = query.page || 1;
    let pageSize = 5;
    let skip = (page - 1) * pageSize;
    var result = await this.navService.find({}, skip, pageSize, { 'add_time': -1 });
    var count = await this.navService.count();

    return {
      list: result,
      page: page,
      totalPages: Math.ceil(count / pageSize),
    };
  }

  @Get('add')
  @Render('admin/nav/add')
  add() {
    return {};
  }

  @Post('doAdd')
  async doAdd(@Body() body, @Response() res) {

    if (body.title != '') {
      await this.navService.add(body);
      this.toolsService.success(res, `/${Config.adminPath}/nav`);
    } else {
      this.toolsService.error(res, '导航不能为空', `/${Config.adminPath}/nav/add`);
    }

  }


  @Get('edit')
  @Render('admin/nav/edit')
  async edit(@Request() req, @Query() query) {

    let result = await this.navService.find({ '_id': query.id });
    return {
      list: result[0],
      prevPage: req.prevPage,
    };
  }


  @Post('doEdit')
  async doEdd(@Body() body, @Response() res) {

    let prevPage = body.prevPage || `/${Config.adminPath}/nav`;

    if (body.title != '') {
      let result = await this.navService.update({ '_id': body._id }, body);
      if (result) {
        this.toolsService.success(res, prevPage);
      } else {
        this.toolsService.error(res, '增加失败', prevPage);
      }
    } else {
      this.toolsService.error(res, '导航名称不能为空', `/${Config.adminPath}/nav/edit?id=${body._id}`);
    }
  }

  @Get('delete')
  async delete(@Request() req, @Query() query, @Response() res) {
    var result = await this.navService.delete({ '_id': query.id });
    let prevPage = req.prevPage || `/${Config.adminPath}/nav`;
    this.toolsService.success(res, prevPage);
  }


}
