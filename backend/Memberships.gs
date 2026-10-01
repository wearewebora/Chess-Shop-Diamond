/**
 * BookVault - Memberships Module (Memberships.gs)
 * Handles plan definitions, subscription updates, approvals, and revoking access.
 */

function handleGetMembershipPlans(e) {
  const plans = sheetToObjects('MembershipPlans');
  return createJsonResponse({
    plans: plans.filter(p => p.active === true || p.active === 'TRUE' || p.active === 'true')
  });
}

function updateUserMembership(userId, planId, status = 'active') {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName('Users');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const userIdCol = headers.indexOf('user_id');
  const planCol = headers.indexOf('membership_plan');
  const statusCol = headers.indexOf('membership_status');
  const startCol = headers.indexOf('membership_start');
  const expiryCol = headers.indexOf('membership_expiry');
  const updatedCol = headers.indexOf('updated_at');

  const now = new Date();
  const expiry = new Date();
  expiry.setDate(now.getDate() + 30); // 30 days subscription

  for (let i = 1; i < data.length; i++) {
    if (data[i][userIdCol] === userId) {
      if (planCol >= 0) sheet.getRange(i + 1, planCol + 1).setValue(planId);
      if (statusCol >= 0) sheet.getRange(i + 1, statusCol + 1).setValue(status);
      if (startCol >= 0) sheet.getRange(i + 1, startCol + 1).setValue(now.toISOString());
      if (expiryCol >= 0) sheet.getRange(i + 1, expiryCol + 1).setValue(expiry.toISOString());
      if (updatedCol >= 0) sheet.getRange(i + 1, updatedCol + 1).setValue(now.toISOString());
      return true;
    }
  }
  return false;
}

function handleCreateMembership(payload) {
  const userId = payload.user_id;
  const planId = payload.plan_id;
  const paypalRef = payload.paypal_reference || '';

  if (!userId || !planId) {
    return createJsonResponse({ error: 'user_id and plan_id are required.' }, 400);
  }

  const membershipId = 'MEM-' + Math.floor(100000 + Math.random() * 900000);
  const now = new Date();
  const expiry = new Date();
  expiry.setDate(now.getDate() + 30);

  const planAmount = planId === 'premium' ? 19.99 : (planId === 'basic' ? 9.99 : 0.00);
  const isFree = planAmount === 0;

  const record = {
    membership_id: membershipId,
    user_id: userId,
    plan_id: planId,
    plan_name: planId.toUpperCase() + ' Plan',
    amount: planAmount,
    payment_status: isFree ? 'verified' : 'pending',
    start_date: now.toISOString(),
    expiry_date: expiry.toISOString(),
    paypal_reference: paypalRef,
    created_at: now.toISOString()
  };

  appendObjectToSheet('Memberships', record);

  if (isFree) {
    updateUserMembership(userId, planId, 'active');
  }

  return createJsonResponse({
    message: isFree ? 'Free membership activated.' : 'Membership subscription logged. Awaiting payment approval.',
    membership: record
  }, 201);
}

function handleApproveMembership(payload) {
  const userId = payload.user_id;
  const planId = payload.plan_id;

  if (!userId || !planId) {
    return createJsonResponse({ error: 'user_id and plan_id are required.' }, 400);
  }

  const updated = updateUserMembership(userId, planId, 'active');
  if (updated) {
    return createJsonResponse({ message: 'Membership approved and activated.' });
  }
  return createJsonResponse({ error: 'User not found.' }, 404);
}

function handleRevokeMembership(payload) {
  const userId = payload.user_id;
  if (!userId) {
    return createJsonResponse({ error: 'user_id is required.' }, 400);
  }

  const updated = updateUserMembership(userId, 'free', 'active');
  if (updated) {
    return createJsonResponse({ message: 'Membership reset to Free tier.' });
  }
  return createJsonResponse({ error: 'User not found.' }, 404);
}
