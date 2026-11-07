import React from 'react';
import { REACTION_TYPES } from '../data/mockData';

export default function ReactionDock({ onSelect, onMouseEnter, onMouseLeave }) {
  return (
    <div
      className="reaction-dock"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {REACTION_TYPES.map((r) => (
        <button
          key={r.type}
          className="dock-emoji-btn"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(r.type);
          }}
          title={r.label}
        >
          <span>{r.emoji}</span>
        </button>
      ))}
    </div>
  );
}

