const common = {
  script: "backend/scripts/update-post-time.js",
  log_date_format: "YYYY-MM-DD HH:mm Z",
  cron_restart: "*/30 * * * * *",
  autorestart: false,
};

module.exports = {
  apps: [
    {
      name: "subsquare-time-updater-karura",
      ...common,
      env: {
        NODE_ENV: "development",
        CHAIN: "karura",
      },
      env_production: {
        NODE_ENV: "production",
        CHAIN: "karura",
      },
    },
    {
      name: "subsquare-time-updater-khala",
      ...common,
      env: {
        NODE_ENV: "development",
        CHAIN: "khala",
      },
      env_production: {
        NODE_ENV: "production",
        CHAIN: "khala",
      },
    },
    {
      name: "subsquare-time-updater-basilisk",
      ...common,
      env: {
        NODE_ENV: "development",
        CHAIN: "basilisk",
      },
      env_production: {
        NODE_ENV: "production",
        CHAIN: "basilisk",
      },
    },
    {
      name: "subsquare-time-updater-bifrost",
      ...common,
      env: {
        NODE_ENV: "development",
        CHAIN: "bifrost",
      },
      env_production: {
        NODE_ENV: "production",
        CHAIN: "bifrost",
      },
    },
  ],
};
