// Shared shapes + default values for CMS-managed content sections.
// Public pages use these as fallbacks; admin editors use them as initial state.

export interface LinkItem {
  label: string;
  href: string;
}

export interface FooterContent {
  aboutTitle: string;
  aboutText: string;
  socials: SocialLink[];
  quickLinks: LinkItem[];
  scripture: string;
  copyrightName: string;
}

export const FOOTER_DEFAULT: FooterContent = {
  aboutTitle: "The Potters' Apostolic Ministries",
  aboutText:
    'Molded by the Master Potter, empowered to transform lives through apostolic ministry. Everyone is welcome.',
  socials: [
    { label: 'Instagram', url: 'https://www.instagram.com/thepottersapostolicministries/' },
    { label: 'Facebook', url: 'https://www.facebook.com/pottersapostolicministries/' },
    { label: 'Telegram', url: 'https://t.me/thepottersapostolic' },
    { label: 'Mixlr', url: 'http://thepottersglobal.mixlr.com' },
  ],
  quickLinks: [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Sermons', href: '/sermons' },
    { label: 'Events', href: '/events' },
    { label: 'Visit Us', href: '/visit' },
    { label: 'Ministries', href: '/ministries' },
    { label: 'Give', href: '/give' },
  ],
  scripture: '"We are the clay, You are the Potter" - Isaiah 64:8',
  copyrightName: "The Potters' Apostolic Ministries",
};

export interface Ministry {
  icon: string;
  title: string;
  description: string;
}

export interface ServiceTime {
  day: string;
  name: string;
  time: string;
}

export interface VisitContent {
  heroTitle: string;
  heroSubtitle: string;
  churchName: string;
  address: string;
  postalCode: string;
  phones: string[];
  email: string;
  servicesHeading: string;
  services: ServiceTime[];
  ctaHeading: string;
}

export const VISIT_DEFAULT: VisitContent = {
  heroTitle: 'Visit Us',
  heroSubtitle:
    "We'd love to welcome you in person. Here's everything you need to plan your visit and join us for a service.",
  churchName: "The Potter's Family Church",
  address: 'No. 8, Chikun Street, Opposite Water Board, Sabo, Kaduna, Nigeria',
  postalCode: '800242',
  phones: ['+234 (0) 814 411 9532', '+234 (0) 703 876 6165'],
  email: '',
  servicesHeading: 'Service Schedule',
  services: [
    { day: 'Wednesday', name: 'Special Prayer Service', time: '5:00 PM WAT' },
    { day: 'Friday', name: "Believers' Congress", time: '5:00 PM WAT' },
    { day: 'Second Friday of Every Month', name: 'Night of Answers', time: '10:00 PM WAT until Dawn' },
    { day: 'Sunday', name: 'Worship and Power Service', time: '9:00 AM WAT' },
  ],
  ctaHeading: "We'd love to see you this week",
};

export interface MinistriesContent {
  heroTitle: string;
  heroSubtitle: string;
  ministriesHeading: string;
  ministriesSubtitle: string;
  ministries: Ministry[];
  teamHeading: string;
  teamSubtitle: string;
}

export const MINISTRIES_DEFAULT: MinistriesContent = {
  heroTitle: 'Our Ministries',
  heroSubtitle:
    'Faith grows in community. There is a place here for you — whether you are brand new or have been with us for years.',
  ministriesHeading: 'Ministries & Groups',
  ministriesSubtitle: 'Find a community where you can serve, grow, and belong',
  ministries: [
    { icon: 'Users', title: 'Men of Power', description: 'An exclusive platform for married men aimed at raising iconic men, responsible husbands, and quality fathers who excel both at home and in society.' },
    { icon: 'Heart', title: 'Ladies Forum', description: 'A ministry for ladies, whether married or unmarried, helping them become lights wherever they find themselves according to Matthew 5:14.' },
    { icon: 'Sparkles', title: "Teens' Club", description: "A structure dedicated to nurturing young people, helping them understand God's Word and walk in their God-ordained purpose." },
    { icon: 'Book', title: 'School of Basic Leadership and Discipleship (SBLD)', description: "A training platform where church workers learn the ministry's core values, leadership skills, and practical life principles for both spiritual and secular success." },
    { icon: 'Book', title: "The Potter's School of Ministry and Mentorship (TPSOMM)", description: 'A ministry training institution for ministers, protégés, sons, and daughters in the faith. It provides scriptural training and practical lessons in ministry, finance, family life, and leadership.' },
    { icon: 'HandHeart', title: 'Crusade and Outreach Ministry', description: 'Church outreach and evangelism ministry dedicated to reaching communities with the Gospel.' },
  ],
  teamHeading: 'Meet Our Team',
  teamSubtitle: 'Connect with our dedicated servant leaders',
};

export interface GiveWay {
  heading: string;
  accountName: string;
  accountNumber: string;
  bank: string;
  currency: string;
  swift: string;
}

export interface SocialLink {
  label: string;
  url: string;
}

export interface GiveContent {
  heroTitle: string;
  heroSubtitle: string;
  intro: string;
  ways: GiveWay[];
  contactHeading: string;
  contactText: string;
  phones: string[];
  social: SocialLink[];
}

export const GIVE_DEFAULT: GiveContent = {
  heroTitle: 'Giving & Partnership',
  heroSubtitle:
    'Partner with us as we transform lives through apostolic ministry. Your generosity advances the work of the Kingdom.',
  intro:
    'Thank you for your heart to give. Below are the ways you can support the ministry through tithes, offerings, and project giving.',
  ways: [
    { heading: 'Project Account', accountName: "Potter's Apostolic Outreach Project", accountNumber: '0642660733', bank: 'Guaranty Trust Bank (GTB)', currency: 'Naira', swift: '' },
    { heading: 'Building Project Account', accountName: "Potter's Apostolic Outreach Building Project", accountNumber: '8893788026', bank: 'FCMB', currency: 'Naira', swift: '' },
    { heading: 'Tithes and Offerings (Dollar)', accountName: "Potter's Apostolic Outreach", accountNumber: '0725742066', bank: 'Guaranty Trust Bank (GTB)', currency: 'USD', swift: 'GTBINGLA' },
    { heading: 'Tithes and Offerings (Naira)', accountName: "Potter's Apostolic Outreach", accountNumber: '0431522925', bank: 'Guaranty Trust Bank (GTB)', currency: 'Naira', swift: '' },
  ],
  contactHeading: 'Need More Information?',
  contactText: 'For more information about giving, please contact the church office.',
  phones: ['+234 (0) 814 411 9532', '+234 (0) 703 876 6165'],
  social: [
    { label: 'Instagram', url: 'https://www.instagram.com/thepottersapostolicministries/' },
    { label: 'Facebook', url: 'https://www.facebook.com/pottersapostolicministries/' },
    { label: 'Telegram', url: 'https://t.me/thepottersapostolic' },
    { label: 'Mixlr', url: 'http://thepottersglobal.mixlr.com' },
  ],
};
