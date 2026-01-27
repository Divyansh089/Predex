// Dummy data for Predex prediction market platform

export interface Market {
  id: string;
  title: string;
  image?: string;
  category: string;
  subcategory?: string;
  outcomes: Outcome[];
  volume: number;
  liquidity: number;
  endDate: string;
  isNew?: boolean;
  isLive?: boolean;
  liveStatus?: string;
  description?: string;
  priceHistory?: PricePoint[];
}

export interface Outcome {
  id: string;
  label: string;
  probability: number;
  price: number;
  change24h?: number;
}

export interface PricePoint {
  timestamp: string;
  price: number;
}

export interface LeaderboardUser {
  rank: number;
  username: string;
  avatar?: string;
  address?: string;
  profitLoss: number;
  volume: number;
  isCurrentUser?: boolean;
}

export interface BiggestWin {
  username: string;
  avatar?: string;
  market: string;
  initialValue: number;
  finalValue: number;
}

export interface RewardMarket {
  id: string;
  title: string;
  image?: string;
  maxSpread: number;
  minShares: number;
  reward: number;
  competition: number;
  earnings: number;
  yesPrice: number;
  noPrice: number;
}

export const categories = [
  { id: 'all', label: 'All' },
  { id: 'politics', label: 'Politics' },
  { id: 'sports', label: 'Sports' },
  { id: 'crypto', label: 'Crypto' },
  { id: 'finance', label: 'Finance' },
  { id: 'geopolitics', label: 'Geopolitics' },
  { id: 'tech', label: 'Tech' },
  { id: 'culture', label: 'Culture' },
  { id: 'economy', label: 'Economy' },
  { id: 'science', label: 'Science' },
];

export const subcategories = [
  'Trending',
  'Breaking',
  'New',
  'Super Bowl',
  'Elections',
  'AI',
  'Bitcoin',
  'Stocks',
  'Climate',
];

export const markets: Market[] = [
  {
    id: '1',
    title: 'Seahawks vs Patriots - Super Bowl Winner?',
    category: 'sports',
    subcategory: 'Super Bowl',
    outcomes: [
      { id: '1a', label: 'Seahawks', probability: 67, price: 0.67 },
      { id: '1b', label: 'Patriots', probability: 34, price: 0.34 },
    ],
    volume: 846000,
    liquidity: 125000,
    endDate: 'Feb 09, 5:00 AM',
    description: 'Who will win Super Bowl LX?',
  },
  {
    id: '2',
    title: 'US Government shutdown Saturday?',
    category: 'politics',
    outcomes: [
      { id: '2a', label: 'Yes', probability: 80, price: 0.80, change24h: 5 },
      { id: '2b', label: 'No', probability: 20, price: 0.20, change24h: -5 },
    ],
    volume: 9000000,
    liquidity: 450000,
    endDate: 'Jan 27, 2026',
    isNew: true,
  },
  {
    id: '3',
    title: 'How many inches of snow in NYC this weekend? (Jan 24-26)',
    category: 'science',
    outcomes: [
      { id: '3a', label: '10-12', probability: 93, price: 0.93, change24h: 43 },
      { id: '3b', label: '12-14', probability: 5, price: 0.05, change24h: -30 },
      { id: '3c', label: '14+', probability: 1, price: 0.01, change24h: -8 },
    ],
    volume: 1000000,
    liquidity: 85000,
    endDate: 'Jan 26, 2026',
    description: 'The prediction is for Central Park, NYC official measurement.',
    priceHistory: [
      { timestamp: 'Jan 23', price: 25 },
      { timestamp: 'Jan 24', price: 45 },
      { timestamp: 'Jan 25', price: 72 },
      { timestamp: 'Jan 26', price: 93 },
    ],
  },
  {
    id: '4',
    title: 'Pacers vs Hawks - NBA Winner Tonight?',
    category: 'sports',
    isLive: true,
    liveStatus: 'End Q1',
    outcomes: [
      { id: '4a', label: 'Pacers', probability: 45, price: 0.45 },
      { id: '4b', label: 'Hawks', probability: 56, price: 0.56 },
    ],
    volume: 2000000,
    liquidity: 180000,
    endDate: 'Tonight',
  },
  {
    id: '5',
    title: '76ers vs Hornets - NBA Winner?',
    category: 'sports',
    outcomes: [
      { id: '5a', label: '76ers', probability: 46, price: 0.46 },
      { id: '5b', label: 'Hornets', probability: 55, price: 0.55 },
    ],
    volume: 2000000,
    liquidity: 165000,
    endDate: '1:30 AM',
  },
  {
    id: '6',
    title: 'Everton vs Leeds United FC - EPL Winner?',
    category: 'sports',
    outcomes: [
      { id: '6a', label: 'Everton', probability: 38, price: 0.38 },
      { id: '6b', label: 'Draw', probability: 30, price: 0.30 },
      { id: '6c', label: 'Leeds', probability: 32, price: 0.32 },
    ],
    volume: 1000000,
    liquidity: 95000,
    endDate: '1:30 AM',
  },
  {
    id: '7',
    title: 'S&P 500 (SPX) Up or Down on January 26?',
    category: 'finance',
    isNew: true,
    outcomes: [
      { id: '7a', label: 'Up', probability: 98, price: 0.98 },
      { id: '7b', label: 'Down', probability: 2, price: 0.02 },
    ],
    volume: 189000,
    liquidity: 45000,
    endDate: 'Jan 26, 2026',
  },
  {
    id: '8',
    title: 'Minneapolis Border Patrol shooter charged?',
    category: 'politics',
    isNew: true,
    outcomes: [
      { id: '8a', label: 'Yes', probability: 37, price: 0.37 },
      { id: '8b', label: 'No', probability: 63, price: 0.63 },
    ],
    volume: 173000,
    liquidity: 28000,
    endDate: 'Feb 15, 2026',
  },
  {
    id: '9',
    title: 'How long will the Government Shutdown last?',
    category: 'politics',
    isNew: true,
    outcomes: [
      { id: '9a', label: '1+ day', probability: 79, price: 0.79 },
      { id: '9b', label: '3+ days', probability: 76, price: 0.76 },
      { id: '9c', label: '1+ week', probability: 45, price: 0.45 },
    ],
    volume: 306000,
    liquidity: 67000,
    endDate: 'TBD',
  },
  {
    id: '10',
    title: 'Will Bitcoin reach $100k before February 2026?',
    category: 'crypto',
    outcomes: [
      { id: '10a', label: 'Yes', probability: 72, price: 0.72 },
      { id: '10b', label: 'No', probability: 28, price: 0.28 },
    ],
    volume: 5200000,
    liquidity: 890000,
    endDate: 'Feb 01, 2026',
  },
  {
    id: '11',
    title: 'Fed Interest Rate Decision - January Meeting?',
    category: 'economy',
    outcomes: [
      { id: '11a', label: 'Hold', probability: 88, price: 0.88 },
      { id: '11b', label: 'Cut 25bps', probability: 10, price: 0.10 },
      { id: '11c', label: 'Hike', probability: 2, price: 0.02 },
    ],
    volume: 3400000,
    liquidity: 520000,
    endDate: 'Jan 29, 2026',
  },
  {
    id: '12',
    title: 'Will GPT-5 be announced in Q1 2026?',
    category: 'tech',
    outcomes: [
      { id: '12a', label: 'Yes', probability: 45, price: 0.45 },
      { id: '12b', label: 'No', probability: 55, price: 0.55 },
    ],
    volume: 890000,
    liquidity: 156000,
    endDate: 'Mar 31, 2026',
  },
];

export const leaderboardData: LeaderboardUser[] = [
  { rank: 1, username: 'cryptoKing42', profitLoss: 5570211, volume: 100299083 },
  { rank: 2, username: '432614799197', profitLoss: 3827813, volume: 75554856 },
  { rank: 3, username: '0x006cc834...17296836733', address: '0x006cc834Cc092684F1B56626E23BEdB3835c16ea', profitLoss: 3817172, volume: 37178741 },
  { rank: 4, username: 'predictionPro', profitLoss: 2236806, volume: 31631192 },
  { rank: 5, username: 'marketMaven', profitLoss: 1892445, volume: 28456000 },
  { rank: 6, username: 'betBoss2024', profitLoss: 1654332, volume: 24532100 },
  { rank: 7, username: 'traderX', profitLoss: 1432876, volume: 19876543 },
  { rank: 8, username: 'polyWhale', profitLoss: 1234567, volume: 18234567 },
  { rank: 9, username: 'smartBet', profitLoss: 987654, volume: 15678900 },
  { rank: 10, username: 'riskTaker', profitLoss: 876543, volume: 12345678 },
];

export const biggestWins: BiggestWin[] = [
  { username: 'beachboy4', market: 'Real Sociedad de Fút...', initialValue: 2701565, finalValue: 6947364 },
  { username: 'beachboy4', market: 'Tottenham Hotspur F...', initialValue: 3322439, finalValue: 6809952 },
  { username: 'beachboy4', market: 'Olympique de Marsei...', initialValue: 3458339, finalValue: 6378346 },
  { username: 'beachboy4', market: 'Olympiakos SFP vs. B...', initialValue: 2011491, finalValue: 4585003 },
  { username: 'beachboy4', market: 'Juventus FC vs. Sport...', initialValue: 2962685, finalValue: 5183478 },
];

export const rewardMarkets: RewardMarket[] = [
  {
    id: 'r1',
    title: 'Federal Judge rules against Operation Metro Surge by Friday?',
    maxSpread: 4,
    minShares: 20,
    reward: 70,
    competition: 5,
    earnings: 0,
    yesPrice: 55,
    noPrice: 45,
  },
  {
    id: 'r2',
    title: 'Will Sam Darnold win the Super Bowl LX MVP?',
    maxSpread: 3,
    minShares: 100,
    reward: 50,
    competition: 4,
    earnings: 0,
    yesPrice: 43,
    noPrice: 57,
  },
  {
    id: 'r3',
    title: 'Will Drake Maye win the Super Bowl LX MVP?',
    maxSpread: 3,
    minShares: 100,
    reward: 50,
    competition: 4,
    earnings: 0,
    yesPrice: 22.5,
    noPrice: 77.5,
  },
  {
    id: 'r4',
    title: 'Will Jaxon Smith-Njigba win the Super Bowl LX MVP?',
    maxSpread: 3,
    minShares: 50,
    reward: 10,
    competition: 3,
    earnings: 0,
    yesPrice: 7.5,
    noPrice: 92.5,
  },
];

export const rewardCategories = ['All', 'Politics', 'Sports', 'Crypto', 'Pop Culture', 'Middle East', 'Business', 'Science'];

export function formatVolume(volume: number): string {
  if (volume >= 1000000) {
    return `$${(volume / 1000000).toFixed(1)}m`;
  }
  if (volume >= 1000) {
    return `$${(volume / 1000).toFixed(0)}k`;
  }
  return `$${volume}`;
}

export function formatMoney(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatProfitLoss(amount: number): string {
  const formatted = formatMoney(Math.abs(amount));
  return amount >= 0 ? `+${formatted}` : `-${formatted}`;
}
