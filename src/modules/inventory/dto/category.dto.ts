import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Category name',
    example: 'Electronics',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Category code',
    example: 'ELC',
    minLength: 2,
    maxLength: 10,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(10)
  code: string;

  @ApiProperty({
    description: 'Category description',
    example: 'Electronic devices and accessories',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}

export class UpdateCategoryDto {
  @ApiProperty({
    description: 'Category name',
    example: 'Electronics',
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
    description: 'Category code',
    example: 'ELC',
    minLength: 2,
    maxLength: 10,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(10)
  code?: string;

  @ApiProperty({
    description: 'Category description',
    example: 'Electronic devices and accessories',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}

export class CategoryResponseDto {
  @ApiProperty({
    description: 'Category ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Category name',
    example: 'Electronics',
  })
  name: string;

  @ApiProperty({
    description: 'Category code',
    example: 'ELC',
  })
  code: string;

  @ApiProperty({
    description: 'Category description',
    example: 'Electronic devices and accessories',
    nullable: true,
  })
  description: string | null;

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
