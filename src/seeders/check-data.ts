import { createConnection } from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config();

async function checkData() {
  console.log('🔍 Checking database data...');

  const connection = await createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hemidi_database',
  });

  try {
    console.log('\n📂 CATEGORIES:');
    const [categories] = await connection.execute(
      'SELECT * FROM categories LIMIT 10',
    );
    console.table(categories);

    console.log('\n🏢 WAREHOUSES:');
    const [warehouses] = await connection.execute(
      'SELECT * FROM warehouses LIMIT 10',
    );
    console.table(warehouses);

    console.log('\n📱 PRODUCTS (Sample):');
    const [products] = await connection.execute(`
      SELECT p.id, p.name, p.sku, p.price, c.name as category_name 
      FROM products p 
      JOIN categories c ON p.category_id = c.id 
      LIMIT 10
    `);
    console.table(products);

    console.log('\n📦 INVENTORY SUMMARY BY WAREHOUSE:');
    const [inventorySummary] = await connection.execute(`
      SELECT 
        w.name as warehouse_name,
        COUNT(i.id) as total_products,
        SUM(i.quantity) as total_quantity,
        SUM(i.reserved_quantity) as total_reserved
      FROM warehouses w
      LEFT JOIN inventory_items i ON w.id = i.warehouse_id
      GROUP BY w.id, w.name
    `);
    console.table(inventorySummary);

    console.log('\n📋 RECENT TRANSACTIONS:');
    const [transactions] = await connection.execute(`
      SELECT 
        t.id,
        t.type,
        t.quantity,
        t.reference,
        p.name as product_name,
        w.name as warehouse_name,
        t.transaction_date
      FROM inventory_transactions t
      JOIN inventory_items i ON t.inventory_item_id = i.id
      JOIN products p ON i.product_id = p.id
      JOIN warehouses w ON i.warehouse_id = w.id
      ORDER BY t.transaction_date DESC
      LIMIT 10
    `);
    console.table(transactions);

    console.log('\n💰 TOP EXPENSIVE PRODUCTS:');
    const [expensiveProducts] = await connection.execute(`
      SELECT name, sku, price, cost_price
      FROM products
      ORDER BY price DESC
      LIMIT 5
    `);
    console.table(expensiveProducts);

    console.log('\n📈 STOCK LEVELS BY CATEGORY:');
    const [stockByCategory] = await connection.execute(`
      SELECT 
        c.name as category_name,
        COUNT(DISTINCT p.id) as product_count,
        SUM(i.quantity) as total_stock,
        AVG(i.quantity) as avg_stock_per_product
      FROM categories c
      JOIN products p ON c.id = p.category_id
      JOIN inventory_items i ON p.id = i.product_id
      GROUP BY c.id, c.name
      ORDER BY total_stock DESC
    `);
    console.table(stockByCategory);
  } catch (error) {
    console.error('❌ Error checking data:', error);
  } finally {
    await connection.end();
  }
}

checkData();
