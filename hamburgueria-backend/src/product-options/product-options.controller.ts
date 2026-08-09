import {
    Controller,
    Post,
    Get,
    Put,
    Delete,
    Param,
    Body,
} from '@nestjs/common';
import { ProductOptionsService } from './product-options.service';
import { CreateProductOptionDto } from './dto/create-product-option.dto';
import { UpdateProductOptionDto } from './dto/update-product-option.dto';

@Controller('product-options')
export class ProductOptionsController {
    constructor(private readonly service: ProductOptionsService) { }

    @Post()
    create(@Body() dto: CreateProductOptionDto) {
        return this.service.create(dto);
    }

    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() dto: UpdateProductOptionDto) {
        return this.service.update(Number(id), dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.service.remove(Number(id));
    }
}
``