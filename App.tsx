import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  GAME_WIDTH, GAME_HEIGHT, PLAYER_WIDTH, PLAYER_SPEED, 
  BASE_ENEMY_SPEED, ENEMY_DROP_DISTANCE, PROJECTILE_HEIGHT, PROJECTILE_WIDTH, ENEMY_HEIGHT, ENEMY_WIDTH, POKEDEX 
} from './constants';
import { Pokemon, Enemy, Projectile, GameState, PokemonType, Barrier, Explosion } from './types';
import { createPokemon, getWaveEnemies, calculateDamage, checkEvolution, generateBarriers } from './services/gameLogic';
import { AudioService } from './services/audioService';
import GameCanvas from './components/GameCanvas';
import HUD from './components/UI/HUD';
import BenchModal from './components/UI/BenchModal';
import RenameModal from './components/UI/RenameModal';

const App: React.FC = () => {
  // --- Game State ---
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    isPaused: false,
    isGameOver: false,
    wave: 1,
    score: 0,
    lastFrameTime: 0,
  });

  const [team, setTeam] = useState<Pokemon[]>([createPokemon('charmander'), createPokemon('squirtle'), createPokemon('bulbasaur')]);
  const [bench, setBench] = useState<Pokemon[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  
  // UI State
  const [showBench, setShowBench] = useState(false);
  const [gameMessage, setGameMessage] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  
  const activePokemon = team[activeIndex];

  // --- Mutable Game Entities (Refs for performance in loop) ---
  const playerXRef = useRef(GAME_WIDTH / 2);
  const enemiesRef = useRef<Enemy[]>([]);
  const projectilesRef = useRef<Projectile[]>([]);
  const barriersRef = useRef<Barrier[]>([]);
  const explosionsRef = useRef<Explosion[]>([]);
  const keysPressed = useRef<Record<string, boolean>>({});
  const lastShotTime = useRef(0);
  const animationFrameId = useRef<number>(0);

  // --- React State for Rendering (Syncs with Refs occasionally or per frame) ---
  const [renderTrigger, setRenderTrigger] = useState(0); // Dummy state to force re-render

  // --- Controls ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture keys if renaming
      if (renamingId) return;

      keysPressed.current[e.key] = true;
      if (e.key.toLowerCase() === 'p') togglePause();
      if (['1', '2', '3'].includes(e.key)) {
        const idx = parseInt(e.key) - 1;
        if (team[idx] && team[idx].stats.hp > 0) setActiveIndex(idx);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (renamingId) return;
      keysPressed.current[e.key] = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [team, renamingId]); 

  const togglePause = () => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  // --- Helper: Start Wave ---
  const startWave = useCallback((waveNum: number) => {
    enemiesRef.current = getWaveEnemies(waveNum, GAME_WIDTH);
    projectilesRef.current = [];
    // Only spawn barriers on wave 1, or randomly on subsequent waves
    barriersRef.current = generateBarriers(GAME_WIDTH, waveNum);
    explosionsRef.current = [];
    
    playerXRef.current = GAME_WIDTH / 2;
    setGameState(prev => ({ ...prev, wave: waveNum, isPlaying: true }));
    setShowBench(false);
  }, []);

  // --- Game Loop ---
  const update = useCallback((time: number) => {
    // Stop loop if not playing or paused
    if (!gameState.isPlaying || gameState.isPaused || gameState.isGameOver) {
       // Just keep requesting frame to check for unpause, but don't update logic
       if (gameState.isPlaying && !gameState.isGameOver) {
          // It's just paused
       } else {
          // It's dead or menu
          animationFrameId.current = requestAnimationFrame(update);
          return;
       }
    }
    
    // If paused, skip logic update
    if (gameState.isPaused) {
       animationFrameId.current = requestAnimationFrame(update);
       return;
    }

    const deltaTime = (time - gameState.lastFrameTime) / 1000;
    // Cap delta time to prevent huge jumps
    const dt = Math.min(deltaTime, 0.1); 
    
    // 1. Player Movement
    if (keysPressed.current['ArrowLeft']) {
      playerXRef.current = Math.max(PLAYER_WIDTH / 2, playerXRef.current - PLAYER_SPEED * dt);
    }
    if (keysPressed.current['ArrowRight']) {
      playerXRef.current = Math.min(GAME_WIDTH - PLAYER_WIDTH / 2, playerXRef.current + PLAYER_SPEED * dt);
    }

    // 2. Shooting
    if (keysPressed.current[' '] && time - lastShotTime.current > (500 - (activePokemon.stats.speed * 10))) {
      // DYNAMIC PROJECTILE SPEED: 300 base + (speed stat * 15)
      const projectileSpeed = 300 + (activePokemon.stats.speed * 15);
      
      projectilesRef.current.push({
        id: Math.random().toString(),
        x: playerXRef.current, // Centered on player center, offset handled in canvas
        y: GAME_HEIGHT - 60,
        width: PROJECTILE_WIDTH,
        height: PROJECTILE_HEIGHT,
        dy: -projectileSpeed, 
        damage: activePokemon.stats.attack,
        type: activePokemon.type,
        owner: 'player'
      });
      lastShotTime.current = time;
      AudioService.playShoot(activePokemon.type);
    }

    // 3. Enemy Logic
    let hitWall = false;
    enemiesRef.current.forEach(enemy => {
      enemy.x += (BASE_ENEMY_SPEED + (gameState.wave * 5)) * enemy.direction * dt;
      
      // Random enemy shooting
      if (Math.random() < 0.001 * gameState.wave) {
         projectilesRef.current.push({
          id: Math.random().toString(),
          x: enemy.x + ENEMY_WIDTH/2,
          y: enemy.y + ENEMY_HEIGHT,
          width: PROJECTILE_WIDTH,
          height: PROJECTILE_HEIGHT,
          dy: 200,
          damage: enemy.pokemon.stats.attack,
          type: enemy.pokemon.type,
          owner: 'enemy'
        });
        AudioService.playEnemyShoot();
      }

      if (enemy.x <= 0 || enemy.x + enemy.width >= GAME_WIDTH) {
        hitWall = true;
      }
    });

    if (hitWall) {
      enemiesRef.current.forEach(enemy => {
        enemy.direction *= -1;
        enemy.y += ENEMY_DROP_DISTANCE;
        // Clamp x to prevent sticking
        if(enemy.x <= 0) enemy.x = 1;
        if(enemy.x + enemy.width >= GAME_WIDTH) enemy.x = GAME_WIDTH - enemy.width - 1;
      });
    }

    // 4. Projectile Movement
    projectilesRef.current.forEach(p => {
      p.y += p.dy * dt;
    });

    // 5. Cleanup Projectiles
    projectilesRef.current = projectilesRef.current.filter(p => p.y > -20 && p.y < GAME_HEIGHT + 20);

    // 6. Cleanup Explosions
    explosionsRef.current = explosionsRef.current.filter(e => time - e.startTime < 500); // 500ms duration

    // 7. Collision Detection
    // Player vs Enemy Bullets
    const playerRect = { x: playerXRef.current - PLAYER_WIDTH/2, y: GAME_HEIGHT - 50, width: PLAYER_WIDTH, height: PLAYER_WIDTH };
    
    // Check Enemy hitting player body (Game Over condition usually)
    enemiesRef.current.forEach(e => {
        if (rectIntersect({x: e.x, y: e.y, width: e.width, height: e.height}, playerRect)) {
             handlePlayerDeath();
        }
    });

    // Projectile Collisions
    const nextProjectiles: Projectile[] = [];
    const deadEnemies: string[] = [];

    projectilesRef.current.forEach(p => {
      let hit = false;
      
      const pRect = {x: p.x - p.width/2, y: p.y, width: p.width, height: p.height};

      // Check vs Barriers (Both player and enemy projectiles hit barriers)
      for (const barrier of barriersRef.current) {
         if (rectIntersect(pRect, barrier)) {
             hit = true;
             barrier.hp -= p.damage;
             AudioService.playHit(); // Using simple hit sound for barriers
             break; // Projectile destroyed
         }
      }
      
      if (!hit) {
        if (p.owner === 'player') {
          // Check vs Enemies
          for (const enemy of enemiesRef.current) {
            if (rectIntersect(pRect, enemy)) {
              hit = true;
              // Apply Damage
              const { damage, isEffective, isWeak } = calculateDamage(activePokemon, enemy.pokemon);
              enemy.pokemon.stats.hp -= damage;
              AudioService.playHit();

              // Visual feedback could go here
              if (enemy.pokemon.stats.hp <= 0) {
                deadEnemies.push(enemy.id);
                // Trigger explosion visual
                explosionsRef.current.push({
                   id: Math.random().toString(),
                   x: enemy.x + enemy.width / 2,
                   y: enemy.y + enemy.height / 2,
                   startTime: time
                });
                handleEnemyDefeat(enemy);
              }
              break; 
            }
          }
        } else {
          // Check vs Player
          if (rectIntersect(pRect, playerRect)) {
            hit = true;
             const { damage } = calculateDamage(enemiesRef.current.find(e => e.pokemon.type === p.type)?.pokemon || createPokemon('caterpie'), activePokemon);
             
             // Mutate state directly for speed, then force update
             const newTeam = [...team];
             newTeam[activeIndex].stats.hp -= damage;
             setTeam(newTeam);
             AudioService.playHit();

             if (newTeam[activeIndex].stats.hp <= 0) {
               handlePlayerDeath();
             }
          }
        }
      }

      if (!hit) nextProjectiles.push(p);
    });

    projectilesRef.current = nextProjectiles;
    enemiesRef.current = enemiesRef.current.filter(e => !deadEnemies.includes(e.id));
    // Remove broken barriers
    barriersRef.current = barriersRef.current.filter(b => b.hp > 0);

    // 8. Check Wave Clear
    if (enemiesRef.current.length === 0 && !showBench && gameState.isPlaying) {
      handleWaveComplete();
    }

    setGameState(prev => ({ ...prev, lastFrameTime: time }));
    setRenderTrigger(prev => prev + 1); // Force React Render
    animationFrameId.current = requestAnimationFrame(update);
  }, [gameState, activePokemon, team, activeIndex, showBench]); 

  const rectIntersect = (r1: {x: number, y: number, width: number, height: number}, r2: {x: number, y: number, width: number, height: number}) => {
    return !(r2.x > r1.x + r1.width || 
             r2.x + r2.width < r1.x || 
             r2.y > r1.y + r1.height ||
             r2.y + r2.height < r1.y);
  };

  const handleEnemyDefeat = (enemy: Enemy) => {
    // XP Gain
    const xpGain = enemy.pokemon.level * 10;
    const newTeam = [...team];
    const currentMon = newTeam[activeIndex];
    currentMon.xp += xpGain;
    
    AudioService.playExplosion();

    // Level Up
    if (currentMon.xp >= currentMon.xpToNextLevel) {
       currentMon.level++;
       currentMon.xp -= currentMon.xpToNextLevel;
       currentMon.xpToNextLevel = Math.floor(currentMon.xpToNextLevel * 1.2);
       // Stat bump
       currentMon.stats.maxHp += 10;
       currentMon.stats.hp += 10;
       currentMon.stats.attack += 2;
       currentMon.stats.speed += 1; 
       
       // Evolution
       const evolved = checkEvolution(currentMon);
       if (evolved.speciesId !== currentMon.speciesId) {
          newTeam[activeIndex] = evolved;
          setGameMessage(`Evolved into ${evolved.name}!`);
          AudioService.playEvolve();
          setTimeout(() => setGameMessage(null), 2000);
       }
    }
    
    setTeam(newTeam);
    setGameState(prev => ({ ...prev, score: prev.score + (enemy.pokemon.level * 100) }));

    // Capture Logic (20% chance)
    if (Math.random() < 0.2) {
       const captured = { ...enemy.pokemon, id: Math.random().toString() }; 
       captured.stats.hp = Math.floor(captured.stats.maxHp * 0.5);
       setBench(prev => [...prev, captured]);
       setGameMessage(`Captured ${captured.name}!`);
       AudioService.playCapture();
       setTimeout(() => setGameMessage(null), 2000);
    }
  };

  const handlePlayerDeath = () => {
    AudioService.playExplosion();
    // Check if other pokemon available
    const aliveMembers = team.filter(p => p.stats.hp > 0);
    if (aliveMembers.length === 0) {
      setGameState(prev => ({ ...prev, isGameOver: true, isPlaying: false }));
    } else {
      // Auto swap to first alive
      const nextIdx = team.findIndex(p => p.stats.hp > 0);
      setActiveIndex(nextIdx);
    }
  };

  const handleWaveComplete = () => {
    setGameState(prev => ({ ...prev, isPlaying: false }));
    setShowBench(true);
  };

  const handleStartGame = () => {
     AudioService.init(); 
     setTeam([createPokemon('charmander'), createPokemon('squirtle'), createPokemon('bulbasaur')]);
     setBench([]);
     setGameState({
       isPlaying: true,
       isPaused: false,
       isGameOver: false,
       wave: 1,
       score: 0,
       lastFrameTime: performance.now()
     });
     startWave(1);
  };

  // Renaming Logic
  const handleRenameRequest = (id: string) => {
    setRenamingId(id);
    if (gameState.isPlaying && !gameState.isGameOver) {
      setGameState(prev => ({ ...prev, isPaused: true }));
    }
  };

  const handleRenameConfirm = (newName: string) => {
    if (!renamingId) return;
    setTeam(prev => prev.map(p => p.id === renamingId ? { ...p, nickname: newName } : p));
    setBench(prev => prev.map(p => p.id === renamingId ? { ...p, nickname: newName } : p));
    setRenamingId(null);
    // Note: We leave the game paused so the user can orient themselves, or we could auto-resume.
    // Leaving it paused is safer UX.
  };

  useEffect(() => {
    if (gameState.isPlaying && !gameState.isGameOver) {
      animationFrameId.current = requestAnimationFrame(update);
    }
    return () => cancelAnimationFrame(animationFrameId.current);
  }, [gameState.isPlaying, gameState.isPaused, gameState.isGameOver, update]);

  // Determine renaming target
  const renamingPokemon = team.find(p => p.id === renamingId) || bench.find(p => p.id === renamingId);

  // --- Render ---
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 p-4 select-none relative">
      
      {/* Title Screen */}
      {!gameState.isPlaying && !gameState.isGameOver && gameState.wave === 1 && !showBench && (
        <div className="text-center">
          <h1 className="text-6xl text-yellow-400 mb-8 tracking-tighter drop-shadow-lg">POKE<span className="text-white">INVADERS</span></h1>
          <button 
            onClick={handleStartGame}
            className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-bold text-xl rounded shadow-lg animate-bounce"
          >
            START GAME
          </button>
          <div className="mt-8 text-gray-400 text-xs">
            <p>ARROWS to Move • SPACE to Shoot • 1-3 to Swap Pokemon</p>
          </div>
        </div>
      )}

      {/* Game Over Screen */}
      {gameState.isGameOver && (
        <div className="text-center z-50">
           <h1 className="text-6xl text-red-500 mb-4">GAME OVER</h1>
           <p className="text-xl text-white mb-8">FINAL SCORE: {gameState.score}</p>
           <button 
            onClick={handleStartGame}
            className="px-6 py-3 bg-white text-black hover:bg-gray-200 font-bold rounded"
          >
            TRY AGAIN
          </button>
        </div>
      )}

      {/* Pause Menu Overlay */}
      {gameState.isPaused && !gameState.isGameOver && !renamingId && (
         <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-[100]">
            <h2 className="text-4xl text-white mb-6 tracking-widest">PAUSED</h2>
            <div className="flex gap-4">
               <button 
                 onClick={togglePause}
                 className="px-6 py-3 bg-green-500 hover:bg-green-400 text-black font-bold rounded border-b-4 border-green-700 active:border-b-0 active:translate-y-1 transition-all"
               >
                 CONTINUE
               </button>
               <button 
                 onClick={() => setGameState(prev => ({ ...prev, isPaused: false, isGameOver: true }))}
                 className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded border-b-4 border-red-800 active:border-b-0 active:translate-y-1 transition-all"
               >
                 QUIT
               </button>
            </div>
         </div>
      )}

      {/* Rename Modal */}
      {renamingId && renamingPokemon && (
        <RenameModal 
          currentName={renamingPokemon.nickname} 
          onConfirm={handleRenameConfirm} 
          onCancel={() => setRenamingId(null)} 
        />
      )}

      {/* Gameplay */}
      {(gameState.isPlaying || showBench) && !gameState.isGameOver && (
        <>
          <div className="relative">
            <GameCanvas 
              width={GAME_WIDTH} 
              height={GAME_HEIGHT} 
              player={activePokemon} 
              playerX={playerXRef.current}
              enemies={enemiesRef.current}
              projectiles={projectilesRef.current}
              barriers={barriersRef.current}
              explosions={explosionsRef.current}
            />
            {gameMessage && (
               <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-yellow-300 text-2xl font-bold drop-shadow-md animate-bounce z-50 whitespace-nowrap pointer-events-none">
                  {gameMessage}
               </div>
            )}
          </div>
          
          <HUD 
             activePokemon={activePokemon} 
             team={team} 
             gameState={gameState}
             onSwap={(idx) => {
               if(team[idx].stats.hp > 0) setActiveIndex(idx);
             }}
             onPause={togglePause}
             onRequestRename={handleRenameRequest}
          />
        </>
      )}

      {/* Bench Modal (Inter-wave) */}
      {showBench && (
        <BenchModal 
          team={team} 
          bench={bench}
          nextWaveTypes={getWaveEnemies(gameState.wave + 1, GAME_WIDTH).map(e => e.pokemon.type)} 
          onContinue={() => startWave(gameState.wave + 1)}
          onSwapMember={(teamIdx, benchIdx) => {
            const newTeam = [...team];
            const newBench = [...bench];
            const tMon = newTeam[teamIdx];
            const bMon = newBench[benchIdx];
            newTeam[teamIdx] = bMon;
            newBench[benchIdx] = tMon;
            setTeam(newTeam);
            setBench(newBench);
          }}
          onRequestRename={handleRenameRequest}
          onHealAll={() => {}}
        />
      )}

    </div>
  );
};

export default App;