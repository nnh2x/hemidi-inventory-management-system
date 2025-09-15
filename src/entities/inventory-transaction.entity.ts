import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from './base.entity';
import { InventoryItem } from './inventory-item.entity';

export enum TransactionType {
  IN = 'IN',
  OUT = 'OUT',
  ADJUSTMENT = 'ADJUSTMENT',
  TRANSFER = 'TRANSFER',
}

@Entity('inventory_transactions')
export class InventoryTransaction extends BaseEntity {
  @ApiProperty({
    description: 'Transaction type',
    enum: TransactionType,
    example: TransactionType.IN,
  })
  @Column({
    name: 'type',
    type: 'enum',
    enum: TransactionType,
    nullable: false,
  })
  type: TransactionType;

  @ApiProperty({
    description: 'Quantity changed (positive for IN, negative for OUT)',
    example: 50,
  })
  @Column({
    name: 'quantity',
    type: 'int',
    nullable: false,
  })
  quantity: number;

  @ApiProperty({
    description: 'Quantity before transaction',
    example: 100,
  })
  @Column({
    name: 'quantity_before',
    type: 'int',
    nullable: false,
  })
  quantityBefore: number;

  @ApiProperty({
    description: 'Quantity after transaction',
    example: 150,
  })
  @Column({
    name: 'quantity_after',
    type: 'int',
    nullable: false,
  })
  quantityAfter: number;

  @ApiProperty({
    description: 'Transaction reference (order number, transfer ID, etc.)',
    example: 'PO-2023-001',
  })
  @Column({
    name: 'reference',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  reference: string;

  @ApiProperty({
    description: 'Transaction notes',
    example: 'Received from supplier ABC',
  })
  @Column({
    name: 'notes',
    type: 'text',
    nullable: true,
  })
  notes: string;

  @ApiProperty({
    description: 'User who performed the transaction',
    example: 1,
  })
  @Column({
    name: 'user_id',
    type: 'int',
    nullable: true,
  })
  userId: number;

  @ApiProperty({
    description: 'Transaction date',
    example: '2023-01-15T14:30:00.000Z',
  })
  @Column({
    name: 'transaction_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  transactionDate: Date;

  @ApiProperty({
    description: 'Inventory Item ID',
    example: 1,
  })
  @Column({
    name: 'inventory_item_id',
    type: 'int',
    nullable: false,
  })
  inventoryItemId: number;

  @ManyToOne(() => InventoryItem, (inventoryItem) => inventoryItem.transactions)
  @JoinColumn({ name: 'inventory_item_id' })
  inventoryItem: InventoryItem;
}
