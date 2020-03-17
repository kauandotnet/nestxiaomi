import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AdminModule } from './module/admin/admin.module';
import { DefaultModule } from './module/default/default.module';
import { ApiModule } from './module/api/api.module';
import { AdminauthMiddleware } from './middleware/adminauth.middleware';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    AdminModule,
    DefaultModule,
    ApiModule,
    MongooseModule.forRoot(
      'mongodb://localhost/nestxiaomi',
      { useNewUrlParser: true }
    )
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AdminauthMiddleware)
      .forRoutes('admin/*')
  }
}
