
export enum PokemonType {
  NORMAL = 'Normal',
  FIRE = 'Fire',
  WATER = 'Water',
  GRASS = 'Grass',
  ELECTRIC = 'Electric',
  PSYCHIC = 'Psychic',
  BUG = 'Bug',
  ROCK = 'Rock',
  GHOST = 'Ghost',
  DRAGON = 'Dragon',
}

export enum ShootPattern {
  NORMAL = 'normal',
  SHOTGUN = 'shotgun', // Spread fire
  RICOCHET = 'ricochet', // Bounces to next target
  SNIPER = 'sniper', // Fast, high damage, slow reload
  RAPID = 'rapid', // Fast fire rate
}

export interface Stats {
  hp: number;
  maxHp: number;
  attack: number;
  speed: number;
  // New Stats for mechanics
  fireRate: number; // ms between shots
  moveSpeed: number; // modifier for player movement
  projectileSpeed: number; // pixels per second
}

export interface ActiveBuffs {
  rapidFireExpires?: number; // Timestamp
  spreadExpires?: number; // Timestamp
  shieldExpires?: number; // Timestamp
  shieldMaxDuration?: number; // To calculate thickness
}

export interface Pokemon {
  id: string; // unique instance id
  speciesId: string; // e.g., 'charmander'
  name: string;
  nickname: string; // User defined name
  type: PokemonType;
  stats: Stats;
  shootPattern: ShootPattern;
  level: number;
  xp: number;
  xpToNextLevel: number;
  spriteColor: string; // Tailwind color class e.g., 'bg-red-500'
  projectileColor: string;
  evolvesTo?: string; // speciesId of next form
  evolutionLevel?: number;
  activeBuffs: ActiveBuffs;
}

export interface Enemy {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  pokemon: Pokemon;
  direction: 1 | -1; // 1 = right, -1 = left
  attackFrame: number; // 0 = none, >0 = showing attack frame
}

export interface Acrobat {
  id: string;
  x: number;
  y: number;
  startX: number;
  width: number;
  height: number;
  direction: 1 | -1;
  timeAlive: number;
}

export interface BarrierCell {
  x: number;
  y: number;
  width: number;
  height: number;
  active: boolean;
}

export interface Barrier {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  cells: BarrierCell[];
}

export interface Explosion {
  id: string;
  x: number;
  y: number;
  startTime: number;
}

export interface CaptureAnim {
  id: string;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  progress: number; // 0 to 1
  pokemon: Pokemon;
}

export interface Projectile {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number; // horizontal velocity
  vy: number; // vertical velocity
  damage: number;
  type: PokemonType;
  owner: 'player' | 'enemy' | 'neutral';
  bouncesLeft: number; 
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number; // 0-1
  type: PokemonType;
}

export interface MysteryShip {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  direction: 1 | -1;
  active: boolean;
}

export enum PowerUpType {
  HEALTH = 'health',
  RAPID = 'rapid',
  SPREAD = 'spread',
  SHIELD = 'shield'
}

export interface PowerUp {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: PowerUpType;
}

export interface GameState {
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  wave: number;
  score: number;
  highScore: number;
  lastFrameTime: number;
  globalAnimFrame: 0 | 1; // For synchronizing enemy walks
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}
