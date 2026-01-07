import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import handle from 'hono-react-router-adapter/node';

import server from './build/server/hono/server/router.js';
import * as build from './build/server/index.js';

server.use(
  serveStatic({
    root: 'build/client',
    onFound: (path, c) => {
      if (path.startsWith('./build/client/assets')) {
        // Hard cache assets with hashed file names.
        c.header('Cache-Control', 'public, immutable, max-age=31536000');
      } else {
        // Cache with revalidation for rest of static files.
        c.header('Cache-Control', 'public, max-age=0, stale-while-revalidate=86400');
      }
    },
  }),
);

const app = handle(build, server);

export default app;
