import { Module } from '@nestjs/common';
import { MainController } from './main/main.controller';
import { LoginController } from './login/login.controller';
import { ManagerController } from './manager/manager.controller';
import { ToolsService } from '../../service/tools/tools.service';
import { MongooseModule } from '@nestjs/mongoose';

import { AdminSchema } from '../../schema/admin.schema';
import { AdminService } from '../../service/admin/admin.service';

import { RoleSchema } from '../../schema/role.schema';
import { RoleService } from '../../service/role/role.service';
import { RoleController } from './role/role.controller';

import { AccessSchema } from '../../schema/access.schema';
import { AccessService } from '../../service/access/access.service';
import { AccessController } from './access/access.controller';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'Admin', schema: AdminSchema, collection: 'admin' },
    { name: 'Role', schema: RoleSchema, collection: 'role' },
    { name: 'Access', schema: AccessSchema, collection: 'access' }
  ])],
  controllers: [MainController, LoginController, ManagerController, RoleController, AccessController],
  providers: [ToolsService, AdminService, RoleService, AccessService]
})
export class AdminModule { }
