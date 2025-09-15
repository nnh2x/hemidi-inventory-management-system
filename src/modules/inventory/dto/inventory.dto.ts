import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsString,
  IsOptional,
  IsNotEmpty,
  IsPositive,
  IsIn,
  Min,
} from 'class-validator';

export class CreateInventoryItemDto {
  @ApiProperty({
    description: 'Product ID',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  productId: number;

  @ApiProperty({
    description: 'Warehouse ID',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  warehouseId: number;

  @ApiProperty({
    description: 'Current quantity in stock',
    example: 100,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  quantity: number;

  @ApiProperty({
    description: 'Minimum stock level for alerts',
    example: 10,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minQuantity?: number;

  @ApiProperty({
    description: 'Maximum stock level',
    example: 1000,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxQuantity?: number;

  @ApiProperty({
    description: 'Reserved quantity (orders, etc.)',
    example: 5,
    minimum: 0,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  reservedQuantity?: number;
}

export class UpdateInventoryItemDto {
  @ApiProperty({
    description: 'Current quantity in stock',
    example: 100,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  quantity?: number;

  @ApiProperty({
    description: 'Minimum stock level for alerts',
    example: 10,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minQuantity?: number;

  @ApiProperty({
    description: 'Maximum stock level',
    example: 1000,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxQuantity?: number;

  @ApiProperty({
    description: 'Reserved quantity (orders, etc.)',
    example: 5,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  reservedQuantity?: number;
}

export class CreateInventoryTransactionDto {
  @ApiProperty({
    description: 'Product ID',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  productId: number;

  @ApiProperty({
    description: 'Warehouse ID',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  warehouseId: number;

  @ApiProperty({
    description: 'Transaction type',
    example: 'IN',
    enum: ['IN', 'OUT', 'ADJUSTMENT'],
  })
  @IsString()
  @IsIn(['IN', 'OUT', 'ADJUSTMENT'])
  type: 'IN' | 'OUT' | 'ADJUSTMENT';

  @ApiProperty({
    description: 'Quantity change (positive or negative)',
    example: 50,
  })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({
    description: 'Reference document number',
    example: 'PO-2024-001',
  })
  @IsOptional()
  @IsString()
  reference?: string;

  @ApiProperty({
    description: 'Transaction notes',
    example: 'Purchase order received',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class InventoryItemResponseDto {
  @ApiProperty({
    description: 'Inventory item ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Current quantity in stock',
    example: 100,
  })
  quantity: number;

  @ApiProperty({
    description: 'Minimum stock level for alerts',
    example: 10,
    nullable: true,
  })
  minQuantity: number | null;

  @ApiProperty({
    description: 'Maximum stock level',
    example: 1000,
    nullable: true,
  })
  maxQuantity: number | null;

  @ApiProperty({
    description: 'Reserved quantity (orders, etc.)',
    example: 5,
  })
  reservedQuantity: number;

  @ApiProperty({
    description: 'Available quantity (quantity - reserved)',
    example: 95,
  })
  availableQuantity: number;

  @ApiProperty({
    description: 'Product information',
    type: 'object',
    properties: {
      id: { type: 'number', example: 1 },
      name: { type: 'string', example: 'iPhone 15 Pro' },
      sku: { type: 'string', example: 'IP15P-256-BL' },
    },
  })
  product: {
    id: number;
    name: string;
    sku: string;
  };

  @ApiProperty({
    description: 'Warehouse information',
    type: 'object',
    properties: {
      id: { type: 'number', example: 1 },
      name: { type: 'string', example: 'Main Warehouse' },
      code: { type: 'string', example: 'WH001' },
    },
  })
  warehouse: {
    id: number;
    name: string;
    code: string;
  };

  @ApiProperty({
    description: 'Creation date',
    example: '2023-01-01T00:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date',
    example: '2023-01-01T00:00:00Z',
  })
  updatedAt: Date;
}

export class InventoryTransactionResponseDto {
  @ApiProperty({
    description: 'Transaction ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Transaction type',
    example: 'IN',
  })
  type: string;

  @ApiProperty({
    description: 'Quantity change',
    example: 50,
  })
  quantity: number;

  @ApiProperty({
    description: 'Quantity before transaction',
    example: 50,
  })
  quantityBefore: number;

  @ApiProperty({
    description: 'Quantity after transaction',
    example: 100,
  })
  quantityAfter: number;

  @ApiProperty({
    description: 'Reference document number',
    example: 'PO-2024-001',
    nullable: true,
  })
  reference: string | null;

  @ApiProperty({
    description: 'Transaction notes',
    example: 'Purchase order received',
    nullable: true,
  })
  notes: string | null;

  @ApiProperty({
    description: 'Product information',
    type: 'object',
    properties: {
      id: { type: 'number', example: 1 },
      name: { type: 'string', example: 'iPhone 15 Pro' },
      sku: { type: 'string', example: 'IP15P-256-BL' },
    },
  })
  product: {
    id: number;
    name: string;
    sku: string;
  };

  @ApiProperty({
    description: 'Warehouse information',
    type: 'object',
    properties: {
      id: { type: 'number', example: 1 },
      name: { type: 'string', example: 'Main Warehouse' },
      code: { type: 'string', example: 'WH001' },
    },
  })
  warehouse: {
    id: number;
    name: string;
    code: string;
  };

  @ApiProperty({
    description: 'Transaction date',
    example: '2023-01-01T00:00:00Z',
  })
  createdAt: Date;
}
