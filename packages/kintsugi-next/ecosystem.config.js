const common = {
  script: "backend/scripts/update-post-time.js",
  log_date_format: "YYYY-MM-DD HH:mm Z",
  cron_restart: "*/30 * * * * *",
  autorestart: false,
};

module.exports = {
  apps: [
    {
      name: "subsquare-time-updater-kintsugi",
      ...common,
      env: {
        NODE_ENV: "development",
        CHAIN: "kintsugi",
      },
      env_production: {
        NODE_ENV: "production",
        CHAIN: "kintsugi",
      },
    },
  ],
};
