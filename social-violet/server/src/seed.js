import 'dotenv/config';
import bcrypt from 'bcryptjs';
import prisma from './prisma.js';

async function main() {
  console.log('🌱 Starting Sphere database seeding...');

  // 1. Clear existing records in reverse dependency order
  await prisma.comment.deleteMany({});
  await prisma.reaction.deleteMany({});
  await prisma.postMedia.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.story.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.friendship.deleteMany({});
  await prisma.user.deleteMany({});

  const defaultPasswordHash = await bcrypt.hash('password123', 10);

  // 2. Seed Users
  const berta = await prisma.user.create({
    data: {
      email: 'berta.hule@example.com',
      password: defaultPasswordHash,
      name: 'Berta Hule',
      shortName: 'Berta',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      coverPhoto: 'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?auto=format&fit=crop&w=1200&q=80',
      bio: 'Living life one day at a time ✨',
      verified: true,
      online: true,
    },
  });

  const bol = await prisma.user.create({
    data: {
      email: 'bol.riak@example.com',
      password: defaultPasswordHash,
      name: 'Bol Riak Kuol',
      shortName: 'Bol',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      coverPhoto: 'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?auto=format&fit=crop&w=1200&q=80',
      bio: 'Digital explorer',
      verified: false,
      online: true,
    },
  });

  const tahir = await prisma.user.create({
    data: {
      email: 'tahir.adem@example.com',
      password: defaultPasswordHash,
      name: 'Tahir Adem',
      shortName: 'Tahir',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      coverPhoto: 'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?auto=format&fit=crop&w=1200&q=80',
      bio: 'Software engineer & tech enthusiast 🚀',
      verified: true,
      online: true,
    },
  });

  const elena = await prisma.user.create({
    data: {
      email: 'elena.rostova@example.com',
      password: defaultPasswordHash,
      name: 'Elena Rostova',
      shortName: 'Elena',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      coverPhoto: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      bio: 'Landscape photographer and visual artist 📷',
      badge: 'Pro Photographer',
      verified: true,
      online: true,
      statusText: 'Editing raw photo sets 🎞️',
    },
  });

  const marcus = await prisma.user.create({
    data: {
      email: 'marcus.chen@example.com',
      password: defaultPasswordHash,
      name: 'Marcus Chen',
      shortName: 'Marcus',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      bio: 'Fullstack developer & OSS contributor',
      verified: false,
      online: true,
      statusText: 'Pushing release candidates 🚀',
    },
  });

  const sophia = await prisma.user.create({
    data: {
      email: 'sophia.davis@example.com',
      password: defaultPasswordHash,
      name: 'Sophia Davis',
      shortName: 'Sophia',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
      bio: 'Outdoor lover & trail runner 🌲',
      verified: false,
      online: true,
      statusText: 'Away for coffee ☕',
    },
  });

  console.log(` Created 6 users`);

  // 3. Seed Posts
  const post1 = await prisma.post.create({
    data: {
      authorId: elena.id,
      content: `Spent the early morning chasing fog rolling over the Golden Gate Bridge. The light broke through for just about 90 seconds, and this magical frame was born. What do you all think? ✨📸\n\n#GoldenGate #LandscapePhotography #SanFrancisco #MorningLight`,
      privacy: 'public',
      sharesCount: 34,
      media: {
        create: [
          {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1400&q=80',
            aspect: 'landscape',
            order: 0,
          },
        ],
      },
      reactions: {
        create: [
          { userId: berta.id, type: 'love' },
          { userId: tahir.id, type: 'like' },
          { userId: marcus.id, type: 'wow' },
        ],
      },
      comments: {
        create: [
          {
            authorId: marcus.id,
            text: 'The color grading here is out of this world! What camera body and lens were you using?',
            likes: 24,
          },
          {
            authorId: sophia.id,
            text: 'Breathtaking work Elena! Framing is pure perfection 👏❤️',
            likes: 12,
          },
        ],
      },
    },
  });

  const post2 = await prisma.post.create({
    data: {
      authorId: sophia.id,
      content: `Weekend recharge in Big Sur! 🌊🌲 Unplugged for 48 hours with fresh ocean air, bonfire coffee, and endless coastal cliff hikes. Reminding everyone to step away from the keyboard and get into the wild this week! 🏕️`,
      privacy: 'public',
      sharesCount: 12,
      media: {
        create: [
          {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1400&q=80',
            aspect: 'landscape',
            order: 0,
          },
        ],
      },
      reactions: {
        create: [
          { userId: berta.id, type: 'love' },
          { userId: elena.id, type: 'care' },
        ],
      },
      comments: {
        create: [
          {
            authorId: elena.id,
            text: 'That coastline is unmatched! Hope you enjoyed McWay Falls too 🌊',
            likes: 8,
          },
        ],
      },
    },
  });

  const post3 = await prisma.post.create({
    data: {
      authorId: tahir.id,
      content: 'Information 😂🤷‍♂️🙏',
      caption: 'Information 😂🤷‍♂️🙏',
      backgroundCard: {
        color: '#D71444',
        text: 'The wife of my brother has jumped away .If you hear her foot any where,please inform me tawali.',
      },
      privacy: 'public',
      sharesCount: 189,
      reactions: {
        create: [
          { userId: berta.id, type: 'haha' },
          { userId: bol.id, type: 'haha' },
          { userId: marcus.id, type: 'haha' },
        ],
      },
    },
  });

  console.log(` Created 3 posts with media, reactions, and comments`);

  // 4. Seed Stories
  await prisma.story.createMany({
    data: [
      {
        userId: elena.id,
        mediaUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        caption: 'Sunset vibes at Pacific Coast Highway 🌅',
      },
      {
        userId: marcus.id,
        mediaUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
        caption: 'Hackathon team just launched v2.0! 🚀',
      },
      {
        userId: sophia.id,
        mediaUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80',
        caption: 'Lost in the Swiss Alps 🏔️ Hiking trail day 3',
      },
    ],
  });

  console.log(` Created stories`);

  // 5. Seed Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: berta.id,
        actorId: elena.id,
        action: 'reacted with ❤️ to your photo in San Francisco',
        icon: 'heart',
        read: false,
      },
      {
        userId: berta.id,
        actorId: marcus.id,
        action: 'commented on your post: "Awesome insight!"',
        icon: 'message',
        read: false,
      },
      {
        userId: berta.id,
        actorId: sophia.id,
        action: 'invited you to join the group "Weekend Trail Runners"',
        icon: 'user-plus',
        read: true,
      },
    ],
  });

  console.log(` Created notifications`);
  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

