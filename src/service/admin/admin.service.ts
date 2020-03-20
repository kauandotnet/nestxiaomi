import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AdminInterface } from '../../interface/admin.interface';

@Injectable()
export class AdminService {
  constructor(@InjectModel('Admin') private readonly adminModel) { }

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
}
