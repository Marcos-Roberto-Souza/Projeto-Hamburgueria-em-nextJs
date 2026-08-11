import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    Column,
    JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../products/product.entity';

@Entity('order_items')
export class OrderItem {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Order, order => order.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Column()
    quantity: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    unit_price: number;
}