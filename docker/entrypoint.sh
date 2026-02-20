#!/bin/sh
set -e

# Install composer dependencies if vendor folder doesn't exist
if [ ! -d "vendor" ]; then
    echo "Installing composer dependencies..."
    composer install --no-interaction
fi

# Set permissions
chown -R www-data:www-data /var/www/html
chmod -R 755 /var/www/html/storage 2>/dev/null || true
chmod -R 755 /var/www/html/bootstrap/cache 2>/dev/null || true

# Execute the main command
exec "$@"
