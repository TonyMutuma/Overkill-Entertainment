import { MixTrack, ServicePackage, AddOnItem, FaqItem } from '../types';

export const DJ_ASSETS = {
  heroBg: '/assets/overkill-hero.jpg',
  djPortraitStudio: 'https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?q=80&w=1200&auto=format&fit=crop',
  djPerformingCrowd: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop',
  djMixerGear: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200&auto=format&fit=crop',
  clubLaser: 'https://images.unsplash.com/photo-1545128485-c400e7702796?q=80&w=1200&auto=format&fit=crop',
  corporateLounge: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop',
  festivalStage: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1200&auto=format&fit=crop',
  rooftopSunset: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop',
  luxuryWedding: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=1200&auto=format&fit=crop',
};

export const TRUST_VENUES = [
  { name: 'Cavalli Lounge', location: 'Nairobi', logo: '/assets/logos/Cavalli Lounge.png' },
  { name: 'Farenheit Lounge', location: 'Nairobi', logo: '/assets/logos/Farenheit lounge.png' },
  { name: 'Konqa', location: 'Nairobi', logo: '/assets/logos/konqa.png' },
  { name: 'Milan Lounge', location: 'Nairobi', logo: '/assets/logos/milan lounge.png' },
  { name: 'Quiver Lounge', location: 'Nairobi', logo: '/assets/logos/quiver lounge.png' },
  { name: 'Eleven Eleven Lounge', location: 'Nairobi', logo: '/assets/logos/eleveneleven lounge.png' },
  { name: 'Alchemist Lounge', location: 'Nairobi', logo: '/assets/logos/Alchemist lounge.png' },
  { name: 'The Location Lounge', location: 'Nairobi', logo: '/assets/logos/thelocationlounge.png' },
];

export const MIX_TRACKS: MixTrack[] = [
  {
    id: 'mix-1',
    title: 'Neon Nights Vol. 4',
    category: 'club',
    categoryLabel: 'Club',
    duration: '1h 45m',
    recordedAt: 'Recorded live at Muze Club, Westlands, Nairobi',
    description: 'Peak hour tech-house and heavy bassline hitters with exclusive bootlegs and continuous energy build.',
    date: 'Jan 18, 2026',
    plays: '12.4k Plays',
    bpm: 128,
    imageUrl: DJ_ASSETS.clubLaser,
    audioKey: 'tech-house',
    tags: ['Tech House', 'Afro Tech', 'Peak Hour', '128 BPM'],
    youtubeUrl: 'https://www.youtube.com/watch?v=5qap5aO4i9A',
    tracklistSnippet: [
      '01. DJ Wolverine - Overkill Intro Edit',
      '02. Chris Lake & Cloonee - Turn Off The Lights (VIP Cut)',
      '03. Fisher - Take It Off (Wolverine Heavy Drop Bootleg)',
      '04. Mau P - Gimme That Bounce (Live Club Rework)',
      '05. DJ Wolverine - Sonic Shockwave'
    ]
  },
  {
    id: 'mix-2',
    title: 'Nairobi Tech Summit Gala',
    category: 'corporate',
    categoryLabel: 'Corporate',
    duration: '2h 10m',
    recordedAt: 'Recorded live at Sarit Expo Centre, Nairobi',
    description: 'Smooth lounge transitions building up to high-energy networking anthems and sophisticated sonic branding.',
    date: 'Feb 14, 2026',
    plays: '8.2k Plays',
    bpm: 122,
    imageUrl: DJ_ASSETS.corporateLounge,
    audioKey: 'deep-melodic',
    tags: ['Deep House', 'Afro Melodic', 'Corporate Gala', '122 BPM'],
    tracklistSnippet: [
      '01. RÜFÜS DU SOL - On My Knees (Wolverine Ambient Re-Touch)',
      '02. Black Coffee & Sun-El - African Sunset',
      '03. Vintage Culture - Fractions (Live Transition)',
      '04. Peggy Gou - (It Goes Like) Nanana (Late Night VIP)',
      '05. Disclosure - Higher Than Ever Before'
    ]
  },
  {
    id: 'mix-3',
    title: 'Mainstage Coastal Mayhem',
    category: 'festival',
    categoryLabel: 'Festival',
    duration: '1h 00m',
    recordedAt: 'Recorded live at Beneath The Baobabs, Kilifi',
    description: 'Unrelenting energy from start to finish. Festival bangers, heavy drops, and unreleased VIP dubplates.',
    date: 'Dec 31, 2025',
    plays: '24.5k Plays',
    bpm: 130,
    imageUrl: DJ_ASSETS.festivalStage,
    audioKey: 'festival-energy',
    tags: ['Festival Electro', 'Afro House', 'Mainstage', '130 BPM'],
    youtubeUrl: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
    tracklistSnippet: [
      '01. DJ Wolverine - The Awakening (Festival Edit)',
      '02. Fred again.. x Skrillex - Rumble (Wolverine Overkill Mashup)',
      '03. John Summit - Where You Are (Club Extended Overdrive)',
      '04. Dom Dolla - Rhyme Dust (Heavyweight Flip)',
      '05. DJ Wolverine - Countdown to Chaos'
    ]
  },
  {
    id: 'mix-4',
    title: 'Sunset Rooftop Session',
    category: 'private',
    categoryLabel: 'Private Party',
    duration: '1h 30m',
    recordedAt: "Recorded live at Captain's Terrace, Nairobi",
    description: 'Breezy golden-hour grooves moving seamlessly into infectious rhythmic house, Amapiano blends, and nu-disco.',
    date: 'Mar 08, 2026',
    plays: '15.8k Plays',
    bpm: 124,
    imageUrl: DJ_ASSETS.rooftopSunset,
    audioKey: 'sunset-groove',
    tags: ['Nu Disco', 'Deep Grooves', 'Golden Hour', '124 BPM'],
    tracklistSnippet: [
      '01. Folamour - Sun After Rain',
      '02. Purple Disco Machine - Hypnotized (Club Dub)',
      '03. SG Lewis - Chemicals (Wolverine Re-Drum)',
      '04. Kaytranada - 10%',
      '05. Jungle - Back On 74 (Live VIP Mix)'
    ]
  },
  {
    id: 'mix-5',
    title: 'Midnight Velvet Affair',
    category: 'wedding',
    categoryLabel: 'Wedding',
    duration: '2h 45m',
    recordedAt: 'Recorded live at Enashipai Resort, Naivasha',
    description: 'Uncompromising open-format brilliance. Timeless classics, neo-soul, high-energy Afrobeats, 90s/00s R&B, and modern chart heaters.',
    date: 'Nov 22, 2025',
    plays: '10.9k Plays',
    bpm: 118,
    imageUrl: DJ_ASSETS.luxuryWedding,
    audioKey: 'wedding-open-format',
    tags: ['Open Format', 'Afrobeats', 'R&B', '118 BPM'],
    tracklistSnippet: []
  },
  {
    id: 'mix-6',
    title: 'Underground Vault 003',
    category: 'club',
    categoryLabel: 'Club',
    duration: '1h 15m',
    recordedAt: 'Recorded live at The Alchemist, Westlands, Nairobi',
    description: 'Raw, gritty UK Garage, speed house, and rolling subterranean basslines for the true heads.',
    date: 'May 16, 2026',
    plays: '18.1k Plays',
    bpm: 134,
    imageUrl: DJ_ASSETS.djPerformingCrowd,
    audioKey: 'uk-garage',
    tags: ['UK Garage', '2-Step', 'Bassline', '134 BPM'],
    tracklistSnippet: [
      '01. Sammy Virji - Find My Way (Wolverine Edit)',
      '02. Conducta - Steppers Anthem',
      '03. Interplanetary Criminal - Beat In Motion',
      '04. Overmono - So U Kno (Heavy VIP)',
      '05. DJ Wolverine - Vault Pressure'
    ]
  }
];

export const SERVICE_PACKAGES: ServicePackage[] = [
  {
    id: 'club',
    name: 'Club/Nightlife',
    tag: 'ENERGY',
    tagType: 'energy',
    price: 1500,
    pricePeriod: '/night',
    description: 'High-octane sets designed to destroy dancefloors.',
    idealFor: 'Nightclubs, Lounges, Underground Parties & Festival Stages',
      features: [
        '4-Hour Premium DJ Set',
        'Premium DJ Setup Included',
        'Custom Club Edits & Remixes',
        'Advance Venue Consultation'
      ]
  },
  {
    id: 'corporate',
    name: 'Corporate',
    tag: 'MOST POPULAR',
    tagType: 'popular',
    isPopular: true,
    price: 2800,
    pricePeriod: '/event',
    description: 'Sophisticated sonic branding for elite company events.',
    idealFor: 'Tech Summits, Product Launches, Galas & Award Banquets',
        features: [
          'Up to 6 Hours Coverage',
          'Full Professional Audio System (up to 300 guests)',
          'Wireless Microphones for Speeches',
          'Brand-Aligned Playlist Curation'
        ]
  },
  {
    id: 'wedding',
    name: 'Wedding',
    tag: 'ELEGANCE',
    tagType: 'elegance',
    price: 3500,
    pricePeriod: '/day',
    description: 'Unforgettable soundtracks for uncompromising couples.',
    idealFor: 'Luxury Weddings, Rehearsal Dinners & High-End Private Celebrations',
        features: [
          'Ceremony, Cocktail & Reception Coverage',
          'Multi-Zone Sound Coverage (Up to 3 areas)',
          'Professional MC Duties',
          'In-Depth Music Planning Sessions'
        ]
  }
];

export const ADD_ON_ITEMS: AddOnItem[] = [
  {
    id: 'extra-hour',
    name: 'Additional Performance Hour',
    price: 450,
    description: 'Extend the party past contracted hours with zero disruption.',
    iconName: 'schedule'
  },
  {
    id: 'lighting-rig',
    name: 'Concert-Grade Moving Head Lighting Rig',
    price: 650,
    description: 'Synchronized moving-head lighting, uplights & ambient haze atmosphere.',
    iconName: 'highlight'
  },
  {
    id: 'sax-accompaniment',
    name: 'Live Saxophone / Percussionist Accompaniment',
    price: 900,
    description: 'Live instrumentalist jamming alongside DJ Wolverine for intense energy.',
    iconName: 'music_note'
  },
  {
    id: 'co2-cannons',
    name: 'Dual Cryo CO2 Cannons & Cold Spark Effects',
    price: 750,
    description: 'Safe indoor/outdoor visual blast for peak drop moments.',
    iconName: 'local_fire_department'
  },
  {
    id: 'second-zone',
    name: 'Secondary Cocktail / Outdoor Wireless Audio Zone',
    price: 500,
    description: 'Dedicated sound setup for patio, terrace or cocktail foyer.',
    iconName: 'volume_up'
  }
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'Technical',
    question: 'Technical & Sound System Requirements',
      answer: 'We deliver uncompromising, room-filling sound. We arrive fully self-contained with a professional audio system sized to your guest count and venue, and we adapt seamlessly to whatever the space provides. A simple technical rider with the essentials is attached to the contract so setup is effortless. For corporate and wedding packages, the full sound system is included.'
  },
  {
    id: 'faq-2',
    category: 'Curation',
    question: 'Curation & "Do-Not-Play" Lists',
    answer: 'DJ Wolverine curates a high-octane, underground club experience. While we accept a limited brief regarding general vibe and absolute "do-not-play" tracks (maximum 10 specific songs), we do not accept detailed setlists or real-time requests. You are booking an elite curation experience; trust the architect.'
  },
  {
    id: 'faq-3',
    category: 'Policies',
    question: 'Cancellation & Deposit Policies',
    answer: 'A 50% non-refundable deposit is required to secure the date on our calendar. The remaining balance is due 14 days prior to the event. Cancellations within 30 days of the event will forfeit the full fee. In the rare event of cancellation initiated by Overkill Entertainment due to extreme circumstances, a full refund will be issued immediately.'
  },
  {
    id: 'faq-4',
    category: 'Logistics',
    question: 'Travel, Accommodation & Logistics',
    answer: 'For bookings outside a 50-mile radius of our headquarters, the client is responsible for all travel and accommodation expenses. This includes business-class airfare for two (DJ + Tour Manager), premium ground transportation, and a minimum 4-star hotel accommodation (two rooms). A full hospitality rider detailing green room requirements will be provided.'
  },
  {
    id: 'faq-5',
    category: 'Performance',
    question: 'Performance Duration & Overtime',
    answer: 'Standard performance blocks are 120–240 minutes depending on the contracted package. Extended sets are available and can be negotiated prior to contract signing or added during the event at an hourly overtime rate subject to DJ Wolverine\'s discretion.'
  },
  {
    id: 'faq-6',
    category: 'Corporate',
    question: 'Corporate Sonic Branding & Keynote Cues',
    answer: 'For corporate galas and award ceremonies, we program custom entrance stings, walk-up audio cues, and seamless background-to-keynote transitions with professional wireless ducking and flawless audio discipline.'
  },
  {
    id: 'faq-7',
    category: 'Redundancy',
    question: 'Backup Gear & Redundancy Protocol',
    answer: 'We travel with complete backup of all performance files and emergency backup hardware on-site. Zero downtime is guaranteed under our operational charter.'
  }
];

