const fs = require('fs');
const b64 = fs.readFileSync('C:/Users/ademt/.gemini/antigravity/brain/11c050c8-ba29-4ba2-8993-d5396547a6f8/.user_uploaded/media_1793512114197_21514d6a.png').toString('base64');
const darkAvatarB64 = fs.readFileSync('social-violet/src/assets/fb-user-dark-avatar.png').toString('base64');

const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body {
      background: #222;
      margin: 0;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
    }
    .card {
      background: #fff;
      width: 570px;
      border-radius: 8px;
      overflow: hidden;
    }
    .user-img {
      width: 570px;
      display: block;
    }

    /* Container matching 570px screenshot */
    .test-container {
      width: 570px;
      background: #FFFFFF;
      box-sizing: border-box;
    }

    /* 1. Header */
    .top-header {
      height: 58px;
      padding: 0 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #FFFFFF;
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .logo-text {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      font-size: 32px;
      font-weight: 800;
      color: #0866FF;
      letter-spacing: -1.4px;
      line-height: 1;
      margin-top: -2px;
    }
    .header-right {
      display: flex;
      align-items: center;
      gap: 22px;
    }
    .header-btn {
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* 2. Composer Row */
    .composer-row {
      padding: 8px 16px 14px 16px;
      display: flex;
      align-items: center;
      gap: 14px;
      background: #FFFFFF;
    }
    .avatar-wrap {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      overflow: hidden;
      flex-shrink: 0;
    }
    .avatar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .pill {
      flex: 1;
      height: 44px;
      border-radius: 24px;
      border: 1px solid #CED0D4;
      background: #FFFFFF;
      display: flex;
      align-items: center;
      padding: 0 18px;
      cursor: pointer;
      box-sizing: border-box;
    }
    .pill-text {
      font-size: 16px;
      color: #050505;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-weight: 400;
      user-select: none;
    }
    .gallery-btn {
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .divider-band {
      height: 8px;
      background-color: #E4E6EB;
    }
  </style>
</head>
<body>
  <div class="card">
    <h3 style="margin: 8px 16px; color: #555;">Your Screenshot (media_1793512114197_21514d6a.png):</h3>
    <img src="data:image/png;base64,${b64}" class="user-img" />
  </div>

  <div class="card">
    <h3 style="margin: 8px 16px; color: #555;">Recreated Top Header & Composer:</h3>
    <div class="test-container">
      <!-- Top Header -->
      <div class="top-header">
        <div class="header-left">
          <button class="header-btn">
            <svg viewBox="0 0 26 24" width="24" height="22" fill="none">
              <line x1="1" y1="4" x2="25" y2="4" stroke="#050505" stroke-width="2.8" stroke-linecap="round" />
              <line x1="1" y1="12" x2="25" y2="12" stroke="#050505" stroke-width="2.8" stroke-linecap="round" />
              <line x1="1" y1="20" x2="25" y2="20" stroke="#050505" stroke-width="2.8" stroke-linecap="round" />
            </svg>
          </button>
          <span class="logo-text">facebook</span>
        </div>

        <div class="header-right">
          <!-- [+] -->
          <button class="header-btn" title="Create">
            <svg viewBox="0 0 26 26" width="25" height="25" fill="none">
              <rect x="2" y="2" width="22" height="22" rx="6.5" stroke="#050505" stroke-width="2.5" />
              <line x1="13" y1="7.5" x2="13" y2="18.5" stroke="#050505" stroke-width="2.5" stroke-linecap="round" />
              <line x1="7.5" y1="13" x2="18.5" y2="13" stroke="#050505" stroke-width="2.5" stroke-linecap="round" />
            </svg>
          </button>

          <!-- [🔍] -->
          <button class="header-btn" title="Search">
            <svg viewBox="0 0 26 26" width="25" height="25" fill="none">
              <circle cx="11" cy="11" r="7.5" stroke="#050505" stroke-width="2.5" />
              <line x1="16.5" y1="16.5" x2="23" y2="23" stroke="#050505" stroke-width="2.5" stroke-linecap="round" />
            </svg>
          </button>

          <!-- [💬] -->
          <button class="header-btn" title="Messenger">
            <svg viewBox="0 0 28 28" width="27" height="27" fill="none">
              <path
                d="M14 2C7.37 2 2 7.15 2 13.5c0 3.6 1.74 6.84 4.5 8.94V26l3.4-1.87c1.28.36 2.65.57 4.1.57 6.63 0 12-5.15 12-11.5S20.63 2 14 2z"
                fill="#050505"
              />
              <path
                d="M7.5 16.5l4.8-5.2 2.7 2.7 5.5-5.2-4.8 5.2-2.7-2.7-5.5 5.2z"
                fill="#FFFFFF"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Composer Row -->
      <div class="composer-row">
        <div class="avatar-wrap">
          <img src="data:image/png;base64,${darkAvatarB64}" class="avatar-img" />
        </div>

        <div class="pill">
          <span class="pill-text">What's on your mind?</span>
        </div>

        <button class="gallery-btn" title="Photo/video">
          <svg viewBox="0 0 26 26" width="24" height="24" fill="#65676B">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M4.5 2C3.12 2 2 3.12 2 4.5v17C2 22.88 3.12 24 4.5 24h17c1.38 0 2.5-1.12 2.5-2.5v-17C24 3.12 22.88 2 21.5 2h-17zm14.75 4a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5zM4 21.5l5.2-6.5a1.2 1.2 0 0 1 1.86 0l2.44 3.05 4.3-5.38a1.2 1.2 0 0 1 1.87 0l2.33 2.91V4.5a.5.5 0 0 0-.5-.5h-17a.5.5 0 0 0-.5.5v17z"
            />
          </svg>
        </button>
      </div>

      <!-- Divider Band -->
      <div class="divider-band"></div>
    </div>
  </div>
</body>
</html>`;

fs.writeFileSync('social-violet/src/assets/fb-icons/preview_top_header.html', html);
console.log('Preview generated in preview_top_header.html');

