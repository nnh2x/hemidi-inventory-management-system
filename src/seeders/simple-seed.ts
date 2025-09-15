import { createConnection } from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config();

async function runSimpleSeed() {
  console.log('🌱 Starting simple seed with raw SQL...');

  const connection = await createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hemidi_database',
  });

  try {
    // Insert Categories
    console.log('📂 Inserting categories...');
    await connection.execute(`
      INSERT IGNORE INTO categories (name, description, code, is_active, created_at) VALUES
      ('Điện tử', 'Thiết bị điện tử và phụ kiện', 'DT', true, NOW()),
      ('Thời trang', 'Quần áo và phụ kiện thời trang', 'TT', true, NOW()),
      ('Sách', 'Sách và tài liệu học tập', 'SA', true, NOW()),
      ('Gia dụng', 'Đồ gia dụng và nội thất', 'GD', true, NOW()),
      ('Thể thao', 'Đồ thể thao và outdoor', 'TS', true, NOW())
    `);

    // Insert Warehouses
    console.log('🏢 Inserting warehouses...');
    await connection.execute(`
      INSERT IGNORE INTO warehouses (name, code, address, phone, email, manager_name, is_active, created_at) VALUES
      ('Kho Trung Tâm', 'KTT', '123 Đường Nguyễn Văn Linh, Q.7, TP.HCM', '028-1234-5678', 'kho.trung.tam@hemidi.com', 'Nguyễn Văn A', true, NOW()),
      ('Kho Miền Bắc', 'KMB', '456 Đường Láng, Đống Đa, Hà Nội', '024-9876-5432', 'kho.mien.bac@hemidi.com', 'Trần Thị B', true, NOW()),
      ('Kho Miền Tây', 'KMT', '789 Đường 3/2, Ninh Kiều, Cần Thơ', '0292-111-2222', 'kho.mien.tay@hemidi.com', 'Lê Văn C', true, NOW())
    `);

    // Get category IDs
    const [categories] = await connection.execute(
      'SELECT id, code FROM categories',
    );
    const categoryMap = new Map();
    (categories as any[]).forEach((cat) => categoryMap.set(cat.code, cat.id));

    // Insert Products
    console.log('📱 Inserting products...');
    const products = [
      [
        'iPhone 15 Pro Max',
        'Điện thoại thông minh cao cấp từ Apple',
        'IPH15PM256',
        '8901234567890',
        28990000,
        25000000,
        'chiếc',
        5,
        50,
        categoryMap.get('DT'),
      ],
      [
        'Samsung Galaxy S24 Ultra',
        'Flagship Android với bút S Pen',
        'SGS24U512',
        '8901234567891',
        31990000,
        28000000,
        'chiếc',
        3,
        30,
        categoryMap.get('DT'),
      ],
      [
        'MacBook Air M3',
        'Laptop siêu mỏng với chip Apple M3',
        'MBAM3256',
        '8901234567892',
        32990000,
        29000000,
        'chiếc',
        2,
        20,
        categoryMap.get('DT'),
      ],
      [
        'iPad Pro 11"',
        'Máy tính bảng chuyên nghiệp',
        'IPP11256',
        '8901234567893',
        22990000,
        20000000,
        'chiếc',
        3,
        25,
        categoryMap.get('DT'),
      ],
      [
        'AirPods Pro 2',
        'Tai nghe không dây chống ồn',
        'APP2USB',
        '8901234567894',
        6290000,
        5000000,
        'chiếc',
        10,
        100,
        categoryMap.get('DT'),
      ],
      [
        'Áo Polo Nam Uniqlo',
        'Áo polo cotton co giãn thoáng mát',
        'APM-UNI-BLU-L',
        '8901234567895',
        399000,
        250000,
        'chiếc',
        20,
        100,
        categoryMap.get('TT'),
      ],
      [
        'Giày Nike Air Force 1',
        'Giày thể thao classic màu trắng',
        'GNK-AF1-WHT-42',
        '8901234567896',
        2890000,
        2200000,
        'đôi',
        10,
        60,
        categoryMap.get('TT'),
      ],
      [
        "Quần Jeans Levi's 501",
        'Quần jeans classic straight fit',
        'QJ-LV501-BLU-32',
        '8901234567897',
        1590000,
        1200000,
        'chiếc',
        15,
        80,
        categoryMap.get('TT'),
      ],
      [
        'Áo Khoác Adidas',
        'Áo khoác thể thao 3 sọc',
        'AK-ADI-BLK-XL',
        '8901234567898',
        1290000,
        900000,
        'chiếc',
        12,
        70,
        categoryMap.get('TT'),
      ],
      [
        'Clean Code - Robert Martin',
        'Sách lập trình về viết code sạch',
        'BOOK-CC-VN',
        '8901234567899',
        250000,
        180000,
        'cuốn',
        15,
        80,
        categoryMap.get('SA'),
      ],
      [
        'Design Patterns GoF',
        'Sách về mẫu thiết kế phần mềm',
        'BOOK-DP-VN',
        '8901234567900',
        320000,
        220000,
        'cuốn',
        12,
        60,
        categoryMap.get('SA'),
      ],
      [
        'JavaScript: The Good Parts',
        'Sách JavaScript căn bản',
        'BOOK-JS-EN',
        '8901234567901',
        280000,
        200000,
        'cuốn',
        18,
        90,
        categoryMap.get('SA'),
      ],
      [
        'Máy Hút Bụi Dyson V15',
        'Máy hút bụi không dây laser',
        'MHB-DYS-V15',
        '8901234567902',
        18990000,
        15000000,
        'chiếc',
        3,
        15,
        categoryMap.get('GD'),
      ],
      [
        'Nồi Cơm Điện Toshiba',
        'Nồi cơm điện cao tần 1.8L',
        'NCD-TSB-18L',
        '8901234567903',
        2890000,
        2200000,
        'chiếc',
        5,
        30,
        categoryMap.get('GD'),
      ],
      [
        'Bàn Ủi Hơi Nước Philips',
        'Bàn ủi hơi nước 2400W',
        'BU-PHL-2400',
        '8901234567904',
        1590000,
        1200000,
        'chiếc',
        8,
        40,
        categoryMap.get('GD'),
      ],
      [
        'Vợt Tennis Wilson Pro Staff',
        'Vợt tennis chuyên nghiệp',
        'VT-WIL-PS97',
        '8901234567905',
        4990000,
        3800000,
        'chiếc',
        4,
        20,
        categoryMap.get('TS'),
      ],
      [
        'Bóng Đá Adidas FIFA World Cup',
        'Bóng đá thi đấu chính thức',
        'BD-ADI-FIFA',
        '8901234567906',
        890000,
        650000,
        'quả',
        20,
        100,
        categoryMap.get('TS'),
      ],
      [
        'Thảm Yoga Premium',
        'Thảm yoga chống trượt cao cấp',
        'TY-PRM-180',
        '8901234567907',
        590000,
        400000,
        'chiếc',
        15,
        75,
        categoryMap.get('TS'),
      ],
    ];

    for (const product of products) {
      await connection.execute(
        `
        INSERT IGNORE INTO products (name, description, sku, barcode, price, cost_price, unit, min_stock_level, max_stock_level, category_id, is_active, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, true, NOW())
      `,
        product,
      );
    }

    // Get warehouse and product IDs
    const [warehouses] = await connection.execute(
      'SELECT id, code FROM warehouses',
    );
    const [productList] = await connection.execute(
      'SELECT id, sku, min_stock_level, max_stock_level FROM products',
    );

    // Insert Inventory Items
    console.log('📦 Inserting inventory items...');
    for (const warehouse of warehouses as any[]) {
      for (const product of productList as any[]) {
        const minStock = product.min_stock_level || 0;
        const maxStock = product.max_stock_level || 100;
        const quantity =
          Math.floor(Math.random() * (maxStock - minStock + 1)) + minStock;
        const reservedQuantity = Math.floor(quantity * 0.05); // 5% reserved

        await connection.execute(
          `
          INSERT IGNORE INTO inventory_items (quantity, reserved_quantity, location, product_id, warehouse_id, last_stock_check, created_at)
          VALUES (?, ?, ?, ?, ?, NOW(), NOW())
        `,
          [
            quantity,
            reservedQuantity,
            `${warehouse.code}-A${Math.floor(Math.random() * 5) + 1}-${Math.floor(Math.random() * 20) + 1}`,
            product.id,
            warehouse.id,
          ],
        );

        // Create initial stock transaction
        const [inventoryResult] = await connection.execute(
          'SELECT id FROM inventory_items WHERE product_id = ? AND warehouse_id = ?',
          [product.id, warehouse.id],
        );

        if ((inventoryResult as any[]).length > 0) {
          await connection.execute(
            `
            INSERT INTO inventory_transactions (type, quantity, quantity_before, quantity_after, reference, notes, user_id, inventory_item_id, transaction_date, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
          `,
            [
              'IN',
              quantity,
              0,
              quantity,
              `INIT-${Date.now()}`,
              'Nhập kho ban đầu',
              1,
              (inventoryResult as any[])[0].id,
            ],
          );
        }
      }
    }

    console.log('✅ Simple seed completed successfully!');

    // Show summary
    const [categoryCount] = await connection.execute(
      'SELECT COUNT(*) as count FROM categories',
    );
    const [warehouseCount] = await connection.execute(
      'SELECT COUNT(*) as count FROM warehouses',
    );
    const [productCount] = await connection.execute(
      'SELECT COUNT(*) as count FROM products',
    );
    const [inventoryCount] = await connection.execute(
      'SELECT COUNT(*) as count FROM inventory_items',
    );
    const [transactionCount] = await connection.execute(
      'SELECT COUNT(*) as count FROM inventory_transactions',
    );

    console.log('\n📊 Database Summary:');
    console.log(`   📂 Categories: ${(categoryCount as any[])[0].count}`);
    console.log(`   🏢 Warehouses: ${(warehouseCount as any[])[0].count}`);
    console.log(`   📱 Products: ${(productCount as any[])[0].count}`);
    console.log(`   📦 Inventory Items: ${(inventoryCount as any[])[0].count}`);
    console.log(`   📋 Transactions: ${(transactionCount as any[])[0].count}`);
  } catch (error) {
    console.error('❌ Simple seed failed:', error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

runSimpleSeed();
