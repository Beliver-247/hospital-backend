import http from 'http';
import app from './app.js';
import { connectDB } from './config/db.js';
import env from './config/env.js';

const server = http.createServer(app);

connectDB()
  .then(() => {
    server.listen(env.port, () => {
      console.log(`[server] http://localhost:${env.port} (env: ${env.nodeEnv})`);
    });
  })
  .catch((err) => {
    console.error('[server] Failed to connect DB:', err?.message);
    process.exit(1);
  });

// graceful shutdown (Ctrl+C)
process.on('SIGINT', () => {
  console.log('\n[server] Shutting down...');
  server.close(() => {
    console.log('[server] Closed.');
    process.exit(0);
  });
});
