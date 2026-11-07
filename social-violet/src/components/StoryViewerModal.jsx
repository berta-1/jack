import React, { useEffect, useState, useRef } from 'react';
import {
  X,
  Heart,
  Smile,
  Send,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Film,
} from 'lucide-react';

const QUICK_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '😡'];

export default function StoryViewerModal({ story, stories = [], onSelectStory, onClose }) {
  if (!story) return null;

  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoError, setVideoError] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replyToast, setReplyToast] = useState('');
  const [floatingReactions, setFloatingReactions] = useState([]);
  const [clickIndicator, setClickIndicator] = useState(null); // 'play' | 'pause'

  // Determine story indexing
  const storyList = stories && stories.length > 0 ? stories : [story];
  const currentIndex = storyList.findIndex((s) => s.id === story.id);
  const activeStory = currentIndex >= 0 ? storyList[currentIndex] : story;
  const isVideo = (activeStory?.mediaType === 'video' || !!activeStory?.videoUrl) && !videoError;

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < storyList.length - 1;

  // Navigate to previous story
  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    if (hasPrev && onSelectStory) {
      onSelectStory(storyList[currentIndex - 1]);
    }
  };

  // Navigate to next story
  const handleNext = (e) => {
    if (e) e.stopPropagation();
    if (hasNext && onSelectStory) {
      onSelectStory(storyList[currentIndex + 1]);
    } else {
      onClose();
    }
  };

  // Reset state on story switch and attempt autoplay
  useEffect(() => {
    setProgress(0);
    setIsPlaying(true);
    setVideoError(false);

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          // If browser policy blocks unmuted autoplay, fallback to muted autoplay
          console.warn('Autoplay with sound prevented, defaulting to muted:', err);
          setIsMuted(true);
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play().catch(() => {});
          }
        });
      }
    }
  }, [activeStory?.id]);

  // Fallback timer for static image stories or when video has error
  useEffect(() => {
    if (isVideo) return; // Video drives its own progress via onTimeUpdate

    const duration = 5000;
    const intervalTime = 50;
    const step = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          handleNext();
          return 100;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [activeStory?.id, isVideo, currentIndex, storyList.length]);

  // Keyboard navigation & controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      }
      if (e.key.toLowerCase() === 'm') {
        toggleMute();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, hasPrev, hasNext, isPlaying, isMuted]);

  // Video progress synchronization
  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const pct = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(pct);
    }
  };

  const handleVideoEnded = () => {
    handleNext();
  };

  // Play / Pause toggle
  const togglePlay = (e) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      setClickIndicator('pause');
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
      setClickIndicator('play');
    }
    setTimeout(() => setClickIndicator(null), 700);
  };

  // Sound toggle
  const toggleMute = (e) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    videoRef.current.muted = nextMuted;
  };

  // Quick emoji reaction
  const sendReaction = (emoji) => {
    const id = Date.now() + Math.random();
    setFloatingReactions((prev) => [
      ...prev,
      { id, emoji, left: Math.floor(Math.random() * 50) + 25 },
    ]);
    setTimeout(() => {
      setFloatingReactions((prev) => prev.filter((r) => r.id !== id));
    }, 1600);

    setReplyToast(`Reacted with ${emoji}`);
    setTimeout(() => setReplyToast(''), 2500);
  };

  // Reply submit
  const handleSendReply = (e) => {
    if (e) e.preventDefault();
    if (!replyText.trim()) return;

    setReplyToast(`Reply sent to ${activeStory.userName}: "${replyText}"`);
    setReplyText('');
    setTimeout(() => setReplyToast(''), 3000);
  };

  return (
    <div className="fb-story-viewer-backdrop" onClick={onClose}>
      {/* Top Left Branding & Story Counter */}
      <div className="fb-story-viewer-top-brand" onClick={(e) => e.stopPropagation()}>
        <div className="fb-story-viewer-logo-badge">
          <Film size={18} color="#0866FF" />
          <span>Stories</span>
        </div>
        {storyList.length > 1 && (
          <span className="fb-story-viewer-counter">
            {currentIndex + 1} of {storyList.length}
          </span>
        )}
      </div>

      {/* Close button (top right of screen) */}
      <button
        className="fb-story-viewer-screen-close"
        onClick={onClose}
        title="Close story (Esc)"
      >
        <X size={22} color="#FFFFFF" />
      </button>

      {/* Prev Story Arrow (Left) */}
      {hasPrev && (
        <button
          className="fb-story-nav-btn fb-story-nav-prev"
          onClick={handlePrev}
          title="Previous story (Left Arrow)"
        >
          <ChevronLeft size={28} color="#FFFFFF" />
        </button>
      )}

      {/* Main Story Container */}
      <div
        className="fb-story-viewer-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Multi-Segment Top Progress Bars */}
        <div className="fb-story-progress-segments">
          {storyList.map((s, idx) => {
            let fillWidth = '0%';
            if (idx < currentIndex) fillWidth = '100%';
            else if (idx === currentIndex) fillWidth = `${progress}%`;

            return (
              <div
                key={s.id || idx}
                className="fb-story-progress-track"
                onClick={() => onSelectStory && onSelectStory(s)}
                title={s.userName}
              >
                <div
                  className="fb-story-progress-fill"
                  style={{ width: fillWidth }}
                />
              </div>
            );
          })}
        </div>

        {/* Top Story Header Bar */}
        <div className="fb-story-card-header">
          <div className="fb-story-author-info">
            <img
              src={activeStory.userAvatar}
              alt={activeStory.userName}
              className="fb-story-header-avatar"
            />
            <div className="fb-story-header-text">
              <div className="fb-story-header-name">
                {activeStory.userName}
                {isVideo && (
                  <span className="fb-story-video-tag">
                    <Film size={11} style={{ marginRight: '3px' }} /> Video
                  </span>
                )}
              </div>
              <div className="fb-story-header-time">
                {activeStory.timestamp || 'Suggested'}
              </div>
            </div>
          </div>

          {/* Top-Right Control Buttons */}
          <div className="fb-story-header-actions">
            {isVideo && (
              <>
                <button
                  className="fb-story-ctrl-btn"
                  onClick={togglePlay}
                  title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
                >
                  {isPlaying ? (
                    <Pause size={17} color="#FFFFFF" />
                  ) : (
                    <Play size={17} color="#FFFFFF" />
                  )}
                </button>
                <button
                  className="fb-story-ctrl-btn"
                  onClick={toggleMute}
                  title={isMuted ? 'Unmute (M)' : 'Mute (M)'}
                >
                  {isMuted ? (
                    <VolumeX size={17} color="#FFFFFF" />
                  ) : (
                    <Volume2 size={17} color="#FFFFFF" />
                  )}
                </button>
              </>
            )}

            <button
              className="fb-story-ctrl-btn fb-story-close-btn"
              onClick={onClose}
              title="Close story"
            >
              <X size={17} color="#FFFFFF" />
            </button>
          </div>
        </div>

        {/* Main Media Area (Video with Image Fallback) */}
        <div
          className="fb-story-media-container"
          onClick={togglePlay}
          title="Click to Play/Pause"
        >
          {isVideo ? (
            <video
              ref={videoRef}
              src={activeStory.videoUrl}
              poster={activeStory.mediaUrl}
              autoPlay
              playsInline
              muted={isMuted}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleVideoEnded}
              onError={() => {
                console.warn('Video failed to play, falling back to backup or image.');
                if (activeStory.backupVideoUrl && videoRef.current?.src !== activeStory.backupVideoUrl) {
                  videoRef.current.src = activeStory.backupVideoUrl;
                  videoRef.current.play().catch(() => setVideoError(true));
                } else {
                  setVideoError(true);
                }
              }}
              className="fb-story-video-element"
            />
          ) : (
            <img
              src={activeStory.mediaUrl}
              alt={activeStory.caption || activeStory.userName}
              className="fb-story-image-element"
            />
          )}

          {/* Visual Indicator on Click (Play/Pause Ripple) */}
          {clickIndicator && (
            <div className="fb-story-click-indicator">
              {clickIndicator === 'play' ? (
                <Play size={44} color="#FFFFFF" fill="#FFFFFF" />
              ) : (
                <Pause size={44} color="#FFFFFF" fill="#FFFFFF" />
              )}
            </div>
          )}

          {/* Paused Floating Watermark */}
          {!isPlaying && !clickIndicator && (
            <div className="fb-story-paused-badge">
              <Play size={28} color="#FFFFFF" fill="#FFFFFF" />
            </div>
          )}

          {/* Floating Reaction Emojis Animation */}
          {floatingReactions.map((r) => (
            <div
              key={r.id}
              className="fb-story-floating-emoji"
              style={{ left: `${r.left}%` }}
            >
              {r.emoji}
            </div>
          ))}

          {/* Toast Notification for reply / reaction */}
          {replyToast && (
            <div className="fb-story-toast-pill">
              {replyToast}
            </div>
          )}

          {/* Caption Overlay */}
          {activeStory.caption && (
            <div className="fb-story-caption-overlay">
              <div className="fb-story-caption-text">{activeStory.caption}</div>
            </div>
          )}
        </div>

        {/* Bottom Interactive Dock (Quick Reactions & Reply Bar) */}
        <div className="fb-story-bottom-dock">
          {/* Facebook Quick Reactions */}
          <div className="fb-story-reaction-bar">
            {QUICK_REACTIONS.map((emoji) => (
              <button
                key={emoji}
                className="fb-story-reaction-btn"
                onClick={() => sendReaction(emoji)}
                title={`React with ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Reply Input Form */}
          <form className="fb-story-reply-form" onSubmit={handleSendReply}>
            <input
              type="text"
              className="fb-story-reply-input"
              placeholder={`Reply to ${activeStory.userName}...`}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <button
              type="submit"
              className="fb-story-reply-send-btn"
              disabled={!replyText.trim()}
              title="Send reply"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* Next Story Arrow (Right) */}
      {hasNext && (
        <button
          className="fb-story-nav-btn fb-story-nav-next"
          onClick={handleNext}
          title="Next story (Right Arrow)"
        >
          <ChevronRight size={28} color="#FFFFFF" />
        </button>
      )}
    </div>
  );
}
