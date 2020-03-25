import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GoodsTypeInterface } from '../../interface/goods_type.interface'

@Injectable()
export class GoodsTypeService {
  constructor(@InjectModel('GoodsType') private readonly goodsTypeModel) { }

  async find(json: GoodsTypeInterface = {}, fields?: string) {
    try {
      return await this.goodsTypeModel.find(json, fields);
    } catch (error) {
      return null;
    }
  }

  async add(json: GoodsTypeInterface) {
    try {
      let goodsType = new this.goodsTypeModel(json);
      let result = await goodsType.save();
      return result;
    } catch (error) {
      return null;
    }
  }

  async update(json1: GoodsTypeInterface, json2: GoodsTypeInterface) {
    try {
      let result = await this.goodsTypeModel.updateOne(json1, json2);
      return result;
    } catch (error) {
      return null;
    }
  }

  async delete(json: GoodsTypeInterface) {
    try {
      let result = await this.goodsTypeModel.deleteOne(json);
      return result;
    } catch (error) {
      return null;
    }
  }

  getModel() {
    return this.goodsTypeModel;
  }
}
