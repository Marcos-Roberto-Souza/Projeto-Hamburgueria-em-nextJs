import { Type } from 'class-transformer';
import { IsOptional, IsNumber, Min, IsBoolean, IsString } from 'class-validator';

export class UpdateProductDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    base_price?: number;

    @IsOptional()
    @IsBoolean()
    active?: boolean;
}