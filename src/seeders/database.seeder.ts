import { DataSource } from 'typeorm';
import { Category } from '../entities/category.entity';
import { Warehouse } from '../entities/warehouse.entity';
import { Product } from '../entities/product.entity';
import { InventoryItem } from '../entities/inventory-item.entity';
import {
  InventoryTransaction,
  TransactionType,
} from '../entities/inventory-transaction.entity';

export class DatabaseSeeder {
  constructor(private dataSource: DataSource) {}

  async run(): Promise<void> {
    console.log('🌱 Seeding database with sample data...');

    // Seed Categories
    await this.seedCategories();

    // Seed Warehouses
    await this.seedWarehouses();

    // Seed Products
    await this.seedProducts();

    // Seed Inventory Items
    await this.seedInventoryItems();

    // Seed Initial Transactions
    await this.seedTransactions();

    console.log('✅ Database seeding completed!');
  }

  private async seedCategories(): Promise<void> {
    console.log('📂 Seeding categories...');

    const categoryRepository = this.dataSource.getRepository(Category);

    const categories = [
      {
        name: 'Electronics',
        description: 'Electronic devices and accessories',
        code: 'ELC',
        isActive: true,
      },
      {
        name: 'Clothing',
        description: 'Clothing and fashion items',
        code: 'CLO',
        isActive: true,
      },
      {
        name: 'Books',
        description: 'Books and educational materials',
        code: 'BOO',
        isActive: true,
      },
      {
        name: 'Home & Garden',
        description: 'Home improvement and garden supplies',
        code: 'HGD',
        isActive: true,
      },
      {
        name: 'Sports & Outdoors',
        description: 'Sports equipment and outdoor gear',
        code: 'SPO',
        isActive: true,
      },
    ];

    for (const categoryData of categories) {
      const existing = await categoryRepository.findOne({
        where: { code: categoryData.code },
      });

      if (!existing) {
        const category = categoryRepository.create(categoryData);
        await categoryRepository.save(category);
        console.log(`   ✓ Created category: ${category.name}`);
      }
    }
  }

  private async seedWarehouses(): Promise<void> {
    console.log('🏢 Seeding warehouses...');

    const warehouseRepository = this.dataSource.getRepository(Warehouse);

    const warehouses = [
      {
        name: 'Main Warehouse',
        code: 'WH001',
        address: '123 Main Street, Ho Chi Minh City, Vietnam',
        phone: '+84 28 1234 5678',
        email: 'main@hemidi.com',
        managerName: 'Nguyen Van A',
        isActive: true,
      },
      {
        name: 'North Warehouse',
        code: 'WH002',
        address: '456 North Avenue, Ha Noi, Vietnam',
        phone: '+84 24 9876 5432',
        email: 'north@hemidi.com',
        managerName: 'Tran Thi B',
        isActive: true,
      },
      {
        name: 'South Warehouse',
        code: 'WH003',
        address: '789 South Road, Can Tho, Vietnam',
        phone: '+84 292 1111 2222',
        email: 'south@hemidi.com',
        managerName: 'Le Van C',
        isActive: true,
      },
    ];

    for (const warehouseData of warehouses) {
      const existing = await warehouseRepository.findOne({
        where: { code: warehouseData.code },
      });

      if (!existing) {
        const warehouse = warehouseRepository.create(warehouseData);
        await warehouseRepository.save(warehouse);
        console.log(`   ✓ Created warehouse: ${warehouse.name}`);
      }
    }
  }

  private async seedProducts(): Promise<void> {
    console.log('📱 Seeding products...');

    const productRepository = this.dataSource.getRepository(Product);
    const categoryRepository = this.dataSource.getRepository(Category);

    // Get categories
    const electronics = await categoryRepository.findOne({
      where: { code: 'ELC' },
    });
    const clothing = await categoryRepository.findOne({
      where: { code: 'CLO' },
    });
    const books = await categoryRepository.findOne({ where: { code: 'BOO' } });
    const homeGarden = await categoryRepository.findOne({
      where: { code: 'HGD' },
    });
    const sports = await categoryRepository.findOne({ where: { code: 'SPO' } });

    const products = [
      // Electronics
      {
        name: 'iPhone 14 Pro',
        description: 'Latest iPhone with advanced camera system',
        sku: 'IPH14PRO128',
        barcode: '1234567890001',
        price: 999.99,
        costPrice: 750.0,
        unit: 'piece',
        minStockLevel: 10,
        maxStockLevel: 100,
        categoryId: electronics?.id,
        isActive: true,
      },
      {
        name: 'Samsung Galaxy S23',
        description: 'Flagship Android smartphone',
        sku: 'SGS23256',
        barcode: '1234567890002',
        price: 899.99,
        costPrice: 650.0,
        unit: 'piece',
        minStockLevel: 15,
        maxStockLevel: 150,
        categoryId: electronics?.id,
        isActive: true,
      },
      {
        name: 'MacBook Pro 14"',
        description: 'Professional laptop for developers',
        sku: 'MBP14M2PRO',
        barcode: '1234567890003',
        price: 1999.99,
        costPrice: 1500.0,
        unit: 'piece',
        minStockLevel: 5,
        maxStockLevel: 50,
        categoryId: electronics?.id,
        isActive: true,
      },
      // Clothing
      {
        name: 'Nike Air Max 270',
        description: 'Comfortable running shoes',
        sku: 'NIKAM270BLK42',
        barcode: '1234567890004',
        price: 129.99,
        costPrice: 80.0,
        unit: 'pair',
        minStockLevel: 20,
        maxStockLevel: 200,
        categoryId: clothing?.id,
        isActive: true,
      },
      {
        name: 'Adidas Ultraboost 22',
        description: 'Premium running shoes with Boost technology',
        sku: 'ADIUB22WHT41',
        barcode: '1234567890005',
        price: 179.99,
        costPrice: 120.0,
        unit: 'pair',
        minStockLevel: 15,
        maxStockLevel: 150,
        categoryId: clothing?.id,
        isActive: true,
      },
      // Books
      {
        name: 'Clean Code',
        description: 'A handbook of agile software craftsmanship',
        sku: 'BOOK-CC-ENG',
        barcode: '1234567890006',
        price: 49.99,
        costPrice: 30.0,
        unit: 'piece',
        minStockLevel: 25,
        maxStockLevel: 100,
        categoryId: books?.id,
        isActive: true,
      },
      {
        name: 'Design Patterns',
        description: 'Elements of reusable object-oriented software',
        sku: 'BOOK-DP-ENG',
        barcode: '1234567890007',
        price: 59.99,
        costPrice: 35.0,
        unit: 'piece',
        minStockLevel: 20,
        maxStockLevel: 80,
        categoryId: books?.id,
        isActive: true,
      },
      // Home & Garden
      {
        name: 'Dyson V15 Detect',
        description: 'Cordless vacuum cleaner with laser detection',
        sku: 'DYS-V15-DET',
        barcode: '1234567890008',
        price: 749.99,
        costPrice: 500.0,
        unit: 'piece',
        minStockLevel: 8,
        maxStockLevel: 40,
        categoryId: homeGarden?.id,
        isActive: true,
      },
      // Sports
      {
        name: 'Wilson Tennis Racket Pro Staff',
        description: 'Professional tennis racket',
        sku: 'WIL-TNS-PS97',
        barcode: '1234567890009',
        price: 199.99,
        costPrice: 120.0,
        unit: 'piece',
        minStockLevel: 12,
        maxStockLevel: 60,
        categoryId: sports?.id,
        isActive: true,
      },
      {
        name: 'Yoga Mat Premium',
        description: 'Non-slip yoga mat with alignment lines',
        sku: 'YOG-MAT-PREM',
        barcode: '1234567890010',
        price: 79.99,
        costPrice: 45.0,
        unit: 'piece',
        minStockLevel: 30,
        maxStockLevel: 150,
        categoryId: sports?.id,
        isActive: true,
      },
    ];

    for (const productData of products) {
      const existing = await productRepository.findOne({
        where: { sku: productData.sku },
      });

      if (!existing && productData.categoryId) {
        const product = productRepository.create(productData);
        await productRepository.save(product);
        console.log(`   ✓ Created product: ${product.name}`);
      }
    }
  }

  private async seedInventoryItems(): Promise<void> {
    console.log('📦 Seeding inventory items...');

    const inventoryRepository = this.dataSource.getRepository(InventoryItem);
    const productRepository = this.dataSource.getRepository(Product);
    const warehouseRepository = this.dataSource.getRepository(Warehouse);

    const products = await productRepository.find();
    const warehouses = await warehouseRepository.find();

    for (const product of products) {
      for (const warehouse of warehouses) {
        const existing = await inventoryRepository.findOne({
          where: { productId: product.id, warehouseId: warehouse.id },
        });

        if (!existing) {
          // Generate random initial stock between min and max levels
          const minStock = product.minStockLevel || 0;
          const maxStock = product.maxStockLevel || 100;
          const quantity =
            Math.floor(Math.random() * (maxStock - minStock + 1)) + minStock;

          const inventoryItem = inventoryRepository.create({
            quantity,
            reservedQuantity: Math.floor(quantity * 0.1), // 10% reserved
            location: `${warehouse.code}-A-${Math.floor(Math.random() * 10) + 1}-B-${Math.floor(Math.random() * 20) + 1}`,
            productId: product.id,
            warehouseId: warehouse.id,
            lastStockCheck: new Date(),
          });

          await inventoryRepository.save(inventoryItem);
          console.log(
            `   ✓ Created inventory: ${product.name} in ${warehouse.name} (Qty: ${quantity})`,
          );
        }
      }
    }
  }

  private async seedTransactions(): Promise<void> {
    console.log('📋 Seeding initial transactions...');

    const transactionRepository =
      this.dataSource.getRepository(InventoryTransaction);
    const inventoryRepository = this.dataSource.getRepository(InventoryItem);

    const inventoryItems = await inventoryRepository.find({
      relations: ['product', 'warehouse'],
    });

    for (const item of inventoryItems) {
      // Create initial stock transaction
      const transaction = transactionRepository.create({
        type: TransactionType.IN,
        quantity: item.quantity,
        quantityBefore: 0,
        quantityAfter: item.quantity,
        reference: `INIT-${new Date().getTime()}`,
        notes: 'Initial stock setup',
        userId: 1, // System user
        inventoryItemId: item.id,
        transactionDate: new Date(),
      });

      await transactionRepository.save(transaction);
      console.log(
        `   ✓ Created initial transaction for ${item.product?.name} in ${item.warehouse?.name}`,
      );
    }
  }
}
