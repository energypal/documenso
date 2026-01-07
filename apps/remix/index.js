import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import handle from 'hono-react-router-adapter/node';

// import { reactRouter } from 'hono-react-router-adapter/middleware';
// import { defaultGetLoadContext } from 'hono-react-router-adapter/react-router';
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

// const app = new Hono();
// app.route('/', server);
// app.use(async (c, next) => {
//   return reactRouter({
//     build: build,
//     mode: 'production',
//     getLoadContext: defaultGetLoadContext,
//   })(c, next)
// })

export default app;
