import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { PartialUpdateProductDto } from './dto/partial-update-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsService.createProduct(createProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get('search')
  searchProducts(@Query('keyword') keyword: string) {
    return this.productsService.searchProducts(keyword);
  }

  @Get('category/:cat')
  findByCategory(@Param('cat') category: string) {
    return this.productsService.findByCategory(category);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() partialUpdateProductDto: PartialUpdateProductDto,
  ) {
    return this.productsService.updateProduct(id, partialUpdateProductDto);
  }

  @Put(':id')
  replaceProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.replaceProduct(id, updateProductDto);
  }

  @Delete(':id')
  deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.deleteProduct(id);
  }

  @Patch(':id/toggle')
  toggleProductStatus(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.toggleProductStatus(id);
  }
}
