
import React, { useState, useEffect, useRef } from 'react';

interface RenameModalProps {
  currentName: string;
  onConfirm: (newName: string) => void;
  onCancel: () => void;
}

const RenameModal: React.FC<RenameModalProps> = ({ currentName, onConfirm, onCancel }) => {
  const [name, setName] = useState(currentName);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto focus input
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onConfirm(name.trim());
    }
  };

  return (
    <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-[150]">
      <div className="bg-slate-800 border-4 border-slate-600 p-6 rounded-lg shadow-2xl w-full max-w-md">
        <h2 className="text-xl text-yellow-400 mb-4 font-bold text-center">RENAME POKEMON</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-900 border-2 border-slate-500 text-white p-3 text-center uppercase focus:border-yellow-400 outline-none rounded"
            maxLength={12}
          />
          
          <div className="flex gap-4 mt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded border-b-4 border-red-800 active:border-b-0 active:translate-y-1 transition-all"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-green-500 hover:bg-green-400 text-black font-bold rounded border-b-4 border-green-700 active:border-b-0 active:translate-y-1 transition-all"
            >
              CONFIRM
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RenameModal;
