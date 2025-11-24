import React from 'react';
import { Enemy, Pokemon, Projectile, Barrier, Explosion } from '../types';
import { PixelSprite, ProjectileVisual, ExplosionVisual } from './Visuals';

interface GameCanvasProps {
  width: number;
  height: number;
  player: Pokemon;
  playerX: number;
  enemies: Enemy[];
  projectiles: Projectile[];
  barriers: Barrier[];
  explosions?: Explosion[];
}

const GameCanvas: React.FC<GameCanvasProps> = ({ width, height, player, playerX, enemies, projectiles, barriers, explosions = [] }) => {
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
        <div
          key={barrier.id}
          className="absolute z-10 transition-opacity"
          style={{
            left: barrier.x,
            top: barrier.y,
            width: barrier.width,
            height: barrier.height,
            opacity: barrier.hp / barrier.maxHp
          }}
        >
          {/* Simple damage shake effect */}
          <div className={barrier.hp < barrier.maxHp * 0.5 ? 'animate-wobble' : ''}>
             <PixelSprite speciesId="barrier" />
          </div>
        </div>
      ))}

      {/* Player */}
      <div
        className="absolute bottom-4 z-10 transition-transform duration-75"
        style={{
          left: playerX,
          width: 48,
          height: 48,
          transform: 'translateX(-50%)', 
          filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.3))'
        }}
      >
        <PixelSprite speciesId={player.speciesId} />
        {/* Engine Glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-2 bg-blue-500 blur-md opacity-60"></div>
      </div>

      {/* Enemies */}
      {enemies.map((enemy) => (
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
          {/* Health Bar */}
          <div className="absolute -top-2 left-0 w-full h-1 bg-gray-900 rounded-full overflow-hidden border border-gray-700">
            <div 
              className={`h-full ${enemy.pokemon.stats.hp < enemy.pokemon.stats.maxHp * 0.3 ? 'bg-red-500' : 'bg-green-500'}`} 
              style={{ width: `${(enemy.pokemon.stats.hp / enemy.pokemon.stats.maxHp) * 100}%` }}
            ></div>
          </div>
          
          <div className={`w-full h-full ${enemy.pokemon.type === 'Ghost' ? 'opacity-80' : ''}`}>
             <PixelSprite speciesId={enemy.pokemon.speciesId} />
          </div>
        </div>
      ))}

      {/* Explosions */}
      {explosions.map(expl => (
        <div
          key={expl.id}
          className="absolute z-30 pointer-events-none"
          style={{
            left: expl.x - 20, // Center approx 
            top: expl.y - 20,
            width: 40,
            height: 40,
          }}
        >
          <ExplosionVisual />
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
            width: proj.width * 2, // Visual scale up
            height: proj.height * 2,
            transform: 'translate(-25%, -25%)' // Center visual
          }}
        >
          <ProjectileVisual type={proj.type} isPlayer={proj.owner === 'player'} />
        </div>
      ))}
    </div>
  );
};

export default GameCanvas;