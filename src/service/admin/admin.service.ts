import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AdminInterface } from '../../interface/admin.interface';
import { RoleAccessService } from '../role-access/role-access.service';
import { Config } from '../../config/config';
import { AccessService } from '../access/access.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel('Admin') private readonly adminModel,
    private roleAccessService: RoleAccessService,
    private accessService: AccessService
  ) { }

  async find(json: AdminInterface = {}, fields?: string) {
    try {
      return await this.adminModel.find(json, fields);
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async add(json: AdminInterface) {
    try {
      let admin = new this.adminModel(json);
      return await admin.save();
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async update(json1: AdminInterface, json2: AdminInterface) {
    try {
      return await this.adminModel.updateOne(json1, json2);
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async delete(json: AdminInterface) {
    try {
      return await this.adminModel.deleteOne(json);
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  getModel() {
    return this.adminModel;
  }

  async checkAuth(req) {
    let pathname: string = req.baseUrl;
    pathname = pathname.replace(`/${Config.adminPath}/`, '');

    let userinfo = req.session.userinfo;
    let role_id = userinfo.role_id;

    if (userinfo.is_super == 1 ||
      pathname == 'login/logout' ||
      pathname == 'main/welcome' ||
      pathname == 'main' ||
      pathname == 'login' ||
      pathname == 'login/doLogin') {
      return true;
    }

    let roleAccessResult = await this.roleAccessService.find({ 'role_id': role_id });
    let roleAccessArray = [];
    roleAccessResult.forEach(value => {
      roleAccessArray.push(value.access_id.toString());
    });

    let accessResult = await this.accessService.find({ 'url': pathname });
    if (accessResult.length > 0) {
      return roleAccessArray.indexOf(accessResult[0]._id.toString()) != -1;
    } else {
      return false;
    }
  }
}
