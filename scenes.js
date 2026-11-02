/**
 * Onam-Greeting-2027 Scene Orchestrator
 * Manages the 5 cinematic scenes across a 38-second timeline:
 * - Scene 1 (0.0s - 7.5s):  The Arrival of Maveli
 * - Scene 2 (7.5s - 15.0s): The Beautiful Pookalam
 * - Scene 3 (15.0s - 22.5s): The Spirit of Kerala
 * - Scene 4 (22.5s - 30.5s): Grand Onam Celebration
 * - Scene 5 (30.5s - 38.0s): Final Royal Greeting
 */

class SceneOrchestrator {
  constructor(width = 1080, height = 1920) {
    this.width = width;
    this.height = height;
    this.totalDuration = 38.0;
  }

  // Smooth easing helpers
  easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  easeOutBack(t) {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  }

  // Main render pass
  render(ctx, time, graphics, particles) {
    // Determine active scene based on time
    if (time < 7.5) {
      this.renderScene1(ctx, time, graphics, particles);
    } else if (time < 15.0) {
      this.renderScene2(ctx, time - 7.5, graphics, particles);
    } else if (time < 22.5) {
      this.renderScene3(ctx, time - 15.0, graphics, particles);
    } else if (time < 30.5) {
      this.renderScene4(ctx, time - 22.5, graphics, particles);
    } else {
      this.renderScene5(ctx, time - 30.5, graphics, particles);
    }

    // Always render ornate royal Kasavu border on top
    graphics.drawKasavuBorder(ctx, this.width, this.height);
  }

  // ==========================================
  // SCENE 1: THE ARRIVAL OF MAVELI (0.0s - 7.5s)
  // ==========================================
  renderScene1(ctx, localTime, graphics, particles) {
    const duration = 7.5;
    const progress = localTime / duration;

    // Cinematic camera: slow majestic upward tilt and slight zoom
    const camZoom = 1.0 + progress * 0.08;
    const camY = Math.sin(progress * Math.PI * 0.5) * -50;

    ctx.save();
    ctx.translate(this.width * 0.5, this.height * 0.5);
    ctx.scale(camZoom, camZoom);
    ctx.translate(-this.width * 0.5, -this.height * 0.5 + camY);

    // 1. Traditional Kerala Palace background with god rays
    const sunIntensity = Math.min(1.0, localTime * 0.8);
    graphics.drawKeralaPalace(ctx, this.width, this.height, localTime, sunIntensity);

    // 2. King Mahabali emergence:
    // Walks gently into view from golden mist
    const appearProgress = Math.min(1.0, Math.max(0, (localTime - 1.2) / 3.0));
    const maveliOpacity = this.easeOutCubic(appearProgress);
    const maveliY = this.height * 0.58 + (1.0 - maveliOpacity) * 80;

    if (maveliOpacity > 0.01) {
      graphics.drawMahabali(ctx, this.width * 0.5, maveliY, 1.45, localTime, maveliOpacity);
    }

    // 3. Falling flower petals & golden shimmer
    particles.update(0.016, localTime);
    particles.render(ctx, localTime, 1.0, 1.0);

    ctx.restore();

    // 4. Cinematic Golden Typography: "THE KING IS COMING..."
    // Fade in text after 0.8s
    const textProgress = Math.min(1.0, Math.max(0, (localTime - 0.8) / 1.8));
    if (textProgress > 0) {
      const textAlpha = this.easeOutCubic(textProgress);
      const textY = this.height * 0.22 - (1 - textProgress) * 20;

      ctx.save();
      ctx.globalAlpha = textAlpha;

      // Malayalam subtitle
      this.drawGoldenText(ctx, "മഹാബലി തമ്പുരാന്റെ വരവ്", this.width * 0.5, textY - 60, 42, "Cinzel, Manjari, serif", 400);

      // Main English Headline
      this.drawGoldenText(ctx, "THE KING IS COMING...", this.width * 0.5, textY, 66, "Cinzel, serif", 800, true);

      // Decorative divider
      this.drawGoldenDivider(ctx, this.width * 0.5, textY + 45, 340);
      ctx.restore();
    }

    // Scene Crossfade transition out (last 0.8s)
    if (localTime > duration - 0.8) {
      const fadeOut = (localTime - (duration - 0.8)) / 0.8;
      ctx.fillStyle = `rgba(18, 5, 2, ${fadeOut})`;
      ctx.fillRect(0, 0, this.width, this.height);
    }
  }

  // ==========================================
  // SCENE 2: THE BEAUTIFUL POOKALAM (7.5s - 15.0s)
  // ==========================================
  renderScene2(ctx, localTime, graphics, particles) {
    const duration = 7.5;
    const progress = localTime / duration;

    // Cinematic camera: continuous gentle zoom and slow spiral rotation
    const camZoom = 0.95 + this.easeInOutQuad(progress) * 0.25;
    const camRot = Math.sin(progress * 1.5) * 0.06;

    // Rich festive temple courtyard floor
    const bgGrad = ctx.createRadialGradient(this.width * 0.5, this.height * 0.52, 100, this.width * 0.5, this.height * 0.52, 900);
    bgGrad.addColorStop(0, '#531908');
    bgGrad.addColorStop(0.5, '#380E04');
    bgGrad.addColorStop(1, '#1A0401');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.save();
    ctx.translate(this.width * 0.5, this.height * 0.52);
    ctx.scale(camZoom, camZoom);
    ctx.rotate(camRot);

    // Dynamic floral formation bloom: concentric rings expand outward smoothly
    const bloomProgress = Math.min(1.0, localTime / 3.2);
    const easedBloom = this.easeOutBack(Math.min(1.0, bloomProgress));
    const pookalamRot = localTime * 0.08;

    // Render procedural Pookalam at center
    graphics.drawPookalam(ctx, 0, 0, 480, easedBloom, pookalamRot, localTime);

    // Brass Nilavilakku on four diagonal corners casting warm light
    const cornerDist = 440;
    const corners = [
      { x: -cornerDist, y: -cornerDist },
      { x: cornerDist, y: -cornerDist },
      { x: -cornerDist, y: cornerDist },
      { x: cornerDist, y: cornerDist }
    ];
    corners.forEach(c => {
      graphics.drawNilavilakku(ctx, c.x, c.y + 60, 240, localTime, 0.65);
    });

    ctx.restore();

    // Floating festive flower petals & golden sparkles
    particles.update(0.016, localTime);
    particles.render(ctx, localTime, 1.2, 0.9);

    // Text Overlay: "A FESTIVAL OF FLOWERS, LOVE AND TOGETHERNESS"
    const textProgress = Math.min(1.0, Math.max(0, (localTime - 0.6) / 1.5));
    if (textProgress > 0) {
      const textAlpha = this.easeOutCubic(textProgress);
      const textY = this.height * 0.14 - (1 - textProgress) * 15;

      ctx.save();
      ctx.globalAlpha = textAlpha;

      this.drawGoldenText(ctx, "പൂക്കളവും സ്നേഹവും സമൃദ്ധിയും", this.width * 0.5, textY - 45, 38, "Cinzel, Manjari, serif", 400);
      this.drawGoldenText(ctx, "A FESTIVAL OF FLOWERS,", this.width * 0.5, textY + 15, 54, "Cinzel, serif", 800, true);
      this.drawGoldenText(ctx, "LOVE AND TOGETHERNESS", this.width * 0.5, textY + 75, 48, "Cinzel, serif", 700, true);

      this.drawGoldenDivider(ctx, this.width * 0.5, textY + 125, 420);
      ctx.restore();
    }

    // Scene Crossfade transition out
    if (localTime > duration - 0.8) {
      const fadeOut = (localTime - (duration - 0.8)) / 0.8;
      ctx.fillStyle = `rgba(18, 5, 2, ${fadeOut})`;
      ctx.fillRect(0, 0, this.width, this.height);
    }
  }

  // ==========================================
  // SCENE 3: THE SPIRIT OF KERALA (15.0s - 22.5s)
  // ==========================================
  renderScene3(ctx, localTime, graphics, particles) {
    const duration = 7.5;
    const progress = localTime / duration;

    // Background Palace Courtyard with warm ambient lighting
    graphics.drawKeralaPalace(ctx, this.width, this.height, localTime, 0.7);

    // Camera slow horizontal pan
    const camPanX = Math.sin(progress * Math.PI) * 25;

    ctx.save();
    ctx.translate(camPanX, 0);

    // 1. Lush Green Banana Leaves (Vazhayila) at base
    graphics.drawBananaLeaf(ctx, 40, this.height - 350, 460, 190, 0.22);
    graphics.drawBananaLeaf(ctx, this.width - 60, this.height - 320, 480, 200, Math.PI - 0.25);

    // 2. Brass Uruli with floating marigolds in center bottom
    graphics.drawUruli(ctx, this.width * 0.5, this.height - 230, 135, localTime);

    // 3. Majestic Tall Nilavilakku Lamps on left & right
    // Left Nilavilakku
    graphics.drawNilavilakku(ctx, 220, this.height - 380, 560, localTime, 1.15);
    // Right Nilavilakku
    graphics.drawNilavilakku(ctx, this.width - 220, this.height - 380, 560, localTime, 1.15);

    // Center hanging traditional brass bell (Mani)
    this.drawHangingTempleBell(ctx, this.width * 0.5, 180, localTime);

    ctx.restore();

    // Floating flower petals & golden sparkles
    particles.update(0.016, localTime);
    particles.render(ctx, localTime, 1.1, 1.3);

    // Text Overlay: "CELEBRATING THE BEAUTIFUL TRADITIONS OF KERALA."
    const textProgress = Math.min(1.0, Math.max(0, (localTime - 0.7) / 1.6));
    if (textProgress > 0) {
      const textAlpha = this.easeOutCubic(textProgress);
      const textY = this.height * 0.22 - (1 - textProgress) * 20;

      ctx.save();
      ctx.globalAlpha = textAlpha;

      this.drawGoldenText(ctx, "കേരളത്തിന്റെ തനത് പൈതൃകം", this.width * 0.5, textY - 50, 42, "Cinzel, Manjari, serif", 400);
      this.drawGoldenText(ctx, "CELEBRATING THE", this.width * 0.5, textY + 15, 52, "Cinzel, serif", 700, true);
      this.drawGoldenText(ctx, "BEAUTIFUL TRADITIONS", this.width * 0.5, textY + 75, 60, "Cinzel, serif", 800, true);
      this.drawGoldenText(ctx, "OF KERALA", this.width * 0.5, textY + 135, 54, "Cinzel, serif", 700, true);

      this.drawGoldenDivider(ctx, this.width * 0.5, textY + 185, 380);
      ctx.restore();
    }

    // Scene Crossfade transition out
    if (localTime > duration - 0.8) {
      const fadeOut = (localTime - (duration - 0.8)) / 0.8;
      ctx.fillStyle = `rgba(18, 5, 2, ${fadeOut})`;
      ctx.fillRect(0, 0, this.width, this.height);
    }
  }

  // ==========================================
  // SCENE 4: GRAND ONAM CELEBRATION (22.5s - 30.5s)
  // ==========================================
  renderScene4(ctx, localTime, graphics, particles) {
    const duration = 8.0;
    const progress = localTime / duration;

    // Palace background with radiant festival lighting
    graphics.drawKeralaPalace(ctx, this.width, this.height, localTime, 1.0);

    // Dynamic camera slow dolly back
    const camZoom = 1.06 - progress * 0.06;
    ctx.save();
    ctx.translate(this.width * 0.5, this.height * 0.5);
    ctx.scale(camZoom, camZoom);
    ctx.translate(-this.width * 0.5, -this.height * 0.5);

    // 1. Blooming Pookalam on the floor in perspective
    ctx.save();
    ctx.translate(this.width * 0.5, this.height - 240);
    ctx.scale(1.0, 0.45); // Floor perspective ellipse
    graphics.drawPookalam(ctx, 0, 0, 390, 1.0, localTime * 0.05, localTime);
    ctx.restore();

    // 2. King Mahabali standing beside / behind the magnificent Pookalam
    const maveliY = this.height * 0.57;
    graphics.drawMahabali(ctx, this.width * 0.5, maveliY, 1.35, localTime, 1.0);

    // 3. Two tall glowing Nilavilakku flanking Maveli and Pookalam
    graphics.drawNilavilakku(ctx, 150, this.height - 280, 520, localTime, 0.95);
    graphics.drawNilavilakku(ctx, this.width - 150, this.height - 280, 520, localTime, 0.95);

    ctx.restore();

    // Celebratory dense flower petal shower & golden glitter
    particles.update(0.016, localTime);
    particles.render(ctx, localTime, 1.5, 1.4);

    // Grand Animated Golden Typography: "HAPPY ONAM!"
    const textProgress = Math.min(1.0, Math.max(0, (localTime - 0.5) / 1.5));
    if (textProgress > 0) {
      const textAlpha = this.easeOutCubic(textProgress);
      const textScale = 0.8 + this.easeOutBack(textProgress) * 0.2;
      const textY = this.height * 0.16;

      ctx.save();
      ctx.globalAlpha = textAlpha;
      ctx.translate(this.width * 0.5, textY);
      ctx.scale(textScale, textScale);

      // Malayalam greeting
      this.drawGoldenText(ctx, "ഓണാശംസകൾ", 0, -45, 52, "Cinzel, Manjari, serif", 600);

      // English headline
      this.drawGoldenText(ctx, "HAPPY ONAM!", 0, 30, 92, "Cinzel, serif", 900, true);

      // Decorative golden motif
      this.drawGoldenDivider(ctx, 0, 85, 450);
      ctx.restore();
    }

    // Scene Crossfade transition out
    if (localTime > duration - 0.8) {
      const fadeOut = (localTime - (duration - 0.8)) / 0.8;
      ctx.fillStyle = `rgba(18, 5, 2, ${fadeOut})`;
      ctx.fillRect(0, 0, this.width, this.height);
    }
  }

  // ==========================================
  // SCENE 5: FINAL GREETING (30.5s - 38.0s)
  // ==========================================
  renderScene5(ctx, localTime, graphics, particles) {
    const duration = 7.5;
    const progress = localTime / duration;

    // Royal Deep Maroon & Golden Temple Backdrop
    const bgGrad = ctx.createRadialGradient(this.width * 0.5, this.height * 0.5, 100, this.width * 0.5, this.height * 0.5, 950);
    bgGrad.addColorStop(0, '#5A1507');
    bgGrad.addColorStop(0.4, '#380B04');
    bgGrad.addColorStop(0.85, '#200502');
    bgGrad.addColorStop(1, '#0F0201');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, this.width, this.height);

    // Subtle background concentric glowing Mandala watermark
    ctx.save();
    ctx.translate(this.width * 0.5, this.height * 0.5);
    ctx.globalAlpha = 0.18;
    graphics.drawPookalam(ctx, 0, 0, 520, 1.0, localTime * 0.04, localTime);
    ctx.restore();

    // Sacred Nilavilakku glowing in the center bottom
    graphics.drawNilavilakku(ctx, this.width * 0.5, this.height - 240, 480, localTime, 0.95);

    // King Mahabali silhouette / subtle golden halo watermark in upper background
    ctx.save();
    ctx.globalAlpha = 0.28;
    graphics.drawMahabali(ctx, this.width * 0.5, this.height * 0.38, 0.9, localTime, 0.4);
    ctx.restore();

    // Dense floating golden sparkles & falling flower petals
    particles.update(0.016, localTime);
    particles.render(ctx, localTime, 1.2, 1.6);

    // Ornate Royal Card Frame inner plaque
    const plaqueY = this.height * 0.42;
    this.drawRoyalPlaque(ctx, this.width * 0.5, plaqueY, 920, 680);

    // Text Animations inside Plaque
    const textProgress = Math.min(1.0, Math.max(0, (localTime - 0.6) / 1.8));
    if (textProgress > 0) {
      const textAlpha = this.easeOutCubic(textProgress);
      ctx.save();
      ctx.globalAlpha = textAlpha;

      // 1. Malayalam Royal Greeting
      // "ഹൃദയം നിറഞ്ഞ ഓണാശംസകൾ!"
      this.drawGoldenText(ctx, "ഹൃദയം നിറഞ്ഞ", this.width * 0.5, plaqueY - 210, 46, "Cinzel, Manjari, serif", 500);
      this.drawGoldenText(ctx, "ഓണാശംസകൾ!", this.width * 0.5, plaqueY - 140, 64, "Cinzel, Manjari, serif", 800, true);

      this.drawGoldenDivider(ctx, this.width * 0.5, plaqueY - 80, 440);

      // 2. English Greeting: "HAPPY ONAM!"
      this.drawGoldenText(ctx, "HAPPY ONAM!", this.width * 0.5, plaqueY - 10, 84, "Cinzel, serif", 900, true);

      // 3. Auspicious Blessing Paragraph:
      // "May this Onam bring happiness, prosperity, peace and togetherness to every home."
      const blessingLines = [
        "May this auspicious festival of Onam bring",
        "boundless happiness, good health, prosperity,",
        "peace and togetherness to you and your loved ones."
      ];

      blessingLines.forEach((line, idx) => {
        this.drawGoldenText(ctx, line, this.width * 0.5, plaqueY + 95 + idx * 42, 32, "Cormorant Garamond, serif", 500);
      });

      // Bottom Malayalam tagline: "ഐശ്വര്യവും സമൃദ്ധിയും നിറഞ്ഞ തിരുവോണം"
      this.drawGoldenText(ctx, "ഐശ്വര്യവും സമൃദ്ധിയും നിറഞ്ഞ തിരുവോണം", this.width * 0.5, plaqueY + 245, 34, "Cinzel, Manjari, serif", 600);

      ctx.restore();
    }
  }

  // --- TEMPLE BELL ---
  drawHangingTempleBell(ctx, bx, by, time) {
    ctx.save();
    ctx.translate(bx, by);

    const sway = Math.sin(time * 3.0) * 0.08;
    ctx.rotate(sway);

    // Brass chain from ceiling
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, -180);
    ctx.lineTo(0, 0);
    ctx.stroke();

    // Bell body
    const bellGrad = ctx.createLinearGradient(-35, 0, 35, 0);
    bellGrad.addColorStop(0, '#996515');
    bellGrad.addColorStop(0.3, '#FFEAA7');
    bellGrad.addColorStop(0.7, '#D4AF37');
    bellGrad.addColorStop(1, '#805300');

    ctx.fillStyle = bellGrad;
    ctx.strokeStyle = '#FFEAA7';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(-15, 0);
    ctx.quadraticCurveTo(-20, 40, -45, 80);
    ctx.lineTo(45, 80);
    ctx.quadraticCurveTo(20, 40, 15, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Bell rim lip
    ctx.beginPath();
    ctx.ellipse(0, 80, 48, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Clapper (Tongue)
    ctx.beginPath();
    ctx.arc(Math.sin(time * 3.5) * 8, 96, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#FFEAA7';
    ctx.fill();

    ctx.restore();
  }

  // --- ROYAL PLAQUE ---
  drawRoyalPlaque(ctx, cx, cy, w, h) {
    ctx.save();
    ctx.translate(cx, cy);

    // Glassmorphic translucent royal backing
    ctx.fillStyle = 'rgba(28, 8, 4, 0.75)';
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 3.5;

    ctx.beginPath();
    ctx.roundRect(-w * 0.5, -h * 0.5, w, h, 24);
    ctx.fill();
    ctx.stroke();

    // Inner subtle gold wire border
    ctx.strokeStyle = 'rgba(255, 235, 120, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(-w * 0.5 + 14, -h * 0.5 + 14, w - 28, h - 28, 18);
    ctx.stroke();

    // Corner ornate accents
    const corners = [
      { x: -w * 0.5 + 14, y: -h * 0.5 + 14 },
      { x: w * 0.5 - 14, y: -h * 0.5 + 14 },
      { x: -w * 0.5 + 14, y: h * 0.5 - 14 },
      { x: w * 0.5 - 14, y: h * 0.5 - 14 }
    ];

    corners.forEach(c => {
      ctx.beginPath();
      ctx.arc(c.x, c.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#C0392B';
      ctx.fill();
      ctx.strokeStyle = '#FFEAA7';
      ctx.stroke();
    });

    ctx.restore();
  }

  // --- GOLDEN TEXT RENDERER ---
  drawGoldenText(ctx, text, x, y, size, fontFamily = "Cinzel, serif", weight = 700, addGleam = false) {
    ctx.save();
    ctx.font = `${weight} ${size}px ${fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // 1. Deep drop shadow for cinematic depth
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillText(text, x + 3, y + 4);

    // 2. Golden ambient outer glow
    ctx.shadowColor = 'rgba(255, 215, 0, 0.65)';
    ctx.shadowBlur = addGleam ? 24 : 12;

    // 3. Luxurious metallic gold gradient
    const textGrad = ctx.createLinearGradient(0, y - size * 0.5, 0, y + size * 0.5);
    textGrad.addColorStop(0, '#FFE895');
    textGrad.addColorStop(0.3, '#FFF7CC');
    textGrad.addColorStop(0.55, '#D4AF37');
    textGrad.addColorStop(0.85, '#AA771C');
    textGrad.addColorStop(1, '#664608');

    ctx.fillStyle = textGrad;
    ctx.fillText(text, x, y);

    // Fine gold outline for crisp contrast
    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(255, 245, 180, 0.45)';
    ctx.lineWidth = 1.2;
    ctx.strokeText(text, x, y);

    ctx.restore();
  }

  // --- GOLDEN DIVIDER MOTIF ---
  drawGoldenDivider(ctx, cx, cy, width) {
    ctx.save();
    ctx.translate(cx, cy);

    const grad = ctx.createLinearGradient(-width * 0.5, 0, width * 0.5, 0);
    grad.addColorStop(0, 'rgba(212, 175, 55, 0)');
    grad.addColorStop(0.3, 'rgba(212, 175, 55, 0.8)');
    grad.addColorStop(0.5, 'rgba(255, 245, 180, 1.0)');
    grad.addColorStop(0.7, 'rgba(212, 175, 55, 0.8)');
    grad.addColorStop(1, 'rgba(212, 175, 55, 0)');

    ctx.strokeStyle = grad;
    ctx.lineWidth = 2.5;

    ctx.beginPath();
    ctx.moveTo(-width * 0.5, 0);
    ctx.lineTo(width * 0.5, 0);
    ctx.stroke();

    // Central diamond / lotus crest
    ctx.beginPath();
    ctx.moveTo(0, -9);
    ctx.lineTo(12, 0);
    ctx.lineTo(0, 9);
    ctx.lineTo(-12, 0);
    ctx.closePath();
    ctx.fillStyle = '#C0392B';
    ctx.fill();
    ctx.strokeStyle = '#FFEAA7';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Flanking dots
    [-30, 30].forEach(dx => {
      ctx.beginPath();
      ctx.arc(dx, 0, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#FFEAA7';
      ctx.fill();
    });

    ctx.restore();
  }
}

// Global instance
window.sceneOrchestrator = new SceneOrchestrator(1080, 1920);

