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
  { name: 'MUZE CLUB', location: 'Westlands, Nairobi' },
  { name: 'THE ALCHEMIST', location: 'Westlands, Nairobi' },
  { name: 'BENEATH THE BAOBABS', location: 'Kilifi Coast' },
  { name: 'WATERFRONT KAREN', location: 'Karen, Nairobi' },
  { name: 'CARNIVORE GROUNDS', location: 'Nairobi' },
  { name: 'DIANI BEACH CLUB', location: 'South Coast' },
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
  }
];
