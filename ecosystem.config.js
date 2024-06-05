module.exports = {
  apps: [
    {
      name: "backend",
      script: "server.js",
      watch: true,
      env: {
        NODE_ENV: "development",
        PORT: 4001, // 필요한 다른 환경 변수 추가
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 4001, // 필요한 다른 환경 변수 추가
      },
    },
  ],
};
