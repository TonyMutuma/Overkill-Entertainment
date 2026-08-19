// Web Audio API based interactive electronic sound generator for DJ Wolverine mix previews

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private currentTrackId: string | null = null;
  private intervalId: number | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private tempo: number = 126;
  private step: number = 0;
  private volume: number = 0.8;
  private trackType: string = 'tech-house';

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;

      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  public play(bpm: number = 126, trackType: string = 'tech-house') {
    this.playTrack(this.currentTrackId || 'preview', trackType, bpm);
  }

  public pause() {
    this.stop();
  }

  public playTrack(trackId: string, trackType: string = 'tech-house', bpm: number = 126) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    this.stop();
    this.isPlaying = true;
    this.currentTrackId = trackId;
    this.trackType = trackType;
    this.tempo = bpm;
    this.step = 0;

    const stepInterval = (60 / this.tempo / 4) * 1000; // 16th notes in ms

    this.intervalId = window.setInterval(() => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;
      this.playStep(this.step % 16);
      this.step++;
    }, stepInterval);
  }

  private playStep(stepIndex: number) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // 1. Kick Drum on beats 0, 4, 8, 12 (four-on-the-floor)
    if (stepIndex % 4 === 0) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(36, now + 0.12);

      gain.gain.setValueAtTime(1.0, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.23);
    }

    // 2. Off-beat Hi-Hat on beats 2, 6, 10, 14
    if (stepIndex % 4 === 2 || (this.trackType.includes('festival') && stepIndex % 2 === 1)) {
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.05);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(8000, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.04);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      whiteNoise.start(now);
      whiteNoise.stop(now + 0.05);
    }

    // 3. Sub-bassline
    const bassSteps = [0, 3, 6, 8, 10, 12, 14];
    if (bassSteps.includes(stepIndex)) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const notes = this.trackType.includes('melodic')
        ? [55, 65, 73, 82, 98] // A1, C2, D2, E2, G2
        : [45, 50, 58, 65, 45]; // F1, G1, A#1, C2

      const note = notes[Math.floor(stepIndex / 3) % notes.length];

      osc.type = this.trackType.includes('garage') ? 'triangle' : 'sawtooth';
      osc.frequency.setValueAtTime(note, now);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, now);
      filter.frequency.exponentialRampToValueAtTime(120, now + 0.15);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.17);
    }

    // 4. Atmospheric Synth stab on bar starts
    if (stepIndex === 0 || stepIndex === 10) {
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'triangle';

      const chordRoot = this.trackType.includes('wedding') ? 261.63 : 220.0; // C4 or A3
      osc1.frequency.setValueAtTime(chordRoot, now);
      osc2.frequency.setValueAtTime(chordRoot * 1.5, now); // Fifth

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.Q.setValueAtTime(3, now);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.36);
      osc2.stop(now + 0.36);
    }
  }

  public stop() {
    this.isPlaying = false;
    this.currentTrackId = null;
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public toggle(trackId: string, trackType: string = 'tech-house', bpm: number = 126): boolean {
    if (this.isPlaying && this.currentTrackId === trackId) {
      this.stop();
      return false;
    } else {
      this.playTrack(trackId, trackType, bpm);
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentTrackId(): string | null {
    return this.currentTrackId;
  }
}

export const soundEngine = new SoundEngine();
