# 🐳 Docker Services for Local Development

This document provides a comprehensive guide for setting up all required services using Docker for local development of the Open Banking NestJS Backend.

## 📋 Overview

This setup provides a complete local development environment using Docker containers for all services that would normally be hosted on AWS in production. This allows developers to work offline and have full control over their development environment.

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/your-org/open-banking-backend.git
cd open-banking-backend

# Start all services
docker-compose up -d

# Run database migrations
docker-compose exec api npm run migration:run

# Seed the database
docker-compose exec api npm run seed

# Access the API
curl http://localhost:3001/health
```

## 🗄️ Database Services

### PostgreSQL (Primary Database)
- **Service**: `postgres`
- **Port**: `5432`
- **Database**: `openbanking`
- **Username**: `postgres`
- **Password**: `postgres`
- **Volume**: `postgres_data:/var/lib/postgresql/data`
- **Admin Tool**: pgAdmin (port `5050`)

**Environment Variables:**
```env
POSTGRES_DB=openbanking
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
```

### Redis (Caching & Session Storage)
- **Service**: `redis`
- **Port**: `6379`
- **Password**: `redis123`
- **Volume**: `redis_data:/data`
- **Admin Tool**: Redis Commander (port `8081`)

**Environment Variables:**
```env
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=redis123
```

### MongoDB (Document Storage)
- **Service**: `mongodb`
- **Port**: `27017`
- **Database**: `openbanking_docs`
- **Username**: `mongo`
- **Password**: `mongo123`
- **Volume**: `mongodb_data:/data/db`
- **Admin Tool**: Mongo Express (port `8082`)

**Environment Variables:**
```env
MONGODB_URI=mongodb://mongo:mongo123@mongodb:27017/openbanking_docs
```

## 📧 Message Queue Services

### RabbitMQ (Message Broker)
- **Service**: `rabbitmq`
- **Port**: `5672` (AMQP)
- **Management UI**: `15672`
- **Username**: `admin`
- **Password**: `admin123`
- **Volume**: `rabbitmq_data:/var/lib/rabbitmq`

**Environment Variables:**
```env
RABBITMQ_HOST=rabbitmq
RABBITMQ_PORT=5672
RABBITMQ_USER=admin
RABBITMQ_PASS=admin123
```

### Apache Kafka (Event Streaming)
- **Service**: `kafka`
- **Port**: `9092`
- **Zookeeper**: `2181`
- **Admin Tool**: Kafdrop (port `9000`)
- **Volume**: `kafka_data:/var/lib/kafka/data`

**Environment Variables:**
```env
KAFKA_BROKERS=kafka:9092
KAFKA_ZOOKEEPER=kafka:2181
```

## 🔍 Monitoring & Logging Services

### Prometheus (Metrics Collection)
- **Service**: `prometheus`
- **Port**: `9090`
- **Config**: `./monitoring/prometheus.yml`
- **Volume**: `prometheus_data:/prometheus`

### Grafana (Metrics Visualization)
- **Service**: `grafana`
- **Port**: `3000`
- **Username**: `admin`
- **Password**: `admin`
- **Volume**: `grafana_data:/var/lib/grafana`

### Elasticsearch (Log Aggregation)
- **Service**: `elasticsearch`
- **Port**: `9200`
- **Volume**: `elasticsearch_data:/usr/share/elasticsearch/data`

### Kibana (Log Visualization)
- **Service**: `kibana`
- **Port**: `5601`
- **Elasticsearch URL**: `http://elasticsearch:9200`

### Logstash (Log Processing)
- **Service**: `logstash`
- **Port**: `5044` (Beats)
- **Config**: `./monitoring/logstash.conf`

### Filebeat (Log Shipper)
- **Service**: `filebeat`
- **Config**: `./monitoring/filebeat.yml`

## 🔐 Security & Authentication Services

### Keycloak (Identity & Access Management)
- **Service**: `keycloak`
- **Port**: `8080`
- **Admin Console**: `http://localhost:8080/auth`
- **Username**: `admin`
- **Password**: `admin`
- **Database**: PostgreSQL
- **Volume**: `keycloak_data:/opt/jboss/keycloak/standalone/data`

**Environment Variables:**
```env
KEYCLOAK_URL=http://localhost:8080/auth
KEYCLOAK_REALM=openbanking
KEYCLOAK_CLIENT_ID=openbanking-api
KEYCLOAK_CLIENT_SECRET=your-client-secret
```

### Vault (Secrets Management)
- **Service**: `vault`
- **Port**: `8200`
- **UI**: `http://localhost:8200`
- **Token**: `root`
- **Volume**: `vault_data:/vault/file`

**Environment Variables:**
```env
VAULT_ADDR=http://vault:8200
VAULT_TOKEN=root
```

## 📁 File Storage Services

### MinIO (S3-Compatible Storage)
- **Service**: `minio`
- **Port**: `9000` (API)
- **Console**: `9001`
- **Access Key**: `minioadmin`
- **Secret Key**: `minioadmin`
- **Volume**: `minio_data:/data`

**Environment Variables:**
```env
MINIO_ENDPOINT=minio:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=openbanking-documents
MINIO_USE_SSL=false
```

## 🔧 Development Tools

### MailHog (Email Testing)
- **Service**: `mailhog`
- **Port**: `1025` (SMTP)
- **UI**: `8025`
- **Volume**: `mailhog_data:/tmp`

### LocalStack (AWS Services Emulation)
- **Service**: `localstack`
- **Port**: `4566`
- **Services**: S3, SQS, SNS, DynamoDB, Lambda, etc.
- **Volume**: `localstack_data:/tmp/localstack`

**Environment Variables:**
```env
AWS_ENDPOINT=http://localhost:4566
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
AWS_REGION=us-east-1
```

### WireMock (API Mocking)
- **Service**: `wiremock`
- **Port**: `8080`
- **Admin**: `8080/__admin`
- **Mappings**: `./mocks/mappings`
- **Volume**: `wiremock_data:/home/wiremock`

## 📊 Analytics & Business Intelligence

### Apache Superset (Data Visualization)
- **Service**: `superset`
- **Port**: `8088`
- **Username**: `admin`
- **Password**: `admin`
- **Database**: PostgreSQL

### Metabase (Business Intelligence)
- **Service**: `metabase`
- **Port**: `3000`
- **Database**: PostgreSQL
- **Volume**: `metabase_data:/metabase-data`

## 🔄 API Gateway & Load Balancer

### Kong (API Gateway)
- **Service**: `kong`
- **Port**: `8000` (HTTP), `8443` (HTTPS)
- **Admin**: `8001`
- **Database**: PostgreSQL
- **Volume**: `kong_data:/usr/local/kong`

### Nginx (Load Balancer)
- **Service**: `nginx`
- **Port**: `80`, `443`
- **Config**: `./nginx/nginx.conf`
- **Volume**: `nginx_data:/var/log/nginx`

## 🧪 Testing Services

### Selenium (Browser Testing)
- **Service**: `selenium-hub`
- **Port**: `4444`
- **Chrome**: `4442`
- **Firefox**: `4443`

### JMeter (Performance Testing)
- **Service**: `jmeter`
- **Port**: `60000`
- **Config**: `./testing/jmeter/`

## 📱 Mobile Development

### Appium (Mobile Testing)
- **Service**: `appium`
- **Port**: `4723`
- **Config**: `./testing/appium/`

## 🗂️ Complete Docker Compose Configuration

```yaml
version: '3.8'

services:
  # Database Services
  postgres:
    image: postgres:15-alpine
    container_name: openbanking-postgres
    environment:
      POSTGRES_DB: openbanking
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - openbanking-network

  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: openbanking-pgadmin
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@openbanking.com
      PGADMIN_DEFAULT_PASSWORD: admin
    ports:
      - "5050:80"
    depends_on:
      - postgres
    networks:
      - openbanking-network

  redis:
    image: redis:7-alpine
    container_name: openbanking-redis
    command: redis-server --requirepass redis123
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - openbanking-network

  redis-commander:
    image: rediscommander/redis-commander:latest
    container_name: openbanking-redis-commander
    environment:
      REDIS_HOSTS: local:redis:6379:0:redis123
    ports:
      - "8081:8081"
    depends_on:
      - redis
    networks:
      - openbanking-network

  mongodb:
    image: mongo:6
    container_name: openbanking-mongodb
    environment:
      MONGO_INITDB_ROOT_USERNAME: mongo
      MONGO_INITDB_ROOT_PASSWORD: mongo123
      MONGO_INITDB_DATABASE: openbanking_docs
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    networks:
      - openbanking-network

  mongo-express:
    image: mongo-express:latest
    container_name: openbanking-mongo-express
    environment:
      ME_CONFIG_MONGODB_ADMINUSERNAME: mongo
      ME_CONFIG_MONGODB_ADMINPASSWORD: mongo123
      ME_CONFIG_MONGODB_URL: mongodb://mongo:mongo123@mongodb:27017/
    ports:
      - "8082:8081"
    depends_on:
      - mongodb
    networks:
      - openbanking-network

  # Message Queue Services
  rabbitmq:
    image: rabbitmq:3-management-alpine
    container_name: openbanking-rabbitmq
    environment:
      RABBITMQ_DEFAULT_USER: admin
      RABBITMQ_DEFAULT_PASS: admin123
    ports:
      - "5672:5672"
      - "15672:15672"
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq
    networks:
      - openbanking-network

  zookeeper:
    image: confluentinc/cp-zookeeper:latest
    container_name: openbanking-zookeeper
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000
    ports:
      - "2181:2181"
    networks:
      - openbanking-network

  kafka:
    image: confluentinc/cp-kafka:latest
    container_name: openbanking-kafka
    depends_on:
      - zookeeper
    ports:
      - "9092:9092"
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:29092,PLAINTEXT_HOST://localhost:9092
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT
      KAFKA_INTER_BROKER_LISTENER_NAME: PLAINTEXT
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
    volumes:
      - kafka_data:/var/lib/kafka/data
    networks:
      - openbanking-network

  kafdrop:
    image: obsidiandynamics/kafdrop:latest
    container_name: openbanking-kafdrop
    depends_on:
      - kafka
    ports:
      - "9000:9000"
    environment:
      KAFKA_BROKERCONNECT: kafka:29092
      JVM_OPTS: "-Xms32M -Xmx64M"
      SERVER_SERVLET_CONTEXTPATH: "/"
    networks:
      - openbanking-network

  # Monitoring Services
  prometheus:
    image: prom/prometheus:latest
    container_name: openbanking-prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
      - '--storage.tsdb.retention.time=200h'
      - '--web.enable-lifecycle'
    networks:
      - openbanking-network

  grafana:
    image: grafana/grafana:latest
    container_name: openbanking-grafana
    ports:
      - "3000:3000"
    environment:
      GF_SECURITY_ADMIN_USER: admin
      GF_SECURITY_ADMIN_PASSWORD: admin
    volumes:
      - grafana_data:/var/lib/grafana
      - ./monitoring/grafana/provisioning:/etc/grafana/provisioning
    networks:
      - openbanking-network

  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.8.0
    container_name: openbanking-elasticsearch
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    ports:
      - "9200:9200"
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data
    networks:
      - openbanking-network

  kibana:
    image: docker.elastic.co/kibana/kibana:8.8.0
    container_name: openbanking-kibana
    ports:
      - "5601:5601"
    environment:
      ELASTICSEARCH_HOSTS: http://elasticsearch:9200
    depends_on:
      - elasticsearch
    networks:
      - openbanking-network

  logstash:
    image: docker.elastic.co/logstash/logstash:8.8.0
    container_name: openbanking-logstash
    ports:
      - "5044:5044"
    volumes:
      - ./monitoring/logstash.conf:/usr/share/logstash/pipeline/logstash.conf
    depends_on:
      - elasticsearch
    networks:
      - openbanking-network

  filebeat:
    image: docker.elastic.co/beats/filebeat:8.8.0
    container_name: openbanking-filebeat
    volumes:
      - ./monitoring/filebeat.yml:/usr/share/filebeat/filebeat.yml
      - ./logs:/var/log/openbanking
    depends_on:
      - logstash
    networks:
      - openbanking-network

  # Security Services
  keycloak:
    image: quay.io/keycloak/keycloak:latest
    container_name: openbanking-keycloak
    environment:
      KEYCLOAK_ADMIN: admin
      KEYCLOAK_ADMIN_PASSWORD: admin
      KC_DB: postgres
      KC_DB_URL: jdbc:postgresql://postgres:5432/keycloak
      KC_DB_USERNAME: postgres
      KC_DB_PASSWORD: postgres
    ports:
      - "8080:8080"
    command: start-dev
    depends_on:
      - postgres
    volumes:
      - keycloak_data:/opt/keycloak/data
    networks:
      - openbanking-network

  vault:
    image: vault:latest
    container_name: openbanking-vault
    ports:
      - "8200:8200"
    environment:
      VAULT_DEV_ROOT_TOKEN_ID: root
      VAULT_DEV_LISTEN_ADDRESS: 0.0.0.0:8200
    command: server -dev
    volumes:
      - vault_data:/vault/file
    networks:
      - openbanking-network

  # File Storage
  minio:
    image: minio/minio:latest
    container_name: openbanking-minio
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    command: server /data --console-address ":9001"
    volumes:
      - minio_data:/data
    networks:
      - openbanking-network

  # Development Tools
  mailhog:
    image: mailhog/mailhog:latest
    container_name: openbanking-mailhog
    ports:
      - "1025:1025"
      - "8025:8025"
    volumes:
      - mailhog_data:/tmp
    networks:
      - openbanking-network

  localstack:
    image: localstack/localstack:latest
    container_name: openbanking-localstack
    ports:
      - "4566:4566"
    environment:
      SERVICES: s3,sqs,sns,dynamodb,lambda,apigateway,cloudwatch
      DEBUG: 1
      DATA_DIR: /tmp/localstack/data
    volumes:
      - localstack_data:/tmp/localstack
    networks:
      - openbanking-network

  wiremock:
    image: wiremock/wiremock:latest
    container_name: openbanking-wiremock
    ports:
      - "8080:8080"
    volumes:
      - ./mocks/mappings:/home/wiremock/mappings
      - wiremock_data:/home/wiremock
    networks:
      - openbanking-network

  # Analytics
  superset:
    image: apache/superset:latest
    container_name: openbanking-superset
    ports:
      - "8088:8088"
    environment:
      SUPERSET_SECRET_KEY: your-secret-key
    depends_on:
      - postgres
    networks:
      - openbanking-network

  metabase:
    image: metabase/metabase:latest
    container_name: openbanking-metabase
    ports:
      - "3000:3000"
    environment:
      MB_DB_TYPE: postgres
      MB_DB_DBNAME: metabase
      MB_DB_PORT: 5432
      MB_DB_USER: postgres
      MB_DB_PASS: postgres
      MB_DB_HOST: postgres
    depends_on:
      - postgres
    volumes:
      - metabase_data:/metabase-data
    networks:
      - openbanking-network

  # API Gateway
  kong:
    image: kong:latest
    container_name: openbanking-kong
    environment:
      KONG_DATABASE: postgres
      KONG_PG_HOST: postgres
      KONG_PG_USER: postgres
      KONG_PG_PASSWORD: postgres
      KONG_PG_DATABASE: kong
      KONG_PROXY_ACCESS_LOG: /dev/stdout
      KONG_ADMIN_ACCESS_LOG: /dev/stdout
      KONG_PROXY_ERROR_LOG: /dev/stderr
      KONG_ADMIN_ERROR_LOG: /dev/stderr
      KONG_ADMIN_LISTEN: 0.0.0.0:8001
      KONG_ADMIN_GUI_URL: http://localhost:8002
    ports:
      - "8000:8000"
      - "8443:8443"
      - "8001:8001"
      - "8002:8002"
    depends_on:
      - postgres
    volumes:
      - kong_data:/usr/local/kong
    networks:
      - openbanking-network

  nginx:
    image: nginx:alpine
    container_name: openbanking-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - nginx_data:/var/log/nginx
    networks:
      - openbanking-network

  # Testing Services
  selenium-hub:
    image: selenium/hub:4.10.0
    container_name: openbanking-selenium-hub
    ports:
      - "4444:4444"
    networks:
      - openbanking-network

  selenium-chrome:
    image: selenium/node-chrome:4.10.0
    container_name: openbanking-selenium-chrome
    depends_on:
      - selenium-hub
    environment:
      SE_EVENT_BUS_HOST: selenium-hub
      SE_EVENT_BUS_PUBLISH_PORT: 4442
      SE_EVENT_BUS_SUBSCRIBE_PORT: 4443
    networks:
      - openbanking-network

  selenium-firefox:
    image: selenium/node-firefox:4.10.0
    container_name: openbanking-selenium-firefox
    depends_on:
      - selenium-hub
    environment:
      SE_EVENT_BUS_HOST: selenium-hub
      SE_EVENT_BUS_PUBLISH_PORT: 4442
      SE_EVENT_BUS_SUBSCRIBE_PORT: 4443
    networks:
      - openbanking-network

  jmeter:
    image: justb4/jmeter:latest
    container_name: openbanking-jmeter
    ports:
      - "60000:60000"
    volumes:
      - ./testing/jmeter:/tests
    networks:
      - openbanking-network

  appium:
    image: appium/appium:latest
    container_name: openbanking-appium
    ports:
      - "4723:4723"
    volumes:
      - ./testing/appium:/app
    networks:
      - openbanking-network

  # Main Application
  api:
    build: .
    container_name: openbanking-api
    ports:
      - "3001:3001"
    environment:
      NODE_ENV: development
      PORT: 3001
      # Database
      POSTGRES_HOST: postgres
      POSTGRES_PORT: 5432
      POSTGRES_DB: openbanking
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      # Redis
      REDIS_HOST: redis
      REDIS_PORT: 6379
      REDIS_PASSWORD: redis123
      # MongoDB
      MONGODB_URI: mongodb://mongo:mongo123@mongodb:27017/openbanking_docs
      # RabbitMQ
      RABBITMQ_HOST: rabbitmq
      RABBITMQ_PORT: 5672
      RABBITMQ_USER: admin
      RABBITMQ_PASS: admin123
      # Kafka
      KAFKA_BROKERS: kafka:9092
      # MinIO
      MINIO_ENDPOINT: minio:9000
      MINIO_ACCESS_KEY: minioadmin
      MINIO_SECRET_KEY: minioadmin
      MINIO_BUCKET: openbanking-documents
      MINIO_USE_SSL: false
      # Keycloak
      KEYCLOAK_URL: http://keycloak:8080/auth
      KEYCLOAK_REALM: openbanking
      KEYCLOAK_CLIENT_ID: openbanking-api
      # Vault
      VAULT_ADDR: http://vault:8200
      VAULT_TOKEN: root
      # MailHog
      SMTP_HOST: mailhog
      SMTP_PORT: 1025
      # LocalStack
      AWS_ENDPOINT: http://localstack:4566
      AWS_ACCESS_KEY_ID: test
      AWS_SECRET_ACCESS_KEY: test
      AWS_REGION: us-east-1
    depends_on:
      - postgres
      - redis
      - mongodb
      - rabbitmq
      - kafka
      - minio
      - keycloak
      - vault
      - mailhog
      - localstack
    volumes:
      - .:/app
      - /app/node_modules
    networks:
      - openbanking-network

volumes:
  postgres_data:
  redis_data:
  mongodb_data:
  rabbitmq_data:
  kafka_data:
  prometheus_data:
  grafana_data:
  elasticsearch_data:
  keycloak_data:
  vault_data:
  minio_data:
  mailhog_data:
  localstack_data:
  wiremock_data:
  metabase_data:
  kong_data:
  nginx_data:

networks:
  openbanking-network:
    driver: bridge
```

## 🔧 Service URLs & Access

| Service | URL | Username | Password |
|---------|-----|----------|----------|
| **API** | http://localhost:3001 | - | - |
| **API Docs** | http://localhost:3001/api-docs | - | - |
| **pgAdmin** | http://localhost:5050 | admin@openbanking.com | admin |
| **Redis Commander** | http://localhost:8081 | - | - |
| **Mongo Express** | http://localhost:8082 | - | - |
| **RabbitMQ Management** | http://localhost:15672 | admin | admin123 |
| **Kafdrop** | http://localhost:9000 | - | - |
| **Prometheus** | http://localhost:9090 | - | - |
| **Grafana** | http://localhost:3000 | admin | admin |
| **Kibana** | http://localhost:5601 | - | - |
| **Keycloak** | http://localhost:8080 | admin | admin |
| **Vault** | http://localhost:8200 | - | root |
| **MinIO Console** | http://localhost:9001 | minioadmin | minioadmin |
| **MailHog** | http://localhost:8025 | - | - |
| **LocalStack** | http://localhost:4566 | - | - |
| **WireMock** | http://localhost:8080 | - | - |
| **Superset** | http://localhost:8088 | admin | admin |
| **Metabase** | http://localhost:3000 | - | - |
| **Kong Admin** | http://localhost:8001 | - | - |
| **Kong GUI** | http://localhost:8002 | - | - |

## 🚀 Development Workflow

### 1. Start Development Environment
```bash
# Start all services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f api
```

### 2. Database Setup
```bash
# Run migrations
docker-compose exec api npm run migration:run

# Seed database
docker-compose exec api npm run seed

# Access database directly
docker-compose exec postgres psql -U postgres -d openbanking
```

### 3. Development Commands
```bash
# Install dependencies
docker-compose exec api npm install

# Run tests
docker-compose exec api npm run test

# Run linting
docker-compose exec api npm run lint

# Build application
docker-compose exec api npm run build
```

### 4. Monitoring & Debugging
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f postgres redis api

# Access service shell
docker-compose exec api sh
docker-compose exec postgres psql -U postgres
```

## 🔧 Configuration Files

### Prometheus Configuration
```yaml
# monitoring/prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'openbanking-api'
    static_configs:
      - targets: ['api:3001']
    metrics_path: '/metrics'
```

### Grafana Dashboards
```bash
# Create monitoring directory
mkdir -p monitoring/grafana/provisioning/dashboards
mkdir -p monitoring/grafana/provisioning/datasources

# Add dashboard configurations
# monitoring/grafana/provisioning/datasources/prometheus.yml
# monitoring/grafana/provisioning/dashboards/openbanking.yml
```

### Nginx Configuration
```nginx
# nginx/nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream api_backend {
        server api:3001;
    }

    server {
        listen 80;
        server_name localhost;

        location / {
            proxy_pass http://api_backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
```

## 🧪 Testing with Docker Services

### Integration Tests
```bash
# Run tests with all services
docker-compose exec api npm run test:e2e

# Run specific test suite
docker-compose exec api npm run test:integration
```

### Performance Testing
```bash
# Run JMeter tests
docker-compose exec jmeter jmeter -n -t /tests/openbanking-api.jmx -l /tests/results.jtl

# View results
docker-compose exec jmeter jmeter -g /tests/results.jtl -o /tests/report
```

### Browser Testing
```bash
# Run Selenium tests
docker-compose exec api npm run test:browser
```

## 🔍 Troubleshooting

### Common Issues

1. **Port Conflicts**
   ```bash
   # Check what's using a port
   netstat -tulpn | grep :3001
   
   # Stop conflicting service
   sudo systemctl stop conflicting-service
   ```

2. **Service Not Starting**
   ```bash
   # Check service logs
   docker-compose logs service-name
   
   # Restart specific service
   docker-compose restart service-name
   ```

3. **Database Connection Issues**
   ```bash
   # Check database status
   docker-compose exec postgres pg_isready -U postgres
   
   # Reset database
   docker-compose down -v
   docker-compose up -d
   ```

4. **Memory Issues**
   ```bash
   # Increase Docker memory limit
   # Docker Desktop > Settings > Resources > Memory: 8GB
   ```

### Health Checks
```bash
# API health check
curl http://localhost:3001/health

# Database health check
docker-compose exec postgres pg_isready -U postgres

# Redis health check
docker-compose exec redis redis-cli ping
```

## 📚 Additional Resources

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [NestJS Documentation](https://docs.nestjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Redis Documentation](https://redis.io/documentation)
- [Keycloak Documentation](https://www.keycloak.org/documentation)
- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)

## 🤝 Contributing

When adding new services to the Docker setup:

1. Add the service to `docker-compose.yml`
2. Update this README with service details
3. Add appropriate environment variables
4. Create configuration files if needed
5. Update the service URLs table
6. Test the integration

## 📄 License

This Docker setup is part of the Open Banking Backend project and follows the same license terms.
