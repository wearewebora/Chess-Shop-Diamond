/**
 * BookVault - Books Management & Access Control (Books.gs)
 * Handles book listing, filtering, ownership verification, and CRUD operations.
 */

function handleGetBooks(e) {
  const books = sheetToObjects('Books');
  
  // Filter only published books for regular requests unless admin flag is sent
  const isAdmin = e.parameter.isAdmin === 'true';
  const publishedBooks = isAdmin ? books : books.filter(b => b.published === true || b.published === 'TRUE' || b.published === 'true');

  return createJsonResponse({
    books: publishedBooks
  });
}

function handleGetBook(e) {
  const bookId = e.parameter.book_id;
  const userId = e.parameter.user_id;

  if (!bookId) {
    return createJsonResponse({ error: 'Missing book_id parameter.' }, 400);
  }

  const books = sheetToObjects('Books');
  const book = books.find(b => b.book_id === bookId);
  if (!book) {
    return createJsonResponse({ error: 'Book not found.' }, 404);
  }

  // Check access permission
  let hasAccess = false;
  let accessReason = 'none';

  if (book.access_type === 'free' || Number(book.price) === 0) {
    hasAccess = true;
    accessReason = 'free';
  } else if (userId) {
    const users = sheetToObjects('Users');
    const user = users.find(u => u.user_id === userId);

    if (user && user.role === 'admin') {
      hasAccess = true;
      accessReason = 'admin';
    } else if (user && user.membership_status === 'active') {
      if (user.membership_plan === 'premium') {
        hasAccess = true;
        accessReason = 'premium_membership';
      } else if (user.membership_plan === 'basic' && book.access_type === 'basic_plan') {
        hasAccess = true;
        accessReason = 'basic_membership';
      }
    }

    // Check individual purchased orders
    if (!hasAccess) {
      const orders = sheetToObjects('Orders');
      const verifiedOrder = orders.find(o => 
        o.user_id === userId && 
        o.book_id === bookId && 
        (o.payment_status === 'verified' || o.payment_status === 'approved')
      );
      if (verifiedOrder) {
        hasAccess = true;
        accessReason = 'purchased';
      }
    }
  }

  // Securely redact private file_id if user has no authorized access
  const safeBook = { ...book };
  if (!hasAccess) {
    delete safeBook.file_id;
  }

  return createJsonResponse({
    book: safeBook,
    access: {
      hasAccess: hasAccess,
      accessReason: accessReason
    }
  });
}

function handleCreateBook(payload) {
  const title = (payload.title || '').trim();
  const author = (payload.author || '').trim();
  const price = Number(payload.price || 0);

  if (!title || !author) {
    return createJsonResponse({ error: 'Book title and author are required.' }, 400);
  }

  const bookId = 'bv-' + Utilities.getUuid().substring(0, 8);
  const now = new Date().toISOString();

  const newBook = {
    book_id: bookId,
    title: title,
    author: author,
    description: payload.description || '',
    category: payload.category || 'General',
    price: price,
    cover_url: payload.cover_url || '',
    file_id: payload.file_id || '',
    access_type: payload.access_type || (price === 0 ? 'free' : 'basic_plan'),
    membership_plan: payload.membership_plan || 'all',
    published: payload.published !== false,
    created_at: now,
    updated_at: now
  };

  appendObjectToSheet('Books', newBook);

  return createJsonResponse({
    message: 'Book created successfully.',
    book: newBook
  }, 201);
}

function handleUpdateBook(payload) {
  const bookId = payload.book_id;
  if (!bookId) {
    return createJsonResponse({ error: 'Missing book_id.' }, 400);
  }

  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName('Books');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const bookIdCol = headers.indexOf('book_id');

  for (let i = 1; i < data.length; i++) {
    if (data[i][bookIdCol] === bookId) {
      headers.forEach((header, colIndex) => {
        if (payload[header] !== undefined && header !== 'book_id' && header !== 'created_at') {
          sheet.getRange(i + 1, colIndex + 1).setValue(payload[header]);
        }
      });
      const updatedCol = headers.indexOf('updated_at');
      if (updatedCol >= 0) {
        sheet.getRange(i + 1, updatedCol + 1).setValue(new Date().toISOString());
      }
      return createJsonResponse({ message: 'Book updated successfully.' });
    }
  }

  return createJsonResponse({ error: 'Book not found.' }, 404);
}

function handleDeleteBook(payload) {
  const bookId = payload.book_id;
  if (!bookId) {
    return createJsonResponse({ error: 'Missing book_id.' }, 400);
  }

  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName('Books');
  const data = sheet.getDataRange().getValues();
  const bookIdCol = data[0].indexOf('book_id');

  for (let i = 1; i < data.length; i++) {
    if (data[i][bookIdCol] === bookId) {
      sheet.deleteRow(i + 1);
      return createJsonResponse({ message: 'Book deleted successfully.' });
    }
  }

  return createJsonResponse({ error: 'Book not found.' }, 404);
}
