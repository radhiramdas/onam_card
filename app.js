/**
 * Onam-Greeting-2027 Main Application Controller
 * Manages the timeline, 60fps render loop, responsive viewport scaling,
 * UI controls (play/pause/replay/fullscreen/scrubber), and recorder integration.
 */

class OnamVideoApp {
  constructor() {
    this.canvas = document.getElementById('videoCanvas');
    this.ctx = this.canvas.getContext('2d', { alpha: false });
    this.width = 1080;
    this.height = 1920;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.currentTime = 0;
    this.totalDuration = 38.0;
    this.isPlaying = false;
    this.playbackSpeed = 1.0;
    this.lastFrameTime = performance.now();

    // Scene definitions
    this.scenes = [
      { id: 1, name: "Arrival of Maveli", start: 0.0, end: 7.5 },
      { id: 2, name: "The Pookalam", start: 7.5, end: 15.0 },
      { id: 3, name: "Spirit of Kerala", start: 15.0, end: 22.5 },
      { id: 4, name: "Grand Celebration", start: 22.5, end: 30.5 },
      { id: 5, name: "Royal Greeting", start: 30.5, end: 38.0 }
    ];

    // Reference engines
    this.graphics = window.keralaGraphics;
    this.particles = window.keralaParticles;
    this.scenesOrchestrator = window.sceneOrchestrator;
    this.audio = window.keralaAudio;
    this.exporter = new VideoExporter(this.canvas, this.audio, this);

    // DOM Elements
    this.dom = {
      playBtn: document.getElementById('playBtn'),
      playIcon: document.getElementById('playIcon'),
      pauseIcon: document.getElementById('pauseIcon'),
      replayBtn: document.getElementById('replayBtn'),
      fullscreenBtn: document.getElementById('fullscreenBtn'),
      timeSlider: document.getElementById('timeSlider'),
      timeDisplay: document.getElementById('timeDisplay'),
      muteBtn: document.getElementById('muteBtn'),
      volumeSlider: document.getElementById('volumeSlider'),
      scenePills: document.querySelectorAll('.scene-pill'),
      exportBtn: document.getElementById('exportBtn'),
      posterBtn: document.getElementById('posterBtn'),
      recordModal: document.getElementById('recordModal'),
      recordProgressBar: document.getElementById('recordProgressBar'),
      recordProgressText: document.getElementById('recordProgressText'),
      recordStatusText: document.getElementById('recordStatusText'),
      cancelRecordBtn: document.getElementById('cancelRecordBtn'),
      videoContainer: document.getElementById('videoContainer')
    };

    this.isDraggingSlider = false;
    this.init();
  }

  init() {
    this.setupEvents();
    this.setupExporterCallbacks();
    this.updateUI();

    // Render initial poster frame (Scene 1)
    this.renderFrame(0);

    // Start 60fps animation loop
    requestAnimationFrame((t) => this.loop(t));
  }

  setupEvents() {
    // Play / Pause toggle
    this.dom.playBtn.addEventListener('click', () => {
      this.togglePlay();
    });

    // Replay
    this.dom.replayBtn.addEventListener('click', () => {
      this.seekTo(0);
      this.play();
    });

    // Fullscreen toggle
    this.dom.fullscreenBtn.addEventListener('click', () => {
      this.toggleFullscreen();
    });

    // Scrubber
    this.dom.timeSlider.addEventListener('input', (e) => {
      this.isDraggingSlider = true;
      const targetTime = parseFloat(e.target.value);
      this.seekTo(targetTime);
    });

    this.dom.timeSlider.addEventListener('change', (e) => {
      this.isDraggingSlider = false;
      const targetTime = parseFloat(e.target.value);
      this.seekTo(targetTime);
      if (this.isPlaying) {
        this.audio.scheduleTrack(this.audio.ctx.currentTime, this.currentTime);
      }
    });

    // Scene pill click jumps
    this.dom.scenePills.forEach(pill => {
      pill.addEventListener('click', () => {
        const time = parseFloat(pill.dataset.time);
        this.seekTo(time);
        if (this.isPlaying) {
          this.audio.scheduleTrack(this.audio.ctx.currentTime, this.currentTime);
        }
      });
    });

    // Mute / Unmute
    this.dom.muteBtn.addEventListener('click', () => {
      this.audio.init();
      this.audio.setMuted(!this.audio.isMuted);
      this.dom.muteBtn.classList.toggle('muted', this.audio.isMuted);
      this.dom.muteBtn.innerHTML = this.audio.isMuted ? '🔇' : '🔊';
    });

    // Volume slider
    this.dom.volumeSlider.addEventListener('input', (e) => {
      this.audio.init();
      const val = parseFloat(e.target.value);
      this.audio.setVolume(val);
      if (val === 0) {
        this.dom.muteBtn.innerHTML = '🔇';
      } else {
        this.dom.muteBtn.innerHTML = '🔊';
      }
    });

    // Export Video Button
    this.dom.exportBtn.addEventListener('click', () => {
      this.startExportProcess();
    });

    // Export High-Res Poster Button
    this.dom.posterBtn.addEventListener('click', () => {
      this.exporter.exportPoster(`Onam-Greeting-2027-${Math.round(this.currentTime)}s.png`);
    });

    // Cancel Recording
    this.dom.cancelRecordBtn.addEventListener('click', () => {
      this.exporter.cancelExport();
      this.dom.recordModal.classList.remove('active');
    });

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT') return;
      if (e.code === 'Space') {
        e.preventDefault();
        this.togglePlay();
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        this.seekTo(0);
        this.play();
      } else if (e.code === 'KeyF') {
        e.preventDefault();
        this.toggleFullscreen();
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        this.dom.muteBtn.click();
      }
    });

    // Canvas click to play/pause
    this.canvas.addEventListener('click', () => {
      this.togglePlay();
    });
  }

  setupExporterCallbacks() {
    this.exporter.onProgress = ({ currentTime, totalDuration, progressPercent }) => {
      this.dom.recordProgressBar.style.width = `${progressPercent}%`;
      this.dom.recordProgressText.textContent = `${progressPercent}% (${currentTime.toFixed(1)}s / ${totalDuration.toFixed(1)}s)`;

      // Identify active scene for user feedback
      const currentScene = this.scenes.find(s => currentTime >= s.start && currentTime < s.end);
      if (currentScene) {
        this.dom.recordStatusText.textContent = `Recording Scene ${currentScene.id}: ${currentScene.name}...`;
      }
    };

    this.exporter.onComplete = ({ filename, extension, size }) => {
      const mb = (size / (1024 * 1024)).toFixed(1);
      this.dom.recordStatusText.textContent = `Export Completed! Saved ${filename} (${mb} MB). Check your downloads folder!`;
      this.dom.recordProgressBar.style.width = '100%';
      this.dom.recordProgressText.textContent = '100% Done!';

      setTimeout(() => {
        this.dom.recordModal.classList.remove('active');
      }, 3500);
    };
  }

  startExportProcess() {
    this.dom.recordModal.classList.add('active');
    this.dom.recordProgressBar.style.width = '0%';
    this.dom.recordProgressText.textContent = '0%';
    this.dom.recordStatusText.textContent = 'Preparing high-definition 1080×1920 stream...';

    // Small delay to allow UI to render modal
    setTimeout(() => {
      this.exporter.startExport(this.totalDuration);
    }, 400);
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.lastFrameTime = performance.now();

    // If at end, loop to beginning
    if (this.currentTime >= this.totalDuration - 0.1) {
      this.currentTime = 0;
    }

    // Initialize & sync audio
    this.audio.init();
    this.audio.resume();
    this.audio.scheduleTrack(this.audio.ctx.currentTime, this.currentTime);

    this.updateUI();
  }

  pause() {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    this.audio.stopAll();
    this.updateUI();
  }

  seekTo(time) {
    this.currentTime = Math.max(0, Math.min(this.totalDuration, time));
    this.renderFrame(this.currentTime);
    this.updateUI();
  }

  toggleFullscreen() {
    const elem = this.dom.videoContainer;
    if (!document.fullscreenElement) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  loop(timestamp) {
    const dt = Math.min(0.1, (timestamp - this.lastFrameTime) / 1000);
    this.lastFrameTime = timestamp;

    if (this.isPlaying) {
      this.currentTime += dt * this.playbackSpeed;

      // Handle end of video
      if (this.currentTime >= this.totalDuration) {
        this.currentTime = this.totalDuration;
        this.pause();
      }

      this.renderFrame(this.currentTime);
      this.updateUI();
    }

    requestAnimationFrame((t) => this.loop(t));
  }

  renderFrame(time) {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Render active scene via scene orchestrator
    this.scenesOrchestrator.render(this.ctx, time, this.graphics, this.particles);
  }

  updateUI() {
    // Play/Pause button icons
    if (this.isPlaying) {
      this.dom.playIcon.style.display = 'none';
      this.dom.pauseIcon.style.display = 'block';
    } else {
      this.dom.playIcon.style.display = 'block';
      this.dom.pauseIcon.style.display = 'none';
    }

    // Time slider & timestamp display
    if (!this.isDraggingSlider) {
      this.dom.timeSlider.value = this.currentTime;
    }

    const curM = Math.floor(this.currentTime / 60);
    const curS = Math.floor(this.currentTime % 60);
    const curMs = Math.floor((this.currentTime % 1) * 10);
    const totM = Math.floor(this.totalDuration / 60);
    const totS = Math.floor(this.totalDuration % 60);

    const pad = (n) => n.toString().padStart(2, '0');
    this.dom.timeDisplay.textContent = `${pad(curM)}:${pad(curS)}.${curMs} / ${pad(totM)}:${pad(totS)}`;

    // Update active scene pill indicator
    this.scenes.forEach(scene => {
      const pill = document.querySelector(`.scene-pill[data-scene="${scene.id}"]`);
      if (pill) {
        if (this.currentTime >= scene.start && this.currentTime < scene.end) {
          pill.classList.add('active');
        } else {
          pill.classList.remove('active');
        }
      }
    });
  }
}

// Instantiate on DOM load
window.addEventListener('DOMContentLoaded', () => {
  window.app = new OnamVideoApp();
});

