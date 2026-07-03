/**
 * 旅財布 → Googleスプレッドシート 同期用 Apps Script
 *
 * 導入手順は ../SYNC_SETUP.md を参照。
 * アプリからのPOSTを受け取り、「費用記録」シートに追記する。
 * 同じIDの行が既にあれば上書きする(アプリ側での編集の反映)。
 *
 * セキュリティ:
 *  - 合言葉(SYNC_TOKEN)はスクリプトプロパティに保存する。コードには書かない。
 *  - 合言葉が一致しないリクエストはすべて拒否する。
 */
const SHEET_NAME = '費用記録';
const HEADERS = ['ID', '旅行', '日付', 'カテゴリ', '内容', '金額', '通貨',
                 '日本円換算', '支払い方法', 'メモ', '記録日時', '同期日時'];

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const token = PropertiesService.getScriptProperties().getProperty('SYNC_TOKEN');
    if (!token || body.token !== token) {
      return respond({ ok: false, error: 'unauthorized' });
    }

    const records = body.records || [];
    if (records.length === 0) {
      return respond({ ok: true, ping: true }); // 接続テスト用
    }

    const sheet = getSheet();
    const lastRow = sheet.getLastRow();
    const ids = lastRow > 0
      ? sheet.getRange(1, 1, lastRow, 1).getValues().map(function (r) { return String(r[0]); })
      : [];
    const now = new Date();

    records.forEach(function (r) {
      const row = [r.id, r.trip, r.date, r.category, r.title, r.amount, r.currency,
                   r.amountJPY, r.paymentMethod, r.memo, r.createdAt, now];
      const idx = ids.indexOf(String(r.id));
      if (idx > 0) {
        sheet.getRange(idx + 1, 1, 1, row.length).setValues([row]); // 既存IDは上書き
      } else {
        sheet.appendRow(row);
        ids.push(String(r.id));
      }
    });

    return respond({ ok: true, count: records.length });
  } catch (err) {
    return respond({ ok: false, error: String(err) });
  }
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function respond(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
