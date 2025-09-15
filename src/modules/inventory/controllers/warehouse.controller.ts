import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
// import { WarehouseService } from '../services/warehouse.service';
import {
  CreateWarehouseDto,
  UpdateWarehouseDto,
  WarehouseResponseDto,
} from '../dto/warehouse.dto';
import { WarehouseService } from '../warehouse.service';

@ApiTags('Warehouses')
@Controller('warehouses')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Get()
  @ApiOperation({ summary: 'Get all warehouses' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Items per page',
    example: 10,
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
    description: 'Filter by active status',
    example: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Warehouses retrieved successfully',
    type: [WarehouseResponseDto],
  })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('isActive') isActive?: boolean,
  ) {
    return this.warehouseService.findAll({ page, limit, isActive });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get warehouse by ID' })
  @ApiParam({ name: 'id', description: 'Warehouse ID', example: 1 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Warehouse retrieved successfully',
    type: WarehouseResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Warehouse not found',
  })
  async findOne(@Param('id') id: number) {
    return this.warehouseService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new warehouse' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Warehouse created successfully',
    type: WarehouseResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async create(@Body() createWarehouseDto: CreateWarehouseDto) {
    return this.warehouseService.create(createWarehouseDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update warehouse' })
  @ApiParam({ name: 'id', description: 'Warehouse ID', example: 1 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Warehouse updated successfully',
    type: WarehouseResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Warehouse not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async update(
    @Param('id') id: number,
    @Body() updateWarehouseDto: UpdateWarehouseDto,
  ) {
    return this.warehouseService.update(id, updateWarehouseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete warehouse' })
  @ApiParam({ name: 'id', description: 'Warehouse ID', example: 1 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Warehouse deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Warehouse not found',
  })
  async remove(@Param('id') id: number) {
    return this.warehouseService.remove(id);
  }

  @Get(':id/inventory')
  @ApiOperation({ summary: 'Get warehouse inventory items' })
  @ApiParam({ name: 'id', description: 'Warehouse ID', example: 1 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Inventory items retrieved successfully',
  })
  async getInventory(@Param('id') id: number) {
    return this.warehouseService.getInventory(id);
  }

  @Get(':id/low-stock')
  @ApiOperation({ summary: 'Get low stock items in warehouse' })
  @ApiParam({ name: 'id', description: 'Warehouse ID', example: 1 })
  @ApiQuery({
    name: 'threshold',
    required: false,
    description: 'Low stock threshold',
    example: 10,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Low stock items retrieved successfully',
  })
  async getLowStock(
    @Param('id') id: number,
    @Query('threshold') threshold: number = 10,
  ) {
    return this.warehouseService.getLowStock(id, threshold);
  }
}
