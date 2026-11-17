'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root=__dirname;
const output=path.resolve(root,'dist');
if (path.dirname(output) !== root || path.basename(output) !== 'dist') throw new Error('Saída de build fora da pasta autorizada.');
if (fs.existsSync(output) && fs.lstatSync(output).isSymbolicLink()) throw new Error('A saída não pode ser um link simbólico.');
const publicFiles=['index.html','formulario.html','styles.css','config.js','analytics.js','form.js','pricing.js','catalog.js','app.js'];
const assetExtensions=new Set(['.png','.jpg','.jpeg','.webp','.svg','.ttf','.woff','.woff2']);
const assetRoot=path.join(root,'assets');
if (fs.lstatSync(assetRoot).isSymbolicLink()) throw new Error('Assets não pode ser um link simbólico.');
for (const item of fs.readdirSync(assetRoot,{withFileTypes:true})) {
  if (item.isFile() && assetExtensions.has(path.extname(item.name).toLowerCase())) publicFiles.push('assets/'+item.name);
}
// Explicit final files only. Originals, transcripts, logs and arbitrary subfolders are private.
const proofRoot=path.join(assetRoot,'provas');
const proofNames=[1,2,3,4].flatMap(index => ['mp4','jpg'].map(extension => `depoimento-${String(index).padStart(2,'0')}.${extension}`));
if (fs.existsSync(proofRoot)) {
  if (fs.lstatSync(proofRoot).isSymbolicLink() || !fs.statSync(proofRoot).isDirectory()) throw new Error('Pasta de provas inválida.');
  for (const name of proofNames) {
    const filename=path.join(proofRoot,name);
    if (!fs.existsSync(filename)) continue;
    if (fs.lstatSync(filename).isSymbolicLink() || !fs.statSync(filename).isFile()) throw new Error('Prova pública inválida: '+name);
    publicFiles.push('assets/provas/'+name);
  }
}
const expected=new Set(publicFiles);
function inspectExisting(directory) {
  for (const entry of fs.readdirSync(directory,{withFileTypes:true})) {
    const filename=path.join(directory,entry.name);
    if (entry.isSymbolicLink()) throw new Error('Link simbólico inesperado na saída.');
    if (entry.isDirectory()) inspectExisting(filename);
    else if (!expected.has(path.relative(output,filename).split(path.sep).join('/'))) throw new Error('Arquivo fora da lista pública na saída: '+path.relative(output,filename));
  }
}
if (fs.existsSync(output)) inspectExisting(output);
for (const relative of publicFiles) {
  const source=path.join(root,relative);
  const resolvedSource=fs.realpathSync(source);
  if (!resolvedSource.startsWith(root+path.sep)) throw new Error('Arquivo público aponta para fora do projeto.');
  const target=path.join(output,relative);
  fs.mkdirSync(path.dirname(target),{recursive:true});
  fs.copyFileSync(resolvedSource,target);
}
const hash=filename => crypto.createHash('sha256').update(fs.readFileSync(filename)).digest('hex');
for (const relative of publicFiles) {
  if (hash(path.join(root,relative)) !== hash(path.join(output,relative))) throw new Error('Cópia divergente: '+relative);
}
console.log('Build estático verificado: '+publicFiles.length+' arquivos públicos em dist/.');
console.log('Sem originais, transcrições, docs, logs, servidor local ou credenciais na saída.');
