import { Injectable } from '@nestjs/common';

@Injectable()
export class CartService {

  cartHasData(cartList, currentData) {


    if (cartList.length > 0) {
      for (var i = 0; i < cartList.length; i++) {
        if (cartList[i]._id.toString() == currentData._id.toString() && cartList[i].color == currentData.color && cartList[i].goods_attr == currentData.goods_attr) {
          return true;
        }
      }
    }
    return false;

  }
}
