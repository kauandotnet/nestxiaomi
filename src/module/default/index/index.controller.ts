import { Controller, Get } from '@nestjs/common';

@Controller('')
export class IndexController {
  @Get()
  index() {
    return 'default index';
  }
}
