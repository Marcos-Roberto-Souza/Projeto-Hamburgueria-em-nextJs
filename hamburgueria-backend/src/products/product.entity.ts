import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
} from 'typeorm';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    description?: string;

    @Column('decimal', { precision: 10, scale: 2 })
    base_price: number;

    @Column({ nullable: true})
    image_url?: string;

    @Column({ default: true })
    active: boolean;

    @CreateDateColumn()
    created_at: Date;
}