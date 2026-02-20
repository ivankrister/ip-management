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


# Generate application key if not set or if it's the placeholder
if [ -z "$APP_KEY" ] || [ "$APP_KEY" = "" ]; then
    echo "Generating application key..."
    php artisan key:generate --force
else
    echo "Application key already set"
fi

# Run migrations
echo "Running database migrations..."
php artisan migrate --force || echo "Migration failed or not applicable"

# Cache configuration for production
echo "Caching configuration..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Application optimization
echo "Optimizing application..."
php artisan optimize:clear

# Queue restart to ensure workers are using the latest code
echo "Restarting queue workers..."
php artisan queue:restart

# Execute the main command
exec "$@"
