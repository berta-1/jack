import React from 'react';
import { Search, MoreHorizontal, Gift, Video } from 'lucide-react';
import { SPONSORED_ADS } from '../data/mockData';

export default function RightSidebar({ contacts, onSelectContact }) {
  return (
    <aside className="right-sidebar">
      {/* Sponsored Ads */}
      <div className="sidebar-title">Sponsored</div>
      {SPONSORED_ADS.map((ad) => (
        <a
          key={ad.id}
          href={`https://${ad.domain}`}
          target="_blank"
          rel="noreferrer"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <div className="sidebar-item" style={{ alignItems: 'flex-start', padding: '8px' }}>
            <img
              src={ad.image}
              alt={ad.title}
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '8px',
                objectFit: 'cover',
                flexShrink: 0,
              }}
            />
            <div style={{ marginLeft: '12px' }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                {ad.title}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {ad.domain}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '4px', lineHeight: 1.3 }}>
                {ad.description}
              </div>
            </div>
          </div>
        </a>
      ))}

      <div className="sidebar-divider" />

      {/* Birthdays */}
      <div className="sidebar-title">Birthdays</div>
      <div className="sidebar-item" style={{ padding: '8px 10px' }}>
        <div
          style={{
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            marginRight: '8px',
          }}
        >
          <Gift size={24} />
        </div>
        <div style={{ fontSize: '14px', lineHeight: 1.4, color: 'var(--text-primary)' }}>
          <strong>Elena Rostova</strong> and <strong>2 others</strong> have birthdays today.
        </div>
      </div>

      <div className="sidebar-divider" />

      {/* Contacts List Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 10px 4px',
        }}
      >
        <span className="sidebar-title" style={{ padding: 0 }}>
          Contacts
        </span>
        <div style={{ display: 'flex', gap: '8px', color: 'var(--text-secondary)' }}>
          <button
            className="icon-circle-btn"
            style={{ width: '30px', height: '30px' }}
            title="New Call"
          >
            <Video size={16} />
          </button>
          <button
            className="icon-circle-btn"
            style={{ width: '30px', height: '30px' }}
            title="Search Contacts"
          >
            <Search size={16} />
          </button>
          <button
            className="icon-circle-btn"
            style={{ width: '30px', height: '30px' }}
            title="Options"
          >
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>

      {/* Friends list */}
      <div style={{ marginTop: '4px' }}>
        {contacts.map((friend) => (
          <div
            key={friend.id}
            className="sidebar-item"
            onClick={() => onSelectContact(friend)}
            title={`Chat with ${friend.name}`}
          >
            <div style={{ position: 'relative', width: '36px', height: '36px' }}>
              <img
                src={friend.avatar}
                alt={friend.name}
                className="sidebar-item-avatar"
              />
              {friend.online && <span className="online-dot" />}
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                }}
              >
                {friend.name}
              </div>
              <div
                style={{
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                }}
              >
                {friend.statusText}
              </div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

