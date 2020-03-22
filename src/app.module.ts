import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AdminModule } from './module/admin/admin.module';
import { DefaultModule } from './module/default/default.module';
import { ApiModule } from './module/api/api.module';
import { AdminauthMiddleware } from './middleware/adminauth.middleware';
import { InitMiddleware } from './middleware/init.middleware';
import { MongooseModule } from '@nestjs/mongoose';
import { Config } from './config/config';
@Module({
  imports: [
    AdminModule,
    DefaultModule,
    ApiModule,
    MongooseModule.forRoot(
      'mongodb://localhost/nestxiaomi', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  ],
  controllers: [],
  providers: []
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AdminauthMiddleware)
      .forRoutes(`${Config.adminPath}/*`)
      .apply(InitMiddleware)
      .forRoutes('*');
  }
}
