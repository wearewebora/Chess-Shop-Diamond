/**
 * BookVault - Admin & Stats Module (Admin.gs)
 * Handles high-level SaaS metrics, user directory, contact message queue, and system settings.
 */

function handleGetDashboardStats(e) {
  const users = sheetToObjects('Users');
  const books = sheetToObjects('Books');
  const orders = sheetToObjects('Orders');
  const messages = sheetToObjects('ContactMessages');

  const totalUsers = users.length;
  const totalBooks = books.length;
  
  const verifiedOrders = orders.filter(o => o.payment_status === 'verified' || o.payment_status === 'approved');
  const totalSales = verifiedOrders.reduce((sum, o) => sum + Number(o.amount || 0), 0);
  
  const activeMembers = users.filter(u => u.membership_status === 'active' && (u.membership_plan === 'basic' || u.membership_plan === 'premium')).length;
  const pendingPayments = orders.filter(o => o.payment_status === 'pending').length;
  const unreadMessages = messages.filter(m => m.status === 'unread').length;

  return createJsonResponse({
    stats: {
      totalUsers: totalUsers,
      totalBooks: totalBooks,
      totalSales: Math.round(totalSales * 100) / 100,
      activeMembers: activeMembers,
      pendingPayments: pendingPayments,
      unreadMessages: unreadMessages
    }
  });
}

function handleSubmitContact(payload) {
  const name = (payload.name || '').trim();
  const email = (payload.email || '').trim();
  const subject = (payload.subject || '').trim();
  const message = (payload.message || '').trim();

  if (!name || !email || !message) {
    return createJsonResponse({ error: 'Name, email, and message are required.' }, 400);
  }

  const messageId = 'MSG-' + Math.floor(100000 + Math.random() * 900000);
  const record = {
    message_id: messageId,
    name: name,
    email: email,
    subject: subject || 'General Inquiry',
    message: message,
    status: 'unread',
    created_at: new Date().toISOString()
  };

  appendObjectToSheet('ContactMessages', record);

  return createJsonResponse({
    message: 'Thank you. Your message has been received and our team will get back to you shortly.',
    message_id: messageId
  }, 201);
}
