import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne
} from 'typeorm';
import { OrderItem } from './order-item.entity';
import { ProductOption } from '../product-options/product-option.entity';
@Entity('order_item_options')
export class OrderItemOption {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => OrderItem, { onDelete: 'CASCADE' })
    order_Item: OrderItem;

    @ManyToOne(() => ProductOption)
    product_Option: ProductOption;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    additional_price: number;

}
