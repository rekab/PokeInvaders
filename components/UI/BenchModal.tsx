import React, { useState } from 'react';
import { Pokemon, PokemonType } from '../../types';
import { getStrategicAdvice } from '../../services/geminiService';

interface BenchModalProps {
  team: Pokemon[];
  bench: Pokemon[];
  nextWaveTypes: PokemonType[];
  onContinue: () => void;
  onSwapMember: (teamIndex: number, benchIndex: number) => void;
  onRequestRename: (id: string) => void;
  onHealAll: () => void; 
}

const BenchModal: React.FC<BenchModalProps> = ({ team, bench, nextWaveTypes, onContinue, onSwapMember, onRequestRename }) => {
  const [selectedTeamIndex, setSelectedTeamIndex] = useState<number | null>(null);
  const [advice, setAdvice] = useState<string>("");
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  const handleFetchAdvice = async () => {
    setLoadingAdvice(true);
    const text = await getStrategicAdvice(team, bench, nextWaveTypes);
    setAdvice(text);
    setLoadingAdvice(false);
  };

  const handleRenameClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onRequestRename(id);
  };

  return (
    <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-50 p-8">
      <h2 className="text-3xl text-yellow-400 mb-2">WAVE COMPLETE</h2>
      <p className="text-sm text-gray-400 mb-8">PREPARE FOR NEXT BATTLE</p>

      <div className="grid grid-cols-2 gap-12 w-full max-w-4xl">
        {/* Active Team */}
        <div className="bg-gray-800 p-4 rounded border border-gray-600">
          <h3 className="text-xl mb-4 text-center border-b border-gray-600 pb-2">ACTIVE TEAM</h3>
          <div className="space-y-4">
            {team.map((poke, idx) => (
              <div 
                key={poke.id} 
                className={`p-3 bg-gray-900 border-2 ${selectedTeamIndex === idx ? 'border-yellow-400' : 'border-gray-700'} rounded cursor-pointer hover:bg-gray-700 flex justify-between items-center`}
                onClick={() => setSelectedTeamIndex(selectedTeamIndex === idx ? null : idx)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 ${poke.spriteColor}`}></div>
                  <div>
                    <div 
                      className="font-bold text-sm flex items-center gap-2 group"
                      onClick={(e) => handleRenameClick(e, poke.id)}
                    >
                        <span className="group-hover:text-yellow-300">{poke.nickname}</span>
                        <span 
                          className="text-[10px] text-gray-500 cursor-pointer hover:text-white"
                          title="Rename"
                        >✎</span>
                    </div>
                    <p className="text-[10px] text-gray-400">{poke.name} • {poke.type}</p>
                  </div>
                </div>
                <div className="text-right text-xs">
                  <p className="text-green-400">HP {poke.stats.hp}/{poke.stats.maxHp}</p>
                  <p className="text-red-400">ATK {poke.stats.attack}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-gray-500 mt-2 text-center">Select a team member, then click a bench member to swap.</p>
        </div>

        {/* Bench */}
        <div className="bg-gray-800 p-4 rounded border border-gray-600 flex flex-col h-[400px]">
          <h3 className="text-xl mb-4 text-center border-b border-gray-600 pb-2">BENCH ({bench.length})</h3>
          <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {bench.length === 0 && <p className="text-center text-gray-500 mt-10">No Pokemon captured yet.</p>}
            {bench.map((poke, bIdx) => (
              <div 
                key={poke.id} 
                className="p-2 bg-gray-900 border border-gray-700 rounded hover:border-white cursor-pointer flex justify-between items-center"
                onClick={() => {
                  if (selectedTeamIndex !== null) {
                    onSwapMember(selectedTeamIndex, bIdx);
                    setSelectedTeamIndex(null);
                  }
                }}
              >
                 <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 ${poke.spriteColor}`}></div>
                  <div>
                    <div 
                        className="text-xs font-bold flex items-center gap-2 group"
                        onClick={(e) => handleRenameClick(e, poke.id)}
                    >
                        <span className="group-hover:text-yellow-300">{poke.nickname}</span>
                        <span 
                          className="text-[8px] text-gray-500 cursor-pointer hover:text-white"
                          title="Rename"
                        >✎</span>
                    </div>
                    <p className="text-[10px] text-gray-400">{poke.name} • {poke.type}</p>
                  </div>
                </div>
                <div className="text-[10px] text-green-400">
                   HP {poke.stats.hp}/{poke.stats.maxHp}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Advice Section */}
      <div className="mt-8 w-full max-w-4xl bg-gray-800 p-4 rounded border border-purple-500">
        <div className="flex justify-between items-center mb-2">
           <h4 className="text-purple-400 text-sm font-bold">PROFESSOR GEMINI'S ADVICE</h4>
           <button 
             onClick={handleFetchAdvice}
             disabled={loadingAdvice}
             className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-[10px] rounded disabled:opacity-50"
           >
             {loadingAdvice ? 'ANALYZING...' : 'ASK ADVICE'}
           </button>
        </div>
        <p className="text-xs text-gray-300 italic min-h-[40px]">
          {advice || `Upcoming enemies include: ${Array.from(new Set(nextWaveTypes)).join(', ')}. Use the button to analyze type effectiveness.`}
        </p>
      </div>

      <button 
        onClick={onContinue}
        className="mt-8 px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-xl rounded shadow-lg animate-pulse"
      >
        START NEXT WAVE
      </button>
    </div>
  );
};

export default BenchModal;