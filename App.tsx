
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  GAME_WIDTH, GAME_HEIGHT, PLAYER_WIDTH, PLAYER_HEIGHT, PLAYER_SPEED, 
  BASE_ENEMY_SPEED, ENEMY_DROP_DISTANCE, PROJECTILE_HEIGHT, PROJECTILE_WIDTH, ENEMY_HEIGHT, ENEMY_WIDTH, POKEDEX, TYPE_CHART, DIFFICULTY_CONFIG
} from './constants';
import { Pokemon, Enemy, Projectile, GameState, PokemonType, Barrier, Explosion, CaptureAnim, ShootPattern, Particle, MysteryShip, PowerUp, PowerUpType, Acrobat, Rect, Difficulty } from './types';
import { createPokemon, getWaveEnemies, calculateDamage, checkEvolution, generateBarriers } from './services/gameLogic';
import { AudioService } from './services/audioService';
import GameCanvas from './components/GameCanvas';
import HUD from './components/UI/HUD';
import BenchModal from './components/UI/BenchModal';
import RenameModal from './components/UI/RenameModal';
import { v4 as uuidv4 } from 'uuid';

const App: React.FC = () => {
  // --- Game State ---
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    isPaused: false,
    isGameOver: false,
    wave: 1,
    score: 0,
    highScore: 0,
    lastFrameTime: 0,
    globalAnimFrame: 0,
    difficulty: Difficulty.MIDDLE, // Default
    queuedPowerups: []
  });

  const [team, setTeam] = useState<Pokemon[]>([]);
  const [bench, setBench] = useState<Pokemon[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  
  // UI State
  const [showBench, setShowBench] = useState(false);
  const [gameMessage, setGameMessage] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [cooldownProgress, setCooldownProgress] = useState(0); // 0-100 for HUD
  
  const activePokemon = team[activeIndex];

  // --- Mutable Game Entities (Refs for performance in loop) ---
  const playerXRef = useRef(GAME_WIDTH / 2);
  const playerYRef = useRef(GAME_HEIGHT - 60); // Vertical position tracking
  const enemiesRef = useRef<Enemy[]>([]);
  const projectilesRef = useRef<Projectile[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const barriersRef = useRef<Barrier[]>([]);
  const explosionsRef = useRef<Explosion[]>([]);
  const captureAnimsRef = useRef<CaptureAnim[]>([]);
  const mysteryShipRef = useRef<MysteryShip | null>(null);
  const acrobatsRef = useRef<Acrobat[]>([]);
  const powerupsRef = useRef<PowerUp[]>([]);
  const keysPressed = useRef<Record<string, boolean>>({});
  const lastShotTime = useRef(0);
  const animationFrameId = useRef<number>(0);
  const globalAnimTimer = useRef(0);
  const mysteryShipTimer = useRef(0);
  const lastUfoSoundTime = useRef(0);

  // --- React State for Rendering (Syncs with Refs occasionally or per frame) ---
  const [renderTrigger, setRenderTrigger] = useState(0); 

  // --- Load High Score ---
  useEffect(() => {
    const saved = localStorage.getItem('pokeinvaders_highscore');
    if (saved) {
        setGameState(prev => ({ ...prev, highScore: parseInt(saved) }));
    }
  }, []);

  // --- Save High Score ---
  useEffect(() => {
    if (gameState.score > gameState.highScore) {
        setGameState(prev => ({ ...prev, highScore: gameState.score }));
        localStorage.setItem('pokeinvaders_highscore', gameState.score.toString());
    }
  }, [gameState.score]);

  // --- Controls ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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

  const startWave = useCallback((waveNum: number, currentDifficulty: Difficulty) => {
    const diffConfig = DIFFICULTY_CONFIG[currentDifficulty];
    enemiesRef.current = getWaveEnemies(waveNum, GAME_WIDTH, diffConfig.hpMult);
    projectilesRef.current = [];
    particlesRef.current = [];
    
    // Spawn Queued Powerups from Trading
    powerupsRef.current = [];
    if (gameState.queuedPowerups.length > 0) {
        const count = gameState.queuedPowerups.length;
        // Space them out at the bottom
        const spacing = GAME_WIDTH / (count + 1);
        gameState.queuedPowerups.forEach((type, idx) => {
             powerupsRef.current.push({
                 id: uuidv4(),
                 x: spacing * (idx + 1),
                 y: GAME_HEIGHT - 40, // Bottom of screen, accessible by player
                 width: 24,
                 height: 24,
                 type
             });
        });
        // Clear queue
        setGameState(prev => ({ ...prev, queuedPowerups: [] }));
    }

    mysteryShipRef.current = null;
    acrobatsRef.current = [];
    barriersRef.current = generateBarriers(GAME_WIDTH, waveNum);
    explosionsRef.current = [];
    captureAnimsRef.current = [];
    
    playerXRef.current = GAME_WIDTH / 2;
    playerYRef.current = GAME_HEIGHT - 60; // Reset player position
    setGameState(prev => ({ ...prev, wave: waveNum, isPlaying: true }));
    setShowBench(false);
  }, [gameState.queuedPowerups]);

  // --- Game Loop ---
  const update = useCallback((time: number) => {
    if (!gameState.isPlaying || gameState.isPaused || gameState.isGameOver) {
       if (gameState.isPlaying && !gameState.isGameOver) {
          // Paused
       } else {
          animationFrameId.current = requestAnimationFrame(update);
          return;
       }
    }
    
    if (gameState.isPaused) {
       animationFrameId.current = requestAnimationFrame(update);
       return;
    }

    const diffConfig = DIFFICULTY_CONFIG[gameState.difficulty];
    const deltaTime = (time - gameState.lastFrameTime) / 1000;
    const dt = Math.min(deltaTime, 0.1); 
    
    // Global Animation Toggle
    globalAnimTimer.current += dt;
    if (globalAnimTimer.current > 0.5) {
       setGameState(prev => ({ ...prev, globalAnimFrame: prev.globalAnimFrame === 0 ? 1 : 0 }));
       globalAnimTimer.current = 0;
    }

    // Mystery Ship Logic
    mysteryShipTimer.current += dt;
    if (!mysteryShipRef.current && Math.random() < 0.001) {
        const startLeft = Math.random() > 0.5;
        mysteryShipRef.current = {
            id: uuidv4(),
            x: startLeft ? -50 : GAME_WIDTH + 50,
            y: 40,
            width: 48,
            height: 32,
            direction: startLeft ? 1 : -1,
            active: true
        };
        AudioService.playUFO();
        lastUfoSoundTime.current = time;
    }
    
    if (mysteryShipRef.current) {
        mysteryShipRef.current.x += 150 * mysteryShipRef.current.direction * dt; 

        // Sound Loop
        if (time - lastUfoSoundTime.current > 350) {
            AudioService.playUFO();
            lastUfoSoundTime.current = time;
        }

        // Remove if off screen
        if (mysteryShipRef.current.direction === 1 && mysteryShipRef.current.x > GAME_WIDTH + 50) {
            mysteryShipRef.current = null;
        } else if (mysteryShipRef.current.direction === -1 && mysteryShipRef.current.x < -50) {
            mysteryShipRef.current = null;
        }
    }

    // Acrobat Jet Logic
    if (Math.random() < 0.0015) {
        const startLeft = Math.random() > 0.5;
        acrobatsRef.current.push({
            id: uuidv4(),
            x: startLeft ? -50 : GAME_WIDTH + 50,
            startX: startLeft ? -50 : GAME_WIDTH + 50,
            y: 100,
            width: 48,
            height: 32,
            direction: startLeft ? 1 : -1,
            timeAlive: 0
        });
        AudioService.playJetEngine();
    }

    acrobatsRef.current.forEach(jet => {
        jet.timeAlive += dt;
        jet.x += (250 * diffConfig.speedMult) * jet.direction * dt;
        const sineY = Math.sin(jet.timeAlive * 3) * 80;
        const loopY = Math.sin(jet.timeAlive * 2) * 40;
        jet.y = 150 + sineY + loopY;
    });
    acrobatsRef.current = acrobatsRef.current.filter(j => j.x > -100 && j.x < GAME_WIDTH + 100);

    // Check Buff Expiry
    const now = Date.now();
    const hasRapidBuff = activePokemon.activeBuffs.rapidFireExpires && activePokemon.activeBuffs.rapidFireExpires > now;
    const hasSpreadBuff = activePokemon.activeBuffs.spreadExpires && activePokemon.activeBuffs.spreadExpires > now;
    const hasShield = activePokemon.activeBuffs.shieldExpires && activePokemon.activeBuffs.shieldExpires > now;

    // Player Movement (With Vertical Support)
    const moveSpeed = PLAYER_SPEED * (activePokemon.stats.moveSpeed || 1);
    
    if (keysPressed.current['ArrowLeft']) {
      playerXRef.current = Math.max(PLAYER_WIDTH / 2, playerXRef.current - moveSpeed * dt);
    }
    if (keysPressed.current['ArrowRight']) {
      playerXRef.current = Math.min(GAME_WIDTH - PLAYER_WIDTH / 2, playerXRef.current + moveSpeed * dt);
    }
    
    // Vertical Movement (Restricted to bottom safe zone)
    const SAFE_ZONE_TOP = GAME_HEIGHT - 200; // Just below the barriers (barriers at -220)
    if (keysPressed.current['ArrowUp']) {
      playerYRef.current = Math.max(SAFE_ZONE_TOP, playerYRef.current - moveSpeed * dt);
    }
    if (keysPressed.current['ArrowDown']) {
      playerYRef.current = Math.min(GAME_HEIGHT - PLAYER_HEIGHT / 2 - 10, playerYRef.current + moveSpeed * dt);
    }

    // Shooting
    let fireRate = activePokemon.stats.fireRate || 500;
    if (hasRapidBuff) fireRate *= 0.5; 

    const timeSinceShot = time - lastShotTime.current;
    
    if (timeSinceShot < fireRate) {
        setCooldownProgress((timeSinceShot / fireRate) * 100);
    } else {
        setCooldownProgress(100);
    }

    if (keysPressed.current[' '] && timeSinceShot > fireRate && activePokemon.stats.hp > 0) {
      let projSpeed = activePokemon.stats.projectileSpeed || 400;
      if (hasRapidBuff) projSpeed *= 1.5;

      let pattern = activePokemon.shootPattern || ShootPattern.NORMAL;
      if (hasSpreadBuff) pattern = ShootPattern.SHOTGUN;

      const spawnProj = (vx: number, vy: number, bounces: number) => {
          projectilesRef.current.push({
            id: Math.random().toString(),
            x: playerXRef.current, 
            y: playerYRef.current - 20, // Shoot from current Y
            width: PROJECTILE_WIDTH,
            height: PROJECTILE_HEIGHT,
            vx, vy, 
            damage: Math.ceil(activePokemon.stats.attack * (hasSpreadBuff ? 0.7 : 1)), 
            type: activePokemon.type,
            owner: 'player',
            bouncesLeft: bounces
          });
      };

      if (pattern === ShootPattern.SHOTGUN) {
          [-0.3, 0, 0.3].forEach(angle => {
              spawnProj(Math.sin(angle) * projSpeed, -Math.cos(angle) * projSpeed, 0);
          });
          if (hasSpreadBuff && activePokemon.shootPattern === ShootPattern.SHOTGUN) {
              [-0.5, 0.5].forEach(angle => {
                   spawnProj(Math.sin(angle) * projSpeed, -Math.cos(angle) * projSpeed, 0);
              });
          }
      } else {
          spawnProj(0, -projSpeed, pattern === ShootPattern.RICOCHET ? 1 : 0);
      }

      lastShotTime.current = time;
      AudioService.playShoot(activePokemon.type);
    }

    // Enemy Logic
    let hitWall = false;
    enemiesRef.current.forEach(enemy => {
      const verticalBoost = (enemy.y / GAME_HEIGHT) * 100; 
      const moveSpeed = (BASE_ENEMY_SPEED + (gameState.wave * 5) + verticalBoost) * diffConfig.speedMult;
      
      enemy.x += moveSpeed * enemy.direction * dt;
      if (enemy.attackFrame > 0) enemy.attackFrame--;

      if (Math.random() < 0.001 * gameState.wave * diffConfig.fireRateMult) {
         enemy.attackFrame = 10; 
         projectilesRef.current.push({
          id: Math.random().toString(),
          x: enemy.x + ENEMY_WIDTH/2,
          y: enemy.y + ENEMY_HEIGHT,
          width: PROJECTILE_WIDTH,
          height: PROJECTILE_HEIGHT,
          vx: 0,
          vy: 200 * diffConfig.speedMult,
          damage: enemy.pokemon.stats.attack,
          type: enemy.pokemon.type,
          owner: 'enemy',
          bouncesLeft: 0
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
        // Check height before dropping.
        const MAX_Y = GAME_HEIGHT - 260; 
        if (enemy.y < MAX_Y) {
            enemy.y += ENEMY_DROP_DISTANCE;
        }
        
        if(enemy.x <= 0) enemy.x = 1;
        if(enemy.x + enemy.width >= GAME_WIDTH) enemy.x = GAME_WIDTH - enemy.width - 1;
      });
    }

    // Powerup Movement
    powerupsRef.current.forEach(p => {
        // If spawned on ground (from bench trade), don't move. If falling (from UFO), fall.
        if (p.y < GAME_HEIGHT - 50) {
             p.y += 100 * dt; 
             p.x += Math.sin(time / 200) * 1; 
        }
    });
    powerupsRef.current.forEach(p => {
        if(p.y > GAME_HEIGHT - 40) p.y = GAME_HEIGHT - 40;
    });

    // Projectile Movement & Trail Generation
    projectilesRef.current.forEach(p => {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      
      if (Math.random() < 0.3) {
          particlesRef.current.push({
              id: Math.random().toString(),
              x: p.x,
              y: p.y,
              vx: (Math.random() - 0.5) * 20,
              vy: (Math.random() - 0.5) * 20,
              life: 1.0,
              type: p.type
          });
      }
    });
    projectilesRef.current = projectilesRef.current.filter(p => p.y > -20 && p.y < GAME_HEIGHT + 20 && p.x > -20 && p.x < GAME_WIDTH + 20);

    // Update Particles
    particlesRef.current.forEach(p => {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= dt * 2; 
    });
    particlesRef.current = particlesRef.current.filter(p => p.life > 0);

    // Cleanup Explosions
    explosionsRef.current = explosionsRef.current.filter(e => time - e.startTime < 500); 

    // Update Capture Animations
    const activeAnims: CaptureAnim[] = [];
    captureAnimsRef.current.forEach(anim => {
        const targetX = GAME_WIDTH - 100;
        const targetY = GAME_HEIGHT + 50; 
        anim.progress += dt * 1.5; 
        
        if (anim.progress < 1) {
            const linearX = anim.startX + (targetX - anim.startX) * anim.progress;
            const linearY = anim.startY + (targetY - anim.startY) * anim.progress;
            const height = 100 * Math.sin(anim.progress * Math.PI); 
            
            anim.currentX = linearX;
            anim.currentY = linearY - height;
            activeAnims.push(anim);
        }
    });
    captureAnimsRef.current = activeAnims;

    // Collision Detection
    const playerRect = { x: playerXRef.current - PLAYER_WIDTH/2, y: playerYRef.current - PLAYER_WIDTH/2, width: PLAYER_WIDTH, height: PLAYER_WIDTH };
    
    // 1. Player vs Powerups
    const claimedPowerups: string[] = [];
    powerupsRef.current.forEach(p => {
        const pRect = { x: p.x, y: p.y, width: p.width, height: p.height };
        if (rectIntersect(playerRect, pRect)) {
            claimedPowerups.push(p.id);
            AudioService.playPowerupCollect();
            setGameMessage(`GOT ${p.type.toUpperCase()}!`);
            setTimeout(() => setGameMessage(null), 1500);

            // Apply Buff
            const newTeam = [...team];
            const current = newTeam[activeIndex];
            if (p.type === PowerUpType.HEALTH) {
                current.stats.hp = Math.min(current.stats.maxHp, current.stats.hp + (current.stats.maxHp * 0.5));
            } else if (p.type === PowerUpType.RAPID) {
                const currentExpiry = current.activeBuffs.rapidFireExpires || Date.now();
                const base = Math.max(Date.now(), currentExpiry);
                current.activeBuffs = { ...current.activeBuffs, rapidFireExpires: base + 15000 };
            } else if (p.type === PowerUpType.SPREAD) {
                const currentExpiry = current.activeBuffs.spreadExpires || Date.now();
                const base = Math.max(Date.now(), currentExpiry);
                current.activeBuffs = { ...current.activeBuffs, spreadExpires: base + 15000 };
            } else if (p.type === PowerUpType.SHIELD) {
                const currentExpiry = current.activeBuffs.shieldExpires || Date.now();
                const base = Math.max(Date.now(), currentExpiry);
                current.activeBuffs = { 
                  ...current.activeBuffs, 
                  shieldExpires: base + 15000,
                  shieldMaxDuration: 15000 
                };
            }
            setTeam(newTeam);
        }
    });
    powerupsRef.current = powerupsRef.current.filter(p => !claimedPowerups.includes(p.id));

    // 2. Enemy/Jet vs Player
    const checkPlayerCollision = (rect: Rect) => {
         if (activePokemon.stats.hp > 0 && rectIntersect(rect, playerRect)) {
             if (hasShield) {
                 AudioService.playShieldHit();
                 const newTeam = [...team];
                 const buff = newTeam[activeIndex].activeBuffs;
                 if (buff.shieldExpires) {
                    buff.shieldExpires -= 2000;
                    if (buff.shieldExpires < Date.now()) buff.shieldExpires = 0;
                 }
                 setTeam(newTeam);
             } else {
                 handlePlayerDeath();
             }
             return true;
         }
         return false;
    };

    enemiesRef.current.forEach(e => {
        const eRect = {x: e.x, y: e.y, width: e.width, height: e.height};
        if (checkPlayerCollision(eRect)) return;

        barriersRef.current.forEach(barrier => {
            barrier.cells.forEach(cell => {
                if (cell.active && rectIntersect(eRect, cell)) {
                    cell.active = false;
                    AudioService.playHit();
                }
            });
        });
    });

    // 3. Projectiles
    const nextProjectiles: Projectile[] = [];
    const deadEnemies: string[] = [];
    const deadAcrobats: string[] = [];

    projectilesRef.current.forEach(p => {
      let hit = false;
      const pRect = {x: p.x - p.width/2, y: p.y, width: p.width, height: p.height };

      // Check Barriers
      for (const barrier of barriersRef.current) {
         for (const cell of barrier.cells) {
             if (cell.active && rectIntersect(pRect, cell)) {
                 hit = true;
                 cell.active = false; 
                 AudioService.playHit(); 
                 break; 
             }
         }
         if (hit) break;
      }
      
      if (!hit) {
        if (p.owner === 'player' || p.owner === 'neutral') {
            
            // A. Check UFO
            if (mysteryShipRef.current && rectIntersect(pRect, mysteryShipRef.current)) {
                hit = true;
                const dropX = mysteryShipRef.current.x;
                const dropY = mysteryShipRef.current.y;
                mysteryShipRef.current = null;
                AudioService.playExplosion();
                AudioService.playPowerupSpawn();
                
                const types = [PowerUpType.HEALTH, PowerUpType.RAPID, PowerUpType.SPREAD, PowerUpType.SHIELD];
                const type = types[Math.floor(Math.random() * types.length)];
                
                powerupsRef.current.push({
                    id: uuidv4(),
                    x: dropX,
                    y: dropY,
                    width: 24,
                    height: 24,
                    type
                });
            }

            // B. Check Acrobats
            if (!hit) {
                acrobatsRef.current.forEach(jet => {
                    if (rectIntersect(pRect, jet)) {
                        hit = true;
                        deadAcrobats.push(jet.id);
                        AudioService.playExplosion();
                        AudioService.playShrapnel();
                        explosionsRef.current.push({
                            id: uuidv4(),
                            x: jet.x, y: jet.y, startTime: time
                        });
                        for(let i=0; i<8; i++) {
                            const angle = (Math.PI * 2 * i) / 8;
                            // Scale shrapnel speed by difficulty
                            const shrapnelSpeed = 200 * diffConfig.speedMult;
                            nextProjectiles.push({
                                id: uuidv4(),
                                x: jet.x, y: jet.y,
                                width: 12, height: 12,
                                vx: Math.cos(angle) * shrapnelSpeed,
                                vy: Math.sin(angle) * shrapnelSpeed,
                                damage: 20,
                                type: PokemonType.ROCK,
                                owner: 'neutral', 
                                bouncesLeft: 0
                            });
                        }
                    }
                });
            }

            // C. Check Standard Enemies
            if (!hit) {
              for (const enemy of enemiesRef.current) {
                if (rectIntersect(pRect, enemy)) {
                  hit = true;
                  
                  let damage = 0;
                  if (p.owner === 'player') {
                       const res = calculateDamage(activePokemon, enemy.pokemon);
                       damage = res.damage;
                  } else {
                       const chart = TYPE_CHART[p.type];
                       let mult = 1;
                       if (chart.strong.includes(enemy.pokemon.type)) mult = 2;
                       if (chart.weak.includes(enemy.pokemon.type)) mult = 0.5;
                       damage = Math.ceil(p.damage * mult);
                  }

                  enemy.pokemon.stats.hp -= damage;
                  AudioService.playHit();

                  if (enemy.pokemon.stats.hp <= 0) {
                    deadEnemies.push(enemy.id);
                    explosionsRef.current.push({
                      id: Math.random().toString(),
                      x: enemy.x + enemy.width / 2,
                      y: enemy.y + enemy.height / 2,
                      startTime: time
                    });
                    handleEnemyDefeat(enemy);
                  } else if (p.owner === 'player' && p.bouncesLeft > 0) {
                    let nearest = null;
                    let minDist = Infinity;
                    enemiesRef.current.forEach(other => {
                        if (other.id === enemy.id) return;
                        const dist = Math.sqrt(Math.pow(other.x - enemy.x, 2) + Math.pow(other.y - enemy.y, 2));
                        if (dist < 200 && dist < minDist) { 
                            minDist = dist;
                            nearest = other;
                        }
                    });

                    if (nearest) {
                        p.bouncesLeft--;
                        p.owner = 'player';
                        const dx = nearest.x - enemy.x;
                        const dy = nearest.y - enemy.y;
                        const mag = Math.sqrt(dx*dx + dy*dy);
                        const speed = activePokemon.stats.projectileSpeed;
                        p.vx = (dx / mag) * speed;
                        p.vy = (dy / mag) * speed;
                        p.x = enemy.x; 
                        p.y = enemy.y;
                        nextProjectiles.push(p); 
                        return; 
                    }
                  }
                  break; 
                }
              }
            }
        }

        // --- 2. Check vs Player (Targetable by Enemy OR Neutral) ---
        if (!hit && (p.owner === 'enemy' || p.owner === 'neutral')) {
          if (activePokemon.stats.hp > 0 && rectIntersect(pRect, playerRect)) {
            hit = true;
            
            if (hasShield) {
                 AudioService.playShieldHit();
                 const newTeam = [...team];
                 const buff = newTeam[activeIndex].activeBuffs;
                 if (buff.shieldExpires) {
                    buff.shieldExpires -= 2000;
                    if (buff.shieldExpires < Date.now()) buff.shieldExpires = 0;
                 }
                 setTeam(newTeam);
            } else {
                 let damage = 0;
                 if (p.owner === 'enemy') {
                    const attacker = enemiesRef.current.find(e => e.pokemon.type === p.type)?.pokemon || createPokemon('caterpie');
                    damage = calculateDamage(attacker, activePokemon).damage;
                 } else {
                    const chart = TYPE_CHART[p.type];
                    let mult = 1;
                    if (chart.strong.includes(activePokemon.type)) mult = 2;
                    if (chart.weak.includes(activePokemon.type)) mult = 0.5;
                    damage = Math.ceil(p.damage * mult);
                 }
                 
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
      }

      if (!hit) nextProjectiles.push(p);
    });

    projectilesRef.current = nextProjectiles;
    enemiesRef.current = enemiesRef.current.filter(e => !deadEnemies.includes(e.id));
    acrobatsRef.current = acrobatsRef.current.filter(j => !deadAcrobats.includes(j.id));
    
    // Wave Clear
    if (enemiesRef.current.length === 0 && !showBench && gameState.isPlaying) {
      handleWaveComplete();
    }

    setGameState(prev => ({ ...prev, lastFrameTime: time }));
    setRenderTrigger(prev => prev + 1); 
    animationFrameId.current = requestAnimationFrame(update);
  }, [gameState, activePokemon, team, bench, activeIndex, showBench]); 

  const rectIntersect = (r1: {x: number, y: number, width: number, height: number}, r2: {x: number, y: number, width: number, height: number}) => {
    return !(r2.x > r1.x + r1.width || 
             r2.x + r2.width < r1.x || 
             r2.y > r1.y + r1.height ||
             r2.y + r2.height < r1.y);
  };

  const handleEnemyDefeat = (enemy: Enemy) => {
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
       
       const evolved = checkEvolution(currentMon);
       if (evolved.speciesId !== currentMon.speciesId) {
          newTeam[activeIndex] = evolved;
          setGameMessage(`Evolved into ${evolved.name}!`);
          AudioService.playEvolve();
          setTimeout(() => setGameMessage(null), 2000);
       }
    }
    
    setTeam(newTeam);
    const diffConfig = DIFFICULTY_CONFIG[gameState.difficulty];
    setGameState(prev => ({ ...prev, score: prev.score + Math.floor((enemy.pokemon.level * 100) * diffConfig.scoreMult) }));

    if (Math.random() < 0.2) {
       const captured = { ...enemy.pokemon, id: uuidv4(), activeBuffs: {} }; 
       captured.stats.hp = Math.floor(captured.stats.maxHp * 0.5);
       
       setBench(prev => [...prev, captured]);
       setGameMessage(`Captured ${captured.name}!`);
       AudioService.playCapture();
       
       captureAnimsRef.current.push({
           id: uuidv4(),
           startX: enemy.x,
           startY: enemy.y,
           currentX: enemy.x,
           currentY: enemy.y,
           progress: 0,
           pokemon: captured
       });

       setTimeout(() => setGameMessage(null), 2000);
    }
  };

  const handlePlayerDeath = () => {
    AudioService.playDeath();
    
    const deadMon = team[activeIndex];
    if (!deadMon) return;

    const deadMonName = deadMon.nickname;
    setGameMessage(`${deadMonName} has fallen!`);
    
    setTimeout(() => {
        setGameMessage(null);

        const newTeam = [...team];
        const newBench = [...bench];
        
        newTeam.splice(activeIndex, 1);

        if (newBench.length > 0) {
            const replacement = newBench.shift();
            if (replacement) {
                newTeam.splice(activeIndex, 0, replacement);
                setBench(newBench);
                setTeam(newTeam);
                setGameMessage(`${replacement.nickname} joined the fight!`);
                setTimeout(() => setGameMessage(null), 1500);
                return; 
            }
        } else {
            setTeam(newTeam); 
        }

        if (newTeam.length === 0) {
          setGameState(prev => ({ ...prev, isGameOver: true, isPlaying: false }));
        } else {
          if (activeIndex >= newTeam.length) {
              setActiveIndex(newTeam.length - 1);
          }
        }
    }, 1500);
  };

  const handleWaveComplete = () => {
    setGameState(prev => ({ ...prev, isPlaying: false }));
    setShowBench(true);
  };

  const handleStartGame = () => {
     AudioService.init(); 
     const starters = [createPokemon('charmander'), createPokemon('squirtle'), createPokemon('bulbasaur')];
     starters.forEach(p => p.activeBuffs = {});
     setTeam(starters);
     setBench([]);
     setGameState(prev => ({
       isPlaying: true,
       isPaused: false,
       isGameOver: false,
       wave: 1,
       score: 0,
       highScore: prev.highScore,
       lastFrameTime: performance.now(),
       globalAnimFrame: 0,
       difficulty: prev.difficulty,
       queuedPowerups: []
     }));
     startWave(1, gameState.difficulty);
  };

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
  };

  // Trade Handling
  const handleTradeMember = (benchIdx: number) => {
      const mon = bench[benchIdx];
      
      // Determine Reward based on Type
      let reward = PowerUpType.HEALTH;
      const type = mon.type;
      
      if ([PokemonType.FIRE, PokemonType.ELECTRIC, PokemonType.DRAGON].includes(type)) {
          reward = PowerUpType.RAPID;
      } else if ([PokemonType.WATER, PokemonType.ROCK, PokemonType.PSYCHIC].includes(type)) {
          reward = PowerUpType.SHIELD;
      } else if ([PokemonType.GRASS, PokemonType.BUG, PokemonType.GHOST].includes(type)) {
          reward = PowerUpType.SPREAD;
      }

      // Remove from bench
      const newBench = [...bench];
      newBench.splice(benchIdx, 1);
      setBench(newBench);
      
      // Add to Queue
      setGameState(prev => ({
          ...prev,
          queuedPowerups: [...prev.queuedPowerups, reward]
      }));

      // Feedback
      setGameMessage(`Traded ${mon.nickname} for Supplies!`);
      setTimeout(() => setGameMessage(null), 2000);
  };

  useEffect(() => {
    if (gameState.isPlaying && !gameState.isGameOver) {
      animationFrameId.current = requestAnimationFrame(update);
    }
    return () => cancelAnimationFrame(animationFrameId.current);
  }, [gameState.isPlaying, gameState.isPaused, gameState.isGameOver, update]);

  const renamingPokemon = team.find(p => p.id === renamingId) || bench.find(p => p.id === renamingId);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 p-4 select-none relative">
      
      {/* Title Screen */}
      {!gameState.isPlaying && !gameState.isGameOver && gameState.wave === 1 && !showBench && (
        <div className="text-center">
          <h1 className="text-6xl text-yellow-400 mb-8 tracking-tighter drop-shadow-lg">POKE<span className="text-white">INVADERS</span></h1>
          
          <div className="mb-8">
            <p className="text-gray-400 mb-2 text-sm uppercase">Select Difficulty</p>
            <div className="flex flex-col gap-2">
                {(Object.values(Difficulty) as Difficulty[]).map(diff => (
                    <button
                        key={diff}
                        onClick={() => setGameState(prev => ({ ...prev, difficulty: diff }))}
                        className={`
                            px-6 py-2 border-2 rounded font-bold transition-all uppercase tracking-widest text-sm
                            ${gameState.difficulty === diff 
                                ? `${DIFFICULTY_CONFIG[diff].color} border-white bg-white/10 scale-105` 
                                : 'text-gray-500 border-transparent hover:text-white hover:bg-white/5'}
                        `}
                    >
                        {DIFFICULTY_CONFIG[diff].label}
                    </button>
                ))}
            </div>
          </div>

          <button 
            onClick={handleStartGame}
            className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-bold text-xl rounded shadow-lg animate-bounce"
          >
            START GAME
          </button>
          <div className="mt-8 text-gray-400 text-xs">
            <p>ARROWS to Move • SPACE to Shoot • 1-3 to Swap Pokemon</p>
            <p className="mt-2 text-yellow-600">HIGH SCORE: {gameState.highScore}</p>
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
      {(gameState.isPlaying || showBench) && !gameState.isGameOver && team.length > 0 && activePokemon && (
        <>
          <div className="relative">
            <GameCanvas 
              width={GAME_WIDTH} 
              height={GAME_HEIGHT} 
              player={activePokemon} 
              playerX={playerXRef.current}
              playerY={playerYRef.current}
              enemies={enemiesRef.current}
              projectiles={projectilesRef.current}
              barriers={barriersRef.current}
              explosions={explosionsRef.current}
              captureAnims={captureAnimsRef.current}
              particles={particlesRef.current}
              mysteryShip={mysteryShipRef.current}
              acrobats={acrobatsRef.current}
              powerups={powerupsRef.current}
              globalAnimFrame={gameState.globalAnimFrame}
              currentTime={gameState.lastFrameTime}
            />
            {gameMessage && (
               <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-yellow-300 text-2xl font-bold drop-shadow-md animate-bounce z-[200] whitespace-nowrap pointer-events-none">
                  {gameMessage}
               </div>
            )}
          </div>
          
          <HUD 
             activePokemon={activePokemon} 
             team={team} 
             gameState={gameState}
             onSwap={(idx) => {
               if(team[idx] && team[idx].stats.hp > 0) setActiveIndex(idx);
             }}
             onPause={togglePause}
             onRequestRename={handleRenameRequest}
             cooldownProgress={cooldownProgress}
          />
        </>
      )}

      {/* Bench Modal (Inter-wave) */}
      {showBench && (
        <BenchModal 
          team={team} 
          bench={bench}
          nextWaveTypes={getWaveEnemies(gameState.wave + 1, GAME_WIDTH).map(e => e.pokemon.type)} 
          onContinue={() => startWave(gameState.wave + 1, gameState.difficulty)}
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
          onTradeMember={handleTradeMember}
          onHealAll={() => {}}
        />
      )}

    </div>
  );
};

export default App;
