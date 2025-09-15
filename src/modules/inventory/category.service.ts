import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Category } from '../../entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async findAllCategories(): Promise<Category[]> {
    return this.categoryRepository.find({
      where: { isDeleted: false } as FindOptionsWhere<Category>,
      relations: ['products'],
    });
  }

  async findById(id: number): Promise<Category | null> {
    return this.categoryRepository.findOne({
      where: { id, isDeleted: false } as FindOptionsWhere<Category>,
      relations: ['products'],
    });
  }

  async findByCode(code: string): Promise<Category | null> {
    return this.categoryRepository.findOne({
      where: { code, isDeleted: false } as FindOptionsWhere<Category>,
    });
  }

  async create(categoryData: Partial<Category>): Promise<Category> {
    const category = this.categoryRepository.create(categoryData);
    return this.categoryRepository.save(category);
  }

  async update(
    id: number,
    categoryData: Partial<Category>,
  ): Promise<Category | null> {
    await this.categoryRepository.update(id, categoryData);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.categoryRepository.update(id, { isDeleted: true });
  }

  async getActiveCategories(): Promise<Category[]> {
    return this.categoryRepository.find({
      where: {
        isActive: true,
        isDeleted: false,
      } as FindOptionsWhere<Category>,
    });
  }

  // Methods for CategoryController
  async findAll(options: { page?: number; limit?: number }) {
    const { page = 1, limit = 10 } = options;
    const [categories, total] = await this.categoryRepository.findAndCount({
      where: { isDeleted: false } as FindOptionsWhere<Category>,
      relations: ['products'],
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: categories,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOne({
      where: { id, isDeleted: false } as FindOptionsWhere<Category>,
      relations: ['products'],
    });

    if (!category) {
      throw new Error('Category not found');
    }

    return category;
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    category.isDeleted = true;
    await this.categoryRepository.save(category);
    return { message: 'Category deleted successfully' };
  }

  async getProducts(id: number) {
    const category = await this.categoryRepository.findOne({
      where: { id, isDeleted: false } as FindOptionsWhere<Category>,
      relations: ['products'],
    });

    if (!category) {
      throw new Error('Category not found');
    }

    return category.products || [];
  }
}
