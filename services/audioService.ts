// Simple Synth-based Audio Service for Retro SFX

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;

const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.3; // Master volume
    masterGain.connect(audioCtx.destination);
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
};

const playTone = (
  freq: number, 
  type: OscillatorType, 
  duration: number, 
  vol: number = 0.1, 
  slideFreq: number | null = null
) => {
  if (!audioCtx || !masterGain) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  if (slideFreq) {
    osc.frequency.linearRampToValueAtTime(slideFreq, audioCtx.currentTime + duration);
  }
  
  gain.gain.setValueAtTime(vol, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
  
  osc.connect(gain);
  gain.connect(masterGain);
  
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
};

const playNoise = (duration: number) => {
  if (!audioCtx || !masterGain) return;
  
  const bufferSize = audioCtx.sampleRate * duration;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;
  
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
  
  noise.connect(gain);
  gain.connect(masterGain);
  noise.start();
};

export const AudioService = {
  init: initAudio,
  
  playShoot: (type: string) => {
    initAudio();
    // Unique shoot sounds per type
    switch (type) {
      case 'Fire': playTone(150, 'square', 0.15, 0.1, 100); break;
      case 'Water': playTone(300, 'sine', 0.15, 0.1, 200); break;
      case 'Electric': playTone(600, 'sawtooth', 0.1, 0.05, 400); break;
      case 'Grass': playTone(400, 'triangle', 0.15, 0.1, 300); break;
      case 'Psychic': playTone(800, 'sine', 0.2, 0.05, 600); break;
      case 'Rock': playTone(100, 'square', 0.1, 0.1, 50); break;
      default: playTone(440, 'square', 0.1, 0.05, 300); break;
    }
  },

  playEnemyShoot: () => {
    initAudio();
    playTone(200, 'sawtooth', 0.2, 0.05, 100);
  },

  playHit: () => {
    initAudio();
    playNoise(0.1);
  },

  playExplosion: () => {
    initAudio();
    playNoise(0.3);
    playTone(100, 'sawtooth', 0.3, 0.2, 20);
  },

  playEvolve: () => {
    initAudio();
    // Arpeggio
    const now = audioCtx?.currentTime || 0;
    [0, 0.1, 0.2, 0.3, 0.4].forEach((t, i) => {
        setTimeout(() => playTone(440 + (i * 100), 'square', 0.2, 0.1), t * 1000);
    });
  },

  playCapture: () => {
    initAudio();
    playTone(880, 'sine', 0.1, 0.1);
    setTimeout(() => playTone(1100, 'sine', 0.1, 0.1), 150);
  }
};