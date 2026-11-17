'use strict';
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const port = Number(process.env.PORT || 4318);
const publicFiles = new Set(['/index.html', '/formulario.html', '/styles.css', '/app.js', '/analytics.js', '/form.js', '/config.js', '/pricing.js', '/catalog.js']);
const mime = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.webp':'image/webp', '.svg':'image/svg+xml', '.ttf':'font/ttf', '.woff2':'font/woff2', '.woff':'font/woff', '.mp4':'video/mp4' };
const assetExtensions = new Set(['.png', '.jpg', '.jpeg', '.webp', '.svg', '.ttf', '.woff2', '.woff']);
const proofFiles = new Set([1,2,3,4].flatMap(index => ['mp4','jpg'].map(extension => `/assets/provas/depoimento-${String(index).padStart(2,'0')}.${extension}`)));
let trackingHandlers = null;

function parseRange(header,size) {
  const match = /^bytes=(\d*)-(\d*)$/.exec(header);
  if (!match || (!match[1] && !match[2]) || size === 0) return null;
  const first = match[1] ? Number(match[1]) : null;
  const last = match[2] ? Number(match[2]) : null;
  if ((first !== null && !Number.isSafeInteger(first)) || (last !== null && !Number.isSafeInteger(last))) return null;
  if (first === null) {
    if (last === 0) return null;
    return { start:Math.max(0,size-last),end:size-1 };
  }
  if (first >= size || (last !== null && last < first)) return null;
  return { start:first,end:last === null ? size-1 : Math.min(last,size-1) };
}

const server = http.createServer((request,response) => {
  response.setHeader('X-Content-Type-Options','nosniff');
  response.setHeader('Referrer-Policy','no-referrer');
  response.setHeader('Cache-Control','no-store');
  response.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self' https://connect.facebook.net https://www.googletagmanager.com https://*.clarity.ms; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://www.facebook.com https://www.google-analytics.com https://region1.google-analytics.com https://www.googletagmanager.com https://*.clarity.ms https://c.bing.com; media-src 'self'; font-src 'self'; connect-src 'self' https://www.facebook.com https://connect.facebook.net https://www.google-analytics.com https://region1.google-analytics.com https://analytics.google.com https://www.googletagmanager.com https://*.clarity.ms; frame-src https://www.googletagmanager.com; frame-ancestors 'none'; base-uri 'self'; form-action 'none'");
  let pathname;
  try { pathname=decodeURIComponent(new URL(request.url,'http://127.0.0.1').pathname); }
  catch { response.writeHead(400);response.end('Bad request');return; }
  if (pathname === '/api/events' || pathname === '/api/leads') {
    try {
      trackingHandlers ||= require('./server/tracking.cjs').createTrackingApi();
      const handler = pathname === '/api/events' ? trackingHandlers.events : trackingHandlers.leads;
      Promise.resolve(handler(request,response)).catch(() => {
        if (!response.headersSent) { response.writeHead(500,{'Content-Type':'application/json; charset=utf-8'});response.end('{"ok":false,"code":"INTERNAL_ERROR"}'); }
        else response.destroy();
      });
    } catch { response.writeHead(503,{'Content-Type':'application/json; charset=utf-8'});response.end('{"ok":false,"code":"API_UNAVAILABLE"}'); }
    return;
  }
  if (!['GET','HEAD'].includes(request.method)) { response.writeHead(405,{Allow:'GET, HEAD'});response.end('Method not allowed');return; }
  if (pathname === '/') pathname='/index.html';
  const extension=path.extname(pathname).toLowerCase();
  const rootAsset=/^\/assets\/[^/]+$/.test(pathname) && assetExtensions.has(extension);
  if (pathname.includes('\0') || pathname.includes('\\') || pathname.split('/').includes('..') || (!publicFiles.has(pathname) && !rootAsset && !proofFiles.has(pathname))) { response.writeHead(404);response.end('Not found');return; }
  const filename=path.resolve(root,`.${pathname}`);
  if (!filename.startsWith(root+path.sep)) { response.writeHead(404);response.end('Not found');return; }
  fs.realpath(filename,(realError,realFilename) => {
    if (realError || !realFilename.startsWith(root+path.sep)) { response.writeHead(404);response.end('Not found');return; }
    fs.stat(realFilename,(statError,stat) => {
      if (statError || !stat.isFile()) { response.writeHead(404);response.end('Not found');return; }
      const headers={'Content-Type':mime[extension] || 'application/octet-stream','Content-Length':stat.size};
      let range=null;
      if (extension === '.mp4') {
        headers['Accept-Ranges']='bytes';
        if (request.headers.range) {
          range=parseRange(request.headers.range,stat.size);
          if (!range) { response.writeHead(416,{'Content-Range':`bytes */${stat.size}`,'Accept-Ranges':'bytes','Content-Length':0});response.end();return; }
          headers['Content-Range']=`bytes ${range.start}-${range.end}/${stat.size}`;
          headers['Content-Length']=range.end-range.start+1;
        }
      }
      response.writeHead(range ? 206 : 200,headers);
      if (request.method === 'HEAD') { response.end();return; }
      const stream=fs.createReadStream(realFilename,range || undefined);
      stream.on('error',() => response.destroy());
      response.on('close',() => stream.destroy());
      stream.pipe(response);
    });
  });
});
server.on('error',error => { console.error(`Não foi possível iniciar a prévia: ${error.message}`);process.exitCode=1; });
server.listen(port,'127.0.0.1',() => console.log(`MargeX local: http://127.0.0.1:${port}`));
