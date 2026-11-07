import React, { useState } from 'react';
import { UserPlus, UserCheck, Search, Users } from 'lucide-react';

const SUGGESTED_FRIENDS = [
  {
    id: 'f-sug-1',
    name: 'Chloe Laurent',
    mutual: 14,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    cover: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'f-sug-2',
    name: 'Julian Vance',
    mutual: 8,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    cover: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'f-sug-3',
    name: 'Maya Lin',
    mutual: 22,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    cover: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'f-sug-4',
    name: 'Mateo Gomez',
    mutual: 5,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    cover: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=400&q=80',
  },
];

export default function FriendsView() {
  const [requested, setRequested] = useState({});

  const handleAdd = (id) => {
    setRequested((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '24px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>Friends</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            People you may know based on mutual connections
          </p>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
          gap: '16px',
        }}
      >
        {SUGGESTED_FRIENDS.map((person) => {
          const isSent = requested[person.id];
          return (
            <div
              key={person.id}
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ height: '80px', width: '100%', position: 'relative' }}>
                <img
                  src={person.cover}
                  alt={person.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div style={{ padding: '0 12px 14px', marginTop: '-30px', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <img
                  src={person.avatar}
                  alt={person.name}
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    border: '3px solid var(--bg-surface)',
                    margin: '0 auto',
                    objectFit: 'cover',
                  }}
                />
                <div style={{ fontSize: '15px', fontWeight: 700, marginTop: '8px', color: 'var(--text-primary)' }}>
                  {person.name}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px', flex: 1 }}>
                  {person.mutual} mutual friends
                </div>

                <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <button
                    onClick={() => handleAdd(person.id)}
                    style={{
                      height: '36px',
                      borderRadius: '6px',
                      backgroundColor: isSent ? 'var(--bg-surface-hover)' : 'var(--color-primary)',
                      color: isSent ? 'var(--text-secondary)' : '#ffffff',
                      border: 'none',
                      fontWeight: 600,
                      fontSize: '14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    {isSent ? (
                      <>
                        <UserCheck size={16} />
                        <span>Request Sent</span>
                      </>
                    ) : (
                      <>
                        <UserPlus size={16} />
                        <span>Add friend</span>
                      </>
                    )}
                  </button>
                  <button
                    style={{
                      height: '36px',
                      borderRadius: '6px',
                      backgroundColor: 'var(--bg-surface-hover)',
                      color: 'var(--text-primary)',
                      border: 'none',
                      fontWeight: 600,
                      fontSize: '14px',
                      cursor: 'pointer',
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

