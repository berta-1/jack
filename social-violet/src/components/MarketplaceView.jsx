import React, { useState } from 'react';
import { Tag, MapPin, Search } from 'lucide-react';

const MARKETPLACE_ITEMS = [
  {
    id: 'mp-1',
    title: 'Sony Alpha A7 IV Mirrorless Camera Body',
    price: '$1,850',
    location: 'San Francisco, CA',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80',
    category: 'Electronics',
  },
  {
    id: 'mp-2',
    title: 'Herman Miller Aeron Ergonomic Chair (Size B)',
    price: '$650',
    location: 'Oakland, CA',
    image: 'https://images.unsplash.com/photo-1580481077195-c3a9f0a5146e?auto=format&fit=crop&w=600&q=80',
    category: 'Furniture',
  },
  {
    id: 'mp-3',
    title: 'Vintage Leather Moto Jacket (Size M)',
    price: '$140',
    location: 'Berkeley, CA',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80',
    category: 'Apparel',
  },
  {
    id: 'mp-4',
    title: 'Custom Mechanical Keyboard 75% Wireless',
    price: '$180',
    location: 'San Jose, CA',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
    category: 'Electronics',
  },
  {
    id: 'mp-5',
    title: 'Nordic Solid Oak Coffee Table',
    price: '$320',
    location: 'Palo Alto, CA',
    image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=600&q=80',
    category: 'Furniture',
  },
  {
    id: 'mp-6',
    title: 'Apple MacBook Pro 16" M3 Max 36GB',
    price: '$2,400',
    location: 'San Francisco, CA',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
    category: 'Electronics',
  },
];

export default function MarketplaceView() {
  const [filterCategory, setFilterCategory] = useState('All');
  const categories = ['All', 'Electronics', 'Furniture', 'Apparel'];

  const filtered =
    filterCategory === 'All'
      ? MARKETPLACE_ITEMS
      : MARKETPLACE_ITEMS.filter((i) => i.category === filterCategory);

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '24px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Marketplace
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Today's top picks in San Francisco & Bay Area
          </p>
        </div>

        <button
          onClick={() => alert('Create new listing')}
          style={{
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '8px 16px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          + Create Listing
        </button>
      </div>

      {/* Category Pills */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilterCategory(c)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: filterCategory === c ? 'var(--color-primary)' : 'var(--bg-surface)',
              color: filterCategory === c ? '#ffffff' : 'var(--text-primary)',
              boxShadow: 'var(--shadow-card)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '14px',
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '16px',
        }}
      >
        {filtered.map((item) => (
          <div
            key={item.id}
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-card)',
              cursor: 'pointer',
              transition: 'transform 0.15s ease',
            }}
            onClick={() => alert(`Opening listing: ${item.title}`)}
          >
            <div style={{ height: '220px', width: '100%', overflow: 'hidden' }}>
              <img
                src={item.image}
                alt={item.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ padding: '12px' }}>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {item.price}
              </div>
              <div
                style={{
                  fontSize: '14px',
                  color: 'var(--text-primary)',
                  marginTop: '4px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {item.title}
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  marginTop: '6px',
                }}
              >
                <MapPin size={13} />
                <span>{item.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
