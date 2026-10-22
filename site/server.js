import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const ROOT = dirname(fileURLToPath(import.meta.url));
const UPSTREAM = 'https://rigx.onrender.com';
const PORT = 3000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'text/javascript; charset=utf-8',
  '.mjs':  'text/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.woff2': 'font/woff2',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.webp': 'image/webp',
  '.ico':  'image/x-icon',
  '.mp4':  'video/mp4',
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const clean = url.pathname.split('?')[0].replace(/^\/+/, '/');

  // ---- local file (ignore cache-busting ?v=...) ----
  // `/` maps to index.html so the root path is served locally, not proxied.
  if (req.method === 'GET') {
    const rel = clean === '/' ? '/index.html' : clean;
    const local = join(ROOT, rel);
    if (existsSync(local) && (await readFile(local).then(() => true).catch(() => false))) {
      try {
        const buf = await readFile(local);
        res.writeHead(200, { 'Content-Type': MIME[extname(local)] ?? 'application/octet-stream' });
        return res.end(buf);
      } catch {}
    }
  }

  // ---- proxy everything else to the live site ----
  const target = UPSTREAM + url.pathname + (url.search || '');
  const isForm = clean.startsWith('/api/');
  const headers = { host: new URL(UPSTREAM).host };
  if (!isForm) headers.accept = '*/*';

  let body = null;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    const chunks = [];
    for await (const c of req) chunks.push(c);
    body = Buffer.concat(chunks);
  }

  try {
    const up = await fetch(target, {
      method: req.method,
      headers,
      body,
      redirect: 'follow',
    });
    const respHeaders = {};
    up.headers.forEach((v, k) => {
      if (!/content-encoding|transfer-encoding|content-length|connection/i.test(k))
        respHeaders[k] = v;
    });
    res.writeHead(up.status, respHeaders);
    const buf = Buffer.from(await up.arrayBuffer());
    res.end(buf);
  } catch (e) {
    res.writeHead(502, { 'Content-Type': 'text/plain' });
    res.end(`Proxy failed: ${e.message}\nTried: ${target}`);
  }
});

server.listen(PORT, () => {
  console.log(`\n  RIGX local — http://localhost:${PORT}\n`);
  console.log(`  Local files served from : ${ROOT}`);
  console.log(`  Anything missing proxied to : ${UPSTREAM}`);
  console.log(`  Form posts (/api/inquiry/*) are proxied to the live server.`);
  console.log(`  Ctrl-C to stop.\n`);
});
