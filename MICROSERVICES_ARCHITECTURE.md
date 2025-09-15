# 🏗️ Thiết kế Microservices Architecture cho Hệ thống Quản lý Tồn kho Đa kênh

## 📋 Tổng quan

Hệ thống được thiết kế để quản lý tồn kho cho doanh nghiệp bán hàng trên nhiều kênh (Amazon, Wayfair, eBay, Shopee, v.v.) với kiến trúc microservices.

## 🏛️ Kiến trúc Microservices

### 1. **Product Master Service** 📦
**Chức năng:**
- Quản lý thông tin sản phẩm tập trung (Master Data)
- Tạo, cập nhật, xóa sản phẩm
- Mapping sản phẩm với các kênh bán hàng
- Sync thông tin sản phẩm đến các kênh

**Database:** MongoDB/PostgreSQL
**Port:** 3001

**Entities:**
- Product Master
- Product Channel Mapping
- Product Categories
- Product Variants (size, color, etc.)

### 2. **Channel Inventory Service** 🛒
**Chức năng:**
- Quản lý tồn kho riêng biệt cho từng kênh
- Theo dõi số lượng available, reserved, sold
- Xử lý allocation rules cho từng kênh
- Quản lý pricing theo kênh

**Database:** PostgreSQL (với sharding theo channel)
**Port:** 3002

**Entities:**
- Channel Inventory
- Channel Configuration
- Allocation Rules
- Price Rules per Channel

### 3. **Warehouse Inventory Service** 🏭
**Chức năng:**
- Quản lý tồn kho thực tế tại các warehouse
- Theo dõi location, batch, expiry date
- Xử lý nhập/xuất kho
- Stock movement tracking

**Database:** PostgreSQL
**Port:** 3003 (Service hiện tại)

### 4. **Inventory Sync Service** 🔄
**Chức năng:**
- Đồng bộ tồn kho giữa warehouse và channels
- Xử lý allocation logic
- Real-time inventory updates
- Conflict resolution

**Database:** Redis (cache) + PostgreSQL (logs)
**Port:** 3004

**Components:**
- Sync Engine
- Allocation Engine
- Event Processor
- Dead Letter Queue

### 5. **Channel Integration Service** 🌐
**Chức năng:**
- Tích hợp APIs của các marketplace (Amazon, Wayfair, etc.)
- Push/Pull inventory data
- Order fulfillment
- Channel-specific business rules

**Database:** PostgreSQL + Redis
**Port:** 3005

### 6. **Reporting & Analytics Service** 📊
**Chức năng:**
- Tạo báo cáo tồn kho theo thời gian thực
- Analytics và forecasting
- KPI dashboard
- Alert system

**Database:** ClickHouse/BigQuery (OLAP)
**Port:** 3006

### 7. **Notification Service** 📢
**Chức năng:**
- Gửi thông báo về low stock, out of stock
- Email, SMS, Slack notifications
- Alert escalation

**Database:** Redis + PostgreSQL
**Port:** 3007

### 8. **API Gateway** 🚪
**Chức năng:**
- Route requests to appropriate services
- Authentication & Authorization
- Rate limiting
- Request/Response transformation

**Port:** 3000

## 🔄 Data Flow Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────┐
│   API Gateway   │────│   Auth Service   │    │  Product Master     │
│     :3000       │    │      :3001       │    │    Service :3001    │
└─────────────────┘    └──────────────────┘    └─────────────────────┘
         │                                                │
         ▼                                                ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────┐
│ Channel Inventory│────│ Inventory Sync   │────│  Warehouse Inventory│
│   Service :3002 │    │  Service :3004   │    │    Service :3003    │
└─────────────────┘    └──────────────────┘    └─────────────────────┘
         │                       │                        │
         ▼                       ▼                        ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────┐
│Channel Integration│  │  Notification    │    │   Reporting &      │
│   Service :3005  │    │  Service :3007   │    │ Analytics :3006     │
└─────────────────┘    └──────────────────┘    └─────────────────────┘
```

## 🎯 Lý do thiết kế như vậy

### **1. Separation of Concerns**
- Mỗi service có một trách nhiệm cụ thể
- Dễ maintain và scale riêng biệt
- Team có thể làm việc độc lập

### **2. Scalability**
- Scale từng service theo nhu cầu
- Channel Inventory Service có thể scale nhiều instances
- Warehouse Service ít cần scale hơn

### **3. Fault Tolerance**
- Một service down không ảnh hưởng toàn bộ hệ thống
- Circuit breaker pattern
- Graceful degradation

### **4. Technology Flexibility**
- Mỗi service có thể dùng tech stack phù hợp
- Database optimization theo use case
- Programming language flexibility

### **5. Business Logic Isolation**
- Channel-specific rules được cô lập
- Warehouse operations độc lập
- Sync logic tập trung

### **6. Data Consistency**
- Event-driven architecture
- Eventual consistency where appropriate
- Strong consistency for critical operations

## 🔧 Communication Patterns

### **Synchronous:**
- REST APIs for CRUD operations
- GraphQL for complex queries
- gRPC for internal service communication

### **Asynchronous:**
- Apache Kafka/RabbitMQ for events
- Redis Pub/Sub for real-time updates
- Message queues for batch processing

## 🛡️ Cross-cutting Concerns

### **Security:**
- JWT authentication
- Service-to-service authentication
- API rate limiting
- Data encryption

### **Monitoring:**
- Distributed tracing (Jaeger)
- Metrics (Prometheus + Grafana)
- Centralized logging (ELK stack)
- Health checks

### **Deployment:**
- Docker containers
- Kubernetes orchestration
- CI/CD pipelines
- Blue-green deployment

## 📈 Scalability Strategy

### **Horizontal Scaling:**
- Load balancers
- Auto-scaling groups
- Database sharding
- Read replicas

### **Caching Strategy:**
- Redis for session/auth cache
- CDN for static content
- Application-level caching
- Database query caching

### **Performance Optimization:**
- Async processing for heavy operations
- Batch operations where possible
- Connection pooling
- Query optimization
