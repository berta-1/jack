import React from 'react';
import darkAvatarImg from '../assets/fb-user-dark-avatar.png';
import FacebookAvatar from './FacebookAvatar';
import { useAuth } from '../context/AuthContext';

/**
 * Facebook Mobile App Fixed Bottom Navigation Bar
 * Pixel-perfect match to user's uploaded screenshot (media_1793511309762_09169516.png):
 * 1. Home (Solid blue peaked roof with arched doorway cutout)
 * 2. Reels (Rounded clapper box with diagonal slits & solid play triangle)
 * 3. Friends (Two-people outline silhouette)
 * 4. Marketplace (Scalloped awning storefront with doorway)
 * 5. Notifications (Bell with official red '9+' capsule badge)
 * 6. Profile (Circular avatar with subtle ring border)
 */
export default function MobileBottomNav({
  activeTab,
  setActiveTab,
  onOpenNotifications,
  onOpenProfile,
  unreadCount = '9+',
}) {
  const { currentUser } = useAuth();

  return (
    <nav className="fb-mobile-bottom-nav" aria-label="Mobile Navigation">
      {/* 1. Home Tab */}
      <button
        type="button"
        className={`fb-mobile-nav-item ${activeTab === 'home' ? 'active' : ''}`}
        onClick={() => {
          setActiveTab('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        title="Home"
      >
        <svg viewBox="0 0 30 30" width="28" height="28" fill="none">
          {activeTab === 'home' ? (
            /* Solid Blue Home with rounded doorway cutout (Exact screenshot match) */
            <path
              d="M13.6 2.3a2 2 0 0 1 2.8 0l10.5 9.8c.7.6 1.1 1.5 1.1 2.4v11c0 1.4-1.1 2.5-2.5 2.5h-5a1.2 1.2 0 0 1-1.2-1.2v-7.3a2.3 2.3 0 0 0-4.6 0v7.3c0 .7-.5 1.2-1.2 1.2h-5A2.5 2.5 0 0 1 2 25.5V14.5c0-.9.4-1.8 1.1-2.4L13.6 2.3z"
              fill="#0866FF"
            />
          ) : (
            /* Outline Home when inactive */
            <path
              d="M13.6 2.5a2 2 0 0 1 2.8 0l10.5 9.8c.7.6 1.1 1.5 1.1 2.4v10.8c0 1.4-1.1 2.5-2.5 2.5h-5a1.2 1.2 0 0 1-1.2-1.2v-7.3a2.3 2.3 0 0 0-4.6 0v7.3c0 .7-.5 1.2-1.2 1.2h-5A2.5 2.5 0 0 1 2 25.5V14.7c0-.9.4-1.8 1.1-2.4L13.6 2.5z"
              stroke="#050505"
              strokeWidth="2.3"
            />
          )}
        </svg>
      </button>

      {/* 2. Reels / Video Tab */}
      <button
        type="button"
        className={`fb-mobile-nav-item ${activeTab === 'watch' ? 'active' : ''}`}
        onClick={() => setActiveTab('watch')}
        title="Video"
      >
        <svg viewBox="0 0 30 30" width="28" height="27" fill="none">
          {/* Outer rounded clapper rectangle */}
          <rect
            x="2"
            y="3.5"
            width="25.5"
            height="22"
            rx="5.5"
            stroke={activeTab === 'watch' ? '#0866FF' : '#050505'}
            strokeWidth="2.5"
          />
          {/* Top lid horizontal slit */}
          <line
            x1="2"
            y1="9.8"
            x2="27.5"
            y2="9.8"
            stroke={activeTab === 'watch' ? '#0866FF' : '#050505'}
            strokeWidth="2.5"
          />
          {/* Diagonal clapper slits */}
          <line
            x1="10"
            y1="3.5"
            x2="8"
            y2="9.8"
            stroke={activeTab === 'watch' ? '#0866FF' : '#050505'}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <line
            x1="19"
            y1="3.5"
            x2="17"
            y2="9.8"
            stroke={activeTab === 'watch' ? '#0866FF' : '#050505'}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Solid Play Triangle in center */}
          <polygon
            points="12.5,13.8 19,17.5 12.5,21.2"
            fill={activeTab === 'watch' ? '#0866FF' : '#050505'}
          />
        </svg>
      </button>

      {/* 3. Friends Tab */}
      <button
        type="button"
        className={`fb-mobile-nav-item ${activeTab === 'friends' ? 'active' : ''}`}
        onClick={() => setActiveTab('friends')}
        title="Friends"
      >
        <svg viewBox="0 0 30 30" width="28" height="27" fill="none">
          {/* Back user (top right) */}
          <circle
            cx="20.5"
            cy="8"
            r="4"
            stroke={activeTab === 'friends' ? '#0866FF' : '#050505'}
            strokeWidth="2.3"
          />
          <path
            d="M19.5 15.5c2.6.5 5.2 1.8 6.2 4.5"
            stroke={activeTab === 'friends' ? '#0866FF' : '#050505'}
            strokeWidth="2.3"
            strokeLinecap="round"
          />
          {/* Front user (bottom left) */}
          <circle
            cx="10.5"
            cy="11.5"
            r="4.5"
            stroke={activeTab === 'friends' ? '#0866FF' : '#050505'}
            strokeWidth="2.5"
          />
          <path
            d="M3 25c0-4.2 3.5-7.5 8.2-7.5s8.2 3.3 8.2 7.5"
            stroke={activeTab === 'friends' ? '#0866FF' : '#050505'}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* 4. Marketplace Tab */}
      <button
        type="button"
        className={`fb-mobile-nav-item ${activeTab === 'marketplace' ? 'active' : ''}`}
        onClick={() => setActiveTab('marketplace')}
        title="Marketplace"
      >
        <svg viewBox="0 0 30 30" width="28" height="27" fill="none">
          {/* Awning roof with 4 scallops */}
          <path
            d="M3.5 7c0-1.1.9-2 2-2h19c1.1 0 2 .9 2 2v3.8c0 1.8-1.3 3.2-3 3.2-1.3 0-2.5-.8-2.9-2-.4 1.2-1.6 2-2.9 2s-2.5-.8-2.9-2c-.4 1.2-1.6 2-2.9 2-1.7 0-3-1.4-3-3.2V7z"
            stroke={activeTab === 'marketplace' ? '#0866FF' : '#050505'}
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
          {/* Storefront base building */}
          <path
            d="M4.5 13.8v9a2 2 0 0 0 2 2h17a2 2 0 0 0 2-2v-9"
            stroke={activeTab === 'marketplace' ? '#0866FF' : '#050505'}
            strokeWidth="2.4"
          />
          {/* Arched doorway cutout */}
          <path
            d="M11.5 24.8v-6a1.2 1.2 0 0 1 1.2-1.2h4.6a1.2 1.2 0 0 1 1.2 1.2v6"
            stroke={activeTab === 'marketplace' ? '#0866FF' : '#050505'}
            strokeWidth="2.4"
          />
        </svg>
      </button>

      {/* 5. Notifications Tab (With Official Red 9+ Badge) */}
      <button
        type="button"
        className="fb-mobile-nav-item"
        onClick={onOpenNotifications}
        title="Notifications"
      >
        <div className="fb-mobile-notif-wrapper">
          <svg viewBox="0 0 30 30" width="28" height="27" fill="none">
            {/* Bell body */}
            <path
              d="M15 4a6.8 6.8 0 0 0-6.8 6.8v4.2c0 .8-.4 1.6-1 2.2l-1.6 1.6a.8.8 0 0 0 .6 1.4h17.6a.8.8 0 0 0 .6-1.4l-1.6-1.6c-.6-.6-1-1.4-1-2.2v-4.2A6.8 6.8 0 0 0 15 4z"
              stroke="#050505"
              strokeWidth="2.4"
            />
            {/* Clapper underneath */}
            <path d="M12 21.2a3 3 0 0 0 6 0" stroke="#050505" strokeWidth="2.4" />
          </svg>

          {/* Red Capsule 9+ Badge (Exact match to screenshot) */}
          <div className="fb-mobile-red-badge">
            {unreadCount}
          </div>
        </div>
      </button>

      {/* 6. Profile / Menu Tab */}
      <button
        type="button"
        className="fb-mobile-nav-item"
        onClick={onOpenProfile}
        title="Menu"
      >
        <div className="fb-mobile-profile-ring">
          <img
            src={darkAvatarImg}
            alt="Profile"
            className="fb-mobile-profile-avatar-img"
          />
        </div>
      </button>
    </nav>
  );
}
