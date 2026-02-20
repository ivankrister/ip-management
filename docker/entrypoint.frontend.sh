#!/bin/sh
set -e

# Install npm dependencies if node_modules folder doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing npm dependencies..."
    npm install
fi

# Execute the main command
exec "$@"
