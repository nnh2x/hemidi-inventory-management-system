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
import {
  CreateInventoryItemDto,
  UpdateInventoryItemDto,
  CreateInventoryTransactionDto,
  InventoryItemResponseDto,
  InventoryTransactionResponseDto,
} from '../dto/inventory.dto';
import { InventoryService } from '../inventory.service';

@ApiTags('Inventory')
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  // Inventory Items Management
  @Get('items')
  @ApiOperation({ summary: 'Get all inventory items' })
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
    name: 'warehouseId',
    required: false,
    description: 'Filter by warehouse ID',
    example: 1,
  })
  @ApiQuery({
    name: 'productId',
    required: false,
    description: 'Filter by product ID',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Inventory items retrieved successfully',
    type: [InventoryItemResponseDto],
  })
  async findAllItems(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('warehouseId') warehouseId?: number,
    @Query('productId') productId?: number,
  ) {
    return this.inventoryService.findAllItems({
      page,
      limit,
      warehouseId,
      productId,
    });
  }

  @Get('items/:id')
  @ApiOperation({ summary: 'Get inventory item by ID' })
  @ApiParam({ name: 'id', description: 'Inventory item ID', example: 1 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Inventory item retrieved successfully',
    type: InventoryItemResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Inventory item not found',
  })
  async findOneItem(@Param('id') id: number) {
    return this.inventoryService.findOneItem(id);
  }

  @Post('items')
  @ApiOperation({ summary: 'Create new inventory item' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Inventory item created successfully',
    type: InventoryItemResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async createItem(@Body() createInventoryItemDto: CreateInventoryItemDto) {
    return this.inventoryService.createItem(createInventoryItemDto);
  }

  @Put('items/:id')
  @ApiOperation({ summary: 'Update inventory item' })
  @ApiParam({ name: 'id', description: 'Inventory item ID', example: 1 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Inventory item updated successfully',
    type: InventoryItemResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Inventory item not found',
  })
  async updateItem(
    @Param('id') id: number,
    @Body() updateInventoryItemDto: UpdateInventoryItemDto,
  ) {
    return this.inventoryService.updateItem(id, updateInventoryItemDto);
  }

  @Delete('items/:id')
  @ApiOperation({ summary: 'Delete inventory item' })
  @ApiParam({ name: 'id', description: 'Inventory item ID', example: 1 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Inventory item deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Inventory item not found',
  })
  async removeItem(@Param('id') id: number) {
    return this.inventoryService.removeItem(id);
  }

  // Inventory Transactions Management
  @Get('transactions')
  @ApiOperation({ summary: 'Get all inventory transactions' })
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
    name: 'warehouseId',
    required: false,
    description: 'Filter by warehouse ID',
    example: 1,
  })
  @ApiQuery({
    name: 'productId',
    required: false,
    description: 'Filter by product ID',
    example: 1,
  })
  @ApiQuery({
    name: 'type',
    required: false,
    description: 'Filter by transaction type',
    example: 'IN',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Inventory transactions retrieved successfully',
    type: [InventoryTransactionResponseDto],
  })
  async findAllTransactions(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('warehouseId') warehouseId?: number,
    @Query('productId') productId?: number,
    @Query('type') type?: string,
  ) {
    return this.inventoryService.findAllTransactions({
      page,
      limit,
      warehouseId,
      productId,
      type,
    });
  }

  @Get('transactions/:id')
  @ApiOperation({ summary: 'Get transaction by ID' })
  @ApiParam({ name: 'id', description: 'Transaction ID', example: 1 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Transaction retrieved successfully',
    type: InventoryTransactionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Transaction not found',
  })
  async findOneTransaction(@Param('id') id: number) {
    return this.inventoryService.findOneTransaction(id);
  }

  @Post('transactions')
  @ApiOperation({ summary: 'Create new inventory transaction' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Transaction created successfully',
    type: InventoryTransactionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async createTransaction(
    @Body() createTransactionDto: CreateInventoryTransactionDto,
  ) {
    return this.inventoryService.createTransaction(createTransactionDto);
  }

  // Inventory Reports
  @Get('low-stock')
  @ApiOperation({ summary: 'Get low stock items across all warehouses' })
  @ApiQuery({
    name: 'threshold',
    required: false,
    description: 'Low stock threshold',
    example: 10,
  })
  @ApiQuery({
    name: 'warehouseId',
    required: false,
    description: 'Filter by warehouse ID',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Low stock items retrieved successfully',
  })
  async getLowStockItems(
    @Query('threshold') threshold: number = 10,
    @Query('warehouseId') warehouseId?: number,
  ) {
    return this.inventoryService.getLowStockItems(threshold, warehouseId);
  }

  @Get('stock-levels')
  @ApiOperation({ summary: 'Get current stock levels summary' })
  @ApiQuery({
    name: 'warehouseId',
    required: false,
    description: 'Filter by warehouse ID',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Stock levels retrieved successfully',
  })
  async getStockLevels(@Query('warehouseId') warehouseId?: number) {
    return this.inventoryService.getStockLevels(warehouseId);
  }

  @Get('movement-report')
  @ApiOperation({ summary: 'Get inventory movement report' })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Start date (YYYY-MM-DD)',
    example: '2024-01-01',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'End date (YYYY-MM-DD)',
    example: '2024-01-31',
  })
  @ApiQuery({
    name: 'warehouseId',
    required: false,
    description: 'Filter by warehouse ID',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Movement report retrieved successfully',
  })
  async getMovementReport(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('warehouseId') warehouseId?: number,
  ) {
    return this.inventoryService.getMovementReport({
      startDate,
      endDate,
      warehouseId,
    });
  }
}
