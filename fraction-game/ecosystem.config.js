export default {
  apps: [{
    name: 'fraction-game-dev',
    script: 'npm',
    args: 'run dev -- --host 0.0.0.0 --port 3000',
    cwd: '/home/user/webapp/fraction-game',
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    watch: false,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
    log_file: '/home/user/webapp/fraction-game/logs/combined.log',
    out_file: '/home/user/webapp/fraction-game/logs/out.log',
    error_file: '/home/user/webapp/fraction-game/logs/error.log'
  }]
};