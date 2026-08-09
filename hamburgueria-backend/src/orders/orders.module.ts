import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { OrderItemOption } from './order-item-option.entity';
import { Product } from '../products/product.entity';
import { ProductOption } from '../product-options/product-option.entity';
import { OrderHistory } from './order-history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderItem,
      OrderItemOption,
      Product,
      ProductOption,
      OrderHistory,
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}