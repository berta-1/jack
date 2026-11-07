import React, { useState } from 'react';
import { ThumbsUp, MessageCircle, Share2, Play, Volume2 } from 'lucide-react';

const WATCH_VIDEOS = [
  {
    id: 'vid-1',
    creator: 'National Nature Expeditions',
    avatar: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=200&q=80',
    title: 'Bioluminescent Waves in Southern California • 4K HDR',
    time: '2 hours ago',
    views: '1.2M views',
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    likes: 42000,
    comments: 1840,
  },
  {
    id: 'vid-2',
    creator: 'Tech Blueprint Labs',
    avatar: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=200&q=80',
    title: 'The Future of Neural UI Interfaces and Ambient Computing (2026)',
    time: 'Yesterday',
    views: '680K views',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    likes: 29000,
    comments: 920,
  },
];

export default function WatchView() {
  const [playingId, setPlayingId] = useState(null);

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', padding: '20px 16px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}>
        Sphere Watch
      </h1>

      {WATCH_VIDEOS.map((vid) => (
        <div key={vid.id} className="feed-post" style={{ marginBottom: '24px' }}>
          {/* Header */}
          <div className="post-header">
            <div className="post-author-info">
              <img src={vid.avatar} alt={vid.creator} className="post-author-avatar" />
              <div>
                <div className="post-author-name">{vid.creator}</div>
                <div className="post-meta">
                  <span>{vid.time}</span> · <span>{vid.views}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Title */}
          <div style={{ padding: '0 16px 12px', fontSize: '16px', fontWeight: 600 }}>
            {vid.title}
          </div>

          {/* Video Player Card */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '420px',
              backgroundColor: '#000',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={() => setPlayingId(playingId === vid.id ? null : vid.id)}
          >
            <img
              src={vid.thumbnail}
              alt={vid.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: playingId === vid.id ? 0.9 : 0.8 }}
            />

            {/* Play Button Overlay */}
            <div
              style={{
                position: 'absolute',
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                color: 'white',
              }}
            >
              <Play size={28} fill="white" style={{ marginLeft: '4px' }} />
            </div>

            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                right: '12px',
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
              }}
            >
              14:28
            </div>
          </div>

          {/* Action Bar */}
          <div className="post-stats-row">
            <span>👍 ❤️ {vid.likes.toLocaleString()}</span>
            <span>{vid.comments.toLocaleString()} comments</span>
          </div>

          <div className="post-buttons-bar">
            <button className="post-bottom-btn">
              <ThumbsUp size={18} />
              <span>Like</span>
            </button>
            <button className="post-bottom-btn">
              <MessageCircle size={18} />
              <span>Comment</span>
            </button>
            <button className="post-bottom-btn">
              <Share2 size={18} />
              <span>Share</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

