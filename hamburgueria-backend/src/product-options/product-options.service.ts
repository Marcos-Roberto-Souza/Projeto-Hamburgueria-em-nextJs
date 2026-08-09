import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductOption } from './product-option.entity';
import { Product } from '../products/product.entity';
import { CreateProductOptionDto } from './dto/create-product-option.dto';
import { UpdateProductOptionDto } from './dto/update-product-option.dto';

@Injectable()
export class ProductOptionsService {
    constructor(
        @InjectRepository(ProductOption)
        private optionsRepository: Repository<ProductOption>,

        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
    ) { }

    async create(dto: CreateProductOptionDto): Promise<ProductOption> {
        const product = await this.productsRepository.findOneBy({
            id: dto.product_id,
        });

        if (!product) {
            throw new NotFoundException('Produto não encontrado');
        }

        const option = this.optionsRepository.create({
            name: dto.name,
            additional_price: dto.additional_price,
            product,
        });

        return this.optionsRepository.save(option);
    }

    findAll(): Promise<ProductOption[]> {
        return this.optionsRepository.find({ relations: ['product'] });
    }

    async update(id: number, dto: UpdateProductOptionDto): Promise<ProductOption> {
        const option = await this.optionsRepository.findOneBy({ id });

        if (!option) {
            throw new NotFoundException('Adicional não encontrado');
        }

        Object.assign(option, dto);
        return this.optionsRepository.save(option);
    }

    async remove(id: number): Promise<void> {
        const result = await this.optionsRepository.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException('Adicional não encontrado');
        }
    }
}