import { Controller, Get, Body, Request, Post, Query } from '@nestjs/common';
import { AddressService } from '../../../service/address/address.service';
import { CookieService } from '../../../service/cookie/cookie.service';

@Controller('user/address')
export class AddressController {
  constructor(
    private addressService: AddressService,
    private cookieService: CookieService,
  ) {
  }

  // 增加收货地址
  @Post('addAddress')
  async addAddress(@Body() body, @Request() req) {

    /*
        1、获取表单提交的数据

        2、更新当前用户的所有收货地址的默认收货地址状态为0

        3、增加当前收货地址，让默认收货地址状态是1

        4、查询当前用户的所有收货地址返回

    */
    let uid = this.cookieService.get(req, 'userinfo')._id;
    let name = body.name;
    let phone = body.phone;
    let address = body.address;
    let zipcode = body.zipcode;
    let addressCount = await this.addressService.count({ uid });
    if (addressCount > 20) {
      return {
        success: false,
        result: '增加收货地址失败 收货地址数量超过限制',
      };
    } else {
      await this.addressService.updateMany({ 'uid': uid }, { default_address: 0 });
      await this.addressService.add({ uid, name, phone, address, zipcode }); //Schema里面配置的default_address=1，所以增加完成后就显示了默认收货地址
      let addressResult = await this.addressService.find({ 'uid': uid }, { default_address: -1 });
      return {
        success: true,
        result: addressResult,
      };
    }


  }

  // 获取一个收货地址  返回指定收货地址id的收货地址
  @Get('getOneAddressList')
  async getOneAddressList(@Query() query, @Request() req) {
    let id = query.id;
    var addressResult = await this.addressService.find({ '_id': id });
    return {
      success: true,
      result: addressResult[0],
    };

  }

  // 编辑收货地址
  @Post('doEditAddressList')
  async doEditAddressList(@Body() body, @Request() req) {
    /*
            1、获取表单增加的数据

            2、更新当前用户的所有收货地址的默认收货地址状态为0

            3、修改当前收货地址，让默认收货地址状态是1

            4、查询当前用户的所有收货地址并返回

    */

    let uid = this.cookieService.get(req, 'userinfo')._id;
    let id = body.id;
    let name = body.name;
    let phone = body.phone;
    let address = body.address;
    let zipcode = body.zipcode;
    await this.addressService.updateMany({ 'uid': uid }, { default_address: 0 });
    await this.addressService.update({ '_id': id, 'uid': uid }, { name, phone, address, zipcode, default_address: 1 });
    let addressResult = await this.addressService.find({ 'uid': uid }, { default_address: -1 });
    return {
      success: true,
      result: addressResult,
    };


  }

  // 修改默认的收货地址
  @Get('changeDefaultAddress')
  async changeDefaultAddress(@Query() query, @Request() req) {
    /*
        1、获取当前用户收货地址id 以及用户id

        2、更新当前用户的所有收货地址的默认收货地址状态为0

        3、更新当前收货地址的默认收货地址状态为1

    */

    let id = query.id;
    let uid = this.cookieService.get(req, 'userinfo')._id;
    await this.addressService.updateMany({ 'uid': uid }, { default_address: 0 });
    await this.addressService.update({ 'uid': uid, '_id': id }, { default_address: 1 });
    return {
      success: true,
      msg: '更新默认收货地址成功',
    };

  }
}
