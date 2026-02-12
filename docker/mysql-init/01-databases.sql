CREATE DATABASE IF NOT EXISTS auth_service;
CREATE DATABASE IF NOT EXISTS ip_service;

GRANT ALL PRIVILEGES ON auth_service.* TO 'laravel'@'%';
GRANT ALL PRIVILEGES ON ip_service.* TO 'laravel'@'%';

FLUSH PRIVILEGES;
