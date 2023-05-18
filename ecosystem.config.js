module.exports = [
    {
      script: 'dist/src/main.js',
      name: 'lattice-api-server',
      exec_mode: 'cluster',
      instances: 0,
    },
  ];