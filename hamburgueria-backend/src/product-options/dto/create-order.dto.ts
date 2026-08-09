import { IsInt, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderItemDto } from './create-order-item.dto';

export class CreateOrderDto {
    @IsInt()
    userId: number;

    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemDto)
    @ArrayMinSize(1)
    items: CreateOrderItemDto[];
}
