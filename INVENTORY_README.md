# 🏪 Hemidi Inventory Management System

Hệ thống quản lý tồn kho được xây dựng bằng NestJS, TypeORM và MySQL.

## 📦 Tính năng chính

- ✅ **Quản lý sản phẩm**: CRUD sản phẩm với phân loại
- ✅ **Quản lý danh mục**: Tổ chức sản phẩm theo danh mục
- ✅ **Quản lý kho**: Đa kho hàng với thông tin chi tiết
- ✅ **Quản lý tồn kho**: Theo dõi số lượng tồn kho theo từng kho
- ✅ **Lịch sử giao dịch**: Ghi nhận tất cả các thao tác nhập/xuất kho
- ✅ **Báo cáo tồn kho**: Cảnh báo hàng sắp hết, báo cáo tổng hợp
- ✅ **Đặt trước hàng hóa**: Reserve stock cho các đơn hàng
- ✅ **Authentication**: Tích hợp với Auth Service

## 🛠 Cài đặt

### 1. Cài đặt dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Cấu hình database
Tạo file `.env` với nội dung:
```env
# Server Configuration
PORT=3003

# Database Configuration  
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=your_database_name

# Authentication Service
AUTH_SERVICE_URL=http://localhost:3001
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=15m
```

### 3. Chạy migration và seeder
```bash
# Chạy migration để tạo các bảng
npm run migration:run

# Thêm dữ liệu mẫu
npm run seed:simple

# Kiểm tra dữ liệu đã được thêm
npm run db:check
```

### 4. Chạy ứng dụng
```bash
# Development mode
npm run start:dev

# Production mode  
npm run start:prod
```

## 📊 Database Schema

### Categories (Danh mục)
- `id`: ID tự tăng
- `name`: Tên danh mục
- `description`: Mô tả danh mục
- `code`: Mã danh mục (unique)
- `is_active`: Trạng thái hoạt động

### Products (Sản phẩm)
- `id`: ID tự tăng
- `name`: Tên sản phẩm
- `description`: Mô tả sản phẩm
- `sku`: Mã sản phẩm (unique)
- `barcode`: Mã vạch
- `price`: Giá bán
- `cost_price`: Giá gốc
- `unit`: Đơn vị tính
- `min_stock_level`: Mức tồn kho tối thiểu
- `max_stock_level`: Mức tồn kho tối đa
- `category_id`: Liên kết đến danh mục

### Warehouses (Kho hàng)
- `id`: ID tự tăng
- `name`: Tên kho
- `code`: Mã kho (unique)
- `address`: Địa chỉ
- `phone`: Số điện thoại
- `email`: Email liên hệ
- `manager_name`: Tên quản lý kho

### Inventory Items (Tồn kho)
- `id`: ID tự tăng
- `quantity`: Số lượng tồn kho
- `reserved_quantity`: Số lượng đã đặt trước
- `location`: Vị trí trong kho
- `product_id`: Liên kết đến sản phẩm
- `warehouse_id`: Liên kết đến kho hàng
- `last_stock_check`: Lần kiểm kho cuối

### Inventory Transactions (Giao dịch tồn kho)
- `id`: ID tự tăng
- `type`: Loại giao dịch (IN/OUT/ADJUSTMENT)
- `quantity`: Số lượng thay đổi
- `quantity_before`: Số lượng trước khi giao dịch
- `quantity_after`: Số lượng sau khi giao dịch
- `reference`: Mã tham chiếu
- `notes`: Ghi chú
- `user_id`: ID người thực hiện
- `inventory_item_id`: Liên kết đến item tồn kho

## 🚀 Sử dụng Services

### ProductService
```typescript
// Lấy tất cả sản phẩm
const products = await productService.findAll();

// Tìm sản phẩm theo ID
const product = await productService.findById(1);

// Tìm sản phẩm theo SKU
const product = await productService.findBySku('IPH15PM256');

// Tìm sản phẩm thiếu hàng
const lowStockProducts = await productService.getLowStockProducts();
```

### InventoryService
```typescript
// Nhập hàng
await inventoryService.adjustStock(
  productId, 
  warehouseId, 
  100, 
  TransactionType.IN,
  'PO-2023-001',
  'Nhập hàng từ nhà cung cấp'
);

// Xuất hàng
await inventoryService.adjustStock(
  productId, 
  warehouseId, 
  -50, 
  TransactionType.OUT,
  'SO-2023-001',
  'Bán hàng cho khách'
);

// Đặt trước hàng hóa
await inventoryService.reserveStock(productId, warehouseId, 10);

// Báo cáo hàng thiếu
const lowStockReport = await inventoryService.getLowStockReport();
```

## 📝 Scripts có sẵn

- `npm run build`: Build ứng dụng
- `npm run start`: Chạy ứng dụng
- `npm run start:dev`: Chạy ở chế độ development với auto-reload
- `npm run migration:run`: Chạy migration
- `npm run migration:create`: Tạo migration mới
- `npm run seed:simple`: Thêm dữ liệu mẫu
- `npm run db:check`: Kiểm tra dữ liệu trong database
- `npm run db:setup`: Chạy migration + seeder

## 🎯 Dữ liệu mẫu

Hệ thống đi kèm với dữ liệu mẫu bao gồm:
- **5 danh mục**: Điện tử, Thời trang, Sách, Gia dụng, Thể thao
- **3 kho hàng**: Kho Trung Tâm (TP.HCM), Kho Miền Bắc (Hà Nội), Kho Miền Tây (Cần Thơ)
- **16+ sản phẩm** với các thông tin chi tiết
- **48 inventory items** với số lượng tồn kho ngẫu nhiên
- **60+ giao dịch nhập kho ban đầu**

## 🔧 API Endpoints

Ứng dụng expose các REST APIs để:
- Quản lý sản phẩm: `/products/*`
- Quản lý danh mục: `/categories/*`  
- Quản lý kho hàng: `/warehouses/*`
- Quản lý tồn kho: `/inventory/*`
- Lịch sử giao dịch: `/transactions/*`

## 🏗 Architecture

- **Framework**: NestJS (Node.js)
- **Database**: MySQL với TypeORM
- **Authentication**: JWT Token với Auth Service
- **Validation**: Class-validator
- **Documentation**: Swagger/OpenAPI

## 📄 License

Private License - Hemidi Company
