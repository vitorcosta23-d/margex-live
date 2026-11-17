'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { createHash } = require('node:crypto');
const source = fs.readFileSync('docs/integrations/margex-leads-apps-script.gs', 'utf8');
const ID = '00000000-0000-4000-8000-000000000001';
const SECRET = 'test-placeholder-secret-for-mock-only';
function fixture({ failFirstInputWrite = false } = {}) {
  const cells = new Map(); const writes = []; let columns = 18; let failed = false; let releaseCount = 0;
  const valueAt = (row, column) => cells.get(row + ':' + column) ?? '';
  function range(row, column, height = 1, width = 1) {
    if (typeof row === 'string') {
      const match = /^([A-Z]+)(\d+)(?::([A-Z]+)(\d+))?$/.exec(row);
      const index = text => [...text].reduce((sum, char) => sum * 26 + char.charCodeAt(0) - 64, 0);
      return range(Number(match[2]), index(match[1]), match[4] ? Number(match[4]) - Number(match[2]) + 1 : 1, match[3] ? index(match[3]) - index(match[1]) + 1 : 1);
    }
    const api = {
      getValue: () => valueAt(row, column),
      getValues: () => Array.from({ length: height }, (_, y) => Array.from({ length: width }, (_, x) => valueAt(row + y, column + x))),
      setValue: value => { cells.set(row + ':' + column, value); writes.push({ row, column, height: 1, width: 1 }); return api; },
      setValues: values => {
        if (failFirstInputWrite && column === 1 && !failed) { failed = true; throw new Error('Mock partial outage'); }
        values.forEach((line, y) => line.forEach((value, x) => cells.set((row + y) + ':' + (column + x), value)));
        writes.push({ row, column, height, width }); return api;
      },
      createTextFinder: target => ({ matchEntireCell: () => ({ findNext: () => {
        for (let y = row; y < row + height; y++) if (valueAt(y, column) === target) return { getRow: () => y };
        return null;
      } }) })
    };
    return api;
  }
  const sheet = { getRange: range, getMaxColumns: () => columns, insertColumnsAfter: (_, count) => { columns += count; } };
  const context = vm.createContext({
    PropertiesService: { getScriptProperties: () => ({ getProperty: name => name === 'MARGEX_LEADS_WEBHOOK_SECRET' ? SECRET : 'spreadsheet-placeholder' }) },
    LockService: { getScriptLock: () => ({ tryLock: () => true, releaseLock: () => { releaseCount++; } }) },
    SpreadsheetApp: { openById: () => ({ getSheetByName: name => name === 'Leads' ? sheet : null }), flush: () => {} },
    Utilities: { DigestAlgorithm: { SHA_256: 'sha256' }, computeDigest: (_, text) => [...createHash('sha256').update(text).digest()] },
    ContentService: { MimeType: { JSON: 'application/json' }, createTextOutput: text => ({ setMimeType: () => JSON.parse(text) }) }
  });
  vm.runInContext(source, context);
  const lead = { lead_id: ID, event_id: ID, name: 'Seller de teste', email: 'seller@example.test', phone: '(11) 99999-9999', origin: 'sales_page', consent: { analytics: false, marketing: true }, qualification: {}, utm: { utm_campaign: 'mock_test' } };
  return { cells, writes, valueAt, columns: () => columns, releaseCount: () => releaseCount, run: overrides => context.doPost({ postData: { contents: JSON.stringify({ secret: SECRET, action: 'save_lead', lead, ...overrides }) } }) };
}
test('relay inserts metadata columns, writes only A:J and S:U, and returns persisted receipt', () => {
  const f = fixture(); const result = f.run();
  assert.equal(result.saved, true); assert.equal(result.lead_id, ID);
  assert.equal(f.columns(), 21); assert.equal(f.valueAt(2, 2), 'Seller de teste'); assert.equal(f.valueAt(2, 19), ID);
  assert.equal(f.valueAt(1, 21), 'Atribuição de origem');
  assert.equal(f.writes.some(write => write.column <= 18 && write.column + write.width - 1 >= 11), false);
  assert.equal(f.releaseCount(), 1);
});
test('relay retry returns same receipt without duplicate input writes', () => {
  const f = fixture(); f.run(); const before = f.writes.filter(write => write.column === 1).length;
  const again = f.run();
  assert.equal(again.saved, true); assert.equal(again.duplicate, true);
  assert.equal(f.writes.filter(write => write.column === 1).length, before);
  assert.equal(f.valueAt(3, 2), '');
});
test('reserved UUID is reused after provider input write failure', () => {
  const f = fixture({ failFirstInputWrite: true });
  const first = f.run(); assert.equal(first.ok, false); assert.equal(f.valueAt(2, 19), ID); assert.equal(f.valueAt(2, 2), '');
  const retry = f.run(); assert.equal(retry.saved, true); assert.equal(f.valueAt(2, 2), 'Seller de teste'); assert.equal(f.valueAt(3, 2), '');
});
test('relay refuses unknown secret and protects formula-like contact strings', () => {
  const f = fixture(); assert.equal(f.run({ secret: 'wrong' }).code, 'UNAUTHORIZED'); assert.equal(f.writes.length, 0);
  const id2 = '00000000-0000-4000-8000-000000000002';
  const result = f.run({ lead: { lead_id: id2, event_id: id2, name: '=IMPORTXML("mock")', email: 'seller@example.test', phone: '+5511999999999', origin: 'sales_page', consent: { analytics: false, marketing: false } } });
  assert.equal(result.saved, true); assert.equal(f.valueAt(2, 2).startsWith("'="), true); assert.equal(f.valueAt(2, 4).startsWith("'+"), true);
});
test('relay does not overwrite an unrelated private metadata header', () => {
  const f = fixture(); f.cells.set('1:19', 'Existing user data');
  assert.equal(f.run().code, 'PRIVATE_COLUMNS_CONFLICT');
  assert.equal(f.valueAt(1, 19), 'Existing user data'); assert.equal(f.valueAt(2, 2), '');
});
