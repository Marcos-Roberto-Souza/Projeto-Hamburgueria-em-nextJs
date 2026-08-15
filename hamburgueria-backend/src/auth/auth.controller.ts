import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  login(@Body() dto: LoginDto) {

    console.log('*** LOGIN RECEBIDO *** ')
    console.log('DTO LOGIN: ', dto);
    
    return this.authService.login(dto);
  }
}