import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductOption } from './product-option.entity';
import { Product } from '../products/product.entity';
import { ProductOptionsController } from './product-options.controller';
import { ProductOptionsService } from './product-options.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductOption, Product])],
  controllers: [ProductOptionsController],
  providers: [ProductOptionsService],
})
export class ProductOptionsModule {}
