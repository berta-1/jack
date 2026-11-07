import React from 'react';
import { UsersRound, Plus, Compass } from 'lucide-react';

const USER_GROUPS = [
  {
    id: 'grp-1',
    name: 'React 19 & Next.js Developers Worldwide',
    members: '240K members · 35 posts a day',
    cover: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'grp-2',
    name: 'Pacific Landscape & Astrophotography',
    members: '98K members · 18 posts a day',
    cover: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'grp-3',
    name: 'Modern UI/UX Design Systems Hub',
    members: '142K members · 42 posts a day',
    cover: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=600&q=80',
  },
];

export default function GroupsView() {
  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', padding: '24px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Groups
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            Communities and technical groups you participate in
          </p>
        </div>

        <button
          onClick={() => alert('Create new community group')}
          style={{
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '8px 16px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Plus size={16} />
          <span>Create New Group</span>
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {USER_GROUPS.map((grp) => (
          <div
            key={grp.id}
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <img
                src={grp.cover}
                alt={grp.name}
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '12px',
                  objectFit: 'cover',
                }}
              />
              <div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {grp.name}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {grp.members}
                </div>
              </div>
            </div>

            <button
              onClick={() => alert(`View group: ${grp.name}`)}
              style={{
                backgroundColor: 'var(--bg-surface-hover)',
                color: 'var(--text-primary)',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              View Group
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

