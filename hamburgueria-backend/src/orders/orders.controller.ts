import { 
    Controller, 
    Get, 
    Patch, 
    Param, 
    Post, 
    Body,
    UseGuards, 
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/user-role.enum';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Roles(
        UserRole.KITCHEN,
        UserRole.ADMIN,
    )
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('kds')
    findForKDS() {
        return this.ordersService.findForKDS();
    }

    @Roles(
        UserRole.KITCHEN,
        UserRole.ADMIN,
    )
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Patch(':id/start')
    startPreparation(@Param('id') id: number) {
        return this.ordersService.updateStatus(id, 'EM_PREPARO');
    }

    @Roles(
        UserRole.KITCHEN,
        UserRole.ADMIN,
    )
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Patch(':id/finish')
    finishOrder(@Param('id') id: number) {
        return this.ordersService.updateStatus(id, 'PRONTO');
    }

    @Roles(
        UserRole.KITCHEN,
        UserRole.ATTENDANT,
        UserRole.ADMIN,
    )
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    create(@Body() dto: CreateOrderDto) {
        return this.ordersService.createOrder(dto);
    }

    @Roles(UserRole.ADMIN)
    @UseGuards(
        JwtAuthGuard, 
        RolesGuard
    )
    @Get('history/today')
    getTodayHistory() {
        return this.ordersService.getTodayHistory();
    }

    @Roles(
        UserRole.ADMIN,
        UserRole.KITCHEN,
    )
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('history/metrics/today')
    getTodayMetrics() {
        return this.ordersService.getTodayMetrics();
    }

}