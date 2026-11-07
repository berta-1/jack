import { Router } from 'express';
import { storage } from '../db/storage.js';

const router = Router();

// GET /api/stories
router.get('/', (req, res) => {
  const stories = storage.getStories();
  return res.json(stories);
});

// POST /api/stories
router.post('/', (req, res) => {
  const story = storage.createStory(req.body);
  return res.status(201).json(story);
});

export default router;
