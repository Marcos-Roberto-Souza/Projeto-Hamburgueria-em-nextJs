import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productsRepository: Repository<Product>
    ) { }

    findAll() {
        return this.productsRepository.find({
            where: { active: true },
        });
    }

    async create(dto: CreateProductDto, file?: Express.Multer.File) {
        const product = this.productsRepository.create({
            name: dto.name,
            base_price: dto.base_price,
            description: dto.description,
            image_url: file && `/uploads/products/${file.filename}`,
            active: true,
        });

        return this.productsRepository.save(product);
    }

    async update(id: number, dto: UpdateProductDto, file?: Express.Multer.File,){
        const product = await this.productsRepository.findOneBy({ id });

        if (!product) throw new NotFoundException('Produto não encontrado');

        if(dto.name !== undefined){
            product.name = dto.name;
        }
        
        if(dto.base_price !== undefined){
            product.base_price = dto.base_price;
        }

        if(dto.description !== undefined){
            product.description = dto.description;
        }

        if (file) {
            product.image_url = `/uploads/products/${file.filename}`;
        }

        return this.productsRepository.save(product);
    }

    async deactive(id: number) {
        const product = await this.productsRepository.findOneBy({ id });
        if (!product) throw new NotFoundException();

        product.active = false;
        return this.productsRepository.save(product);
    }

    async remove(id: number): Promise<void> {
        const product = await this.productsRepository.findOneBy({ id });

        if (!product) {
            throw new NotFoundException('Produto não encontrado');
        }

        await this.productsRepository.remove(product);
    }
}