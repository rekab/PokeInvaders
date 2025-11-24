import { Pokemon, PokemonType, Stats, Enemy, Barrier } from "../types";
import { POKEDEX, TYPE_CHART, BARRIER_WIDTH, BARRIER_HEIGHT, GAME_HEIGHT } from "../constants";
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
  };

  return {
    id: generateId(),
    speciesId,
    name: data.name,
    nickname: data.name, // Default nickname is species name
    type: data.type,
    stats,
    level,
    xp: 0,
    xpToNextLevel: level * 100,
    spriteColor: data.spriteColor,
    projectileColor: data.projectileColor,
    evolvesTo: data.evolvesTo,
    evolutionLevel: data.evolutionLevel,
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
    
    // If nickname was default species name, update it to new species name. Otherwise keep custom nickname.
    // Simple check: if old nickname == old species name, update. 
    // But we don't have old species name handy here easily without looking it up or storing it.
    // For now, let's just keep the nickname. If the user named it "Charmander" it stays "Charmander" when Charmeleon. 
    // This is how it works in main games usually unless you didn't nickname it.
    if (pokemon.nickname === pokemon.name) {
        newForm.nickname = newForm.name;
    }
    
    return newForm;
  }
  return pokemon;
};

export const getWaveEnemies = (wave: number, gameWidth: number): Enemy[] => {
  const enemies: Enemy[] = [];
  const rows = Math.min(5, 2 + Math.floor(wave / 2));
  const cols = Math.min(8, 4 + Math.floor(wave / 3));
  
  // Determine wave types
  const availableTypes = Object.keys(POKEDEX).filter(k => !['mewtwo', 'charizard', 'blastoise', 'venusaur'].includes(k));
  
  // Boss wave every 5 levels
  if (wave % 5 === 0) {
     const bossSpecies = ['mewtwo', 'charizard', 'blastoise', 'venusaur'][Math.floor(Math.random() * 4)];
     const boss = createPokemon(bossSpecies, wave + 2);
     enemies.push({
       id: generateId(),
       x: gameWidth / 2 - 40, // Centered
       y: 50,
       width: 80,
       height: 80,
       pokemon: boss,
       direction: 1
     });
     return enemies;
  }

  // Standard wave
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const randomSpecies = availableTypes[Math.floor(Math.random() * availableTypes.length)];
      const mon = createPokemon(randomSpecies, Math.max(1, wave - 1));
      
      enemies.push({
        id: generateId(),
        x: 50 + (c * 60),
        y: 50 + (r * 50),
        width: 32,
        height: 32,
        pokemon: mon,
        direction: 1
      });
    }
  }
  return enemies;
};

export const generateBarriers = (gameWidth: number, wave: number): Barrier[] => {
    // Spawn barriers roughly every 3rd wave or randomly
    const barriers: Barrier[] = [];
    const count = 3;
    const gap = gameWidth / (count + 1);
    
    // 30% chance of barriers appearing, or guaranteed on wave 1 for tutorial feel
    if (wave === 1 || Math.random() < 0.3) {
        for(let i=1; i<=count; i++) {
            barriers.push({
                id: generateId(),
                x: (gap * i) - (BARRIER_WIDTH/2),
                y: GAME_HEIGHT - 120, // 120px from bottom (above player)
                width: BARRIER_WIDTH,
                height: BARRIER_HEIGHT,
                hp: 200 + (wave * 50),
                maxHp: 200 + (wave * 50)
            });
        }
    }
    return barriers;
};