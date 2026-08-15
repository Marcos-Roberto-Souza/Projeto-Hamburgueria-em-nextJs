import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    console.log('DTO: ', dto);
    const user = await this.usersService.findByEmail(
      dto.email,
    );

    console.log("USER: ", user);

    if (!user) {
      throw new UnauthorizedException(
        'Email ou senha inválidos',
      );
    }

    console.log('PASSWORD MATCH: ', passwordMatch);

    const passwordMatch = await bcrypt.compare(
      dto.password,
      user.password,
    );

    if (!passwordMatch) {
      throw new UnauthorizedException(
        'Email ou senha inválidos',
      );
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    console.log('PAYLOAD: ', payload);

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}