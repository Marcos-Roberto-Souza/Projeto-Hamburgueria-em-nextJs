import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { UseGuards, Req, Get } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

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

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req){
    return req.user;
  }
}