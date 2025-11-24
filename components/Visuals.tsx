
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

// Explosion Animation Frames
const EXPLOSION_FRAMES = [
  // Frame 0: Center Burst (White/Yellow)
  [
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C.W,C.W,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C.W,C.Y,C.Y,C.W,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C.W,C.Y,C.Y,C.W,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C.W,C.W,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
  ],
  // Frame 1: Expansion (Yellow/Orange)
  [
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C.W,C.W,C.W,C.W,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C.W,C.Y,C.Y,C.Y,C.Y,C.W,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C.W,C.Y,C.O,C.O,C.O,C.Y,C.W,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C.W,C.Y,C.O,C.W,C.O,C.Y,C.W,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C.W,C.Y,C.O,C.O,C.O,C.Y,C.W,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C.W,C.Y,C.Y,C.Y,C.Y,C.W,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C.W,C.W,C.W,C.W,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
  ],
  // Frame 2: Max Size, Breaking Up (Orange/Red)
  [
    [C._,C._,C._,C._,C._,C._,C.O,C.O,C.O,C.O,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C.O,C.O,C.Y,C.Y,C.Y,C.Y,C.O,C.O,C._,C._,C._,C._],
    [C._,C._,C._,C.O,C.Y,C.Y,C.O,C.O,C.O,C.Y,C.Y,C.O,C._,C._,C._,C._],
    [C._,C._,C.O,C.Y,C.O,C.O,C._,C._,C._,C.O,C.Y,C.O,C._,C._,C._,C._],
    [C._,C.O,C.Y,C.O,C._,C._,C._,C._,C._,C._,C.O,C.Y,C.O,C._,C._,C._],
    [C._,C.O,C.Y,C.O,C._,C._,C._,C._,C._,C._,C.O,C.Y,C.O,C._,C._,C._],
    [C._,C.O,C.Y,C.O,C._,C._,C._,C._,C._,C._,C.O,C.Y,C.O,C._,C._,C._],
    [C._,C._,C.O,C.Y,C.O,C.O,C._,C._,C._,C.O,C.Y,C.O,C._,C._,C._,C._],
    [C._,C._,C._,C.O,C.Y,C.Y,C.O,C.O,C.O,C.Y,C.Y,C.O,C._,C._,C._,C._],
    [C._,C._,C._,C._,C.O,C.O,C.Y,C.Y,C.Y,C.Y,C.O,C.O,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C.O,C.O,C.O,C.O,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
  ],
  // Frame 3: Dissipating (Red/Grey)
  [
    [C._,C._,C.A,C._,C._,C._,C._,C.R,C.R,C._,C._,C._,C._,C.A,C._,C._],
    [C._,C.A,C._,C._,C._,C.R,C._,C._,C._,C._,C.R,C._,C._,C._,C.A,C._],
    [C._,C._,C._,C._,C.R,C._,C._,C._,C._,C._,C._,C.R,C._,C._,C._,C._],
    [C._,C._,C._,C.R,C._,C._,C._,C._,C._,C._,C._,C._,C.R,C._,C._,C._],
    [C._,C._,C.R,C._,C._,C._,C._,C._,C._,C._,C._,C._,C.R,C._,C._,C._],
    [C._,C.R,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C.R,C._,C._],
    [C._,C.R,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C.R,C._,C._],
    [C._,C._,C.R,C._,C._,C._,C._,C._,C._,C._,C._,C._,C.R,C._,C._,C._],
    [C._,C._,C._,C.R,C._,C._,C._,C._,C._,C._,C._,C.R,C._,C._,C._,C._],
    [C._,C.A,C._,C._,C.R,C._,C._,C._,C._,C._,C.R,C._,C._,C._,C.A,C._],
    [C._,C._,C.A,C._,C._,C._,C._,C.R,C.R,C._,C._,C._,C._,C.A,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
  ],
  // Frame 4: Fading particles (Grey)
  [
    [C._,C._,C._,C._,C._,C._,C._,C.A,C.A,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C.A,C._,C._,C._,C._,C.A,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C.A,C._,C._,C._,C._,C._,C._,C.A,C._,C._,C._,C._],
    [C._,C._,C._,C.A,C._,C._,C._,C._,C._,C._,C._,C._,C.A,C._,C._,C._],
    [C._,C._,C.A,C._,C._,C._,C._,C._,C._,C._,C._,C._,C.A,C._,C._,C._],
    [C._,C.A,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C.A,C._,C._],
    [C._,C.A,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C.A,C._,C._],
    [C._,C._,C.A,C._,C._,C._,C._,C._,C._,C._,C._,C._,C.A,C._,C._,C._],
    [C._,C._,C._,C.A,C._,C._,C._,C._,C._,C._,C._,C.A,C._,C._,C._,C._],
    [C._,C._,C._,C._,C.A,C._,C._,C._,C._,C._,C.A,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C.A,C.A,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
  ]
];

// 16x16 Pixel Maps
const SPRITE_DATA: Record<string, (string | null)[][]> = {
  'ufo': [
    [C._,C._,C._,C._,C._,C.A,C.A,C.A,C.A,C.A,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C.A,C.A,C.T,C.T,C.T,C.T,C.T,C.A,C.A,C._,C._,C._,C._],
    [C._,C.A,C.A,C.T,C.T,C.W,C.T,C.T,C.W,C.T,C.T,C.A,C.A,C._,C._,C._],
    [C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C._,C._],
    [C.A,C.A,C.R,C.R,C.A,C.A,C.G,C.G,C.A,C.A,C.R,C.R,C.A,C.A,C._,C._],
    [C._,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C._,C._,C._],
    [C._,C._,C.A,C.A,C._,C._,C._,C._,C._,C._,C.A,C.A,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
  ],
  'jet': [
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C.D,C.D,C.D,C._,C._,C._,C._],
    [C._,C._,C._,C.D,C.D,C.D,C.D,C.D,C.D,C.T,C.W,C.D,C._,C._,C._,C._],
    [C._,C.D,C.D,C.T,C.T,C.T,C.T,C.T,C.T,C.D,C.W,C.D,C._,C._,C._,C._],
    [C.D,C.T,C.T,C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.D,C.D,C.D,C.D,C._,C._],
    [C._,C.D,C.D,C.T,C.T,C.T,C.T,C.T,C.T,C.D,C.D,C.W,C.W,C.D,C._,C._],
    [C._,C._,C.D,C.D,C.W,C.W,C.W,C.D,C.D,C.D,C.D,C.D,C.D,C.D,C._,C._],
    [C._,C._,C._,C.D,C.D,C.D,C.D,C.D,C._,C.D,C.D,C.D,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C.Y,C.Y,C.Y,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C.O,C.Y,C.R,C.Y,C.O,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C.Y,C.Y,C.Y,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
  ],
  'powerup_health': [
    [C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W],
    [C.W,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C.W,C.W],
    [C.W,C._,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C._,C.W,C.W],
    [C.W,C._,C.G,C.G,C.G,C.G,C.W,C.W,C.W,C.G,C.G,C.G,C.G,C._,C.W,C.W],
    [C.W,C._,C.G,C.G,C.G,C.G,C.W,C.R,C.W,C.G,C.G,C.G,C.G,C._,C.W,C.W],
    [C.W,C._,C.G,C.G,C.W,C.W,C.W,C.R,C.W,C.W,C.W,C.G,C.G,C._,C.W,C.W],
    [C.W,C._,C.G,C.G,C.W,C.R,C.R,C.R,C.R,C.R,C.W,C.G,C.G,C._,C.W,C.W],
    [C.W,C._,C.G,C.G,C.W,C.W,C.W,C.R,C.W,C.W,C.W,C.G,C.G,C._,C.W,C.W],
    [C.W,C._,C.G,C.G,C.G,C.G,C.W,C.R,C.W,C.G,C.G,C.G,C.G,C._,C.W,C.W],
    [C.W,C._,C.G,C.G,C.G,C.G,C.W,C.W,C.W,C.G,C.G,C.G,C.G,C._,C.W,C.W],
    [C.W,C._,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C._,C.W,C.W],
    [C.W,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C.W,C.W],
    [C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
  ],
  'powerup_rapid': [
    [C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W],
    [C.W,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C.W,C.W],
    [C.W,C._,C.B,C.B,C.B,C.B,C.B,C.B,C.B,C.B,C.B,C.B,C.B,C._,C.W,C.W],
    [C.W,C._,C.B,C.B,C.B,C.B,C.B,C.Y,C.Y,C.B,C.B,C.B,C.B,C._,C.W,C.W],
    [C.W,C._,C.B,C.B,C.B,C.B,C.Y,C.Y,C.Y,C.B,C.B,C.B,C.B,C._,C.W,C.W],
    [C.W,C._,C.B,C.B,C.B,C.Y,C.Y,C.Y,C.B,C.B,C.B,C.B,C.B,C._,C.W,C.W],
    [C.W,C._,C.B,C.B,C.Y,C.Y,C.Y,C.Y,C.Y,C.Y,C.Y,C.B,C.B,C._,C.W,C.W],
    [C.W,C._,C.B,C.B,C.B,C.B,C.Y,C.Y,C.Y,C.B,C.B,C.B,C.B,C._,C.W,C.W],
    [C.W,C._,C.B,C.B,C.B,C.B,C.B,C.Y,C.B,C.B,C.B,C.B,C.B,C._,C.W,C.W],
    [C.W,C._,C.B,C.B,C.B,C.B,C.B,C.B,C.B,C.B,C.B,C.B,C.B,C._,C.W,C.W],
    [C.W,C._,C.B,C.B,C.B,C.B,C.B,C.B,C.B,C.B,C.B,C.B,C.B,C._,C.W,C.W],
    [C.W,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C.W,C.W],
    [C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
  ],
  'powerup_spread': [
    [C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W],
    [C.W,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C.W,C.W],
    [C.W,C._,C.D,C.D,C.D,C.D,C.D,C.D,C.D,C.D,C.D,C.D,C.D,C._,C.W,C.W],
    [C.W,C._,C.D,C.D,C.T,C.D,C.D,C.T,C.D,C.D,C.T,C.D,C.D,C._,C.W,C.W],
    [C.W,C._,C.D,C.D,C.T,C.T,C.D,C.T,C.D,C.T,C.T,C.D,C.D,C._,C.W,C.W],
    [C.W,C._,C.D,C.D,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.D,C.D,C._,C.W,C.W],
    [C.W,C._,C.D,C.D,C.D,C.T,C.T,C.T,C.T,C.T,C.D,C.D,C.D,C._,C.W,C.W],
    [C.W,C._,C.D,C.D,C.D,C.D,C.T,C.T,C.T,C.D,C.D,C.D,C.D,C._,C.W,C.W],
    [C.W,C._,C.D,C.D,C.D,C.D,C.D,C.T,C.D,C.D,C.D,C.D,C.D,C._,C.W,C.W],
    [C.W,C._,C.D,C.D,C.D,C.D,C.D,C.D,C.D,C.D,C.D,C.D,C.D,C._,C.W,C.W],
    [C.W,C._,C.D,C.D,C.D,C.D,C.D,C.D,C.D,C.D,C.D,C.D,C.D,C._,C.W,C.W],
    [C.W,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C.W,C.W],
    [C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
  ],
  'powerup_shield': [
    [C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W],
    [C.W,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C.W,C.W],
    [C.W,C._,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C._,C.W,C.W],
    [C.W,C._,C.T,C.T,C.W,C.W,C.W,C.T,C.T,C.W,C.W,C.T,C.T,C._,C.W,C.W],
    [C.W,C._,C.T,C.W,C.T,C.T,C.T,C.W,C.W,C.T,C.T,C.W,C.T,C._,C.W,C.W],
    [C.W,C._,C.T,C.W,C.T,C.T,C.T,C.W,C.W,C.T,C.T,C.W,C.T,C._,C.W,C.W],
    [C.W,C._,C.T,C.W,C.T,C.T,C.T,C.W,C.W,C.T,C.T,C.W,C.T,C._,C.W,C.W],
    [C.W,C._,C.T,C.T,C.W,C.W,C.W,C.T,C.T,C.W,C.W,C.T,C.T,C._,C.W,C.W],
    [C.W,C._,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C._,C.W,C.W],
    [C.W,C._,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C._,C.W,C.W],
    [C.W,C._,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C._,C.W,C.W],
    [C.W,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C.W,C.W],
    [C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W,C.W],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
  ],
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
    [C._,C._,C._,C._,C.R,C.R,C.R,C.R,C._,C.R,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C.R,C.R,C.R,C.R,C.R,C.R,C.R,C._,C._,C._,C.R,C.Y,C._],
    [C._,C._,C.R,C.R,C.R,C.R,C.R,C.R,C.R,C._,C._,C._,C.R,C.R,C.Y,C._],
    [C._,C._,C.R,C.R,C.W,C.B,C.R,C.R,C.R,C._,C._,C.R,C.R,C.Y,C.Y,C._],
    [C._,C._,C.R,C.R,C.R,C.R,C.R,C.L,C.L,C.R,C.R,C.R,C.Y,C.Y,C._,C._],
    [C._,C._,C.R,C.R,C.R,C.R,C.L,C.L,C.L,C.R,C.R,C.R,C.Y,C._,C._,C._],
    [C._,C._,C._,C.R,C.R,C.L,C.L,C.L,C.L,C.R,C.R,C.R,C.R,C._,C._,C._],
    [C._,C.R,C.R,C.R,C.R,C.L,C.L,C.L,C.L,C.R,C.R,C.R,C.R,C._,C._,C._],
    [C.R,C.R,C.R,C.R,C.R,C.R,C.L,C.L,C.L,C.R,C.R,C.R,C._,C._,C._,C._],
    [C.R,C.R,C.R,C.R,C.R,C.R,C.R,C.L,C.R,C.R,C.R,C.W,C.W,C._,C._,C._],
    [C._,C.R,C.R,C.R,C._,C.R,C.R,C.R,C.R,C.R,C.R,C.W,C.W,C._,C._,C._],
    [C._,C._,C.R,C.R,C._,C._,C.R,C.R,C.R,C.R,C._,C._,C._,C._,C._,C._],
    [C._,C._,C.R,C.R,C._,C._,C.R,C.R,C.R,C.R,C._,C._,C._,C._,C._,C._],
    [C._,C.R,C.R,C.R,C._,C._,C.R,C.R,C.R,C.R,C._,C._,C._,C._,C._,C._],
    [C._,C.R,C.R,C.R,C._,C._,C.R,C.R,C.R,C.R,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
  ],
  'charizard': [
    [C._,C._,C._,C._,C.O,C.O,C.O,C.O,C.O,C.O,C._,C._,C._,C._,C._,C._],
    [C._,C.T,C.T,C._,C.O,C.O,C.O,C.O,C.O,C.O,C._,C._,C._,C.R,C.Y,C._],
    [C.T,C.T,C.T,C.T,C.O,C.O,C.O,C.O,C.O,C.O,C._,C._,C.R,C.R,C.Y,C._],
    [C._,C.T,C.T,C.T,C.O,C.O,C.W,C.B,C.O,C.O,C._,C.R,C.R,C.Y,C.Y,C._],
    [C._,C.T,C.T,C.T,C.O,C.O,C.O,C.O,C.O,C.O,C.O,C.R,C.Y,C.Y,C._,C._],
    [C._,C._,C.T,C.T,C.O,C.O,C.L,C.L,C.L,C.O,C.O,C.O,C.Y,C._,C._,C._],
    [C._,C._,C.T,C.O,C.O,C.L,C.L,C.L,C.L,C.O,C.O,C.O,C.O,C.T,C.T,C._],
    [C._,C.O,C.O,C.O,C.O,C.L,C.L,C.L,C.L,C.O,C.O,C.O,C.T,C.T,C.T,C.T],
    [C.O,C.O,C.O,C.O,C.O,C.O,C.L,C.L,C.L,C.O,C.O,C.O,C.T,C.T,C.T,C._],
    [C.O,C.O,C.O,C.O,C.O,C.O,C.O,C.L,C.O,C.O,C.O,C.T,C.T,C._,C._,C._],
    [C._,C.O,C.O,C.O,C._,C.O,C.O,C.O,C.O,C.O,C.O,C._,C._,C._,C._,C._],
    [C._,C._,C.O,C.O,C._,C._,C.O,C.O,C.O,C.O,C._,C._,C._,C._,C._,C._],
    [C._,C._,C.O,C.O,C._,C._,C.O,C.O,C.O,C.O,C._,C._,C._,C._,C._,C._],
    [C._,C.O,C.O,C.O,C._,C._,C.O,C.O,C.O,C.O,C._,C._,C._,C._,C._,C._],
    [C._,C.O,C.O,C.O,C._,C._,C.O,C.O,C.O,C.O,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
  ],
  'squirtle': [
    [C._,C._,C._,C._,C._,C.T,C.T,C.T,C.T,C.T,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C.T,C.W,C.B,C.T,C.T,C.T,C.T,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C._,C._,C._,C._,C._],
    [C._,C._,C._,C.T,C.T,C.T,C.L,C.L,C.T,C.T,C.T,C._,C.L,C._,C._,C._],
    [C._,C._,C.T,C.T,C.T,C.L,C.L,C.L,C.L,C.T,C.T,C.L,C.N,C.L,C._,C._],
    [C._,C._,C.T,C.T,C.N,C.N,C.L,C.L,C.N,C.N,C.T,C.L,C.N,C.L,C._,C._],
    [C._,C._,C.T,C.T,C.N,C.L,C.L,C.L,C.L,C.N,C.T,C._,C.L,C._,C._,C._],
    [C._,C._,C._,C.T,C.N,C.L,C.L,C.L,C.L,C.N,C.T,C._,C._,C._,C._,C._],
    [C._,C._,C._,C.T,C.T,C.N,C.N,C.N,C.N,C.T,C.T,C._,C._,C._,C._,C._],
    [C._,C._,C._,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C._,C._,C._,C._,C._],
    [C._,C._,C._,C.T,C.T,C._,C._,C._,C._,C.T,C.T,C._,C._,C._,C._,C._],
    [C._,C._,C._,C.T,C.T,C._,C._,C._,C._,C.T,C.T,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
  ],
  'wartortle': [
    [C._,C._,C._,C._,C.W,C.W,C.W,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C.W,C.T,C.T,C.T,C.T,C.T,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C.W,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C._,C._,C._,C._,C._],
    [C._,C._,C._,C.W,C.T,C.W,C.B,C.T,C.T,C.T,C.T,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C.T,C.T,C.T,C.L,C.L,C.T,C.T,C._,C.W,C.W,C._,C._],
    [C._,C._,C.T,C.T,C.T,C.L,C.L,C.L,C.L,C.T,C.T,C.W,C.W,C.W,C._,C._],
    [C._,C._,C.T,C.T,C.N,C.N,C.L,C.L,C.N,C.N,C.T,C.W,C.W,C.W,C._,C._],
    [C._,C._,C.T,C.T,C.N,C.L,C.L,C.L,C.L,C.N,C.T,C._,C.W,C.W,C._,C._],
    [C._,C._,C._,C.T,C.N,C.L,C.L,C.L,C.L,C.N,C.T,C._,C._,C._,C._,C._],
    [C._,C._,C._,C.T,C.T,C.N,C.N,C.N,C.N,C.T,C.T,C._,C._,C._,C._,C._],
    [C._,C._,C._,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C._,C._,C._,C._,C._],
    [C._,C._,C._,C.T,C.T,C._,C._,C._,C._,C.T,C.T,C._,C._,C._,C._,C._],
    [C._,C._,C._,C.T,C.T,C._,C._,C._,C._,C.T,C.T,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
  ],
  'blastoise': [
    [C._,C._,C._,C._,C._,C.D,C.D,C.D,C.D,C.D,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C.D,C.D,C.D,C.D,C.D,C.D,C.D,C._,C._,C._,C._,C._],
    [C._,C.A,C.A,C.A,C.D,C.W,C.B,C.D,C.D,C.D,C.D,C.A,C.A,C.A,C._,C._],
    [C._,C.A,C.B,C.B,C.D,C.D,C.D,C.D,C.D,C.D,C.D,C.B,C.B,C.A,C._,C._],
    [C._,C.A,C.A,C.A,C.D,C.D,C.D,C.L,C.L,C.D,C.D,C.A,C.A,C.A,C._,C._],
    [C._,C._,C.D,C.D,C.D,C.L,C.L,C.L,C.L,C.D,C.D,C.D,C.D,C._,C._,C._],
    [C._,C._,C.D,C.D,C.N,C.N,C.L,C.L,C.N,C.N,C.D,C.D,C.D,C._,C._,C._],
    [C._,C._,C.D,C.D,C.N,C.L,C.L,C.L,C.L,C.N,C.D,C._,C._,C._,C._,C._],
    [C._,C._,C._,C.D,C.N,C.L,C.L,C.L,C.L,C.N,C.D,C._,C._,C._,C._,C._],
    [C._,C._,C._,C.D,C.D,C.N,C.N,C.N,C.N,C.D,C.D,C._,C._,C._,C._,C._],
    [C._,C._,C._,C.D,C.D,C.D,C.D,C.D,C.D,C.D,C.D,C._,C._,C._,C._,C._],
    [C._,C._,C._,C.D,C.D,C.W,C.W,C.W,C.W,C.D,C.D,C._,C._,C._,C._,C._],
    [C._,C._,C._,C.D,C.D,C.W,C.W,C.W,C.W,C.D,C.D,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
  ],
  'bulbasaur': [
    [C._,C._,C._,C._,C._,C.G,C.H,C.G,C.H,C.G,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C.G,C.H,C.G,C.H,C.G,C.H,C.G,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C.G,C.H,C.G,C.H,C.G,C.H,C.G,C._,C._,C._,C._,C._],
    [C._,C._,C._,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C._,C._,C._,C._,C._],
    [C._,C._,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C._,C._,C._,C._],
    [C._,C._,C.T,C.W,C.B,C.T,C.T,C.W,C.B,C.T,C.T,C.T,C._,C._,C._,C._],
    [C._,C._,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C._,C._,C._,C._],
    [C._,C.T,C.T,C.T,C.H,C.T,C.T,C.T,C.H,C.T,C.T,C.T,C._,C._,C._,C._],
    [C._,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C._,C._,C._,C._],
    [C._,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C._,C._,C._,C._],
    [C._,C.T,C.T,C.T,C._,C._,C.T,C.T,C._,C._,C.T,C.T,C._,C._,C._,C._],
    [C._,C.T,C.T,C.T,C._,C._,C.T,C.T,C._,C._,C.T,C.T,C._,C._,C._,C._],
    [C._,C.W,C.W,C.W,C._,C._,C._,C._,C._,C._,C.W,C.W,C._,C._,C._,C._],
  ],
  'ivysaur': [
    [C._,C._,C._,C._,C._,C.M,C.M,C.M,C.M,C.M,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C.H,C.G,C.H,C.G,C.H,C.G,C.H,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C.H,C.G,C.H,C.G,C.H,C.G,C.H,C._,C._,C._,C._,C._],
    [C._,C._,C._,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C._,C._,C._,C._,C._],
    [C._,C._,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C._,C._,C._,C._],
    [C._,C._,C.T,C.W,C.B,C.T,C.T,C.W,C.B,C.T,C.T,C.T,C._,C._,C._,C._],
    [C._,C._,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C._,C._,C._,C._],
    [C._,C.T,C.T,C.T,C.H,C.T,C.T,C.T,C.H,C.T,C.T,C.T,C._,C._,C._,C._],
    [C._,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C._,C._,C._,C._],
    [C._,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C._,C._,C._,C._],
    [C._,C.T,C.T,C.T,C._,C._,C.T,C.T,C._,C._,C.T,C.T,C._,C._,C._,C._],
    [C._,C.T,C.T,C.T,C._,C._,C.T,C.T,C._,C._,C.T,C.T,C._,C._,C._,C._],
    [C._,C.W,C.W,C.W,C._,C._,C._,C._,C._,C._,C.W,C.W,C._,C._,C._,C._],
  ],
  'venusaur': [
    [C._,C._,C.M,C.M,C.M,C.M,C.Y,C.Y,C.M,C.M,C.M,C.M,C._,C._,C._,C._],
    [C._,C._,C.M,C.M,C.M,C.H,C.G,C.H,C.G,C.H,C.M,C.M,C.M,C._,C._,C._],
    [C._,C._,C._,C._,C.H,C.G,C.H,C.G,C.H,C.G,C.H,C._,C._,C._,C._,C._],
    [C._,C._,C._,C.H,C.H,C.H,C.H,C.H,C.H,C.H,C.H,C._,C._,C._,C._,C._],
    [C._,C._,C.H,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.H,C._,C._,C._,C._],
    [C._,C._,C.T,C.W,C.B,C.T,C.T,C.W,C.B,C.T,C.T,C.T,C._,C._,C._,C._],
    [C._,C._,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C._,C._,C._,C._],
    [C._,C.T,C.T,C.T,C.H,C.T,C.T,C.T,C.H,C.T,C.T,C.T,C._,C._,C._,C._],
    [C._,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C._,C._,C._,C._],
    [C._,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C.T,C._,C._,C._,C._],
    [C._,C.T,C.T,C.T,C._,C._,C.T,C.T,C._,C._,C.T,C.T,C._,C._,C._,C._],
    [C._,C.T,C.T,C.T,C._,C._,C.T,C.T,C._,C._,C.T,C.T,C._,C._,C._,C._],
    [C._,C.W,C.W,C.W,C._,C._,C._,C._,C._,C._,C.W,C.W,C._,C._,C._,C._],
  ],
  'pikachu': [
    [C._,C._,C.Y,C.B,C._,C._,C._,C._,C._,C.B,C.Y,C._,C._,C._,C._,C._],
    [C._,C._,C.Y,C.B,C._,C._,C._,C._,C._,C.B,C.Y,C._,C._,C._,C._,C._],
    [C._,C._,C.Y,C.Y,C._,C._,C._,C._,C._,C.Y,C.Y,C._,C._,C._,C._,C._],
    [C._,C._,C._,C.Y,C.Y,C.Y,C.Y,C.Y,C.Y,C.Y,C._,C._,C._,C._,C._,C._],
    [C._,C._,C.Y,C.Y,C.Y,C.Y,C.Y,C.Y,C.Y,C.Y,C.Y,C._,C._,C._,C._,C._],
    [C._,C._,C.Y,C.W,C.B,C.Y,C.Y,C.W,C.B,C.Y,C.Y,C._,C._,C._,C._,C._],
    [C._,C._,C.R,C.Y,C.Y,C.B,C.B,C.Y,C.Y,C.Y,C.R,C._,C._,C._,C._,C._],
    [C._,C._,C.Y,C.Y,C.Y,C.Y,C.Y,C.Y,C.Y,C.Y,C.Y,C._,C._,C._,C._,C._],
    [C._,C.Y,C.Y,C.Y,C.Y,C.Y,C.Y,C.Y,C.Y,C.Y,C.Y,C.Y,C._,C._,C._,C._],
    [C._,C.Y,C.Y,C.Y,C.Y,C.Y,C.Y,C.Y,C.Y,C.Y,C.Y,C.Y,C._,C.N,C.N,C._],
    [C._,C.Y,C.Y,C.Y,C._,C._,C.Y,C.Y,C._,C._,C.Y,C.Y,C._,C.N,C.Y,C._],
    [C._,C.Y,C.Y,C.Y,C._,C._,C.Y,C.Y,C._,C._,C.Y,C.Y,C.Y,C.Y,C.Y,C._],
    [C._,C.Y,C.Y,C._,C._,C._,C._,C._,C._,C._,C.Y,C.Y,C._,C.Y,C._,C._],
  ],
  'raichu': [
    [C._,C._,C.O,C.N,C._,C._,C._,C._,C._,C.N,C.O,C._,C._,C._,C._,C._],
    [C._,C.O,C.O,C.N,C._,C._,C._,C._,C._,C.N,C.O,C.O,C._,C._,C._,C._],
    [C._,C.O,C.Y,C.Y,C._,C._,C._,C._,C._,C.Y,C.Y,C.O,C._,C._,C._,C._],
    [C._,C._,C._,C.O,C.O,C.O,C.O,C.O,C.O,C.O,C._,C._,C._,C._,C._,C._],
    [C._,C._,C.O,C.O,C.O,C.O,C.O,C.O,C.O,C.O,C.O,C._,C._,C._,C._,C._],
    [C._,C._,C.O,C.W,C.B,C.O,C.O,C.W,C.B,C.O,C.O,C._,C._,C._,C._,C._],
    [C._,C._,C.Y,C.O,C.O,C.B,C.B,C.O,C.O,C.O,C.Y,C._,C._,C._,C._,C._],
    [C._,C._,C.O,C.O,C.W,C.W,C.W,C.W,C.O,C.O,C.O,C._,C._,C._,C._,C._],
    [C._,C.O,C.O,C.O,C.W,C.W,C.W,C.W,C.O,C.O,C.O,C.O,C._,C._,C.N,C.N],
    [C._,C.O,C.O,C.O,C.O,C.O,C.O,C.O,C.O,C.O,C.O,C.O,C._,C.N,C.Y,C.N],
    [C._,C.O,C.O,C.O,C._,C._,C.O,C.O,C._,C._,C.O,C.O,C._,C.N,C.Y,C.N],
    [C._,C.O,C.O,C.O,C._,C._,C.O,C.O,C._,C._,C.O,C.O,C.N,C.Y,C.N,C._],
    [C._,C.O,C.O,C._,C._,C._,C._,C._,C._,C._,C.O,C.O,C.N,C.N,C._,C._],
  ],
  'geodude': [
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C.A,C.A,C.A,C.A,C.A,C._,C._,C._,C._,C._,C._,C._],
    [C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C._,C._,C._],
    [C.A,C.A,C.A,C.A,C.W,C.B,C.A,C.A,C.W,C.B,C.A,C.A,C.A,C._,C._,C._],
    [C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C._,C._,C._],
    [C._,C._,C._,C.A,C.A,C.A,C.B,C.B,C.B,C.A,C.A,C.A,C._,C._,C._,C._],
    [C._,C._,C._,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C._,C._,C._,C._,C._],
    [C._,C._,C._,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C._,C._,C._,C._,C._],
    [C._,C._,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C._,C._,C._,C._],
    [C._,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C._,C._,C._],
    [C._,C._,C._,C.A,C.A,C.A,C._,C._,C.A,C.A,C.A,C._,C._,C._,C._,C._],
  ],
  'caterpie': [
    [C._,C._,C._,C._,C._,C.R,C.R,C._,C.R,C.R,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C._,C._,C._,C._,C._],
    [C._,C._,C._,C.G,C.G,C.W,C.B,C.G,C.W,C.B,C.G,C.G,C._,C._,C._,C._],
    [C._,C._,C._,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C._,C._,C._,C._],
    [C._,C._,C._,C._,C.G,C.G,C.G,C.L,C.G,C.G,C.G,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C.G,C.G,C.L,C.G,C.G,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C.G,C.G,C.G,C.G,C.G,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C.G,C.L,C.G,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C.G,C.G,C.G,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C.N,C._,C.N,C._,C._,C._,C._,C._,C._,C._],
  ],
  'metapod': [
    [C._,C._,C._,C._,C._,C.G,C.G,C.G,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C.G,C.G,C.G,C.G,C.G,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C.G,C.G,C.W,C.B,C.G,C.G,C.G,C._,C._,C._,C._,C._,C._],
    [C._,C._,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C._,C._,C._,C._,C._,C._],
    [C._,C._,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C._,C._,C._,C._,C._],
    [C._,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C._,C._,C._,C._,C._],
    [C._,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C._,C._,C._,C._,C._,C._],
    [C._,C._,C.G,C.G,C.G,C.G,C.G,C.G,C.G,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C.G,C.G,C.G,C.G,C.G,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C.G,C.G,C.G,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C.G,C.G,C.G,C._,C._,C._,C._,C._,C._,C._,C._,C._],
  ],
  'butterfree': [
    [C.W,C.W,C.B,C._,C._,C._,C._,C._,C._,C._,C._,C.B,C.W,C.W,C._,C._],
    [C.W,C.W,C.W,C.B,C._,C._,C._,C._,C._,C._,C.B,C.W,C.W,C.W,C._,C._],
    [C.W,C.W,C.W,C.W,C.B,C._,C._,C._,C._,C.B,C.W,C.W,C.W,C.W,C._,C._],
    [C.W,C.W,C.W,C.W,C.B,C.P,C.P,C.P,C.P,C.B,C.W,C.W,C.W,C.W,C._,C._],
    [C.W,C.W,C.W,C.W,C.P,C.R,C.R,C.R,C.R,C.P,C.W,C.W,C.W,C.W,C._,C._],
    [C._,C.W,C.W,C.W,C.P,C.R,C.R,C.R,C.R,C.P,C.W,C.W,C.W,C._,C._,C._],
    [C._,C._,C.W,C.B,C.P,C.P,C.P,C.P,C.P,C.P,C.B,C.W,C._,C._,C._,C._],
    [C._,C._,C._,C.B,C.P,C.P,C.P,C.P,C.P,C.P,C.B,C._,C._,C._,C._,C._],
    [C._,C._,C.W,C.B,C.P,C.P,C.P,C.P,C.P,C.P,C.B,C.W,C._,C._,C._,C._],
    [C._,C.W,C.W,C.W,C.P,C.P,C.T,C.T,C.P,C.P,C.W,C.W,C.W,C._,C._,C._],
    [C.W,C.W,C.W,C.W,C.P,C.T,C.T,C.T,C.T,C.P,C.W,C.W,C.W,C.W,C._,C._],
    [C.W,C.W,C.W,C.W,C.P,C.P,C.P,C.P,C.P,C.P,C.W,C.W,C.W,C.W,C._,C._],
    [C.W,C.W,C.B,C._,C.P,C.P,C._,C._,C.P,C.P,C._,C.B,C.W,C.W,C._,C._],
  ],
  'gastly': [
    [C._,C._,C._,C.P,C.P,C.B,C.B,C.B,C.B,C.B,C.P,C.P,C._,C._,C._,C._],
    [C._,C._,C.P,C.K,C.B,C.B,C.B,C.B,C.B,C.B,C.B,C.K,C.P,C._,C._,C._],
    [C._,C.P,C.K,C.B,C.B,C.B,C.B,C.B,C.B,C.B,C.B,C.B,C.K,C.P,C._,C._],
    [C._,C.P,C.K,C.B,C.W,C.W,C.B,C.B,C.B,C.W,C.W,C.B,C.K,C.P,C._,C._],
    [C.P,C.K,C.B,C.B,C.W,C.B,C.B,C.B,C.B,C.W,C.B,C.B,C.B,C.K,C.P,C._],
    [C.P,C.K,C.B,C.B,C.B,C.B,C.B,C.B,C.B,C.B,C.B,C.B,C.B,C.K,C.P,C._],
    [C.P,C.K,C.B,C.B,C.B,C.B,C.B,C.B,C.B,C.B,C.B,C.B,C.B,C.K,C.P,C._],
    [C.P,C.K,C.B,C.B,C.B,C.B,C.B,C.B,C.B,C.B,C.B,C.B,C.B,C.K,C.P,C._],
    [C._,C.P,C.K,C.B,C.B,C.B,C.B,C.B,C.B,C.B,C.B,C.B,C.K,C.P,C._,C._],
    [C._,C._,C.P,C.K,C.B,C.B,C.B,C.B,C.B,C.B,C.B,C.K,C.P,C._,C._,C._],
    [C._,C._,C._,C.P,C.P,C.B,C.B,C.B,C.B,C.B,C.P,C.P,C._,C._,C._,C._],
    [C._,C._,C._,C._,C.P,C.P,C.P,C.P,C.P,C.P,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
  ],
  'mewtwo': [
    [C._,C._,C._,C.A,C.A,C.P,C.A,C.A,C._,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C.A,C.W,C.B,C.A,C.W,C.B,C.A,C._,C._,C._,C._,C._,C._,C._],
    [C._,C._,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C._,C._,C._,C._,C._,C._],
    [C._,C._,C._,C.A,C.A,C.A,C.A,C.A,C.A,C.P,C._,C._,C._,C._,C._,C._],
    [C._,C._,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.P,C._,C._,C._,C._,C._,C._],
    [C._,C._,C.A,C.A,C.A,C.P,C.P,C.P,C.P,C.P,C.P,C.P,C.P,C._,C._,C._],
    [C._,C.A,C.A,C.A,C.A,C.P,C.A,C.A,C.A,C.P,C.A,C.A,C.A,C.P,C._,C._],
    [C._,C.A,C.A,C.A,C.A,C.P,C.A,C.A,C.A,C.P,C.A,C.A,C.A,C.P,C._,C._],
    [C.A,C.A,C.A,C.A,C.A,C.P,C.A,C.A,C.A,C.P,C.A,C.A,C.A,C.P,C._,C._],
    [C.A,C.A,C.A,C.A,C.A,C.P,C.A,C.A,C.A,C.P,C.A,C.A,C.A,C.P,C._,C._],
    [C.A,C.A,C.A,C.A,C.A,C.P,C.A,C.A,C.A,C.P,C.A,C.A,C.A,C.P,C._,C._],
    [C.P,C.P,C.P,C.A,C.A,C.P,C.P,C.P,C.P,C.P,C.A,C.A,C.P,C.P,C.P,C._],
  ]
};

const DEFAULT_SPRITE = [
  [C._,C._,C._,C._,C._,C.W,C.W,C.W,C.W,C._,C._,C._,C._,C._,C._,C._],
  [C._,C._,C._,C.W,C.W,C.A,C.A,C.A,C.A,C.W,C.W,C._,C._,C._,C._,C._],
  [C._,C._,C.W,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.W,C._,C._,C._,C._],
  [C._,C.W,C.A,C.A,C.A,C.W,C.B,C.A,C.W,C.B,C.A,C.A,C.W,C._,C._,C._],
  [C._,C.W,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.W,C._,C._,C._],
  [C._,C.W,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.W,C._,C._,C._],
  [C._,C.W,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.W,C._,C._,C._],
  [C._,C.W,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.W,C._,C._,C._],
  [C._,C.W,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.W,C._,C._,C._],
  [C._,C.W,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.W,C._,C._,C._],
  [C._,C.W,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.W,C._,C._,C._],
  [C._,C._,C.W,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.A,C.W,C._,C._,C._,C._],
  [C._,C._,C._,C.W,C.W,C.A,C.A,C.A,C.A,C.W,C.W,C._,C._,C._,C._,C._],
  [C._,C._,C._,C._,C._,C.W,C.W,C.W,C.W,C._,C._,C._,C._,C._,C._,C._],
  [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
  [C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._,C._],
];

export const PixelSprite: React.FC<{ speciesId: string; pose?: string }> = ({ speciesId, pose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, 16, 16);
    
    // Fallback logic
    let data = SPRITE_DATA[speciesId] || DEFAULT_SPRITE; 
    
    // Drawing logic
    for (let y = 0; y < 16; y++) {
      if (!data[y]) continue;
      for (let x = 0; x < 16; x++) {
        const color = data[y][x];
        if (color) {
          ctx.fillStyle = color;
          
          let drawY = y;
          // Simple procedural animation for 'pose'
          if (pose === 'move_1') {
            // Bob up
             if (x === 0 || x === 15) drawY = y - 1; 
          } else if (pose === 'move_2') {
             if (x === 0 || x === 15) drawY = y + 1; 
          } else if (pose === 'attack') {
             if (x > 4 && x < 12) drawY = y - 1;
          }

          ctx.fillRect(x, drawY, 1, 1);
        }
      }
    }
  }, [speciesId, pose]);

  return <canvas ref={canvasRef} width={16} height={16} className="w-full h-full rendering-pixelated" style={{ imageRendering: 'pixelated' }} />;
};

export const ProjectileVisual: React.FC<{ type: PokemonType; isPlayer: boolean }> = ({ type, isPlayer }) => {
  const typeColor = {
      [PokemonType.FIRE]: 'bg-red-500',
      [PokemonType.WATER]: 'bg-blue-400',
      [PokemonType.GRASS]: 'bg-green-500',
      [PokemonType.ELECTRIC]: 'bg-yellow-400',
      [PokemonType.PSYCHIC]: 'bg-pink-500',
      [PokemonType.ROCK]: 'bg-stone-500',
      [PokemonType.BUG]: 'bg-lime-500',
      [PokemonType.GHOST]: 'bg-purple-600',
      [PokemonType.DRAGON]: 'bg-indigo-600',
      [PokemonType.NORMAL]: 'bg-gray-200'
  }[type] || 'bg-white';

  return (
    <div className={`w-3 h-3 rounded-full ${typeColor} shadow-[0_0_5px_currentColor]`} />
  );
};

export const ExplosionVisual: React.FC<{ frameIndex: number }> = ({ frameIndex }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, 16, 16);
      
      const frame = EXPLOSION_FRAMES[frameIndex];
      if (!frame) return;

      for (let y = 0; y < 16; y++) {
        if (!frame[y]) continue;
        for (let x = 0; x < 16; x++) {
          const color = frame[y][x];
          if (color) {
            ctx.fillStyle = color;
            ctx.fillRect(x, y, 1, 1);
          }
        }
      }
    }, [frameIndex]);

    return (
        <canvas ref={canvasRef} width={16} height={16} className="w-full h-full rendering-pixelated" style={{ imageRendering: 'pixelated' }} />
    );
};

export const PokeballSprite: React.FC = () => (
    <div className="w-4 h-4 rounded-full border border-black bg-gradient-to-b from-red-500 to-white overflow-hidden relative shadow-md">
         <div className="absolute top-1/2 left-0 w-full h-[1px] bg-black" />
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white border border-black rounded-full" />
    </div>
);

export const ParticleVisual: React.FC<{ type: PokemonType; life: number }> = ({ type, life }) => {
     return <div style={{ opacity: life }} className="w-1 h-1 bg-white" />;
};

export const UFOVisual: React.FC = () => {
    return <PixelSprite speciesId="ufo" />;
};
