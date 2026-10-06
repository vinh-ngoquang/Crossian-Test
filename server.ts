import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  // Storage path for shared tracking events
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

  // API endpoints:
  app.get('/api/tracking/events', (_req, res) => {
    const events = readEvents();
    res.json({ success: true, events });
  });

  app.post('/api/tracking/events', (req, res) => {
    const newEvent = req.body;
    if (!newEvent || !newEvent.eventName) {
      return res.status(400).json({ error: 'Invalid event data' });
    }
    const events = readEvents();
    const existingIndex = events.findIndex((e: any) => e.id === newEvent.id);
    if (existingIndex === -1) {
      events.unshift(newEvent);
      if (events.length > 50000) {
        events.length = 50000;
      }
      saveEvents(events);
    }
    res.json({ success: true, count: events.length });
  });

  app.post('/api/tracking/sync', (req, res) => {
    const clientEvents = req.body?.events;
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
      events = Array.from(map.values()).sort((a: any, b: any) => {
        return (b.rawTimestamp || 0) - (a.rawTimestamp || 0);
      });
      if (events.length > 50000) {
        events.length = 50000;
      }
      saveEvents(events);
    }
    res.json({ success: true, events });
  });

  app.delete('/api/tracking/events', (_req, res) => {
    saveEvents([]);
    res.json({ success: true, events: [] });
  });

  const isProduction = process.env.NODE_ENV === 'production';
  const distDir = path.resolve(process.cwd(), 'dist');

  if (isProduction && fs.existsSync(distDir)) {
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
