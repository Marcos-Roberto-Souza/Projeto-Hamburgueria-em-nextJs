import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,} from 'typeorm';


@Entity('order_history')
export class OrderHistory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    order_id: number;

    @Column()
    prepared_minutes: number;

    @Column()
    was_late: boolean;

    @CreateDateColumn()
    closed_at: Date;
}