import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class RoleAccessService {
  constructor(@InjectModel('RoleAccess') private readonly RoleAccessModel) { }

  async find(json, fields?: string) {
    try {
      return await this.RoleAccessModel.find(json, fields);
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async add(json) {
    try {
      let roleAccess = new this.RoleAccessModel(json);
      return await roleAccess.save();
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async update(json1, json2) {
    try {
      return await this.RoleAccessModel.updateOne(json1, json2);
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async delete(json) {
    try {
      return await this.RoleAccessModel.deleteOne(json);
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async deleteMany(json) {
    try {
      return await this.RoleAccessModel.deleteMany(json);
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
