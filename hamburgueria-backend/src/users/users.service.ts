import { 
    Injectable, 
    NotFoundException, 
    ConflictException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import {CreateUserDto} from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { UserRole } from './user-role.enum';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async create(createUserDto: CreateUserDto): Promise<User> {
        
        const existingUser = await this.usersRepository.findOne({
            where:{
                email: createUserDto.email,
            },
        });

        if (existingUser){
            throw new ConflictException(
                'Já existe um usuário com este email',
            );
        }

        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

        const user = this.usersRepository.create({
            name: createUserDto.name,
            email: createUserDto.email,
            password: hashedPassword,
            role: UserRole.CUSTOMER,
    
        });

        return this.usersRepository.save(user);
    }

    async findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.usersRepository.findOneBy({ id });

        if (!user) {
            throw new NotFoundException('Usuário não encontrado');
        }

        // Se atualizar senha, gerar novo hash
        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }

        Object.assign(user, updateUserDto);
        return this.usersRepository.save(user);
    }

    async remove(id: number): Promise<void> {
        const result = await this.usersRepository.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException('Usuário não encontrado');
        }
    }
}