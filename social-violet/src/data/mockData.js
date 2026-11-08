import rigathiAvatar from '../assets/rigathi-avatar.png';
import rigathiGrid from '../assets/rigathi-rally-grid.png';
import fbMobileScreenshot from '../assets/fb-mobile-screenshot.jpg';

export const CURRENT_USER = {
  id: 'acc_tahir_adem',
  name: 'Deng Garang Ajou',
  shortName: 'Deng',
  avatar: 'https://scontent.fadd3-1.fna.fbcdn.net/v/t39.30808-1/449190487_433951952781419_1825475880531579874_n.jpg?stp=dst-jpg_tt6&cstp=mx413x413&ctp=s200x200&_nc_cat=108&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=1d2534&_nc_eui2=AeHlhWIbuAFAPXShnX0fD77wMug7sU-Uhnky6DuxT5SGeWty6voPF4Wh0uFgXu1-dVjpJ0K_VGRVt6hDxu--PPBI&_nc_ohc=vSmEpTw7RLUQ7kNvwExJfAp&_nc_oc=AdpJiJfafFB1fUzr7w8levQCzrNPe9eEjG3-illzbHh7uKC_I07n7TYOWeg4HLabacg&_nc_zt=24&_nc_ht=scontent.fadd3-1.fna&_nc_gid=LmlBjUAiMhqmFiz3yR-8zw&_nc_ss=7a2a8&oh=00_AQTOqljyML03azhd2tVUN3Zima6BTa-A8aFrymonlAPxFg&oe=6AF50A80',
  coverPhoto: 'https://scontent.fadd3-1.fna.fbcdn.net/v/t39.30808-6/512020970_682334647943147_5199546605166835424_n.jpg?stp=cp6_dst-jpg_tt6&cstp=mx1284x883&ctp=s960x960&_nc_cat=105&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=cc71e4&_nc_eui2=AeF3U2FDd0K5u23wqDXlTwebKKpYidXIG1MoqliJ1cgbU_2XCMYaAbb_5y7QRRr3tHjpeCo6C9Biw-hdqcFlLsWP&_nc_ohc=LmJozpWAU54Q7kNvwENoSa1&_nc_oc=AdqpZrp3wgouqfDY4Y0sYw_zeff5e8gEy-NOvlkkjAkxA3NjRJeTaXJwKLdSXDgfkyE&_nc_zt=23&_nc_ht=scontent.fadd3-1.fna&_nc_gid=LmlBjUAiMhqmFiz3yR-8zw&_nc_ss=7a2a8&oh=00_AQS5VMSWggxrQ7kF1l8OHPIq8-mXbM6bg4ot6y99FhIkXA&oe=6AF512B5',
  bio: 'A south Sudanese journalist 📸✅',
  verified: true,
};

export const RECENT_ACCOUNTS = [
  {
    id: 'user_current',
    name: 'Berta Hule',
    shortName: 'Berta',
    email: 'berta.hule@example.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    coverPhoto: 'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?auto=format&fit=crop&w=1200&q=80',
    bio: 'Living life one day at a time ✨',
  },
  {
    id: 'user_bol',
    name: 'Bol Riak Kuol',
    shortName: 'Bol',
    email: 'bol.riak@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    coverPhoto: 'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?auto=format&fit=crop&w=1200&q=80',
    bio: 'Digital explorer',
  },
  {
    id: 'user_tahir',
    name: 'Tahir Adem',
    shortName: 'Tahir',
    email: 'tahir.adem@example.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    coverPhoto: 'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?auto=format&fit=crop&w=1200&q=80',
    bio: 'Software engineer & tech enthusiast 🚀',
  },
];

export const INITIAL_STORIES = [
  {
    id: 'story-sachin',
    userName: 'Sachin Sharma',
    userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    mediaType: 'video',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-exercising-with-battle-ropes-in-gym-41858-large.mp4',
    backupVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    timestamp: 'Suggested',
    suggested: true,
    caption: 'Calisthenics grind never stops! 💪🔥 Full workout session',
    unseen: true,
  },
  {
    id: 'story-fitvision',
    userName: 'FitVision 3D',
    userAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    mediaType: 'video',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-athlete-walking-in-a-gym-with-weights-41855-large.mp4',
    backupVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    timestamp: 'Suggested',
    suggested: true,
    caption: 'Optimal hypertrophy splits & 3D biomechanics 📊 Heavy barbell session',
    unseen: true,
  },
  {
    id: 'story-1',
    userName: 'Elena Rostova',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    mediaType: 'video',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4',
    backupVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    timestamp: '2h ago',
    caption: 'Sunset vibes at Pacific Coast Highway 🌅 Pure ocean calm',
    unseen: true,
  },
  {
    id: 'story-2',
    userName: 'Marcus Chen',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    mediaType: 'video',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-typing-on-a-computer-laptop-41273-large.mp4',
    backupVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    timestamp: '4h ago',
    caption: 'Hackathon team just launched v2.0! 🚀 Live production demo',
    unseen: true,
  },
  {
    id: 'story-3',
    userName: 'Sophia Davis',
    userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80',
    mediaType: 'video',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-mountain-landscape-with-snow-41712-large.mp4',
    backupVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    timestamp: '5h ago',
    caption: 'Lost in the Swiss Alps 🏔️ Hiking trail day 3',
    unseen: true,
  },
];

export const INITIAL_POSTS = [
  {
    id: 'post-alijoma-mabil',
    author: {
      name: 'Alijoma Mabil',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      badge: 'Follow',
      verified: true,
      hasFollow: true,
    },
    timestamp: '8h',
    privacy: 'public',
    content: '10 years of blessings , Pride and endless love.... more',
    media: [
      {
        type: 'image',
        url: fbMobileScreenshot,
        isAlijomaCrop: true,
      },
    ],
    stats: {
      likes: 4280,
      comments: 312,
      shares: 64,
      reactionBreakdown: {
        like: 3600,
        love: 680,
      },
    },
    userReaction: null,
    comments: [
      {
        id: 'c1',
        author: {
          name: 'Sarah Jenkins',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
        },
        text: 'Blessings to your family brother! Beautiful photo ❤️',
        timestamp: '3h ago',
        likes: 18,
      },
    ],
  },
  {
    id: 'post-rigathi-gachagua',
    author: {
      name: 'H.E. Rigathi Gachagua, EGH',
      avatar: rigathiAvatar,
      badge: 'Follow',
      verified: true,
      hasFollow: true,
    },
    timestamp: '16h',
    privacy: 'public',
    content: `Together with Wiper Party Leader Kalonzo Musyoka and DAP-K leader Eugene Wamalwa, We have engaged the people of Juja outside the Constituency Party Office after officia... See more`,
    media: [
      {
        type: 'image',
        url: rigathiGrid,
      },
    ],
    stats: {
      likes: 1240,
      comments: 382,
      shares: 95,
      reactionBreakdown: {
        like: 1100,
        love: 120,
        care: 20,
      },
    },
    userReaction: null,
    comments: [],
  },
  {
    id: 'post-watchdog-press',
    author: {
      name: 'Watchdog Press',
      avatar: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=300&q=80',
      badge: 'Follow',
      verified: false,
      hasFollow: true,
    },
    timestamp: '1h',
    privacy: 'public',
    content: `Protocol-wise, Matthew Mathiang Magordit, the aspiring Governor of Warrap State, has no authority to pause and wave from the aircraft stairs before departing Juba for W... See more`,
    media: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    stats: {
      likes: 342,
      comments: 64,
      shares: 28,
      reactionBreakdown: {
        like: 290,
        love: 42,
        care: 10,
      },
    },
    userReaction: null,
    comments: [],
  },
  {
    id: 'post-abiy-ahmed',
    author: {
      name: 'Abiy Ahmed Ali',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      badge: 'Follow',
      verified: true,
      hasFollow: true,
    },
    timestamp: '4h',
    privacy: 'public',
    content: `ዛሬ የመጀመሪያዎቹ 26 የከተማ አውቶቡሶች ከኮንጎ ወደ ቴአትር ጋዝ ተለውጠው ሥራ ላይ በመዋላቸው የተሰማኝን ደስታ መግለጽ እፈልጋለሁ:... See more`,
    hasTranslation: true,
    mediaGrid: [
      {
        url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80',
      },
      {
        url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
      },
      {
        url: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
      },
    ],
    stats: {
      likes: 14200,
      comments: 1840,
      shares: 920,
      reactionBreakdown: {
        like: 11000,
        love: 2800,
        care: 400,
      },
    },
    userReaction: null,
    comments: [],
  },
  {
    id: 'post-slovenia-embassy',
    author: {
      name: 'Veleposlaništvo Slovenije v Adis Abebi /Embassy of Slovenia in Addis...',
      avatar: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=300&q=80',
      badge: 'Follow',
      verified: false,
      hasFollow: true,
    },
    timestamp: 'October 28 at 1:35 PM',
    privacy: 'public',
    content: `🇸🇮🇪🇹 Celebrating Bee Diplomacy and Children’s Rights in Addis Ababa! 🍯💛\nAs part of our #BeeDiplomacy and #ChildrensRights project, Ambassador Kristina Radej and her team hosted an interactive workshop highlighting sustainable beekeeping traditions and youth empowerment.`,
    media: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1400&q=80',
      },
    ],
    stats: {
      likes: 184,
      comments: 18,
      shares: 9,
      reactionBreakdown: {
        like: 142,
        love: 38,
        care: 4,
      },
    },
    userReaction: 'like',
    comments: [
      {
        id: 'c-embassy-1',
        author: {
          name: 'Abebe Tadesse',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        },
        text: 'Wonderful initiative for our community and children! 👏🍯',
        timestamp: 'October 28',
        likes: 12,
      },
    ],
  },
  {
    id: 'post-screenshot-simon',
    author: {
      name: 'Šímøn Dèé Cêg',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=300&q=80',
      badge: 'Follow',
      verified: true,
      hasFollow: true,
    },
    timestamp: '16h',
    privacy: 'public',
    caption: 'Information 😂🤷‍♂️🙏',
    content: 'Information 😂🤷‍♂️🙏',
    backgroundCard: {
      color: '#D71444',
      text: 'The wife of my brother has jumped away .If you hear her foot any where,please inform me tawali.',
    },
    media: [],
    stats: {
      likes: 3824,
      comments: 642,
      shares: 189,
      reactionBreakdown: {
        haha: 2450,
        like: 980,
        love: 394,
      },
    },
    userReaction: 'haha',
    comments: [
      {
        id: 'c-simon-1',
        author: {
          name: 'James Wilson',
          avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
        },
        text: '😂😂 Tawali brother!! We are on high alert looking for the foot!',
        timestamp: '14h',
        likes: 154,
      },
    ],
  },
  {
    id: 'post-101',
    author: {
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
      badge: 'Pro Photographer',
      verified: true,
    },
    timestamp: '3 hrs ago',
    privacy: 'public',
    content: `Spent the early morning chasing fog rolling over the Golden Gate Bridge. The light broke through for just about 90 seconds, and this magical frame was born. What do you all think? ✨📸

#GoldenGate #LandscapePhotography #SanFrancisco #MorningLight`,
    media: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1400&q=80',
        aspect: 'landscape',
      },
    ],
    stats: {
      likes: 1248,
      comments: 89,
      shares: 34,
      reactionBreakdown: {
        like: 850,
        love: 340,
        care: 32,
        wow: 26,
      },
    },
    userReaction: null,
    comments: [
      {
        id: 'c1',
        author: {
          name: 'Marcus Chen',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        },
        text: 'The color grading here is out of this world! What camera body and lens were you using?',
        timestamp: '2 hrs ago',
        likes: 24,
      },
      {
        id: 'c2',
        author: {
          name: 'Sophia Davis',
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
        },
        text: 'Breathtaking work Elena! Framing is pure perfection 👏❤️',
        timestamp: '1 hr ago',
        likes: 12,
      },
    ],
  },
  {
    id: 'post-102',
    author: {
      name: 'DevCommunity Global',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80',
      badge: 'Group · 185K Members',
      verified: true,
    },
    timestamp: '5 hrs ago',
    privacy: 'public',
    content: `🚀 Why modern frontend architecture is embracing zero-runtime CSS and component modularity.

We conducted a benchmark across 45 production React 19 micro-frontends. The results showed a 38% reduction in Largest Contentful Paint (LCP) when transitioning to streamlined atomic design tokens.

Here is the quick architectural takeaway breakdown 👇`,
    media: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1400&q=80',
        aspect: 'landscape',
      },
    ],
    stats: {
      likes: 852,
      comments: 142,
      shares: 98,
      reactionBreakdown: {
        like: 610,
        love: 180,
        wow: 62,
      },
    },
    userReaction: 'like',
    comments: [
      {
        id: 'c3',
        author: {
          name: 'David Miller',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
        },
        text: 'Completely agree on LCP improvements. We saw huge gains in our last mobile release.',
        timestamp: '3 hrs ago',
        likes: 19,
      },
    ],
  },
  {
    id: 'post-103',
    author: {
      name: 'Sophia Davis',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
      badge: '',
      verified: false,
    },
    timestamp: 'Yesterday at 4:15 PM',
    privacy: 'friends',
    content: `Weekend recharge in Big Sur! 🌊🌲 Unplugged for 48 hours with fresh ocean air, bonfire coffee, and endless coastal cliff hikes. Reminding everyone to step away from the keyboard and get into the wild this week! 🏕️`,
    media: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1400&q=80',
        aspect: 'landscape',
      },
    ],
    stats: {
      likes: 419,
      comments: 31,
      shares: 12,
      reactionBreakdown: {
        like: 210,
        love: 185,
        care: 24,
      },
    },
    userReaction: 'love',
    comments: [
      {
        id: 'c4',
        author: {
          name: 'Elena Rostova',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
        },
        text: 'That coastline is unmatched! Hope you enjoyed McWay Falls too 🌊',
        timestamp: 'Yesterday',
        likes: 8,
      },
    ],
  },
  {
    id: 'post-104',
    author: {
      name: 'Liam Anderson',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
      badge: '',
      verified: false,
    },
    timestamp: '1d ago',
    privacy: 'public',
    content: `Quick poll for the engineering community: When building a modern design system, what is your go-to token management strategy?

A) CSS Custom Properties (:root variables)
B) Tailwind configuration presets
C) CSS-in-JS design token engines (StyleX / Panda)
D) Hybrid Figma Tokens pipeline

Drop your preference and why in the comments! 👇`,
    media: [],
    stats: {
      likes: 367,
      comments: 114,
      shares: 21,
      reactionBreakdown: {
        like: 290,
        love: 45,
        wow: 32,
      },
    },
    userReaction: null,
    comments: [],
  },
];

export const CONTACTS = [
  {
    id: 'friend-1',
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    online: true,
    statusText: 'Editing raw photo sets 🎞️',
    lastMessage: 'Hey Alex! Did you check out the new camera release?',
  },
  {
    id: 'friend-2',
    name: 'Marcus Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    online: true,
    statusText: 'Pushing release candidates',
    lastMessage: 'The staging pipeline is all green now! 🚀',
  },
  {
    id: 'friend-3',
    name: 'Sophia Davis',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    online: true,
    statusText: 'Away for coffee ☕',
    lastMessage: 'Let us grab lunch together this Thursday.',
  },
  {
    id: 'friend-4',
    name: 'David Miller',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    online: false,
    statusText: 'Offline · 2h ago',
    lastMessage: 'Thanks for the code review comments man!',
  },
  {
    id: 'friend-5',
    name: 'Aaliyah Patel',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    online: true,
    statusText: 'In a design sprint',
    lastMessage: 'I shared the Figma components in Slack.',
  },
  {
    id: 'friend-6',
    name: 'Liam Anderson',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
    online: false,
    statusText: 'Offline · 5h ago',
    lastMessage: 'Sounds great! Talk soon.',
  },
  {
    id: 'friend-7',
    name: 'Isabella Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
    online: true,
    statusText: 'Active now',
    lastMessage: 'Loved your latest post on the feed!',
  },
  {
    id: 'friend-8',
    name: 'James Wilson',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    online: true,
    statusText: 'Active now',
    lastMessage: 'Are we still meeting up for the game tonight?',
  },
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-fb-1',
    type: 'security_alert',
    user: {
      name: 'Facebook Security',
      avatarType: 'silhouette',
    },
    action: 'Someone tried to log in, but we stopped them.',
    time: '21h',
    read: false,
    badge: 'shield',
    section: 'new',
  },
  {
    id: 'notif-fb-2',
    type: 'security_alert',
    user: {
      name: 'Facebook Security',
      avatarType: 'facebook',
    },
    action: "We noticed a new login from a device or location you don't usually use. Please review.",
    time: '1d',
    read: false,
    badge: 'shield',
    section: 'new',
  },
  {
    id: 'notif-fb-3',
    type: 'page_suggestion',
    user: {
      name: 'Fana Broadcasting Corporation (FBC) FANS',
      avatarType: 'page',
      avatar: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=200&q=80',
    },
    action: 'You might like Fana Broadcasting Corporation (FBC) FANS.',
    highlightText: 'Fana Broadcasting Corporation (FBC) FANS',
    time: '4d',
    read: false,
    badge: 'group',
    section: 'new',
  },
  {
    id: 'notif-fb-4',
    type: 'friend_suggestion',
    user: {
      name: 'Facebook',
      avatarType: 'facebook',
    },
    action: "See who's also on Facebook. Tap here to get help finding friends",
    time: '2w',
    read: true,
    badge: 'bell',
    section: 'earlier',
  },
];

export const SPONSORED_ADS = [
  {
    id: 'ad-1',
    title: 'CloudScale Studio Pro',
    domain: 'cloudscale.io/devtools',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
    description: 'Deploy serverless edge compute with instantaneous global cache.',
  },
  {
    id: 'ad-2',
    title: 'Aura Design Systems 2026',
    domain: 'auradesign.dev',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80',
    description: 'Production-ready React UI libraries tailored for high-scale enterprise applications.',
  },
];

export const REACTION_TYPES = [
  { type: 'like', label: 'Like', emoji: '👍', color: 'var(--color-primary)' },
  { type: 'love', label: 'Love', emoji: '❤️', color: '#f43f5e' },
  { type: 'care', label: 'Care', emoji: '🥰', color: '#fbbf24' },
  { type: 'haha', label: 'Haha', emoji: '😆', color: '#f59e0b' },
  { type: 'wow', label: 'Wow', emoji: '😮', color: '#f59e0b' },
  { type: 'sad', label: 'Sad', emoji: '😢', color: '#eab308' },
  { type: 'angry', label: 'Angry', emoji: '😡', color: '#ea580c' },
];

