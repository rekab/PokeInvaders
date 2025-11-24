
import React from 'react';
import { Pokemon, GameState } from '../../types';
import { PixelSprite } from '../Visuals';

interface HUDProps {
  activePokemon: Pokemon;
  team: Pokemon[];
  gameState: GameState;
  onSwap: (index: number) => void;
  onPause: () => void;
  onRequestRename: (id: string) => void;
  cooldownProgress?: number;
}

const HUD: React.FC<HUDProps> = ({ activePokemon, team, gameState, onSwap, onPause, onRequestRename, cooldownProgress = 100 }) => {
  
  const hasRapidBuff = activePokemon.activeBuffs.rapidFireExpires && activePokemon.activeBuffs.rapidFireExpires > Date.now();
  const hasSpreadBuff = activePokemon.activeBuffs.spreadExpires && activePokemon.activeBuffs.spreadExpires > Date.now();

  return (
    <div className="w-full max-w-[800px] mt-4 flex flex-col gap-2 p-4 bg-gray-900 border-4 border-gray-700 rounded-lg shadow-2xl relative">
      {/* Top Bar */}
      <div className="flex justify-between items-start border-b-2 border-gray-700 pb-2 mb-2">
        <div className="flex flex-col">
          <h1 className="text-2xl text-yellow-400 font-bold tracking-widest drop-shadow-md">WAVE {gameState.wave}</h1>
          <div className="flex gap-4 text-sm font-mono">
              <p className="text-white">SCORE: <span className="text-green-400">{gameState.score.toString().padStart(6, '0')}</span></p>
              <p className="text-gray-400">HI: <span className="text-yellow-600">{gameState.highScore.toString().padStart(6, '0')}</span></p>
          </div>
        </div>
        
        {/* Active Mon Status */}
        <div className="text-right flex flex-col items-end">
          <button 
            className="text-lg font-bold text-white uppercase cursor-pointer hover:text-yellow-300 flex items-center gap-2 group outline-none focus:text-yellow-300"
            onClick={() => onRequestRename(activePokemon.id)}
            title="Click to Rename"
          >
            {activePokemon.nickname} 
            <span className="text-xs text-gray-500 opacity-50 group-hover:opacity-100">✎</span>
            <span className="text-xs text-gray-400 no-underline pointer-events-none">Lv.{activePokemon.level}</span>
          </button>
          
          {/* HP Bar */}
          <div className="flex items-center gap-2">
             <span className="text-[10px] text-red-400 font-bold">HP</span>
             <div className="w-48 h-5 bg-gray-800 rounded-sm overflow-hidden border border-gray-600 relative">
              <div 
                className={`h-full transition-all duration-300 ${activePokemon.stats.hp < activePokemon.stats.maxHp * 0.3 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}
                style={{ width: `${(activePokemon.stats.hp / activePokemon.stats.maxHp) * 100}%` }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white font-bold drop-shadow-md z-10">
                {activePokemon.stats.hp} / {activePokemon.stats.maxHp}
              </span>
              <div className="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zwjjgzjIHFBmAAxxAA0NDaF8Dg4AAy4J5/3K6+AAAAAASUVORK5CYII=')] opacity-20"></div>
            </div>
          </div>

          {/* XP Bar */}
          <div className="w-48 h-1 bg-gray-800 mt-1 rounded-full overflow-hidden">
             <div 
              className="h-full bg-blue-400"
              style={{ width: `${(activePokemon.xp / activePokemon.xpToNextLevel) * 100}%` }}
            />
          </div>

          {/* Cooldown Bar */}
          {(activePokemon.stats.fireRate || 500) > 600 && !hasRapidBuff && (
             <div className="flex items-center gap-2 mt-1">
                 <span className="text-[8px] text-yellow-500">RELOAD</span>
                 <div className="w-20 h-1 bg-gray-700">
                     <div className={`h-full ${cooldownProgress >= 100 ? 'bg-yellow-400' : 'bg-red-500'}`} style={{ width: `${cooldownProgress}%` }}></div>
                 </div>
             </div>
          )}

          {/* Buff Indicators */}
          <div className="flex gap-2 mt-1">
              {hasRapidBuff && <span className="text-[9px] px-1 bg-yellow-900 text-yellow-200 rounded border border-yellow-500 animate-pulse">RAPID FIRE</span>}
              {hasSpreadBuff && <span className="text-[9px] px-1 bg-purple-900 text-purple-200 rounded border border-purple-500 animate-pulse">SHOTGUN</span>}
          </div>
        </div>
      </div>

      {/* Team Bar */}
      <div className="flex justify-between items-end">
        <div className="flex gap-4">
          {team.map((poke, idx) => (
            <button
              key={poke.id}
              onClick={() => onSwap(idx)}
              className={`
                flex flex-col items-center p-1 rounded border-2 transition-all relative overflow-hidden group
                ${poke.id === activePokemon.id ? 'border-yellow-400 bg-gray-800 -translate-y-1' : 'border-gray-600 bg-gray-900 hover:bg-gray-800'}
              `}
              disabled={poke.stats.hp <= 0}
            >
              <div className={`w-10 h-10 mb-1 relative ${poke.stats.hp <= 0 ? 'grayscale opacity-50' : ''}`}>
                 <PixelSprite speciesId={poke.speciesId} />
              </div>
              
              <div className="w-10 h-1 bg-gray-800 mt-1">
                  <div className={`h-full ${poke.stats.hp < poke.stats.maxHp * 0.3 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${(poke.stats.hp / poke.stats.maxHp) * 100}%` }}></div>
              </div>
              
              {poke.id === activePokemon.id && (
                <div className="absolute top-0 right-0 w-2 h-2 bg-yellow-400 animate-ping rounded-full"></div>
              )}
              <span className="text-[9px] uppercase mt-1 text-gray-400 group-hover:text-white">{poke.nickname.substring(0, 3)}</span>
            </button>
          ))}
          
          {Array.from({ length: 3 - team.length }).map((_, i) => (
             <div key={`empty-${i}`} className="w-14 h-16 border-2 border-dashed border-gray-700 rounded flex items-center justify-center text-gray-700 text-xs">
               DEAD
             </div>
          ))}
        </div>

        {/* Bench / Controls / Pause */}
        <div className="flex items-end gap-4">
             <div className="flex flex-col items-center justify-end text-xs text-gray-500" id="bench-target">
                 <span className="mb-1">BENCH</span>
                 <div className="w-10 h-10 border-2 border-gray-600 rounded bg-gray-800 flex items-center justify-center">
                     <div className="w-6 h-6 rounded-full border border-gray-500 bg-gray-700 flex items-center justify-center">
                         <div className="w-4 h-0.5 bg-black"></div>
                     </div>
                 </div>
             </div>

             <div className="flex flex-col items-end gap-2">
                <button 
                  onClick={onPause}
                  className="w-10 h-10 bg-gray-800 border-2 border-gray-600 rounded flex items-center justify-center hover:bg-gray-700 hover:border-white transition-colors"
                  title="Pause Game (P)"
                >
                  {gameState.isPaused ? (
                     <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  ) : (
                     <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                  )}
                </button>
                <p className="text-[9px] text-gray-500">ARROWS TO MOVE • SPACE TO SHOOT</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default HUD;
