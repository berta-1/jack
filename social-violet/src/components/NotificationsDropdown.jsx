import React, { useState } from 'react';
import {
  Shield,
  Users,
  Bell,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Check,
  Settings,
  UserCheck,
} from 'lucide-react';

/**
 * Facebook Official Notifications Dropdown Menu
 * Pixel-perfect match to Facebook Web notifications interface:
 * - Header: "Notifications" + More Options (•••)
 * - Filter Pills: "All" & "Unread"
 * - Grouped Sections: "New" (with "See all" link) and "Earlier"
 * - Official Facebook Security alerts (Shield badges, Silhouette & Facebook logos)
 * - Group recommendations (FBC Fans) & Friend suggestions
 * - Dynamic read/unread state toggling and filter support
 */
export default function NotificationsDropdown({
  notifications = [],
  onMarkAllAsRead,
  onNotificationClick,
  onClose,
}) {
  const [filter, setFilter] = useState('all'); // 'all' | 'unread'
  const [showOptions, setShowOptions] = useState(false);

  // Filter items
  const filteredList = notifications.filter((notif) => {
    if (filter === 'unread') return !notif.read;
    return true;
  });

  // Partition into "New" and "Earlier"
  const newItems = filteredList.filter(
    (n) => n.section === 'new' || (!n.read && n.section !== 'earlier')
  );
  const earlierItems = filteredList.filter(
    (n) => n.section === 'earlier' || (n.read && n.section !== 'new')
  );

  const handleItemClick = (id) => {
    if (onNotificationClick) {
      onNotificationClick(id);
    }
  };

  // Render Avatar based on type
  const renderAvatar = (notif) => {
    const avatarType = notif.user?.avatarType || notif.avatarType;

    if (avatarType === 'silhouette') {
      return (
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: '#E4E6EB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <svg viewBox="0 0 24 24" width="34" height="34" fill="#8A8D91">
            <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z" />
          </svg>
        </div>
      );
    }

    if (avatarType === 'facebook') {
      return (
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: '#0866FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <svg viewBox="0 0 36 36" width="36" height="36" fill="none">
            <path
              d="M23 18h-3.4v11h-4.6V18h-2.2v-3.8h2.2v-2.6c0-3.1 1.9-4.8 4.7-4.8 1.3 0 2.5.1 2.8.1v3.2h-1.9c-1.5 0-1.8.7-1.8 1.8v2.3h3.8l-.6 3.8z"
              fill="#FFFFFF"
            />
          </svg>
        </div>
      );
    }

    // Default image avatar (Page or User)
    const avatarSrc =
      notif.user?.avatar ||
      notif.avatar ||
      'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=200&q=80';

    return (
      <img
        src={avatarSrc}
        alt={notif.user?.name || 'Notification'}
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          objectFit: 'cover',
          display: 'block',
          flexShrink: 0,
          backgroundColor: '#E4E6EB',
        }}
      />
    );
  };

  // Render bottom-right circular badge
  const renderBadge = (notif) => {
    const badgeType = notif.badge || notif.icon || 'shield';

    let iconComponent = null;
    let bgColor = '#0866FF';

    if (badgeType === 'shield' || notif.type === 'security_alert') {
      iconComponent = <Shield size={12} fill="#FFFFFF" color="#FFFFFF" />;
      bgColor = '#0866FF';
    } else if (badgeType === 'group' || badgeType === 'users' || notif.type === 'page_suggestion') {
      iconComponent = <Users size={12} fill="#FFFFFF" color="#FFFFFF" />;
      bgColor = '#0866FF';
    } else if (badgeType === 'bell' || notif.type === 'friend_suggestion') {
      iconComponent = <Bell size={12} fill="#FFFFFF" color="#FFFFFF" />;
      bgColor = '#0866FF';
    } else if (badgeType === 'heart') {
      iconComponent = <Heart size={12} fill="#FFFFFF" color="#FFFFFF" />;
      bgColor = '#F3425F';
    } else if (badgeType === 'message') {
      iconComponent = <MessageCircle size={12} fill="#FFFFFF" color="#FFFFFF" />;
      bgColor = '#0084FF';
    } else {
      iconComponent = <Shield size={12} fill="#FFFFFF" color="#FFFFFF" />;
    }

    return (
      <span
        style={{
          position: 'absolute',
          bottom: '-2px',
          right: '-2px',
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          backgroundColor: bgColor,
          border: '2px solid #FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
        }}
      >
        {iconComponent}
      </span>
    );
  };

  // Render text with proper bolding matching screenshot
  const renderNotificationText = (notif) => {
    if (notif.highlightText) {
      const parts = (notif.action || notif.title || '').split(notif.highlightText);
      return (
        <span>
          {parts[0]}
          <strong style={{ fontWeight: 600, color: '#050505' }}>{notif.highlightText}</strong>
          {parts.slice(1).join(notif.highlightText)}
        </span>
      );
    }

    // Security or standard notifications
    if (
      notif.action?.includes('Someone tried to log in') ||
      notif.action?.includes('We noticed a new login') ||
      notif.action?.includes("See who's also on Facebook")
    ) {
      return (
        <span style={{ fontWeight: !notif.read ? 600 : 400, color: '#050505' }}>
          {notif.action || notif.title}
        </span>
      );
    }

    // Default: User interacted with your profile
    const userName =
      typeof notif.user === 'object'
        ? notif.user?.name || 'Facebook User'
        : String(notif.user || 'Facebook User');

    return (
      <span>
        <strong style={{ fontWeight: 600, color: '#050505' }}>{userName}</strong>{' '}
        <span style={{ color: '#050505' }}>{notif.action || 'interacted with your profile'}</span>
      </span>
    );
  };

  const renderNotificationRow = (notif) => {
    return (
      <div
        key={notif.id}
        onClick={() => handleItemClick(notif.id)}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '8px 16px',
          cursor: 'pointer',
          borderRadius: '8px',
          margin: '2px 8px',
          backgroundColor: 'transparent',
          transition: 'background-color 0.15s ease',
          gap: '12px',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#F2F2F2';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        {/* Left: Avatar with Overlay Badge */}
        <div style={{ position: 'relative', width: '56px', height: '56px', flexShrink: 0 }}>
          {renderAvatar(notif)}
          {renderBadge(notif)}
        </div>

        {/* Center: Text Content + Timestamp */}
        <div style={{ flex: 1, minWidth: 0, paddingRight: '8px' }}>
          <div
            style={{
              fontSize: '14px',
              lineHeight: 1.35,
              color: '#050505',
              wordBreak: 'break-word',
            }}
          >
            {renderNotificationText(notif)}
          </div>
          <div
            style={{
              fontSize: '13px',
              fontWeight: !notif.read ? 600 : 400,
              color: !notif.read ? '#0866FF' : '#65676B',
              marginTop: '3px',
            }}
          >
            {notif.time || 'Just now'}
          </div>
        </div>

        {/* Right: Unread Blue Dot or Options Icon */}
        {!notif.read ? (
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#0866FF',
              flexShrink: 0,
              marginLeft: '4px',
            }}
            title="Unread"
          />
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
            }}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: 'none',
              background: 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#65676B',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#E4E6EB';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title="Options"
          >
            <MoreHorizontal size={18} />
          </button>
        )}
      </div>
    );
  };

  return (
    <div
      className="dropdown-popover fb-official-notifications-dropdown"
      style={{
        position: 'absolute',
        top: '54px',
        right: '16px',
        width: '360px',
        backgroundColor: '#FFFFFF',
        borderRadius: '8px',
        boxShadow: '0 12px 28px 0 rgba(0, 0, 0, 0.2), 0 2px 4px 0 rgba(0, 0, 0, 0.1)',
        border: 'none',
        zIndex: 1000,
        padding: '12px 0 8px 0',
        fontFamily: 'Segoe UI, Helvetica, Arial, sans-serif',
        userSelect: 'none',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* 1. Top Header: "Notifications" + 3-dots */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '4px 16px 12px 16px',
          position: 'relative',
        }}
      >
        <span
          style={{
            fontSize: '24px',
            fontWeight: 700,
            color: '#050505',
            letterSpacing: '-0.3px',
          }}
        >
          Notifications
        </span>

        {/* 3-dots menu button */}
        <button
          type="button"
          onClick={() => setShowOptions((prev) => !prev)}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: showOptions ? '#E7F3FF' : '#E4E6EB',
            color: showOptions ? '#0866FF' : '#050505',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background-color 0.15s ease',
          }}
          title="Notification options"
        >
          <MoreHorizontal size={20} />
        </button>

        {/* Options Context Menu */}
        {showOptions && (
          <div
            style={{
              position: 'absolute',
              top: '48px',
              right: '16px',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 12px 28px 0 rgba(0,0,0,0.2), 0 2px 4px 0 rgba(0,0,0,0.1)',
              borderRadius: '8px',
              padding: '6px',
              minWidth: '220px',
              zIndex: 1050,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                fontSize: '14px',
                fontWeight: 600,
                color: '#050505',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F2F2F2';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              onClick={() => {
                if (onMarkAllAsRead) onMarkAllAsRead();
                setShowOptions(false);
              }}
            >
              <Check size={18} color="#0866FF" />
              <span>Mark all as read</span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                fontSize: '14px',
                fontWeight: 500,
                color: '#050505',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F2F2F2';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              onClick={() => setShowOptions(false)}
            >
              <Settings size={18} color="#65676B" />
              <span>Notification settings</span>
            </div>
          </div>
        )}
      </div>

      {/* 2. Filter Pills: "All" & "Unread" */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          padding: '0 16px 10px 16px',
        }}
      >
        <button
          type="button"
          onClick={() => setFilter('all')}
          style={{
            padding: '6px 14px',
            borderRadius: '18px',
            border: 'none',
            fontSize: '15px',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: filter === 'all' ? '#E7F3FF' : 'transparent',
            color: filter === 'all' ? '#0866FF' : '#050505',
            transition: 'background-color 0.15s ease',
          }}
        >
          All
        </button>

        <button
          type="button"
          onClick={() => setFilter('unread')}
          style={{
            padding: '6px 14px',
            borderRadius: '18px',
            border: 'none',
            fontSize: '15px',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: filter === 'unread' ? '#E7F3FF' : 'transparent',
            color: filter === 'unread' ? '#0866FF' : '#050505',
            transition: 'background-color 0.15s ease',
          }}
        >
          Unread
        </button>
      </div>

      {/* 3. Notifications List */}
      <div
        style={{
          maxHeight: '480px',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        {filteredList.length === 0 ? (
          <div
            style={{
              padding: '40px 20px',
              textAlign: 'center',
              color: '#65676B',
              fontSize: '15px',
            }}
          >
            No unread notifications
          </div>
        ) : (
          <>
            {/* Section: New */}
            {newItems.length > 0 && (
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 16px 4px 16px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '17px',
                      fontWeight: 600,
                      color: '#050505',
                    }}
                  >
                    New
                  </span>

                  <span
                    onClick={() => {
                      if (onMarkAllAsRead) onMarkAllAsRead();
                    }}
                    style={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#0866FF',
                      cursor: 'pointer',
                    }}
                  >
                    See all
                  </span>
                </div>

                {newItems.map((n) => renderNotificationRow(n))}
              </div>
            )}

            {/* Section: Earlier */}
            {earlierItems.length > 0 && (
              <div>
                <div
                  style={{
                    padding: '12px 16px 4px 16px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '17px',
                      fontWeight: 600,
                      color: '#050505',
                    }}
                  >
                    Earlier
                  </span>
                </div>

                {earlierItems.map((n) => renderNotificationRow(n))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
