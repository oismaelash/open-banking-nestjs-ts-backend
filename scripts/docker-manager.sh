#!/bin/bash

# Docker Manager Script for Open Banking Backend
# This script helps manage all Docker services for local development

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
}

# Function to check if Docker Compose is available
check_docker_compose() {
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install it and try again."
        exit 1
    fi
}

# Function to start all services
start_services() {
    print_header "Starting Open Banking Services"
    check_docker
    check_docker_compose
    
    print_status "Starting all services..."
    docker-compose up -d
    
    print_status "Waiting for services to be ready..."
    sleep 30
    
    print_status "Checking service status..."
    docker-compose ps
    
    print_status "Services started successfully!"
    print_status "Access points:"
    echo "  - API: http://localhost:3001"
    echo "  - API Docs: http://localhost:3001/api-docs"
    echo "  - Grafana: http://localhost:3000 (admin/admin)"
    echo "  - Prometheus: http://localhost:9090"
    echo "  - Kibana: http://localhost:5601"
    echo "  - pgAdmin: http://localhost:5050 (admin@openbanking.com/admin)"
    echo "  - Redis Commander: http://localhost:8081"
    echo "  - Mongo Express: http://localhost:8082"
    echo "  - RabbitMQ: http://localhost:15672 (admin/admin123)"
    echo "  - Kafdrop: http://localhost:9000"
    echo "  - MinIO Console: http://localhost:9001 (minioadmin/minioadmin)"
    echo "  - MailHog: http://localhost:8025"
    echo "  - Keycloak: http://localhost:8080 (admin/admin)"
    echo "  - Vault: http://localhost:8200 (token: root)"
}

# Function to stop all services
stop_services() {
    print_header "Stopping Open Banking Services"
    check_docker_compose
    
    print_status "Stopping all services..."
    docker-compose down
    
    print_status "Services stopped successfully!"
}

# Function to restart all services
restart_services() {
    print_header "Restarting Open Banking Services"
    stop_services
    start_services
}

# Function to show service logs
show_logs() {
    print_header "Service Logs"
    check_docker_compose
    
    if [ -z "$1" ]; then
        print_status "Showing logs for all services..."
        docker-compose logs -f
    else
        print_status "Showing logs for service: $1"
        docker-compose logs -f "$1"
    fi
}

# Function to show service status
show_status() {
    print_header "Service Status"
    check_docker_compose
    
    docker-compose ps
}

# Function to clean up everything
cleanup() {
    print_header "Cleaning Up Docker Environment"
    check_docker_compose
    
    print_warning "This will remove all containers, networks, and volumes!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Stopping and removing all containers..."
        docker-compose down -v
        
        print_status "Removing all images..."
        docker-compose down --rmi all
        
        print_status "Cleaning up unused Docker resources..."
        docker system prune -f
        
        print_status "Cleanup completed!"
    else
        print_status "Cleanup cancelled."
    fi
}

# Function to run database migrations
run_migrations() {
    print_header "Running Database Migrations"
    check_docker_compose
    
    print_status "Running migrations..."
    docker-compose exec api npm run migration:run
    
    print_status "Migrations completed!"
}

# Function to seed the database
seed_database() {
    print_header "Seeding Database"
    check_docker_compose
    
    print_status "Seeding database..."
    docker-compose exec api npm run seed
    
    print_status "Database seeding completed!"
}

# Function to run tests
run_tests() {
    print_header "Running Tests"
    check_docker_compose
    
    print_status "Running tests..."
    docker-compose exec api npm run test
    
    print_status "Tests completed!"
}

# Function to build the application
build_app() {
    print_header "Building Application"
    check_docker_compose
    
    print_status "Building application..."
    docker-compose build api
    
    print_status "Application build completed!"
}

# Function to show help
show_help() {
    print_header "Docker Manager Help"
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start       - Start all services"
    echo "  stop        - Stop all services"
    echo "  restart     - Restart all services"
    echo "  status      - Show service status"
    echo "  logs [SERVICE] - Show service logs (all or specific service)"
    echo "  build       - Build the application"
    echo "  migrate     - Run database migrations"
    echo "  seed        - Seed the database"
    echo "  test        - Run tests"
    echo "  cleanup     - Clean up all Docker resources"
    echo "  help        - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start"
    echo "  $0 logs api"
    echo "  $0 logs postgres"
    echo "  $0 migrate"
    echo "  $0 cleanup"
}

# Main script logic
case "${1:-help}" in
    start)
        start_services
        ;;
    stop)
        stop_services
        ;;
    restart)
        restart_services
        ;;
    status)
        show_status
        ;;
    logs)
        show_logs "$2"
        ;;
    build)
        build_app
        ;;
    migrate)
        run_migrations
        ;;
    seed)
        seed_database
        ;;
    test)
        run_tests
        ;;
    cleanup)
        cleanup
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        show_help
        exit 1
        ;;
esac
