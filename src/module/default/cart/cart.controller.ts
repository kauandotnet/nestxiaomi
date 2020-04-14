import { Controller, Get, Response, Request, Query, Render } from '@nestjs/common';
import { CookieService } from '../../../service/cookie/cookie.service';
import { GoodsService } from '../../../service/goods/goods.service';
import { GoodsColorService } from '../../../service/goods-color/goods-color.service';
import { CartService } from '../../../service/cart/cart.service';

@Controller('cart')
export class CartController {
  constructor(
    private cookieService: CookieService,
    private goodsService: GoodsService,
    private goodsColorService: GoodsColorService,
    private cartService: CartService,
  ) {
  }

  @Get()
  @Render('default/cart/cart')
  index(@Request() req) {
    let cartList = this.cookieService.get(req, 'cartList');
    var allPrice = 0;

    if (cartList && cartList.length > 0) {
      for (var i = 0; i < cartList.length; i++) {
        if (cartList[i].checked) {
          allPrice += cartList[i].price * cartList[i].num;
        }
      }

    }

    return {
      cartList: cartList && cartList.length > 0 ? cartList : [],
      allPrice: allPrice,
    };

  }

  @Get('addCart')
  async addCart(@Query() query, @Request() req, @Response() res) {

    /*
        购物车数据保持到哪里？：

                1、购物车数据保存在本地    （cookie）

                2、购物车数据保存到服务器   （必须登录）

                3、没有登录 购物车数据保存到本地 ， 登录成功后购物车数据保存到服务器  （用的最多）


        增加购物车的实现逻辑：

                1、获取增加购物车的数据  （把哪一个商品加入到购物车）

                2、判断购物车有没有数据   （cookie）

                3、如果购物车没有任何数据  直接把当前数据写入cookie

                4、如果购物车有数据

                    4、1、判断购物车有没有当前数据

                            有当前数据让当前数据的数量加1，然后写入到cookie

                            如果没有当前数据直接写入cookie
    */


    let goods_id = query.goods_id;
    let color_id = query.color_id;
    console.log(goods_id);

    let goodsResult = await this.goodsService.find({ '_id': goods_id });
    let colorResult = await this.goodsColorService.find({ '_id': color_id });
    console.log(goodsResult);

    if (goodsResult.length > 0 && colorResult.length > 0) {
      var goodsGiftIds = this.goodsService.strToArray(goodsResult[0].goods_gift);
      var goodsGift = await this.goodsService.findIn({
        _id: { $in: goodsGiftIds },
      }, 'goods_img title');

    } else {
      res.status(404);
      res.send('错误404');   //404
      return;
    }

    // 1、获取增加购物车的数据  （把哪一个商品加入到购物车）
    let currentData = {
      _id: goods_id,
      title: goodsResult[0].title,
      price: goodsResult[0].shop_price,
      goods_version: goodsResult[0].goods_version,
      num: 1,
      color: colorResult[0].color_name,
      goods_img: goodsResult[0].goods_img,
      goods_gift: goodsGift,  /*赠品*/
      goods_attr: '',          //根据自己的需求拓展
      checked: true,           /*默认选中*/
    };

    console.log(currentData);


    // 2、判断购物车有没有数据   （cookie）
    let cartList = this.cookieService.get(req, 'cartList');

    if (cartList && cartList.length > 0) {
      //4、如果购物车有数据
      // 4、1、判断购物车有没有当前数据
      if (this.cartService.cartHasData(cartList, currentData)) {
        // 有当前数据让当前数据的数量加1，然后写入到cookie
        for (var i = 0; i < cartList.length; i++) {
          if (cartList[i]._id.toString() == currentData._id.toString() && cartList[i].color == currentData.color && cartList[i].goods_attr == currentData.goods_attr) {
            cartList[i].num = cartList[i].num + 1;
          }
        }
        this.cookieService.set(res, 'cartList', cartList);

      } else {  // 如果没有当前数据  把当前数据放在cartList里面 直接写入cookie
        cartList.push(currentData);
        this.cookieService.set(res, 'cartList', cartList);
      }

    } else {
      //3、如果购物车没有任何数据  直接把当前数据写入cookie
      var tempArr: any = [];
      tempArr.push(currentData);
      this.cookieService.set(res, 'cartList', tempArr);

    }

    // res.send("加入购物车成功");

    res.redirect('/cart/addCartSuccess?goods_id=' + goods_id + '&color_id=' + color_id);


  }


  //加入购物车后显示的成功页面
  @Get('addCartSuccess')
  @Render('default/cart/addcart_success')
  async addCartSuccess(@Query() query, @Request() req, @Response() res) {
    var goods_id = query.goods_id;
    var color_id = query.color_id;
    //1、获取商品信息
    var goodsResult = await this.goodsService.find({ '_id': goods_id });
    var colorResult = await this.goodsColorService.find({ '_id': color_id });
    if (goodsResult.length == 0 || colorResult.length == 0) {
      res.status(404);
      res.send('错误404');
    } else {
      var title = goodsResult[0].title + '--' + goodsResult[0].goods_version + '--' + colorResult[0].color_name;
      return {
        title: title,
        goods_id: goods_id,
      };
    }
  }

  //增加购物车数量
  @Get('incCart')
  async incCart(@Query() query, @Request() req, @Response() res) {
    let goods_id = query.goods_id;
    let color = query.color;
    let goods_attr = '';  //如果自己的项目里面有这个自定义属性的话需要通过接口传过来
    let goodsResult = await this.goodsService.find({ '_id': goods_id });
    if (goodsResult && goodsResult.length > 0) {
      let cartList = this.cookieService.get(req, 'cartList');
      let currentNum = 0;  //商品数量
      let allPrice = 0;   //总价格
      for (var i = 0; i < cartList.length; i++) {
        if (cartList[i]._id.toString() == goods_id.toString() && cartList[i].color == color && cartList[i].goods_attr == goods_attr) {
          cartList[i].num = cartList[i].num + 1;
          currentNum = cartList[i].num;
          if (cartList[i].checked) { //计算总价
            allPrice += cartList[i].num * cartList[i].price;
          }
        }
      }
      this.cookieService.set(res, 'cartList', cartList);
      res.send({
        'success': true,
        'totalPrice': currentNum * goodsResult[0].shop_price,
        'num': currentNum,
        'allPrice': allPrice,
        'msg': '修改数量成功',
      });

    } else {
      res.send({
        'success': false,
        'msg': '修改数量失败',
      });
    }
  }

  //减少购物车数量
  @Get('decCart')
  async decCart(@Query() query, @Request() req, @Response() res) {
    let goods_id = query.goods_id;
    let color = query.color;
    let goods_attr = '';  //如果自己的项目里面有这个自定义属性的话需要通过接口传过来
    let goodsResult = await this.goodsService.find({ '_id': goods_id });
    if (goodsResult && goodsResult.length > 0) {
      let cartList = this.cookieService.get(req, 'cartList');
      let currentNum = 0;  //商品数量
      let allPrice = 0;   //总价格
      for (var i = 0; i < cartList.length; i++) {
        if (cartList[i]._id.toString() == goods_id.toString() && cartList[i].color == color && cartList[i].goods_attr == goods_attr) {
          if (cartList[i].num > 1) {
            cartList[i].num = cartList[i].num - 1;
          }
          currentNum = cartList[i].num;
          if (cartList[i].checked) { //计算总价
            allPrice += cartList[i].num * cartList[i].price;
          }
        }
      }
      this.cookieService.set(res, 'cartList', cartList);
      res.send({
        'success': true,
        'totalPrice': currentNum * goodsResult[0].shop_price,
        'num': currentNum,
        'allPrice': allPrice,
        'msg': '修改数量成功',
      });
    } else {
      res.send({
        'success': false,
        'msg': '修改数量失败',
      });
    }
  }


  //改变购物车商品的状态
  @Get('changeOneCart')
  async changeOneCart(@Query() query, @Request() req, @Response() res) {
    let goods_id = query.goods_id;
    let color = query.color;
    let goods_attr = '';  //如果自己的项目里面有这个自定义属性的话需要通过接口传过来
    let goodsResult = await this.goodsService.find({ '_id': goods_id });
    if (goodsResult && goodsResult.length > 0) {
      let cartList = this.cookieService.get(req, 'cartList');
      let allPrice = 0;   //总价格
      for (var i = 0; i < cartList.length; i++) {
        if (cartList[i]._id.toString() == goods_id.toString() && cartList[i].color == color && cartList[i].goods_attr == goods_attr) {
          cartList[i].checked = !cartList[i].checked;
        }
        if (cartList[i].checked) { //计算总价
          allPrice += cartList[i].num * cartList[i].price;
        }
      }
      this.cookieService.set(res, 'cartList', cartList);
      res.send({
        'success': true,
        'allPrice': allPrice,
        'msg': '修改状态成功',
      });
    } else {
      res.send({
        'success': false,
        'msg': '修改状态失败',
      });
    }
  }


  //改变所有购物车商品的状态
  @Get('changeAllCart')
  async changeAllCart(@Query() query, @Request() req, @Response() res) {
    var type = query.type;
    var cartList = this.cookieService.get(req, 'cartList');
    var allPrice = 0;   //总价格
    for (var i = 0; i < cartList.length; i++) {
      if (type == 1) {
        cartList[i].checked = true;
      } else {
        cartList[i].checked = false;
      }
      //计算总价
      if (cartList[i].checked) {
        allPrice += cartList[i].price * cartList[i].num;
      }
    }
    this.cookieService.set(res, 'cartList', cartList);
    res.send({
      'success': true,
      allPrice: allPrice,
    });
  }


  //删除购物车数据
  @Get('delCart')
  async delCart(@Query() query, @Request() req, @Response() res) {
    let goods_id = query.goods_id;
    let color = query.color;
    let goods_attr = '';  //如果自己的项目里面有这个自定义属性的话需要通过接口传过来
    let goodsResult = await this.goodsService.find({ '_id': goods_id });
    if (goodsResult && goodsResult.length > 0) {
      let cartList = this.cookieService.get(req, 'cartList');
      for (var i = 0; i < cartList.length; i++) {
        if (cartList[i]._id.toString() == goods_id.toString() && cartList[i].color == color && cartList[i].goods_attr == goods_attr) {
          cartList.splice(i, 1);
        }
      }
      this.cookieService.set(res, 'cartList', cartList);
    }
    res.redirect('/cart');

  }


}
