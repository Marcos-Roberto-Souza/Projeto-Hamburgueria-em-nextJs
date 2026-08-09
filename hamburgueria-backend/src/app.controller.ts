import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {

  @Get()
  getHome() {
    return {
      message: 'API da Hamburgueria rodando 🚀'
    };
  }

}
