import { Entity, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from './base.entity';
import { InventoryItem } from './inventory-item.entity';

@Entity('warehouses')
export class Warehouse extends BaseEntity {
  @ApiProperty({
    description: 'Warehouse name',
    example: 'Main Warehouse',
  })
  @Column({
    name: 'name',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  name: string;

  @ApiProperty({
    description: 'Warehouse code',
    example: 'WH001',
  })
  @Column({
    name: 'code',
    type: 'varchar',
    length: 20,
    unique: true,
    nullable: false,
  })
  code: string;

  @ApiProperty({
    description: 'Warehouse address',
    example: '123 Main Street, City, Country',
  })
  @Column({
    name: 'address',
    type: 'text',
    nullable: true,
  })
  address: string;

  @ApiProperty({
    description: 'Contact phone number',
    example: '+1234567890',
  })
  @Column({
    name: 'phone',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  phone: string;

  @ApiProperty({
    description: 'Contact email',
    example: 'warehouse@company.com',
  })
  @Column({
    name: 'email',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  email: string;

  @ApiProperty({
    description: 'Warehouse manager name',
    example: 'John Doe',
  })
  @Column({
    name: 'manager_name',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  managerName: string;

  @ApiProperty({
    description: 'Warehouse status',
    example: true,
  })
  @Column({
    name: 'is_active',
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @OneToMany(() => InventoryItem, (inventoryItem) => inventoryItem.warehouse)
  inventoryItems: InventoryItem[];
}
