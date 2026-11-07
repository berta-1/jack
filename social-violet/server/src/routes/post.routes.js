import { Router } from 'express';
import { storage } from '../db/storage.js';

const router = Router();

// GET /api/posts - Get feed posts
router.get('/', (req, res) => {
  const posts = storage.getPosts();
  return res.json(posts);
});

// POST /api/posts - Create new post
router.post('/', (req, res) => {
  const { content, caption, privacy, backgroundCard, media, author } = req.body;

  const currentAuthor = author || {
    id: 'user_current',
    name: 'Berta Hule',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    badge: '',
    verified: true,
    hasFollow: true,
  };

  const newPost = storage.createPost({
    author: currentAuthor,
    content: content || '',
    caption: caption || '',
    privacy: privacy || 'public',
    backgroundCard: backgroundCard || null,
    media: media || [],
  });

  return res.status(201).json(newPost);
});

// DELETE /api/posts/:id
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  storage.deletePost(id);
  return res.json({ message: 'Post deleted successfully', id });
});

// POST /api/posts/:id/react - Toggle/update reaction
router.post('/:id/react', (req, res) => {
  const { id } = req.params;
  const { type = 'like' } = req.body;
  const updated = storage.reactPost(id, type);
  return res.json(updated);
});

// POST /api/posts/:id/comments - Add comment
router.post('/:id/comments', (req, res) => {
  const { id } = req.params;
  const { text, author } = req.body;

  const commentAuthor = author || {
    name: 'Berta Hule',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
  };

  const newComment = storage.addComment(id, {
    author: commentAuthor,
    text,
  });

  return res.status(201).json(newComment);
});

export default router;
