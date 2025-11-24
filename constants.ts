
import { PokemonType, Pokemon } from './types';

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
export const POKEDEX: Record<string, Omit<Pokemon, 'id' | 'nickname' | 'level' | 'xp' | 'xpToNextLevel' | 'stats'> & { baseStats: { hp: number; attack: number; speed: number } }> = {
  'charmander': {
    speciesId: 'charmander',
    name: 'Charmander',
    type: PokemonType.FIRE,
    spriteColor: 'bg-red-500',
    projectileColor: 'bg-red-400',
    baseStats: { hp: 50, attack: 15, speed: 10 },
    evolvesTo: 'charmeleon',
    evolutionLevel: 5,
  },
  'charmeleon': {
    speciesId: 'charmeleon',
    name: 'Charmeleon',
    type: PokemonType.FIRE,
    spriteColor: 'bg-red-600',
    projectileColor: 'bg-red-500',
    baseStats: { hp: 80, attack: 25, speed: 12 },
    evolvesTo: 'charizard',
    evolutionLevel: 10,
  },
  'charizard': {
    speciesId: 'charizard',
    name: 'Charizard',
    type: PokemonType.FIRE,
    spriteColor: 'bg-red-700',
    projectileColor: 'bg-orange-500',
    baseStats: { hp: 150, attack: 45, speed: 15 },
  },
  'squirtle': {
    speciesId: 'squirtle',
    name: 'Squirtle',
    type: PokemonType.WATER,
    spriteColor: 'bg-blue-400',
    projectileColor: 'bg-blue-300',
    baseStats: { hp: 60, attack: 12, speed: 10 },
    evolvesTo: 'wartortle',
    evolutionLevel: 5,
  },
  'wartortle': {
    speciesId: 'wartortle',
    name: 'Wartortle',
    type: PokemonType.WATER,
    spriteColor: 'bg-blue-600',
    projectileColor: 'bg-blue-400',
    baseStats: { hp: 90, attack: 20, speed: 11 },
    evolvesTo: 'blastoise',
    evolutionLevel: 10,
  },
  'blastoise': {
    speciesId: 'blastoise',
    name: 'Blastoise',
    type: PokemonType.WATER,
    spriteColor: 'bg-blue-800',
    projectileColor: 'bg-blue-200',
    baseStats: { hp: 180, attack: 35, speed: 12 },
  },
  'bulbasaur': {
    speciesId: 'bulbasaur',
    name: 'Bulbasaur',
    type: PokemonType.GRASS,
    spriteColor: 'bg-green-500',
    projectileColor: 'bg-green-300',
    baseStats: { hp: 55, attack: 13, speed: 10 },
    evolvesTo: 'ivysaur',
    evolutionLevel: 5,
  },
  'ivysaur': {
    speciesId: 'ivysaur',
    name: 'Ivysaur',
    type: PokemonType.GRASS,
    spriteColor: 'bg-green-600',
    projectileColor: 'bg-green-400',
    baseStats: { hp: 85, attack: 22, speed: 11 },
    evolvesTo: 'venusaur',
    evolutionLevel: 10,
  },
  'venusaur': {
    speciesId: 'venusaur',
    name: 'Venusaur',
    type: PokemonType.GRASS,
    spriteColor: 'bg-green-800',
    projectileColor: 'bg-green-200',
    baseStats: { hp: 160, attack: 40, speed: 12 },
  },
  'pikachu': {
    speciesId: 'pikachu',
    name: 'Pikachu',
    type: PokemonType.ELECTRIC,
    spriteColor: 'bg-yellow-400',
    projectileColor: 'bg-yellow-200',
    baseStats: { hp: 45, attack: 18, speed: 14 },
    evolvesTo: 'raichu',
    evolutionLevel: 6,
  },
  'raichu': {
    speciesId: 'raichu',
    name: 'Raichu',
    type: PokemonType.ELECTRIC,
    spriteColor: 'bg-yellow-600',
    projectileColor: 'bg-yellow-300',
    baseStats: { hp: 90, attack: 30, speed: 16 },
  },
  'geodude': {
    speciesId: 'geodude',
    name: 'Geodude',
    type: PokemonType.ROCK,
    spriteColor: 'bg-gray-500',
    projectileColor: 'bg-gray-400',
    baseStats: { hp: 70, attack: 14, speed: 8 },
  },
  'caterpie': {
    speciesId: 'caterpie',
    name: 'Caterpie',
    type: PokemonType.BUG,
    spriteColor: 'bg-green-300',
    projectileColor: 'bg-white',
    baseStats: { hp: 30, attack: 8, speed: 9 },
    evolvesTo: 'metapod',
    evolutionLevel: 3,
  },
  'metapod': {
    speciesId: 'metapod',
    name: 'Metapod',
    type: PokemonType.BUG,
    spriteColor: 'bg-green-400',
    projectileColor: 'bg-gray-200',
    baseStats: { hp: 60, attack: 5, speed: 5 },
    evolvesTo: 'butterfree',
    evolutionLevel: 6,
  },
  'butterfree': {
    speciesId: 'butterfree',
    name: 'Butterfree',
    type: PokemonType.BUG,
    spriteColor: 'bg-purple-300',
    projectileColor: 'bg-purple-200',
    baseStats: { hp: 80, attack: 20, speed: 13 },
  },
  'gastly': {
    speciesId: 'gastly',
    name: 'Gastly',
    type: PokemonType.GHOST,
    spriteColor: 'bg-purple-700',
    projectileColor: 'bg-purple-500',
    baseStats: { hp: 30, attack: 25, speed: 12 },
  },
  'mewtwo': {
    speciesId: 'mewtwo',
    name: 'Mewtwo',
    type: PokemonType.PSYCHIC,
    spriteColor: 'bg-purple-500',
    projectileColor: 'bg-pink-400',
    baseStats: { hp: 300, attack: 60, speed: 20 },
  }
};
