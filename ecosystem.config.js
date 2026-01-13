// PM2 Configuration File
// Bu dosyayı sunucuya yükleyin ve PM2 ile kullanın
// Kullanım: pm2 start ecosystem.config.js

module.exports = {
  apps: [
    {
      name: 'mordiem',
      script: 'npm',
      args: 'start',
      cwd: '/home/mordiems/public_html', // Sunucunuzdaki gerçek yol ile değiştirin
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
    },
  ],
};
