import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ProductsService } from './services/products.service';
import { ProductQueryDto } from './dto/product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('seed')
  async seed() {
    return this.productsService.seed();
  }

  @Get()
  async findAll(@Query() query: ProductQueryDto) {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }
}
