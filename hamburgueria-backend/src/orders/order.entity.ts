import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    OneToMany,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { OrderItem } from './order-item.entity';
import { User } from '../users/user.entity';
@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: ['CRIADO', 'EM_PREPARO', 'PRONTO', 'ENTREGUE', 'CANCELADO'],
        default: 'CRIADO',
    })
    status: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    total: number;

    @CreateDateColumn()
    created_at: Date;

    @OneToMany(() => OrderItem, item => item.order, { cascade: true })
    items: OrderItem[];


    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

}
