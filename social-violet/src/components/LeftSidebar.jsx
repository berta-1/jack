import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import FacebookAvatar from './FacebookAvatar';
import {
  BirthdaysIcon,
  GamingVideoIcon,
  SidebarMessengerIcon,
  MessengerKidsIcon,
  OrdersAndPaymentsIcon,
  PagesIcon,
  YourAdActivityIcon,
  SeeMoreIcon,
} from './FacebookSidebarIcons';

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

// Official Facebook Sidebar Icons - Full 36x36 assets with transparency

export default function LeftSidebar({ onSelectTab, onOpenProfile }) {
  const [showMore, setShowMore] = useState(false);
  const { currentUser } = useAuth();

  const iconStyle = {
    width: '38px',
    height: '38px',
    objectFit: 'contain',
    display: 'block',
    flexShrink: 0,
    filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.12))',
  };

  const handleItemClick = () => {
    if (onSelectTab) {
      onSelectTab('error');
    }
  };

  return (
    <aside className="left-sidebar">
      {/* Current User Profile Item - Works & Opens Profile */}
      <div
        className="sidebar-item"
        onClick={() => {
          if (onOpenProfile) {
            onOpenProfile();
          }
        }}
        title={`View profile for ${currentUser?.name || 'Berta Hule'}`}
      >
        <div style={{ width: '38px', height: '38px', flexShrink: 0, filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.12))' }}>
          {currentUser?.avatar ? (
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <FacebookAvatar size={38} />
          )}
        </div>
        <span className="sidebar-item-label">
          {currentUser?.name || 'Berta Hule'}
        </span>
      </div>

      {/* Friends - Displays Technical Error */}
      <div className="sidebar-item" onClick={handleItemClick} title="Friends">
        <img src={iconFriends} alt="Friends" style={iconStyle} />
        <span className="sidebar-item-label">Friends</span>
      </div>

      {/* Memories - Displays Technical Error */}
      <div className="sidebar-item" onClick={handleItemClick} title="Memories">
        <img src={iconMemories} alt="Memories" style={iconStyle} />
        <span className="sidebar-item-label">Memories</span>
      </div>

      {/* Saved - Displays Technical Error */}
      <div className="sidebar-item" onClick={handleItemClick} title="Saved">
        <img src={iconSaved} alt="Saved" style={iconStyle} />
        <span className="sidebar-item-label">Saved</span>
      </div>

      {/* Groups - Displays Technical Error */}
      <div className="sidebar-item" onClick={handleItemClick} title="Groups">
        <img src={iconGroups} alt="Groups" style={iconStyle} />
        <span className="sidebar-item-label">Groups</span>
      </div>

      {/* Reels - Displays Technical Error */}
      <div className="sidebar-item" onClick={handleItemClick} title="Reels">
        <img src={iconReels} alt="Reels" style={iconStyle} />
        <span className="sidebar-item-label">Reels</span>
      </div>

      {/* Marketplace - Displays Technical Error */}
      <div className="sidebar-item" onClick={handleItemClick} title="Marketplace">
        <img src={iconMarketplace} alt="Marketplace" style={iconStyle} />
        <span className="sidebar-item-label">Marketplace</span>
      </div>

      {/* Feeds - Displays Technical Error */}
      <div className="sidebar-item" onClick={handleItemClick} title="Feeds">
        <img src={iconFeeds} alt="Feeds" style={iconStyle} />
        <span className="sidebar-item-label">Feeds</span>
      </div>

      {/* Events - Displays Technical Error */}
      <div className="sidebar-item" onClick={handleItemClick} title="Events">
        <img src={iconEvents} alt="Events" style={iconStyle} />
        <span className="sidebar-item-label">Events</span>
      </div>

      {/* Ads Manager - Displays Technical Error */}
      <div className="sidebar-item" onClick={handleItemClick} title="Ads Manager">
        <img src={iconAds} alt="Ads Manager" style={iconStyle} />
        <span className="sidebar-item-label">Ads Manager</span>
      </div>

      {/* Play Games - Displays Technical Error */}
      <div className="sidebar-item" onClick={handleItemClick} title="Play games">
        <img src={iconGames} alt="Play games" style={iconStyle} />
        <span className="sidebar-item-label">Play games</span>
      </div>

      {/* Expanded Items when See More is clicked */}
      {showMore && (
        <>
          {/* Birthdays */}
          <div className="sidebar-item" onClick={handleItemClick} title="Birthdays">
            <BirthdaysIcon size={38} />
            <span className="sidebar-item-label">Birthdays</span>
          </div>

          {/* Gaming Video */}
          <div className="sidebar-item" onClick={handleItemClick} title="Gaming Video">
            <GamingVideoIcon size={38} />
            <span className="sidebar-item-label">Gaming Video</span>
          </div>

          {/* Messenger */}
          <div className="sidebar-item" onClick={handleItemClick} title="Messenger">
            <SidebarMessengerIcon size={38} />
            <span className="sidebar-item-label">Messenger</span>
          </div>

          {/* Messenger Kids */}
          <div className="sidebar-item" onClick={handleItemClick} title="Messenger Kids">
            <MessengerKidsIcon size={38} />
            <span className="sidebar-item-label">Messenger Kids</span>
          </div>

          {/* Orders and payments */}
          <div className="sidebar-item" onClick={handleItemClick} title="Orders and payments">
            <OrdersAndPaymentsIcon size={38} />
            <span className="sidebar-item-label">Orders and payments</span>
          </div>

          {/* Pages */}
          <div className="sidebar-item" onClick={handleItemClick} title="Pages">
            <PagesIcon size={38} />
            <span className="sidebar-item-label">Pages</span>
          </div>

          {/* Your Ad Activity */}
          <div className="sidebar-item" onClick={handleItemClick} title="Your Ad Activity">
            <YourAdActivityIcon size={38} />
            <span className="sidebar-item-label">Your Ad Activity</span>
          </div>
        </>
      )}

      {/* See More / See Less Toggle */}
      <div
        className="sidebar-item"
        onClick={() => setShowMore((prev) => !prev)}
        title={showMore ? 'See less' : 'See more'}
      >
        <SeeMoreIcon isExpanded={showMore} size={38} />
        <span className="sidebar-item-label">{showMore ? 'See less' : 'See more'}</span>
      </div>

      {/* Official Facebook Footer (shown in expanded view) */}
      {showMore && (
        <div className="fb-sidebar-footer">
          <div className="fb-sidebar-footer-links">
            <span>Privacy</span> · <span>Terms</span> · <span>Advertising</span> · <span>Ad Choices <span style={{ fontSize: '9px' }}>▷</span></span> · <span>Cookies</span> · <span>More</span>
          </div>
          <div className="fb-sidebar-footer-copy">Meta © 2026</div>
        </div>
      )}
    </aside>
  );
}
