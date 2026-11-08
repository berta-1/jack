import React, { useState } from 'react';
import { Search, ChevronDown, PenLine } from 'lucide-react';
import FacebookAvatar from './FacebookAvatar';
import {
  FacebookOfficialLogo,
  FacebookMenuGridIcon,
  FacebookMessengerIcon,
  FacebookBellIcon,
} from './FacebookSidebarIcons';

// Inline base64 data URI: Guaranteed to render with ZERO network requests when offline!
export const FB_WRENCH_OFFLINE_BASE64 =
  'data:image/png;base64,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';

/**
 * Facebook Offline / Error Screen
 * Exact match to user's uploaded screenshot (media_1793533552384_6da46619.png)
 * Displayed when user loses internet connection or goes offline:
 * - Top header with Facebook brand logo, search, and action circle buttons
 * - Wrench & worker technical error illustration (fully offline embedded)
 * - "This page isn't available right now" title
 * - Error description and bright blue "Reload page" button
 * - Floating pen edit button at bottom right
 */
export default function FacebookOfflineScreen({ onReload, onOpenCreatePost }) {
  const [isChecking, setIsChecking] = useState(false);

  const handleReloadClick = async () => {
    setIsChecking(true);
    if (onReload) {
      await onReload();
    } else {
      window.location.reload();
    }
    setTimeout(() => {
      setIsChecking(false);
    }, 800);
  };

  return (
    <div className="fb-offline-container">
      {/* 1. Header: Matches Facebook compact header from screenshot */}
      <header className="fb-offline-header">
        <div className="fb-offline-header-left">
          <div title="Facebook" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <FacebookOfficialLogo size={40} />
          </div>
          <button
            type="button"
            className="fb-offline-circle-btn"
            title="Search"
            aria-label="Search"
            onClick={handleReloadClick}
          >
            <Search size={18} color="#65676B" strokeWidth={2.4} />
          </button>
        </div>

        <div className="fb-offline-header-right">
          <button
            type="button"
            className="fb-offline-circle-btn"
            title="Menu"
            aria-label="Menu"
          >
            <FacebookMenuGridIcon size={20} color="#050505" />
          </button>

          <button
            type="button"
            className="fb-offline-circle-btn"
            title="Messenger"
            aria-label="Messenger"
          >
            <FacebookMessengerIcon size={19} color="#050505" />
          </button>

          <button
            type="button"
            className="fb-offline-circle-btn"
            title="Notifications"
            aria-label="Notifications"
          >
            <FacebookBellIcon size={19} color="#050505" />
            <span className="fb-offline-badge">1</span>
          </button>

          <button
            type="button"
            className="fb-offline-circle-btn fb-offline-profile-btn"
            title="Account"
            aria-label="Account"
          >
            <FacebookAvatar size={36} />
            <span className="fb-offline-dot" />
            <div className="fb-offline-chevron">
              <ChevronDown size={10} color="#050505" strokeWidth={3} />
            </div>
          </button>
        </div>
      </header>

      {/* 2. Main Content: Technical error message & Reload button */}
      <main className="fb-offline-main">
        <div className="fb-offline-card">
          <div className="fb-offline-img-wrapper">
            <img
              src={FB_WRENCH_OFFLINE_BASE64}
              alt="This page isn't available right now"
              className="fb-offline-wrench-img"
            />
          </div>

          <h1 className="fb-offline-title">
            This page isn't available right now
          </h1>

          <p className="fb-offline-desc">
            This may be because of a technical error that we're working to get fixed. Try reloading this page.
          </p>

          <button
            type="button"
            className="fb-offline-reload-btn"
            onClick={handleReloadClick}
            disabled={isChecking}
          >
            {isChecking ? 'Checking...' : 'Reload page'}
          </button>
        </div>
      </main>

      {/* 3. Floating Pen Edit Button at bottom right */}
      <button
        type="button"
        className="fb-offline-floating-btn"
        title="Create post"
        aria-label="Create post"
        onClick={() => {
          if (onOpenCreatePost) {
            onOpenCreatePost();
          } else {
            handleReloadClick();
          }
        }}
      >
        <PenLine size={20} color="#050505" strokeWidth={2.2} />
      </button>
    </div>
  );
}
