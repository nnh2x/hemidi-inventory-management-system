import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from './base.entity';
import { Product } from './product.entity';
import { Warehouse } from './warehouse.entity';
import { InventoryTransaction } from './inventory-transaction.entity';

@Entity('inventory_items')
@Index(['productId', 'warehouseId'], { unique: true })
export class InventoryItem extends BaseEntity {
  @ApiProperty({
    description: 'Current quantity in stock',
    example: 150,
  })
  @Column({
    name: 'quantity',
    type: 'int',
    default: 0,
  })
  quantity: number;

  @ApiProperty({
    description: 'Reserved quantity (for pending orders)',
    example: 25,
  })
  @Column({
    name: 'reserved_quantity',
    type: 'int',
    default: 0,
  })
  reservedQuantity: number;

  @ApiProperty({
    description: 'Available quantity (quantity - reserved)',
    example: 125,
  })
  get availableQuantity(): number {
    return this.quantity - this.reservedQuantity;
  }

  @ApiProperty({
    description: 'Last stock check date',
    example: '2023-01-15T10:30:00.000Z',
  })
  @Column({
    name: 'last_stock_check',
    type: 'timestamp',
    nullable: true,
  })
  lastStockCheck: Date;

  @ApiProperty({
    description: 'Location within warehouse',
    example: 'A-1-B-5',
  })
  @Column({
    name: 'location',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  location: string;

  @ApiProperty({
    description: 'Product ID',
    example: 1,
  })
  @Column({
    name: 'product_id',
    type: 'int',
    nullable: false,
  })
  productId: number;

  @ApiProperty({
    description: 'Warehouse ID',
    example: 1,
  })
  @Column({
    name: 'warehouse_id',
    type: 'int',
    nullable: false,
  })
  warehouseId: number;

  @ManyToOne(() => Product, (product) => product.inventoryItems)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.inventoryItems)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @OneToMany(
    () => InventoryTransaction,
    (transaction) => transaction.inventoryItem,
  )
  transactions: InventoryTransaction[];
}
