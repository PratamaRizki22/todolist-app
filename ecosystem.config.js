module.exports = {
  apps: [
    {
      name: "backend",
      script: "backend/index.js",
      watch: true,
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "frontend",
      script: "npm",
      args: "start",
      cwd: "frontend",
      watch: true,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
