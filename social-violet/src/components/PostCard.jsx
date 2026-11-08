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

      {/* Engagement Stats Bar */}
      <div className="post-stats-row">
        <div className="reaction-icons-cluster">
          {post.id === 'post-screenshot-simon' || post.userReaction === 'haha' || (post.stats?.reactionBreakdown?.haha > (post.stats?.reactionBreakdown?.like || 0)) ? (
            <>
              <span className="stat-emoji-pill" style={{ zIndex: 3 }}>😆</span>
              <span className="stat-emoji-pill" style={{ zIndex: 2, marginLeft: '-4px' }}>👍</span>
              <span className="stat-emoji-pill" style={{ zIndex: 1, marginLeft: '-4px' }}>❤️</span>
            </>
          ) : post.userReaction === 'love' ? (
            <>
              <span className="stat-emoji-pill" style={{ zIndex: 3 }}>❤️</span>
              <span className="stat-emoji-pill" style={{ zIndex: 2, marginLeft: '-4px' }}>👍</span>
              <span className="stat-emoji-pill" style={{ zIndex: 1, marginLeft: '-4px' }}>🥰</span>
            </>
          ) : (
            <>
              <span className="stat-emoji-pill" style={{ zIndex: 3 }}>👍</span>
              <span className="stat-emoji-pill" style={{ zIndex: 2, marginLeft: '-4px' }}>❤️</span>
              <span className="stat-emoji-pill" style={{ zIndex: 1, marginLeft: '-4px' }}>🥰</span>
            </>
          )}
          <span style={{ marginLeft: '6px', fontWeight: 500 }}>
            {(post.stats?.likes ?? 0).toLocaleString()}
          </span>
        </div>
        <div className="post-counts-right">
          <span style={{ cursor: 'default' }}>
            {post.comments ? post.comments.length : (post.stats?.comments ?? 0)} comments
          </span>
          <span>·</span>
          <span>{(post.stats?.shares ?? 0)} shares</span>
        </div>
      </div>

      {/* Post Action Buttons (Like / Comment / Share) */}
      <div className="post-buttons-bar">
        {/* Reaction Dock Hover */}
        {showReactionDock && (
          <ReactionDock
            onSelect={handleSelectReaction}
            onMouseEnter={() => setShowReactionDock(true)}
            onMouseLeave={handleLikeMouseLeave}
          />
        )}

        {/* Like Button (Increases likes count on click) */}
        <button
          type="button"
          className="post-bottom-btn"
          onClick={handleLikeClick}
          onMouseEnter={handleLikeMouseEnter}
          onMouseLeave={handleLikeMouseLeave}
          style={{
            color: currentReactionObj ? currentReactionObj.color : (post.userReaction ? '#0866FF' : 'inherit'),
            fontWeight: post.userReaction ? 700 : 'inherit',
          }}
        >
          {currentReactionObj ? (
            <>
              <span style={{ fontSize: '18px' }}>{currentReactionObj.emoji}</span>
              <span style={{ fontWeight: 700 }}>{currentReactionObj.label}</span>
            </>
          ) : post.userReaction === 'like' ? (
            <>
              <ThumbsUp size={18} fill="#0866FF" color="#0866FF" />
              <span style={{ fontWeight: 700, color: '#0866FF' }}>Like</span>
            </>
          ) : (
            <>
              <ThumbsUp size={18} />
              <span>Like</span>
            </>
          )}
        </button>

        {/* Comment Button (Non-functional as requested: comment does not need to work) */}
        <button
          type="button"
          className="post-bottom-btn"
          onClick={(e) => {
            e.preventDefault();
            // Comments do not work as requested
          }}
          style={{ cursor: 'pointer' }}
          title="Comments"
        >
          <MessageCircle size={18} />
          <span>Comment</span>
        </button>

        {/* Share Button (Works: increments shares count on click) */}
        <button
          type="button"
          className="post-bottom-btn"
          onClick={handleShareClick}
          style={{
            color: justShared ? '#0866FF' : 'inherit',
            fontWeight: justShared ? 600 : 'inherit',
          }}
        >
          {justShared ? (
            <>
              <Check size={18} color="#0866FF" strokeWidth={2.5} />
              <span style={{ color: '#0866FF' }}>Shared!</span>
            </>
          ) : (
            <>
              <Share2 size={18} />
              <span>Share</span>
            </>
          )}
        </button>
      </div>
    </article>
  );
}
