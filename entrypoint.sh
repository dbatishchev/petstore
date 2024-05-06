#!/bin/sh

# Run TypeORM migrations
yarn typeorm:run-migrations

# Load fixtures
yarn fixtures:load

# Start the NestJS application
exec node dist/src/main.js