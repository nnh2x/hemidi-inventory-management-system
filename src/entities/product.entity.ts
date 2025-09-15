import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from './base.entity';
import { Category } from './category.entity';
import { InventoryItem } from './inventory-item.entity';

@Entity('products')
export class Product extends BaseEntity {
  @ApiProperty({
    description: 'Product name',
    example: 'iPhone 14 Pro',
  })
  @Column({
    name: 'name',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name: string;

  @ApiProperty({
    description: 'Product description',
    example: 'Latest iPhone with advanced camera system',
  })
  @Column({
    name: 'description',
    type: 'text',
    nullable: true,
  })
  description: string;

  @ApiProperty({
    description: 'Product SKU',
    example: 'IPH14PRO128GB',
  })
  @Column({
    name: 'sku',
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: false,
  })
  sku: string;

  @ApiProperty({
    description: 'Product barcode',
    example: '1234567890123',
  })
  @Column({
    name: 'barcode',
    type: 'varchar',
    length: 50,
    nullable: true,
    unique: true,
  })
  barcode: string;

  @ApiProperty({
    description: 'Product price',
    example: 999.99,
  })
  @Column({
    name: 'price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  price: number;

  @ApiProperty({
    description: 'Product cost price',
    example: 750,
  })
  @Column({
    name: 'cost_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  costPrice: number;

  @ApiProperty({
    description: 'Product unit (piece, kg, liter, etc.)',
    example: 'piece',
  })
  @Column({
    name: 'unit',
    type: 'varchar',
    length: 20,
    default: 'piece',
  })
  unit: string;

  @ApiProperty({
    description: 'Minimum stock level',
    example: 10,
  })
  @Column({
    name: 'min_stock_level',
    type: 'int',
    default: 0,
  })
  minStockLevel: number;

  @ApiProperty({
    description: 'Maximum stock level',
    example: 1000,
  })
  @Column({
    name: 'max_stock_level',
    type: 'int',
    nullable: true,
  })
  maxStockLevel: number;

  @ApiProperty({
    description: 'Product status',
    example: true,
  })
  @Column({
    name: 'is_active',
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Category ID',
    example: 1,
  })
  @Column({
    name: 'category_id',
    type: 'int',
    nullable: false,
  })
  categoryId: number;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany(() => InventoryItem, (inventoryItem) => inventoryItem.product)
  inventoryItems: InventoryItem[];
}
