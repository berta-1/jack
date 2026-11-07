import React from 'react';
import { Heart, MessageCircle, Users, UserPlus, CheckCheck } from 'lucide-react';

export default function NotificationsDropdown({
  notifications,
  onMarkAllAsRead,
  onNotificationClick,
  onClose,
}) {
  const getIcon = (type) => {
    switch (type) {
      case 'heart':
        return <Heart size={14} fill="#f43f5e" color="#f43f5e" />;
      case 'message':
        return <MessageCircle size={14} fill="#0ea5e9" color="#0ea5e9" />;
      case 'users':
        return <Users size={14} color="var(--color-primary)" />;
      default:
        return <UserPlus size={14} color="#10b981" />;
    }
  };

  return (
    <div className="dropdown-popover" style={{ width: '360px' }}>
      <div className="dropdown-header">
        <span className="dropdown-title">Notifications</span>
        <button
          onClick={onMarkAllAsRead}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-primary)',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <CheckCheck size={16} />
          <span>Mark all read</span>
        </button>
      </div>

      <div style={{ maxHeight: '420px', overflowY: 'auto' }}>
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`dropdown-item ${!notif.read ? 'unread' : ''}`}
            onClick={() => onNotificationClick(notif.id)}
          >
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <img
                src={notif.user.avatar}
                alt={notif.user.name}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  background: 'var(--bg-surface)',
                  borderRadius: '50%',
                  padding: '3px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }}
              >
                {getIcon(notif.icon)}
              </span>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', lineHeight: 1.35, color: 'var(--text-primary)' }}>
                <strong>{notif.user.name}</strong> {notif.action}
              </div>
              <div
                style={{
                  fontSize: '12px',
                  color: !notif.read ? 'var(--color-primary)' : 'var(--text-secondary)',
                  fontWeight: !notif.read ? 600 : 400,
                  marginTop: '2px',
                }}
              >
                {notif.time}
              </div>
            </div>

            {!notif.read && (
              <span
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-primary)',
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

