import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ProductService } from '../product.service';
import { Product } from '../../../entities/product.entity';
import {
  ProductResponseDto,
  CreateProductDto,
  UpdateProductDto,
} from '../dto/product.dto';

@ApiTags('Products')
@ApiBearerAuth('JWT-auth')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all products',
    description: 'Retrieve all products with optional filtering and pagination',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    description: 'Filter by category ID',
    type: Number,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search products by name, SKU, or barcode',
    type: String,
  })
  @ApiQuery({
    name: 'active',
    required: false,
    description: 'Filter by active status',
    type: Boolean,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved products',
    type: [ProductResponseDto],
  })
  async findAll(
    @Query('category') categoryId?: number,
    @Query('search') search?: string,
    @Query('active') active?: boolean,
  ): Promise<Product[]> {
    if (search) {
      return this.productService.searchProducts(search);
    }

    if (categoryId) {
      return this.productService.findByCategory(categoryId);
    }

    return this.productService.findAll();
  }

  @Get('low-stock')
  @ApiOperation({
    summary: 'Get products with low stock',
    description: 'Retrieve products that are below minimum stock level',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved low stock products',
    type: [ProductResponseDto],
  })
  async getLowStockProducts(): Promise<any[]> {
    return this.productService.getLowStockProducts();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get product by ID',
    description: 'Retrieve a single product by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Product ID',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved product',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    const product = await this.productService.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  @Get('sku/:sku')
  @ApiOperation({
    summary: 'Get product by SKU',
    description: 'Retrieve a single product by its SKU code',
  })
  @ApiParam({
    name: 'sku',
    description: 'Product SKU',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved product',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  async findBySku(@Param('sku') sku: string): Promise<Product> {
    const product = await this.productService.findBySku(sku);
    if (!product) {
      throw new NotFoundException(`Product with SKU ${sku} not found`);
    }
    return product;
  }

  @Post()
  @ApiOperation({
    summary: 'Create new product',
    description: 'Create a new product in the system',
  })
  @ApiBody({
    type: CreateProductDto,
    description: 'Product creation data',
  })
  @ApiResponse({
    status: 201,
    description: 'Product successfully created',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productService.create(createProductDto);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update product',
    description: 'Update an existing product',
  })
  @ApiParam({
    name: 'id',
    description: 'Product ID',
    type: Number,
  })
  @ApiBody({
    type: UpdateProductDto,
    description: 'Product update data',
  })
  @ApiResponse({
    status: 200,
    description: 'Product successfully updated',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.productService.update(id, updateProductDto);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete product',
    description: 'Soft delete a product (mark as deleted)',
  })
  @ApiParam({
    name: 'id',
    description: 'Product ID',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Product successfully deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  async delete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    const product = await this.productService.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    await this.productService.delete(id);
    return { message: `Product with ID ${id} successfully deleted` };
  }
}
