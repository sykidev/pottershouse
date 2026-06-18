import { db, client } from './index.js';
import { sermons, events, announcements, team, content } from './schema.js';

/**
 * Seed script for The Potters' Apostolic Ministries
 *
 * This creates minimal placeholder data to get the site running.
 * Replace with real content through the admin panel at /admin
 *
 * Default admin credentials:
 * Username: admin
 * Password: church2024!
 */

async function seed() {
  console.log('Seeding database for The Potters\' Apostolic Ministries...');

  // Placeholder sermons - REPLACE WITH REAL DATA via admin panel
  await db.insert(sermons).values([
    {
      title: 'The Potter and The Clay',
      speaker: 'Pastor [Name]',
      date: '2026-06-09',
      description: 'A powerful message about surrendering to God\'s shaping hand in our lives. Based on Isaiah 64:8 - We are the clay, You are the Potter.',
      videoUrl: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID',
      imageUrl: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800',
    },
    {
      title: 'Apostolic Authority',
      speaker: 'Pastor [Name]',
      date: '2026-06-02',
      description: 'Understanding the apostolic calling and walking in spiritual authority through Christ.',
      videoUrl: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID',
      imageUrl: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800',
    },
    {
      title: 'Transformed by the Potter',
      speaker: 'Pastor [Name]',
      date: '2026-05-26',
      description: 'How God transforms broken vessels into beautiful instruments for His glory.',
      videoUrl: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID',
      imageUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800',
    },
  ]);

  // Placeholder events - REPLACE WITH REAL DATA via admin panel
  await db.insert(events).values([
    {
      title: 'Sunday Service',
      description: 'Join us for powerful apostolic teaching, worship, and ministry. Everyone is welcome!',
      date: '2026-06-16',
      time: '10:00 AM',
      location: 'Main Sanctuary',
      imageUrl: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800',
    },
    {
      title: 'Prayer Meeting',
      description: 'Corporate prayer and intercession for our community and the nations.',
      date: '2026-06-18',
      time: '7:00 PM',
      location: 'Prayer Room',
      imageUrl: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800',
    },
    {
      title: 'Bible Study',
      description: 'Deep dive into the Word with apostolic teaching and fellowship.',
      date: '2026-06-20',
      time: '6:30 PM',
      location: 'Fellowship Hall',
      imageUrl: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800',
    },
  ]);

  // Placeholder announcements - REPLACE WITH REAL DATA via admin panel
  await db.insert(announcements).values([
    {
      title: 'Welcome to The Potters\' Apostolic Ministries!',
      body: 'We are excited to launch our new website. Explore messages, events, and connect with our ministry online. "We are the clay, You are the Potter" - Isaiah 64:8',
      active: true,
    },
    {
      title: 'New Member Class',
      body: 'Interested in joining The Potters\' Apostolic Ministries? Attend our new member class to learn more about our vision and values.',
      active: false,
    },
    {
      title: 'Ministry Opportunities',
      body: 'We are looking for volunteers in various ministry areas. Contact the office if God is calling you to serve.',
      active: false,
    },
  ]);

  // Placeholder team - REPLACE WITH REAL DATA via admin panel
  await db.insert(team).values([
    {
      name: 'Pastor [First Name] [Last Name]',
      role: 'Senior Pastor',
      bio: 'Replace with actual bio through admin panel. Pastor serves The Potters\' Apostolic Ministries with apostolic teaching and vision.',
      imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
    },
    {
      name: '[Pastor/Minister Name]',
      role: 'Associate Minister',
      bio: 'Replace with actual bio through admin panel.',
      imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
    },
    {
      name: '[Leader Name]',
      role: 'Worship Leader',
      bio: 'Replace with actual bio through admin panel.',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    },
  ]);

  // Content sections - CUSTOMIZE via admin panel
  await db.insert(content).values([
    {
      section: 'home.hero',
      data: {
        title: 'The Potters\' Apostolic Ministries',
        subtitle: 'Molded by the Master Potter, Transforming Lives Through Apostolic Ministry',
        ctaText: 'Join Us This Sunday',
        ctaLink: '/connect',
        backgroundImage: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1920',
      },
    },
    {
      section: 'about',
      data: {
        title: 'About The Potters\' Apostolic Ministries',
        mission: 'Our mission is to be molded by God\'s hand and transform lives through apostolic teaching, worship, and ministry. We are the clay, He is the Potter.',
        vision: 'We envision a community where lives are transformed by the Potter\'s touch, believers walk in apostolic authority, and God\'s kingdom is advanced.',
        values: [
          'Apostolic Teaching',
          'Spirit-Led Worship',
          'Kingdom Advancement',
          'Transformation & Discipleship',
        ],
        history: 'Replace with your actual church history through the admin panel.',
      },
    },
    {
      section: 'contact',
      data: {
        address: '[Your Church Address]',
        phone: '[Your Phone Number]',
        email: 'info@pottersapostolic.org',
        serviceTimes: '10:00 AM',
        mapUrl: 'https://maps.google.com/?q=[Your Address]',
        youtubeChannelId: '',  // Add your YouTube channel ID here
        instagramHandle: 'thepottersapostolic',  // Add your Instagram handle
        facebookPage: '',  // Add your Facebook page URL
      },
    },
  ]);

  console.log('✅ Seed complete for The Potters\' Apostolic Ministries!');
  console.log('');
  console.log('📝 Next steps:');
  console.log('1. Access admin panel at http://localhost:5173/admin');
  console.log('2. Login with: admin / church2024!');
  console.log('3. Replace placeholder content with your real data');
  console.log('4. Update YouTube channel ID and social media handles');
  console.log('');

  await client.end();
}

seed().catch((err) => {
  console.error('❌ Seed failed!', err);
  process.exit(1);
});
