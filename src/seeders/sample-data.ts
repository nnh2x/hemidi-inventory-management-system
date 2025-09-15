import { DataSource } from 'typeorm';

// Sample data for quick testing
export const sampleCategories = [
  {
    name: 'Điện tử',
    description: 'Thiết bị điện tử và phụ kiện',
    code: 'DT',
    isActive: true,
  },
  {
    name: 'Thời trang',
    description: 'Quần áo và phụ kiện thời trang',
    code: 'TT',
    isActive: true,
  },
  {
    name: 'Sách',
    description: 'Sách và tài liệu học tập',
    code: 'SA',
    isActive: true,
  },
];

export const sampleWarehouses = [
  {
    name: 'Kho Trung Tâm',
    code: 'KTT',
    address: '123 Đường Nguyễn Văn Linh, Q.7, TP.HCM',
    phone: '028-1234-5678',
    email: 'kho.trung.tam@hemidi.com',
    managerName: 'Nguyễn Văn A',
    isActive: true,
  },
  {
    name: 'Kho Miền Bắc',
    code: 'KMB',
    address: '456 Đường Láng, Đống Đa, Hà Nội',
    phone: '024-9876-5432',
    email: 'kho.mien.bac@hemidi.com',
    managerName: 'Trần Thị B',
    isActive: true,
  },
];

export const sampleProducts = [
  {
    name: 'iPhone 15 Pro Max',
    description: 'Điện thoại thông minh cao cấp từ Apple',
    sku: 'IPH15PM256',
    barcode: '8901234567890',
    price: 28990000, // VND
    costPrice: 25000000,
    unit: 'chiếc',
    minStockLevel: 5,
    maxStockLevel: 50,
    categoryCode: 'DT',
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Flagship Android với bút S Pen',
    sku: 'SGS24U512',
    barcode: '8901234567891',
    price: 31990000,
    costPrice: 28000000,
    unit: 'chiếc',
    minStockLevel: 3,
    maxStockLevel: 30,
    categoryCode: 'DT',
  },
  {
    name: 'MacBook Air M3',
    description: 'Laptop siêu mỏng với chip Apple M3',
    sku: 'MBAM3256',
    barcode: '8901234567892',
    price: 32990000,
    costPrice: 29000000,
    unit: 'chiếc',
    minStockLevel: 2,
    maxStockLevel: 20,
    categoryCode: 'DT',
  },
  {
    name: 'Áo Polo Nam Uniqlo',
    description: 'Áo polo cotton co giãn thoáng mát',
    sku: 'APM-UNI-BLU-L',
    barcode: '8901234567893',
    price: 399000,
    costPrice: 250000,
    unit: 'chiếc',
    minStockLevel: 20,
    maxStockLevel: 100,
    categoryCode: 'TT',
  },
  {
    name: 'Giày Nike Air Force 1',
    description: 'Giày thể thao classic màu trắng',
    sku: 'GNK-AF1-WHT-42',
    barcode: '8901234567894',
    price: 2890000,
    costPrice: 2200000,
    unit: 'đôi',
    minStockLevel: 10,
    maxStockLevel: 60,
    categoryCode: 'TT',
  },
  {
    name: 'Clean Code - Robert Martin',
    description: 'Sách lập trình về viết code sạch',
    sku: 'BOOK-CC-VN',
    barcode: '8901234567895',
    price: 250000,
    costPrice: 180000,
    unit: 'cuốn',
    minStockLevel: 15,
    maxStockLevel: 80,
    categoryCode: 'SA',
  },
];

export async function insertSampleData(dataSource: DataSource): Promise<void> {
  console.log('🚀 Inserting sample data...');

  // Insert Categories
  console.log('📂 Inserting categories...');
  for (const category of sampleCategories) {
    await dataSource.query(
      `INSERT IGNORE INTO categories (name, description, code, is_active, created_at) 
       VALUES (?, ?, ?, ?, NOW())`,
      [category.name, category.description, category.code, category.isActive],
    );
  }

  // Insert Warehouses
  console.log('🏢 Inserting warehouses...');
  for (const warehouse of sampleWarehouses) {
    await dataSource.query(
      `INSERT IGNORE INTO warehouses (name, code, address, phone, email, manager_name, is_active, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        warehouse.name,
        warehouse.code,
        warehouse.address,
        warehouse.phone,
        warehouse.email,
        warehouse.managerName,
        warehouse.isActive,
      ],
    );
  }

  // Get category IDs
  const categoryMap = new Map();
  for (const category of sampleCategories) {
    const result = await dataSource.query(
      'SELECT id FROM categories WHERE code = ?',
      [category.code],
    );
    if (result[0]) {
      categoryMap.set(category.code, result[0].id);
    }
  }

  // Insert Products
  console.log('📱 Inserting products...');
  for (const product of sampleProducts) {
    const categoryId = categoryMap.get(product.categoryCode);
    if (categoryId) {
      await dataSource.query(
        `INSERT IGNORE INTO products (name, description, sku, barcode, price, cost_price, unit, min_stock_level, max_stock_level, category_id, is_active, created_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          product.name,
          product.description,
          product.sku,
          product.barcode,
          product.price,
          product.costPrice,
          product.unit,
          product.minStockLevel,
          product.maxStockLevel,
          categoryId,
          true,
        ],
      );
    }
  }

  // Get warehouse and product IDs for inventory
  const warehouses = await dataSource.query('SELECT id, code FROM warehouses');
  const products = await dataSource.query(
    'SELECT id, sku, min_stock_level, max_stock_level FROM products',
  );

  // Insert Inventory Items
  console.log('📦 Inserting inventory items...');
  for (const warehouse of warehouses) {
    for (const product of products) {
      // Random quantity between min and max stock levels
      const minStock = product.min_stock_level || 0;
      const maxStock = product.max_stock_level || 100;
      const quantity =
        Math.floor(Math.random() * (maxStock - minStock + 1)) + minStock;
      const reservedQuantity = Math.floor(quantity * 0.05); // 5% reserved

      await dataSource.query(
        `INSERT IGNORE INTO inventory_items (quantity, reserved_quantity, location, product_id, warehouse_id, last_stock_check, created_at) 
         VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          quantity,
          reservedQuantity,
          `${warehouse.code}-A${Math.floor(Math.random() * 5) + 1}-${Math.floor(Math.random() * 20) + 1}`,
          product.id,
          warehouse.id,
        ],
      );

      // Create initial stock transaction
      const inventoryResult = await dataSource.query(
        'SELECT id FROM inventory_items WHERE product_id = ? AND warehouse_id = ?',
        [product.id, warehouse.id],
      );

      if (inventoryResult[0]) {
        await dataSource.query(
          `INSERT INTO inventory_transactions (type, quantity, quantity_before, quantity_after, reference, notes, user_id, inventory_item_id, transaction_date, created_at) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [
            'IN',
            quantity,
            0,
            quantity,
            `INIT-${Date.now()}`,
            'Nhập kho ban đầu',
            1,
            inventoryResult[0].id,
          ],
        );
      }
    }
  }

  console.log('✅ Sample data inserted successfully!');
}
