/**
 * Onam-Greeting-2027 Particle & Petal Physics Engine
 * Generates:
 * 1. 3D Falling Traditional Kerala Flower Petals:
 *    - Orange Marigold (Jamanthi) petals
 *    - Crimson Red Rose / Chemparathi petals
 *    - Pure White Thumba / Jasmine petals
 *    - Golden Chrysanthemum petals
 *    Simulates realistic gravity, air resistance, sinusoidal wind sway,
 *    and 3D pitch/roll/yaw perspective tumbling!
 * 
 * 2. Luminous Golden Shimmer Dust:
 *    - Floating radiant sparkles with organic Brownian motion,
 *      pulsing glow radii, and celebratory festive twinkles!
 */

class ParticleSystem {
  constructor(width = 1080, height = 1920) {
    this.width = width;
    this.height = height;
    this.petals = [];
    this.shimmer = [];
    this.initPetals(120);
    this.initShimmer(150);
  }

  initPetals(count) {
    this.petals = [];
    const petalTypes = [
      { name: 'marigold', colorDark: '#D35400', colorLight: '#F39C12', shape: 'oval' },
      { name: 'yellow', colorDark: '#F1C40F', colorLight: '#F9E79F', shape: 'pointed' },
      { name: 'rose', colorDark: '#922B21', colorLight: '#E74C3C', shape: 'rounded' },
      { name: 'jasmine', colorDark: '#D5D8DC', colorLight: '#FFFFFF', shape: 'slender' }
    ];

    for (let i = 0; i < count; i++) {
      const type = petalTypes[Math.floor(Math.random() * petalTypes.length)];
      this.petals.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        z: Math.random() * 0.8 + 0.4, // Depth factor (scale & parallax)
        size: Math.random() * 14 + 12,
        speedY: Math.random() * 1.8 + 1.2,
        speedX: (Math.random() - 0.5) * 0.8,
        swayFreq: Math.random() * 2.5 + 1.2,
        swayAmp: Math.random() * 45 + 25,
        swayPhase: Math.random() * Math.PI * 2,
        // 3D rotation angles
        rotX: Math.random() * Math.PI * 2,
        rotY: Math.random() * Math.PI * 2,
        rotZ: Math.random() * Math.PI * 2,
        rotSpeedX: (Math.random() - 0.5) * 2.5,
        rotSpeedY: (Math.random() - 0.5) * 2.2,
        rotSpeedZ: (Math.random() - 0.5) * 1.5,
        type: type,
        opacity: Math.random() * 0.35 + 0.65
      });
    }
  }

  initShimmer(count) {
    this.shimmer = [];
    for (let i = 0; i < count; i++) {
      this.shimmer.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 3.5 + 1.0,
        speedY: -(Math.random() * 1.2 + 0.3), // Float gently upwards
        speedX: (Math.random() - 0.5) * 0.6,
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 3.0 + 1.5,
        color: Math.random() > 0.3 ? '#FFD700' : '#FFF9D2'
      });
    }
  }

  update(dt = 0.016, time = 0) {
    // 1. Update Petals
    for (let i = 0; i < this.petals.length; i++) {
      const p = this.petals[i];

      // Gravity scaled by depth
      p.y += p.speedY * p.z * (dt * 60);

      // Sinusoidal breeze sway
      const wind = Math.sin(time * p.swayFreq + p.swayPhase) * p.swayAmp * dt;
      p.x += (p.speedX + wind) * (dt * 60);

      // 3D Tumbling rotations
      p.rotX += p.rotSpeedX * dt;
      p.rotY += p.rotSpeedY * dt;
      p.rotZ += p.rotSpeedZ * dt;

      // Wrap around screen seamlessly
      if (p.y > this.height + 40) {
        p.y = -40;
        p.x = Math.random() * this.width;
      }
      if (p.x < -40) p.x = this.width + 40;
      if (p.x > this.width + 40) p.x = -40;
    }

    // 2. Update Shimmer Particles
    for (let i = 0; i < this.shimmer.length; i++) {
      const s = this.shimmer[i];
      s.y += s.speedY * (dt * 60);
      s.x += s.speedX * (dt * 60);

      if (s.y < -20) {
        s.y = this.height + 20;
        s.x = Math.random() * this.width;
      }
      if (s.x < 0) s.x = this.width;
      if (s.x > this.width) s.x = 0;
    }
  }

  render(ctx, time = 0, petalIntensity = 1.0, shimmerIntensity = 1.0) {
    // 1. Render Golden Shimmer Dust
    if (shimmerIntensity > 0.01) {
      ctx.save();
      for (let i = 0; i < this.shimmer.length; i++) {
        const s = this.shimmer[i];
        const pulse = (Math.sin(time * s.pulseSpeed + s.phase) + 1) * 0.5;
        const currentAlpha = (0.2 + pulse * 0.75) * shimmerIntensity;

        ctx.globalAlpha = currentAlpha;
        ctx.fillStyle = s.color;
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 10 * pulse;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius * (0.8 + pulse * 0.5), 0, Math.PI * 2);
        ctx.fill();

        // Cross twinkle flare on brightest pulses
        if (pulse > 0.85) {
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 1.2;
          const flareLen = s.radius * 3.5;
          ctx.beginPath();
          ctx.moveTo(s.x - flareLen, s.y);
          ctx.lineTo(s.x + flareLen, s.y);
          ctx.moveTo(s.x, s.y - flareLen);
          ctx.lineTo(s.x, s.y + flareLen);
          ctx.stroke();
        }
      }
      ctx.restore();
    }

    // 2. Render 3D Falling Flower Petals
    if (petalIntensity > 0.01) {
      ctx.save();
      for (let i = 0; i < this.petals.length; i++) {
        const p = this.petals[i];
        ctx.save();
        ctx.translate(p.x, p.y);

        // Perspective 3D rotation projection:
        // Use cos(rotX) and cos(rotY) as anisotropic scale multipliers
        const scaleX = Math.cos(p.rotY) * p.z;
        const scaleY = Math.cos(p.rotX) * p.z;
        ctx.rotate(p.rotZ);
        ctx.scale(scaleX, scaleY);

        ctx.globalAlpha = p.opacity * petalIntensity;

        // Petal Gradient
        const pLen = p.size;
        const pWid = p.size * 0.65;
        const grad = ctx.createLinearGradient(-pLen * 0.5, 0, pLen * 0.5, 0);
        grad.addColorStop(0, p.type.colorDark);
        grad.addColorStop(0.5, p.type.colorLight);
        grad.addColorStop(1, p.type.colorDark);

        ctx.fillStyle = grad;
        ctx.beginPath();

        if (p.type.shape === 'pointed') {
          // Sharp chrysanthemum petal
          ctx.moveTo(-pLen * 0.5, 0);
          ctx.quadraticCurveTo(0, -pWid, pLen * 0.5, 0);
          ctx.quadraticCurveTo(0, pWid, -pLen * 0.5, 0);
        } else if (p.type.shape === 'slender') {
          // Delicate jasmine petal
          ctx.ellipse(0, 0, pLen * 0.5, pWid * 0.35, 0, 0, Math.PI * 2);
        } else {
          // Soft rounded marigold / rose petal
          ctx.ellipse(0, 0, pLen * 0.5, pWid * 0.5, 0, 0, Math.PI * 2);
        }

        ctx.closePath();
        ctx.fill();

        // Petal delicate central vein
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-pLen * 0.4, 0);
        ctx.lineTo(pLen * 0.4, 0);
        ctx.stroke();

        ctx.restore();
      }
      ctx.restore();
    }
  }
}

// Global instance
window.keralaParticles = new ParticleSystem(1080, 1920);

