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
      script: "sh",
      args: "-c 'npm run build && serve -s build'",
      cwd: "frontend",
      watch: false,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
