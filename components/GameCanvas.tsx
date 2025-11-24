
import React from 'react';
import { Enemy, Pokemon, Projectile, Barrier, Explosion, CaptureAnim, Particle, MysteryShip, PowerUp, PowerUpType, Acrobat } from '../types';
import { PixelSprite, ProjectileVisual, ExplosionVisual, PokeballSprite, ParticleVisual, UFOVisual } from './Visuals';

interface GameCanvasProps {
  width: number;
  height: number;
  player: Pokemon;
  playerX: number;
  enemies: Enemy[];
  projectiles: Projectile[];
  barriers: Barrier[];
  explosions?: Explosion[];
  captureAnims?: CaptureAnim[];
  particles?: Particle[];
  mysteryShip?: MysteryShip | null;
  powerups?: PowerUp[];
  acrobats?: Acrobat[];
  globalAnimFrame: 0 | 1;
  currentTime: number;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ 
    width, height, player, playerX, enemies, projectiles, barriers, 
    explosions = [], captureAnims = [], particles = [], mysteryShip, powerups = [], acrobats = [], globalAnimFrame, currentTime
}) => {
  
  const activeBuffs = player.activeBuffs || {};
  const now = Date.now();
  
  // Calculate buff durations for on-character display
  const rapidRemaining = activeBuffs.rapidFireExpires ? Math.max(0, activeBuffs.rapidFireExpires - now) : 0;
  const spreadRemaining = activeBuffs.spreadExpires ? Math.max(0, activeBuffs.spreadExpires - now) : 0;
  const shieldRemaining = activeBuffs.shieldExpires ? Math.max(0, activeBuffs.shieldExpires - now) : 0;
  
  const maxBuffDuration = 15000; // 15s reference

  // Shield Visual Properties
  const shieldThickness = Math.max(1, (shieldRemaining / maxBuffDuration) * 4); // Thinner as it fades

  return (
    <div 
      className="relative bg-slate-900 border-4 border-slate-700 rounded-lg overflow-hidden shadow-2xl"
      style={{ width, height }}
    >
      {/* Dynamic Starfield Background */}
      <div className="absolute inset-0 z-0 bg-[#0a0a0f]">
          <div className="absolute inset-0 opacity-40 animate-pulse" style={{ 
            backgroundImage: 'radial-gradient(white 1px, transparent 1px)', 
            backgroundSize: '50px 50px',
            animationDuration: '3s'
          }}></div>
          <div className="absolute inset-0 opacity-20" style={{ 
            backgroundImage: 'radial-gradient(skyblue 1px, transparent 1px)', 
            backgroundSize: '110px 110px' 
          }}></div>
          {/* Nebula effect */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-purple-900/20 to-transparent"></div>
      </div>

      {/* Barriers */}
      {barriers.map(barrier => (
        <div key={barrier.id}>
            {barrier.cells.map((cell, idx) => (
                cell.active && (
                    <div
                        key={`${barrier.id}-cell-${idx}`}
                        className="absolute z-10 bg-green-500 shadow-sm shadow-green-900"
                        style={{
                            left: cell.x,
                            top: cell.y,
                            width: cell.width,
                            height: cell.height,
                            borderRadius: '2px', // Slight rounding
                            opacity: 0.9
                        }}
                    ></div>
                )
            ))}
        </div>
      ))}

      {/* Mystery Ship (UFO) */}
      {mysteryShip && mysteryShip.active && (
          <div
             className="absolute z-20"
             style={{
                 left: mysteryShip.x,
                 top: mysteryShip.y,
                 width: mysteryShip.width,
                 height: mysteryShip.height
             }}
          >
              <UFOVisual />
          </div>
      )}

      {/* Acrobat Jets */}
      {acrobats.map(jet => (
          <div
             key={jet.id}
             className="absolute z-20"
             style={{
                 left: jet.x,
                 top: jet.y,
                 width: jet.width,
                 height: jet.height,
                 transform: `scaleX(${jet.direction * -1})` // Face direction
             }}
          >
              <PixelSprite speciesId="jet" />
              <div className="absolute top-1/2 right-full w-4 h-1 bg-orange-500 blur-sm opacity-80"></div> {/* Jet Trail */}
          </div>
      ))}

      {/* Powerups */}
      {powerups.map(pu => (
          <div
            key={pu.id}
            className="absolute z-20 flex flex-col items-center"
            style={{
                left: pu.x,
                top: pu.y,
                width: pu.width,
                height: pu.height
            }}
          >
              {/* Parachute */}
              <div className="w-8 h-6 bg-white rounded-t-full opacity-80 mb-1" style={{ clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)' }}></div>
              <div className="w-6 h-6 relative animate-bounce">
                 <PixelSprite speciesId={`powerup_${pu.type}`} />
              </div>
          </div>
      ))}

      {/* Player */}
      <div
        className={`absolute bottom-4 z-10 transition-transform duration-75 ${player.stats.hp <= 0 ? 'scale-0 rotate-180 opacity-0 transition-all duration-1000 ease-out' : ''}`}
        style={{
          left: playerX,
          width: 48,
          height: 48,
          transform: 'translateX(-50%)', 
          filter: shieldRemaining > 0 
            ? 'drop-shadow(0 0 8px rgba(56, 189, 248, 0.8))' // Blue glow for shield
            : spreadRemaining > 0 
                ? 'drop-shadow(0 0 8px rgba(168, 85, 247, 0.8))' // Purple for Shotgun
                : rapidRemaining > 0 
                    ? 'drop-shadow(0 0 8px rgba(253, 224, 71, 0.8))' // Yellow for Rapid
                    : 'drop-shadow(0 0 10px rgba(255,255,255,0.3))'
        }}
      >
        {/* Shield Visual */}
        {shieldRemaining > 0 && (
            <div 
                className="absolute -inset-2 rounded-full border-blue-400 animate-pulse opacity-80"
                style={{ borderWidth: `${shieldThickness}px` }}
            ></div>
        )}

        {/* On-Character Cooldown Bars */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 flex flex-col gap-0.5">
             {rapidRemaining > 0 && (
                 <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                     <div className="h-full bg-yellow-400" style={{ width: `${(rapidRemaining / maxBuffDuration) * 100}%` }}></div>
                 </div>
             )}
             {spreadRemaining > 0 && (
                 <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                     <div className="h-full bg-purple-500" style={{ width: `${(spreadRemaining / maxBuffDuration) * 100}%` }}></div>
                 </div>
             )}
             {shieldRemaining > 0 && (
                 <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                     <div className="h-full bg-blue-400" style={{ width: `${(shieldRemaining / maxBuffDuration) * 100}%` }}></div>
                 </div>
             )}
        </div>

        <PixelSprite speciesId={player.speciesId} pose="idle" />
        
        {/* Engine Glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-2 bg-blue-500 blur-md opacity-60"></div>
      </div>

      {/* Enemies */}
      {enemies.map((enemy) => {
        let pose: 'idle' | 'move_1' | 'move_2' | 'attack' = 'idle';
        if (enemy.attackFrame > 0) pose = 'attack';
        else pose = globalAnimFrame === 0 ? 'move_1' : 'move_2';

        return (
          <div
            key={enemy.id}
            className="absolute z-10"
            style={{
              left: enemy.x,
              top: enemy.y,
              width: enemy.width,
              height: enemy.height,
              transition: 'top 0.5s ease-in-out'
            }}
          >
            <div className="absolute -top-2 left-0 w-full h-1 bg-gray-900 rounded-full overflow-hidden border border-gray-700">
              <div 
                className={`h-full ${enemy.pokemon.stats.hp < enemy.pokemon.stats.maxHp * 0.3 ? 'bg-red-500' : 'bg-green-500'}`} 
                style={{ width: `${(enemy.pokemon.stats.hp / enemy.pokemon.stats.maxHp) * 100}%` }}
              ></div>
            </div>
            
            <div className={`w-full h-full ${enemy.pokemon.type === 'Ghost' ? 'opacity-80' : ''}`}>
              <PixelSprite speciesId={enemy.pokemon.speciesId} pose={pose} />
            </div>
          </div>
        )
      })}

      {/* Explosions */}
      {explosions.map(expl => {
          const frameIndex = Math.floor((currentTime - expl.startTime) / 100); // 100ms per frame
          if (frameIndex > 4) return null;
          return (
            <div
            key={expl.id}
            className="absolute z-30 pointer-events-none"
            style={{
                left: expl.x - 24, // Centered offset
                top: expl.y - 24,
                width: 48,
                height: 48,
            }}
            >
            <ExplosionVisual frameIndex={frameIndex} />
            </div>
          )
      })}

      {/* Particles (Trails) */}
      {particles.map(p => (
         <div
           key={p.id}
           className="absolute z-10 pointer-events-none"
           style={{
               left: p.x,
               top: p.y,
               width: 6,
               height: 6
           }}
         >
             <ParticleVisual type={p.type} life={p.life} />
         </div>
      ))}

      {/* Capture Animations */}
      {captureAnims.map(anim => (
          <div 
            key={anim.id}
            className="absolute z-50 pointer-events-none"
            style={{
                left: anim.currentX,
                top: anim.currentY,
                transform: `scale(${1 - (anim.progress * 0.5)})` 
            }}
          >
              <PokeballSprite />
          </div>
      ))}

      {/* Projectiles */}
      {projectiles.map((proj) => (
        <div
          key={proj.id}
          className="absolute z-20 flex items-center justify-center"
          style={{
            left: proj.x,
            top: proj.y,
            width: proj.width * 2, 
            height: proj.height * 2,
            transform: 'translate(-25%, -25%)'
          }}
        >
          <ProjectileVisual type={proj.type} isPlayer={proj.owner === 'player'} />
        </div>
      ))}
    </div>
  );
};

export default GameCanvas;
