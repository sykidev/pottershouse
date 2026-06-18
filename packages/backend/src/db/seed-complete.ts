import { db, client } from './index.js';
import { sermons, events, announcements, team, content } from './schema.js';

/**
 * Complete seed script for The Potter's Family Church
 * Based on actual church data from the content document
 */

async function seed() {
  console.log('Seeding complete data for The Potter\'s Family Church...');

  // Clear existing data
  await db.delete(content);
  await db.delete(team);
  await db.delete(announcements);
  await db.delete(events);
  await db.delete(sermons);

  // Real Events
  await db.insert(events).values([
    {
      title: 'Special Prayer Service',
      description: 'Join us for our weekly prayer service as we seek God\'s face together.',
      date: '2026-06-18', // Next Wednesday
      time: '5:00 PM WAT',
      location: 'No. 8, Chikun Street, Opposite Water Board, Sabo, Kaduna',
      imageUrl: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800',
    },
    {
      title: 'Believers\' Congress',
      description: 'A gathering of believers for powerful teaching and fellowship.',
      date: '2026-06-20', // Next Friday
      time: '5:00 PM WAT',
      location: 'No. 8, Chikun Street, Opposite Water Board, Sabo, Kaduna',
      imageUrl: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800',
    },
    {
      title: 'Night of Answers',
      description: 'Our monthly all-night prayer and worship service. Experience breakthrough and divine answers.',
      date: '2026-07-11', // Second Friday of July
      time: '10:00 PM WAT',
      location: 'The Potter\'s Place, 8 Chikun Street, Sabo, Kaduna',
      imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800',
    },
    {
      title: 'Sunday Worship and Power Service',
      description: 'Join us for powerful worship, apostolic teaching, and divine encounters every Sunday.',
      date: '2026-06-22', // Next Sunday
      time: '9:00 AM WAT',
      location: 'The Potter\'s Place, 8 Chikun Street, Opposite Water Board, Sabo, Kaduna',
      imageUrl: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800',
    },
  ]);

  // Announcements
  await db.insert(announcements).values([
    {
      title: 'Welcome to The Potter\'s Family Church!',
      body: 'We are the clay, You are the Potter. Join us as we experience transformation through apostolic ministry. Founded in 2013, we are raising icons who are kingdom functionaries bearing the end-time revival fire.',
      active: true,
    },
    {
      title: 'Night of Answers - Second Friday',
      body: 'Don\'t miss our monthly Night of Answers! Join us on the second Friday of every month at 10:00 PM WAT for an all-night service of prayer, worship, and divine breakthroughs.',
      active: true,
    },
    {
      title: 'School of Ministry and Mentorship',
      body: 'TPSOMM is now enrolling! A ministry training institution for ministers and believers. Learn scriptural training, ministry principles, finance, family life, and leadership.',
      active: false,
    },
  ]);

  // Leadership Team
  await db.insert(team).values([
    {
      name: 'Apostle Ezekiel Jesufunmi',
      role: 'Lead Pastor',
      bio: 'Born on July 7, 1977, in Kaduna, Nigeria. Apostle Ezekiel attended Federal College of Education, Zaria (1995–1999) and obtained a Bachelor\'s Degree in Archaeology from Ahmadu Bello University, Zaria (2002–2006). He became born again in 1992 and has served under Dr. John Akpami since 1994. He began experiencing profound spiritual encounters and scriptural insight from 1997 onward. Together with his wife Rev. Mrs. Faith Jesufunmi, he founded The Potter\'s Apostolic Ministries in 2013.',
      imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
    },
    {
      name: 'Rev. Mrs. Faith Jesufunmi',
      role: 'Co-Lead Pastor',
      bio: 'Rev. Mrs. Faith Jesufunmi met her husband at Ahmadu Bello University and has been instrumental in the founding and growth of The Potter\'s Apostolic Ministries since 2013. Together they lead The Potter\'s Family Church with passion and dedication.',
      imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
    },
    {
      name: 'Minister Emmanuel Benjamin',
      role: 'Minister',
      bio: 'Minister Emmanuel Benjamin oversees the Counselling and Follow-up Team, Youth Church, and Drama Team at The Potter\'s Family Church.',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    },
    {
      name: 'Minister AbdulHamid Salau',
      role: 'Minister',
      bio: 'Minister AbdulHamid Salau is responsible for Logistics and Protocol as well as the Media Department at The Potter\'s Family Church.',
      imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    },
    {
      name: 'Minister Bolaji Ray',
      role: 'Minister',
      bio: 'Minister Bolaji Ray leads the Prayer Squad and oversees the Ushering Department at The Potter\'s Family Church.',
      imageUrl: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400',
    },
  ]);

  // Content sections
  await db.insert(content).values([
    {
      section: 'home.hero',
      data: {
        title: 'The Potter\'s Family Church',
        subtitle: 'Molded by the Master Potter, Transforming Lives Through Apostolic Ministry',
        ctaText: 'Join Us This Sunday',
        ctaLink: '/connect',
        backgroundImage: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1920',
      },
    },
    {
      section: 'about',
      data: {
        title: 'About The Potter\'s Family Church',
        mission: 'To propagate the undeniable wisdom and evident power of God which is able to make men, connecting them back to their God-ordained destiny (Jeremiah 18:1-6; 1 Corinthians 1:24).',
        vision: 'To raise icons of all sorts who are kingdom functionaries bearing the end-time revival fire.',
        values: [
          'Prayer',
          'Word',
          'Worship',
          'Fellowship',
          'Quality Family Life',
          'Excellence',
        ],
        history: 'The Potter\'s Apostolic Ministries was founded in 2013 with lead pastors Apostle Ezekiel Jesufunmi and Rev. Mrs. Faith Jesufunmi. The Potter\'s Family Church is an arm of The Potter\'s Apostolic Ministries which began by the instruction of the Holy Spirit on March 4, 2019. The ministry has recorded diverse miracles, healings, and divine interventions and has impacted many lives within and beyond Nigeria through outreach and mission programs, musical concerts, School of Ministry and Mentorship, and School of Basic Leadership and Discipleship.',
      },
    },
    {
      section: 'contact',
      data: {
        address: 'No. 8, Chikun Street, Opposite Water Board, Sabo, Kaduna, Nigeria 800242',
        phone: '+234 (0) 814 411 9532',
        phone2: '+234 (0) 703 876 6165',
        email: 'info@pottersfamilychurch.org',
        serviceTimes: '9:00 AM',
        mapUrl: 'https://maps.google.com/?q=8+Chikun+Street+Sabo+Kaduna+Nigeria',
        youtubeChannelId: '',
        instagramHandle: 'thepottersapostolicministries',
        instagramUrl: 'https://www.instagram.com/thepottersapostolicministries/',
        facebookUrl: 'https://www.facebook.com/pottersapostolicministries/',
        telegramUrl: 'https://t.me/thepottersapostolic',
        mixlrUrl: 'http://thepottersglobal.mixlr.com',
      },
    },
    {
      section: 'giving',
      data: {
        accounts: [
          {
            name: 'Tithes and Offerings (Naira)',
            accountName: 'Potter\'s Apostolic Outreach',
            accountNumber: '0431522925',
            bank: 'Guaranty Trust Bank (GTB)',
            currency: 'NGN',
          },
          {
            name: 'Tithes and Offerings (Dollar)',
            accountName: 'Potter\'s Apostolic Outreach',
            accountNumber: '0725742066',
            bank: 'Guaranty Trust Bank (GTB)',
            swiftCode: 'GTBINGLA',
            currency: 'USD',
          },
          {
            name: 'Building Project',
            accountName: 'Potter\'s Apostolic Outreach Building Project',
            accountNumber: '8893788026',
            bank: 'FCMB',
            currency: 'NGN',
          },
          {
            name: 'Project Account',
            accountName: 'Potter\'s Apostolic Outreach Project',
            accountNumber: '0642660733',
            bank: 'Guaranty Trust Bank (GTB)',
            currency: 'NGN',
          },
        ],
      },
    },
    {
      section: 'ministries',
      data: {
        ministries: [
          {
            name: 'Men of Power',
            description: 'An exclusive platform for married men aimed at raising iconic men, responsible husbands, and quality fathers who excel both at home and in society.',
            icon: 'users',
          },
          {
            name: 'Ladies Forum',
            description: 'A ministry for ladies, whether married or unmarried, helping them become lights wherever they find themselves according to Matthew 5:14.',
            icon: 'heart',
          },
          {
            name: 'Teens\' Club',
            description: 'A structure dedicated to nurturing young people, helping them understand God\'s Word and walk in their God-ordained purpose.',
            icon: 'sparkles',
          },
          {
            name: 'School of Basic Leadership and Discipleship (SBLD)',
            description: 'A training platform where church workers learn the ministry\'s core values, leadership skills, and practical life principles for both spiritual and secular success.',
            icon: 'book-open',
          },
          {
            name: 'The Potter\'s School of Ministry and Mentorship (TPSOMM)',
            description: 'A ministry training institution for ministers, protégés, sons, and daughters in the faith. It provides scriptural training and practical lessons in ministry, finance, family life, and leadership.',
            icon: 'graduation-cap',
          },
          {
            name: 'Crusade and Outreach',
            description: 'Church outreach and evangelism ministry dedicated to reaching communities with the Gospel.',
            icon: 'globe',
          },
        ],
      },
    },
    {
      section: 'schedule',
      data: {
        services: [
          {
            day: 'Wednesday',
            name: 'Special Prayer Service',
            time: '5:00 PM WAT',
          },
          {
            day: 'Friday',
            name: 'Believers\' Congress',
            time: '5:00 PM WAT',
          },
          {
            day: 'Second Friday',
            name: 'Night of Answers',
            time: '10:00 PM WAT',
            note: 'All night service until dawn',
          },
          {
            day: 'Sunday',
            name: 'Worship and Power Service',
            time: '9:00 AM WAT',
          },
        ],
      },
    },
    {
      section: 'faq',
      data: {
        faqs: [
          {
            question: 'What is the Difference Between TPAM and TPFC?',
            answer: 'TPAM (The Potter\'s Apostolic Ministries) is the umbrella ministry under which various ministry expressions operate, including Potter\'s Family Church, Scholarship Programs, Skill Acquisition and Empowerment Schemes, Rural and Urban Gospel Outreaches, School of Ministry and Mentorship, and School of Basic Leadership and Discipleship. TPFC (The Potter\'s Family Church) is the church arm of the ministry where believers gather for quality teaching of God\'s Word, fervent prayer, undiluted worship, and genuine fellowship. The church community is focused on raising believers who carry the end-time revival fire.',
          },
        ],
      },
    },
  ]);

  console.log('✅ Complete seed data added successfully!');
  console.log('');
  console.log('📝 Data added:');
  console.log('- 4 upcoming events');
  console.log('- 3 announcements');
  console.log('- 5 leadership team members');
  console.log('- Complete content sections (about, contact, giving, ministries, schedule, FAQ)');
  console.log('');
  console.log('🌐 Next steps:');
  console.log('1. Access the website at http://localhost:5173');
  console.log('2. Login to admin at http://localhost:5173/admin');
  console.log('3. Add sermon videos via admin panel');
  console.log('4. Upload team member photos');
  console.log('5. Add YouTube channel ID for sermon feed');
  console.log('');

  await client.end();
}

seed().catch((err) => {
  console.error('❌ Seed failed!', err);
  process.exit(1);
});
