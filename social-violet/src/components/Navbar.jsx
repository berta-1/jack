import React, { useState } from 'react';
import {
  Search,
  ChevronDown,
  Menu,
  Plus,
  X,
} from 'lucide-react';
import FacebookAvatar from './FacebookAvatar';
import {
  FacebookOfficialLogo,
  FacebookNavbarHomeIcon,
  FacebookNavbarVideoIcon,
  FacebookNavbarGroupsIcon,
  FacebookNavbarGamingIcon,
  FacebookMenuGridIcon,
  FacebookMessengerIcon,
  FacebookBellIcon,
} from './FacebookSidebarIcons';
import { useAuth } from '../context/AuthContext';

export default function Navbar({
  activeTab,
  setActiveTab,
  unreadNotifsCount,
  showNotifs,
  setShowNotifs,
  showProfileMenu,
  setShowProfileMenu,
  openMessengerWith,
  contacts,
  searchQuery,
  setSearchQuery,
  onOpenCreatePost,
}) {
  const { currentUser } = useAuth();
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  return (
    <>
      {/* ========================================================
          1. Desktop Header (Visible on screens > 768px)
          ======================================================== */}
      <header className="fb-header fb-desktop-header">
        {/* Left: Official Facebook Brand Logo & Search */}
        <div className="header-left">
          <div
            onClick={() => setActiveTab('home')}
            title="Facebook"
            style={{ cursor: 'pointer', flexShrink: 0 }}
          >
            <FacebookOfficialLogo size={40} />
          </div>
          <div className="search-box">
            <Search size={16} color="var(--text-secondary)" strokeWidth={2.2} />
            <input
              type="text"
              placeholder="Search Facebook"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Center: Main Navigation Tabs */}
        <nav className="header-center">
          <button
            className={`nav-tab ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
            title="Home"
          >
            <FacebookNavbarHomeIcon active={activeTab === 'home'} size={28} />
          </button>

          <button
            className={`nav-tab ${activeTab === 'watch' ? 'active' : ''}`}
            onClick={() => setActiveTab('watch')}
            title="Video"
          >
            <FacebookNavbarVideoIcon active={activeTab === 'watch'} size={28} />
          </button>

          <button
            className={`nav-tab ${activeTab === 'groups' ? 'active' : ''}`}
            onClick={() => setActiveTab('groups')}
            title="Groups"
          >
            <FacebookNavbarGroupsIcon active={activeTab === 'groups'} size={28} />
          </button>

          <button
            className={`nav-tab ${activeTab === 'gaming' ? 'active' : ''}`}
            onClick={() => setActiveTab('gaming')}
            title="Gaming"
          >
            <FacebookNavbarGamingIcon active={activeTab === 'gaming'} size={28} />
          </button>
        </nav>

        {/* Right: Actions */}
        <div className="header-right">
          <button
            className="find-friends-btn"
            onClick={() => setActiveTab('friends')}
            title="Find friends"
          >
            Find friends
          </button>

          <button
            className="icon-circle-btn"
            title="Menu"
            onClick={() => setShowProfileMenu((prev) => !prev)}
          >
            <FacebookMenuGridIcon size={21} />
          </button>

          <button
            className="icon-circle-btn"
            title="Messenger"
            onClick={() => {
              if (contacts && contacts.length > 0) {
                openMessengerWith(contacts[0]);
              }
            }}
          >
            <FacebookMessengerIcon size={21} />
          </button>

          <button
            className={`icon-circle-btn ${showNotifs ? 'active' : ''}`}
            title="Notifications"
            onClick={() => {
              setShowNotifs((prev) => !prev);
              setShowProfileMenu(false);
            }}
          >
            <FacebookBellIcon size={21} />
          </button>

          <button
            className="profile-btn"
            onClick={() => {
              setShowProfileMenu((prev) => !prev);
              setShowNotifs(false);
            }}
            title="Account Controls"
          >
            <div className="profile-avatar-wrapper">
              {currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <FacebookAvatar size={40} />
              )}
              <div className="profile-chevron-dot">
                <ChevronDown size={11} color="#050505" strokeWidth={3} />
              </div>
            </div>
          </button>
        </div>
      </header>

      {/* ========================================================
          2. Mobile Top Header (Exact Match to user's screenshot)
             Visible only on screens <= 768px
             [ ☰ ] facebook                 [ + ] [ 🔍 ] [ 💬 ]
          ======================================================== */}
      <header className="fb-mobile-top-header">
        {showMobileSearch ? (
          <div className="fb-mobile-search-bar">
            <Search size={18} color="#65676B" />
            <input
              type="text"
              placeholder="Search on Facebook..."
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="button"
              className="fb-mobile-search-close"
              onClick={() => {
                setShowMobileSearch(false);
                setSearchQuery('');
              }}
            >
              <X size={20} color="#050505" />
            </button>
          </div>
        ) : (
          <>
            {/* Left: Hamburger Menu + Blue Facebook Wordmark */}
            <div className="fb-mobile-header-left">
              <button
                type="button"
                className="fb-mobile-menu-btn"
                onClick={() => setShowProfileMenu((prev) => !prev)}
                title="Menu"
                aria-label="Navigation menu"
              >
                <svg viewBox="0 0 24 24" width="24" height="20" fill="none">
                  <line x1="1.5" y1="3" x2="22.5" y2="3" stroke="#050505" strokeWidth="2.8" strokeLinecap="round" />
                  <line x1="1.5" y1="10" x2="22.5" y2="10" stroke="#050505" strokeWidth="2.8" strokeLinecap="round" />
                  <line x1="1.5" y1="17" x2="22.5" y2="17" stroke="#050505" strokeWidth="2.8" strokeLinecap="round" />
                </svg>
              </button>

              <span
                className="fb-mobile-brand-text"
                onClick={() => {
                  setActiveTab('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                facebook
              </span>
            </div>

            {/* Right: (+) Create, (🔍) Search, (💬) Messenger */}
            <div className="fb-mobile-header-right">
              {/* [+] Create Story/Post button */}
              <button
                type="button"
                className="fb-mobile-header-icon-btn"
                onClick={() => onOpenCreatePost && onOpenCreatePost('standard')}
                title="Create post"
                aria-label="Create post"
              >
                <svg viewBox="0 0 26 26" width="24" height="24" fill="none">
                  <rect x="1.5" y="1.5" width="23" height="23" rx="6.5" stroke="#050505" strokeWidth="2.4" />
                  <line x1="13" y1="6.8" x2="13" y2="19.2" stroke="#050505" strokeWidth="2.4" strokeLinecap="round" />
                  <line x1="6.8" y1="13" x2="19.2" y2="13" stroke="#050505" strokeWidth="2.4" strokeLinecap="round" />
                </svg>
              </button>

              {/* [🔍] Search button */}
              <button
                type="button"
                className="fb-mobile-header-icon-btn"
                onClick={() => setShowMobileSearch(true)}
                title="Search"
                aria-label="Search Facebook"
              >
                <svg viewBox="0 0 26 26" width="24" height="24" fill="none">
                  <circle cx="10.8" cy="10.8" r="7.2" stroke="#050505" strokeWidth="2.4" />
                  <line x1="16.2" y1="16.2" x2="22.8" y2="22.8" stroke="#050505" strokeWidth="2.4" strokeLinecap="round" />
                </svg>
              </button>

              {/* [💬] Messenger button */}
              <button
                type="button"
                className="fb-mobile-header-icon-btn"
                onClick={() => {
                  if (contacts && contacts.length > 0) {
                    openMessengerWith(contacts[0]);
                  }
                }}
                title="Messenger"
                aria-label="Messenger"
              >
                <FacebookMessengerIcon size={26} color="#050505" />
              </button>
            </div>
          </>
        )}
      </header>
    </>
  );
}
