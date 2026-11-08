import React, { useState } from 'react';
import { X, Upload, Video, Image as ImageIcon, Sparkles, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function CreateStoryModal({ isOpen, onClose, onPublishStory }) {
  const { currentUser } = useAuth();

  const [authorName, setAuthorName] = useState(currentUser?.name || 'Deng Garang Ajou');
  const [authorAvatar, setAuthorAvatar] = useState(currentUser?.avatar || '');
  const [videoUrl, setVideoUrl] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Keep author synced if currentUser changes
  React.useEffect(() => {
    if (currentUser?.name && !authorName) setAuthorName(currentUser.name);
    if (currentUser?.avatar && !authorAvatar) setAuthorAvatar(currentUser.avatar);
  }, [currentUser]);

  if (!isOpen) return null;

  const handleVideoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      setVideoUrl(evt.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handlePosterUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      setPosterUrl(evt.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      setAuthorAvatar(evt.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!videoUrl && !posterUrl) {
      alert('Please upload a story video or cover image.');
      return;
    }

    setIsLoading(true);

    const newStory = {
      id: `story-${Date.now()}`,
      userName: authorName.trim() || currentUser?.name || 'Story Creator',
      userAvatar: authorAvatar || currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      mediaUrl: posterUrl || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
      mediaType: videoUrl ? 'video' : 'image',
      videoUrl: videoUrl || null,
      caption: caption.trim(),
      timestamp: 'Just now',
      unseen: true,
    };

    onPublishStory(newStory);
    setIsLoading(false);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1200 }}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '620px', width: '100%', borderRadius: '12px', overflow: 'hidden' }}
      >
        {/* Header */}
        <div className="modal-header" style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-subtle, #E4E6EB)' }}>
          <div className="modal-title" style={{ fontSize: '18px', fontWeight: 700 }}>
            Create Story / Upload Story Video
          </div>
          <button className="modal-close-btn" onClick={onClose} type="button">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '18px' }}>
          {/* Author Row */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ position: 'relative' }}>
              <img
                src={authorAvatar || currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'}
                alt="Avatar"
                style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #0866FF' }}
              />
              <label
                title="Change avatar"
                style={{
                  position: 'absolute',
                  bottom: -2,
                  right: -2,
                  background: '#0866FF',
                  color: '#fff',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '10px',
                }}
              >
                +
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarUpload} />
              </label>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '11px', color: '#65676B', fontWeight: 600, display: 'block', marginBottom: '2px' }}>
                Story Author / Username
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Author Name"
                style={{
                  width: '100%',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: '1px solid #CED0D4',
                  fontSize: '14px',
                  fontWeight: 600,
                }}
              />
            </div>
          </div>

          {/* Upload Story Video Section */}
          <div style={{ marginBottom: '14px', padding: '12px', background: '#F7F8FA', borderRadius: '8px', border: '1px solid #E4E6EB' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 700, color: '#050505', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Video size={16} color="#0866FF" /> Story Video (MP4 / WebM)
              </label>
              <label
                style={{
                  background: '#0866FF',
                  color: '#FFFFFF',
                  padding: '5px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Upload size={13} />
                <span>Upload Video File</span>
                <input type="file" accept="video/*" style={{ display: 'none' }} onChange={handleVideoUpload} />
              </label>
            </div>
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Or paste video URL (e.g. https://...mp4)"
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: '6px',
                border: '1px solid #CED0D4',
                fontSize: '13px',
              }}
            />
          </div>

          {/* Upload Cover Poster Section */}
          <div style={{ marginBottom: '14px', padding: '12px', background: '#F7F8FA', borderRadius: '8px', border: '1px solid #E4E6EB' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 700, color: '#050505', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ImageIcon size={16} color="#2bbf5a" /> Story Cover Poster / Thumbnail
              </label>
              <label
                style={{
                  background: '#E4E6EB',
                  color: '#050505',
                  padding: '5px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Upload size={13} />
                <span>Upload Poster File</span>
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePosterUpload} />
              </label>
            </div>
            <input
              type="text"
              value={posterUrl}
              onChange={(e) => setPosterUrl(e.target.value)}
              placeholder="Or paste poster image URL (e.g. https://...jpg)"
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: '6px',
                border: '1px solid #CED0D4',
                fontSize: '13px',
              }}
            />
          </div>

          {/* Story Caption */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#65676B', display: 'block', marginBottom: '4px' }}>
              Story Caption / Subtitle
            </label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Add a caption to your story..."
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: '6px',
                border: '1px solid #CED0D4',
                fontSize: '13px',
              }}
            />
          </div>

          {/* Live Preview Box */}
          {(videoUrl || posterUrl) && (
            <div style={{ marginBottom: '16px', padding: '10px', background: '#EBF5FF', borderRadius: '8px', border: '1px solid #C3E0FF' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#0866FF', marginBottom: '6px' }}>
                STORY PREVIEW
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '80px', height: '120px', borderRadius: '8px', overflow: 'hidden', background: '#000', position: 'relative' }}>
                  {videoUrl ? (
                    <video src={videoUrl} poster={posterUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} controls />
                  ) : (
                    <img src={posterUrl} alt="Poster" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '13px' }}>{authorName}</div>
                  <div style={{ fontSize: '11px', color: '#65676B' }}>Just now</div>
                  {caption && <div style={{ fontSize: '12px', color: '#1C1E21', marginTop: '4px', fontStyle: 'italic' }}>"{caption}"</div>}
                </div>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '12px' }}>
            <button
              type="button"
              className="fb-admin-refresh-btn"
              onClick={onClose}
              style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #CED0D4', background: '#fff', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || (!videoUrl && !posterUrl)}
              style={{
                padding: '8px 20px',
                borderRadius: '6px',
                border: 'none',
                background: (!videoUrl && !posterUrl) ? '#E4E6EB' : '#0866FF',
                color: (!videoUrl && !posterUrl) ? '#BCC0C4' : '#FFFFFF',
                fontWeight: 700,
                fontSize: '14px',
                cursor: (!videoUrl && !posterUrl) ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Check size={16} />
              <span>Share to Story</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

