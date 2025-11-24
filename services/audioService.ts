
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

const playNoise = (duration: number, lowPass: boolean = false) => {
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
  gain.gain.setValueAtTime(lowPass ? 0.5 : 0.2, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
  
  noise.connect(gain);

  if (lowPass) {
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, audioCtx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + duration);
    gain.connect(filter);
    filter.connect(masterGain);
  } else {
    gain.connect(masterGain);
  }
  
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

  playShieldHit: () => {
    initAudio();
    playTone(800, 'sine', 0.1, 0.2, 600); // Deflect sound
  },

  playExplosion: () => {
    initAudio();
    // Crunchier explosion using lowpass noise
    playNoise(0.4, true);
    playTone(50, 'sawtooth', 0.4, 0.2, 10); // Sub-bass impact
  },

  playShrapnel: () => {
    initAudio();
    playNoise(0.2);
    playTone(300, 'sawtooth', 0.2, 0.1, 100);
  },

  playDeath: () => {
    initAudio();
    playTone(150, 'sawtooth', 0.8, 0.2, 50);
    setTimeout(() => playNoise(0.5), 200);
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
  },

  playUFO: () => {
    initAudio();
    // Woo-woo sound
    playTone(600, 'sine', 0.2, 0.05, 800);
    setTimeout(() => playTone(800, 'sine', 0.2, 0.05, 600), 200);
  },

  playJetEngine: () => {
    initAudio();
    playTone(100, 'sawtooth', 0.3, 0.05, 150);
  },

  playPowerupSpawn: () => {
    initAudio();
    playTone(1000, 'square', 0.3, 0.1, 500);
  },

  playPowerupCollect: () => {
    initAudio();
    playTone(600, 'triangle', 0.1, 0.1, 1200);
    setTimeout(() => playTone(1200, 'triangle', 0.2, 0.1, 1800), 100);
  }
};
