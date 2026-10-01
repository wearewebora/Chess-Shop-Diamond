/**
 * BookVault - Authentication Module (Auth.gs)
 * Handles secure user registration, password hashing (SHA-256 + salt), login, and profile updates.
 */

function hashPassword(password, salt) {
  const combined = password + salt;
  const rawHash = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, combined, Utilities.Charset.UTF_8);
  let hashStr = '';
  for (let i = 0; i < rawHash.length; i++) {
    let byteVal = rawHash[i];
    if (byteVal < 0) byteVal += 256;
    let byteHex = byteVal.toString(16);
    if (byteHex.length === 1) byteHex = '0' + byteHex;
    hashStr += byteHex;
  }
  return hashStr;
}

function handleRegisterUser(payload) {
  const fullName = (payload.full_name || '').trim();
  const email = (payload.email || '').trim().toLowerCase();
  const password = payload.password || '';

  if (!fullName || !email || !password) {
    return createJsonResponse({ error: 'Full name, email, and password are required.' }, 400);
  }

  if (password.length < 6) {
    return createJsonResponse({ error: 'Password must be at least 6 characters long.' }, 400);
  }

  const users = sheetToObjects('Users');
  const existing = users.find(u => (u.email || '').toLowerCase() === email);
  if (existing) {
    return createJsonResponse({ error: 'An account with this email already exists.' }, 409);
  }

  const salt = Utilities.getUuid().substring(0, 16);
  const passwordHash = salt + ':' + hashPassword(password, salt);
  const userId = 'usr-' + Utilities.getUuid().substring(0, 8);
  const now = new Date().toISOString();

  const newUser = {
    user_id: userId,
    full_name: fullName,
    email: email,
    password_hash: passwordHash,
    role: 'member',
    membership_plan: 'free',
    membership_status: 'active',
    membership_start: now,
    membership_expiry: new Date(Date.now() + 3650 * 24 * 60 * 60 * 1000).toISOString(), // 10 years for free
    created_at: now,
    updated_at: now
  };

  appendObjectToSheet('Users', newUser);

  // Return safe user representation without password_hash
  const safeUser = { ...newUser };
  delete safeUser.password_hash;

  return createJsonResponse({
    message: 'User registered successfully.',
    user: safeUser,
    token: Utilities.base64Encode(userId + ':' + now)
  }, 201);
}

function handleLoginUser(payload) {
  const email = (payload.email || '').trim().toLowerCase();
  const password = payload.password || '';

  if (!email || !password) {
    return createJsonResponse({ error: 'Email and password are required.' }, 400);
  }

  const users = sheetToObjects('Users');
  const user = users.find(u => (u.email || '').toLowerCase() === email);
  if (!user) {
    return createJsonResponse({ error: 'Invalid email or password.' }, 401);
  }

  const storedHash = user.password_hash || '';
  const parts = storedHash.split(':');
  if (parts.length !== 2) {
    return createJsonResponse({ error: 'Authentication format error.' }, 500);
  }

  const salt = parts[0];
  const expectedHash = parts[1];
  const computed = hashPassword(password, salt);

  if (computed !== expectedHash) {
    return createJsonResponse({ error: 'Invalid email or password.' }, 401);
  }

  const safeUser = { ...user };
  delete safeUser.password_hash;
  const token = Utilities.base64Encode(user.user_id + ':' + new Date().toISOString());

  return createJsonResponse({
    message: 'Login successful.',
    user: safeUser,
    token: token
  });
}

function handleGetUserProfile(e) {
  const userId = e.parameter.user_id;
  if (!userId) {
    return createJsonResponse({ error: 'Missing user_id parameter.' }, 400);
  }

  const users = sheetToObjects('Users');
  const user = users.find(u => u.user_id === userId);
  if (!user) {
    return createJsonResponse({ error: 'User not found.' }, 404);
  }

  const safeUser = { ...user };
  delete safeUser.password_hash;
  return createJsonResponse({ user: safeUser });
}

function handleUpdateProfile(payload) {
  const userId = payload.user_id;
  if (!userId) {
    return createJsonResponse({ error: 'User ID is required.' }, 400);
  }

  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName('Users');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const userIdCol = headers.indexOf('user_id');
  const fullNameCol = headers.indexOf('full_name');
  const updatedCol = headers.indexOf('updated_at');

  for (let i = 1; i < data.length; i++) {
    if (data[i][userIdCol] === userId) {
      if (payload.full_name && fullNameCol >= 0) {
        sheet.getRange(i + 1, fullNameCol + 1).setValue(payload.full_name);
      }
      if (updatedCol >= 0) {
        sheet.getRange(i + 1, updatedCol + 1).setValue(new Date().toISOString());
      }
      return createJsonResponse({ message: 'Profile updated successfully.' });
    }
  }

  return createJsonResponse({ error: 'User not found.' }, 404);
}
