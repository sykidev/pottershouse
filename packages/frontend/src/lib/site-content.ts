// Shared shapes + default values for CMS-managed content sections.
// Public pages use these as fallbacks; admin editors use them as initial state.

export interface LinkItem {
  label: string;
  href: string;
}

export interface FooterContent {
  aboutTitle: string;
  aboutText: string;
  facebook: string;
  instagram: string;
  youtube: string;
  quickLinks: LinkItem[];
  address: string;
  phone: string;
  email: string;
  serviceLabel: string;
  serviceTime: string;
  scripture: string;
  copyrightName: string;
}

export const FOOTER_DEFAULT: FooterContent = {
  aboutTitle: "The Potters' Apostolic Ministries",
  aboutText:
    'Molded by the Master Potter, empowered to transform lives through apostolic ministry. Everyone is welcome.',
  facebook: 'https://facebook.com/yourchurch',
  instagram: 'https://instagram.com/yourchurch',
  youtube: 'https://youtube.com/@yourchurch',
  quickLinks: [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Sermons', href: '/sermons' },
    { label: 'Events', href: '/events' },
    { label: 'Connect', href: '/connect' },
    { label: 'Give', href: '/give' },
  ],
  address: '123 Church Street, City, State 12345',
  phone: '(555) 123-4567',
  email: 'info@fncfc.org',
  serviceLabel: 'Sunday Service',
  serviceTime: '10:00 AM',
  scripture: '"We are the clay, You are the Potter" - Isaiah 64:8',
  copyrightName: "The Potters' Apostolic Ministries",
};

export interface Ministry {
  icon: string;
  title: string;
  description: string;
}

export interface ConnectContent {
  heroTitle: string;
  heroSubtitle: string;
  ministriesHeading: string;
  ministriesSubtitle: string;
  ministries: Ministry[];
  teamHeading: string;
  teamSubtitle: string;
  ctaHeading: string;
}

export const CONNECT_DEFAULT: ConnectContent = {
  heroTitle: 'Get Connected',
  heroSubtitle:
    'Faith grows in community. There is a place here for you — whether you are brand new or have been with us for years.',
  ministriesHeading: 'Ministries & Groups',
  ministriesSubtitle: 'Find a community where you can serve, grow, and belong',
  ministries: [
    { icon: 'Book', title: 'Bible Study', description: 'Wednesday evenings at 7:00 PM. Deepen your understanding of Scripture in community.' },
    { icon: 'Music', title: 'Worship Team', description: 'Join our team of musicians and singers who lead the congregation in praise each week.' },
    { icon: 'Baby', title: "Children's Ministry", description: 'Nurturing the faith of our youngest members every Sunday during the main service.' },
    { icon: 'Users', title: 'Youth Group', description: 'A vibrant community for teenagers to grow in faith, friendship, and purpose.' },
    { icon: 'HandHeart', title: 'Community Outreach', description: 'Serving our neighbors through food drives, community events, and local partnerships.' },
    { icon: 'Heart', title: 'Prayer Team', description: 'Interceding daily for the church, community, and world. All are welcome to join.' },
  ],
  teamHeading: 'Meet Our Team',
  teamSubtitle: 'Connect with our dedicated servant leaders',
  ctaHeading: 'Ready to take a next step?',
};

export interface GiveWay {
  heading: string;
  accountName: string;
  accountNumber: string;
  bank: string;
  currency: string;
  swift: string;
}

export interface GiveContent {
  heroTitle: string;
  heroSubtitle: string;
  intro: string;
  ways: GiveWay[];
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
};
