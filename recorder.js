/**
 * Onam-Greeting-2027 Video & Poster Export Engine
 * Captures 1080x1920 video at 60 FPS directly from Canvas + Web Audio stream:
 * - Combines canvas.captureStream(60) and Web Audio destination
 * - Real-time synchronized recording with progress modal
 * - High-bitrate MP4 / WebM generation
 * - Instant file download trigger
 * - 1080x1920 Still Frame Poster/Cover export
 */

class VideoExporter {
  constructor(canvas, audioEngine, app) {
    this.canvas = canvas;
    this.audioEngine = audioEngine;
    this.app = app;
    this.mediaRecorder = null;
    this.recordedChunks = [];
    this.isRecording = false;
    this.onProgress = null;
    this.onComplete = null;
  }

  // Detect optimal supported mime type for Instagram Reels / WhatsApp
  getSupportedMimeType() {
    const candidateTypes = [
      'video/mp4;codecs=avc1.42E01E,mp4a.40.2',
      'video/mp4;codecs=h264,aac',
      'video/mp4',
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm'
    ];

    for (const type of candidateTypes) {
      if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }
    return 'video/webm';
  }

  async startExport(totalDuration = 38.0) {
    if (this.isRecording) return;
    this.isRecording = true;
    this.recordedChunks = [];

    // Pause current preview and rewind to start
    this.app.pause();
    this.app.seekTo(0);

    // Initialize audio and resume context
    this.audioEngine.init();
    await this.audioEngine.resume();

    // 1. Get 60fps canvas stream
    const canvasStream = this.canvas.captureStream(60);

    // 2. Combine with audio stream from Web Audio destination
    const audioStream = this.audioEngine.recorderDest.stream;
    const combinedTracks = [
      ...canvasStream.getVideoTracks(),
      ...audioStream.getAudioTracks()
    ];
    const combinedStream = new MediaStream(combinedTracks);

    const mimeType = this.getSupportedMimeType();
    const isMp4 = mimeType.includes('mp4');
    const extension = isMp4 ? 'mp4' : 'webm';

    // 18 Mbps high quality for crisp 1080x1920 Reels export
    const options = {
      mimeType: mimeType,
      videoBitsPerSecond: 18000000,
      audioBitsPerSecond: 192000
    };

    try {
      this.mediaRecorder = new MediaRecorder(combinedStream, options);
    } catch (e) {
      console.warn("High bitrate recorder init failed, fallback to default options:", e);
      this.mediaRecorder = new MediaRecorder(combinedStream);
    }

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        this.recordedChunks.push(event.data);
      }
    };

    this.mediaRecorder.onstop = () => {
      const blob = new Blob(this.recordedChunks, { type: mimeType });
      const url = URL.createObjectURL(blob);
      const filename = `Onam-Greeting-2027-1080x1920.${extension}`;

      // Trigger download
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 2000);

      this.isRecording = false;
      if (this.onComplete) {
        this.onComplete({ filename, extension, size: blob.size });
      }
    };

    // Start audio & recording
    this.audioEngine.scheduleTrack(this.audioEngine.ctx.currentTime, 0);
    this.mediaRecorder.start(200); // 200ms slice
    this.app.play();

    // Monitor progress
    const checkInterval = setInterval(() => {
      const currentTime = this.app.currentTime;
      const progressPercent = Math.min(100, Math.round((currentTime / totalDuration) * 100));

      if (this.onProgress) {
        this.onProgress({
          currentTime,
          totalDuration,
          progressPercent
        });
      }

      if (currentTime >= totalDuration || !this.isRecording) {
        clearInterval(checkInterval);
        this.finishExport();
      }
    }, 100);
  }

  finishExport() {
    if (!this.isRecording) return;
    this.app.pause();
    this.audioEngine.stopAll();

    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
  }

  cancelExport() {
    if (!this.isRecording) return;
    this.isRecording = false;
    this.app.pause();
    this.audioEngine.stopAll();

    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
  }

  // Export current frame as full 1080x1920 PNG poster
  exportPoster(filename = 'Onam-Greeting-2027-Poster-1080x1920.png') {
    const dataUrl = this.canvas.toDataURL('image/png', 1.0);
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}

// Global instance export will be initialized in app.js
window.VideoExporter = VideoExporter;

