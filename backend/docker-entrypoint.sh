#!/bin/sh

# Wait for database to be ready
echo "Waiting for database to be ready..."
npx wait-on tcp:db:5432 -t 30000

# Run Prisma migrations
echo "Running database migrations..."
npx prisma db push

# Start the application
echo "Starting the application..."
node server.js