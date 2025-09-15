import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { DailyStockCheckJob } from './jobs/daily-stock-check.job';
import typeormConfig from './config/typeorm';

// Import entities
import { Category } from './entities/category.entity';
import { Warehouse } from './entities/warehouse.entity';
import { Product } from './entities/product.entity';
import { InventoryItem } from './entities/inventory-item.entity';
import { InventoryTransaction } from './entities/inventory-transaction.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 3306,
        username: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'inventory_management',
        entities: [
          Category,
          Warehouse,
          Product,
          InventoryItem,
          InventoryTransaction,
        ],
        synchronize: false,
        autoLoadEntities: true,
        logging: true,
      }),
    }),
    TypeOrmModule.forFeature([
      Category,
      Warehouse,
      Product,
      InventoryItem,
      InventoryTransaction,
    ]),
    AuthModule,
    InventoryModule,
  ],
  controllers: [AppController],
  providers: [AppService, DailyStockCheckJob],
})
export class AppModule {}
