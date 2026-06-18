module.exports = {
  apps: [{
    name: 'potters-api',
    cwd: '/var/www/potters/packages/backend',
    script: 'dist/index.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3002,
    },
    error_file: '/var/www/potters/logs/api-error.log',
    out_file: '/var/www/potters/logs/api-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
  }]
};
