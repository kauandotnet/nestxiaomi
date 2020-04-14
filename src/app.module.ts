import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AdminModule } from './module/admin/admin.module';
import { DefaultModule } from './module/default/default.module';
import { ApiModule } from './module/api/api.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminauthMiddleware } from './middleware/adminauth.middleware';
import { InitMiddleware } from './middleware/init.middleware';
import { DefaultMiddleware } from './middleware/default.middleware';
import { UserauthMiddleware } from './middleware/userauth.middleware';
import { Config } from './config/config';
import { PublicModule } from './module/public/public.module';

//配置中间件
@Module({
  imports: [
    AdminModule, DefaultModule, ApiModule,
    MongooseModule.forRoot('mongodb://localhost/nestxiaomi', { useNewUrlParser: true }),
    PublicModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AdminauthMiddleware)
      .forRoutes(`${Config.adminPath}/*`)
      .apply(InitMiddleware)
      .forRoutes('*')
      .apply(DefaultMiddleware)
      .forRoutes(
        {
          path: '/', method: RequestMethod.GET,
        },
        {
          path: '/category/*', method: RequestMethod.GET,
        },
        {
          path: '/product/*', method: RequestMethod.GET,
        },
        {
          path: '/cart', method: RequestMethod.GET,
        },
        {
          path: '/buy/*', method: RequestMethod.GET,
        },
        {
          path: '/cart/addCartSuccess', method: RequestMethod.GET,
        },
        {
          path: '/user/*', method: RequestMethod.GET,
        },
      )
      .apply(UserauthMiddleware)
      .forRoutes(
        {
          path: '/buy/*', method: RequestMethod.ALL,
        },
        {
          path: '/user/*', method: RequestMethod.ALL,
        },
      );
  }
}
