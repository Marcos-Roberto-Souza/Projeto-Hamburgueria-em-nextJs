import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
} from 'typeorm';
import { Product } from '../products/product.entity';

@Entity('product_options')
export class ProductOption {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    additional_price: number;

    @Column({ default: true })
    active: boolean;

    @ManyToOne(() => Product, { onDelete: 'CASCADE' })
    product: Product;
}
