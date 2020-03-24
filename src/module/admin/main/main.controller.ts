import { Controller, Get, Render, Request, Query } from '@nestjs/common';
import { Config } from '../../../config/config';
import { AccessService } from '../../../service/access/access.service';
import { RoleAccessService } from '../../../service/role-access/role-access.service';
import { FocusService } from '../../../service/focus/focus.service';


@Controller(`${Config.adminPath}/main`)
export class MainController {
  constructor(
    private accessService: AccessService,
    private roleAccessService: RoleAccessService,
    private focusService: FocusService
  ) { }

  @Get()
  @Render('admin/main/index')
  async index(@Request() req) {
    let userinfo = req.session.userinfo;
    let role_id = userinfo.role_id;

    let result = await this.accessService.getModel().aggregate([{
      $match: {
        'module_id': '0'
      }
    }, {
      $lookup: {
        from: 'access',
        localField: '_id',
        foreignField: 'module_id',
        as: 'items'
      }
    }]);

    let roleAccessResult = await this.roleAccessService.find({ 'role_id': role_id });
    let roleAccessArray = [];
    roleAccessResult.forEach(value => {
      roleAccessArray.push(value.access_id.toString());
    });

    for (let i = 0; i < result.length; i++) {
      if (roleAccessArray.indexOf(result[i]._id.toString()) != -1) {
        result[i].checked = true;
      }
      for (let j = 0; j < result[i].items.length; j++) {
        if (roleAccessArray.indexOf(result[i].items[j]._id.toString()) != -1) {
          result[i].items[j].checked = true;
        }
      }
    }

    return {
      asideList: result
    };
  }

  @Get('welcome')
  @Render('admin/main/welcome')
  welcome() {
    return {};
  }

  @Get('changeStatus')
  async changeStatus(@Query() query) {
    let id = query.id;
    let model = query.model + 'Service';
    let fields = query.fields;

    let json = {};
    let focusResult = await this[model].find({ '_id': id });

    if (focusResult.length > 0) {
      let tempFields = focusResult[0][fields];
      tempFields == 1 ? json = { [fields]: 0 } : json = { [fields]: 1 };

      this[model].update({ '_id': id }, json);
      return {
        success: true,
        message: 'success'
      }
    } else {
      return {
        success: false,
        message: 'fail'
      }
    }
  }
}
