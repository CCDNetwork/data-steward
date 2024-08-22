#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Error handler
handle_error() {
    echo "Error occurred in script at line: $1."
    exit 1
}

# Trap errors and pass the line number to the handle_error function
trap 'handle_error $LINENO' ERR

# Set passwords
remoteDbPass="cljnQhMi1xpt9yQ5"
localDbPass="test123"

# Reset the local database
echo "Resetting the local database..."
docker-compose down || { echo "Failed to stop containers."; exit 1; }
docker-compose up -d || { echo "Failed to start containers."; exit 1; }

# Perform the database restore
echo "Performing the database restore..."
PGPASSWORD="$remoteDbPass" pg_dump -h 168.119.189.177 -U ccddb --format=custom --no-owner ccd > backup.dump || { echo "Failed to backup remote database."; exit 1; }
PGPASSWORD="$localDbPass" pg_restore -h localhost -U ccd-server -d ccd-server --no-owner backup.dump || { echo "Failed to restore local database."; exit 1; }

# Remove dump file
rm backup.dump || { echo "Failed to remove dump file."; exit 1; }
echo "Database restore complete."