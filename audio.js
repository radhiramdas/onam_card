/**
 * Onam-Greeting-2027 Audio Synthesizer
 * Synthesizes authentic Kerala festival audio using the Web Audio API:
 * - Chenda Melam (Uruttu Chenda, Veekku Chenda)
 * - Ilathalam (Brass cymbals clashing and dampening)
 * - Temple Brass Bell (Mani)
 * - Tampura Drone (Swara harmony)
 * - Traditional Kerala Melodic Flute / Pullankuzhal (Mohanam raga phrases)
 * 
 * Routes output both to audio output (speakers) and to an AudioDestinationNode
 * for recording directly into the 1080x1920 MP4/WebM export video!
 */

class KeralaAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.recorderDest = null;
    this.isPlaying = false;
    this.isMuted = false;
    this.volume = 0.85;
    this.scheduledEvents = [];
    this.tampuraNodes = [];
    this.bpm = 100;
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();
    
    // Master gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // Audio stream destination for canvas recorder
    this.recorderDest = this.ctx.createMediaStreamDestination();
    this.masterGain.connect(this.recorderDest);

    // Add mild reverberation for royal temple ambiance
    this.convolver = this.createReverb(2.2, 0.4);
    this.reverbGain = this.ctx.createGain();
    this.reverbGain.gain.value = 0.35;
    this.reverbGain.connect(this.masterGain);
    this.convolver.connect(this.reverbGain);
  }

  createReverb(duration, decay) {
    const sampleRate = this.ctx.sampleRate;
    const length = sampleRate * duration;
    const impulse = this.ctx.createBuffer(2, length, sampleRate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);

    for (let i = 0; i < length; i++) {
      const n = (length - i) / length;
      const factor = Math.pow(n, decay);
      left[i] = (Math.random() * 2 - 1) * factor;
      right[i] = (Math.random() * 2 - 1) * factor;
    }

    const conv = this.ctx.createConvolver();
    conv.buffer = impulse;
    return conv;
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && !this.isMuted) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : this.volume, this.ctx.currentTime, 0.05);
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // --- SOUND GENERATORS ---

  // 1. Veekku Chenda (Bass drum beat - "Tham")
  playVeekkuChenda(time, intensity = 1.0) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(110, time);
    osc.frequency.exponentialRampToValueAtTime(55, time + 0.18);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, time);
    filter.frequency.exponentialRampToValueAtTime(120, time + 0.25);

    gain.gain.setValueAtTime(0.8 * intensity, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    gain.connect(this.convolver);

    osc.start(time);
    osc.stop(time + 0.36);
  }

  // 2. Uruttu Chenda (High stick strike / snap - "Dhi", "Thakil", "Dheem")
  playUruttuChenda(time, intensity = 1.0, isRim = false) {
    if (!this.ctx) return;

    // Pitch component
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = isRim ? 'sine' : 'triangle';
    const baseFreq = isRim ? 480 : 280;
    osc.frequency.setValueAtTime(baseFreq, time);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, time + 0.08);

    oscGain.gain.setValueAtTime(0.7 * intensity, time);
    oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);

    // Crack/Skin noise component
    const bufferSize = this.ctx.sampleRate * 0.09;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(isRim ? 2200 : 1200, time);
    noiseFilter.Q.setValueAtTime(3.5, time);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.85 * intensity, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);

    osc.connect(oscGain);
    oscGain.connect(this.masterGain);

    whiteNoise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    noiseGain.connect(this.convolver);

    osc.start(time);
    osc.stop(time + 0.13);
    whiteNoise.start(time);
    whiteNoise.stop(time + 0.09);
  }

  // 3. Ilathalam (Brass cymbals - "Kinnam", "Chil")
  playIlathalam(time, open = true, intensity = 0.8) {
    if (!this.ctx) return;
    const duration = open ? 0.6 : 0.12;
    const bufferSize = this.ctx.sampleRate * duration;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    // Metallic ring frequencies (metallic peaks of brass cymbals)
    const filter1 = this.ctx.createBiquadFilter();
    filter1.type = 'highpass';
    filter1.frequency.setValueAtTime(3200, time);

    const filter2 = this.ctx.createBiquadFilter();
    filter2.type = 'peaking';
    filter2.frequency.setValueAtTime(5400, time);
    filter2.Q.setValueAtTime(6.0, time);
    filter2.gain.setValueAtTime(12, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4 * intensity, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    noise.connect(filter1);
    filter1.connect(filter2);
    filter2.connect(gain);
    gain.connect(this.masterGain);
    gain.connect(this.convolver);

    noise.start(time);
    noise.stop(time + duration);
  }

  // 4. Temple Bell (Deep resonant Mani with shimmering harmonics)
  playTempleBell(time, freq = 740, intensity = 0.9) {
    if (!this.ctx) return;
    const harmonics = [1, 2.02, 3.01, 4.2, 5.4];
    const decays = [2.8, 1.9, 1.4, 0.9, 0.5];
    const amps = [0.6, 0.35, 0.2, 0.15, 0.08];

    harmonics.forEach((h, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * h, time);

      gain.gain.setValueAtTime(amps[idx] * intensity, time);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + decays[idx]);

      osc.connect(gain);
      gain.connect(this.masterGain);
      gain.connect(this.convolver);

      osc.start(time);
      osc.stop(time + decays[idx]);
    });
  }

  // 5. Traditional Kerala Flute note (Warm bansuri / pullankuzhal tone with vibrato)
  playFluteNote(time, freq, duration = 0.8, intensity = 0.6) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // Subtle natural breath vibrato
    lfo.frequency.setValueAtTime(5.2, time);
    lfoGain.gain.setValueAtTime(freq * 0.015, time);
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 2.8, time);

    // Warm envelope (soft attack, sustained breath, gentle release)
    const attack = 0.08;
    const release = 0.2;
    gain.gain.setValueAtTime(0.001, time);
    gain.gain.linearRampToValueAtTime(intensity * 0.45, time + attack);
    gain.gain.setValueAtTime(intensity * 0.45, time + duration - release);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    gain.connect(this.convolver);

    lfo.start(time);
    osc.start(time);
    lfo.stop(time + duration);
    osc.stop(time + duration);
  }

  // 6. Tampura Drone (Plays background tanpura chord: Sa-Pa-Sa-Sa)
  startTampura() {
    if (!this.ctx || this.tampuraNodes.length > 0) return;
    const root = 138.59; // C#3
    const pitches = [root * 1.5, root * 2, root * 2, root]; // Pa, Sa(high), Sa(high), Sa(low)
    
    pitches.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(freq * 2, this.ctx.currentTime);
      filter.Q.value = 4.0;

      // Slow amplitude swirl to simulate plucking string cycle
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.value = 0.25 + i * 0.07;
      lfoGain.gain.value = 0.035;

      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      lfo.connect(gain.gain);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      gain.connect(this.convolver);

      osc.start();
      lfo.start();

      this.tampuraNodes.push({ osc, lfo, gain });
    });
  }

  stopTampura() {
    this.tampuraNodes.forEach(node => {
      try {
        node.osc.stop();
        node.lfo.stop();
      } catch(e) {}
    });
    this.tampuraNodes = [];
  }

  // --- SCORE TIMELINE SYNCHRONIZATION ---
  // Schedules authentic Kerala Onam musical phrases corresponding to timeline 0 to 38s
  scheduleTrack(startTime, currentPlaybackTime = 0) {
    this.stopAll();
    this.init();
    this.resume();
    this.startTampura();

    // Mohanam Raga notes (Pentatonic: Sa, Ri2, Ga3, Pa, Dha2 -> C#, D#, F, G#, A#)
    const Sa = 277.18;  // C#4
    const Ri = 311.13;  // D#4
    const Ga = 349.23;  // F4
    const Pa = 415.30;  // G#4
    const Dha = 466.16; // A#4
    const SaHigh = 554.37; // C#5
    const RiHigh = 622.25; // D#5
    const GaHigh = 698.46; // F5

    // Total composition lasts 38.5 seconds
    const totalDuration = 38.5;

    // Helper to calculate audio context trigger time from score second
    const getTriggerTime = (second) => {
      const delta = second - currentPlaybackTime;
      return delta >= 0 ? startTime + delta : null;
    };

    // 1. Temple Bell rings at key scene transitions
    const bellMoments = [0.1, 7.5, 15.0, 22.5, 30.5];
    bellMoments.forEach((m, idx) => {
      const t = getTriggerTime(m);
      if (t !== null && m <= totalDuration) {
        this.playTempleBell(t, idx % 2 === 0 ? 554 : 415, 0.95);
      }
    });

    // 2. Melodic Flute Themes
    // Scene 1: Regal gentle majestic intro (0.5s - 7.0s)
    const introMelody = [
      { t: 0.8, f: Sa, d: 1.2 },
      { t: 2.0, f: Ri, d: 0.8 },
      { t: 2.8, f: Ga, d: 1.4 },
      { t: 4.4, f: Pa, d: 1.1 },
      { t: 5.6, f: Dha, d: 1.3 }
    ];

    // Scene 2: Floral blooming graceful phrase (8.0s - 14.5s)
    const pookalamMelody = [
      { t: 8.2, f: Pa, d: 0.9 },
      { t: 9.2, f: Dha, d: 0.7 },
      { t: 10.0, f: SaHigh, d: 1.4 },
      { t: 11.5, f: RiHigh, d: 0.8 },
      { t: 12.4, f: SaHigh, d: 0.9 },
      { t: 13.4, f: Dha, d: 1.2 }
    ];

    // Scene 3: Deep devotional Kerala tradition phrase (15.5s - 22.0s)
    const traditionMelody = [
      { t: 15.8, f: Ga, d: 1.2 },
      { t: 17.1, f: Pa, d: 0.9 },
      { t: 18.2, f: Ga, d: 0.7 },
      { t: 19.0, f: Ri, d: 1.3 },
      { t: 20.4, f: Sa, d: 1.6 }
    ];

    // Scene 4: Grand energetic celebration peak (22.8s - 30.0s)
    const celebrationMelody = [
      { t: 23.0, f: SaHigh, d: 0.6 },
      { t: 23.7, f: RiHigh, d: 0.6 },
      { t: 24.4, f: GaHigh, d: 1.0 },
      { t: 25.6, f: RiHigh, d: 0.7 },
      { t: 26.4, f: SaHigh, d: 0.7 },
      { t: 27.2, f: Dha, d: 0.8 },
      { t: 28.1, f: Pa, d: 0.9 },
      { t: 29.1, f: SaHigh, d: 1.4 }
    ];

    // Scene 5: Blissful royal concluding blessing (31.0s - 37.5s)
    const outroMelody = [
      { t: 31.2, f: Pa, d: 1.2 },
      { t: 32.5, f: Ga, d: 1.0 },
      { t: 33.6, f: Ri, d: 1.3 },
      { t: 35.0, f: Sa, d: 2.2 }
    ];

    const allMelodies = [
      ...introMelody,
      ...pookalamMelody,
      ...traditionMelody,
      ...celebrationMelody,
      ...outroMelody
    ];

    allMelodies.forEach(note => {
      const t = getTriggerTime(note.t);
      if (t !== null && note.t <= totalDuration) {
        this.playFluteNote(t, note.f, note.d, 0.75);
      }
    });

    // 3. Chenda Melam & Ilathalam rhythmic groove
    // Traditional Kerala Panchari / Pandi Melam tempo build-up:
    // 0s-7.5s: Calm majestic beat
    // 7.5s-22.5s: Steady rhythmic festive cadence (Thakida Thakida)
    // 22.5s-30.5s: High energy Grand Melam crescendo!
    // 30.5s-38s: Regal grand resolution
    const stepTime = 0.35; // base 16th/8th beat interval
    for (let sec = 1.0; sec < totalDuration; sec += stepTime) {
      const t = getTriggerTime(sec);
      if (t === null) continue;

      const beatIndex = Math.round(sec / stepTime);

      // Intro (0 - 7.5s)
      if (sec < 7.5) {
        if (beatIndex % 8 === 0) {
          this.playVeekkuChenda(t, 0.9);
          this.playIlathalam(t, true, 0.5);
        } else if (beatIndex % 4 === 0) {
          this.playUruttuChenda(t, 0.6, false);
          this.playIlathalam(t, false, 0.35);
        }
      }
      // Pookalam & Traditions (7.5 - 22.5s)
      else if (sec < 22.5) {
        if (beatIndex % 4 === 0) {
          this.playVeekkuChenda(t, 1.0);
          this.playIlathalam(t, true, 0.65);
        } else if (beatIndex % 4 === 2) {
          this.playUruttuChenda(t, 0.85, true);
          this.playIlathalam(t, false, 0.5);
        } else {
          // roll
          this.playUruttuChenda(t, 0.45, false);
        }
      }
      // Grand Celebration Crescendo (22.5 - 30.5s) - Fast Melam!
      else if (sec < 30.5) {
        this.playVeekkuChenda(t, (beatIndex % 2 === 0) ? 1.0 : 0.6);
        this.playUruttuChenda(t, 0.9, beatIndex % 2 === 1);
        this.playIlathalam(t, beatIndex % 2 === 0, 0.8);
      }
      // Grand Outro (30.5 - 38s)
      else {
        if (beatIndex % 8 === 0) {
          this.playVeekkuChenda(t, 0.85);
          this.playIlathalam(t, true, 0.7);
        } else if (beatIndex % 4 === 0) {
          this.playUruttuChenda(t, 0.5);
          this.playIlathalam(t, false, 0.4);
        }
      }
    }
  }

  stopAll() {
    this.stopTampura();
    if (this.ctx) {
      // close or suspend old nodes
      try {
        this.ctx.close();
      } catch(e) {}
      this.ctx = null;
    }
  }
}

// Global instance
window.keralaAudio = new KeralaAudioEngine();

