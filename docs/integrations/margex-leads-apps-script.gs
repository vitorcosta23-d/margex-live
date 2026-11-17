/**
 * Private relay for the existing MargeX sheet. Deploy as a Web App executing as
 * the sheet owner. Only /api/leads calls it; never expose the shared secret in HTML.
 * Script Properties required: MARGEX_SPREADSHEET_ID, MARGEX_LEADS_WEBHOOK_SECRET.
 * Preserves input columns A:J and formula columns K:R. Adds S:U only as needed.
 */
function doPost(e) {
  try {
    var raw = e && e.postData && e.postData.contents;
    if (typeof raw !== 'string' || raw.length > 16384) return reply_({ ok: false, code: 'INVALID_REQUEST' });
    var body = JSON.parse(raw);
    var properties = PropertiesService.getScriptProperties();
    var expected = properties.getProperty('MARGEX_LEADS_WEBHOOK_SECRET');
    if (!expected || expected.length < 32 || !equalSecret_(String(body.secret || ''), expected)) return reply_({ ok: false, code: 'UNAUTHORIZED' });
    if (body.action !== 'save_lead' || !validLead_(body.lead)) return reply_({ ok: false, code: 'INVALID_LEAD' });
    var lock = LockService.getScriptLock();
    if (!lock.tryLock(10000)) return reply_({ ok: false, code: 'BUSY' });
    try {
      var sheet = SpreadsheetApp.openById(properties.getProperty('MARGEX_SPREADSHEET_ID')).getSheetByName('Leads');
      if (!sheet) return reply_({ ok: false, code: 'SHEET_NOT_FOUND' });
      if (sheet.getMaxColumns() < 21) sheet.insertColumnsAfter(sheet.getMaxColumns(), 21 - sheet.getMaxColumns());
      var privateHeaders = ['ID inscrição', 'Consentimento informado', 'Atribuição de origem'];
      for (var headerIndex = 0; headerIndex < privateHeaders.length; headerIndex++) {
        var headerCell = sheet.getRange(1, 19 + headerIndex);
        var previousHeader = headerCell.getValue();
        if (previousHeader && previousHeader !== privateHeaders[headerIndex]) return reply_({ ok: false, code: 'PRIVATE_COLUMNS_CONFLICT' });
      }
      sheet.getRange(1, 19, 1, 3).setValues([privateHeaders]);
      // Search only ID values, never clear or shift the formula columns.
      var existing = sheet.getRange('S2:S10000').createTextFinder(body.lead.lead_id).matchEntireCell(true).findNext();
      var row;
      if (existing) {
        row = existing.getRow();
        var savedInput = sheet.getRange(row, 1, 1, 10).getValues()[0];
        if (savedInput[1] !== '' && savedInput[2] !== '' && savedInput[3] !== '' && savedInput[8] !== '') {
          return reply_({ ok: true, saved: true, duplicate: true, lead_id: body.lead.lead_id, event_id: body.lead.event_id });
        }
        if (savedInput.some(function (value) { return value !== ''; })) return reply_({ ok: false, code: 'INCOMPLETE_EXISTING_ROW' });
      }
      // getLastRow() includes spilled formula rows. Find the next input row using A:J.
      if (!existing) {
        var rows = sheet.getRange('A2:J10000').getValues();
        var ids = sheet.getRange('S2:S10000').getValues();
        var lastInputIndex = -1;
        for (var i = 0; i < rows.length; i++) if (rows[i].some(function (value) { return value !== ''; }) || ids[i][0] !== '') lastInputIndex = i;
        row = lastInputIndex + 3;
        if (row > 10000) return reply_({ ok: false, code: 'SHEET_CAPACITY_REACHED' });
        // Reserve the UUID first. A retry after a provider failure reuses this row.
        sheet.getRange(row, 19).setValue(body.lead.lead_id);
      }
      var lead = body.lead;
      var q = lead.qualification || {};
      var utm = lead.utm || {};
      sheet.getRange(row, 1, 1, 10).setValues([[
        new Date(), cellText_(lead.name), cellText_(lead.email), cellText_(lead.phone),
        cellText_(q.channel || ''), cellText_(q.ad_count || ''), cellText_(q.pricing_process || ''),
        cellText_(q.main_problem || ''), cellText_(lead.origin), cellText_(utm.utm_campaign || '')
      ]]);
      sheet.getRange(row, 19, 1, 3).setValues([[lead.lead_id, JSON.stringify({
        analytics: lead.consent.analytics, marketing: lead.consent.marketing, received_at: new Date().toISOString()
      }), JSON.stringify({ utm: utm, attribution: lead.attribution || {} })]]);
      SpreadsheetApp.flush();
      return reply_({ ok: true, saved: true, duplicate: false, lead_id: lead.lead_id, event_id: lead.event_id });
    } finally { lock.releaseLock(); }
  } catch (_) { return reply_({ ok: false, code: 'RELAY_ERROR' }); }
}
function validLead_(lead) {
  return !!lead && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(lead.lead_id || '') &&
    lead.lead_id === lead.event_id && typeof lead.name === 'string' && lead.name.length >= 2 && lead.name.length <= 100 &&
    typeof lead.email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email) && lead.email.length <= 254 &&
    typeof lead.phone === 'string' && /^\d{10,13}$/.test(lead.phone.replace(/\D/g, '')) &&
    ['sales_page', 'direct_form'].indexOf(lead.origin) !== -1 && lead.consent &&
    typeof lead.consent.analytics === 'boolean' && typeof lead.consent.marketing === 'boolean';
}
function cellText_(value) {
  var text = String(value).replace(/[\u0000-\u001f\u007f]/g, '').slice(0, 254);
  // Sheets interprets leading '=' as a formula. Treat all contact data as text.
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}
function equalSecret_(actual, expected) {
  var a = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, actual);
  var b = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, expected);
  var difference = a.length ^ b.length;
  for (var i = 0; i < Math.min(a.length, b.length); i++) difference |= a[i] ^ b[i];
  return difference === 0;
}
function reply_(data) { return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON); }
