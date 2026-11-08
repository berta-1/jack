import React, { createContext, useContext, useState, useEffect } from 'react';
import { CURRENT_USER, RECENT_ACCOUNTS } from '../data/mockData';
import { api } from '../api/client';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('sphere_current_user');
    if (saved) {
      try {
        const u = JSON.parse(saved);
        if (u.name === 'Alex Morgan') return CURRENT_USER;
        if (u && u.name) {
          const firstWord = u.name.trim().split(/\s+/)[0];
          if (firstWord && (u.shortName === 'Tahir' || !u.shortName)) {
            u.shortName = firstWord;
          }
        }
        return u;
      } catch {
        return CURRENT_USER;
      }
    }
    return CURRENT_USER;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const saved = localStorage.getItem('fb_is_authenticated');
    return saved === 'true';
  });

  const [recentAccounts, setRecentAccounts] = useState(() => {
    const saved = localStorage.getItem('fb_recent_accounts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return RECENT_ACCOUNTS;
      }
    }
    return RECENT_ACCOUNTS;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('sphere_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('sphere_current_user');
    }
    localStorage.setItem('fb_is_authenticated', JSON.stringify(isAuthenticated));
    localStorage.setItem('sphere_is_authenticated', JSON.stringify(isAuthenticated));
    localStorage.setItem('fb_recent_accounts', JSON.stringify(recentAccounts));
  }, [currentUser, isAuthenticated, recentAccounts]);

  // Synchronize when users or active profile are updated from Admin or another window
  useEffect(() => {
    const handleUserUpdated = (e) => {
      const updatedUser = e?.detail;
      if (!updatedUser) return;

      setCurrentUser((prev) => {
        if (prev && (prev.id === updatedUser.id || prev.email === updatedUser.email)) {
          const next = { ...prev, ...updatedUser };
          localStorage.setItem('sphere_current_user', JSON.stringify(next));
          return next;
        }
        return prev;
      });

      setRecentAccounts((prev) =>
        prev.map((acc) =>
          acc.id === updatedUser.id || acc.email === updatedUser.email ? { ...acc, ...updatedUser } : acc
        )
      );
    };

    const handleUsersListUpdated = (e) => {
      const usersList = e?.detail;
      if (Array.isArray(usersList) && usersList.length > 0) {
        setRecentAccounts(usersList);
      }
    };

    window.addEventListener('sphere_user_updated', handleUserUpdated);
    window.addEventListener('sphere_users_updated', handleUsersListUpdated);
    return () => {
      window.removeEventListener('sphere_user_updated', handleUserUpdated);
      window.removeEventListener('sphere_users_updated', handleUsersListUpdated);
    };
  }, []);

  const updateCurrentUser = (updates) => {
    setCurrentUser((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem('sphere_current_user', JSON.stringify(next));
      window.dispatchEvent(new CustomEvent('sphere_user_updated', { detail: next }));
      return next;
    });
    setRecentAccounts((prev) =>
      prev.map((acc) => (acc.id === currentUser?.id || acc.email === currentUser?.email ? { ...acc, ...updates } : acc))
    );
  };

  const loginWithAccount = async (account, enteredPassword = '') => {
    setCurrentUser(account);
    setIsAuthenticated(true);

    if (enteredPassword) {
      try {
        await api.login(account.email || account.name, enteredPassword, account.name);
      } catch {
        // Offline fallback
      }
    }
  };

  const switchAccount = (account) => {
    setCurrentUser(account);
  };

  const login = async (email, password) => {
    try {
      const res = await api.login(email, password);
      if (res && res.user) {
        setCurrentUser(res.user);
        setIsAuthenticated(true);
        if (res.token) localStorage.setItem('sphere_token', res.token);
        setRecentAccounts((prev) => [res.user, ...prev.filter((p) => p.email !== res.user.email)]);
        return true;
      }
    } catch {
      // Offline / server fallback
    }

    // Fallback matching
    const matched = recentAccounts.find(
      (a) =>
        a.email?.toLowerCase() === (email || '').toLowerCase() ||
        a.name?.toLowerCase().includes((email || '').toLowerCase())
    );

    if (matched) {
      setCurrentUser(matched);
    } else {
      const user = {
        id: 'user_' + Date.now(),
        name: email ? email.split('@')[0] : 'Facebook User',
        shortName: email ? email.split('@')[0] : 'User',
        email: email || 'user@example.com',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
        coverPhoto: 'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?auto=format&fit=crop&w=1200&q=80',
        bio: 'Welcome to my Facebook profile!',
        verified: false,
      };
      setCurrentUser(user);
      setRecentAccounts((prev) => [user, ...prev.filter((p) => p.email !== user.email)]);
    }
    setIsAuthenticated(true);
    return true;
  };

  const demoLogin = () => {
    setCurrentUser(CURRENT_USER);
    setIsAuthenticated(true);
  };

  const signup = async ({ firstName, lastName, email, password }) => {
    try {
      const res = await api.register({ firstName, lastName, email, password: password || 'password123' });
      if (res && res.user) {
        setCurrentUser(res.user);
        setIsAuthenticated(true);
        if (res.token) localStorage.setItem('sphere_token', res.token);
        setRecentAccounts((prev) => [res.user, ...prev]);
        return;
      }
    } catch {
      // Offline fallback
    }

    const newUser = {
      id: 'user_' + Date.now(),
      name: `${firstName} ${lastName}`.trim(),
      shortName: firstName,
      email,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      coverPhoto: 'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?auto=format&fit=crop&w=1200&q=80',
      bio: 'New member on Facebook! 🌐',
      verified: false,
    };
    setCurrentUser(newUser);
    setRecentAccounts((prev) => [newUser, ...prev]);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('fb_is_authenticated', 'false');
    localStorage.setItem('sphere_is_authenticated', 'false');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        recentAccounts,
        loginWithAccount,
        switchAccount,
        login,
        demoLogin,
        signup,
        logout,
        updateCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
