#!/bin/sh
set -e

echo "Starting entrypoint script..."

# Generate application key if not set or if it's the placeholder
if [ -z "$APP_KEY" ] || [ "$APP_KEY" = "base64:YOUR_GENERATED_KEY_HERE" ]; then
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
php artisan optimize

# Queue restart to ensure workers are using the latest code
echo "Restarting queue workers..."
php artisan queue:restart

echo "Entrypoint script completed. Starting supervisor..."

# Execute the main command (supervisor)
exec "$@"
