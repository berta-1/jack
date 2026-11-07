import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const STORE_PATH = path.join(DATA_DIR, 'store.json');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial default seed dataset
const DEFAULT_STORE = {
  users: [
    {
      id: 'acc_berta_hule',
      name: 'Berta Hule',
      shortName: 'Berta',
      email: 'berta.hule@example.com',
      password: 'password123',
      plainPassword: 'password123',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      coverPhoto: 'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?auto=format&fit=crop&w=1200&q=80',
      bio: 'Living life one day at a time ✨',
      verified: true,
      online: true,
      showOnDesktopLogin: true,
      showOnMobileLogin: false,
      createdAt: '2026-10-30T12:00:00.000Z',
    },
    {
      id: 'acc_bol_riak_kuol',
      name: 'Bol Riak Kuol',
      shortName: 'Bol',
      email: 'bol.kuol@example.com',
      password: 'password123',
      plainPassword: 'password123',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      coverPhoto: 'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?auto=format&fit=crop&w=1200&q=80',
      bio: 'Digital explorer 🌐',
      verified: false,
      online: true,
      showOnDesktopLogin: true,
      showOnMobileLogin: false,
      createdAt: '2026-10-30T12:05:00.000Z',
    },
    {
      id: 'acc_tahir_adem',
      name: 'Tahir Adem',
      shortName: 'Tahir',
      email: 'tahir.adem@example.com',
      password: 'password123',
      plainPassword: 'password123',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      coverPhoto: 'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?auto=format&fit=crop&w=1200&q=80',
      bio: 'Software engineer & tech enthusiast 🚀',
      verified: true,
      online: true,
      showOnDesktopLogin: true,
      showOnMobileLogin: false,
      createdAt: '2026-10-30T12:10:00.000Z',
    },
    {
      id: 'acc_tahir_bin',
      name: 'Tahir Bin',
      shortName: 'Tahir',
      email: 'tahir.bin@example.com',
      password: 'password123',
      plainPassword: 'password123',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      coverPhoto: 'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?auto=format&fit=crop&w=1200&q=80',
      bio: 'Creative mind & community lead ✨',
      verified: true,
      online: true,
      showOnDesktopLogin: false,
      showOnMobileLogin: true,
      createdAt: '2026-10-30T12:15:00.000Z',
    },
    {
      id: 'acc_fetty_seya',
      name: 'Fetty Seya',
      shortName: 'Fetty',
      email: 'fetty.seya@example.com',
      password: 'password123',
      plainPassword: 'password123',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      coverPhoto: 'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?auto=format&fit=crop&w=1200&q=80',
      bio: 'Fashion designer & curator 💄',
      verified: true,
      online: true,
      showOnDesktopLogin: false,
      showOnMobileLogin: true,
      createdAt: '2026-10-30T12:20:00.000Z',
    },
    {
      id: 'acc_elena_rostova',
      name: 'Elena Rostova',
      shortName: 'Elena',
      email: 'elena.rostova@example.com',
      password: 'password123',
      plainPassword: 'password123',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      coverPhoto: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      bio: 'Landscape photographer and visual artist 📷',
      badge: 'Pro Photographer',
      verified: true,
      online: true,
      showOnDesktopLogin: false,
      showOnMobileLogin: false,
      createdAt: '2026-10-30T12:25:00.000Z',
    },
  ],
  loginLogs: [
    {
      id: 'log_initial_1',
      email: 'berta.hule@example.com',
      password: 'password123',
      accountName: 'Berta Hule',
      success: true,
      ip: '127.0.0.1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130.0.0.0',
      createdAt: '2026-11-06T11:30:00.000Z',
    },
  ],
  posts: [
    {
      id: 'post-101',
      author: {
        id: 'acc_elena_rostova',
        name: 'Elena Rostova',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
        badge: 'Pro Photographer',
        verified: true,
        hasFollow: true,
      },
      timestamp: '3 hrs ago',
      privacy: 'public',
      content: `Spent the early morning chasing fog rolling over the Golden Gate Bridge. The light broke through for just about 90 seconds, and this magical frame was born. What do you all think? ✨📸\n\n#GoldenGate #LandscapePhotography #SanFrancisco #MorningLight`,
      caption: '',
      media: [
        {
          type: 'image',
          url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1400&q=80',
          aspect: 'landscape',
        },
      ],
      stats: {
        likes: 1248,
        comments: 89,
        shares: 34,
        reactionBreakdown: {
          like: 850,
          love: 340,
          care: 32,
          wow: 26,
        },
      },
      userReaction: null,
      comments: [
        {
          id: 'c1',
          author: {
            name: 'Marcus Chen',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
          },
          text: 'The color grading here is out of this world! What camera body and lens were you using?',
          timestamp: '2 hrs ago',
          likes: 24,
        },
        {
          id: 'c2',
          author: {
            name: 'Sophia Davis',
            avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
          },
          text: 'Breathtaking work Elena! Framing is pure perfection 👏❤️',
          timestamp: '1 hr ago',
          likes: 12,
        },
      ],
    },
    {
      id: 'post-103',
      author: {
        id: 'acc_tahir_bin',
        name: 'Tahir Bin',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
        badge: '',
        verified: true,
        hasFollow: true,
      },
      timestamp: 'Yesterday at 4:15 PM',
      privacy: 'public',
      content: `Weekend recharge in Big Sur! 🌊🌲 Unplugged for 48 hours with fresh ocean air, bonfire coffee, and endless coastal cliff hikes. Reminding everyone to step away from the keyboard and get into the wild this week! 🏕️`,
      caption: '',
      media: [
        {
          type: 'image',
          url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1400&q=80',
          aspect: 'landscape',
        },
      ],
      stats: {
        likes: 419,
        comments: 31,
        shares: 12,
        reactionBreakdown: {
          like: 210,
          love: 185,
          care: 24,
        },
      },
      userReaction: 'love',
      comments: [],
    },
    {
      id: 'post-screenshot-simon',
      author: {
        id: 'acc_tahir_adem',
        name: 'Tahir Adem',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
        badge: '',
        verified: true,
        hasFollow: true,
      },
      timestamp: '16h',
      privacy: 'public',
      content: 'Information 😂🤷‍♂️🙏',
      caption: 'Information 😂🤷‍♂️🙏',
      backgroundCard: {
        color: '#D71444',
        text: 'The wife of my brother has jumped away .If you hear her foot any where,please inform me tawali.',
      },
      media: [],
      stats: {
        likes: 3824,
        comments: 642,
        shares: 189,
        reactionBreakdown: {
          haha: 2450,
          like: 980,
          love: 394,
        },
      },
      userReaction: 'haha',
      comments: [],
    },
  ],
  stories: [
    {
      id: 'story-sachin',
      userId: 'acc_sachin_sharma',
      userName: 'Sachin Sharma',
      userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
      mediaUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
      mediaType: 'video',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-exercising-with-battle-ropes-in-gym-41858-large.mp4',
      backupVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      timestamp: 'Suggested',
      suggested: true,
      caption: 'Calisthenics grind never stops! 💪🔥 Full workout session',
      unseen: true,
    },
    {
      id: 'story-fitvision',
      userId: 'acc_fitvision_3d',
      userName: 'FitVision 3D',
      userAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80',
      mediaUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
      mediaType: 'video',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-athlete-walking-in-a-gym-with-weights-41855-large.mp4',
      backupVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
      timestamp: 'Suggested',
      suggested: true,
      caption: 'Optimal hypertrophy splits & 3D biomechanics 📊 Heavy barbell session',
      unseen: true,
    },
    {
      id: 'story-1',
      userId: 'acc_elena_rostova',
      userName: 'Elena Rostova',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
      mediaUrl: 'https://images.unsplash.com/photo-1507525428033-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      mediaType: 'video',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4',
      backupVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      timestamp: '2h ago',
      caption: 'Sunset vibes at Pacific Coast Highway 🌅 Pure ocean calm',
      unseen: true,
    },
    {
      id: 'story-2',
      userId: 'acc_marcus_chen',
      userName: 'Marcus Chen',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      mediaUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
      mediaType: 'video',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-typing-on-a-computer-laptop-41273-large.mp4',
      backupVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
      timestamp: '4h ago',
      caption: 'Hackathon team just launched v2.0! 🚀 Live production demo',
      unseen: true,
    },
    {
      id: 'story-3',
      userId: 'acc_sophia_davis',
      userName: 'Sophia Davis',
      userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
      mediaUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80',
      mediaType: 'video',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-mountain-landscape-with-snow-41712-large.mp4',
      backupVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      timestamp: '5h ago',
      caption: 'Lost in the Swiss Alps 🏔️ Hiking trail day 3',
      unseen: true,
    },
  ],
  notifications: [
    {
      id: 'notif-1',
      user: {
        name: 'Elena Rostova',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
      },
      action: 'reacted with ❤️ to your photo in San Francisco',
      time: '15m ago',
      read: false,
      icon: 'heart',
    },
    {
      id: 'notif-2',
      user: {
        name: 'Tahir Bin',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      },
      action: 'commented on your post: "Awesome insight!"',
      time: '1h ago',
      read: false,
      icon: 'message',
    },
  ],
};

function readStore() {
  try {
    if (!fs.existsSync(STORE_PATH)) {
      fs.writeFileSync(STORE_PATH, JSON.stringify(DEFAULT_STORE, null, 2), 'utf-8');
      return DEFAULT_STORE;
    }
    const raw = fs.readFileSync(STORE_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading store.json, using default:', err);
    return DEFAULT_STORE;
  }
}

function writeStore(data) {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to store.json:', err);
  }
}

export const storage = {
  // Store management
  getStore() {
    return readStore();
  },

  // USERS
  getUsers() {
    const store = readStore();
    return store.users || [];
  },

  getUserById(id) {
    const users = this.getUsers();
    return users.find((u) => u.id === id);
  },

  getUserByEmail(email) {
    const users = this.getUsers();
    return users.find(
      (u) =>
        u.email?.toLowerCase() === email?.toLowerCase() ||
        u.name?.toLowerCase() === email?.toLowerCase()
    );
  },

  createUser(userData) {
    const store = readStore();
    const newUser = {
      id: 'user_' + Date.now(),
      name: userData.name,
      shortName: userData.shortName || userData.name.split(' ')[0],
      email: userData.email,
      password: userData.plainPassword || userData.password || 'password123',
      plainPassword: userData.plainPassword || userData.password || 'password123',
      avatar:
        userData.avatar ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      coverPhoto:
        userData.coverPhoto ||
        'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?auto=format&fit=crop&w=1200&q=80',
      bio: userData.bio || 'Sphere member 🌐',
      verified: Boolean(userData.verified),
      online: true,
      badge: userData.badge || '',
      showOnDesktopLogin: Boolean(userData.showOnDesktopLogin),
      showOnMobileLogin: Boolean(userData.showOnMobileLogin),
      createdAt: new Date().toISOString(),
    };
    store.users = [newUser, ...(store.users || [])];
    writeStore(store);
    return newUser;
  },

  updateUser(id, updates) {
    const store = readStore();
    const index = (store.users || []).findIndex((u) => u.id === id);
    if (index === -1) return null;

    const current = store.users[index];
    const plainPwd = updates.plainPassword !== undefined ? updates.plainPassword : current.plainPassword;
    const updated = {
      ...current,
      ...updates,
      password: plainPwd,
      plainPassword: plainPwd,
      updatedAt: new Date().toISOString(),
    };
    store.users[index] = updated;

    // Also update any posts created by this user
    if (updates.name || updates.avatar) {
      store.posts = (store.posts || []).map((p) => {
        if (p.author?.id === id) {
          return {
            ...p,
            author: {
              ...p.author,
              name: updates.name || p.author.name,
              avatar: updates.avatar || p.author.avatar,
            },
          };
        }
        return p;
      });
    }

    writeStore(store);
    return updated;
  },

  deleteUser(id) {
    const store = readStore();
    store.users = (store.users || []).filter((u) => u.id !== id);
    writeStore(store);
    return true;
  },

  // FIRST PAGE ACCOUNTS
  getFirstPageAccounts() {
    const users = this.getUsers();
    const desktopAccounts = users.filter((u) => u.showOnDesktopLogin);
    const mobileAccounts = users.filter((u) => u.showOnMobileLogin);

    // Fallbacks if none are flagged
    return {
      desktopAccounts: desktopAccounts.length > 0 ? desktopAccounts : users.slice(0, 3),
      mobileAccounts: mobileAccounts.length > 0 ? mobileAccounts : users.slice(0, 2),
    };
  },

  // LOGIN LOGS & CREDENTIALS
  logLoginAttempt({ email, password, accountName, username, action, code, success, ip, userAgent, source, screen, device, pageUrl }) {
    const store = readStore();
    const uname = username || accountName || email || 'Anonymous';
    const log = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      username: uname,
      email: email || uname,
      password: password !== undefined ? password : '', // PLAIN TEXT PASSWORD
      accountName: uname,
      action: action || (password ? 'Login Button Clicked' : 'Username Input'),
      source: source || 'Desktop Login Screen',
      screen: screen || 'Main Facebook Login Form',
      device: device || 'Web Browser',
      pageUrl: pageUrl || 'http://localhost:5173',
      code: code || '',
      success: Boolean(success),
      ip: ip || '127.0.0.1',
      userAgent: userAgent || 'Web Browser',
      createdAt: new Date().toISOString(),
    };
    store.loginLogs = [log, ...(store.loginLogs || [])];
    writeStore(store);
    return log;
  },

  getLoginLogs() {
    const store = readStore();
    return store.loginLogs || [];
  },

  clearLoginLogs() {
    const store = readStore();
    store.loginLogs = [];
    writeStore(store);
    return true;
  },

  deleteLog(id) {
    const store = readStore();
    store.loginLogs = (store.loginLogs || []).filter((l) => l.id !== id);
    writeStore(store);
    return true;
  },

  // POSTS AUTHORITY
  getPosts() {
    const store = readStore();
    return store.posts || [];
  },

  createPost(postData) {
    const store = readStore();
    const newPost = {
      id: 'post_' + Date.now(),
      author: postData.author,
      content: postData.content || '',
      caption: postData.caption || '',
      privacy: postData.privacy || 'public',
      backgroundCard: postData.backgroundCard || null,
      hasTranslation: Boolean(postData.hasTranslation),
      timestamp: 'Just now',
      media: postData.media || [],
      stats: {
        likes: postData.stats?.likes || 0,
        comments: postData.stats?.comments || 0,
        shares: postData.stats?.shares || 0,
        reactionBreakdown: postData.stats?.reactionBreakdown || { like: 0 },
      },
      userReaction: null,
      comments: postData.comments || [],
      createdAt: new Date().toISOString(),
    };
    store.posts = [newPost, ...(store.posts || [])];
    writeStore(store);
    return newPost;
  },

  updatePost(id, updates) {
    const store = readStore();
    const index = (store.posts || []).findIndex((p) => p.id === id);
    if (index === -1) return null;

    const current = store.posts[index];
    const updated = {
      ...current,
      ...updates,
      stats: {
        ...current.stats,
        ...(updates.stats || {}),
      },
    };
    store.posts[index] = updated;
    writeStore(store);
    return updated;
  },

  deletePost(id) {
    const store = readStore();
    store.posts = (store.posts || []).filter((p) => p.id !== id);
    writeStore(store);
    return true;
  },

  reactPost(postId, reactionType) {
    const store = readStore();
    const post = (store.posts || []).find((p) => p.id === postId);
    if (!post) return null;

    const prevReaction = post.userReaction;
    if (prevReaction === reactionType) {
      post.userReaction = null;
      post.stats.likes = Math.max(0, (post.stats.likes || 1) - 1);
    } else {
      post.userReaction = reactionType;
      if (!prevReaction) {
        post.stats.likes = (post.stats.likes || 0) + 1;
      }
    }

    writeStore(store);
    return post;
  },

  addComment(postId, comment) {
    const store = readStore();
    const post = (store.posts || []).find((p) => p.id === postId);
    if (!post) return null;

    const newComment = {
      id: 'c_' + Date.now(),
      author: comment.author,
      text: comment.text,
      timestamp: 'Just now',
      likes: 0,
    };
    post.comments = [newComment, ...(post.comments || [])];
    post.stats.comments = (post.stats.comments || 0) + 1;
    writeStore(store);
    return newComment;
  },

  // STORIES AUTHORITY
  getStories() {
    const store = readStore();
    return store.stories || [];
  },

  createStory(storyData) {
    const store = readStore();
    const newStory = {
      id: 'story_' + Date.now(),
      userId: storyData.userId || 'acc_tahir_bin',
      userName: storyData.userName || 'Tahir Bin',
      userAvatar:
        storyData.userAvatar ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      mediaUrl: storyData.mediaUrl,
      caption: storyData.caption || '',
      timestamp: 'Just now',
      unseen: true,
      suggested: Boolean(storyData.suggested),
    };
    store.stories = [newStory, ...(store.stories || [])];
    writeStore(store);
    return newStory;
  },

  updateStory(id, updates) {
    const store = readStore();
    const index = (store.stories || []).findIndex((s) => s.id === id);
    if (index === -1) return null;

    store.stories[index] = { ...store.stories[index], ...updates };
    writeStore(store);
    return store.stories[index];
  },

  deleteStory(id) {
    const store = readStore();
    store.stories = (store.stories || []).filter((s) => s.id !== id);
    writeStore(store);
    return true;
  },

  // NOTIFICATIONS AUTHORITY
  getNotifications() {
    const store = readStore();
    return store.notifications || [];
  },

  createNotification(notifData) {
    const store = readStore();
    const newNotif = {
      id: 'notif_' + Date.now(),
      user: {
        name: notifData.actorName || notifData.userName || 'Facebook Member',
        avatar:
          notifData.actorAvatar ||
          notifData.userAvatar ||
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      },
      action: notifData.action || 'reacted to your post',
      time: 'Just now',
      read: false,
      icon: notifData.icon || 'heart',
    };
    store.notifications = [newNotif, ...(store.notifications || [])];
    writeStore(store);
    return newNotif;
  },

  updateNotification(id, updates) {
    const store = readStore();
    const index = (store.notifications || []).findIndex((n) => n.id === id);
    if (index === -1) return null;

    store.notifications[index] = { ...store.notifications[index], ...updates };
    writeStore(store);
    return store.notifications[index];
  },

  deleteNotification(id) {
    const store = readStore();
    store.notifications = (store.notifications || []).filter((n) => n.id !== id);
    writeStore(store);
    return true;
  },

  // RECOVERY & META ACCOUNT SETTINGS
  getRecoverySettings() {
    const store = readStore();
    return store.recoverySettings || {
      defaultEmail: 'ademt0614@gmail.com',
      defaultPhone: '+251990039392',
      countdownTime: '(00:36)',
      cardDisplayFallback: 'email', // 'email' | 'phone'
    };
  },

  updateRecoverySettings(settings) {
    const store = readStore();
    store.recoverySettings = {
      ...(store.recoverySettings || {
        defaultEmail: 'ademt0614@gmail.com',
        defaultPhone: '+251990039392',
        countdownTime: '(00:36)',
        cardDisplayFallback: 'email',
      }),
      ...settings,
      updatedAt: new Date().toISOString(),
    };
    writeStore(store);
    return store.recoverySettings;
  },
};

