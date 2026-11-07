import React, { useState } from 'react';
import { X, Minus, Send, Phone, Video, Info } from 'lucide-react';

export default function MessengerDock({ activeChats, onCloseChat, onSendMessage }) {
  const [minimizedChats, setMinimizedChats] = useState({});
  const [inputTexts, setInputTexts] = useState({});

  if (!activeChats || activeChats.length === 0) return null;

  const toggleMinimize = (contactId) => {
    setMinimizedChats((prev) => ({
      ...prev,
      [contactId]: !prev[contactId],
    }));
  };

  const handleSend = (contact, e) => {
    e.preventDefault();
    const text = inputTexts[contact.id]?.trim();
    if (!text) return;

    onSendMessage(contact.id, text);
    setInputTexts((prev) => ({ ...prev, [contact.id]: '' }));
  };

  return (
    <div className="messenger-dock">
      {activeChats.map((chat) => {
        const isMinimized = minimizedChats[chat.contact.id];
        const currentInput = inputTexts[chat.contact.id] || '';

        return (
          <div
            key={chat.contact.id}
            className={`chat-window ${isMinimized ? 'minimized' : ''}`}
          >
            {/* Header */}
            <div
              className="chat-header"
              onClick={() => toggleMinimize(chat.contact.id)}
            >
              <div className="chat-header-user">
                <div style={{ position: 'relative' }}>
                  <img
                    src={chat.contact.avatar}
                    alt={chat.contact.name}
                    className="chat-avatar-mini"
                  />
                  {chat.contact.online && <span className="online-dot" />}
                </div>
                <div>
                  <div className="chat-header-title">{chat.contact.name}</div>
                  <div className="chat-header-status">
                    {chat.contact.online ? 'Active now' : 'Offline'}
                  </div>
                </div>
              </div>

              <div
                className="chat-header-actions"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="chat-btn-mini"
                  onClick={() => toggleMinimize(chat.contact.id)}
                  title={isMinimized ? 'Expand' : 'Minimize'}
                >
                  <Minus size={15} />
                </button>
                <button
                  className="chat-btn-mini"
                  onClick={() => onCloseChat(chat.contact.id)}
                  title="Close chat"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Message Thread (if not minimized) */}
            {!isMinimized && (
              <>
                <div className="chat-messages-container">
                  <div
                    style={{
                      textAlign: 'center',
                      margin: '10px 0',
                      fontSize: '12px',
                      color: 'var(--text-tertiary)',
                    }}
                  >
                    You are connected on Sphere
                  </div>

                  {chat.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`msg-bubble ${
                        msg.sender === 'me' ? 'msg-sent' : 'msg-received'
                      }`}
                    >
                      {msg.text}
                    </div>
                  ))}
                </div>

                {/* Input Bar */}
                <form
                  className="chat-input-bar"
                  onSubmit={(e) => handleSend(chat.contact, e)}
                >
                  <input
                    type="text"
                    className="chat-input-field"
                    placeholder="Aa"
                    value={currentInput}
                    onChange={(e) =>
                      setInputTexts((prev) => ({
                        ...prev,
                        [chat.contact.id]: e.target.value,
                      }))
                    }
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="chat-send-btn"
                    disabled={!currentInput.trim()}
                  >
                    <Send size={16} />
                  </button>
                </form>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

