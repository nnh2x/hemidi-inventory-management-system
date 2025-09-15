import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { InventoryItem } from '../../entities/inventory-item.entity';
import {
  InventoryTransaction,
  TransactionType,
} from '../../entities/inventory-transaction.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(InventoryItem)
    private inventoryRepository: Repository<InventoryItem>,
    @InjectRepository(InventoryTransaction)
    private transactionRepository: Repository<InventoryTransaction>,
  ) {}

  async getInventoryByWarehouse(warehouseId: number): Promise<InventoryItem[]> {
    return this.inventoryRepository.find({
      where: {
        warehouseId,
        isDeleted: false,
      } as FindOptionsWhere<InventoryItem>,
      relations: ['product', 'warehouse'],
    });
  }

  async getInventoryByProduct(productId: number): Promise<InventoryItem[]> {
    return this.inventoryRepository.find({
      where: { productId, isDeleted: false } as FindOptionsWhere<InventoryItem>,
      relations: ['product', 'warehouse'],
    });
  }

  async getInventoryItem(
    productId: number,
    warehouseId: number,
  ): Promise<InventoryItem | null> {
    return this.inventoryRepository.findOne({
      where: {
        productId,
        warehouseId,
        isDeleted: false,
      } as FindOptionsWhere<InventoryItem>,
      relations: ['product', 'warehouse'],
    });
  }

  async getTotalStock(productId: number): Promise<number> {
    const result = await this.inventoryRepository
      .createQueryBuilder('inventory')
      .select('SUM(inventory.quantity)', 'total')
      .where('inventory.productId = :productId', { productId })
      .andWhere('inventory.isDeleted = false')
      .getRawOne();

    return result?.total || 0;
  }

  async getAvailableStock(productId: number): Promise<number> {
    const result = await this.inventoryRepository
      .createQueryBuilder('inventory')
      .select(
        'SUM(inventory.quantity - inventory.reservedQuantity)',
        'available',
      )
      .where('inventory.productId = :productId', { productId })
      .andWhere('inventory.isDeleted = false')
      .getRawOne();

    return result?.available || 0;
  }

  async adjustStock(
    productId: number,
    warehouseId: number,
    quantity: number,
    type: TransactionType,
    reference?: string,
    notes?: string,
    userId?: number,
  ): Promise<InventoryItem> {
    let inventoryItem = await this.getInventoryItem(productId, warehouseId);

    if (!inventoryItem) {
      // Create new inventory item if it doesn't exist
      inventoryItem = this.inventoryRepository.create({
        productId,
        warehouseId,
        quantity: 0,
        reservedQuantity: 0,
      });
      inventoryItem = await this.inventoryRepository.save(inventoryItem);
    }

    const quantityBefore = inventoryItem.quantity;
    let quantityAfter: number;

    switch (type) {
      case TransactionType.IN:
        quantityAfter = quantityBefore + quantity;
        break;
      case TransactionType.OUT:
        quantityAfter = quantityBefore - quantity;
        break;
      case TransactionType.ADJUSTMENT:
        quantityAfter = quantity; // Direct set
        quantity = quantity - quantityBefore; // Calculate difference
        break;
      default:
        throw new Error(`Unsupported transaction type: ${type}`);
    }

    if (quantityAfter < 0) {
      throw new Error('Insufficient stock');
    }

    // Update inventory quantity
    inventoryItem.quantity = quantityAfter;
    await this.inventoryRepository.save(inventoryItem);

    // Create transaction record
    const transaction = this.transactionRepository.create({
      type,
      quantity,
      quantityBefore,
      quantityAfter,
      reference: reference || `AUTO-${Date.now()}`,
      notes,
      userId,
      inventoryItemId: inventoryItem.id,
    });

    await this.transactionRepository.save(transaction);

    return inventoryItem;
  }

  async reserveStock(
    productId: number,
    warehouseId: number,
    quantity: number,
  ): Promise<InventoryItem> {
    const inventoryItem = await this.getInventoryItem(productId, warehouseId);

    if (!inventoryItem) {
      throw new Error('Inventory item not found');
    }

    if (inventoryItem.availableQuantity < quantity) {
      throw new Error('Insufficient available stock');
    }

    inventoryItem.reservedQuantity += quantity;
    return this.inventoryRepository.save(inventoryItem);
  }

  async releaseReservedStock(
    productId: number,
    warehouseId: number,
    quantity: number,
  ): Promise<InventoryItem> {
    const inventoryItem = await this.getInventoryItem(productId, warehouseId);

    if (!inventoryItem) {
      throw new Error('Inventory item not found');
    }

    if (inventoryItem.reservedQuantity < quantity) {
      throw new Error('Insufficient reserved stock to release');
    }

    inventoryItem.reservedQuantity -= quantity;
    return this.inventoryRepository.save(inventoryItem);
  }

  async getTransactionHistory(
    inventoryItemId?: number,
    productId?: number,
    warehouseId?: number,
    limit: number = 50,
  ): Promise<InventoryTransaction[]> {
    const query = this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.inventoryItem', 'inventory')
      .leftJoinAndSelect('inventory.product', 'product')
      .leftJoinAndSelect('inventory.warehouse', 'warehouse')
      .orderBy('transaction.transactionDate', 'DESC')
      .limit(limit);

    if (inventoryItemId) {
      query.where('transaction.inventoryItemId = :inventoryItemId', {
        inventoryItemId,
      });
    }

    if (productId) {
      query.andWhere('inventory.productId = :productId', { productId });
    }

    if (warehouseId) {
      query.andWhere('inventory.warehouseId = :warehouseId', { warehouseId });
    }

    return query.getMany();
  }

  async getLowStockReport(): Promise<any[]> {
    return this.inventoryRepository
      .createQueryBuilder('inventory')
      .leftJoinAndSelect('inventory.product', 'product')
      .leftJoinAndSelect('inventory.warehouse', 'warehouse')
      .where('inventory.isDeleted = false')
      .andWhere('product.isDeleted = false')
      .andWhere('inventory.quantity <= product.minStockLevel')
      .getMany();
  }

  // Methods for Inventory Controller
  async findAllItems(options: {
    page?: number;
    limit?: number;
    warehouseId?: number;
    productId?: number;
  }) {
    const { page = 1, limit = 10, warehouseId, productId } = options;
    const query = this.inventoryRepository
      .createQueryBuilder('inventory')
      .leftJoinAndSelect('inventory.product', 'product')
      .leftJoinAndSelect('inventory.warehouse', 'warehouse')
      .where('inventory.isDeleted = false');

    if (warehouseId) {
      query.andWhere('inventory.warehouseId = :warehouseId', { warehouseId });
    }

    if (productId) {
      query.andWhere('inventory.productId = :productId', { productId });
    }

    const [items, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOneItem(id: number) {
    const item = await this.inventoryRepository.findOne({
      where: { id, isDeleted: false } as FindOptionsWhere<InventoryItem>,
      relations: ['product', 'warehouse'],
    });

    if (!item) {
      throw new Error('Inventory item not found');
    }

    return item;
  }

  async createItem(data: any) {
    const existingItem = await this.getInventoryItem(
      data.productId,
      data.warehouseId,
    );

    if (existingItem) {
      throw new Error(
        'Inventory item already exists for this product and warehouse',
      );
    }

    const item = this.inventoryRepository.create(data);
    return this.inventoryRepository.save(item);
  }

  async updateItem(id: number, data: any) {
    const item = await this.findOneItem(id);
    Object.assign(item, data);
    return this.inventoryRepository.save(item);
  }

  async removeItem(id: number) {
    const item = await this.findOneItem(id);
    item.isDeleted = true;
    await this.inventoryRepository.save(item);
    return { message: 'Inventory item deleted successfully' };
  }

  async findAllTransactions(options: {
    page?: number;
    limit?: number;
    warehouseId?: number;
    productId?: number;
    type?: string;
  }) {
    const { page = 1, limit = 10, warehouseId, productId, type } = options;
    const query = this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.inventoryItem', 'inventory')
      .leftJoinAndSelect('inventory.product', 'product')
      .leftJoinAndSelect('inventory.warehouse', 'warehouse')
      .orderBy('transaction.transactionDate', 'DESC');

    if (warehouseId) {
      query.andWhere('inventory.warehouseId = :warehouseId', { warehouseId });
    }

    if (productId) {
      query.andWhere('inventory.productId = :productId', { productId });
    }

    if (type) {
      query.andWhere('transaction.type = :type', { type });
    }

    const [transactions, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOneTransaction(id: number) {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: [
        'inventoryItem',
        'inventoryItem.product',
        'inventoryItem.warehouse',
      ],
    });

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    return transaction;
  }

  async createTransaction(data: any) {
    const { productId, warehouseId, type, quantity, reference, notes } = data;

    return this.adjustStock(
      productId,
      warehouseId,
      quantity,
      type as TransactionType,
      reference,
      notes,
    );
  }

  async getLowStockItems(threshold: number = 10, warehouseId?: number) {
    const query = this.inventoryRepository
      .createQueryBuilder('inventory')
      .leftJoinAndSelect('inventory.product', 'product')
      .leftJoinAndSelect('inventory.warehouse', 'warehouse')
      .where('inventory.isDeleted = false')
      .andWhere('inventory.quantity <= :threshold', { threshold });

    if (warehouseId) {
      query.andWhere('inventory.warehouseId = :warehouseId', { warehouseId });
    }

    return query.getMany();
  }

  async getStockLevels(warehouseId?: number) {
    const query = this.inventoryRepository
      .createQueryBuilder('inventory')
      .leftJoinAndSelect('inventory.product', 'product')
      .leftJoinAndSelect('inventory.warehouse', 'warehouse')
      .where('inventory.isDeleted = false');

    if (warehouseId) {
      query.andWhere('inventory.warehouseId = :warehouseId', { warehouseId });
    }

    const items = await query.getMany();

    const summary = {
      totalItems: items.length,
      totalStock: items.reduce((sum, item) => sum + item.quantity, 0),
      totalValue: items.reduce(
        (sum, item) => sum + item.quantity * (item.product?.price || 0),
        0,
      ),
      lowStock: items.filter((item) => item.quantity <= 10).length,
    };

    return {
      summary,
      items,
    };
  }

  async getMovementReport(options: {
    startDate?: string;
    endDate?: string;
    warehouseId?: number;
  }) {
    const { startDate, endDate, warehouseId } = options;
    const query = this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.inventoryItem', 'inventory')
      .leftJoinAndSelect('inventory.product', 'product')
      .leftJoinAndSelect('inventory.warehouse', 'warehouse')
      .orderBy('transaction.transactionDate', 'DESC');

    if (startDate) {
      query.andWhere('transaction.transactionDate >= :startDate', {
        startDate,
      });
    }

    if (endDate) {
      query.andWhere('transaction.transactionDate <= :endDate', { endDate });
    }

    if (warehouseId) {
      query.andWhere('inventory.warehouseId = :warehouseId', { warehouseId });
    }

    const transactions = await query.getMany();

    const summary = {
      totalTransactions: transactions.length,
      inbound: transactions.filter((t) => t.type === TransactionType.IN).length,
      outbound: transactions.filter((t) => t.type === TransactionType.OUT)
        .length,
      adjustments: transactions.filter(
        (t) => t.type === TransactionType.ADJUSTMENT,
      ).length,
    };

    return {
      summary,
      transactions,
    };
  }
}
