import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Warehouse } from '../../entities/warehouse.entity';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(Warehouse)
    private warehouseRepository: Repository<Warehouse>,
  ) {}

  async findAllWarehouses(): Promise<Warehouse[]> {
    return this.warehouseRepository.find({
      where: { isDeleted: false } as FindOptionsWhere<Warehouse>,
      relations: ['inventoryItems'],
    });
  }

  async findById(id: number): Promise<Warehouse | null> {
    return this.warehouseRepository.findOne({
      where: { id, isDeleted: false } as FindOptionsWhere<Warehouse>,
      relations: ['inventoryItems'],
    });
  }

  async findByCode(code: string): Promise<Warehouse | null> {
    return this.warehouseRepository.findOne({
      where: { code, isDeleted: false } as FindOptionsWhere<Warehouse>,
    });
  }

  async create(warehouseData: Partial<Warehouse>): Promise<Warehouse> {
    const warehouse = this.warehouseRepository.create(warehouseData);
    return this.warehouseRepository.save(warehouse);
  }

  async update(
    id: number,
    warehouseData: Partial<Warehouse>,
  ): Promise<Warehouse | null> {
    await this.warehouseRepository.update(id, warehouseData);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.warehouseRepository.update(id, { isDeleted: true });
  }

  async getActiveWarehouses(): Promise<Warehouse[]> {
    return this.warehouseRepository.find({
      where: {
        isActive: true,
        isDeleted: false,
      } as FindOptionsWhere<Warehouse>,
    });
  }

  async getWarehouseInventorySummary(warehouseId: number): Promise<any> {
    return this.warehouseRepository
      .createQueryBuilder('warehouse')
      .leftJoinAndSelect('warehouse.inventoryItems', 'inventory')
      .leftJoinAndSelect('inventory.product', 'product')
      .where('warehouse.id = :warehouseId', { warehouseId })
      .andWhere('warehouse.isDeleted = false')
      .getOne();
  }

  // Methods for WarehouseController
  async findAll(options: {
    page?: number;
    limit?: number;
    isActive?: boolean;
  }) {
    const { page = 1, limit = 10, isActive } = options;
    const query = this.warehouseRepository
      .createQueryBuilder('warehouse')
      .where('warehouse.isDeleted = false');

    if (isActive !== undefined) {
      query.andWhere('warehouse.isActive = :isActive', { isActive });
    }

    const [warehouses, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: warehouses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const warehouse = await this.warehouseRepository.findOne({
      where: { id, isDeleted: false } as FindOptionsWhere<Warehouse>,
    });

    if (!warehouse) {
      throw new Error('Warehouse not found');
    }

    return warehouse;
  }

  async remove(id: number) {
    const warehouse = await this.findOne(id);
    warehouse.isDeleted = true;
    await this.warehouseRepository.save(warehouse);
    return { message: 'Warehouse deleted successfully' };
  }

  async getInventory(id: number) {
    return this.warehouseRepository
      .createQueryBuilder('warehouse')
      .leftJoinAndSelect('warehouse.inventoryItems', 'inventory')
      .leftJoinAndSelect('inventory.product', 'product')
      .where('warehouse.id = :id', { id })
      .andWhere('warehouse.isDeleted = false')
      .andWhere('inventory.isDeleted = false')
      .getOne();
  }

  async getLowStock(id: number, threshold: number = 10) {
    return this.warehouseRepository
      .createQueryBuilder('warehouse')
      .leftJoinAndSelect('warehouse.inventoryItems', 'inventory')
      .leftJoinAndSelect('inventory.product', 'product')
      .where('warehouse.id = :id', { id })
      .andWhere('warehouse.isDeleted = false')
      .andWhere('inventory.isDeleted = false')
      .andWhere('inventory.quantity <= :threshold', { threshold })
      .getOne();
  }
}
