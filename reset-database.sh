#!/bin/bash

# Script to reset the database schema for the new entity structure

echo "Resetting database schema..."

# Database connection details from .env
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_USERNAME=${DB_USERNAME:-postgres}
DB_PASSWORD=${DB_PASSWORD:-postgres}
DB_DATABASE=${DB_DATABASE:-tech_help_desk}

# Drop and recreate the database
export PGPASSWORD=$DB_PASSWORD

echo "Dropping existing database..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USERNAME -c "DROP DATABASE IF EXISTS $DB_DATABASE;"

echo "Creating fresh database..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USERNAME -c "CREATE DATABASE $DB_DATABASE;"

echo "Database reset complete! The application will create the new schema on next start."
