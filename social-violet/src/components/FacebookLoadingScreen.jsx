import React from 'react';
import { FacebookOfficialLogo } from './FacebookSidebarIcons';
import metaLogoFrom from '../assets/facebook-meta-logo.png';
import metaLogoHorizontal from '../assets/facebook-meta-logo.png';

/**
 * ============================================================================
 * FACEBOOK LOADING / SPLASH SCREEN
 * ============================================================================
 * You can customize the image addresses (URLs or local paths) below:
 *
 * 1. CENTER_FACEBOOK_LOGO_URL:
 *    - Set to an image URL (e.g. "https://example.com/logo.png" or "/my-logo.png")
 *    - Or leave as null to use the official vector Facebook round blue logo
 *
 * 2. BOTTOM_META_LOGO_URL:
 *    - Set to an image URL or one of the imported assets (metaLogoFrom, metaLogoHorizontal)
 *    - Set to null to use the official vector Meta branding
 * ============================================================================
 */
const CENTER_FACEBOOK_LOGO_URL = null; // <-- Paste your center logo URL/path here if you want to replace it!
const BOTTOM_META_LOGO_URL = metaLogoFrom; // <-- Real official Meta logo (or paste your own image URL/path)

export default function FacebookLoadingScreen() {
  return (
    <div className="fb-initial-loading-screen">
      {/* 1. Center Facebook Logo */}
      <div className="fb-loading-center">
        {CENTER_FACEBOOK_LOGO_URL ? (
          <img
            src={CENTER_FACEBOOK_LOGO_URL}
            alt="Facebook"
            className="fb-loading-logo"
            style={{ width: '76px', height: '76px', objectFit: 'contain' }}
          />
        ) : (
          <FacebookOfficialLogo size={76} />
        )}
      </div>

      {/* 2. Bottom Meta Branding */}
      <div className="fb-loading-footer">
        {BOTTOM_META_LOGO_URL ? (
          <img
            src={BOTTOM_META_LOGO_URL}
            alt="from Meta"
            className="fb-loading-meta"
            style={{ height: '36px', width: 'auto', objectFit: 'contain' }}
          />
        ) : (
          <>
            <span className="fb-loading-from">from</span>
            <div
              className="fb-loading-meta-brand"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginTop: '2px',
              }}
            >
              <img
                src={metaLogoHorizontal}
                alt="Meta"
                style={{ height: '18px', width: 'auto' }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
