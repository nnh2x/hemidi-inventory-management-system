import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../../entities/product.entity';
import { Category } from '../../entities/category.entity';
import { Warehouse } from '../../entities/warehouse.entity';
import { InventoryItem } from '../../entities/inventory-item.entity';
import { InventoryTransaction } from '../../entities/inventory-transaction.entity';
import { ProductService } from './product.service';
import { InventoryService } from './inventory.service';
import { CategoryService } from './category.service';
import { WarehouseService } from './warehouse.service';
import { ProductController } from './controllers/product.controller';
import { CategoryController } from './controllers/category.controller';
import { WarehouseController } from './controllers/warehouse.controller';
import { InventoryController } from './controllers/inventory.controller';
import { JobController } from './controllers/job.controller';
import { DailyStockCheckJob } from '../../jobs/daily-stock-check.job';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Category,
      Warehouse,
      InventoryItem,
      InventoryTransaction,
    ]),
  ],
  controllers: [
    ProductController,
    CategoryController,
    WarehouseController,
    InventoryController,
    JobController,
  ],
  providers: [
    ProductService,
    InventoryService,
    CategoryService,
    WarehouseService,
    DailyStockCheckJob,
  ],
  exports: [
    ProductService,
    InventoryService,
    CategoryService,
    WarehouseService,
  ],
})
export class InventoryModule {}
