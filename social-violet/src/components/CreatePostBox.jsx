import React from 'react';
import FacebookAvatar from './FacebookAvatar';
import darkAvatarImg from '../assets/fb-user-dark-avatar.png';
import {
  FacebookLiveVideoIcon,
  FacebookPhotoVideoIcon,
  FacebookFeelingSmileyIcon,
} from './FacebookSidebarIcons';
import { useAuth } from '../context/AuthContext';

export default function CreatePostBox({ onOpenModal, isLoading = false }) {
  const { currentUser } = useAuth();
  const firstName = currentUser?.shortName || currentUser?.name?.split(' ')[0] || 'Berta';

  return (
    <>
      {/* 1. Desktop Composer Card (> 768px) */}
      <div className="fb-composer-card fb-desktop-composer">
        <div className="fb-composer-row">
          {currentUser?.avatar ? (
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <FacebookAvatar size={40} />
          )}
          <div
            className="fb-composer-pill"
            onClick={() => onOpenModal('standard')}
          >
            <span className="fb-composer-placeholder">
              What's on your mind, {firstName}?
            </span>

            {isLoading ? (
              <div className="fb-composer-spinner" title="Loading..." />
            ) : (
              <div className="fb-composer-quick-actions" onClick={(e) => e.stopPropagation()}>
                <button
                  className="fb-quick-icon-btn"
                  title="Live video"
                  onClick={() => onOpenModal('live')}
                >
                  <FacebookLiveVideoIcon size={24} />
                </button>
                <button
                  className="fb-quick-icon-btn"
                  title="Photo/video"
                  onClick={() => onOpenModal('photo')}
                >
                  <FacebookPhotoVideoIcon size={24} />
                </button>
                <button
                  className="fb-quick-icon-btn"
                  title="Feeling/activity"
                  onClick={() => onOpenModal('feeling')}
                >
                  <FacebookFeelingSmileyIcon size={24} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Mobile App Composer Row (<= 768px) - Exact match to screenshot */}
      <div className="fb-mobile-composer">
        <div className="fb-mobile-composer-row">
          <div className="fb-mobile-composer-avatar">
            <img
              src={currentUser?.avatar || darkAvatarImg}
              alt="User avatar"
              className="fb-mobile-avatar-img"
            />
          </div>

          {/* "What's on your mind?" Rounded Pill */}
          <div
            className="fb-mobile-composer-pill"
            onClick={() => onOpenModal('standard')}
          >
            <span className="fb-mobile-composer-text">
              What's on your mind?
            </span>
          </div>

          {/* Photo/Gallery Icon on right */}
          <button
            type="button"
            className="fb-mobile-composer-gallery-btn"
            onClick={() => onOpenModal('photo')}
            title="Photo/video"
            aria-label="Upload photo"
          >
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="none"
            >
              <rect x="2.5" y="2.5" width="19" height="19" rx="4.5" stroke="#65676B" strokeWidth="2.2" />
              <circle cx="7.8" cy="7.8" r="1.8" fill="#65676B" />
              <path
                d="M3 17.5l5.5-5.5 4.5 4.5 3.8-3.8 4.7 4.8V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1.5z"
                fill="#65676B"
              />
            </svg>
          </button>
        </div>
        <div className="fb-mobile-divider-band" />
      </div>
    </>
  );
}
