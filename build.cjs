'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const root = __dirname;
const output = path.resolve(root, 'dist');
if (path.dirname(output) !== root || path.basename(output) !== 'dist') throw new Error('Saída de build fora da pasta autorizada.');
if (fs.existsSync(output) && fs.lstatSync(output).isSymbolicLink()) throw new Error('A saída não pode ser um link simbólico.');

const publicFiles = ['index.html', 'formulario.html', 'styles.css', 'config.js', 'form.js', 'pricing.js', 'catalog.js', 'app.js'];
const assetExtensions = new Set(['.png', '.jpg', '.jpeg', '.webp', '.svg', '.ttf', '.woff', '.woff2']);
const assetRoot = path.join(root, 'assets');
for (const item of fs.readdirSync(assetRoot, { withFileTypes: true })) {
  if (item.isFile() && assetExtensions.has(path.extname(item.name).toLowerCase())) publicFiles.push('assets/' + item.name);
}
const expected = new Set(publicFiles);
function inspectExisting(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) throw new Error('Link simbólico inesperado na saída.');
    if (entry.isDirectory()) inspectExisting(filename);
    else if (!expected.has(path.relative(output, filename).split(path.sep).join('/'))) throw new Error('Arquivo fora da lista pública na saída: ' + path.relative(output, filename));
  }
}
if (fs.existsSync(output)) inspectExisting(output);
fs.mkdirSync(path.join(output, 'assets'), { recursive: true });
for (const relative of publicFiles) {
  const source = path.join(root, relative);
  const resolvedSource = fs.realpathSync(source);
  if (!resolvedSource.startsWith(root + path.sep)) throw new Error('Arquivo público aponta para fora do projeto.');
  fs.copyFileSync(resolvedSource, path.join(output, relative));
}
for (const relative of publicFiles) {
  const hash = value => crypto.createHash('sha256').update(fs.readFileSync(value)).digest('hex');
  if (hash(path.join(root, relative)) !== hash(path.join(output, relative))) throw new Error('Cópia divergente: ' + relative);
}
console.log('Build estático verificado: ' + publicFiles.length + ' arquivos públicos em dist/.');
console.log('Sem docs, desenho, logs, servidor local ou credenciais na saída.');
