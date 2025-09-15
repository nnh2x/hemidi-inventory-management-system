import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Product } from '../../entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({
      relations: ['category'],
      where: { isDeleted: false },
    });
  }

  async findById(id: number): Promise<Product | null> {
    return this.productRepository.findOne({
      where: { id, isDeleted: false } as FindOptionsWhere<Product>,
      relations: ['category', 'inventoryItems'],
    });
  }

  async findBySku(sku: string): Promise<Product | null> {
    return this.productRepository.findOne({
      where: { sku, isDeleted: false } as FindOptionsWhere<Product>,
      relations: ['category'],
    });
  }

  async findByCategory(categoryId: number): Promise<Product[]> {
    return this.productRepository.find({
      where: { categoryId, isDeleted: false } as FindOptionsWhere<Product>,
      relations: ['category'],
    });
  }

  async create(productData: Partial<Product>): Promise<Product> {
    const product = this.productRepository.create(productData);
    return this.productRepository.save(product);
  }

  async update(
    id: number,
    productData: Partial<Product>,
  ): Promise<Product | null> {
    await this.productRepository.update(id, productData);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.productRepository.update(id, { isDeleted: true });
  }

  async searchProducts(searchTerm: string): Promise<Product[]> {
    return this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.isDeleted = false')
      .andWhere(
        '(product.name LIKE :searchTerm OR product.sku LIKE :searchTerm OR product.barcode LIKE :searchTerm)',
        { searchTerm: `%${searchTerm}%` },
      )
      .getMany();
  }

  async getLowStockProducts(): Promise<any[]> {
    return this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.inventoryItems', 'inventory')
      .leftJoinAndSelect('inventory.warehouse', 'warehouse')
      .where('product.isDeleted = false')
      .andWhere('inventory.quantity <= product.minStockLevel')
      .getMany();
  }
}
