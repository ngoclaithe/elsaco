// PM2 ecosystem — ports 4020 (web) / 4021 (api)
// Kiểm tra port trống trên VPS: ss -tlnp | grep -E '4020|4021'
// Deploy path: /home/elsaco (điều chỉnh nếu khác)

module.exports = {
  apps: [
    {
      name: 'elsaco-api',
      cwd: './backend',
      script: 'dist/main.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 4021,
      },
    },
    {
      name: 'elsaco-web',
      cwd: './frontend',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 4020',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 4020,
      },
    },
  ],
};
