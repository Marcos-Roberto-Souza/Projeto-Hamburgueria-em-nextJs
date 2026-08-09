import { IsNumber, Min, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
    @IsString()
    name: string;

    @Type(()=> Number)
    @IsNumber()
    @Min(0)
    base_price: number;

    @IsOptional()
    @IsString()
    description?: string;
}
