import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { PartialUpdateProductDto } from './dto/partial-update-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Products } from './entities/products.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private readonly productsRepo: Repository<Products>,
  ) {}

  async createProduct(dto: CreateProductDto) {
    const product = this.productsRepo.create(dto);
    const savedProduct = await this.productsRepo.save(product);

    return { message: 'Product created successfully', data: savedProduct };
  }

  async findAll() {
    const products = await this.productsRepo.find({
      order: { createdAt: 'DESC' },
    });

    return {
      message: 'All products fetched successfully',
      count: products.length,
      data: products,
    };
  }

  async findOne(id: number) {
    const product = await this.findProductById(id);

    return { message: 'Product fetched successfully', data: product };
  }

  async updateProduct(id: number, dto: PartialUpdateProductDto) {
    const product = await this.findProductById(id);
    Object.assign(product, dto);
    const updatedProduct = await this.productsRepo.save(product);

    return { message: 'Product updated successfully', data: updatedProduct };
  }

  async replaceProduct(id: number, dto: UpdateProductDto) {
    const product = await this.findProductById(id);
    Object.assign(product, dto);
    const updatedProduct = await this.productsRepo.save(product);

    return { message: 'Product replaced successfully', data: updatedProduct };
  }

  async deleteProduct(id: number) {
    await this.findProductById(id);
    await this.productsRepo.delete(id);

    return { message: 'Product deleted successfully', id: id };
  }

  async findByCategory(category: string) {
    const products = await this.productsRepo.find({
      where: { category: category },
      order: { createdAt: 'DESC' },
    });

    return {
      message: 'Products fetched by category successfully',
      count: products.length,
      data: products,
    };
  }

  async searchProducts(keyword: string) {
    const products = await this.productsRepo.find({
      where: { name: ILike(`%${keyword}%`) },
      order: { createdAt: 'DESC' },
    });

    return {
      message: 'Products searched successfully',
      count: products.length,
      data: products,
    };
  }

  async toggleProductStatus(id: number) {
    const product = await this.findProductById(id);
    product.isActive = !product.isActive;
    const updatedProduct = await this.productsRepo.save(product);

    return {
      message: 'Product status toggled successfully',
      data: updatedProduct,
    };
  }

  private async findProductById(id: number) {
    const product = await this.productsRepo.findOne({
      where: { id: id },
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return product;
  }
}
