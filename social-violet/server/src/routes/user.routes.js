import { Router } from 'express';
import { storage } from '../db/storage.js';

const router = Router();

// GET /api/users/contacts
router.get('/contacts', (req, res) => {
  const users = storage.getUsers();
  const contacts = users.map((u) => ({
    id: u.id,
    name: u.name,
    avatar: u.avatar,
    online: u.online,
    statusText: u.bio || 'Active now',
    lastMessage: 'Tap to send a message 👋',
  }));
  return res.json(contacts);
});

// GET /api/users/:id
router.get('/:id', (req, res) => {
  const user = storage.getUserById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  return res.json(user);
});

// PUT /api/users/profile
router.put('/profile', (req, res) => {
  const { id, ...updates } = req.body;
  const targetId = id || 'user_current';
  const updated = storage.updateUser(targetId, updates);
  return res.json(updated);
});

export default router;
