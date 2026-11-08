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

export default function PostCard({ post, onUpdateReaction, onAddComment }) {
  const { currentUser } = useAuth();
  const [showReactionDock, setShowReactionDock] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const hoverTimerRef = useRef(null);
  const commentInputRef = useRef(null);

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

  // Toggle quick like
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

  // Submit comment
  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    onAddComment(post.id, {
      id: 'c_' + Date.now(),
      author: {
        name: currentUser?.name || 'Berta Hule',
        avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      },
      text: commentText.trim(),
      timestamp: 'Just now',
      likes: 0,
    });

    setCommentText('');
    setShowComments(true);
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
          {post.userReaction === 'haha' ? (
            <>
              <span className="stat-emoji-pill" style={{ zIndex: 3 }}>😆</span>
              <span className="stat-emoji-pill" style={{ zIndex: 2, marginLeft: '-4px' }}>👍</span>
              <span className="stat-emoji-pill" style={{ zIndex: 1, marginLeft: '-4px' }}>❤️</span>
            </>
          ) : (
            <>
              <span className="stat-emoji-pill" style={{ zIndex: 3 }}>👍</span>
              <span className="stat-emoji-pill" style={{ zIndex: 2, marginLeft: '-4px' }}>❤️</span>
              <span className="stat-emoji-pill" style={{ zIndex: 1, marginLeft: '-4px' }}>🥰</span>
            </>
          )}
          <span style={{ marginLeft: '6px', fontWeight: 500 }}>
            {post.stats.likes.toLocaleString()}
          </span>
        </div>
        <div className="post-counts-right">
          <span onClick={() => setShowComments((prev) => !prev)}>
            {post.comments ? post.comments.length : post.stats.comments} comments
          </span>
          <span>·</span>
          <span>{post.stats.shares} shares</span>
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

        {/* Like Button */}
        <button
          className="post-bottom-btn"
          onClick={handleLikeClick}
          onMouseEnter={handleLikeMouseEnter}
          onMouseLeave={handleLikeMouseLeave}
          style={{
            color: currentReactionObj ? currentReactionObj.color : 'inherit',
          }}
        >
          {currentReactionObj ? (
            <>
              <span style={{ fontSize: '18px' }}>{currentReactionObj.emoji}</span>
              <span style={{ fontWeight: 700 }}>{currentReactionObj.label}</span>
            </>
          ) : (
            <>
              <ThumbsUp size={18} />
              <span>Like</span>
            </>
          )}
        </button>

        {/* Comment Button */}
        <button
          className="post-bottom-btn"
          onClick={() => {
            setShowComments(true);
            setTimeout(() => {
              commentInputRef.current?.focus();
            }, 50);
          }}
        >
          <MessageCircle size={18} />
          <span>Comment</span>
        </button>

        {/* Share Button */}
        <button
          className="post-bottom-btn"
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: 'Sphere Post', text: post.content || post.caption, url: window.location.href });
            } else {
              navigator.clipboard.writeText(window.location.href);
              alert('Post link copied to clipboard!');
            }
          }}
        >
          <Share2 size={18} />
          <span>Share</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="comments-section">
          {/* New Comment Input */}
          <form className="comment-input-row" onSubmit={handleSubmitComment}>
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="chat-avatar-mini"
            />
            <div className="comment-input-box">
              <input
                ref={commentInputRef}
                type="text"
                placeholder={`Write a comment as ${currentUser?.shortName || currentUser?.name?.split(' ')[0]}...`}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button
                type="submit"
                className="comment-submit-btn"
                disabled={!commentText.trim()}
              >
                <Send size={16} />
              </button>
            </div>
          </form>

          {/* Comment List */}
          {post.comments && post.comments.length > 0 && (
            <div>
              {post.comments.map((comment) => (
                <div key={comment.id} style={{ marginBottom: '12px' }}>
                  <div className="comment-item">
                    <img
                      src={comment.author.avatar}
                      alt={comment.author.name}
                      className="chat-avatar-mini"
                    />
                    <div className="comment-bubble">
                      <div className="comment-author-name">{comment.author.name}</div>
                      <div className="comment-text">{comment.text}</div>
                    </div>
                  </div>
                  <div className="comment-actions-meta">
                    <span onClick={() => alert('Liked comment!')}>Like</span>
                    <span onClick={() => commentInputRef.current?.focus()}>Reply</span>
                    <span style={{ color: 'var(--text-tertiary)', fontWeight: 400 }}>
                      {comment.timestamp}
                    </span>
                    {comment.likes > 0 && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                        👍 {comment.likes}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </article>
  );
}
