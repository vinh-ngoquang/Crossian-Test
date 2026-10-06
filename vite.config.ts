import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig, Plugin } from 'vite';

function trackingApiPlugin(): Plugin {
  return {
    name: 'tracking-api-plugin',
    configureServer(server) {
      const dataDir = path.resolve(process.cwd(), 'data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      const eventsFile = path.join(dataDir, 'tracking_events.json');

      const readEvents = (): any[] => {
        try {
          if (fs.existsSync(eventsFile)) {
            const content = fs.readFileSync(eventsFile, 'utf-8');
            return JSON.parse(content);
          }
        } catch (err) {
          console.error('Error reading events from file:', err);
        }
        return [];
      };

      const saveEvents = (events: any[]) => {
        try {
          fs.writeFileSync(eventsFile, JSON.stringify(events, null, 2), 'utf-8');
        } catch (err) {
          console.error('Error writing events to file:', err);
        }
      };

      server.middlewares.use(express.json({ limit: '10mb' }));

      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith('/api/tracking')) {
          return next();
        }

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          return res.end();
        }

        const urlPath = req.url.split('?')[0];

        if (urlPath === '/api/tracking/events' && req.method === 'GET') {
          const events = readEvents();
          res.statusCode = 200;
          return res.end(JSON.stringify({ success: true, events }));
        }

        if (urlPath === '/api/tracking/events' && req.method === 'POST') {
          const newEvent = (req as any).body;
          if (!newEvent || !newEvent.eventName) {
            res.statusCode = 400;
            return res.end(JSON.stringify({ error: 'Invalid event data' }));
          }
          const events = readEvents();
          const existingIndex = events.findIndex((e: any) => e.id === newEvent.id);
          if (existingIndex === -1) {
            events.unshift(newEvent);
            if (events.length > 50000) events.length = 50000;
            saveEvents(events);
          }
          res.statusCode = 200;
          return res.end(JSON.stringify({ success: true, count: events.length }));
        }

        if (urlPath === '/api/tracking/sync' && req.method === 'POST') {
          const clientEvents = (req as any).body?.events;
          let events = readEvents();
          if (Array.isArray(clientEvents) && clientEvents.length > 0) {
            const map = new Map<string, any>();
            events.forEach((e: any) => {
              if (e && e.id) map.set(e.id, e);
            });
            clientEvents.forEach((e: any) => {
              if (e && e.id && !map.has(e.id)) {
                map.set(e.id, e);
              }
            });
            events = Array.from(map.values());
            if (events.length > 50000) events.length = 50000;
            saveEvents(events);
          }
          res.statusCode = 200;
          return res.end(JSON.stringify({ success: true, events }));
        }

        if (urlPath === '/api/tracking/events' && req.method === 'DELETE') {
          saveEvents([]);
          res.statusCode = 200;
          return res.end(JSON.stringify({ success: true, events: [] }));
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), trackingApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: {
        ignored: ['**/data/**', '**/data/**/*', '**/*.json', '**/tracking_events.json', /[/\\]data[/\\]/],
      },
    },
  };
});

