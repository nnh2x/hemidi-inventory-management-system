# Hemidi Inventory Management System

A comprehensive multi-channel inventory management system built with NestJS and TypeORM for managing e-commerce inventory across multiple sales channels.

## 🚀 Features

### Core Functionality
- **Product Master Management**: Complete product catalog with categories, SKUs, pricing, and specifications
- **Multi-Warehouse Inventory**: Track inventory across multiple warehouses and locations
- **Real-time Stock Monitoring**: Live inventory levels with automatic updates
- **Inventory Transactions**: Complete audit trail of all stock movements (IN/OUT/ADJUSTMENT)
- **Low Stock Alerts**: Automated notifications when inventory drops below thresholds
- **Comprehensive Reporting**: Analytics and insights for inventory optimization

### API & Documentation
- **RESTful API**: Clean, well-structured API endpoints
- **Swagger Documentation**: Interactive API documentation with examples
- **Input Validation**: Robust data validation with class-validator
- **Error Handling**: Comprehensive error responses and logging

### Automation & Scheduling
- **Daily Stock Check** (6:00 AM): Automated inventory analysis and alert generation
- **Hourly Monitoring**: Real-time stock level monitoring and notifications
- **Weekly Reconciliation** (Sunday 7:00 AM): Comprehensive inventory audit reports
- **Manual Job Triggers**: API endpoints to manually execute scheduled tasks

### Data Management
- **Database Migrations**: Version-controlled database schema management
- **Sample Data Seeding**: Pre-populated Vietnamese sample data for testing
- **Data Integrity**: Foreign key constraints and validation rules
- **Backup & Recovery**: Database backup strategies and recovery procedures

## 🛠 Technology Stack

- **Framework**: NestJS 10+ with TypeScript
- **Database**: MySQL 8.0+ with TypeORM
- **Documentation**: Swagger/OpenAPI 3.0
- **Validation**: class-validator & class-transformer
- **Scheduling**: @nestjs/schedule with cron jobs
- **Authentication**: JWT-ready (extensible)
- **Development**: Hot reload, ESLint, Prettier

## 🏗 Architecture Overview

### Microservices Design
The system is designed to support microservices architecture with the following services:

1. **Product Master Service** (Port 3001): Product catalog management
2. **Channel Inventory Service** (Port 3002): Multi-channel inventory tracking
3. **Warehouse Inventory Service** (Port 3003): Physical warehouse management
4. **Sync Service** (Port 3004): Cross-channel synchronization
5. **Integration Service** (Port 3005): Third-party integrations
6. **Reporting Service** (Port 3006): Analytics and reports
7. **Notification Service** (Port 3007): Alerts and notifications
8. **API Gateway** (Port 3000): Central API management

### Current Implementation
Currently implemented as a monolithic application on port 3003 with modular structure ready for microservices migration.

## 📦 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **MySQL**: v8.0 or higher
- **npm**: v8.0.0 or higher

### Installation

1. **Clone the repository**:
```bash
git clone <repository-url>
cd hemidi-inventory-management-system
```

2. **Install dependencies**:
```bash
npm install
```

3. **Environment Configuration**:
Create `.env` file:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_NAME=inventory_management

# Application Configuration
PORT=3003
NODE_ENV=development

# JWT Configuration (for future authentication)
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h
```

4. **Database Setup**:
```bash
# Create database
mysql -u root -p -e "CREATE DATABASE inventory_management;"

# Run migrations
npm run migration:run

# Seed sample data
npm run seed
```

5. **Start the application**:
```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

### 🌐 Application URLs

- **API Server**: http://localhost:3003
- **Swagger Documentation**: http://localhost:3003/api
- **Health Check**: http://localhost:3003/health

## 📚 API Documentation

### Product Management

#### Products
```bash
GET    /products              # List all products (with pagination, filters)
POST   /products              # Create new product
GET    /products/:id          # Get product details
PUT    /products/:id          # Update product
DELETE /products/:id          # Delete product
GET    /products/:id/inventory # Get product inventory across warehouses
```

#### Categories
```bash
GET    /categories            # List all categories
POST   /categories            # Create new category
GET    /categories/:id        # Get category details
PUT    /categories/:id        # Update category
DELETE /categories/:id        # Delete category
GET    /categories/:id/products # Get products in category
```

#### Warehouses
```bash
GET    /warehouses            # List all warehouses
POST   /warehouses            # Create new warehouse
GET    /warehouses/:id        # Get warehouse details
PUT    /warehouses/:id        # Update warehouse
DELETE /warehouses/:id        # Delete warehouse
GET    /warehouses/:id/inventory # Get warehouse inventory
GET    /warehouses/:id/low-stock # Get low stock items in warehouse
```

### Inventory Management

#### Inventory Items
```bash
GET    /inventory/items       # List inventory items (with filters)
POST   /inventory/items       # Create inventory item
GET    /inventory/items/:id   # Get inventory item details
PUT    /inventory/items/:id   # Update inventory item
DELETE /inventory/items/:id   # Delete inventory item
```

#### Inventory Transactions
```bash
GET    /inventory/transactions # List all transactions (with filters)
POST   /inventory/transactions # Create new transaction (stock movement)
GET    /inventory/transactions/:id # Get transaction details
```

#### Reports & Analytics
```bash
GET    /inventory/low-stock       # Get low stock items report
GET    /inventory/stock-levels    # Get current stock levels summary
GET    /inventory/movement-report # Get inventory movement analytics
```

### Job Management

#### Scheduled Jobs
```bash
POST   /jobs/daily-stock-check    # Manually trigger stock check
POST   /jobs/stock-check         # Manual stock analysis
GET    /jobs/status              # Get job scheduling status
```

## 🗄 Database Schema

### Core Entities

#### Category
```sql
- id (Primary Key)
- name (Unique)
- code (Unique, 2-10 chars)
- description (Optional)
- createdAt, updatedAt
```

#### Product
```sql
- id (Primary Key)
- name (2-200 chars)
- sku (Unique, 2-50 chars)
- description (Optional, max 1000 chars)
- price (Decimal, ≥0)
- costPrice (Optional, Decimal, ≥0)
- unit (Default: 'piece')
- isActive (Default: true)
- categoryId (Foreign Key)
- createdAt, updatedAt
```

#### Warehouse
```sql
- id (Primary Key)
- name (2-100 chars)
- code (Unique, 2-20 chars)
- location (Optional, max 500 chars)
- description (Optional, max 500 chars)
- isActive (Default: true)
- createdAt, updatedAt
```

#### InventoryItem
```sql
- id (Primary Key)
- productId (Foreign Key)
- warehouseId (Foreign Key)
- quantity (≥0)
- minQuantity (Optional, ≥0)
- maxQuantity (Optional, ≥0)
- reservedQuantity (Default: 0, ≥0)
- createdAt, updatedAt
- Unique constraint: (productId, warehouseId)
```

#### InventoryTransaction
```sql
- id (Primary Key)
- productId (Foreign Key)
- warehouseId (Foreign Key)
- type (Enum: 'IN', 'OUT', 'ADJUSTMENT')
- quantity (Can be negative)
- quantityBefore, quantityAfter
- reference (Optional)
- notes (Optional)
- createdAt
```

## 📊 Sample Data

The system includes comprehensive Vietnamese sample data:

### Categories (5)
- **Điện tử** (ELC): Thiết bị điện tử và phụ kiện
- **Thời trang** (FSH): Quần áo và phụ kiện thời trang
- **Nhà cửa & Vườn** (HGD): Đồ gia dụng và vườn
- **Thể thao** (SPT): Dụng cụ và trang phục thể thao
- **Sách** (BOK): Sách và văn phòng phẩm

### Products (16)
Including popular Vietnamese products like:
- iPhone 15 Pro, Samsung Galaxy S24
- Áo thun cotton, Quần jeans
- Nồi cơm điện, Quạt trần
- Giày chạy bộ, Bóng đá
- Sách lập trình, Vở ghi chú

### Warehouses (3)
- **Kho chính** (WH001): Hà Nội
- **Kho miền Bắc** (WH002): Hải Phòng
- **Kho miền Nam** (WH003): Hồ Chí Minh

### Inventory Data
- 48 inventory items across all warehouses
- 60+ sample transactions showing realistic stock movements
- Balanced distribution ensuring some low-stock scenarios for testing

## ⏰ Automated Jobs

### Daily Stock Check (6:00 AM)
```typescript
@Cron('0 6 * * *')
handleDailyStockCheck()
```
- Analyzes all inventory items across warehouses
- Identifies low stock situations
- Generates automated alerts
- Updates stock status indicators
- Creates management reports

### Hourly Monitoring (Every Hour)
```typescript
@Cron('0 * * * *')
handleHourlyAlerts()
```
- Monitors critical stock levels
- Processes real-time notifications
- Updates dashboard metrics
- Triggers urgent alerts

### Weekly Reconciliation (Sunday 7:00 AM)
```typescript
@Cron('0 7 * * 0')
handleWeeklyReconciliation()
```
- Comprehensive inventory audit
- Generates detailed analytics reports
- Identifies discrepancies and trends
- Creates executive summaries

## 🏢 Development

### Project Structure
```
src/
├── entities/                 # TypeORM entities
├── modules/inventory/        # Main inventory module
│   ├── controllers/          # API controllers
│   ├── services/            # Business logic services
│   └── dto/                 # Data transfer objects
├── jobs/                    # Scheduled background jobs
├── seeders/                 # Database seeders
├── config/                  # Configuration
├── migrations/              # Database migrations
├── app.module.ts           # Main application module
└── main.ts                 # Application bootstrap
```

### Development Commands

#### Database Management
```bash
npm run migration:generate -- src/migrations/MigrationName
npm run migration:run
npm run migration:revert
npm run seed
npm run check-data
```

#### Testing & Quality
```bash
npm run test
npm run test:e2e
npm run lint
npm run format
```

#### Building & Running
```bash
npm run build
npm run start:prod
npm run start:dev
```

## 🚀 Deployment

The application is production-ready with:
- Health check endpoints
- Comprehensive error handling
- Input validation
- Swagger documentation
- Scheduled job management
- Sample data for testing

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Make changes with proper tests
4. Commit changes (`git commit -m 'Add amazing feature'`)
5. Push to branch (`git push origin feature/amazing-feature`)
6. Create Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ for the Vietnamese e-commerce community**
