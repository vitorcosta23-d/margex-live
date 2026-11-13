'use strict';
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const port = Number(process.env.PORT || 4318);
const publicFiles = new Set(['/index.html', '/formulario.html', '/styles.css', '/app.js', '/form.js', '/config.js', '/pricing.js', '/catalog.js']);
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ttf': 'font/ttf', '.woff2': 'font/woff2', '.woff': 'font/woff' };
const assetExtensions = new Set(['.png', '.jpg', '.jpeg', '.webp', '.svg', '.ttf', '.woff2', '.woff']);
const server = http.createServer((request, response) => {
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('Referrer-Policy', 'no-referrer');
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'none'");
  if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405, { Allow: 'GET, HEAD' }); response.end('Method not allowed'); return; }
  let pathname;
  try { pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname); } catch { response.writeHead(400); response.end('Bad request'); return; }
  if (pathname === '/') pathname = '/index.html';
  const extension = path.extname(pathname).toLowerCase();
  const asset = pathname.startsWith('/assets/') && assetExtensions.has(extension);
  if (pathname.includes('\0') || pathname.includes('\\') || pathname.split('/').includes('..') || (!publicFiles.has(pathname) && !asset)) { response.writeHead(404); response.end('Not found'); return; }
  const filename = path.resolve(root, `.${pathname}`);
  if (!filename.startsWith(root + path.sep)) { response.writeHead(404); response.end('Not found'); return; }
  fs.realpath(filename, (realError, realFilename) => {
    if (realError || !realFilename.startsWith(root + path.sep)) { response.writeHead(404); response.end('Not found'); return; }
    fs.stat(realFilename, (statError, stat) => {
      if (statError || !stat.isFile()) { response.writeHead(404); response.end('Not found'); return; }
      response.writeHead(200, { 'Content-Type': mime[extension] || 'application/octet-stream', 'Content-Length': stat.size });
      if (request.method === 'HEAD') { response.end(); return; }
      const stream = fs.createReadStream(realFilename);
      stream.on('error', () => response.destroy()); stream.pipe(response);
    });
  });
});
server.on('error', error => { console.error(`Não foi possível iniciar a prévia: ${error.message}`); process.exitCode = 1; });
server.listen(port, '127.0.0.1', () => console.log(`MargeX local: http://127.0.0.1:${port}`));
