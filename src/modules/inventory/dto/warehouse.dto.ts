import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsBoolean,
} from 'class-validator';

export class CreateWarehouseDto {
  @ApiProperty({
    description: 'Warehouse name',
    example: 'Main Warehouse',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Warehouse code',
    example: 'WH001',
    minLength: 2,
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(20)
  code: string;

  @ApiProperty({
    description: 'Warehouse location/address',
    example: 'Hà Nội, Việt Nam',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  location?: string;

  @ApiProperty({
    description: 'Warehouse description',
    example: 'Central warehouse for distribution',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({
    description: 'Is warehouse active',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateWarehouseDto {
  @ApiProperty({
    description: 'Warehouse name',
    example: 'Main Warehouse',
    minLength: 2,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @ApiProperty({
    description: 'Warehouse code',
    example: 'WH001',
    minLength: 2,
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(20)
  code?: string;

  @ApiProperty({
    description: 'Warehouse location/address',
    example: 'Hà Nội, Việt Nam',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  location?: string;

  @ApiProperty({
    description: 'Warehouse description',
    example: 'Central warehouse for distribution',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({
    description: 'Is warehouse active',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class WarehouseResponseDto {
  @ApiProperty({
    description: 'Warehouse ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Warehouse name',
    example: 'Main Warehouse',
  })
  name: string;

  @ApiProperty({
    description: 'Warehouse code',
    example: 'WH001',
  })
  code: string;

  @ApiProperty({
    description: 'Warehouse location/address',
    example: 'Hà Nội, Việt Nam',
    nullable: true,
  })
  location: string | null;

  @ApiProperty({
    description: 'Warehouse description',
    example: 'Central warehouse for distribution',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    description: 'Is warehouse active',
    example: true,
  })
  isActive: boolean;

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
