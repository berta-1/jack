import React, { useState } from 'react';
import { RefreshCw, Home } from 'lucide-react';
import { FB_WRENCH_OFFLINE_BASE64 } from './FacebookOfflineScreen';

/**
 * Facebook Technical Error Screen
 * Displayed when clicking unsupported navigations / tabs
 * (e.g. Video, Friends, Account, Memories, Saved, Groups, Reels, Marketplace, Feeds, Events, Ads, Games)
 * Allows users to return seamlessly to the working Home feed via "Reload page" or "Go to News Feed".
 */
export default function FacebookPageErrorScreen({ onGoHome }) {
  const [isReloading, setIsReloading] = useState(false);

  const handleReload = () => {
    setIsReloading(true);
    setTimeout(() => {
      setIsReloading(false);
      if (onGoHome) onGoHome();
    }, 400);
  };

  return (
    <div
      className="fb-page-error-container"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 56px)',
        padding: '40px 16px',
        backgroundColor: 'var(--bg-app, #F0F2F5)',
        textAlign: 'center',
      }}
    >
      <div
        className="fb-page-error-card"
        style={{
          maxWidth: '540px',
          width: '100%',
          backgroundColor: 'transparent',
          borderRadius: '8px',
          padding: '40px 24px',
          boxShadow: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Wrench Illustration */}
        <div style={{ marginBottom: '20px' }}>
          <img
            src={FB_WRENCH_OFFLINE_BASE64}
            alt="Something went wrong"
            style={{ width: '104px', height: 'auto', display: 'block' }}
          />
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: '20px',
            fontWeight: 700,
            color: 'var(--text-primary, #050505)',
            margin: '0 0 10px 0',
            fontFamily: 'Segoe UI, Helvetica, Arial, sans-serif',
          }}
        >
          This page isn't available right now
        </h1>

        {/* Description */}
        <p
          style={{
            fontSize: '15px',
            color: 'var(--text-secondary, #65676B)',
            lineHeight: '1.45',
            margin: '0 0 24px 0',
            maxWidth: '420px',
          }}
        >
          This may be because of a technical error that we're working to get fixed. Try reloading this page.
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            type="button"
            onClick={handleReload}
            disabled={isReloading}
            style={{
              backgroundColor: '#0866FF',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '6px',
              padding: '10px 24px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'background-color 0.15s ease',
            }}
          >
            <RefreshCw size={16} className={isReloading ? 'spin' : ''} />
            <span>{isReloading ? 'Reloading...' : 'Reload page'}</span>
          </button>

          <button
            type="button"
            onClick={onGoHome}
            style={{
              backgroundColor: 'var(--bg-input, #E4E6EB)',
              color: 'var(--text-primary, #050505)',
              border: 'none',
              borderRadius: '6px',
              padding: '10px 20px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Home size={16} />
            <span>Go to News Feed</span>
          </button>
        </div>
      </div>
    </div>
  );
}

