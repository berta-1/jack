import React from 'react';

export default function FacebookAvatar({ size = 40, style = {}, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      className={className}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        flexShrink: 0,
        display: 'block',
        ...style,
      }}
    >
      {/* Light Gray Avatar Circle Background */}
      <circle cx="18" cy="18" r="18" fill="#E4E6EB" />
      {/* Head Silhouette */}
      <circle cx="18" cy="13" r="5.5" fill="#65676B" />
      {/* Shoulders / Torso with distinct neck spacing */}
      <path
        d="M6 32 C6.8 24.5, 12 21.2, 18 21.2 C24 21.2, 29.2 24.5, 30 32 C26.8 34.8, 22.5 36, 18 36 C13.5 36, 9.2 34.8, 6 32 Z"
        fill="#65676B"
      />
    </svg>
  );
}
