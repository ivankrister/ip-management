# IP Address Management System

A microservices-based IP Address management system with Laravel services running on Docker.

## 📋 Architecture

This system consists of the following microservices:
- **Auth Service** - Authentication and authorization
- **IP Service** - IP address management
- **Audit Service** - Activity logging and auditing
- **Gateway Service** - API gateway/proxy
- **Frontend** - React frontend application

## 🚀 Quick Start

### Prerequisites

- Docker (20.10 or higher) with Docker Compose V2

## 💻 Development Environment

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ivankrister/ip-management
   cd ip-management
   ```

2. **Set up environment files**
   ```bash
   # Copy .env.example to .env for each service
   cp auth-service/.env.example auth-service/.env
   cp ip-service/.env.example ip-service/.env
   cp audit-service/.env.example audit-service/.env
   cp gateway-service/.env.example gateway-service/.env
   cp frontend/.env.example frontend/.env
   ```
   
   Configure the frontend API endpoint:
   ```bash
   # frontend/.env
   VITE_API_BASE_URL=http://localhost:8002/api/v1
   ```

3. **Configure JWT Secret**
   
   Generate a random JWT secret key (64 characters recommended):
   ```bash
   # Generate a random JWT secret
   openssl rand -base64 64 | tr -d '\n' && echo
   ```
   
   Example output:
   ```
   gqItZguyLo9V1jIwO500qEXxf89r0n4jmJj1v3AK91rxGIPdGpB1j89B3tlNxmLP
   ```
   
   **Important**: Use the **same** JWT_SECRET value for auth-service, ip-service, and audit-service:
   ```bash
   # Update JWT_SECRET in each service's .env file
   # auth-service/.env
   JWT_SECRET=your_generated_secret_here
   
   # ip-service/.env
   JWT_SECRET=your_generated_secret_here
   
   # audit-service/.env
   JWT_SECRET=your_generated_secret_here
   ```
   
   **Note**: For event-driven architecture, ensure Redis and Queue connections are configured consistently in auth-service, ip-service, and audit-service:
   ```bash
   # auth-service/.env, ip-service/.env, audit-service/.env should have:
   REDIS_HOST=redis
   REDIS_PORT=6379
   QUEUE_CONNECTION=redis
   ```

4. **Start the services**
   ```bash
   docker compose up -d --build
   ```

5. **Run database migrations**
   ```bash
   # Auth Service
   docker compose exec auth-service php artisan migrate --seed
   
   # IP Service
   docker compose exec ip-service php artisan migrate --seed
   
   # Audit Service
   docker compose exec audit-service php artisan migrate --seed
   ```

### Access URLs

- **Frontend**: http://localhost:5173
- **Gateway Service**: http://localhost:8002
- **MySQL Auth**: localhost:3308
- **MySQL IP**: localhost:3309
- **MySQL Audit**: localhost:3310

### Common Commands

```bash
# View logs
docker compose logs -f

# View specific service logs
docker compose logs -f auth-service

# Stop all services
docker compose down

# Stop and remove volumes
docker compose down -v

# Rebuild services
docker compose up -d --build

# Run tests (IP Service only)
docker compose exec ip-service composer run test

# Access service shell
docker compose exec auth-service sh
```

## 🏭 Production Environment

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ivankrister/ip-management
   cd ip-management
   ```

2. **Set up environment files**
   ```bash
   # Copy .env.example to .env for each service
   cp auth-service/.env.example auth-service/.env
   cp ip-service/.env.example ip-service/.env
   cp audit-service/.env.example audit-service/.env
   cp gateway-service/.env.example gateway-service/.env
   cp frontend/.env.example frontend/.env
   ```
   
   Important variables to configure in each .env file:
   - `APP_ENV=production`
   - `APP_DEBUG=false`
   - `DB_USERNAME` and `DB_PASSWORD`
   - Database configurations
   
   Configure the frontend API endpoint for production (using Nginx proxy):
   ```bash
   # frontend/.env
   VITE_API_BASE_URL=http://your-domain.com:8080/api/v1
   ```

3. **Configure JWT Secret**
   
   Generate a random JWT secret key (64 characters recommended):
   ```bash
   # Generate a random JWT secret
   openssl rand -base64 64 | tr -d '\n' && echo
   ```
   
   Example output:
   ```
   gqItZguyLo9V1jIwO500qEXxf89r0n4jmJj1v3AK91rxGIPdGpB1j89B3tlNxmLP
   ```
   
   **Important**: Use the **same** JWT_SECRET value for auth-service, ip-service, and audit-service:
   ```bash
   # Update JWT_SECRET in each service's .env file
   # auth-service/.env
   JWT_SECRET=your_generated_secret_here
   
   # ip-service/.env
   JWT_SECRET=your_generated_secret_here
   
   # audit-service/.env
   JWT_SECRET=your_generated_secret_here
   ```
   
   **Note**: For event-driven architecture, ensure Redis and Queue connections are configured consistently in auth-service, ip-service, and audit-service:
   ```bash
   # auth-service/.env, ip-service/.env, audit-service/.env should have:
   REDIS_HOST=redis
   REDIS_PORT=6379
   QUEUE_CONNECTION=redis
   ```

4. **Start the services**
   ```bash
   docker compose -f docker-compose.prod.yml up -d --build
   ```

5. **Run database migrations**
   ```bash
   # Auth Service
   docker compose -f docker-compose.prod.yml exec auth-service php artisan migrate --force
   
   # IP Service
   docker compose -f docker-compose.prod.yml exec ip-service php artisan migrate --force
   
   # Audit Service
   docker compose -f docker-compose.prod.yml exec audit-service php artisan migrate --force
   ```

### Access URLs

All services are accessible through the Nginx reverse proxy:

- **Application**: http://your-domain.com:8080 (or http://localhost:8080 for local testing)
- **API Gateway**: http://your-domain.com:8080/api

The Nginx proxy handles routing to:
- Frontend application (/)
- Gateway Service (/api)
- Individual microservices (internal)

## 🔧 Troubleshooting

### Services not starting
```bash
# Check service status
docker compose ps

# Check logs for errors
docker compose logs

# Restart specific service
docker compose restart auth-service
```


