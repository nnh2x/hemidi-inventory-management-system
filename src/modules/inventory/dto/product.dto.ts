import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsPositive,
  MinLength,
  MaxLength,
  IsInt,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'iPhone 15 Pro Max',
    minLength: 1,
    maxLength: 255,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: 'Product description',
    example: 'Latest iPhone with advanced camera system',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Product SKU (Stock Keeping Unit)',
    example: 'IPH15PM256GB',
    minLength: 1,
    maxLength: 50,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  sku: string;

  @ApiProperty({
    description: 'Product barcode',
    example: '1234567890123',
    required: false,
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  barcode?: string;

  @ApiProperty({
    description: 'Product selling price',
    example: 999.99,
    minimum: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;

  @ApiProperty({
    description: 'Product cost price',
    example: 750.0,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  costPrice?: number;

  @ApiProperty({
    description: 'Unit of measurement',
    example: 'piece',
    default: 'piece',
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  unit?: string;

  @ApiProperty({
    description: 'Minimum stock level threshold',
    example: 10,
    default: 0,
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  minStockLevel?: number;

  @ApiProperty({
    description: 'Maximum stock level threshold',
    example: 1000,
    required: false,
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  maxStockLevel?: number;

  @ApiProperty({
    description: 'Category ID',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  categoryId: number;

  @ApiProperty({
    description: 'Product active status',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiProperty({
    description: 'Product name',
    example: 'iPhone 15 Pro Max - Updated',
    required: false,
    minLength: 1,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name?: string;
}

export class ProductResponseDto {
  @ApiProperty({
    description: 'Product ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Product name',
    example: 'iPhone 15 Pro Max',
  })
  name: string;

  @ApiProperty({
    description: 'Product description',
    example: 'Latest iPhone with advanced camera system',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    description: 'Product SKU',
    example: 'IPH15PM256GB',
  })
  sku: string;

  @ApiProperty({
    description: 'Product barcode',
    example: '1234567890123',
    nullable: true,
  })
  barcode: string | null;

  @ApiProperty({
    description: 'Product price',
    example: 999.99,
  })
  price: number;

  @ApiProperty({
    description: 'Product cost price',
    example: 750.0,
    nullable: true,
  })
  costPrice: number | null;

  @ApiProperty({
    description: 'Unit of measurement',
    example: 'piece',
  })
  unit: string;

  @ApiProperty({
    description: 'Minimum stock level',
    example: 10,
  })
  minStockLevel: number;

  @ApiProperty({
    description: 'Maximum stock level',
    example: 1000,
    nullable: true,
  })
  maxStockLevel: number | null;

  @ApiProperty({
    description: 'Category ID',
    example: 1,
  })
  categoryId: number;

  @ApiProperty({
    description: 'Product active status',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2023-01-01T00:00:00.000Z',
    nullable: true,
  })
  updatedAt: Date | null;

  @ApiProperty({
    description: 'Product category information',
    type: 'object',
    properties: {
      id: { type: 'number', example: 1 },
      name: { type: 'string', example: 'Electronics' },
      code: { type: 'string', example: 'ELC' },
    },
  })
  category?: {
    id: number;
    name: string;
    code: string;
  };
}
