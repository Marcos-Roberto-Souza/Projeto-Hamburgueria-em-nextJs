import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Body,
    UseInterceptors,
    UploadedFile,
    ParseIntPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    // ✅ CREATE
    @Post()
    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: './uploads/products',
                filename: editFileName,
            }),
        }),
    )
    create(
        @Body() dto: CreateProductDto,
        @UploadedFile() file?: Express.Multer.File,
    ) {
        return this.productsService.create(dto, file);
    }

    // ✅ READ
    @Get()
    findAll() {
        return this.productsService.findAll();
    }

    // ✅ UPDATE (CORRETO – NÃO CRIA NOVO ID)
    @Patch(':id')
    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: './uploads/products',
                filename: editFileName,
            }),
        }),
    )
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateProductDto,
        @UploadedFile() file?: Express.Multer.File,
    ) {
        return this.productsService.update(id, dto, file);
    }
    
    // ❌ opcional – delete físico (não recomendado)
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.productsService.remove(id);
    }
}

// ✅ Função de nome do arquivo
function editFileName(
    req: any,
    file: Express.Multer.File,
    callback: Function,
) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname);
    callback(null, `product-${uniqueSuffix}${ext}`);
}
