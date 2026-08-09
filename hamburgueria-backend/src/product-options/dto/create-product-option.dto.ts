import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductOptionDto {
    @IsNotEmpty()
    name: string;

    @Type(() => Number)
    @IsNumber()
    @Min(0)
    additional_price: number;

    @Type(() => Number)
    @IsNumber()
    product_id: number;
}