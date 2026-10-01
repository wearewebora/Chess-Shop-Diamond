/**
 * Chess Shop - Google Apps Script Backend Web App
 * Official Chess.com Diamond Membership Store API
 *
 * Requirements:
 * - Google Sheets bound or standalone script with SPREADSHEET_ID configured.
 * - Deploy as: Web App
 * - Execute as: Me (your Google account)
 * - Who has access: Anyone (required for frontend fetch access)
 */

function getSpreadsheet() {
  const scriptProperties = PropertiesService.getScriptProperties();
  const sheetId = scriptProperties.getProperty('SPREADSHEET_ID');
  if (sheetId) {
    return SpreadsheetApp.openById(sheetId);
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

function createJsonResponse(data, statusCode) {
  statusCode = statusCode || 200;
  const output = ContentService.createTextOutput(JSON.stringify({
    success: statusCode >= 200 && statusCode < 300,
    status: statusCode,
    timestamp: new Date().toISOString(),
    ...data
  }));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

/**
 * Handle HTTP GET Requests
 */
function doGet(e) {
  try {
    const action = (e && e.parameter && e.parameter.action) || 'ping';
    
    switch (action) {
      case 'ping':
        return createJsonResponse({ message: 'Chess Shop API is active and operational.' });

      case 'getOrders':
        return handleGetOrders(e);

      case 'getPlans':
        return handleGetPlans();

      default:
        return createJsonResponse({ error: 'Unknown GET action: ' + action }, 400);
    }
  } catch (err) {
    return createJsonResponse({ error: err.toString() }, 500);
  }
}

/**
 * Handle HTTP POST Requests
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);

    if (!e || !e.postData || !e.postData.contents) {
      return createJsonResponse({ error: 'Missing POST body payload' }, 400);
    }

    const payload = JSON.parse(e.postData.contents);
    const action = payload.action;

    switch (action) {
      case 'createOrder':
        return handleCreateOrder(payload);

      case 'approveOrder':
        return handleApproveOrder(payload);

      case 'submitContact':
        return handleSubmitContact(payload);

      default:
        return createJsonResponse({ error: 'Unknown POST action: ' + action }, 400);
    }
  } catch (err) {
    return createJsonResponse({ error: err.toString() }, 500);
  } finally {
    lock.releaseLock();
  }
}

function handleGetOrders(e) {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName('DiamondOrders');
  if (!sheet) return createJsonResponse({ orders: [] });

  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return createJsonResponse({ orders: [] });

  const headers = data[0];
  const rows = data.slice(1);
  const orders = rows.map(row => {
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = row[idx];
    });
    return obj;
  });

  return createJsonResponse({ orders: orders });
}

function handleGetPlans() {
  return createJsonResponse({
    plans: [
      { id: 'diamond-1-month', name: '1 Month Diamond', price: 14.99 },
      { id: 'diamond-3-months', name: '3 Months Diamond', price: 38.99 },
      { id: 'diamond-1-year', name: '1 Year Diamond', price: 89.99 },
      { id: 'diamond-2-years', name: '2 Years Diamond Pass', price: 159.99 }
    ]
  });
}

function handleCreateOrder(payload) {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName('DiamondOrders');
  if (!sheet) {
    sheet = ss.insertSheet('DiamondOrders');
    sheet.appendRow([
      'order_id', 'chess_com_username', 'user_email', 'plan_title', 
      'amount', 'currency', 'payment_method', 'paypal_transaction_id', 
      'payment_status', 'activation_code', 'notes', 'created_at', 'verified_at'
    ]);
  }

  sheet.appendRow([
    payload.order_id,
    payload.chess_com_username,
    payload.user_email || '',
    payload.plan,
    payload.amount,
    'USD',
    'paypal_me',
    payload.paypal_tx,
    payload.status || 'pending',
    payload.activation_code || '',
    payload.notes || '',
    new Date().toISOString(),
    payload.status === 'verified' ? new Date().toISOString() : ''
  ]);

  return createJsonResponse({ success: true, order_id: payload.order_id });
}

function handleApproveOrder(payload) {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName('DiamondOrders');
  if (!sheet) return createJsonResponse({ error: 'Sheet not found' }, 404);

  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === payload.order_id) {
      sheet.getRange(i + 1, 9).setValue('verified'); // status
      if (payload.activation_code) {
        sheet.getRange(i + 1, 10).setValue(payload.activation_code);
      }
      sheet.getRange(i + 1, 13).setValue(new Date().toISOString());
      return createJsonResponse({ success: true, order_id: payload.order_id });
    }
  }

  return createJsonResponse({ error: 'Order not found' }, 404);
}

function handleSubmitContact(payload) {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName('ContactInquiries');
  if (!sheet) {
    sheet = ss.insertSheet('ContactInquiries');
    sheet.appendRow(['message_id', 'name', 'email', 'chess_com_username', 'subject', 'message', 'status', 'created_at']);
  }

  sheet.appendRow([
    payload.message_id || ('MSG-' + Date.now()),
    payload.name,
    payload.email,
    payload.chess_com_username || '',
    payload.subject,
    payload.message,
    'unread',
    new Date().toISOString()
  ]);

  return createJsonResponse({ success: true });
}
