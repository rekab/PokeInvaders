
import { PokemonType, Pokemon, ShootPattern } from './types';

export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;
// Pixel art is 16x16, scaled up 3x = 48x48
export const PLAYER_WIDTH = 48; 
export const PLAYER_HEIGHT = 48;
export const ENEMY_WIDTH = 40; 
export const ENEMY_HEIGHT = 40;

// Barrier Grid Config
export const BARRIER_ROWS = 4;
export const BARRIER_COLS = 8;
export const BARRIER_CELL_SIZE = 12; // 8 cols * 12 = 96px width
export const BARRIER_WIDTH = BARRIER_COLS * BARRIER_CELL_SIZE;
export const BARRIER_HEIGHT = BARRIER_ROWS * BARRIER_CELL_SIZE;

export const PROJECTILE_WIDTH = 16;
export const PROJECTILE_HEIGHT = 24; 
export const PLAYER_SPEED = 300; // px per second
export const BASE_ENEMY_SPEED = 50;
export const ENEMY_DROP_DISTANCE = 20;

export const TYPE_CHART: Record<PokemonType, { strong: PokemonType[]; weak: PokemonType[] }> = {
  [PokemonType.NORMAL]: { strong: [], weak: [] }, 
  [PokemonType.FIRE]: { strong: [PokemonType.GRASS, PokemonType.BUG], weak: [PokemonType.WATER, PokemonType.ROCK] },
  [PokemonType.WATER]: { strong: [PokemonType.FIRE, PokemonType.ROCK], weak: [PokemonType.GRASS, PokemonType.ELECTRIC] },
  [PokemonType.GRASS]: { strong: [PokemonType.WATER, PokemonType.ROCK], weak: [PokemonType.FIRE, PokemonType.BUG] },
  [PokemonType.ELECTRIC]: { strong: [PokemonType.WATER], weak: [PokemonType.GRASS] }, 
  [PokemonType.PSYCHIC]: { strong: [], weak: [PokemonType.BUG, PokemonType.GHOST] },
  [PokemonType.BUG]: { strong: [PokemonType.GRASS, PokemonType.PSYCHIC], weak: [PokemonType.FIRE, PokemonType.ROCK] },
  [PokemonType.ROCK]: { strong: [PokemonType.FIRE, PokemonType.BUG], weak: [PokemonType.WATER, PokemonType.GRASS] },
  [PokemonType.GHOST]: { strong: [PokemonType.PSYCHIC], weak: [PokemonType.GHOST] },
  [PokemonType.DRAGON]: { strong: [PokemonType.DRAGON], weak: [PokemonType.DRAGON] },
};

// Simplified Pokedex
// Stats: 
// FireRate: Lower is faster. 500 is standard.
// MoveSpeed: Multiplier. 1.0 is standard.
// ProjSpeed: Px/sec. 400 is standard.

export const POKEDEX: Record<string, Omit<Pokemon, 'id' | 'nickname' | 'level' | 'xp' | 'xpToNextLevel' | 'stats' | 'shootPattern' | 'activeBuffs'> & { baseStats: { hp: number; attack: number; speed: number; fireRate: number; moveSpeed: number; projectileSpeed: number; shootPattern: ShootPattern } }> = {
  'charmander': {
    speciesId: 'charmander',
    name: 'Charmander',
    type: PokemonType.FIRE,
    spriteColor: 'bg-red-500',
    projectileColor: 'bg-red-400',
    baseStats: { hp: 50, attack: 20, speed: 10, fireRate: 400, moveSpeed: 1.1, projectileSpeed: 450, shootPattern: ShootPattern.NORMAL },
    evolvesTo: 'charmeleon',
    evolutionLevel: 5,
  },
  'charmeleon': {
    speciesId: 'charmeleon',
    name: 'Charmeleon',
    type: PokemonType.FIRE,
    spriteColor: 'bg-red-600',
    projectileColor: 'bg-red-500',
    baseStats: { hp: 80, attack: 35, speed: 12, fireRate: 350, moveSpeed: 1.2, projectileSpeed: 500, shootPattern: ShootPattern.NORMAL },
    evolvesTo: 'charizard',
    evolutionLevel: 10,
  },
  'charizard': {
    speciesId: 'charizard',
    name: 'Charizard',
    type: PokemonType.FIRE,
    spriteColor: 'bg-red-700',
    projectileColor: 'bg-orange-500',
    baseStats: { hp: 150, attack: 60, speed: 15, fireRate: 300, moveSpeed: 1.3, projectileSpeed: 550, shootPattern: ShootPattern.NORMAL },
  },
  'squirtle': {
    speciesId: 'squirtle',
    name: 'Squirtle',
    type: PokemonType.WATER,
    spriteColor: 'bg-blue-400',
    projectileColor: 'bg-blue-300',
    baseStats: { hp: 60, attack: 12, speed: 8, fireRate: 800, moveSpeed: 0.9, projectileSpeed: 350, shootPattern: ShootPattern.SHOTGUN }, // Slow fire, spread
    evolvesTo: 'wartortle',
    evolutionLevel: 5,
  },
  'wartortle': {
    speciesId: 'wartortle',
    name: 'Wartortle',
    type: PokemonType.WATER,
    spriteColor: 'bg-blue-600',
    projectileColor: 'bg-blue-400',
    baseStats: { hp: 100, attack: 20, speed: 9, fireRate: 750, moveSpeed: 0.9, projectileSpeed: 380, shootPattern: ShootPattern.SHOTGUN },
    evolvesTo: 'blastoise',
    evolutionLevel: 10,
  },
  'blastoise': {
    speciesId: 'blastoise',
    name: 'Blastoise',
    type: PokemonType.WATER,
    spriteColor: 'bg-blue-800',
    projectileColor: 'bg-blue-200',
    baseStats: { hp: 200, attack: 35, speed: 10, fireRate: 900, moveSpeed: 0.8, projectileSpeed: 400, shootPattern: ShootPattern.SHOTGUN }, // Tanky, heavy shotgun
  },
  'bulbasaur': {
    speciesId: 'bulbasaur',
    name: 'Bulbasaur',
    type: PokemonType.GRASS,
    spriteColor: 'bg-green-500',
    projectileColor: 'bg-green-300',
    baseStats: { hp: 55, attack: 18, speed: 10, fireRate: 600, moveSpeed: 1.0, projectileSpeed: 400, shootPattern: ShootPattern.RICOCHET }, // Bouncing Razor Leaf
    evolvesTo: 'ivysaur',
    evolutionLevel: 5,
  },
  'ivysaur': {
    speciesId: 'ivysaur',
    name: 'Ivysaur',
    type: PokemonType.GRASS,
    spriteColor: 'bg-green-600',
    projectileColor: 'bg-green-400',
    baseStats: { hp: 85, attack: 30, speed: 11, fireRate: 550, moveSpeed: 1.0, projectileSpeed: 420, shootPattern: ShootPattern.RICOCHET },
    evolvesTo: 'venusaur',
    evolutionLevel: 10,
  },
  'venusaur': {
    speciesId: 'venusaur',
    name: 'Venusaur',
    type: PokemonType.GRASS,
    spriteColor: 'bg-green-800',
    projectileColor: 'bg-green-200',
    baseStats: { hp: 180, attack: 50, speed: 12, fireRate: 500, moveSpeed: 0.9, projectileSpeed: 450, shootPattern: ShootPattern.RICOCHET },
  },
  'pikachu': {
    speciesId: 'pikachu',
    name: 'Pikachu',
    type: PokemonType.ELECTRIC,
    spriteColor: 'bg-yellow-400',
    projectileColor: 'bg-yellow-200',
    baseStats: { hp: 40, attack: 10, speed: 20, fireRate: 150, moveSpeed: 1.5, projectileSpeed: 700, shootPattern: ShootPattern.RAPID }, // Machine gun
    evolvesTo: 'raichu',
    evolutionLevel: 6,
  },
  'raichu': {
    speciesId: 'raichu',
    name: 'Raichu',
    type: PokemonType.ELECTRIC,
    spriteColor: 'bg-yellow-600',
    projectileColor: 'bg-yellow-300',
    baseStats: { hp: 80, attack: 18, speed: 22, fireRate: 120, moveSpeed: 1.6, projectileSpeed: 800, shootPattern: ShootPattern.RAPID },
  },
  'geodude': {
    speciesId: 'geodude',
    name: 'Geodude',
    type: PokemonType.ROCK,
    spriteColor: 'bg-gray-500',
    projectileColor: 'bg-gray-400',
    baseStats: { hp: 120, attack: 50, speed: 5, fireRate: 1200, moveSpeed: 0.6, projectileSpeed: 250, shootPattern: ShootPattern.SNIPER }, // Heavy hitter
  },
  'caterpie': {
    speciesId: 'caterpie',
    name: 'Caterpie',
    type: PokemonType.BUG,
    spriteColor: 'bg-green-300',
    projectileColor: 'bg-white',
    baseStats: { hp: 30, attack: 8, speed: 9, fireRate: 400, moveSpeed: 1.0, projectileSpeed: 300, shootPattern: ShootPattern.NORMAL },
    evolvesTo: 'metapod',
    evolutionLevel: 3,
  },
  'metapod': {
    speciesId: 'metapod',
    name: 'Metapod',
    type: PokemonType.BUG,
    spriteColor: 'bg-green-400',
    projectileColor: 'bg-gray-200',
    baseStats: { hp: 100, attack: 5, speed: 5, fireRate: 1000, moveSpeed: 0.5, projectileSpeed: 200, shootPattern: ShootPattern.NORMAL }, // Tank
    evolvesTo: 'butterfree',
    evolutionLevel: 6,
  },
  'butterfree': {
    speciesId: 'butterfree',
    name: 'Butterfree',
    type: PokemonType.BUG,
    spriteColor: 'bg-purple-300',
    projectileColor: 'bg-purple-200',
    baseStats: { hp: 70, attack: 25, speed: 13, fireRate: 300, moveSpeed: 1.2, projectileSpeed: 400, shootPattern: ShootPattern.NORMAL },
  },
  'gastly': {
    speciesId: 'gastly',
    name: 'Gastly',
    type: PokemonType.GHOST,
    spriteColor: 'bg-purple-700',
    projectileColor: 'bg-purple-500',
    baseStats: { hp: 30, attack: 40, speed: 12, fireRate: 800, moveSpeed: 1.2, projectileSpeed: 300, shootPattern: ShootPattern.SNIPER }, // Glass cannon
  },
  'mewtwo': {
    speciesId: 'mewtwo',
    name: 'Mewtwo',
    type: PokemonType.PSYCHIC,
    spriteColor: 'bg-purple-500',
    projectileColor: 'bg-pink-400',
    baseStats: { hp: 400, attack: 80, speed: 20, fireRate: 600, moveSpeed: 1.4, projectileSpeed: 600, shootPattern: ShootPattern.RICOCHET }, // Boss mode
  }
};
