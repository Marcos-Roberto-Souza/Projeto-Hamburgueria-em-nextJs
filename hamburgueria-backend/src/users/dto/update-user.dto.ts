import { IsEmail, IsOptional, MinLength, IsIn } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    name?: string;

    @IsOptional()
    @IsEmail({}, { message: 'Email inválido' })
    email?: string;

    @IsOptional()
    @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
    password?: string;

    @IsOptional()
    @IsIn(['ADMIN', 'ATENDENTE', 'COZINHA'])
    role?: 'ADMIN' | 'ATENDENTE' | 'COZINHA';
}