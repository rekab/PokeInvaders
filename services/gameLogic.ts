
import { Pokemon, PokemonType, Stats, Enemy, Barrier, BarrierCell } from "../types";
import { POKEDEX, TYPE_CHART, BARRIER_WIDTH, BARRIER_HEIGHT, BARRIER_ROWS, BARRIER_COLS, BARRIER_CELL_SIZE, GAME_HEIGHT } from "../constants";
import { v4 as uuidv4 } from 'uuid';

const generateId = () => Math.random().toString(36).substr(2, 9);

export const createPokemon = (speciesId: string, level: number = 1): Pokemon => {
  const data = POKEDEX[speciesId];
  if (!data) throw new Error(`Unknown species: ${speciesId}`);
  
  // Simple stat scaling: Base + (Base * 0.1 * (Level - 1))
  const scale = 1 + (0.1 * (level - 1));
  
  const stats: Stats = {
    hp: Math.floor(data.baseStats.hp * scale),
    maxHp: Math.floor(data.baseStats.hp * scale),
    attack: Math.floor(data.baseStats.attack * scale),
    speed: Math.floor(data.baseStats.speed * scale),
    fireRate: data.baseStats.fireRate,
    moveSpeed: data.baseStats.moveSpeed,
    projectileSpeed: data.baseStats.projectileSpeed,
  };

  return {
    id: generateId(),
    speciesId,
    name: data.name,
    nickname: data.name, // Default nickname is species name
    type: data.type,
    stats,
    shootPattern: data.baseStats.shootPattern,
    level,
    xp: 0,
    xpToNextLevel: level * 100,
    spriteColor: data.spriteColor,
    projectileColor: data.projectileColor,
    evolvesTo: data.evolvesTo,
    evolutionLevel: data.evolutionLevel,
    activeBuffs: {}
  };
};

export const calculateDamage = (attacker: Pokemon, defender: Pokemon): { damage: number; isEffective: boolean; isWeak: boolean } => {
  let multiplier = 1;
  const attackType = attacker.type;
  const defendType = defender.type;

  const chart = TYPE_CHART[attackType];
  let isEffective = false;
  let isWeak = false;

  if (chart.strong.includes(defendType)) {
    multiplier = 2;
    isEffective = true;
  } else if (chart.weak.includes(defendType)) {
    multiplier = 0.5;
    isWeak = true;
  }

  // Basic damage formula: (Attack * 0.5) * Multiplier. Min 1.
  const damage = Math.max(1, Math.floor((attacker.stats.attack * 0.5) * multiplier));
  return { damage, isEffective, isWeak };
};

export const checkEvolution = (pokemon: Pokemon): Pokemon => {
  if (pokemon.evolvesTo && pokemon.evolutionLevel && pokemon.level >= pokemon.evolutionLevel) {
    const newForm = createPokemon(pokemon.evolvesTo, pokemon.level);
    newForm.id = pokemon.id; // Keep same instance ID
    newForm.xp = pokemon.xp; // Keep XP
    newForm.nickname = pokemon.nickname; // Keep nickname
    newForm.activeBuffs = pokemon.activeBuffs;
    
    // If nickname was default species name, update it to new species name. Otherwise keep custom nickname.
    if (pokemon.nickname === pokemon.name) {
        newForm.nickname = newForm.name;
    }
    
    return newForm;
  }
  return pokemon;
};

export const getWaveEnemies = (wave: number, gameWidth: number, hpMultiplier: number = 1.0): Enemy[] => {
  const enemies: Enemy[] = [];
  const rows = Math.min(5, 2 + Math.floor(wave / 2));
  const cols = Math.min(8, 4 + Math.floor(wave / 3));
  
  // Determine wave types
  const availableTypes = Object.keys(POKEDEX).filter(k => !['mewtwo', 'charizard', 'blastoise', 'venusaur'].includes(k));
  
  // Boss wave every 5 levels
  if (wave % 5 === 0) {
     const bossSpecies = ['mewtwo', 'charizard', 'blastoise', 'venusaur'][Math.floor(Math.random() * 4)];
     const boss = createPokemon(bossSpecies, wave + 2);
     // Apply Difficulty Multiplier to Boss HP
     boss.stats.maxHp = Math.floor(boss.stats.maxHp * hpMultiplier);
     boss.stats.hp = boss.stats.maxHp;

     enemies.push({
       id: generateId(),
       x: gameWidth / 2 - 40, // Centered
       y: 50,
       width: 80,
       height: 80,
       pokemon: boss,
       direction: 1,
       attackFrame: 0
     });
     return enemies;
  }

  // Standard wave
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const randomSpecies = availableTypes[Math.floor(Math.random() * availableTypes.length)];
      const mon = createPokemon(randomSpecies, Math.max(1, wave - 1));
      
      // Apply Difficulty Multiplier to Enemy HP
      mon.stats.maxHp = Math.floor(mon.stats.maxHp * hpMultiplier);
      mon.stats.hp = mon.stats.maxHp;

      enemies.push({
        id: generateId(),
        x: 50 + (c * 60),
        y: 50 + (r * 50),
        width: 32,
        height: 32,
        pokemon: mon,
        direction: 1,
        attackFrame: 0
      });
    }
  }
  return enemies;
};

export const generateBarriers = (gameWidth: number, wave: number): Barrier[] => {
    // Spawn barriers every wave
    const barriers: Barrier[] = [];
    const count = 3;
    const gap = gameWidth / (count + 1);
    
    for(let i=1; i<=count; i++) {
        const barrierX = (gap * i) - (BARRIER_WIDTH/2);
        
        // MOVED UP significantly to allow player movement space below
        // Game Height 600. Player safe zone ~150-200px at bottom. 
        // Move barriers to y=380 (approx)
        const barrierY = GAME_HEIGHT - 220;
        
        const cells: BarrierCell[] = [];
        
        for(let row = 0; row < BARRIER_ROWS; row++) {
            for(let col = 0; col < BARRIER_COLS; col++) {
                // Create a "Bunker" shape by skipping corners on top row
                if (row === 0 && (col === 0 || col === BARRIER_COLS - 1)) continue;
                // Create arch at bottom
                if (row === BARRIER_ROWS - 1 && (col > 2 && col < 5)) continue;

                cells.push({
                    x: barrierX + (col * BARRIER_CELL_SIZE),
                    y: barrierY + (row * BARRIER_CELL_SIZE),
                    width: BARRIER_CELL_SIZE,
                    height: BARRIER_CELL_SIZE,
                    active: true
                });
            }
        }

        barriers.push({
            id: generateId(),
            x: barrierX,
            y: barrierY,
            width: BARRIER_WIDTH,
            height: BARRIER_HEIGHT,
            cells
        });
    }

    return barriers;
};
