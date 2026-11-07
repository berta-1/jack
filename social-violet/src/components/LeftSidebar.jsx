import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import FacebookAvatar from './FacebookAvatar';
import { setRoute } from '../utils/router';

import iconFriends from '../assets/fb-official-icons/icon_friends.png';
import iconMemories from '../assets/fb-official-icons/icon_memories.png';
import iconSaved from '../assets/fb-official-icons/icon_saved.png';
import iconGroups from '../assets/fb-official-icons/icon_groups.png';
import iconReels from '../assets/fb-official-icons/icon_reels.png';
import iconMarketplace from '../assets/fb-official-icons/icon_marketplace.png';
import iconFeeds from '../assets/fb-official-icons/icon_feeds.png';
import iconEvents from '../assets/fb-official-icons/icon_events.png';
import iconAds from '../assets/fb-official-icons/icon_ads.png';
import iconGames from '../assets/fb-official-icons/icon_games.png';
import iconSeeMore from '../assets/fb-official-icons/icon_seemore.png';

// Official Facebook Sidebar Icons - Full 36x36 assets with transparency

export default function LeftSidebar() {
  const [showMore, setShowMore] = useState(false);
  const { currentUser } = useAuth();

  const iconStyle = {
    width: '36px',
    height: '36px',
    objectFit: 'contain',
    display: 'block',
    flexShrink: 0,
    filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.12))',
  };

  return (
    <aside className="left-sidebar">
      {/* Current User Profile Item */}
      <div
        className="sidebar-item"
        onClick={() => alert(`Profile of ${currentUser?.name || 'Berta Hule'}`)}
      >
        <div style={{ width: '36px', height: '36px', flexShrink: 0, filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.12))' }}>
          {currentUser?.avatar ? (
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <FacebookAvatar size={36} />
          )}
        </div>
        <span className="sidebar-item-label">
          {currentUser?.name || 'Berta Hule'}
        </span>
      </div>

      {/* Friends */}
      <div className="sidebar-item">
        <img src={iconFriends} alt="Friends" style={iconStyle} />
        <span className="sidebar-item-label">Friends</span>
      </div>

      {/* Memories */}
      <div className="sidebar-item">
        <img src={iconMemories} alt="Memories" style={iconStyle} />
        <span className="sidebar-item-label">Memories</span>
      </div>

      {/* Saved */}
      <div className="sidebar-item">
        <img src={iconSaved} alt="Saved" style={iconStyle} />
        <span className="sidebar-item-label">Saved</span>
      </div>

      {/* Groups */}
      <div className="sidebar-item">
        <img src={iconGroups} alt="Groups" style={iconStyle} />
        <span className="sidebar-item-label">Groups</span>
      </div>

      {/* Reels */}
      <div className="sidebar-item">
        <img src={iconReels} alt="Reels" style={iconStyle} />
        <span className="sidebar-item-label">Reels</span>
      </div>

      {/* Marketplace */}
      <div className="sidebar-item">
        <img src={iconMarketplace} alt="Marketplace" style={iconStyle} />
        <span className="sidebar-item-label">Marketplace</span>
      </div>

      {/* Feeds */}
      <div className="sidebar-item">
        <img src={iconFeeds} alt="Feeds" style={iconStyle} />
        <span className="sidebar-item-label">Feeds</span>
      </div>

      {/* Events */}
      <div className="sidebar-item">
        <img src={iconEvents} alt="Events" style={iconStyle} />
        <span className="sidebar-item-label">Events</span>
      </div>

      {/* Ads Manager */}
      <div className="sidebar-item">
        <img src={iconAds} alt="Ads Manager" style={iconStyle} />
        <span className="sidebar-item-label">Ads Manager</span>
      </div>

      {/* Play Games */}
      <div className="sidebar-item">
        <img src={iconGames} alt="Play games" style={iconStyle} />
        <span className="sidebar-item-label">Play games</span>
      </div>

      {/* See More / See Less Toggle */}
      <div
        className="sidebar-item"
        onClick={() => setShowMore((prev) => !prev)}
      >
        <img
          src={iconSeeMore}
          alt="See more"
          style={{
            ...iconStyle,
            transform: showMore ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s ease',
          }}
        />
        <span className="sidebar-item-label">{showMore ? 'See less' : 'See more'}</span>
      </div>

      {/* Admin Console Shortcut */}
      <div
        className="sidebar-item"
        onClick={() => {
          setRoute('admin/logs');
        }}
        style={{ marginTop: 8 }}
      >
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#0866FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Shield size={20} color="#FFFFFF" />
        </div>
        <span className="sidebar-item-label" style={{ fontWeight: 600, color: '#0866FF' }}>
          Admin Console
        </span>
      </div>
    </aside>
  );
}
