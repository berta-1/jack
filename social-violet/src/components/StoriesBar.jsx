import React from 'react';
import { Plus, Play, Film } from 'lucide-react';
import darkAvatarImg from '../assets/fb-user-dark-avatar.png';
import { useAuth } from '../context/AuthContext';
import { INITIAL_STORIES } from '../data/mockData';

export default function StoriesBar({ onCreateStory, onSelectStory, stories = INITIAL_STORIES }) {
  const { currentUser } = useAuth();
  const userAvatar = currentUser?.avatar || darkAvatarImg;

  return (
    <div className="fb-stories-wrapper">
      <div className="fb-stories-scroll-track">
        {/* 1. "Create story" Card */}
        <div
          className="fb-story-card fb-story-create-card"
          onClick={onCreateStory}
          title="Create story"
        >
          {/* Top Half: User Avatar / Background */}
          <div className="fb-story-create-thumb">
            <img
              src={userAvatar}
              alt="You"
              className="fb-story-create-img"
            />
          </div>

          {/* Dividing Plus Button */}
          <div className="fb-story-create-plus-btn">
            <Plus size={20} color="#FFFFFF" strokeWidth={3} />
          </div>

          {/* Bottom Half: "Create story" Text */}
          <div className="fb-story-create-footer">
            <span className="fb-story-create-title">Create story</span>
          </div>
        </div>

        {/* 2. Friends / Suggested Stories Cards */}
        {stories.map((story) => {
          const isVideo = story.mediaType === 'video' || !!story.videoUrl;

          return (
            <div
              key={story.id}
              className="fb-story-card fb-story-user-card"
              onClick={() => onSelectStory && onSelectStory(story)}
              title={`View ${story.userName}'s story`}
            >
              {/* Media Container: Video with Hover Preview or Static Image */}
              {isVideo ? (
                <div className="fb-story-media-wrap">
                  <video
                    src={story.videoUrl}
                    poster={story.mediaUrl}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="fb-story-bg-video"
                    onMouseEnter={(e) => {
                      try {
                        e.currentTarget.play().catch(() => {});
                      } catch (err) {}
                    }}
                    onMouseLeave={(e) => {
                      try {
                        e.currentTarget.pause();
                        e.currentTarget.currentTime = 0;
                      } catch (err) {}
                    }}
                  />
                  {/* Fallback image behind video */}
                  <img
                    src={story.mediaUrl}
                    alt={story.userName}
                    className="fb-story-bg-img fb-story-bg-fallback"
                    loading="lazy"
                  />
                </div>
              ) : (
                <img
                  src={story.mediaUrl}
                  alt={story.userName}
                  className="fb-story-bg-img"
                  loading="lazy"
                />
              )}

              {/* Top-Right Video Story Indicator Badge */}
              {isVideo && (
                <div className="fb-story-video-badge" title="Video story">
                  <Play size={10} color="#FFFFFF" fill="#FFFFFF" />
                  <span>VIDEO</span>
                </div>
              )}

              {/* Top-Left Circular Author Avatar with Blue Story Ring */}
              <div className="fb-story-avatar-ring">
                <img
                  src={story.userAvatar}
                  alt={story.userName}
                  className="fb-story-avatar-img"
                />
              </div>

              {/* Bottom Gradient Overlay & Name */}
              <div className="fb-story-bottom-overlay">
                <div className="fb-story-author-name">{story.userName}</div>
                <div className="fb-story-author-sub">
                  {story.suggested ? 'Suggested' : story.timestamp || 'Suggested'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
