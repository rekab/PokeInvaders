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

export interface Stats {
  hp: number;
  maxHp: number;
  attack: number;
  speed: number;
}

export interface Pokemon {
  id: string; // unique instance id
  speciesId: string; // e.g., 'charmander'
  name: string;
  nickname: string; // User defined name
  type: PokemonType;
  stats: Stats;
  level: number;
  xp: number;
  xpToNextLevel: number;
  spriteColor: string; // Tailwind color class e.g., 'bg-red-500'
  projectileColor: string;
  evolvesTo?: string; // speciesId of next form
  evolutionLevel?: number;
}

export interface Enemy {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  pokemon: Pokemon;
  direction: 1 | -1; // 1 = right, -1 = left
}

export interface Barrier {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  hp: number;
  maxHp: number;
}

export interface Explosion {
  id: string;
  x: number;
  y: number;
  startTime: number;
}

export interface Projectile {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  dy: number; // vertical speed (negative for player, positive for enemy)
  damage: number;
  type: PokemonType;
  owner: 'player' | 'enemy';
}

export interface GameState {
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  wave: number;
  score: number;
  lastFrameTime: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}