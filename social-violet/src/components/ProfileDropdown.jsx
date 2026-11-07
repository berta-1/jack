import React, { useState } from 'react';
import {
  Moon,
  Sun,
  Settings,
  HelpCircle,
  LogOut,
  AlertCircle,
  ChevronRight,
  ArrowLeft,
  Users,
  Check,
  Shield,
  FileText,
  Lock,
  Edit3,
  Camera,
  Upload,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import FacebookAvatar from './FacebookAvatar';

export default function ProfileDropdown({ onClose }) {
  const { darkMode, toggleDarkMode } = useTheme();
  const { currentUser, recentAccounts, switchAccount, logout, updateCurrentUser } = useAuth();
  const [view, setView] = useState('main'); // 'main' | 'profiles' | 'display' | 'settings' | 'edit_profile'
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editAvatar, setEditAvatar] = useState(currentUser?.avatar || '');
  const [editBio, setEditBio] = useState(currentUser?.bio || '');

  return (
    <div className="fb-profile-dropdown-card">
      {/* View: Main Profile Menu (Exact match to Facebook screenshot) */}
      {view === 'main' && (
        <>
          {/* User Profile Card Box */}
          <div className="fb-profile-top-card">
            <div
              className="fb-profile-user-row"
              onClick={() => {
                alert(`Viewing profile for ${currentUser?.name}`);
                onClose();
              }}
            >
              <div className="fb-profile-avatar-wrap">
                {currentUser?.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <FacebookAvatar size={40} />
                )}
              </div>
              <div className="fb-profile-name">{currentUser?.name || 'Berta Hule'}</div>
            </div>

            <div className="fb-profile-divider" />

            <button
              className="fb-see-profiles-btn"
              onClick={() => setView('profiles')}
            >
              <Users size={16} />
              <span>See all profiles</span>
            </button>

            <button
              className="fb-see-profiles-btn"
              onClick={() => {
                setEditName(currentUser?.name || '');
                setEditAvatar(currentUser?.avatar || '');
                setEditBio(currentUser?.bio || '');
                setView('edit_profile');
              }}
              style={{ marginTop: '6px' }}
            >
              <Edit3 size={15} />
              <span>Edit profile name & photo</span>
            </button>
          </div>

          {/* Menu Items List */}
          <div className="fb-profile-menu-list">
            {/* 1. Settings & privacy */}
            <div
              className="fb-profile-menu-item"
              onClick={() => setView('settings')}
            >
              <div className="fb-menu-icon-circle">
                <Settings size={20} />
              </div>
              <div className="fb-menu-text-wrap">
                <span className="fb-menu-title">Settings & privacy</span>
              </div>
              <ChevronRight size={20} className="fb-menu-chevron" />
            </div>

            {/* 2. Help & support */}
            <div
              className="fb-profile-menu-item"
              onClick={() => {
                alert('Facebook Help & Support Center');
                onClose();
              }}
            >
              <div className="fb-menu-icon-circle">
                <HelpCircle size={20} />
              </div>
              <div className="fb-menu-text-wrap">
                <span className="fb-menu-title">Help & support</span>
              </div>
              <ChevronRight size={20} className="fb-menu-chevron" />
            </div>

            {/* 3. Report a problem */}
            <div
              className="fb-profile-menu-item"
              onClick={() => {
                alert('Report a problem form');
                onClose();
              }}
            >
              <div className="fb-menu-icon-circle">
                <AlertCircle size={20} />
              </div>
              <div className="fb-menu-text-wrap">
                <span className="fb-menu-title">Report a problem</span>
                <span className="fb-menu-subtitle">CTRL B</span>
              </div>
            </div>

            {/* 4. Display & accessibility */}
            <div
              className="fb-profile-menu-item"
              onClick={() => setView('display')}
            >
              <div className="fb-menu-icon-circle">
                <Moon size={20} />
              </div>
              <div className="fb-menu-text-wrap">
                <span className="fb-menu-title">Display & accessibility</span>
              </div>
              <ChevronRight size={20} className="fb-menu-chevron" />
            </div>

            {/* 5. Log out */}
            <div
              className="fb-profile-menu-item"
              onClick={() => {
                onClose();
                logout();
              }}
            >
              <div className="fb-menu-icon-circle">
                <LogOut size={20} />
              </div>
              <div className="fb-menu-text-wrap">
                <span className="fb-menu-title">Log out</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          <div className="fb-profile-footer">
            <div className="fb-profile-footer-links">
              <span>Privacy</span> · <span>Terms</span> · <span>Advertising</span> · <span>Ad Choices</span> · <span>Cookies</span> · <span>More</span>
            </div>
            <div className="fb-profile-meta-text">Meta © 2026</div>
          </div>
        </>
      )}

      {/* Subview: See all profiles / Switch Account */}
      {view === 'profiles' && (
        <div className="fb-subview">
          <div className="fb-subview-header">
            <button className="fb-subview-back-btn" onClick={() => setView('main')}>
              <ArrowLeft size={20} />
            </button>
            <span className="fb-subview-title">Profiles</span>
          </div>

          <div style={{ padding: '8px 12px' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Switch into another profile to manage posts and messages:
            </p>

            {(recentAccounts || []).map((account) => {
              const isSelected = account.name === currentUser?.name;
              return (
                <div
                  key={account.id}
                  className={`fb-profile-menu-item ${isSelected ? 'active-profile' : ''}`}
                  onClick={() => {
                    switchAccount(account);
                    onClose();
                  }}
                  style={{ borderRadius: '8px', padding: '8px 10px', marginBottom: '4px' }}
                >
                  <div className="fb-profile-avatar-wrap">
                    <FacebookAvatar size={36} />
                  </div>
                  <div className="fb-menu-text-wrap" style={{ flex: 1 }}>
                    <span className="fb-menu-title">{account.name}</span>
                    <span className="fb-menu-subtitle">{account.email}</span>
                  </div>
                  {isSelected && <Check size={18} color="var(--color-primary)" strokeWidth={2.5} />}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Subview: Display & accessibility (Dark Mode) */}
      {view === 'display' && (
        <div className="fb-subview">
          <div className="fb-subview-header">
            <button className="fb-subview-back-btn" onClick={() => setView('main')}>
              <ArrowLeft size={20} />
            </button>
            <span className="fb-subview-title">Display & accessibility</span>
          </div>

          <div style={{ padding: '12px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
              <div className="fb-menu-icon-circle">
                <Moon size={20} />
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Dark Mode
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.4 }}>
                  Adjust the appearance of Facebook to reduce glare and give your eyes a break.
                </div>
              </div>
            </div>

            {/* Radio: Off */}
            <label
              className="fb-radio-item"
              onClick={() => {
                if (darkMode) toggleDarkMode();
              }}
            >
              <span>Off</span>
              <input
                type="radio"
                name="darkModeRadio"
                checked={!darkMode}
                onChange={() => {
                  if (darkMode) toggleDarkMode();
                }}
              />
            </label>

            {/* Radio: On */}
            <label
              className="fb-radio-item"
              onClick={() => {
                if (!darkMode) toggleDarkMode();
              }}
            >
              <span>On</span>
              <input
                type="radio"
                name="darkModeRadio"
                checked={darkMode}
                onChange={() => {
                  if (!darkMode) toggleDarkMode();
                }}
              />
            </label>
          </div>
        </div>
      )}

      {/* Subview: Settings & privacy */}
      {view === 'settings' && (
        <div className="fb-subview">
          <div className="fb-subview-header">
            <button className="fb-subview-back-btn" onClick={() => setView('main')}>
              <ArrowLeft size={20} />
            </button>
            <span className="fb-subview-title">Settings & privacy</span>
          </div>

          <div style={{ padding: '8px 12px' }}>
            <div className="fb-profile-menu-item" onClick={() => alert('Settings')}>
              <div className="fb-menu-icon-circle"><Settings size={18} /></div>
              <div className="fb-menu-text-wrap"><span className="fb-menu-title">Settings</span></div>
            </div>
            <div className="fb-profile-menu-item" onClick={() => alert('Privacy Checkup')}>
              <div className="fb-menu-icon-circle"><Shield size={18} /></div>
              <div className="fb-menu-text-wrap"><span className="fb-menu-title">Privacy Checkup</span></div>
            </div>
            <div className="fb-profile-menu-item" onClick={() => alert('Privacy Centre')}>
              <div className="fb-menu-icon-circle"><Lock size={18} /></div>
              <div className="fb-menu-text-wrap"><span className="fb-menu-title">Privacy Centre</span></div>
            </div>
            <div className="fb-profile-menu-item" onClick={() => alert('Activity log')}>
              <div className="fb-menu-icon-circle"><FileText size={18} /></div>
              <div className="fb-menu-text-wrap"><span className="fb-menu-title">Activity log</span></div>
            </div>
          </div>
        </div>
      )}

      {/* Subview: Edit Profile Name & Photo */}
      {view === 'edit_profile' && (
        <div className="fb-subview">
          <div className="fb-subview-header">
            <button className="fb-subview-back-btn" onClick={() => setView('main')}>
              <ArrowLeft size={20} />
            </button>
            <span className="fb-subview-title">Edit Profile</span>
          </div>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!editName.trim()) return;
              const updates = {
                name: editName.trim(),
                shortName: editName.trim().split(' ')[0],
                avatar: editAvatar.trim(),
                bio: editBio.trim(),
              };
              if (updateCurrentUser) updateCurrentUser(updates);
              if (currentUser?.id) {
                try {
                  await api.admin.updateUser(currentUser.id, updates);
                } catch {}
              }
              alert('Profile updated successfully!');
              setView('main');
            }}
            style={{ padding: '16px' }}
          >
            {/* Avatar Preview & Upload */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ position: 'relative' }}>
                <img
                  src={editAvatar || currentUser?.avatar}
                  alt="Profile"
                  style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #0866FF' }}
                />
                <label
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    background: '#0866FF',
                    color: '#FFF',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #FFF',
                    cursor: 'pointer',
                  }}
                  title="Upload image from device"
                >
                  <Camera size={13} />
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (uploadEvt) => setEditAvatar(uploadEvt.target.result);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
              <span style={{ fontSize: '11.5px', color: '#65676B', marginTop: '6px' }}>Click camera icon to upload photo</span>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#65676B', marginBottom: '4px' }}>
                Full Name
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CED0D4', fontSize: '14px', outline: 'none' }}
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#65676B', marginBottom: '4px' }}>
                Profile Image URL
              </label>
              <input
                type="text"
                value={editAvatar}
                onChange={(e) => setEditAvatar(e.target.value)}
                placeholder="https://... image link"
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CED0D4', fontSize: '14px', outline: 'none' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#65676B', marginBottom: '4px' }}>
                Bio / Headline
              </label>
              <input
                type="text"
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                placeholder="Brief description"
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CED0D4', fontSize: '14px', outline: 'none' }}
              />
            </div>

            <button
              type="submit"
              className="fb-admin-btn-primary"
              style={{ width: '100%', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <Check size={16} />
              <span>Save Changes</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
