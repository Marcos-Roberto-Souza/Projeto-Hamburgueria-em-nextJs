import { IsEmail, IsNotEmpty, MinLength, IsIn } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
  password: string;

  @IsIn(['ADMIN', 'ATENDENTE', 'COZINHA'], {
    message: 'Role inválida',
  })
  role: 'ADMIN' | 'ATENDENTE' | 'COZINHA';
}