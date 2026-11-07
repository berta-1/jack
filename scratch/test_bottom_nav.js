const fs = require('fs');
const b64 = fs.readFileSync('C:/Users/ademt/.gemini/antigravity/brain/11c050c8-ba29-4ba2-8993-d5396547a6f8/.user_uploaded/media_1793511309762_09169516.png').toString('base64');

const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body {
      background: #333;
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
      width: 537px;
      border-radius: 8px;
      overflow: hidden;
    }
    .user-img {
      width: 537px;
      display: block;
    }
    .nav-bar {
      width: 537px;
      height: 68px;
      background: #FFFFFF;
      border-top: 1px solid #CED0D4;
      display: flex;
      align-items: center;
      justify-content: space-around;
      box-sizing: border-box;
    }
    .nav-item {
      flex: 1;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }
  </style>
</head>
<body>
  <div class="card">
    <h3 style="margin: 10px 16px; color: #555;">Official Screenshot:</h3>
    <img src="data:image/png;base64,${b64}" class="user-img" />
  </div>

  <div class="card">
    <h3 style="margin: 10px 16px; color: #555;">Recreated Vector Bottom Bar (Scaled 1:1 to 537px screenshot):</h3>
    <div class="nav-bar">
      <!-- 1. Home -->
      <div class="nav-item">
        <svg viewBox="0 0 30 30" width="30" height="30" fill="none">
          <path
            d="M13.6 2.3a2 2 0 0 1 2.8 0l10.5 9.8c.7.6 1.1 1.5 1.1 2.4v11c0 1.4-1.1 2.5-2.5 2.5h-5a1.2 1.2 0 0 1-1.2-1.2v-7.3a2.3 2.3 0 0 0-4.6 0v7.3c0 .7-.5 1.2-1.2 1.2h-5A2.5 2.5 0 0 1 2 25.5V14.5c0-.9.4-1.8 1.1-2.4L13.6 2.3z"
            fill="#0866FF"
          />
        </svg>
      </div>

      <!-- 2. Reels -->
      <div class="nav-item">
        <svg viewBox="0 0 30 30" width="29" height="28" fill="none">
          <rect x="2" y="3" width="25" height="22" rx="6" stroke="#050505" stroke-width="2.6" />
          <line x1="2" y1="9.5" x2="27" y2="9.5" stroke="#050505" stroke-width="2.6" />
          <line x1="10" y1="3" x2="8" y2="9.5" stroke="#050505" stroke-width="2.6" stroke-linecap="round" />
          <line x1="19" y1="3" x2="17" y2="9.5" stroke="#050505" stroke-width="2.6" stroke-linecap="round" />
          <polygon points="12.5,13.5 19.5,17.5 12.5,21.5" fill="#050505" />
        </svg>
      </div>

      <!-- 3. Friends -->
      <div class="nav-item">
        <svg viewBox="0 0 30 30" width="30" height="28" fill="none">
          <circle cx="20.5" cy="8" r="4.2" stroke="#050505" stroke-width="2.4" />
          <path d="M19.5 15.8c2.8.5 5.5 2 6.5 4.8" stroke="#050505" stroke-width="2.4" stroke-linecap="round" />
          <circle cx="10.5" cy="11.5" r="4.6" stroke="#050505" stroke-width="2.6" />
          <path d="M3 25.5c0-4.4 3.6-7.8 8.5-7.8s8.5 3.4 8.5 7.8" stroke="#050505" stroke-width="2.6" stroke-linecap="round" />
        </svg>
      </div>

      <!-- 4. Marketplace -->
      <div class="nav-item">
        <svg viewBox="0 0 30 30" width="30" height="28" fill="none">
          <path
            d="M3.5 7c0-1.1.9-2 2-2h19c1.1 0 2 .9 2 2v4c0 1.8-1.3 3.3-3.1 3.3-1.4 0-2.6-.9-3-2.1-.4 1.2-1.6 2.1-3 2.1s-2.6-.9-3-2.1c-.4 1.2-1.6 2.1-3 2.1-1.8 0-3.1-1.5-3.1-3.3V7z"
            stroke="#050505"
            stroke-width="2.5"
            stroke-linejoin="round"
          />
          <path
            d="M4.5 14v9a2 2 0 0 0 2 2h17a2 2 0 0 0 2-2v-9"
            stroke="#050505"
            stroke-width="2.5"
          />
          <path
            d="M11.5 25v-6.5a1.2 1.2 0 0 1 1.2-1.2h4.6a1.2 1.2 0 0 1 1.2 1.2V25"
            stroke="#050505"
            stroke-width="2.5"
          />
        </svg>
      </div>

      <!-- 5. Notifications -->
      <div class="nav-item">
        <div style="position: relative; display: flex; align-items: center; justify-content: center;">
          <svg viewBox="0 0 30 30" width="28" height="28" fill="none">
            <path
              d="M15 3.5a7 7 0 0 0-7 7v4.5c0 .8-.4 1.7-1 2.3l-1.8 1.8a1 1 0 0 0 .7 1.7h18.2a1 1 0 0 0 .7-1.7l-1.8-1.8c-.6-.6-1-1.5-1-2.3v-4.5a7 7 0 0 0-7-7z"
              stroke="#050505"
              stroke-width="2.5"
            />
            <path d="M12 21.5a3 3 0 0 0 6 0" stroke="#050505" stroke-width="2.5" />
          </svg>
          <div style="position: absolute; top: -7px; right: -12px; background: #E41E3F; color: #FFF; font-size: 13px; font-weight: 800; padding: 2px 6px; border-radius: 12px; border: 2.5px solid #FFF; line-height: 1; letter-spacing: -0.5px;">
            9+
          </div>
        </div>
      </div>

      <!-- 6. Profile -->
      <div class="nav-item">
        <div style="width: 36px; height: 36px; border-radius: 50%; border: 1.5px solid #555; overflow: hidden; display: flex; align-items: center; justify-content: center; background: #1c1e21;">
          <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80" style="width: 100%; height: 100%; object-fit: cover;" />
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;

fs.writeFileSync('social-violet/src/assets/fb-icons/preview_bottom_nav.html', html);
console.log('Preview generated in preview_bottom_nav.html');

