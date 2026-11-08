import React, { useState } from 'react';
import {
  X,
  Globe,
  Users,
  Lock,
  Image,
  Video,
  Upload,
  UserPlus,
  Smile,
  MapPin,
  Sparkles,
  Link,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function CreatePostModal({ isOpen, onClose, onSubmitPost, initialType }) {
  if (!isOpen) return null;

  const { currentUser } = useAuth();
  const [content, setContent] = useState('');
  const [privacy, setPrivacy] = useState('public');
  const [selectedBgColor, setSelectedBgColor] = useState(null);
  const [imageUrl, setImageUrl] = useState(
    initialType === 'photo'
      ? 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80'
      : ''
  );
  const [videoUrl, setVideoUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(initialType === 'photo');

  const bgColors = [
    { label: 'None', val: null },
    { label: 'Crimson Red', val: '#D71444' },
    { label: 'Facebook Blue', val: '#1877F2' },
    { label: 'Purple Violet', val: '#9333EA' },
    { label: 'Sunset Fire', val: 'linear-gradient(45deg, #FF512F, #DD2476)' },
    { label: 'Deep Ocean', val: 'linear-gradient(45deg, #00B4DB, #0083B0)' },
  ];

  const presetImages = [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
  ];

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      setImageUrl(evt.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      setVideoUrl(evt.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim() && !imageUrl && !videoUrl) return;

    const mediaList = [];
    if (videoUrl) {
      mediaList.push({ type: 'video', url: videoUrl, poster: imageUrl || '' });
    } else if (imageUrl && !selectedBgColor) {
      mediaList.push({ type: 'image', url: imageUrl });
    }

    const newPost = {
      id: 'post-' + Date.now(),
      author: {
        name: currentUser?.name || 'Deng Garang Ajou',
        avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
        verified: true,
      },
      timestamp: 'Just now',
      privacy,
      content: selectedBgColor ? '' : content.trim(),
      backgroundCard: selectedBgColor
        ? { color: selectedBgColor, text: content.trim() }
        : null,
      videoUrl: videoUrl || null,
      media: mediaList,
      stats: {
        likes: 1,
        comments: 0,
        shares: 0,
        reactionBreakdown: { like: 1 },
      },
      userReaction: 'like',
      comments: [],
    };

    onSubmitPost(newPost);
    setContent('');
    setImageUrl('');
    setVideoUrl('');
    setSelectedBgColor(null);
    setShowImageInput(false);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title">Create post</div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="modal-body">
          {/* User Row with Privacy Selector */}
          <div className="modal-user-row">
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="chat-avatar-mini"
              style={{ width: '42px', height: '42px' }}
            />
            <div>
              <div style={{ fontSize: '15px', fontWeight: 600 }}>{currentUser?.name}</div>
              <div
                className="privacy-selector"
                onClick={() => {
                  setPrivacy((p) =>
                    p === 'public' ? 'friends' : p === 'friends' ? 'only_me' : 'public'
                  );
                }}
              >
                {privacy === 'public' && <><Globe size={12} /><span>Public ▾</span></>}
                {privacy === 'friends' && <><Users size={12} /><span>Friends ▾</span></>}
                {privacy === 'only_me' && <><Lock size={12} /><span>Only me ▾</span></>}
              </div>
            </div>
          </div>

          {/* Text Area (Adapts to colored background status if selected) */}
          <div
            style={{
              background: selectedBgColor || 'transparent',
              borderRadius: selectedBgColor ? '8px' : '0',
              padding: selectedBgColor ? '24px 16px' : '0',
              minHeight: selectedBgColor ? '180px' : 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '12px',
            }}
          >
            <textarea
              className="modal-textarea"
              style={{
                color: selectedBgColor ? '#ffffff' : 'var(--text-primary)',
                fontSize: selectedBgColor ? '24px' : '18px',
                fontWeight: selectedBgColor ? 800 : 400,
                textAlign: selectedBgColor ? 'center' : 'left',
                minHeight: selectedBgColor ? '120px' : '100px',
              }}
              placeholder={`What's on your mind, ${currentUser?.name?.trim().split(/\s+/)[0] || currentUser?.shortName || 'Deng'}?`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              autoFocus
            />
          </div>

          {/* Facebook Color Background Picker Squares */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>Background:</span>
            {bgColors.map((bg, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setSelectedBgColor(bg.val);
                  if (bg.val) setImageUrl('');
                }}
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '5px',
                  background: bg.val || 'var(--bg-input)',
                  border: selectedBgColor === bg.val ? '2px solid var(--color-primary)' : '1px solid var(--border-light)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  color: bg.val ? '#fff' : 'inherit',
                }}
                title={bg.label}
              >
                {!bg.val && '✕'}
              </button>
            ))}
          </div>

          {/* Media Attach Section (Photo / Video) */}
          {showImageInput && (
            <div
              style={{
                border: '1px solid var(--border-subtle, #CED0D4)',
                borderRadius: '8px',
                padding: '10px',
                margin: '8px 0',
                backgroundColor: 'var(--bg-card-hover, #F0F2F5)',
              }}
            >
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <label
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '7px 10px',
                    borderRadius: '6px',
                    background: '#2bbf5a',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <Upload size={14} />
                  <span>Upload Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handlePhotoUpload}
                  />
                </label>

                <label
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '7px 10px',
                    borderRadius: '6px',
                    background: '#0866FF',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <Video size={14} />
                  <span>Upload Video</span>
                  <input
                    type="file"
                    accept="video/*"
                    style={{ display: 'none' }}
                    onChange={handleVideoUpload}
                  />
                </label>
              </div>

              {/* Photo or Video URL Input */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'var(--bg-input, #FFFFFF)',
                  borderRadius: '8px',
                  padding: '6px 10px',
                }}
              >
                <Link size={16} color="var(--text-secondary)" />
                <input
                  type="text"
                  placeholder="Paste image/video URL (e.g. https://...)"
                  value={videoUrl || imageUrl}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val.endsWith('.mp4') || val.includes('video')) {
                      setVideoUrl(val);
                    } else {
                      setImageUrl(val);
                    }
                  }}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    width: '100%',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                  }}
                />
              </div>

              {/* Sample preset photo choices */}
              <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                {presetImages.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt="Preset"
                    onClick={() => {
                      setImageUrl(img);
                      setVideoUrl('');
                    }}
                    style={{
                      width: '48px',
                      height: '36px',
                      borderRadius: '4px',
                      objectFit: 'cover',
                      cursor: 'pointer',
                      border: imageUrl === img ? '2px solid var(--color-primary)' : '1px solid transparent',
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Attached Video Preview */}
          {videoUrl && (
            <div
              className="modal-media-preview"
              style={{ background: '#000', borderRadius: '8px', overflow: 'hidden', position: 'relative', margin: '8px 0' }}
            >
              <video
                src={videoUrl}
                poster={imageUrl}
                controls
                style={{ width: '100%', maxHeight: '280px', display: 'block' }}
              />
              <button
                type="button"
                className="remove-preview-btn"
                onClick={() => setVideoUrl('')}
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Attached Image Preview */}
          {imageUrl && !videoUrl && (
            <div className="modal-media-preview">
              <img src={imageUrl} alt="Preview" />
              <button
                type="button"
                className="remove-preview-btn"
                onClick={() => setImageUrl('')}
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Add to Your Post Toolbar */}
          <div className="add-to-post-bar">
            <span className="add-to-post-text">Add to your post</span>
            <div className="add-post-tools">
              <button
                type="button"
                className="tool-icon-btn"
                title="Photo/video"
                onClick={() => setShowImageInput((prev) => !prev)}
              >
                <Image size={22} color="#2bbf5a" />
              </button>
              <button
                type="button"
                className="tool-icon-btn"
                title="Tag people"
                onClick={() => alert('Tag friends feature')}
              >
                <UserPlus size={22} color="var(--color-primary)" />
              </button>
              <button
                type="button"
                className="tool-icon-btn"
                title="Feeling/activity"
                onClick={() => setContent((prev) => prev + ' feeling energized ⚡')}
              >
                <Smile size={22} color="#f59e0b" />
              </button>
              <button
                type="button"
                className="tool-icon-btn"
                title="Check in"
                onClick={() => setContent((prev) => prev + ' 📍 San Francisco, CA')}
              >
                <MapPin size={22} color="#f43f5e" />
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn-submit-post"
            disabled={!content.trim() && !imageUrl && !videoUrl}
          >
            Post
          </button>
        </form>
      </div>
    </div>
  );
}

