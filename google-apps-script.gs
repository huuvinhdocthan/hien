/**
 * Lưu "Lời chúc" của thiệp cưới vào Google Sheets.
 *
 * Cài đặt:
 * 1. Tạo một Google Sheet mới → Tiện ích mở rộng → Apps Script.
 * 2. Xoá code mặc định, dán toàn bộ file này vào, bấm Lưu.
 * 3. Triển khai → Tùy chọn triển khai mới → Loại: Ứng dụng web
 *      - Thực thi dưới dạng: Tôi
 *      - Người có quyền truy cập: Bất kỳ ai
 * 4. Sao chép URL Web App (dạng https://script.google.com/macros/s/.../exec)
 *    và dán vào CONFIG.sheetEndpoint trong index.html.
 */

const SHEET_NAME = 'LoiChuc';

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(['Thời gian', 'Tên', 'Lời chúc']);
    sh.setFrozenRows(1);
  }
  return sh;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function clean_(s, max) {
  return String(s || '').replace(/^[=+\-@]/, "'$&").slice(0, max);
}

function doPost(e) {
  const d = JSON.parse(e.postData.contents);
  if (d.type !== 'wish') return json_({ ok: false });
  sheet_().appendRow([new Date(), clean_(d.name, 80), clean_(d.message, 500)]);
  return json_({ ok: true });
}

function doGet(e) {
  if ((e.parameter.type || '') !== 'wish') return json_([]);
  const rows = sheet_().getDataRange().getValues().slice(1);
  return json_(rows.map(r => ({ name: r[1], message: r[2] })).slice(-200));
}
