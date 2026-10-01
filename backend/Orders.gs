/**
 * BookVault - Orders & Payment Workflow (Orders.gs)
 * Handles checkout order creation, PayPal reference submission, and payment verification.
 */

function handleCreateOrder(payload) {
  const userId = payload.user_id;
  const itemType = payload.item_type; // 'book' or 'membership'
  const itemId = payload.item_id;
  const amount = Number(payload.amount);
  const currency = payload.currency || 'USD';

  if (!userId || !itemId || isNaN(amount)) {
    return createJsonResponse({ error: 'user_id, item_id, and valid amount are required.' }, 400);
  }

  const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
  const now = new Date().toISOString();

  // If the book/plan is $0, immediately mark as verified!
  const isFree = amount === 0;
  const initialStatus = isFree ? 'verified' : 'pending';

  const newOrder = {
    order_id: orderId,
    user_id: userId,
    book_id: itemType === 'book' ? itemId : '',
    amount: amount,
    currency: currency,
    payment_method: payload.payment_method || 'paypal_me',
    payment_status: initialStatus,
    paypal_transaction_id: payload.paypal_transaction_id || (isFree ? 'FREE_CLAIM' : ''),
    verified_at: isFree ? now : '',
    created_at: now
  };

  appendObjectToSheet('Orders', newOrder);

  // If free membership, upgrade immediately
  if (isFree && itemType === 'membership') {
    updateUserMembership(userId, itemId, 'active');
  }

  return createJsonResponse({
    message: isFree ? 'Order completed.' : 'Order created; pending payment verification.',
    order: newOrder
  }, 201);
}

function handleSubmitPayment(payload) {
  const orderId = payload.order_id;
  const transactionId = (payload.paypal_transaction_id || '').trim();

  if (!orderId || !transactionId) {
    return createJsonResponse({ error: 'order_id and paypal_transaction_id are required.' }, 400);
  }

  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName('Orders');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const orderIdCol = headers.indexOf('order_id');
  const txCol = headers.indexOf('paypal_transaction_id');

  for (let i = 1; i < data.length; i++) {
    if (data[i][orderIdCol] === orderId) {
      sheet.getRange(i + 1, txCol + 1).setValue(transactionId);

      // Record in Payments sheet as well
      const paymentId = 'PAY-' + Math.floor(100000 + Math.random() * 900000);
      const paymentRecord = {
        payment_id: paymentId,
        user_id: data[i][headers.indexOf('user_id')],
        order_id: orderId,
        amount: data[i][headers.indexOf('amount')],
        currency: data[i][headers.indexOf('currency')],
        payment_reference: transactionId,
        payment_status: 'pending',
        verified_by: '',
        verified_at: '',
        created_at: new Date().toISOString()
      };
      appendObjectToSheet('Payments', paymentRecord);

      return createJsonResponse({
        message: 'Payment reference submitted. Administrator will verify and grant access.',
        order_id: orderId,
        payment_id: paymentId
      });
    }
  }

  return createJsonResponse({ error: 'Order not found.' }, 404);
}

function handleVerifyPayment(payload) {
  const orderId = payload.order_id;
  const adminVerifier = payload.verified_by || 'Admin';

  if (!orderId) {
    return createJsonResponse({ error: 'order_id is required.' }, 400);
  }

  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName('Orders');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const orderIdCol = headers.indexOf('order_id');
  const statusCol = headers.indexOf('payment_status');
  const verifiedCol = headers.indexOf('verified_at');
  const userIdCol = headers.indexOf('user_id');
  const bookIdCol = headers.indexOf('book_id');

  const now = new Date().toISOString();

  for (let i = 1; i < data.length; i++) {
    if (data[i][orderIdCol] === orderId) {
      sheet.getRange(i + 1, statusCol + 1).setValue('verified');
      sheet.getRange(i + 1, verifiedCol + 1).setValue(now);

      const userId = data[i][userIdCol];
      const bookId = data[i][bookIdCol];

      // Update corresponding Payment sheet row
      const paySheet = ss.getSheetByName('Payments');
      if (paySheet) {
        const payData = paySheet.getDataRange().getValues();
        const payHeaders = payData[0];
        const payOrderCol = payHeaders.indexOf('order_id');
        const payStatusCol = payHeaders.indexOf('payment_status');
        const payVerifiedByCol = payHeaders.indexOf('verified_by');
        const payVerifiedAtCol = payHeaders.indexOf('verified_at');

        for (let p = 1; p < payData.length; p++) {
          if (payData[p][payOrderCol] === orderId) {
            paySheet.getRange(p + 1, payStatusCol + 1).setValue('approved');
            paySheet.getRange(p + 1, payVerifiedByCol + 1).setValue(adminVerifier);
            paySheet.getRange(p + 1, payVerifiedAtCol + 1).setValue(now);
          }
        }
      }

      return createJsonResponse({
        message: 'Payment verified and access granted.',
        order_id: orderId,
        user_id: userId,
        book_id: bookId
      });
    }
  }

  return createJsonResponse({ error: 'Order not found.' }, 404);
}

function handleGetOrders(e) {
  const userId = e.parameter.user_id;
  const isAdmin = e.parameter.isAdmin === 'true';

  const orders = sheetToObjects('Orders');
  if (isAdmin) {
    return createJsonResponse({ orders: orders });
  }

  if (!userId) {
    return createJsonResponse({ error: 'Missing user_id parameter.' }, 400);
  }

  const userOrders = orders.filter(o => o.user_id === userId);
  return createJsonResponse({ orders: userOrders });
}

function handleGetUserLibrary(e) {
  const userId = e.parameter.user_id;
  if (!userId) {
    return createJsonResponse({ error: 'Missing user_id parameter.' }, 400);
  }

  const users = sheetToObjects('Users');
  const user = users.find(u => u.user_id === userId);
  if (!user) {
    return createJsonResponse({ error: 'User not found.' }, 404);
  }

  const allBooks = sheetToObjects('Books');
  const allOrders = sheetToObjects('Orders');

  const verifiedBookIds = allOrders
    .filter(o => o.user_id === userId && (o.payment_status === 'verified' || o.payment_status === 'approved'))
    .map(o => o.book_id)
    .filter(Boolean);

  const library = allBooks.filter(book => {
    // 1. Free books
    if (book.access_type === 'free' || Number(book.price) === 0) return true;
    
    // 2. Purchased directly
    if (verifiedBookIds.includes(book.book_id)) return true;

    // 3. User membership access
    if (user.membership_status === 'active') {
      if (user.membership_plan === 'premium') return true;
      if (user.membership_plan === 'basic' && book.access_type === 'basic_plan') return true;
    }

    return false;
  });

  return createJsonResponse({ library: library });
}
