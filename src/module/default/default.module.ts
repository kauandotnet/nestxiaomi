import { Module } from '@nestjs/common';
import { PublicModule } from '../public/public.module';
import { IndexController } from './index/index.controller';
import { UserController } from './user/user.controller';
import { AddressController } from './address/address.controller';
import { BuyController } from './buy/buy.controller';
import { PassController } from './pass/pass.controller';
import { CartController } from './cart/cart.controller';
import { ProductController } from './product/product.controller';
import { CategoryController } from './category/category.controller';
import { AlipayController } from './alipay/alipay.controller';
import { WxpayController } from './wxpay/wxpay.controller';


@Module({
  imports: [
    PublicModule,
  ],
  providers: [],
  controllers: [IndexController, UserController, AddressController, BuyController, PassController, CartController, ProductController, CategoryController, AlipayController, WxpayController],
})
export class DefaultModule {
}
