
import React, { useEffect, useRef } from 'react';
import { PokemonType } from '../types';

// Color Palette
const C = {
  _: null, // Transparent
  O: '#FB923C', // Orange
  Y: '#FDE047', // Yellow
  R: '#EF4444', // Red
  W: '#FFFFFF', // White
  B: '#000000', // Black
  L: '#FED7AA', // Light Orange/Cream
  T: '#38BDF8', // Teal/Blue
  D: '#1E3A8A', // Dark Blue
  G: '#4ADE80', // Green
  H: '#166534', // Dark Green
  P: '#A855F7', // Purple
  K: '#3B0764', // Dark Purple
  A: '#9CA3AF', // Gray
  S: '#4B5563', // Dark Gray
  E: '#881337', // Deep Red (Eyes/Mouth)
  N: '#854d0e', // Brown
  M: '#F472B6', // Pink
};

// 16x16 Pixel Maps
const SPRITE_DATA: Record<string, (string | null)[][]> = {
  'charmander': [
    [C._,C._,C._,C._,C.O,C.O,C.O,C.O,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C.O,C.O,C.O,C.O,C.O,C.O,C._,C._,C._,C._,C.R,C.Y,C._],
    [C._,C._,C.O,C.O,C.O,C.O,C.O,C.O,C.O,C._,C._,C._,C.R,C.R,C.Y,C._],
    [C._,C._,C.O,C.O,C.W,C.B,C.O,C.O,C.O,C._,C._,C.R,C.R,C.Y,C.Y,C._],
    [C._,C._,C.O,C.O,C.O,C.O,C.O,C.L,C.L,C.O,C.O,C.R,C.Y,C.Y,C._,C._],
    [C._,C._,C.O,C.O,C.O,C.O,C.L,C.L,C.L,C.O,C.O,C.O,C.Y,C._,C._,C._],
    [C._,C._,C._,C.O,C.O,C.L,C.L,C.L,C.L,C.O,C.O,C.O,C.O,C._,C._,C._],
    [C._,C.O,C.O,C.O,C.O,C.L,C.L,C.L,C.L,C.O,C.O,C.O,C.O,C._,C._,C._],
    [C.O,C.O,C.O,C.O,C.O,C.O,C.L,C.L,C.L,C.O,C.O,C.O,C._,C._,C._,C._],
    [C.O,C.O,C.O,C.O,C.O,C.O,C.O,C.L,C.O,C.O,C.O,C._,C._,C._,C._,C._],
    [C._,C.O,C.O,C.O,C._,C.O,C.O,C.O,C.O,C.O,C.O,C._,C._,C._,C._,C._],
    [C._,C._,C.O,C.O,C._,C._,C.O,C.O,C.O,C.O,C._,C._,C._,C._,C._,C._],
    [C._,C._,C.O,C.O,C._,C._,C.O,C.O,C.O,C.O,C._,C._,C._,C._,C._,C._],
    [C._,C.O,C.O,C.O,C._,C._,C.O,C.O,C.O,C.O,C._,C._,C._,C._,C._,C._],
    [C._,C.O,C.O,C.O,C._,C._,C.O,C.O,C.O,C.O,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
  ],
  'charmeleon': [
    [C._,C._,C._,C._,C.R,C.R,C.R,C.R,C.R,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C.R,C.R,C.R,C.R,C.R,C.R,C.R,C._,C._,C._,C.R,C.Y,C._],
    [C._,C._,C.R,C.R,C.W,C.B,C.R,C.R,C.R,C.R,C._,C._,C.R,C.Y,C.Y,C._],
    [C._,C.R,C.R,C.R,C.R,C.R,C.R,C.R,C.R,C.R,C._,C.R,C.R,C.Y,C.W,C._],
    [C._,C.R,C.R,C.R,C.L,C.L,C.L,C.R,C.R,C.R,C.R,C.R,C.Y,C.W,C._,C._],
    [C._,C.R,C.R,C.R,C.L,C.L,C.L,C.R,C.R,C.R,C.R,C.Y,C.W,C._,C._,C._],
    [C._,C._,C.R,C.R,C.L,C.L,C.L,C.R,C.R,C.R,C.R,C.R,C._,C._,C._,C._],
    [C._,C.R,C.R,C.R,C.L,C.L,C.L,C.R,C.R,C.R,C.R,C.R,C.R,C._,C._,C._],
    [C.R,C.R,C.R,C.R,C.R,C.L,C.L,C.L,C.R,C.R,C.R,C.R,C.R,C._,C._,C._],
    [C.R,C.R,C.R,C.R,C.R,C.R,C.L,C.R,C.R,C.R,C.W,C.W,C.W,C._,C._,C._],
    [C.W,C.W,C.W,C.R,C._,C.R,C.R,C.R,C.R,C.R,C.R,C.R,C._,C._,C._,C._],
    [C._,C.R,C.R,C.R,C._,C._,C.R,C.R,C.R,C.R,C._,C._,C._,C._,C._,C._],
    [C._,C.R,C.R,C.R,C._,C._,C.R,C.R,C.R,C.R,C._,C._,C._,C._,C._,C._],
    [C._,C.R,C.R,C.R,C._,C._,C.R,C.R,C.R,C.R,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
  ],
  'charizard': [
    [C._,C._,C._,C._,C.O,C.O,C.O,C.O,C.O,C.O,C._,C.T,C._,C._,C._,C._],
    [C._,C._,C._,C.O,C.O,C.O,C.O,C.O,C.O,C.O,C.T,C.T,C.T,C._,C._,C._],
    [C._,C._,C.O,C.O,C.W,C.B,C.O,C.O,C.O,C.O,C.T,C.T,C.T,C.T,C._,C._],
    [C._,C.O,C.O,C.O,C.O,C.O,C.O,C.O,C.O,C.O,C.T,C.T,C.T,C.T,C.T,C._],
    [C._,C.O,C.O,C.O,C.L,C.L,C.L,C.O,C.O,C.O,C.O,C.T,C.T,C.T,C.T,C._],
    [C._,C.O,C.O,C.O,C.L,C.L,C.L,C.O,C.O,C.O,C.O,C.O,C.T,C.T,C._,C._],
    [C.T,C.T,C.O,C.O,C.L,C.L,C.L,C.O,C.O,C.O,C.O,C.O,C.R,C.Y,C._,C._],
    [C.T,C.T,C.T,C.O,C.L,C.L,C.L,C.O,C.O,C.O,C.O,C.R,C.Y,C.W,C._,C._],
    [C.T,C.T,C.T,C.T,C.O,C.L,C.L,C.L,C.O,C.O,C.O,C.R,C.Y,C.W,C._,C._],
    [C._,C.T,C.T,C.O,C.O,C.O,C.L,C.O,C.O,C.O,C.O,C.R,C.Y,C._,C._,C._],
    [C._,C._,C.O,C.O,C._,C.O,C.O,C.O,C.O,C.O,C.O,C._,C._,C._,C._,C._],
    [C._,C._,C.O,C.O,C._,C._,C.O,C.O,C.O,C.O,C._,C._,C._,C._,C._,C._],
    [C._,C.O,C.O,C.O,C._,C._,C.O,C.O,C.O,C.O,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
  ],
  'squirtle': [
    [C._,C._,C._,C._,C.T,C.T,C.T,C.T,C.T,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C._,C._,C._,C._,C._,C._],
    [C._,C._,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C._,C._,C._,C._,C._,C._],
    [C._,C._,C.T,C.T,C.W,C.B,C.T,C.T,C.T,C.T,C._,C._,C._,C._,C._,C._],
    [C._,C._,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C._,C._,C._,C._,C._,C._],
    [C._,C.T,C.T,C.T,C.T,C.L,C.L,C.L,C.T,C.T,C._,C._,C._,C.T,C.T,C.T],
    [C.T,C.T,C.T,C.T,C.L,C.L,C.L,C.L,C.L,C.N,C.N,C._,C.T,C.T,C.T,C.T],
    [C.T,C.T,C.T,C.T,C.L,C.L,C.L,C.L,C.L,C.N,C.N,C.T,C.T,C.T,C.T,C.T],
    [C._,C.T,C.T,C.T,C.L,C.L,C.L,C.L,C.N,C.N,C.N,C.T,C.T,C.T,C.T,C._],
    [C._,C._,C.T,C.T,C.L,C.L,C.L,C.L,C.N,C.N,C.T,C.T,C.T,C.T,C._,C._],
    [C._,C._,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C._,C._,C._,C._,C._],
    [C._,C._,C.T,C.T,C._,C._,C._,C.T,C.T,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C.T,C.T,C._,C._,C._,C.T,C.T,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
  ],
  'wartortle': [
    [C.W,C._,C._,C._,C.T,C.T,C.T,C.T,C.T,C._,C._,C._,C.W,C.W,C._,C._],
    [C.W,C.W,C._,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C._,C.W,C.W,C.W,C._,C._],
    [C.W,C.W,C.T,C.T,C.W,C.B,C.T,C.T,C.T,C.T,C.W,C.W,C.W,C._,C._,C._],
    [C._,C.W,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.W,C._,C._,C._,C._],
    [C._,C.T,C.T,C.T,C.T,C.L,C.L,C.L,C.T,C.T,C.T,C._,C._,C.W,C.W,C.W],
    [C.T,C.T,C.T,C.T,C.L,C.L,C.L,C.L,C.L,C.N,C.N,C._,C.W,C.W,C.W,C.W],
    [C.T,C.T,C.T,C.T,C.L,C.L,C.L,C.L,C.L,C.N,C.N,C.W,C.W,C.W,C.W,C.W],
    [C._,C.T,C.T,C.T,C.L,C.L,C.L,C.L,C.N,C.N,C.N,C.W,C.W,C.W,C.W,C._],
    [C._,C._,C.T,C.T,C.L,C.L,C.L,C.L,C.N,C.N,C.T,C.T,C.T,C.T,C._,C._],
    [C._,C._,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C._,C._,C._,C._,C._],
    [C._,C._,C.T,C.T,C._,C._,C._,C.T,C.T,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C.T,C.T,C._,C._,C._,C.T,C.T,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
  ],
  'blastoise': [
    [C._,C._,C._,C.D,C.D,C.D,C.D,C.D,C.D,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C.D,C.D,C.D,C.D,C.D,C.D,C.D,C.D,C._,C._,C.A,C.A,C.A,C._],
    [C._,C.D,C.D,C.W,C.B,C.D,C.D,C.D,C.D,C.D,C._,C.A,C.A,C.B,C.B,C.A],
    [C._,C.D,C.D,C.D,C.D,C.D,C.D,C.D,C.D,C.D,C.D,C.A,C.A,C.A,C.A,C.A],
    [C.A,C.A,C.D,C.D,C.L,C.L,C.L,C.D,C.D,C.D,C.D,C.A,C.A,C.A,C.A,C.A],
    [C.A,C.B,C.D,C.D,C.L,C.L,C.L,C.D,C.D,C.N,C.N,C._,C.D,C.D,C.D,C._],
    [C.A,C.A,C.D,C.D,C.L,C.L,C.L,C.L,C.L,C.N,C.N,C.D,C.D,C.D,C.D,C._],
    [C._,C.D,C.D,C.D,C.L,C.L,C.L,C.L,C.L,C.N,C.N,C.D,C.D,C.D,C.D,C._],
    [C._,C._,C.D,C.D,C.L,C.L,C.L,C.L,C.N,C.N,C.N,C.D,C.D,C.D,C.D,C._],
    [C._,C._,C.D,C.D,C.L,C.L,C.L,C.L,C.N,C.N,C.D,C.D,C.D,C.D,C._,C._],
    [C._,C._,C.D,C.D,C.D,C.D,C.D,C.D,C.D,C.D,C.D,C._,C._,C._,C._,C._],
    [C._,C._,C.D,C.D,C._,C._,C._,C.D,C.D,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C.D,C.D,C._,C._,C._,C.D,C.D,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
  ],
  'bulbasaur': [
    [C._,C._,C._,C._,C._,C.H,C.H,C.H,C.H,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C.H,C.H,C.H,C.H,C.H,C.H,C.H,C.H,C._,C._,C._,C._,C._],
    [C._,C._,C.H,C.H,C.H,C.H,C.H,C.H,C.H,C.H,C.H,C.H,C._,C._,C._,C._],
    [C._,C._,C.H,C.H,C.H,C.G,C.G,C.G,C.G,C.H,C.H,C.H,C._,C._,C._,C._],
    [C._,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C._,C._,C._,C._],
    [C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C._,C._,C._],
    [C.G,C.G,C.G,C.W,C.E,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C._,C._,C._],
    [C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C._,C._,C._],
    [C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C._,C._,C._,C._],
    [C._,C.G,C.G,C.G,C.H,C.G,C.G,C.G,C.G,C.G,C.G,C._,C._,C._,C._,C._],
    [C._,C.G,C.G,C.G,C.H,C._,C._,C.G,C.G,C.G,C.H,C._,C._,C._,C._,C._],
    [C._,C.G,C.G,C.G,C._,C._,C._,C.G,C.G,C.G,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
  ],
  'ivysaur': [
    [C._,C._,C._,C._,C._,C.M,C.M,C.M,C.M,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C.M,C.M,C.M,C.M,C.M,C.M,C.M,C.M,C._,C._,C._,C._,C._],
    [C._,C._,C.M,C.M,C.M,C.M,C.M,C.M,C.M,C.M,C.M,C.M,C._,C._,C._,C._],
    [C._,C._,C.H,C.H,C.H,C.H,C.H,C.H,C.H,C.H,C.H,C.H,C._,C._,C._,C._],
    [C._,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C._,C._,C._,C._],
    [C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C._,C._,C._],
    [C.T,C.T,C.T,C.W,C.E,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C._,C._,C._],
    [C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C._,C._,C._],
    [C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C._,C._,C._,C._],
    [C._,C.T,C.T,C.T,C.D,C.T,C.T,C.T,C.T,C.T,C.T,C._,C._,C._,C._,C._],
    [C._,C.T,C.T,C.T,C.D,C._,C._,C.T,C.T,C.T,C.D,C._,C._,C._,C._,C._],
    [C._,C.T,C.T,C.T,C._,C._,C._,C.T,C.T,C.T,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
  ],
  'venusaur': [
    [C._,C._,C.M,C.M,C.M,C.M,C.M,C.M,C.M,C.M,C.M,C.M,C._,C._,C._,C._],
    [C._,C.M,C.M,C.W,C.M,C.M,C.Y,C.Y,C.M,C.M,C.W,C.M,C.M,C._,C._,C._],
    [C.M,C.M,C.M,C.M,C.M,C.M,C.Y,C.Y,C.M,C.M,C.M,C.M,C.M,C._,C._,C._],
    [C._,C._,C.H,C.H,C.H,C.H,C.H,C.H,C.H,C.H,C.H,C.H,C._,C._,C._,C._],
    [C._,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C._,C._,C._,C._],
    [C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C._,C._,C._],
    [C.T,C.T,C.T,C.W,C.E,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C._,C._,C._],
    [C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C._,C._,C._],
    [C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C._,C._,C._,C._],
    [C._,C.T,C.T,C.T,C.D,C.T,C.T,C.T,C.T,C.T,C.T,C._,C._,C._,C._,C._],
    [C._,C.T,C.T,C.T,C.D,C._,C._,C.T,C.T,C.T,C.D,C._,C._,C._,C._,C._],
    [C._,C.T,C.T,C.T,C._,C._,C._,C.T,C.T,C.T,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
  ],
  'pikachu': [
    [C._,C.Y,C.Y,C._,C._,C._,C._,C._,C._,C._,C._,C.Y,C.Y,C._,C._,C._],
    [C.B,C.Y,C.Y,C._,C._,C._,C._,C._,C._,C._,C._,C.Y,C.Y,C.B,C._,C._],
    [C.B,C.Y,C.Y,C._,C._,C._,C._,C._,C._,C._,C._,C.Y,C.Y,C.B,C._,C._],
    [C._,C.Y,C.Y,C.Y,C._,C._,C._,C._,C._,C._,C.Y,C.Y,C.Y,C._,C._,C._],
    [C._,C._,C.Y,C.Y,C.Y,C.Y,C.Y,C.Y,C.Y,C.Y,C.Y,C.Y,C._,C._,C._,C._],
    [C._,C._,C.Y,C.Y,C.Y,C.Y,C.Y,C.Y,C.Y,C.Y,C.Y,C.Y,C._,C._,C._,C._],
    [C._,C._,C.Y,C.Y,C.B,C.Y,C.Y,C.Y,C.Y,C.B,C.Y,C.Y,C._,C._,C._,C._],
    [C._,C.Y,C.Y,C.E,C.Y,C.Y,C.B,C.B,C.Y,C.Y,C.E,C.Y,C.Y,C._,C._,C._],
    [C._,C.Y,C.Y,C.Y,C.Y,C.Y,C.Y,C.Y,C.Y,C.Y,C.Y,C.Y,C.Y,C._,C.N,C.N],
    [C._,C.Y,C.Y,C.Y,C.Y,C.Y,C.Y,C.Y,C.Y,C.Y,C.Y,C.Y,C.Y,C.N,C.Y,C.Y],
    [C._,C._,C.Y,C.Y,C.Y,C.Y,C.Y,C.Y,C.Y,C.Y,C.Y,C.Y,C._,C.N,C.Y,C._],
    [C._,C._,C.Y,C.Y,C._,C.Y,C.Y,C.Y,C.Y,C._,C.Y,C.Y,C._,C.N,C._,C._],
    [C._,C._,C.Y,C.Y,C._,C._,C._,C._,C._,C._,C.Y,C.Y,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
  ],
  'raichu': [
    [C._,C.O,C.O,C._,C._,C._,C._,C._,C._,C._,C._,C.O,C.O,C._,C._,C._],
    [C.N,C.O,C.O,C.N,C._,C._,C._,C._,C._,C._,C.N,C.O,C.O,C.N,C._,C._],
    [C.N,C.O,C.O,C.Y,C._,C._,C._,C._,C._,C._,C.Y,C.O,C.O,C.N,C._,C._],
    [C._,C.O,C.O,C.Y,C.O,C.O,C.O,C.O,C.O,C.O,C.Y,C.O,C.O,C._,C._,C._],
    [C._,C.O,C.O,C.O,C.O,C.O,C.O,C.O,C.O,C.O,C.O,C.O,C.O,C._,C._,C._],
    [C._,C._,C.O,C.O,C.O,C.O,C.O,C.O,C.O,C.O,C.O,C.O,C._,C._,C._,C._],
    [C._,C._,C.O,C.O,C.B,C.O,C.O,C.O,C.O,C.B,C.O,C.O,C._,C._,C.Y,C._],
    [C._,C.O,C.O,C.E,C.O,C.O,C.B,C.B,C.O,C.O,C.E,C.O,C.O,C.Y,C.Y,C._],
    [C._,C.O,C.O,C.O,C.O,C.O,C.O,C.O,C.O,C.O,C.O,C.O,C.O,C.N,C.Y,C._],
    [C._,C.O,C.O,C.W,C.O,C.O,C.O,C.O,C.O,C.O,C.W,C.O,C.O,C.N,C.Y,C._],
    [C._,C._,C.O,C.O,C.O,C.O,C.O,C.O,C.O,C.O,C.O,C.O,C._,C.N,C._,C._],
    [C._,C._,C.O,C.O,C._,C.O,C.O,C.O,C.O,C._,C.O,C.O,C._,C._,C._,C._],
    [C._,C._,C.O,C.O,C._,C._,C._,C._,C._,C._,C.O,C.O,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
  ],
  'caterpie': [
    [C._,C._,C._,C._,C._,C.R,C._,C._,C.R,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C.R,C._,C._,C.R,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C.G,C.G,C.G,C.G,C.G,C.G,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C._,C._,C._,C._,C._],
    [C._,C._,C.G,C.G,C.B,C.G,C.G,C.G,C.G,C.B,C.G,C.G,C._,C._,C._,C._],
    [C._,C._,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C._,C._,C._,C._],
    [C._,C._,C._,C.G,C.G,C.G,C.Y,C.Y,C.G,C.G,C.G,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C.G,C.G,C.G,C.G,C.G,C.G,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C._,C._,C._,C._,C._],
    [C._,C._,C.G,C.G,C.G,C.G,C.Y,C.Y,C.G,C.G,C.G,C.G,C._,C._,C._,C._],
    [C._,C._,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C._,C._,C._,C._],
    [C._,C._,C._,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C.L,C.L,C._,C._,C.L,C.L,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
  ],
  'metapod': [
    [C._,C._,C._,C._,C._,C.G,C.G,C.G,C.G,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C.G,C.G,C.G,C.G,C.G,C.G,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C.G,C.G,C.W,C.B,C.G,C.G,C.G,C._,C._,C._,C._,C._,C._],
    [C._,C._,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C._,C._,C._,C._,C._],
    [C._,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C._,C._,C._,C._,C._],
    [C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C._,C._,C._,C._],
    [C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C._,C._,C._,C._],
    [C._,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C._,C._,C._,C._,C._],
    [C._,C._,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C.G,C.G,C.G,C.G,C.G,C.G,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C.G,C.G,C.G,C.G,C.G,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C.G,C.G,C.G,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
  ],
  'butterfree': [
    [C.W,C.W,C.W,C._,C._,C._,C.P,C.P,C._,C._,C._,C.W,C.W,C.W,C._,C._],
    [C.W,C.B,C.W,C.W,C._,C.P,C.P,C.P,C.P,C._,C.W,C.W,C.B,C.W,C._,C._],
    [C.W,C.W,C.W,C.W,C.P,C.P,C.P,C.P,C.P,C.P,C.W,C.W,C.W,C.W,C._,C._],
    [C.W,C.W,C.W,C.W,C.P,C.P,C.E,C.E,C.P,C.P,C.W,C.W,C.W,C.W,C._,C._],
    [C._,C.W,C.W,C.W,C.P,C.P,C.E,C.E,C.P,C.P,C.W,C.W,C.W,C._,C._,C._],
    [C._,C._,C.W,C.W,C.P,C.P,C.T,C.T,C.P,C.P,C.W,C.W,C._,C._,C._,C._],
    [C._,C._,C.W,C.W,C._,C.P,C.P,C.P,C.P,C._,C.W,C.W,C._,C._,C._,C._],
    [C._,C.W,C.W,C._,C._,C.P,C.P,C.P,C.P,C._,C._,C.W,C.W,C._,C._,C._],
    [C.W,C.W,C.W,C._,C._,C.P,C.P,C.P,C.P,C._,C._,C.W,C.W,C.W,C._,C._],
    [C.W,C.W,C._,C._,C._,C.P,C.P,C.P,C.P,C._,C._,C._,C.W,C.W,C._,C._],
    [C._,C._,C._,C._,C._,C.T,C.T,C.T,C.T,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C.T,C.T,C.T,C.T,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C.T,C._,C._,C._,C._,C.T,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
  ],
  'gastly': [
    [C._,C._,C._,C._,C._,C.K,C.K,C.K,C.K,C.K,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C.K,C.K,C.B,C.B,C.B,C.B,C.B,C.K,C.K,C._,C._,C._,C._],
    [C._,C._,C.K,C.B,C.B,C.B,C.B,C.B,C.B,C.B,C.B,C.B,C.K,C._,C._,C._],
    [C._,C.K,C.B,C.B,C.B,C.W,C.B,C.B,C.W,C.B,C.B,C.B,C.B,C.K,C._,C._],
    [C._,C.K,C.B,C.B,C.W,C.W,C.B,C.B,C.W,C.W,C.B,C.B,C.B,C.K,C._,C._],
    [C._,C.K,C.B,C.B,C.B,C.B,C.B,C.B,C.B,C.B,C.B,C.B,C.B,C.K,C._,C._],
    [C._,C.K,C.B,C.B,C.B,C.E,C.E,C.E,C.E,C.B,C.B,C.B,C.B,C.K,C._,C._],
    [C._,C.K,C.B,C.B,C.E,C.W,C.E,C.E,C.W,C.E,C.B,C.B,C.B,C.K,C._,C._],
    [C._,C._,C.K,C.B,C.B,C.B,C.B,C.B,C.B,C.B,C.B,C.B,C.K,C._,C._,C._],
    [C._,C._,C._,C.K,C.K,C.B,C.B,C.B,C.B,C.B,C.K,C.K,C._,C._,C._,C._],
    [C._,C._,C._,C.P,C.P,C.K,C.K,C.K,C.K,C.K,C.P,C.P,C._,C._,C._,C._],
    [C._,C.P,C.P,C._,C._,C.P,C.P,C.P,C.P,C.P,C._,C._,C.P,C.P,C._,C._],
    [C.P,C.P,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C.P,C.P,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
  ],
  'geodude': [
    [C._,C._,C._,C._,C._,C.A,C.A,C.A,C.A,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C._,C._,C._,C._,C._],
    [C._,C.A,C.A,C.A,C.A,C.W,C.A,C.A,C.W,C.A,C.A,C.A,C.A,C.A,C._,C._],
    [C.A,C.A,C.A,C.A,C.A,C.B,C.A,C.A,C.B,C.A,C.A,C.A,C.A,C.A,C.A,C._],
    [C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C._],
    [C.A,C.A,C.A,C.A,C.A,C.S,C.S,C.S,C.S,C.A,C.A,C.A,C.A,C.A,C.A,C._],
    [C._,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C._,C._],
    [C._,C._,C._,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C._,C._,C._,C._,C._],
    [C._,C._,C._,C.A,C.A,C._,C.A,C.A,C._,C.A,C.A,C._,C._,C._,C._,C._],
    [C._,C._,C.S,C.S,C._,C._,C._,C._,C._,C._,C.S,C.S,C._,C._,C._,C._],
    [C._,C.S,C.S,C._,C._,C._,C._,C._,C._,C._,C._,C.S,C.S,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
  ],
  'mewtwo': [
    [C._,C._,C._,C._,C._,C._,C.A,C.A,C.A,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C.A,C.A,C.A,C.A,C.A,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C.A,C.A,C.A,C.P,C.A,C.A,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C.A,C.A,C.A,C.A,C.A,C.A,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C.A,C.A,C.A,C.A,C._,C._,C.A,C._,C._,C._,C._],
    [C._,C._,C._,C._,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C._,C._,C._,C._],
    [C._,C._,C._,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C._,C._,C._,C._],
    [C._,C._,C._,C.A,C.A,C.A,C.P,C.P,C.A,C.A,C.A,C.A,C._,C._,C._,C._],
    [C._,C._,C._,C.A,C.A,C.P,C.P,C.P,C.P,C.A,C.A,C._,C._,C._,C._,C._],
    [C._,C._,C._,C.A,C.P,C.P,C.P,C.P,C.P,C.P,C.A,C._,C._,C._,C._,C._],
    [C._,C._,C.A,C.A,C.P,C.P,C.P,C.P,C.P,C.P,C.A,C.A,C._,C._,C._,C._],
    [C._,C.A,C.A,C.A,C.P,C.P,C.P,C.P,C.P,C.P,C.A,C.A,C.A,C._,C._,C._],
    [C.A,C.A,C.A,C.A,C.P,C.P,C.P,C.P,C.P,C.P,C.A,C.A,C.A,C.A,C._,C._],
    [C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
  ],
};

const GENERIC_MAP = [
  [C._,C._,C._,C._,C.S,C.S,C.S,C.S,C.S,C.S,C.S,C.S,C._,C._,C._,C._],
  [C._,C._,C.S,C.S,C.S,C.S,C.S,C.S,C.S,C.S,C.S,C.S,C.S,C.S,C._,C._],
  [C._,C.S,C.S,C.S,C.S,C.S,C.S,C.S,C.S,C.S,C.S,C.S,C.S,C.S,C.S,C._],
  [C.S,C.S,C.S,C.S,C.S,C.W,C.W,C.S,C.S,C.W,C.W,C.S,C.S,C.S,C.S,C.S],
  [C.S,C.S,C.S,C.S,C.S,C.W,C.B,C.S,C.S,C.W,C.B,C.S,C.S,C.S,C.S,C.S],
  [C.S,C.S,C.S,C.S,C.S,C.S,C.S,C.S,C.S,C.S,C.S,C.S,C.S,C.S,C.S,C.S],
  [C.S,C.S,C.S,C.S,C.S,C.S,C.S,C.S,C.S,C.S,C.S,C.S,C.S,C.S,C.S,C.S],
  [C.S,C.S,C.S,C.S,C.S,C.E,C.S,C.S,C.S,C.S,C.E,C.S,C.S,C.S,C.S,C.S],
  [C.S,C.S,C.S,C.S,C.S,C.E,C.E,C.E,C.E,C.E,C.E,C.S,C.S,C.S,C.S,C.S],
  [C._,C.S,C.S,C.S,C.S,C.S,C.E,C.E,C.E,C.E,C.S,C.S,C.S,C.S,C.S,C._],
  [C._,C.S,C.S,C.S,C.S,C.S,C.S,C.S,C.S,C.S,C.S,C.S,C.S,C.S,C._,C._],
  [C._,C._,C.S,C.S,C._,C.S,C.S,C._,C._,C.S,C.S,C._,C.S,C.S,C._,C._],
  [C._,C._,C.S,C.S,C._,C._,C._,C._,C._,C._,C._,C._,C.S,C.S,C._,C._],
  [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
  [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
  [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
];

export const PixelSprite: React.FC<{ speciesId: string }> = ({ speciesId }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get Data
    let map = SPRITE_DATA[speciesId];
    if (!map) {
      // Fallback: modify Generic based on type hints if possible, or just use generic
      // We can vary the generic color based on species name hash roughly
      map = GENERIC_MAP; 
    }

    ctx.clearRect(0, 0, 16, 16);
    
    map.forEach((row, y) => {
      row.forEach((color, x) => {
        if (color) {
          ctx.fillStyle = color;
          ctx.fillRect(x, y, 1, 1);
        }
      });
    });
  }, [speciesId]);

  return (
    <canvas 
      ref={canvasRef} 
      width={16} 
      height={16} 
      className="w-full h-full"
      style={{ imageRendering: 'pixelated' }} // Critical for retro look
    />
  );
};

export const PokeballSprite: React.FC = () => {
    return (
        <div className="w-4 h-4 rounded-full border border-black relative bg-white overflow-hidden animate-spin">
            <div className="absolute top-0 w-full h-1/2 bg-red-600 border-b border-black"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full border border-black z-10"></div>
        </div>
    );
}

// Helper to map type to colors
const getTypeColor = (type: PokemonType): string => {
  switch (type) {
    case PokemonType.FIRE: return '#f87171'; // red-400
    case PokemonType.WATER: return '#60a5fa'; // blue-400
    case PokemonType.GRASS: return '#4ade80'; // green-400
    case PokemonType.ELECTRIC: return '#facc15'; // yellow-400
    case PokemonType.PSYCHIC: return '#c084fc'; // purple-400
    case PokemonType.ROCK: return '#9ca3af'; // gray-400
    case PokemonType.GHOST: return '#7e22ce'; // purple-700
    case PokemonType.BUG: return '#a3e635'; // lime-400
    default: return '#e5e7eb';
  }
};

export const ExplosionVisual: React.FC = () => {
    return (
        <div className="w-full h-full relative">
            <div className="absolute inset-0 bg-yellow-400 animate-ping opacity-75 rounded-full"></div>
            <div className="absolute inset-2 bg-red-500 animate-pulse rounded-full"></div>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-1 bg-white rotate-45 absolute"></div>
                <div className="w-full h-1 bg-white -rotate-45 absolute"></div>
            </div>
        </div>
    );
};

export const ProjectileVisual: React.FC<{ type: PokemonType; isPlayer: boolean }> = ({ type, isPlayer }) => {
  const color = getTypeColor(type);
  
  // Custom projectile shapes based on type
  const renderShape = () => {
    switch (type) {
      case PokemonType.FIRE:
        return (
          <div className="w-full h-full relative">
            <div className="absolute inset-0 rounded-full bg-red-500 blur-[2px] animate-pulse"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-2/3 bg-yellow-300 rounded-full"></div>
            {/* Trail */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-1/2 h-full bg-gradient-to-b from-red-500 to-transparent blur-sm"></div>
          </div>
        );
      case PokemonType.WATER:
        return (
          <div className="w-full h-full relative animate-wobble">
            <div className="absolute inset-0 rounded-full border-2 border-blue-300 bg-blue-500 opacity-80"></div>
            <div className="absolute top-1 left-1 w-1/3 h-1/3 bg-white rounded-full opacity-50"></div>
            {/* Droplets */}
            <div className="absolute -bottom-2 left-0 w-1 h-1 bg-blue-300 rounded-full animate-bounce"></div>
          </div>
        );
      case PokemonType.GRASS:
        return (
           <div className="w-full h-full relative animate-spin-fast">
             <div className="absolute inset-0 bg-green-500 transform rotate-45 rounded-sm"></div>
             <div className="absolute inset-0 bg-green-300 transform -rotate-45 rounded-sm scale-75"></div>
           </div>
        );
      case PokemonType.ELECTRIC:
        return (
          <div className="w-full h-full relative animate-flicker">
             <div className="w-full h-full bg-yellow-400" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
             <div className="absolute -inset-1 bg-yellow-200 blur-sm -z-10"></div>
          </div>
        );
      case PokemonType.PSYCHIC:
         return (
           <div className="w-full h-full relative">
              <div className="absolute inset-0 rounded-full border-2 border-purple-400 animate-ping"></div>
              <div className="absolute inset-2 rounded-full bg-purple-600"></div>
           </div>
         );
      default:
        return (
          <div className="w-full h-full rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 5px ${color}` }}></div>
        );
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      {renderShape()}
    </div>
  );
};
