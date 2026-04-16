export const tokens = {
  bg: '#f4ede0',
  bgDeep: '#ebe0cc',
  ink: '#2a2320',
  inkSoft: '#5a4e45',
  accent: '#b84a2f',
  accentDeep: '#8a3322',
  gold: '#c89a3e',
  sage: '#6b8562',
  sky: '#7a98a8',
  plum: '#8a5a78',
};

export type Area = {
  id: string;
  label: string;
  iconName: 'HandHeart' | 'BookOpen' | 'Users' | 'Globe' | 'Heart';
  color: string;
  cards: { id: string; text: string }[];
};

export const AREAS: Area[] = [
  {
    id: 'prayer',
    label: 'Prayer',
    iconName: 'HandHeart',
    color: tokens.accent,
    cards: [
      { id: 'p1', text: 'I pray daily and it feels alive' },
      { id: 'p2', text: 'I pray, but it feels like a monologue' },
      { id: 'p3', text: 'I mostly pray in crisis mode' },
      { id: 'p4', text: "I've been dry lately" },
      { id: 'p5', text: 'I want to start again' },
    ],
  },
  {
    id: 'word',
    label: "God's Word",
    iconName: 'BookOpen',
    color: tokens.sage,
    cards: [
      { id: 'w1', text: "I'm in the Word most days and it's feeding me" },
      { id: 'w2', text: 'I read it, but it feels like homework' },
      { id: 'w3', text: 'I read it on Sundays, rarely otherwise' },
      { id: 'w4', text: "I haven't opened it in a while" },
      { id: 'w5', text: 'I want to rebuild the habit' },
    ],
  },
  {
    id: 'service',
    label: 'Church Service',
    iconName: 'Users',
    color: tokens.sky,
    cards: [
      { id: 's1', text: "I'm there nearly every week, fully present" },
      { id: 's2', text: 'I show up, but my mind wanders' },
      { id: 's3', text: 'I come when I can' },
      { id: 's4', text: "I've been drifting away" },
      { id: 's5', text: 'I want to recommit to being there' },
    ],
  },
  {
    id: 'missions',
    label: 'Missions',
    iconName: 'Globe',
    color: tokens.gold,
    cards: [
      { id: 'm1', text: "I'm actively involved in mission work" },
      { id: 'm2', text: 'I support missions from a distance' },
      { id: 'm3', text: "I care, but I don't really do anything" },
      { id: 'm4', text: "I haven't thought much about it" },
      { id: 'm5', text: 'I want to explore what my part could be' },
    ],
  },
  {
    id: 'serving',
    label: 'Serving Others',
    iconName: 'Heart',
    color: tokens.plum,
    cards: [
      { id: 'sv1', text: "I'm serving regularly and it brings me joy" },
      { id: 'sv2', text: 'I serve, but sometimes out of obligation' },
      { id: 'sv3', text: 'I serve when asked' },
      { id: 'sv4', text: "I've stepped back from serving" },
      { id: 'sv5', text: 'I want to find my place to serve' },
    ],
  },
];

export const BINGO_TILES = [
  { id: 'b1', icon: '🍲', label: 'Combined lifegroup potluck' },
  { id: 'b2', icon: '⛰️', label: 'Hiking retreat together' },
  { id: 'b3', icon: '🙏', label: 'Prayer walk in the neighbourhood' },
  { id: 'b4', icon: '🏠', label: 'Serve at a shelter' },
  { id: 'b5', icon: '✝️', label: 'Testimony night' },
  { id: 'b6', icon: '🍞', label: 'Cook for a widow / elderly' },
  { id: 'b7', icon: '📖', label: 'Book study together' },
  { id: 'b8', icon: '🎶', label: 'Worship night at home' },
  { id: 'b9', icon: '🌏', label: 'Short mission trip' },
  { id: 'b10', icon: '👶', label: 'Family-inclusive gathering' },
  { id: 'b11', icon: '☕', label: 'Coffee + deep talk pairs' },
  { id: 'b12', icon: '🧒', label: "Serve a children's home" },
  { id: 'b13', icon: '💌', label: 'Write encouragement letters' },
  { id: 'b14', icon: '🌊', label: 'Baptism celebration trip' },
  { id: 'b15', icon: '🎨', label: 'Creative / arts night' },
  { id: 'b16', icon: '🏃', label: 'Fitness + devotion combo' },
  { id: 'b17', icon: '🍳', label: 'Breakfast before church' },
  { id: 'b18', icon: '📱', label: 'Digital fast weekend' },
  { id: 'b19', icon: '🚗', label: 'Visit another lifegroup' },
  { id: 'b20', icon: '🌱', label: 'Plant something together' },
  { id: 'b21', icon: '🎁', label: 'Secret blessing exchange' },
  { id: 'b22', icon: '🍽️', label: 'Host a seeker dinner' },
  { id: 'b23', icon: '💭', label: 'Vision-casting retreat' },
  { id: 'b24', icon: '✍️', label: 'Wildcard — write your own' },
];

export const KID_MISSIONS = [
  { id: 'k1', icon: '🤗', text: 'Give someone in lifegroup a big hug tonight' },
  { id: 'k2', icon: '💬', text: 'Tell someone one thing you love about them' },
  { id: 'k3', icon: '🙏', text: 'Pray out loud for one person here' },
  { id: 'k4', icon: '😄', text: 'Make someone laugh with a joke' },
  { id: 'k5', icon: '🎨', text: 'Draw a picture for a friend' },
  { id: 'k6', icon: '👂', text: 'Listen to someone without talking for 1 min' },
  { id: 'k7', icon: '🎁', text: 'Find something nice to say to an adult' },
  { id: 'k8', icon: '🤝', text: 'Help tidy up after the meeting' },
  { id: 'k9', icon: '🌟', text: 'Tell someone you are thankful for them' },
  { id: 'k10', icon: '📖', text: 'Share your favourite Bible story with someone' },
];

export const GROUP_ID = process.env.NEXT_PUBLIC_GROUP_ID || 'default';
