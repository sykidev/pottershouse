import { db, client } from './index.js';
import { sermons, events, announcements, team, content } from './schema.js';

async function seed() {
  console.log('Seeding database...');

  await db.insert(sermons).values([
    {
      title: 'Walking in Faith',
      speaker: 'Pastor John Smith',
      date: '2026-06-07',
      description: 'A powerful message about trusting God in uncertain times and walking by faith, not by sight.',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      imageUrl: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800',
    },
    {
      title: 'The Power of Prayer',
      speaker: 'Pastor Sarah Johnson',
      date: '2026-05-31',
      description: 'Discovering the transformative power of prayer and building a deeper relationship with God.',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      imageUrl: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800',
    },
    {
      title: 'Living with Purpose',
      speaker: 'Pastor John Smith',
      date: '2026-05-24',
      description: 'Understanding Gods calling on your life and living each day with intentional purpose.',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      imageUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800',
    },
  ]);

  await db.insert(events).values([
    {
      title: 'Sunday Worship Service',
      description: 'Join us for our weekly worship service filled with praise, worship, and biblical teaching.',
      date: '2026-06-14',
      time: '10:00 AM',
      location: 'Main Sanctuary',
      imageUrl: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800',
    },
    {
      title: 'Youth Group Meeting',
      description: 'A time for our youth to connect, grow in faith, and have fun together.',
      date: '2026-06-15',
      time: '6:00 PM',
      location: 'Youth Center',
      imageUrl: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800',
    },
    {
      title: 'Community Outreach',
      description: 'Join us as we serve our local community with food distribution and prayer.',
      date: '2026-06-18',
      time: '9:00 AM',
      location: 'Community Center',
      imageUrl: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800',
    },
    {
      title: 'Bible Study',
      description: 'Deep dive into the Word of God with guided discussion and fellowship.',
      date: '2026-06-19',
      time: '7:00 PM',
      location: 'Fellowship Hall',
      imageUrl: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800',
    },
  ]);

  await db.insert(announcements).values([
    {
      title: 'Welcome to Our New Website!',
      body: 'We are excited to launch our new church website. Explore sermons, events, and connect with our community online.',
      active: true,
    },
    {
      title: 'Summer Camp Registration Open',
      body: 'Registration is now open for our annual summer youth camp. Limited spots available!',
      active: false,
    },
    {
      title: 'Volunteer Opportunities',
      body: 'We are looking for volunteers to help with our weekly food pantry. Contact the office if interested.',
      active: false,
    },
  ]);

  await db.insert(team).values([
    {
      name: 'Pastor John Smith',
      role: 'Senior Pastor',
      bio: 'Pastor John has been serving our church for over 15 years, bringing biblical wisdom and compassionate leadership to our community.',
      imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
    },
    {
      name: 'Pastor Sarah Johnson',
      role: 'Associate Pastor',
      bio: 'Pastor Sarah leads our worship ministry and youth programs with passion and dedication to seeing lives transformed.',
      imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
    },
    {
      name: 'David Chen',
      role: 'Worship Leader',
      bio: 'David brings his musical talents and heart for worship to lead our congregation in praise every Sunday.',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    },
  ]);

  await db.insert(content).values([
    {
      section: 'home.hero',
      data: {
        title: 'First Nation Christian Fellowship Church',
        subtitle: 'A community of faith, hope, and love',
        ctaText: 'Get Connected',
        ctaLink: '/contact',
        backgroundImage: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1920',
      },
    },
    {
      section: 'about',
      data: {
        title: 'About Us',
        mission: 'Our mission is to glorify God by making disciples of Jesus Christ who love God and love people.',
        vision: 'We envision a community transformed by the gospel, where people experience the life-changing power of Jesus Christ.',
        values: [
          'Biblical Teaching',
          'Authentic Worship',
          'Compassionate Service',
          'Intentional Discipleship',
        ],
      },
    },
    {
      section: 'contact',
      data: {
        address: '123 Faith Street, Your City, ST 12345',
        phone: '(555) 123-4567',
        email: 'info@fncfc.org',
        serviceTimes: '10:00 AM',
        mapUrl: 'https://maps.google.com/?q=123+Faith+Street',
      },
    },
  ]);

  console.log('Seed complete!');
  await client.end();
}

seed().catch((err) => {
  console.error('Seed failed!', err);
  process.exit(1);
});
