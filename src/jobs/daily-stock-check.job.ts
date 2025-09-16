import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryItem } from '../entities/inventory-item.entity';

interface StockCheckResult {
  totalProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  overStockProducts: number;
  totalValue: number;
  alertsGenerated: number;
}

interface StockAlert {
  type: 'LOW_STOCK' | 'OUT_OF_STOCK' | 'OVER_STOCK';
  productId: number;
  productName: string;
  sku: string;
  warehouseId: number;
  warehouseName: string;
  currentStock: number;
  minLevel: number;
  maxLevel: number;
  suggestedAction: string;
}

@Injectable()
export class DailyStockCheckJob {
  private readonly logger = new Logger(DailyStockCheckJob.name);

  constructor(
    @InjectRepository(InventoryItem)
    private inventoryRepository: Repository<InventoryItem>,
  ) {}

  /**
   * Daily stock check job - runs every day at 6:00 AM
   */
  @Cron(CronExpression.EVERY_DAY_AT_6AM)
  async handleDailyStockCheck(): Promise<void> {
    this.logger.log('🔍 Starting daily stock check job...');

    const startTime = Date.now();

    try {
      const result = await this.performStockCheck();

      const duration = Date.now() - startTime;
      this.logger.log(`✅ Daily stock check completed in ${duration}ms`);
      this.logger.log(`📊 Results: ${JSON.stringify(result, null, 2)}`);

      // Send notifications if needed
      await this.sendStockAlerts(result);
    } catch (error) {
      this.logger.error('❌ Daily stock check failed:', error);
    }
  }

  /**
   * Hourly stock level monitoring - runs every hour during business hours
   */
  @Cron('0 8-18 * * 1-6') // Every hour from 8 AM to 6 PM, Monday to Saturday
  async handleHourlyStockMonitoring(): Promise<void> {
    this.logger.log('📈 Running hourly stock monitoring...');

    try {
      const criticalAlerts = await this.checkCriticalStockLevels();

      if (criticalAlerts.length > 0) {
        this.logger.warn(
          `⚠️ Found ${criticalAlerts.length} critical stock alerts`,
        );
        await this.sendCriticalAlerts(criticalAlerts);
      } else {
        this.logger.log('✅ No critical stock issues found');
      }
    } catch (error) {
      this.logger.error('❌ Hourly stock monitoring failed:', error);
    }
  }

  /**
   * Weekly inventory reconciliation - runs every Sunday at 11 PM
   */
  @Cron('0 23 * * 0') // Every Sunday at 11 PM
  async handleWeeklyInventoryReconciliation(): Promise<void> {
    this.logger.log('📋 Starting weekly inventory reconciliation...');

    try {
      const discrepancies = await this.findInventoryDiscrepancies();

      if (discrepancies.length > 0) {
        this.logger.warn(
          `🔍 Found ${discrepancies.length} inventory discrepancies`,
        );
        await this.generateReconciliationReport(discrepancies);
      } else {
        this.logger.log('✅ No inventory discrepancies found');
      }
    } catch (error) {
      this.logger.error('❌ Weekly inventory reconciliation failed:', error);
    }
  }

  /**
   * Perform comprehensive stock check
   */
  private async performStockCheck(): Promise<StockCheckResult> {
    const inventoryItems = await this.inventoryRepository
      .createQueryBuilder('inventory')
      .leftJoinAndSelect('inventory.product', 'product')
      .leftJoinAndSelect('inventory.warehouse', 'warehouse')
      .where('inventory.isDeleted = false')
      .andWhere('product.isDeleted = false')
      .andWhere('product.isActive = true')
      .getMany();

    let lowStockCount = 0;
    let outOfStockCount = 0;
    let overStockCount = 0;
    let totalValue = 0;
    const alerts: StockAlert[] = [];

    for (const item of inventoryItems) {
      const product = item.product;
      const currentStock = item.quantity - item.reservedQuantity; // Available stock

      // Calculate value
      totalValue += currentStock * (product.costPrice || 0);

      // Check stock levels
      if (currentStock <= 0) {
        outOfStockCount++;
        alerts.push({
          type: 'OUT_OF_STOCK',
          productId: product.id,
          productName: product.name,
          sku: product.sku,
          warehouseId: item.warehouse.id,
          warehouseName: item.warehouse.name,
          currentStock,
          minLevel: product.minStockLevel,
          maxLevel: product.maxStockLevel || 0,
          suggestedAction: 'Immediate restock required',
        });
      } else if (currentStock <= product.minStockLevel) {
        lowStockCount++;
        alerts.push({
          type: 'LOW_STOCK',
          productId: product.id,
          productName: product.name,
          sku: product.sku,
          warehouseId: item.warehouse.id,
          warehouseName: item.warehouse.name,
          currentStock,
          minLevel: product.minStockLevel,
          maxLevel: product.maxStockLevel || 0,
          suggestedAction: `Reorder ${product.maxStockLevel - currentStock} units`,
        });
      } else if (
        product.maxStockLevel &&
        currentStock > product.maxStockLevel
      ) {
        overStockCount++;
        alerts.push({
          type: 'OVER_STOCK',
          productId: product.id,
          productName: product.name,
          sku: product.sku,
          warehouseId: item.warehouse.id,
          warehouseName: item.warehouse.name,
          currentStock,
          minLevel: product.minStockLevel,
          maxLevel: product.maxStockLevel,
          suggestedAction: 'Consider promotion or redistribution',
        });
      }

      // Update last stock check
      item.lastStockCheck = new Date();
    }

    // Bulk save last stock check updates
    await this.inventoryRepository.save(inventoryItems);

    // Log alerts to database for reporting
    await this.logStockAlerts(alerts);

    return {
      totalProducts: inventoryItems.length,
      lowStockProducts: lowStockCount,
      outOfStockProducts: outOfStockCount,
      overStockProducts: overStockCount,
      totalValue: Math.round(totalValue),
      alertsGenerated: alerts.length,
    };
  }

  /**
   * Check for critical stock levels that need immediate attention
   */
  private async checkCriticalStockLevels(): Promise<StockAlert[]> {
    const criticalItems = await this.inventoryRepository
      .createQueryBuilder('inventory')
      .leftJoinAndSelect('inventory.product', 'product')
      .leftJoinAndSelect('inventory.warehouse', 'warehouse')
      .where('inventory.isDeleted = false')
      .andWhere('product.isDeleted = false')
      .andWhere('product.isActive = true')
      .andWhere('(inventory.quantity - inventory.reservedQuantity) <= 0') // Out of stock
      .getMany();

    const alerts: StockAlert[] = criticalItems.map((item) => ({
      type: 'OUT_OF_STOCK',
      productId: item.product.id,
      productName: item.product.name,
      sku: item.product.sku,
      warehouseId: item.warehouse.id,
      warehouseName: item.warehouse.name,
      currentStock: item.quantity - item.reservedQuantity,
      minLevel: item.product.minStockLevel,
      maxLevel: item.product.maxStockLevel || 0,
      suggestedAction: 'CRITICAL: Immediate restock required',
    }));

    return alerts;
  }

  /**
   * Find inventory discrepancies for reconciliation
   */
  private async findInventoryDiscrepancies(): Promise<any[]> {
    // This could check against external systems, physical counts, etc.
    // For now, we'll check for products with negative available stock
    const discrepancies = await this.inventoryRepository
      .createQueryBuilder('inventory')
      .leftJoinAndSelect('inventory.product', 'product')
      .leftJoinAndSelect('inventory.warehouse', 'warehouse')
      .where('inventory.isDeleted = false')
      .andWhere('(inventory.quantity - inventory.reservedQuantity) < 0') // Negative available stock
      .getMany();

    return discrepancies.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      sku: item.product.sku,
      warehouseId: item.warehouse.id,
      warehouseName: item.warehouse.name,
      totalQuantity: item.quantity,
      reservedQuantity: item.reservedQuantity,
      availableQuantity: item.quantity - item.reservedQuantity,
      discrepancyType: 'NEGATIVE_AVAILABLE_STOCK',
      severity: 'HIGH',
    }));
  }

  /**
   * Log stock alerts to database for reporting and auditing
   */
  private async logStockAlerts(alerts: StockAlert[]): Promise<void> {
    // This could save to a stock_alerts table for historical tracking
    this.logger.log(`📝 Logging ${alerts.length} stock alerts to database`);

    // For now, we'll just log to console, but in production this should save to DB
    alerts.forEach((alert) => {
      this.logger.warn(
        `${alert.type}: ${alert.productName} (${alert.sku}) at ${alert.warehouseName} - Current: ${alert.currentStock}, Min: ${alert.minLevel}`,
      );
    });
  }

  /**
   * Send stock alerts via notification service
   */
  private async sendStockAlerts(result: StockCheckResult): Promise<void> {
    // This would integrate with a notification service (email, Slack, etc.)
    this.logger.log('📧 Sending daily stock report notification...');

    // Mock notification - in production, integrate with actual notification service
    const summary = `
📊 Daily Stock Check Summary:
• Total Products Monitored: ${result.totalProducts}
• Low Stock Alerts: ${result.lowStockProducts}
• Out of Stock Alerts: ${result.outOfStockProducts}
• Over Stock Alerts: ${result.overStockProducts}
• Total Inventory Value: $${result.totalValue.toLocaleString()}
• Total Alerts Generated: ${result.alertsGenerated}
    `;

    this.logger.log(summary);
  }

  /**
   * Send critical alerts that need immediate attention
   */
  private async sendCriticalAlerts(alerts: StockAlert[]): Promise<void> {
    this.logger.error('🚨 CRITICAL STOCK ALERTS:');
    alerts.forEach((alert) => {
      this.logger.error(
        `🚨 ${alert.productName} (${alert.sku}) is OUT OF STOCK at ${alert.warehouseName}`,
      );
    });
  }

  /**
   * Generate weekly reconciliation report
   */
  private async generateReconciliationReport(
    discrepancies: any[],
  ): Promise<void> {
    this.logger.log('📋 Generating weekly reconciliation report...');

    const report = {
      generatedAt: new Date(),
      totalDiscrepancies: discrepancies.length,
      highSeverityCount: discrepancies.filter((d) => d.severity === 'HIGH')
        .length,
      discrepancies: discrepancies,
    };

    this.logger.log(
      `📋 Reconciliation Report: ${JSON.stringify(report, null, 2)}`,
    );
  }

  /**
   * Manual trigger for testing purposes
   */
  async runManualStockCheck(): Promise<StockCheckResult> {
    this.logger.log('🔍 Running manual stock check...');
    return this.performStockCheck();
  }
}
