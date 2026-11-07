import React from 'react';
import fbLogoImg from '../assets/fb-icons/fb-logo.png';

/**
 * Facebook Official Brand Logo
 * Pixel-perfect official SVG vector: Meta gradient circle with Klavika 'f'
 * Razor-sharp at any resolution or pixel density
 */
export function FacebookOfficialLogo({ size = 40, className = '' }) {
  return (
    <svg
      viewBox="0 0 36 36"
      width={size}
      height={size}
      className={className}
      style={{
        display: 'block',
        width: `${size}px`,
        height: `${size}px`,
        flexShrink: 0,
        cursor: 'pointer',
      }}
    >
      <defs>
        <linearGradient x1="50%" x2="50%" y1="97.078%" y2="0%" id="fbOfficialBrandGrad">
          <stop offset="0%" stopColor="#0064E0" />
          <stop offset="100%" stopColor="#0067FF" />
        </linearGradient>
      </defs>
      <path
        d="M15 35.8C6.5 34.3 0 26.9 0 18 0 8.1 8.1 0 18 0s18 8.1 18 18c0 8.9-6.5 16.3-15 17.8l-1-.8h-4l-1 .8z"
        fill="url(#fbOfficialBrandGrad)"
      />
      <path
        d="M25 23l.8-5H21v-3.5c0-1.4.5-2.5 2.7-2.5H26V7.4c-.7-.1-2.5-.4-4.5-.4-4.4 0-7.5 2.7-7.5 7.8V18h-4.5v5H14v12.7c1 .2 2 .3 3 .3s2-.1 3-.3V23h5z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

/**
 * Facebook Official Settings Gear Icon
 * Solid black filled 8-tooth gear glyph with central hole matching web.facebook.com
 */
export function FacebookSolidGearIcon({ size = 24, className = '' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="#050505"
      className={className}
      aria-hidden="true"
      style={{
        display: 'block',
        width: `${size}px`,
        height: `${size}px`,
        flexShrink: 0,
        fill: '#050505',
      }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54A.484.484 0 0 0 13.9 2h-3.8c-.24 0-.44.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.75 8.87a.49.49 0 0 0 .12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.8c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.49.49 0 0 0-.12-.61l-2.01-1.58zM12 15.6a3.6 3.6 0 1 1 0-7.2 3.6 3.6 0 0 1 0 7.2z"
      />
    </svg>
  );
}

/**
 * Friends Icon: Full 36px dual-figure cyan and blue silhouettes
 */
export function FriendsIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" style={{ display: 'block', flexShrink: 0 }}>
      <defs>
        <linearGradient id="fbFriendsTeal" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#00D2D3" />
          <stop offset="100%" stopColor="#00A8BD" />
        </linearGradient>
        <linearGradient id="fbFriendsBlue" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1B74E4" />
          <stop offset="100%" stopColor="#0866FF" />
        </linearGradient>
      </defs>
      {/* Background cyan person on right (larger, visible shoulder) */}
      <circle cx="23.5" cy="10.5" r="5" fill="url(#fbFriendsTeal)" />
      <path d="M17 29 C17 23 20 19 24.5 19 C29 19 33 23 33 29 Z" fill="url(#fbFriendsTeal)" />
      {/* Foreground blue person on left */}
      <circle cx="13" cy="13" r="5.8" fill="url(#fbFriendsBlue)" />
      <path d="M4 33 C4 25.5 8.5 21 15 21 C21.5 21 26 25.5 26 33 Z" fill="url(#fbFriendsBlue)" />
    </svg>
  );
}

/**
 * Memories Icon: Circular counter-clockwise cyan clock arrow with solid white face
 */
export function MemoriesIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" style={{ display: 'block', flexShrink: 0 }}>
      <defs>
        <linearGradient id="fbMemoriesGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00D2FF" />
          <stop offset="100%" stopColor="#0866FF" />
        </linearGradient>
      </defs>
      {/* Solid White Clock Face */}
      <circle cx="18" cy="18" r="13" fill="#FFFFFF" />
      {/* Outer circular arrow running counter-clockwise */}
      <path
        d="M9.5 11 C11.8 8 14.7 6.5 18 6.5 C24.4 6.5 29.5 11.6 29.5 18 C29.5 24.4 24.4 29.5 18 29.5 C11.6 29.5 6.5 24.4 6.5 18 C6.5 15.5 7.3 13.2 8.8 11.2"
        fill="none"
        stroke="url(#fbMemoriesGrad)"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      {/* Arrowhead pointing counter-clockwise / down-left at top-left */}
      <polygon points="4.5,12 11.5,14 8,6.5" fill="#00C2FF" />
      {/* Center Clock Hands on White Face */}
      <circle cx="18" cy="18" r="2.2" fill="#0866FF" />
      <path
        d="M18 10.5 L18 18 L23.5 16"
        fill="none"
        stroke="#0866FF"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Saved Icon: Bookmark ribbon with vibrant pink-to-purple-to-violet gradient (Full 22x32)
 */
export function SavedIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" style={{ display: 'block', flexShrink: 0 }}>
      <defs>
        <linearGradient id="fbSavedGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FA2E88" />
          <stop offset="25%" stopColor="#D946EF" />
          <stop offset="65%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#6D28D9" />
        </linearGradient>
      </defs>
      <path
        d="M7 6 C7 4 8.8 2.5 11 2.5 L25 2.5 C27.2 2.5 29 4 29 6 L29 33.5 C29 34.5 27.8 35.1 27 34.4 L18 27.5 L9 34.4 C8.2 35.1 7 34.5 7 33.5 Z"
        fill="url(#fbSavedGrad)"
      />
    </svg>
  );
}

/**
 * Groups Icon: Royal blue circle with 3 pure white layered figures (33x33)
 */
export function GroupsIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" style={{ display: 'block', flexShrink: 0 }}>
      <defs>
        <linearGradient id="fbGroupsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1B74E4" />
          <stop offset="100%" stopColor="#0866FF" />
        </linearGradient>
      </defs>
      <circle cx="18" cy="18" r="16.5" fill="url(#fbGroupsGrad)" />
      {/* Center Person (in front) */}
      <circle cx="18" cy="12.5" r="3.4" fill="#FFFFFF" />
      <path d="M12 26 C12 21 14.8 18.5 18 18.5 C21.2 18.5 24 21 24 26 Z" fill="#FFFFFF" />
      {/* Left Person (behind) */}
      <circle cx="10.5" cy="14.8" r="2.8" fill="#FFFFFF" />
      <path d="M5.5 26 C5.5 22.2 7.8 20.2 11 20.2 C11.8 21.6 13 23 14.5 24 L5.5 26 Z" fill="#FFFFFF" />
      {/* Right Person (behind) */}
      <circle cx="25.5" cy="14.8" r="2.8" fill="#FFFFFF" />
      <path d="M30.5 26 C30.5 22.2 28.2 20.2 25 20.2 C24.2 21.6 23 23 21.5 24 L30.5 26 Z" fill="#FFFFFF" />
    </svg>
  );
}

/**
 * Reels Icon: Coral-pink-orange clapper with separating slit and play button (30x30)
 */
export function ReelsIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" style={{ display: 'block', flexShrink: 0 }}>
      <defs>
        <linearGradient id="fbReelsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FD2B66" />
          <stop offset="60%" stopColor="#FC3850" />
          <stop offset="100%" stopColor="#FF5E3A" />
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="30" height="30" rx="7.5" fill="url(#fbReelsGrad)" />
      {/* Clapper Hinge Slit */}
      <line x1="3" y1="11" x2="33" y2="11" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.8" />
      {/* Clapper Diagonal Stripes on top lid */}
      <line x1="13" y1="3" x2="9" y2="11" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" />
      <line x1="23" y1="3" x2="19" y2="11" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" />
      {/* Centered Play Triangle */}
      <polygon points="15,15.5 15,26.5 24.5,21" fill="#FFFFFF" />
    </svg>
  );
}

/**
 * Marketplace Icon: 4-scallop curved striped awning storefront with arched doorway (32x28)
 */
export function MarketplaceIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" style={{ display: 'block', flexShrink: 0 }}>
      {/* Store Building Base */}
      <rect x="4" y="16" width="28" height="16" rx="2" fill="#0072F5" />
      {/* Arched Doorway in Center */}
      <path d="M13 32 L13 23 C13 20 23 20 23 23 L23 32 Z" fill="#FFFFFF" />
      {/* Awning Roof Curve */}
      <path
        d="M3 15 L6 6 C7 5 11 5 18 5 C25 5 29 5 30 6 L33 15 Z"
        fill="#0099FF"
      />
      {/* 4 Striped Awning Scallops */}
      <g>
        <path d="M3 15 C3 18 10 18 10 15 L9 6 L6 6 Z" fill="#00D2D3" />
        <path d="M10 15 C10 18 18 18 18 15 L18 5 L11 5 Z" fill="#0072F5" />
        <path d="M18 15 C18 18 26 18 26 15 L25 5 L18 5 Z" fill="#00D2D3" />
        <path d="M26 15 C26 18 33 18 33 15 L30 6 L27 6 Z" fill="#0072F5" />
      </g>
    </svg>
  );
}

/**
 * Feeds Icon: Mini Feed Post card with white header, blue image, and clock badge (32x30)
 */
export function FeedsIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" style={{ display: 'block', flexShrink: 0 }}>
      {/* Post Card Outline */}
      <rect x="3" y="3.5" width="30" height="29" rx="5" fill="#FFFFFF" stroke="#1877F2" strokeWidth="2" />
      {/* Header Profile Square */}
      <rect x="6.5" y="7" width="6" height="6" rx="1.5" fill="#1877F2" />
      {/* Header Text Lines */}
      <line x1="15" y1="8" x2="27" y2="8" stroke="#1877F2" strokeWidth="2" strokeLinecap="round" />
      <line x1="15" y1="12" x2="23" y2="12" stroke="#1877F2" strokeWidth="1.6" strokeLinecap="round" />
      {/* Feed Post Content / Photo Box */}
      <rect x="5.5" y="16" width="25" height="14.5" rx="2" fill="#1877F2" />
      {/* Circular Clock Badge at Bottom-Right */}
      <circle cx="26" cy="26" r="6" fill="#FFFFFF" stroke="#1877F2" strokeWidth="2" />
      <path d="M26 23 L26 26 L28.5 26" stroke="#1877F2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Events Icon: Calendar with red header, silver loops, and sharp centered star (30x30)
 */
export function EventsIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" style={{ display: 'block', flexShrink: 0 }}>
      {/* Calendar White Sheet */}
      <rect x="3" y="5" width="30" height="28" rx="4" fill="#FFFFFF" stroke="#CED0D4" strokeWidth="1" />
      {/* Top Red Header Bar */}
      <path d="M3 9 C3 6.8 4.8 5 7 5 L29 5 C31.2 5 33 6.8 33 9 L33 13 L3 13 Z" fill="#FA383E" />
      {/* Two Silver Spiral Binding Rings */}
      <rect x="8.5" y="2.5" width="3" height="5" rx="1.5" fill="#8D949E" />
      <rect x="24.5" y="2.5" width="3" height="5" rx="1.5" fill="#8D949E" />
      {/* Centered 5-Point Gray Star */}
      <polygon
        points="18,17.5 19.8,21.5 24.2,21.8 20.8,24.5 21.8,28.8 18,26.2 14.2,28.8 15.2,24.5 11.8,21.8 16.2,21.5"
        fill="#606770"
      />
    </svg>
  );
}

/**
 * Ads Manager Icon: 3 ascending vertical pill bars with cyan-to-blue gradient (30x30)
 */
export function AdsManagerIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" style={{ display: 'block', flexShrink: 0 }}>
      <defs>
        <linearGradient id="fbAdsGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#00D2FF" />
          <stop offset="100%" stopColor="#0064E0" />
        </linearGradient>
      </defs>
      <rect x="3" y="21" width="7.5" height="12" rx="3.75" fill="url(#fbAdsGrad)" />
      <rect x="14.25" y="11" width="7.5" height="22" rx="3.75" fill="url(#fbAdsGrad)" />
      <rect x="25.5" y="3" width="7.5" height="30" rx="3.75" fill="url(#fbAdsGrad)" />
    </svg>
  );
}

/**
 * Play Games Icon: Console gamepad controller in cyan-to-blue with colored buttons (34x26)
 */
export function PlayGamesIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" style={{ display: 'block', flexShrink: 0 }}>
      <defs>
        <linearGradient id="fbGameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00C6FF" />
          <stop offset="100%" stopColor="#0072FF" />
        </linearGradient>
      </defs>
      {/* Gamepad Body */}
      <path
        d="M6 10 C12 6.5 24 6.5 30 10 C35 13 36 22 33 27 C30 31.5 26.5 28.5 24 24 L21 20.5 L15 20.5 L12 24 C9.5 28.5 6 31.5 3 27 C0 22 1 13 6 10 Z"
        fill="url(#fbGameGrad)"
      />
      {/* Left White D-Pad */}
      <rect x="8" y="15" width="5.5" height="2" rx="0.5" fill="#FFFFFF" />
      <rect x="9.75" y="13.25" width="2" height="5.5" rx="0.5" fill="#FFFFFF" />
      {/* Right Diamond Action Buttons */}
      <circle cx="25.5" cy="13.5" r="1.3" fill="#FFD700" />
      <circle cx="28" cy="16" r="1.3" fill="#FF3B30" />
      <circle cx="25.5" cy="18.5" r="1.3" fill="#34C759" />
      <circle cx="23" cy="16" r="1.3" fill="#007AFF" />
    </svg>
  );
}

/**
 * See More Icon: 36px gray circle with clean centered down chevron
 */
export function SeeMoreIcon({ isExpanded = false }) {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" style={{ display: 'block', flexShrink: 0 }}>
      <circle cx="18" cy="18" r="17.5" fill="#E4E6EB" />
      {isExpanded ? (
        <path
          d="M12 20.5 L18 14.5 L24 20.5"
          fill="none"
          stroke="#050505"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M12 15.5 L18 21.5 L24 15.5"
          fill="none"
          stroke="#050505"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

/**
 * Facebook Live Video Camera Icon (Composer)
 */
export function FacebookLiveVideoIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block', flexShrink: 0 }}>
      <rect x="2" y="4.5" width="14" height="15" rx="3.5" fill="#F02849" />
      <path d="M16 9.5 L21.2 6 C21.7 5.6 22 5.9 22 6.6 L22 17.4 C22 18.1 21.7 18.4 21.2 18 L16 14.5 Z" fill="#F02849" />
      <circle cx="9" cy="12" r="3.2" fill="#FFFFFF" />
      <circle cx="9" cy="12" r="1.6" fill="#F02849" />
    </svg>
  );
}

/**
 * Facebook Photo/Video Landscape Icon (Composer)
 */
export function FacebookPhotoVideoIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block', flexShrink: 0 }}>
      <rect x="2" y="3.5" width="20" height="17" rx="3.5" fill="#45BD62" />
      <circle cx="7.5" cy="8.5" r="2.2" fill="#FFFFFF" />
      <path d="M3.5 17.5 L8.5 11.5 L12 15.5 L15 12.5 L20.5 17.5 Z" fill="#FFFFFF" />
    </svg>
  );
}

/**
 * Facebook Feeling/Activity Smiley Face Icon (Composer)
 */
export function FacebookFeelingSmileyIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block', flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10.5" fill="#F7B125" />
      <ellipse cx="8.5" cy="9.5" rx="1.4" ry="1.9" fill="#594000" />
      <ellipse cx="15.5" cy="9.5" rx="1.4" ry="1.9" fill="#594000" />
      <path
        d="M7 13 C7 17.2 9.2 19 12 19 C14.8 19 17 17.2 17 13 Z"
        fill="#594000"
      />
      <path
        d="M8 13.5 C9.2 14.8 10.5 15.2 12 15.2 C13.5 15.2 14.8 14.8 16 13.5 Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

/**
 * Facebook Navbar Center Tab Icons (Pixel-perfect SVG vectors - 100% crisp at any resolution)
 */
export function FacebookNavbarHomeIcon({ active = false, size = 28 }) {
  if (active) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 28 28"
        fill="#0866FF"
        style={{ display: 'block' }}
      >
        <path d="M25.825 12.29C25.824 12.289 25.823 12.288 25.821 12.286L15.027 2.937C14.752 2.675 14.392 2.527 13.989 2.521C13.608 2.527 13.248 2.675 13.001 2.912L2.175 12.29C1.756 12.658 1.629 13.245 1.868 13.759C2.079 14.215 2.567 14.479 3.069 14.479L5 14.479L5 23.729C5 24.695 5.784 25.479 6.75 25.479L11 25.479C11.552 25.479 12 25.031 12 24.479L12 18.309C12 18.126 12.148 17.979 12.33 17.979L15.67 17.979C15.852 17.979 16 18.126 16 18.309L16 24.479C16 25.031 16.448 25.479 17 25.479L21.25 25.479C22.217 25.479 23 24.695 23 23.729L23 14.479L24.931 14.479C25.433 14.479 25.921 14.215 26.132 13.759C26.371 13.245 26.244 12.658 25.825 12.29" />
      </svg>
    );
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      stroke="#65676B"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'block' }}
    >
      <path d="M3 13 L14 3 L25 13" />
      <path d="M5.5 11.5 V24.5 a1 1 0 0 0 1 1 h4.5 v-6 a2 2 0 0 1 4 0 v6 h4.5 a1 1 0 0 0 1-1 V11.5" />
    </svg>
  );
}

export function FacebookNavbarVideoIcon({ active = false, size = 28 }) {
  const color = active ? '#0866FF' : '#65676B';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      style={{ display: 'block' }}
    >
      {/* Outer rounded monitor frame */}
      <rect
        x="3"
        y="4"
        width="22"
        height="20"
        rx="4.5"
        stroke={color}
        strokeWidth="2.2"
        fill={active ? '#0866FF15' : 'none'}
      />
      {/* Clapperboard line */}
      <line x1="3" y1="9.5" x2="25" y2="9.5" stroke={color} strokeWidth="2" />
      {/* 3 top clapperboard diagonal slats */}
      <line x1="7.5" y1="4" x2="9.5" y2="9.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="13" y1="4" x2="15" y2="9.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="18.5" y1="4" x2="20.5" y2="9.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
      {/* Play button triangle */}
      <path d="M12 13 L17.5 16.5 L12 20 Z" fill={color} stroke="none" />
    </svg>
  );
}

export function FacebookNavbarGroupsIcon({ active = false, size = 28 }) {
  const color = active ? '#0866FF' : '#65676B';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'block' }}
    >
      {/* Foreground person (left) */}
      <circle cx="10" cy="8.5" r="4.2" strokeWidth="2.2" fill={active ? color : 'none'} />
      <path
        d="M3.2 24.5 c0-4.6 3.6-7.5 7.3-7.5 s7.3 2.9 7.3 7.5"
        strokeWidth="2.2"
        fill={active ? color : 'none'}
      />
      {/* Background person (right) */}
      <circle cx="18.8" cy="6.8" r="3.6" strokeWidth="2" fill={active ? color : 'none'} />
      <path
        d="M16.8 15 c1.4-.7 3-1 4.5 0 c2.4 1.4 3.5 4 3.5 9.5"
        strokeWidth="2"
      />
    </svg>
  );
}

export function FacebookNavbarGamingIcon({ active = false, size = 28 }) {
  const color = active ? '#0866FF' : '#65676B';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'block' }}
    >
      <circle cx="14" cy="14" r="11" strokeWidth="2.2" />
      <circle cx="14" cy="10.5" r="3.5" strokeWidth="2.2" fill={active ? color : 'none'} />
      <path d="M7.8 21.5 c0-3.5 2.8-6 6.2-6 s6.2 2.5 6.2 6" strokeWidth="2.2" fill={active ? color : 'none'} />
    </svg>
  );
}

/**
 * Facebook Header Right Action Icons (Menu, Messenger, Notifications)
 */
export function FacebookMenuGridIcon({ size = 22, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ display: 'block' }}>
      <circle cx="5" cy="5" r="2.2" />
      <circle cx="12" cy="5" r="2.2" />
      <circle cx="19" cy="5" r="2.2" />
      <circle cx="5" cy="12" r="2.2" />
      <circle cx="12" cy="12" r="2.2" />
      <circle cx="19" cy="12" r="2.2" />
      <circle cx="5" cy="19" r="2.2" />
      <circle cx="12" cy="19" r="2.2" />
      <circle cx="19" cy="19" r="2.2" />
    </svg>
  );
}

export function FacebookMessengerIcon({ size = 22, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ display: 'block' }}>
      <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.91 1.455 5.513 3.735 7.185V22l3.418-1.875c.91.252 1.875.39 2.847.39 5.523 0 10-4.145 10-9.257C22 6.145 17.523 2 12 2zm1.066 12.443l-2.584-2.756-5.043 2.756 5.547-5.89 2.65 2.756 4.977-2.756-5.547 5.89z" />
    </svg>
  );
}

export function FacebookBellIcon({ size = 22, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ display: 'block' }}>
      {/* Official Facebook Notification Bell without top loop (Exact match to screenshot) */}
      <path d="M12 2.6C7.2 2.6 4.5 6.5 4.5 12.2c0 2.2-.6 3.6-1.5 4.7-.4.5-.1 1.1.5 1.1h17c.6 0 .9-.6.5-1.1-.9-1.1-1.5-2.5-1.5-4.7 0-5.7-2.7-9.6-7-9.6z" />
      <path d="M9.8 20.2c.5 1.4 1.3 2 2.2 2s1.7-.6 2.2-2H9.8z" />
    </svg>
  );
}
