#!/bin/bash
# Database Setup Script for E-Commerce API
# This script creates the database and runs migrations

set -e

echo "🚀 E-Commerce API - Database Setup Script"
echo "=========================================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from .env.example...${NC}"
    cp .env.example .env
    echo -e "${YELLOW}Please update .env with your database credentials${NC}"
    exit 1
fi

# Load environment variables
source .env

# Extract database info from DATABASE_URL
# Format: postgresql://username:password@host:port/database
DB_URL=$DATABASE_URL
DB_NAME=${DB_URL##*/}
DB_HOST=$(echo $DB_URL | sed 's|.*@||' | sed 's|:.*||')
DB_USER=$(echo $DB_URL | sed 's|.*://||' | sed 's|:.*||')
DB_PASSWORD=$(echo $DB_URL | sed 's|.*://.*:||' | sed 's|@.*||')
DB_PORT=$(echo $DB_URL | sed 's|.*:||' | sed 's|/.*||')

echo "📍 Database Configuration:"
echo "   Host: $DB_HOST"
echo "   Port: $DB_PORT"
echo "   Database: $DB_NAME"
echo "   User: $DB_USER"

# Create database if it doesn't exist
echo ""
echo -e "${YELLOW}Creating database...${NC}"
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -p $DB_PORT -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1 || \
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -p $DB_PORT -c "CREATE DATABASE $DB_NAME"

echo -e "${GREEN}✅ Database created/verified${NC}"

# Run SQL migrations
echo ""
echo -e "${YELLOW}Running database migrations...${NC}"
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -p $DB_PORT -d $DB_NAME < src/database.sql

echo -e "${GREEN}✅ Migrations completed${NC}"

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Database setup completed! 🎉${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo "📝 Next steps:"
echo "1. Run 'npm install' to install dependencies"
echo "2. Run 'npx ts-node src/seed.ts' to populate sample data"
echo "3. Run 'npm run dev' to start the development server"
echo ""
