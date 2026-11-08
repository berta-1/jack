import React, { useState, useRef } from 'react';
import {
  MoreHorizontal,
  X,
  Globe,
  Users,
  ThumbsUp,
  MessageCircle,
  Share2,
  Send,
  Check,
  Bookmark,
  Link,
  EyeOff,
} from 'lucide-react';
import ReactionDock from './ReactionDock';
import { REACTION_TYPES } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

const formatFacebookCount = (count) => {
  const n = typeof count === 'number' ? count : parseInt(count, 10) || 0;
  if (n >= 1000000) {
    return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (n >= 1000) {
    return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return String(n);
};

export default function PostCard({ post, onUpdateReaction, onSharePost }) {
  const { currentUser } = useAuth();
  const [showReactionDock, setShowReactionDock] = useState(false);
  const [justShared, setJustShared] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const hoverTimerRef = useRef(null);

  if (hidden) return null;

  // Handle reaction dock hover
  const handleLikeMouseEnter = () => {
    hoverTimerRef.current = setTimeout(() => {
      setShowReactionDock(true);
    }, 280);
  };

  const handleLikeMouseLeave = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    setTimeout(() => {
      setShowReactionDock(false);
    }, 350);
  };

  // Toggle quick like: clicking increases the like count
  const handleLikeClick = () => {
    if (post.userReaction) {
      onUpdateReaction(post.id, null);
    } else {
      onUpdateReaction(post.id, 'like');
    }
    setShowReactionDock(false);
  };

  const handleSelectReaction = (type) => {
    onUpdateReaction(post.id, type);
    setShowReactionDock(false);
  };

  const handleShareClick = () => {
    if (onSharePost) {
      onSharePost(post.id);
    }
    setJustShared(true);
    setTimeout(() => {
      setJustShared(false);
    }, 2000);
  };

  const currentReactionObj = REACTION_TYPES.find((r) => r.type === post.userReaction);

  return (
    <article className="feed-post">
      {/* Post Header */}
      <div className="post-header">
        <div className="post-author-info">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="post-author-avatar"
          />
          <div>
            <div className="post-author-name">
              <span>{post.author.name}</span>
              {post.author.verified && (
                <span className="fb-verified-badge" title="Verified">✓</span>
              )}
              {post.author.hasFollow && (
                <span
                  className="fb-follow-link"
                  onClick={() => setIsFollowing((p) => !p)}
                >
                  · {isFollowing ? 'Following' : 'Follow'}
                </span>
              )}
            </div>
            <div className="post-meta">
              <span>{post.timestamp}</span>
              <span>·</span>
              {post.privacy === 'public' ? (
                <Globe size={13} color="var(--text-secondary)" />
              ) : (
                <Users size={13} color="var(--text-secondary)" />
              )}
            </div>
          </div>
        </div>

        {/* 3-dots Menu & Close/Hide Buttons (Exact Facebook match) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          <div style={{ position: 'relative' }}>
            <button
              className="post-header-menu-btn"
              onClick={() => setShowMenu((prev) => !prev)}
              title="Options"
            >
              <MoreHorizontal size={20} />
            </button>

            {showMenu && (
              <div
                className="dropdown-popover"
                style={{
                  width: '240px',
                  top: '40px',
                  right: '0',
                  padding: '6px 0',
                  zIndex: 60,
                }}
              >
                <div
                  className="dropdown-item"
                  onClick={() => {
                    alert('Post saved to your bookmarks!');
                    setShowMenu(false);
                  }}
                >
                  <Bookmark size={18} color="var(--color-primary)" />
                  <span style={{ fontSize: '14px' }}>Save post</span>
                </div>
                <div
                  className="dropdown-item"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    setCopied(true);
                    setTimeout(() => {
                      setCopied(false);
                      setShowMenu(false);
                    }, 1200);
                  }}
                >
                  {copied ? <Check size={18} color="var(--online-green)" /> : <Link size={18} />}
                  <span style={{ fontSize: '14px' }}>{copied ? 'Link copied!' : 'Copy link'}</span>
                </div>
                <div
                  className="dropdown-item"
                  onClick={() => {
                    setHidden(true);
                    setShowMenu(false);
                  }}
                >
                  <EyeOff size={18} />
                  <span style={{ fontSize: '14px' }}>Hide post</span>
                </div>
              </div>
            )}
          </div>

          <button
            className="post-header-menu-btn"
            onClick={() => setHidden(true)}
            title="Hide post"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Post Caption (if present) */}
      {post.caption && (
        <div className="post-content-text" style={{ paddingBottom: '6px' }}>
          {post.caption}
        </div>
      )}

      {/* Iconic Facebook Colored Status Card (Exact match to screenshot) */}
      {post.backgroundCard ? (
        <div
          className="fb-post-colored-bg"
          style={{ backgroundColor: post.backgroundCard.color }}
        >
          <div className="fb-post-colored-text">
            {post.backgroundCard.text}
          </div>
        </div>
      ) : (
        post.content && <div className="post-content-text">{post.content}</div>
      )}

      {/* See translation link (as seen in screenshot) */}
      {post.hasTranslation && (
        <div style={{ padding: '0 16px 8px', fontSize: '13px', color: '#65676B', fontWeight: 600, cursor: 'pointer' }}>
          See translation
        </div>
      )}

      {/* Facebook Photo Grid (1 large on left, 2 stacked on right) */}
      {post.mediaGrid && post.mediaGrid.length > 0 && (
        <div className="fb-photo-grid">
          <div className="fb-photo-grid-left">
            <img src={post.mediaGrid[0].url} alt="Post feature" />
          </div>
          <div className="fb-photo-grid-right">
            {post.mediaGrid.slice(1).map((item, idx) => (
              <img key={idx} src={item.url} alt={`Post sub-asset ${idx + 1}`} />
            ))}
          </div>
        </div>
      )}

      {/* Video Post Media */}
      {(post.videoUrl || (post.media && post.media.length > 0 && post.media[0].type === 'video')) ? (
        <div className="post-media-container" style={{ background: '#000000', overflow: 'hidden' }}>
          <video
            src={post.videoUrl || post.media[0].url}
            poster={post.media?.[0]?.poster || (post.media?.[0]?.type === 'image' ? post.media[0].url : undefined)}
            controls
            playsInline
            style={{ width: '100%', maxHeight: '550px', display: 'block', margin: '0 auto', background: '#000000' }}
          />
        </div>
      ) : post.media && post.media.length > 0 ? (
        <div className={`post-media-container ${post.media[0].isAlijomaCrop ? 'alijoma-crop-container' : ''}`}>
          <img
            src={post.media[0].url}
            alt="Post content"
            className={`post-media-img ${post.media[0].isAlijomaCrop ? 'alijoma-crop-img' : ''}`}
          />
        </div>
      ) : null}

      {/* Exact Consolidated Facebook Post Action Footer matching screenshot */}
      <div
        className="fb-post-unified-action-bar"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px',
          backgroundColor: '#FFFFFF',
          borderBottomLeftRadius: '10px',
          borderBottomRightRadius: '10px',
          position: 'relative',
        }}
      >
        {/* Floating Reaction Dock Hover */}
        {showReactionDock && (
          <ReactionDock
            onSelect={handleSelectReaction}
            onMouseEnter={() => setShowReactionDock(true)}
            onMouseLeave={handleLikeMouseLeave}
          />
        )}

        {/* Left: Thumbs Up / Comment / Share with counters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '22px' }}>
          {/* Like Button (Works: increases like count on click) */}
          <button
            type="button"
            className="fb-post-action-count-btn"
            onClick={handleLikeClick}
            onMouseEnter={handleLikeMouseEnter}
            onMouseLeave={handleLikeMouseLeave}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              background: 'none',
              border: 'none',
              padding: '4px 6px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13.5px',
              fontWeight: 600,
              color: post.userReaction ? '#0866FF' : '#050505',
              transition: 'all 0.15s ease',
            }}
            title="Like"
          >
            {post.userReaction ? (
              <svg width="19" height="19" viewBox="0 0 24 24" fill="#0866FF" stroke="#0866FF" strokeWidth="1.5">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
              </svg>
            ) : (
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#050505" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
              </svg>
            )}
            <span>{formatFacebookCount(post.stats?.likes ?? 0)}</span>
          </button>

          {/* Comment Count Stat (Displays only the number as requested, non-clickable) */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              padding: '4px 6px',
              fontSize: '13.5px',
              fontWeight: 600,
              color: '#050505',
              userSelect: 'none',
            }}
            title="Comments"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#050505" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            <span>
              {formatFacebookCount(
                (post.stats && typeof post.stats.comments === 'number')
                  ? post.stats.comments
                  : (Array.isArray(post.comments) && post.comments.length > 0 ? post.comments.length : 0)
              )}
            </span>
          </div>

          {/* Share Button (Works: increments share count on click) */}
          <button
            type="button"
            className="fb-post-action-count-btn"
            onClick={handleShareClick}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              background: 'none',
              border: 'none',
              padding: '4px 6px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13.5px',
              fontWeight: 600,
              color: justShared ? '#0866FF' : '#050505',
              transition: 'color 0.15s ease',
            }}
            title="Share"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={justShared ? '#0866FF' : '#050505'} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 18c0-5.5 4-10 11-10h3.5" />
              <polyline points="14 3.5 19 8 14 12.5" />
            </svg>
            <span>{formatFacebookCount(post.stats?.shares ?? 0)}</span>
          </button>
        </div>

        {/* Right: Overlapping (Like) and (Love) Reaction Badges exactly matching screenshot */}
        <div style={{ display: 'inline-flex', alignItems: 'center', userSelect: 'none' }}>
          {/* Blue Facebook Thumb Badge */}
          <div
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: '#1877F2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1.5px solid #FFFFFF',
              boxShadow: '0 1px 2px rgba(0,0,0,0.12)',
              zIndex: 2,
            }}
            title="Like"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="#FFFFFF">
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
            </svg>
          </div>
          {/* Red Facebook Heart Badge */}
          <div
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: '#FA383E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1.5px solid #FFFFFF',
              boxShadow: '0 1px 2px rgba(0,0,0,0.12)',
              marginLeft: '-5px',
              zIndex: 1,
            }}
            title="Love"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="#FFFFFF">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
        </div>
      </div>
    </article>
  );
}
