import { Entity, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from './base.entity';
import { Product } from './product.entity';

@Entity('categories')
export class Category extends BaseEntity {
  @ApiProperty({
    description: 'Category name',
    example: 'Electronics',
  })
  @Column({
    name: 'name',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  name: string;

  @ApiProperty({
    description: 'Category description',
    example: 'Electronic products and devices',
  })
  @Column({
    name: 'description',
    type: 'text',
    nullable: true,
  })
  description: string;

  @ApiProperty({
    description: 'Category code for identification',
    example: 'ELC',
  })
  @Column({
    name: 'code',
    type: 'varchar',
    length: 10,
    unique: true,
    nullable: false,
  })
  code: string;

  @ApiProperty({
    description: 'Category status',
    example: true,
  })
  @Column({
    name: 'is_active',
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
