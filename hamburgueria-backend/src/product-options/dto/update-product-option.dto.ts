import { IsOptional, IsNumber, Min, IsBoolean } from 'class-validator';

export class UpdateProductOptionDto {
    @IsOptional()
    name?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    additional_price?: number;

    @IsOptional()
    @IsBoolean()
    active?: boolean;
}
