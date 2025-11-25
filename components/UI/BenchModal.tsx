
import React, { useState } from 'react';
import { Pokemon, PokemonType, PowerUpType } from '../../types';
import { PixelSprite } from '../Visuals';

interface BenchModalProps {
  team: Pokemon[];
  bench: Pokemon[];
  nextWaveTypes: PokemonType[];
  onContinue: () => void;
  onSwapMember: (teamIndex: number, benchIndex: number) => void;
  onRequestRename: (id: string) => void;
  onTradeMember: (benchIndex: number) => void; // New prop
  onHealAll: () => void;
}

const BenchModal: React.FC<BenchModalProps> = ({ 
    team, bench, nextWaveTypes, onContinue, onSwapMember, onRequestRename, onTradeMember 
}) => {
  const [selectedTeamIdx, setSelectedTeamIdx] = useState<number | null>(null);

  // Mapping types to powerup rewards
  const getTradeReward = (type: PokemonType): PowerUpType => {
      switch(type) {
          case PokemonType.FIRE:
          case PokemonType.ELECTRIC:
          case PokemonType.DRAGON:
              return PowerUpType.RAPID;
          case PokemonType.WATER:
          case PokemonType.ROCK:
          case PokemonType.PSYCHIC:
              return PowerUpType.SHIELD;
          case PokemonType.GRASS:
          case PokemonType.BUG:
          case PokemonType.GHOST:
              return PowerUpType.SPREAD;
          default:
              return PowerUpType.HEALTH;
      }
  };

  return (
    <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-[100] p-4 text-white">
      <h2 className="text-4xl text-yellow-400 font-bold mb-2 tracking-widest">WAVE COMPLETE</h2>
      <p className="text-gray-400 mb-8 text-sm">PREPARE FOR NEXT BATTLE</p>

      <div className="grid grid-cols-2 gap-8 w-full max-w-4xl">
        
        {/* Active Team */}
        <div className="bg-slate-800 p-4 rounded-lg border-2 border-slate-600">
          <h3 className="text-xl mb-4 text-center font-bold border-b border-gray-600 pb-2">ACTIVE TEAM</h3>
          <div className="flex flex-col gap-2">
            {team.map((poke, idx) => (
              <div 
                key={poke.id}
                onClick={() => setSelectedTeamIdx(idx)}
                className={`
                   p-2 rounded border-2 cursor-pointer flex items-center justify-between transition-all
                   ${selectedTeamIdx === idx ? 'border-yellow-400 bg-slate-700' : 'border-gray-600 hover:bg-slate-700'}
                `}
              >
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-gray-900 rounded p-1">
                        <PixelSprite speciesId={poke.speciesId} />
                   </div>
                   <div className="flex flex-col">
                       <span className="font-bold text-sm uppercase">{poke.nickname}</span>
                       <span className="text-[10px] text-gray-400">{poke.name} • {poke.type}</span>
                   </div>
                </div>
                <div className="text-right">
                    <div className="text-xs font-mono mb-1">
                        <span className="text-green-400">HP {poke.stats.hp}/{poke.stats.maxHp}</span>
                    </div>
                    <div className="text-xs font-mono text-red-400">ATK {poke.stats.attack}</div>
                </div>
              </div>
            ))}
            {team.length < 3 && (
                <div className="p-4 text-center text-gray-500 border-2 border-dashed border-gray-700 rounded">
                    Empty Slot
                </div>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-4 text-center">Select a team member, then click a bench member to swap.</p>
        </div>

        {/* Bench */}
        <div className="bg-slate-800 p-4 rounded-lg border-2 border-slate-600 flex flex-col">
          <h3 className="text-xl mb-4 text-center font-bold border-b border-gray-600 pb-2">BENCH ({bench.length})</h3>
          <div className="flex-1 overflow-y-auto max-h-[300px] flex flex-col gap-2 pr-2">
             {bench.length === 0 && (
                 <div className="text-center text-gray-500 py-8">Bench is empty. Capture more enemies!</div>
             )}
             {bench.map((poke, idx) => (
               <div 
                 key={poke.id}
                 className="p-2 rounded border border-gray-700 bg-slate-900 flex items-center justify-between group"
               >
                 {/* Left side: Selection for Swap */}
                 <div 
                    className="flex items-center gap-3 cursor-pointer flex-1"
                    onClick={() => {
                        if (selectedTeamIdx !== null) {
                            onSwapMember(selectedTeamIdx, idx);
                            setSelectedTeamIdx(null);
                        }
                    }}
                 >
                    <div className="w-10 h-10 bg-gray-800 rounded p-1">
                        <PixelSprite speciesId={poke.speciesId} />
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                             <span className="font-bold text-sm uppercase group-hover:text-yellow-300 transition-colors">{poke.nickname}</span>
                             <button 
                                onClick={(e) => { e.stopPropagation(); onRequestRename(poke.id); }}
                                className="text-gray-500 hover:text-white"
                             >✎</button>
                        </div>
                        <span className="text-[10px] text-gray-400">{poke.name} • {poke.type}</span>
                    </div>
                 </div>

                 {/* Stats & Trade Action */}
                 <div className="flex items-center gap-4">
                     <div className="text-right">
                         <div className="text-xs font-mono text-green-400">HP {poke.stats.hp}/{poke.stats.maxHp}</div>
                         <div className="text-xs font-mono text-red-400">ATK {poke.stats.attack}</div>
                     </div>
                     <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onTradeMember(idx);
                        }}
                        className="px-2 py-1 bg-blue-900 hover:bg-blue-700 text-[10px] text-blue-200 border border-blue-500 rounded uppercase tracking-tighter"
                        title={`Trade for ${getTradeReward(poke.type)} Powerup`}
                     >
                        Trade
                     </button>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>

      <div className="mt-8 flex gap-4">
         <button 
           onClick={onContinue}
           className="px-8 py-3 bg-green-600 hover:bg-green-500 text-white font-bold text-xl rounded shadow-lg border-b-4 border-green-800 active:border-b-0 active:translate-y-1 transition-all"
         >
           START WAVE
         </button>
      </div>
      
      <div className="mt-4 text-xs text-gray-500">
         Next Wave Enemies: {nextWaveTypes.length > 0 ? [...new Set(nextWaveTypes)].join(', ') : 'Unknown'}
      </div>
    </div>
  );
};

export default BenchModal;
