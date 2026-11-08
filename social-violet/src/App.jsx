import React, { useState, useEffect } from 'react';
import { PenLine, Wifi, X, Check } from 'lucide-react';
import Navbar from './components/Navbar';
import LeftSidebar from './components/LeftSidebar';
import StoriesBar from './components/StoriesBar';
import CreatePostBox from './components/CreatePostBox';
import CreatePostModal from './components/CreatePostModal';
import CreateStoryModal from './components/CreateStoryModal';
import PostCard from './components/PostCard';
import MessengerDock from './components/MessengerDock';
import StoryViewerModal from './components/StoryViewerModal';
import NotificationsDropdown from './components/NotificationsDropdown';
import ProfileDropdown from './components/ProfileDropdown';

import FriendsView from './components/FriendsView';
import WatchView from './components/WatchView';
import MarketplaceView from './components/MarketplaceView';
import GroupsView from './components/GroupsView';
import LoginPage from './components/LoginPage';
import AdminDashboard from './components/AdminDashboard';
import FacebookLoadingScreen from './components/FacebookLoadingScreen';
import FacebookOfflineScreen from './components/FacebookOfflineScreen';
import FacebookPageErrorScreen from './components/FacebookPageErrorScreen';
import MobileBottomNav from './components/MobileBottomNav';
import { useAuth } from './context/AuthContext';
import { api } from './api/client';
import { getCurrentRoute, setRoute } from './utils/router';

import {
  INITIAL_POSTS,
  INITIAL_STORIES,
  CONTACTS,
  INITIAL_NOTIFICATIONS,
} from './data/mockData';

export default function App() {
  const { isAuthenticated } = useAuth();
  const [currentRoute, setCurrentRoute] = useState(() => getCurrentRoute());
  const isAdminRoute = currentRoute.page === 'admin';

  const [activeTab, setActiveTab] = useState(() => {
    const route = getCurrentRoute();
    if (['home', 'friends', 'watch', 'marketplace', 'groups'].includes(route.page)) {
      return route.page;
    }
    return 'home';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isFeedLoading, setIsFeedLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleUrlChange = () => {
      const route = getCurrentRoute();
      setCurrentRoute(route);
      if (['home', 'friends', 'watch', 'marketplace', 'groups'].includes(route.page)) {
        setActiveTab(route.page);
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const route = getCurrentRoute();
      if (['login', 'accounts', '2fa', 'forgot', 'signup'].includes(route.page) || !route.page) {
        setRoute('home', true);
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Global helper so you can easily simulate/test offline mode in console:
    // window.simulateOffline(true) or window.simulateOffline(false)
    window.simulateOffline = (val) => setIsOffline(Boolean(val));

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      delete window.simulateOffline;
    };
  }, []);

  const handleCheckConnectivity = async () => {
    if (navigator.onLine) {
      try {
        await fetch(window.location.origin + '/?ping=' + Date.now(), {
          method: 'HEAD',
          cache: 'no-store',
        });
        setIsOffline(false);
        return;
      } catch {
        // Still unreachable
      }
    }
    window.location.reload();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = (tab) => {
    if (tab === 'home') {
      setIsFeedLoading(true);
      setTimeout(() => setIsFeedLoading(false), 600);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setActiveTab(tab);
    setRoute(tab);
  };

  // Posts State (with localStorage & dynamic backend sync)
  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem('sphere_posts');
    if (!saved) return INITIAL_POSTS.map((p) => ({ ...p, userReaction: null }));
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((p) => ({
          ...p,
          content: p.content || p.caption || '',
          userReaction: p.userExplicitlyReacted ? p.userReaction : null,
        }));
      }
      return INITIAL_POSTS.map((p) => ({ ...p, userReaction: null }));
    } catch {
      return INITIAL_POSTS.map((p) => ({ ...p, userReaction: null }));
    }
  });

  useEffect(() => {
    localStorage.setItem('sphere_posts', JSON.stringify(posts));
  }, [posts]);

  // Sync posts when updated dynamically from Admin
  useEffect(() => {
    const handlePostsUpdated = () => {
      const saved = localStorage.getItem('sphere_posts');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setPosts(parsed);
          }
        } catch {}
      }
    };

    window.addEventListener('sphere_posts_updated', handlePostsUpdated);
    window.addEventListener('storage', handlePostsUpdated);
    return () => {
      window.removeEventListener('sphere_posts_updated', handlePostsUpdated);
      window.removeEventListener('storage', handlePostsUpdated);
    };
  }, []);

  // Stories State
  const [stories, setStories] = useState(() => {
    const saved = localStorage.getItem('sphere_stories');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.videoUrl) return parsed;
      } catch (e) {}
    }
    return INITIAL_STORIES;
  });
  const [activeStoryViewer, setActiveStoryViewer] = useState(null);
  const [isCreateStoryModalOpen, setIsCreateStoryModalOpen] = useState(false);

  const handlePublishStory = async (newStory) => {
    const updated = [newStory, ...stories];
    setStories(updated);
    localStorage.setItem('sphere_stories', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('sphere_stories_updated', { detail: updated }));
    try {
      await api.createStory(newStory);
    } catch {}
  };

  // Sync stories when updated in admin or another tab
  useEffect(() => {
    const handleStoriesUpdated = (e) => {
      if (e?.detail && Array.isArray(e.detail)) {
        setStories(e.detail);
      } else {
        const local = localStorage.getItem('sphere_stories');
        if (local) {
          try {
            const parsed = JSON.parse(local);
            if (Array.isArray(parsed) && parsed.length > 0) setStories(parsed);
          } catch (err) {}
        }
      }
    };
    window.addEventListener('sphere_stories_updated', handleStoriesUpdated);
    window.addEventListener('storage', handleStoriesUpdated);
    return () => {
      window.removeEventListener('sphere_stories_updated', handleStoriesUpdated);
      window.removeEventListener('storage', handleStoriesUpdated);
    };
  }, []);

  // Contacts & Messenger State
  const [contacts, setContacts] = useState(CONTACTS);
  const [activeChats, setActiveChats] = useState([]);

  // Notifications State
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('sphere_notifications');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.badge) return parsed;
      }
    } catch {}
    return INITIAL_NOTIFICATIONS;
  });
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Sync data from backend if server is active
  useEffect(() => {
    api.getPosts().then((res) => {
      if (res && Array.isArray(res) && res.length > 0) setPosts(res);
    }).catch(() => {});

    api.getStories().then((res) => {
      if (res && Array.isArray(res) && res.length > 0) setStories(res);
    }).catch(() => {});

    api.getNotifications().then((res) => {
      if (res && Array.isArray(res) && res.length > 0) {
        if (res.some((n) => n.badge || n.type === 'security_alert')) {
          setNotifications(res);
        }
      }
    }).catch(() => {});
  }, []);

  // Create Post Modal State
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [postModalType, setPostModalType] = useState('standard');
  const [showInternetToast, setShowInternetToast] = useState(true);

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  // Open / Add Chat Dock
  const handleOpenMessenger = (contact) => {
    setActiveChats((prev) => {
      if (prev.some((c) => c.contact.id === contact.id)) {
        return prev;
      }
      return [
        ...prev,
        {
          contact,
          messages: [
            {
              id: 'm1',
              sender: 'them',
              text: contact.lastMessage || 'Hey there! How is your day going?',
            },
          ],
        },
      ].slice(-2); // Keep maximum 2 floating chats open side-by-side
    });
  };

  const handleCloseChat = (contactId) => {
    setActiveChats((prev) => prev.filter((c) => c.contact.id !== contactId));
  };

  const handleSendMessage = (contactId, text) => {
    // Add User Message
    setActiveChats((prev) =>
      prev.map((c) => {
        if (c.contact.id !== contactId) return c;
        return {
          ...c,
          messages: [
            ...c.messages,
            { id: 'msg_' + Date.now(), sender: 'me', text },
          ],
        };
      })
    );

    // Auto simulated friendly reply after 1.2s
    setTimeout(() => {
      const responses = [
        "That's awesome! Let's definitely catch up soon 🙌",
        "Totally agree with you on that!",
        "Thanks for sharing, checking it out now 🔥",
        "Haha love that! Have you seen the latest update?",
        "Sounds like a plan! Let me know when you're free.",
      ];
      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];

      setActiveChats((prev) =>
        prev.map((c) => {
          if (c.contact.id !== contactId) return c;
          return {
            ...c,
            messages: [
              ...c.messages,
              {
                id: 'msg_reply_' + Date.now(),
                sender: 'them',
                text: randomResponse,
              },
            ],
          };
        })
      );
    }, 1200);
  };

  // Reactions Handler (Likes increase & toggle)
  const handleUpdateReaction = (postId, reactionType) => {
    setPosts((prevPosts) =>
      prevPosts.map((p) => {
        if (p.id !== postId) return p;

        const previousReaction = p.userReaction;
        const newReaction = reactionType;
        let likesDelta = 0;

        if (!previousReaction && newReaction) {
          likesDelta = 1;
        } else if (previousReaction && !newReaction) {
          likesDelta = -1;
        }

        const curLikes = (p.stats && typeof p.stats.likes === 'number') ? p.stats.likes : 0;
        return {
          ...p,
          userReaction: newReaction,
          userExplicitlyReacted: !!newReaction,
          stats: {
            ...p.stats,
            likes: Math.max(0, curLikes + likesDelta),
          },
        };
      })
    );
  };

  // Share Handler (Increments post share count and shows Facebook toast)
  const [shareToast, setShareToast] = useState(false);
  const handleSharePost = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((p) => {
        if (p.id !== postId) return p;
        const curShares = (p.stats && typeof p.stats.shares === 'number') ? p.stats.shares : 0;
        return {
          ...p,
          userShared: true,
          stats: {
            ...p.stats,
            shares: curShares + 1,
          },
        };
      })
    );
    setShareToast(true);
    setTimeout(() => {
      setShareToast(false);
    }, 2500);
  };

  // Comments Handler
  const handleAddComment = (postId, comment) => {
    setPosts((prevPosts) =>
      prevPosts.map((p) => {
        if (p.id !== postId) return p;
        return {
          ...p,
          comments: [comment, ...(p.comments || [])],
          stats: {
            ...p.stats,
            comments: (p.comments ? p.comments.length : p.stats.comments) + 1,
          },
        };
      })
    );
  };

  // Submit New Post
  const handleAddPost = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  // Mark all notifications read
  const handleMarkAllNotifsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleNotificationClick = (notifId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
    );
    setShowNotifs(false);
  };

  // Filter posts based on search input (safe against any undefined fields)
  const filteredPosts = posts.filter((p) => {
    const textToSearch = [
      p?.content || '',
      p?.caption || '',
      p?.backgroundCard?.text || '',
      p?.author?.name || '',
    ]
      .join(' ')
      .toLowerCase();

    return textToSearch.includes((searchQuery || '').toLowerCase());
  });

  if (isOffline) {
    return (
      <FacebookOfflineScreen
        onReload={handleCheckConnectivity}
        onOpenCreatePost={() => {
          setIsPostModalOpen(true);
        }}
      />
    );
  }

  if (isAdminRoute) {
    return (
      <AdminDashboard
        activeSubTab={currentRoute.subPage}
        onExit={() => {
          if (isAuthenticated) {
            setRoute('home');
          } else {
            setRoute('login');
          }
        }}
      />
    );
  }

  if (isInitialLoading) {
    return <FacebookLoadingScreen />;
  }

  if (!isAuthenticated) {
    return (
      <LoginPage
        onOpenAdmin={() => {
          setRoute('admin/logs');
        }}
      />
    );
  }

  return (
    <div className="sphere-app">
      {/* Top Facebook Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        unreadNotifsCount={unreadNotifsCount}
        showNotifs={showNotifs}
        setShowNotifs={setShowNotifs}
        showProfileMenu={showProfileMenu}
        setShowProfileMenu={setShowProfileMenu}
        openMessengerWith={handleOpenMessenger}
        contacts={contacts}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenCreatePost={(type = 'standard') => {
          setPostModalType(type);
          setIsPostModalOpen(true);
        }}
      />

      {/* Notifications Dropdown */}
      {showNotifs && (
        <NotificationsDropdown
          notifications={notifications}
          onMarkAllAsRead={handleMarkAllNotifsRead}
          onNotificationClick={handleNotificationClick}
          onClose={() => setShowNotifs(false)}
        />
      )}

      {/* User Profile & Theme Switcher Dropdown */}
      {showProfileMenu && (
        <ProfileDropdown onClose={() => setShowProfileMenu(false)} />
      )}

      {/* Main Tab Routing */}
      {activeTab === 'home' && (
        <div className="app-layout">
          {/* Left Sidebar */}
          <LeftSidebar
            onSelectTab={(tab) => handleTabChange(tab || 'error')}
            onOpenProfile={() => setShowProfileMenu(true)}
          />

          {/* Center Main Feed */}
          <main className="center-feed">
            {/* Create Post Card (Composer) */}
            <CreatePostBox
              isLoading={isFeedLoading}
              onOpenModal={(type = 'standard') => {
                setPostModalType(type);
                setIsPostModalOpen(true);
              }}
            />

            {/* Stories Banner (Create Story Card & Stories Carousel) */}
            <StoriesBar
              stories={stories}
              onCreateStory={() => setIsCreateStoryModalOpen(true)}
              onSelectStory={(story) => setActiveStoryViewer(story)}
            />

            {/* Filter indication if searching */}
            {searchQuery && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '14px',
                  boxShadow: 'var(--shadow-card)',
                }}
              >
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  Showing results for: <strong>"{searchQuery}"</strong>
                </span>
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-primary)',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Clear search
                </button>
              </div>
            )}

            {/* Feed Posts or Skeleton Loading */}
            {isFeedLoading ? (
              <div className="fb-feed-skeleton-container">
                {[1, 2].map((i) => (
                  <div key={i} className="fb-skeleton-card">
                    <div className="fb-skeleton-header">
                      <div className="fb-skeleton-circle" />
                      <div className="fb-skeleton-lines">
                        <div className="fb-skeleton-line short" />
                        <div className="fb-skeleton-line xshort" />
                      </div>
                    </div>
                    <div className="fb-skeleton-body" />
                    <div className="fb-skeleton-actions">
                      <div className="fb-skeleton-pill" />
                      <div className="fb-skeleton-pill" />
                      <div className="fb-skeleton-pill" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onUpdateReaction={handleUpdateReaction}
                  onSharePost={handleSharePost}
                />
              ))
            ) : (
              <div
                style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-card)',
                }}
              >
                <h3>No posts found matching "{searchQuery}"</h3>
                <p
                  style={{
                    color: 'var(--text-secondary)',
                    marginTop: '8px',
                    fontSize: '14px',
                  }}
                >
                  Try searching for different keywords or clear your search to see all posts.
                </p>
              </div>
            )}
          </main>
        </div>
      )}

      {/* Unsupported Tab Navigation Views (Video, Friends, Account, Sidebar tabs) -> Facebook Technical Error Screen */}
      {activeTab !== 'home' && (
        <FacebookPageErrorScreen onGoHome={() => handleTabChange('home')} />
      )}

      {/* Floating Messenger Window Dock (Bottom Right) */}
      <MessengerDock
        activeChats={activeChats}
        onCloseChat={handleCloseChat}
        onSendMessage={handleSendMessage}
      />

      {/* Fullscreen Story Viewer Modal */}
      {activeStoryViewer && (
        <StoryViewerModal
          story={activeStoryViewer}
          stories={stories}
          onSelectStory={(s) => setActiveStoryViewer(s)}
          onClose={() => setActiveStoryViewer(null)}
        />
      )}

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isPostModalOpen}
        initialType={postModalType}
        onClose={() => setIsPostModalOpen(false)}
        onSubmitPost={handleAddPost}
      />

      {/* Create Story / Upload Story Video Modal */}
      <CreateStoryModal
        isOpen={isCreateStoryModalOpen}
        onClose={() => setIsCreateStoryModalOpen(false)}
        onPublishStory={handlePublishStory}
      />

      {/* Mobile Fixed Bottom Navigation Bar (Visible only on mobile <= 768px) */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onOpenNotifications={() => {
          setShowNotifs((prev) => !prev);
          setShowProfileMenu(false);
        }}
        onOpenProfile={() => {
          setShowProfileMenu((prev) => !prev);
          setShowNotifs(false);
        }}
        unreadCount="9+"
      />

      {/* Floating Bottom-Right Pen Button (Exact match to screenshot - hidden on mobile) */}
      <button
        className="fb-floating-pen-btn"
        title="New post"
        onClick={() => {
          setPostModalType('standard');
          setIsPostModalOpen(true);
        }}
      >
        <PenLine size={22} color="#050505" />
      </button>

      {/* Share Toast Banner */}
      {shareToast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#1C1E21',
            color: '#FFFFFF',
            padding: '12px 22px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
            zIndex: 99999,
          }}
        >
          <Check size={18} color="#22C55E" strokeWidth={2.5} />
          <span>Post shared to your Feed.</span>
        </div>
      )}
    </div>
  );
}
