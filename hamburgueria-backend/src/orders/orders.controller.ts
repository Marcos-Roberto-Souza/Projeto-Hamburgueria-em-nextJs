import { Controller, Get, Patch, Param, Post, Body } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Get('kds')
    findForKDS() {
        return this.ordersService.findForKDS();
    }
    @Patch(':id/start')
    startPreparation(@Param('id') id: number) {
        return this.ordersService.updateStatus(id, 'EM_PREPARO');
    }
    @Patch(':id/finish')
    finishOrder(@Param('id') id: number) {
        return this.ordersService.updateStatus(id, 'PRONTO');
    }
    @Post()
    create(@Body() dto: CreateOrderDto) {
        return this.ordersService.createOrder(dto);
    }
    @Get('history/today')
    getTodayHistory() {
        return this.ordersService.getTodayHistory();
    }
    @Get('history/metrics/today')
    getTodayMetrics() {
        return this.ordersService.getTodayMetrics();
    }



}