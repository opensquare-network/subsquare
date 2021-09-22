module.exports = {
  apps: [
    {
      name: "subsquare-time-updater-karura",
      script: "backend/scripts/update-post-time.js",
      log_date_format: "YYYY-MM-DD HH:mm Z",
      cron_restart: "*/30 * * * * *",
      autorestart: false,
      env: {
        NODE_ENV: "development",
        CHAIN: "karura"
      },
      env_production: {
        NODE_ENV: "production",
        CHAIN: "karura"
      },
    },

  ],
};
