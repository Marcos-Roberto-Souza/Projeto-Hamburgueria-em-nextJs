import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { Product } from '../products/product.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderHistory } from './order-history.entity';
@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private ordersRepository: Repository<Order>,

        @InjectRepository(OrderItem)
        private orderItemsRepository: Repository<OrderItem>,

        @InjectRepository(Product)
        private productsRepository: Repository<Product>,


        @InjectRepository(OrderHistory)
        private readonly orderHistoryRepository: Repository<OrderHistory>,

    ) { }

    findForKDS() {
        return this.ordersRepository.find({
            where: [
                { status: 'CRIADO' },
                { status: 'EM_PREPARO' },
            ],
            order: {
                created_at: 'ASC',
            },
            relations: ['items', 'items.product'],
        });
    }


    async updateStatus(id: number, status: string) {
        const order = await this.ordersRepository.findOne({
            where: { id },
            relations: ['items'],
        });

        if (!order) {
            throw new Error('Pedido não encontrado');
        }

        if (status === 'PRONTO') {
            const minutes = Math.floor((Date.now() - order?.created_at.getTime()) / 60000);

            const history = this.orderHistoryRepository.create({
                order_id: id,
                prepared_minutes: minutes,
                was_late: minutes >= 15,
            });

            await this.orderHistoryRepository.save(history);
        }

        order.status = status;
        return this.ordersRepository.save(order);
    }

    console.log('USER ID: ', dto.userId);

    async createOrder(dto: CreateOrderDto) {
        console.log('DTO RECEBIDO: ', dto);
        // 1️⃣ Criar pedido com status CRIADO
        const order = this.ordersRepository.create({
            status: 'CRIADO',
            total: 0,
            user: { id: dto.userId }, // Apenas para criar a relação, o ID é o suficiente
        });

        await this.ordersRepository.save(order);

        let total = 0;

        // 2️⃣ Criar itens do pedido
        for (const item of dto.items) {
            const product = await this.productsRepository.findOneBy({
                id: item.productId,
                active: true,
            });

            if (!product) {
                throw new Error(`Produto ${item.productId} não encontrado`);
            }

            const itemTotal = product.base_price * item.quantity;
            total += itemTotal;

            const orderItem = this.orderItemsRepository.create({
                order,
                product,
                quantity: item.quantity,
                unit_price: product.base_price,
            });

            await this.orderItemsRepository.save(orderItem);
        }

        // 3️⃣ Atualizar total do pedido
        order.total = total;
        await this.ordersRepository.save(order);

        // 4️⃣ Retornar pedido completo (já entra na KDS)
        return this.ordersRepository.findOne({
            where: { id: order.id },
            relations: ['items', 'items.product'],
        });
    }

    async getTodayHistory() {
        return this.orderHistoryRepository
            .createQueryBuilder('h')
            .where('DATE(h.closed_at) = CURDATE()')
            .orderBy('h.closed_at', 'DESC')
            .getMany();
    }

    async getTodayMetrics() {
        const history = await this.getTodayHistory();

        const total = history.length;
        const late = history.filter(h => h.was_late).length;
        const avgTime =
            total === 0
                ? 0
                : Math.round(
                    history.reduce((sum, h) => sum + h.prepared_minutes, 0) / total
                );

        const maxTime =
            history.length === 0
                ? 0
                : Math.max(...history.map(h => h.prepared_minutes));

        return {
            total_orders: total,
            late_orders: late,
            avg_minutes: avgTime,
            max_minutes: maxTime,
        };
    }

}



