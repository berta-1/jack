import { Router } from 'express';
import { storage } from '../db/storage.js';

const router = Router();

// GET /api/notifications
router.get('/', (req, res) => {
  const notifs = storage.getNotifications();
  return res.json(notifs);
});

// POST /api/notifications
router.post('/', (req, res) => {
  const notif = storage.createNotification(req.body);
  return res.status(201).json(notif);
});

// PATCH /api/notifications/:id/read
router.patch('/:id/read', (req, res) => {
  const { id } = req.params;
  const updated = storage.updateNotification(id, { read: true });
  return res.json(updated);
});

// PATCH /api/notifications/read-all
router.patch('/read-all', (req, res) => {
  const notifs = storage.getNotifications();
  notifs.forEach((n) => {
    storage.updateNotification(n.id, { read: true });
  });
  return res.json({ success: true });
});

export default router;
