# 🐳 Docker Services Summary

This document provides a comprehensive overview of all Docker services available for local development of the Open Banking NestJS Backend.

## 📊 Service Overview

| Category | Service | Port | Purpose | Admin UI |
|----------|---------|------|---------|----------|
| **Database** | PostgreSQL | 5432 | Primary database | pgAdmin (5050) |
| **Cache** | Redis | 6379 | Session & cache storage | Redis Commander (8081) |
| **Document DB** | MongoDB | 27017 | Document storage | Mongo Express (8082) |
| **Message Queue** | RabbitMQ | 5672 | Message broker | Management UI (15672) |
| **Event Streaming** | Kafka | 9092 | Event streaming | Kafdrop (9000) |
| **Monitoring** | Prometheus | 9090 | Metrics collection | Built-in |
| **Visualization** | Grafana | 3000 | Metrics visualization | Built-in |
| **Logging** | Elasticsearch | 9200 | Log aggregation | Kibana (5601) |
| **Security** | Keycloak | 8080 | Identity management | Built-in |
| **Secrets** | Vault | 8200 | Secrets management | Built-in |
| **Storage** | MinIO | 9000 | S3-compatible storage | Console (9001) |
| **Email Testing** | MailHog | 1025 | Email testing | UI (8025) |
| **AWS Emulation** | LocalStack | 4566 | AWS services emulation | Built-in |
| **API Mocking** | WireMock | 8083 | API mocking | Admin (8083/__admin) |
| **Analytics** | Superset | 8088 | Data visualization | Built-in |
| **BI** | Metabase | 3002 | Business intelligence | Built-in |
| **API Gateway** | Kong | 8000 | API gateway | Admin (8001) |
| **Load Balancer** | Nginx | 80 | Reverse proxy | - |
| **Testing** | Selenium Hub | 4444 | Browser testing | - |
| **Performance** | JMeter | 60000 | Performance testing | - |
| **Mobile Testing** | Appium | 4723 | Mobile testing | - |

## 🗄️ Database Services

### PostgreSQL (Primary Database)
- **Service**: `postgres`
- **Port**: `5432`
- **Purpose**: Main relational database for user data, accounts, transactions
- **Admin Tool**: pgAdmin at `http://localhost:5050`
- **Credentials**: `admin@openbanking.com` / `admin`

### Redis (Caching & Sessions)
- **Service**: `redis`
- **Port**: `6379`
- **Purpose**: Session storage, caching, real-time data
- **Admin Tool**: Redis Commander at `http://localhost:8081`
- **Password**: `redis123`

### MongoDB (Document Storage)
- **Service**: `mongodb`
- **Port**: `27017`
- **Purpose**: Document storage for logs, analytics, unstructured data
- **Admin Tool**: Mongo Express at `http://localhost:8082`
- **Credentials**: `mongo` / `mongo123`

## 📧 Message Queue Services

### RabbitMQ (Message Broker)
- **Service**: `rabbitmq`
- **Port**: `5672` (AMQP), `15672` (Management)
- **Purpose**: Message queuing for async operations
- **Admin UI**: `http://localhost:15672`
- **Credentials**: `admin` / `admin123`

### Apache Kafka (Event Streaming)
- **Service**: `kafka`
- **Port**: `9092`
- **Purpose**: Event streaming for real-time data processing
- **Admin Tool**: Kafdrop at `http://localhost:9000`
- **Dependencies**: Zookeeper (2181)

## 🔍 Monitoring & Logging Services

### Prometheus (Metrics Collection)
- **Service**: `prometheus`
- **Port**: `9090`
- **Purpose**: Collect and store metrics from all services
- **Configuration**: `./monitoring/prometheus.yml`

### Grafana (Metrics Visualization)
- **Service**: `grafana`
- **Port**: `3000`
- **Purpose**: Create dashboards and visualize metrics
- **Credentials**: `admin` / `admin`

### Elasticsearch (Log Aggregation)
- **Service**: `elasticsearch`
- **Port**: `9200`
- **Purpose**: Centralized log storage and search
- **Security**: Disabled for development

### Kibana (Log Visualization)
- **Service**: `kibana`
- **Port**: `5601`
- **Purpose**: Visualize and analyze logs from Elasticsearch

## 🔐 Security Services

### Keycloak (Identity & Access Management)
- **Service**: `keycloak`
- **Port**: `8080`
- **Purpose**: User authentication, authorization, SSO
- **Admin Console**: `http://localhost:8080/auth`
- **Credentials**: `admin` / `admin`

### Vault (Secrets Management)
- **Service**: `vault`
- **Port**: `8200`
- **Purpose**: Secure storage of secrets, API keys, certificates
- **UI**: `http://localhost:8200`
- **Token**: `root`

## 📁 File Storage Services

### MinIO (S3-Compatible Storage)
- **Service**: `minio`
- **Port**: `9000` (API), `9001` (Console)
- **Purpose**: Object storage for documents, files, backups
- **Console**: `http://localhost:9001`
- **Credentials**: `minioadmin` / `minioadmin`

## 🔧 Development Tools

### MailHog (Email Testing)
- **Service**: `mailhog`
- **Port**: `1025` (SMTP), `8025` (UI)
- **Purpose**: Capture and view emails during development
- **UI**: `http://localhost:8025`

### LocalStack (AWS Services Emulation)
- **Service**: `localstack`
- **Port**: `4566`
- **Purpose**: Emulate AWS services locally (S3, SQS, SNS, etc.)
- **Services**: S3, SQS, SNS, DynamoDB, Lambda, API Gateway, CloudWatch

### WireMock (API Mocking)
- **Service**: `wiremock`
- **Port**: `8083`
- **Purpose**: Mock external APIs for testing
- **Admin**: `http://localhost:8083/__admin`

## 📊 Analytics & Business Intelligence

### Apache Superset (Data Visualization)
- **Service**: `superset`
- **Port**: `8088`
- **Purpose**: Advanced data visualization and analytics
- **Credentials**: `admin` / `admin`

### Metabase (Business Intelligence)
- **Service**: `metabase`
- **Port**: `3002`
- **Purpose**: Business intelligence and reporting
- **Database**: PostgreSQL

## 🔄 API Gateway & Load Balancer

### Kong (API Gateway)
- **Service**: `kong`
- **Port**: `8000` (HTTP), `8443` (HTTPS), `8001` (Admin)
- **Purpose**: API management, rate limiting, authentication
- **Admin**: `http://localhost:8001`

### Nginx (Load Balancer)
- **Service**: `nginx`
- **Port**: `80`, `443`
- **Purpose**: Reverse proxy, load balancing, SSL termination
- **Configuration**: `./nginx/nginx.conf`

## 🧪 Testing Services

### Selenium (Browser Testing)
- **Service**: `selenium-hub`
- **Port**: `4444`
- **Purpose**: Automated browser testing
- **Nodes**: Chrome (4442), Firefox (4443)

### JMeter (Performance Testing)
- **Service**: `jmeter`
- **Port**: `60000`
- **Purpose**: Load testing and performance analysis
- **Configuration**: `./testing/jmeter/`

### Appium (Mobile Testing)
- **Service**: `appium`
- **Port**: `4723`
- **Purpose**: Mobile app testing
- **Configuration**: `./testing/appium/`

## 🚀 Quick Access URLs

### Core Services
- **API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api-docs
- **Health Check**: http://localhost:3001/health

### Database Management
- **pgAdmin**: http://localhost:5050 (admin@openbanking.com/admin)
- **Redis Commander**: http://localhost:8081
- **Mongo Express**: http://localhost:8082

### Message Queues
- **RabbitMQ Management**: http://localhost:15672 (admin/admin123)
- **Kafdrop**: http://localhost:9000

### Monitoring
- **Grafana**: http://localhost:3000 (admin/admin)
- **Prometheus**: http://localhost:9090
- **Kibana**: http://localhost:5601

### Security
- **Keycloak**: http://localhost:8080 (admin/admin)
- **Vault**: http://localhost:8200 (token: root)

### Storage & Tools
- **MinIO Console**: http://localhost:9001 (minioadmin/minioadmin)
- **MailHog**: http://localhost:8025
- **WireMock Admin**: http://localhost:8083/__admin

### Analytics
- **Superset**: http://localhost:8088 (admin/admin)
- **Metabase**: http://localhost:3002

### API Gateway
- **Kong Admin**: http://localhost:8001

## 🔧 Management Commands

### Using the Docker Manager Script
```bash
# Start all services
./scripts/docker-manager.sh start

# Stop all services
./scripts/docker-manager.sh stop

# Restart all services
./scripts/docker-manager.sh restart

# Check service status
./scripts/docker-manager.sh status

# View logs
./scripts/docker-manager.sh logs
./scripts/docker-manager.sh logs api
./scripts/docker-manager.sh logs postgres

# Run database operations
./scripts/docker-manager.sh migrate
./scripts/docker-manager.sh seed

# Run tests
./scripts/docker-manager.sh test

# Clean up everything
./scripts/docker-manager.sh cleanup
```

### Using Docker Compose Directly
```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f
docker-compose logs -f api

# Execute commands in containers
docker-compose exec api npm run test
docker-compose exec postgres psql -U postgres -d openbanking
```

## 📋 Service Dependencies

### Startup Order
1. **Infrastructure**: postgres, redis, mongodb, zookeeper
2. **Message Queues**: rabbitmq, kafka
3. **Monitoring**: prometheus, elasticsearch
4. **Security**: keycloak, vault
5. **Storage**: minio
6. **Tools**: mailhog, localstack, wiremock
7. **Analytics**: superset, metabase
8. **Gateway**: kong, nginx
9. **Testing**: selenium-hub, jmeter, appium
10. **Application**: api

### Health Checks
All critical services include health checks to ensure proper startup order and service availability.

## 🔒 Security Considerations

### Development Environment
- All services use default credentials for easy development
- Security features are disabled where possible
- Services are accessible on localhost only

### Production Considerations
- Change all default passwords
- Enable security features (TLS, authentication)
- Use proper secrets management
- Implement network segmentation
- Enable monitoring and alerting

## 📚 Additional Resources

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [NestJS Documentation](https://docs.nestjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Redis Documentation](https://redis.io/documentation)
- [Keycloak Documentation](https://www.keycloak.org/documentation)
- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
