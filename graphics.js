/**
 * Onam-Greeting-2027 Visual Graphics Engine
 * High-definition vector and procedural rendering routines for:
 * - Kerala Palace Architecture (Nalukettu roofs, carved teak pillars, terracotta tiles)
 * - King Mahabali (Maveli) in royal attire with golden Kireedam, Olakkuda, Kasavu mundu
 * - The Magnificent Athapookalam (Dynamic procedural concentric floral mandala)
 * - Nilavilakku (Traditional multi-tier brass oil lamps with live flickering flames)
 * - Banana Leaf (Vazhayila) & Uruli with floating petals
 * - Kerala Kasavu Gold Zari borders and temple arch motifs
 */

class KeralaGraphics {
  constructor() {
    this.cachedCanvas = {};
    
    // 1. Cute Cartoon King Mahabali asset
    this.maveliImg = new Image();
    this.maveliLoaded = false;
    this.maveliImg.onload = () => {
      this.maveliLoaded = true;
    };
    const srcData = (typeof window !== 'undefined' && window.MAVELI_CUTE_IMAGE_DATA) ? window.MAVELI_CUTE_IMAGE_DATA : 'maveli.png';
    this.maveliImg.src = srcData;
    if (this.maveliImg.complete && this.maveliImg.naturalWidth > 0) {
      this.maveliLoaded = true;
    }

    // 2. Authentic Kerala Athapookalam asset
    this.pookalamImg = new Image();
    this.pookalamLoaded = false;
    this.pookalamImg.onload = () => {
      this.pookalamLoaded = true;
    };
    const pookalamSrc = (typeof window !== 'undefined' && window.POOKALAM_IMAGE_DATA) ? window.POOKALAM_IMAGE_DATA : 'pookalam.png';
    this.pookalamImg.src = pookalamSrc;
    if (this.pookalamImg.complete && this.pookalamImg.naturalWidth > 0) {
      this.pookalamLoaded = true;
    }
  }

  // --- KASAVU ROYAL BORDER ---
  drawKasavuBorder(ctx, width, height, progress = 1.0) {
    ctx.save();
    const borderWidth = 32;
    const innerMargin = 20;

    // Outer rich golden stroke
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 4;
    ctx.strokeRect(innerMargin, innerMargin, width - innerMargin * 2, height - innerMargin * 2);

    // Kasavu cream background strip
    ctx.strokeStyle = '#FAF4E6';
    ctx.lineWidth = 14;
    ctx.strokeRect(innerMargin + 8, innerMargin + 8, width - (innerMargin + 8) * 2, height - (innerMargin + 8) * 2);

    // Golden Zari chevron weave pattern
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 3;
    ctx.strokeRect(innerMargin + 16, innerMargin + 16, width - (innerMargin + 16) * 2, height - (innerMargin + 16) * 2);

    // Four ornate corner motifs (Kerala Temple Gopuram / Lotus spikes)
    const corners = [
      { x: innerMargin, y: innerMargin, rot: 0 },
      { x: width - innerMargin, y: innerMargin, rot: Math.PI / 2 },
      { x: width - innerMargin, y: height - innerMargin, rot: Math.PI },
      { x: innerMargin, y: height - innerMargin, rot: -Math.PI / 2 }
    ];

    corners.forEach(c => {
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate(c.rot);
      this.drawCornerFiligree(ctx);
      ctx.restore();
    });

    ctx.restore();
  }

  drawCornerFiligree(ctx) {
    ctx.save();
    ctx.fillStyle = '#C8961D';
    ctx.strokeStyle = '#FAD02C';
    ctx.lineWidth = 2.5;

    // Corner ornate fan/lotus bracket
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(60, 0);
    ctx.bezierCurveTo(45, 15, 15, 45, 0, 60);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Inner golden ring accent
    ctx.beginPath();
    ctx.arc(28, 28, 12, 0, Math.PI * 2);
    ctx.fillStyle = '#8B0000'; // Deep crimson gem
    ctx.fill();
    ctx.stroke();

    // Small golden pearl
    ctx.beginPath();
    ctx.arc(28, 28, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#FFE680';
    ctx.fill();

    ctx.restore();
  }

  // --- KERALA PALACE ARCHITECTURE ---
  drawKeralaPalace(ctx, width, height, time, sunIntensity = 1.0) {
    ctx.save();

    // 1. Warm royal temple morning gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
    skyGrad.addColorStop(0, '#3A0808'); // Deep maroon
    skyGrad.addColorStop(0.3, '#741B08'); // Warm terracotta
    skyGrad.addColorStop(0.65, '#9C3A0C'); // Golden amber
    skyGrad.addColorStop(1, '#2E0C04'); // Dark royal teak base
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Volumetric God Rays (Morning golden temple sunbeams)
    if (sunIntensity > 0) {
      ctx.save();
      ctx.globalAlpha = 0.22 * sunIntensity;
      const rayGrad = ctx.createRadialGradient(width * 0.5, -100, 50, width * 0.5, 900, 1100);
      rayGrad.addColorStop(0, '#FFEAA7');
      rayGrad.addColorStop(0.4, '#FDBB2D');
      rayGrad.addColorStop(1, 'rgba(253, 187, 45, 0)');
      ctx.fillStyle = rayGrad;

      for (let i = -6; i <= 6; i++) {
        const angle = (i * 0.08) + Math.sin(time * 0.5 + i) * 0.015;
        ctx.beginPath();
        ctx.moveTo(width * 0.5, -50);
        const spread = 220 + Math.sin(time * 0.8 + i) * 30;
        ctx.lineTo(width * 0.5 + Math.tan(angle - 0.04) * height, height);
        ctx.lineTo(width * 0.5 + Math.tan(angle + 0.04) * height, height);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    }

    // 3. Palace Sloped Roof (Padmanabhapuram / Nalukettu style)
    const roofY = 160;
    // Upper ornate beam
    ctx.fillStyle = '#1A0803';
    ctx.fillRect(0, roofY, width, 45);

    // Terracotta roof gradient
    const roofGrad = ctx.createLinearGradient(0, 0, 0, roofY);
    roofGrad.addColorStop(0, '#421208');
    roofGrad.addColorStop(0.6, '#7F2811');
    roofGrad.addColorStop(1, '#2D0A03');
    ctx.fillStyle = roofGrad;

    ctx.beginPath();
    ctx.moveTo(0, roofY);
    ctx.lineTo(width * 0.5, 30);
    ctx.lineTo(width, roofY);
    ctx.closePath();
    ctx.fill();

    // Terracotta roof tile ridges (angled Mangalore style rafters)
    ctx.strokeStyle = 'rgba(255, 180, 100, 0.2)';
    ctx.lineWidth = 3;
    for (let x = 60; x < width; x += 35) {
      ctx.beginPath();
      ctx.moveTo(x, roofY);
      ctx.lineTo(width * 0.5 + (x - width * 0.5) * 0.25, 30);
      ctx.stroke();
    }

    // Golden Thazhikakkudam (Royal temple spire / Kalasam) at apex
    this.drawThazhikakkudam(ctx, width * 0.5, 30);

    // Carved wooden eave brackets (Poomukham mukham)
    ctx.fillStyle = '#5A1E06';
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 2;
    for (let x = 30; x < width; x += 70) {
      ctx.beginPath();
      ctx.moveTo(x - 20, roofY);
      ctx.lineTo(x + 20, roofY);
      ctx.lineTo(x, roofY + 30);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // Hanging festive Marigold & Mango leaf Toran (floral garlands across roof)
    this.drawFloralToran(ctx, 0, width, roofY + 32, time);

    // 4. Carved Teak Wooden Pillars (Left and Right majestic columns)
    const pillarWidth = 110;
    this.drawCarvedPillar(ctx, 50, roofY + 40, pillarWidth, height - roofY - 260);
    this.drawCarvedPillar(ctx, width - 50 - pillarWidth, roofY + 40, pillarWidth, height - roofY - 260);

    // 5. Polished Terracotta Courtyard Floor
    const floorY = height - 320;
    const floorGrad = ctx.createLinearGradient(0, floorY, 0, height);
    floorGrad.addColorStop(0, '#4A1508');
    floorGrad.addColorStop(0.4, '#6A210C');
    floorGrad.addColorStop(0.85, '#2A0904');
    floorGrad.addColorStop(1, '#150301');
    ctx.fillStyle = floorGrad;
    ctx.fillRect(0, floorY, width, height - floorY);

    // Floor stone perspective joints
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.18)';
    ctx.lineWidth = 2;
    for (let x = -width; x < width * 2; x += 180) {
      ctx.beginPath();
      ctx.moveTo(width * 0.5 + (x - width * 0.5) * 0.2, floorY);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = floorY + 30; y < height; y += 45) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Warm golden ambient reflection on floor
    const glowGrad = ctx.createRadialGradient(width * 0.5, floorY + 120, 20, width * 0.5, floorY + 120, 480);
    glowGrad.addColorStop(0, 'rgba(255, 190, 60, 0.28)');
    glowGrad.addColorStop(0.6, 'rgba(212, 175, 55, 0.1)');
    glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, floorY, width, height - floorY);

    ctx.restore();
  }

  // Golden Kalasam / Thazhikakkudam
  drawThazhikakkudam(ctx, cx, cy) {
    ctx.save();
    ctx.translate(cx, cy);

    // Multi-tier golden stupi
    const goldGrad = ctx.createLinearGradient(-15, 0, 15, 0);
    goldGrad.addColorStop(0, '#B38728');
    goldGrad.addColorStop(0.3, '#FBF5B7');
    goldGrad.addColorStop(0.6, '#DAA520');
    goldGrad.addColorStop(1, '#AA771C');

    ctx.fillStyle = goldGrad;
    ctx.strokeStyle = '#FFEAA7';
    ctx.lineWidth = 1.5;

    // Base tier
    ctx.beginPath();
    ctx.ellipse(0, 5, 24, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Middle pot (Kumbha)
    ctx.beginPath();
    ctx.arc(0, -12, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Upper inverted cone & pinnacle needle
    ctx.beginPath();
    ctx.moveTo(-10, -26);
    ctx.lineTo(10, -26);
    ctx.lineTo(0, -55);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Pinnacle aura
    ctx.beginPath();
    ctx.arc(0, -55, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#FFF8DC';
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 15;
    ctx.fill();

    ctx.restore();
  }

  // Carved Teak Wooden Pillar
  drawCarvedPillar(ctx, x, y, w, h) {
    ctx.save();
    // Pillar wood gradient
    const woodGrad = ctx.createLinearGradient(x, 0, x + w, 0);
    woodGrad.addColorStop(0, '#1E0A04');
    woodGrad.addColorStop(0.2, '#4E200C');
    woodGrad.addColorStop(0.5, '#7A3515');
    woodGrad.addColorStop(0.8, '#4E200C');
    woodGrad.addColorStop(1, '#1A0602');

    ctx.fillStyle = woodGrad;
    ctx.fillRect(x, y + 50, w, h - 80);

    // Carved capital (Bodika / Lotus brackets at top)
    ctx.fillStyle = '#5C2209';
    ctx.strokeStyle = '#DAA520';
    ctx.lineWidth = 2.5;

    // Top capital block
    ctx.fillRect(x - 20, y, w + 40, 30);
    ctx.strokeRect(x - 20, y, w + 40, 30);

    // Stepped brackets
    ctx.beginPath();
    ctx.moveTo(x - 25, y + 30);
    ctx.lineTo(x + w + 25, y + 30);
    ctx.lineTo(x + w, y + 55);
    ctx.lineTo(x, y + 55);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Pillar carvings (fluting / ring bands)
    for (let py = y + 90; py < y + h - 100; py += 120) {
      // Golden brass ring band around pillar
      const ringGrad = ctx.createLinearGradient(x, 0, x + w, 0);
      ringGrad.addColorStop(0, '#996515');
      ringGrad.addColorStop(0.5, '#FDE08B');
      ringGrad.addColorStop(1, '#805300');
      ctx.fillStyle = ringGrad;
      ctx.fillRect(x - 4, py, w + 8, 14);

      // Lotus carved motif inside band
      ctx.beginPath();
      ctx.arc(x + w * 0.5, py + 7, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#8B0000';
      ctx.fill();
    }

    // Carved Pillar Base
    ctx.fillStyle = '#421606';
    ctx.fillRect(x - 15, y + h - 50, w + 30, 35);
    ctx.strokeRect(x - 15, y + h - 50, w + 30, 35);
    ctx.fillRect(x - 25, y + h - 15, w + 50, 25);
    ctx.strokeRect(x - 25, y + h - 15, w + 50, 25);

    ctx.restore();
  }

  // Hanging Floral Toran (Marigold & Mango leaves)
  drawFloralToran(ctx, x1, x2, y, time) {
    ctx.save();
    const span = x2 - x1;
    const garlands = 10;
    const garlandWidth = span / garlands;

    for (let i = 0; i < garlands; i++) {
      const gx = x1 + i * garlandWidth;
      const sway = Math.sin(time * 2 + i * 0.7) * 3;

      ctx.beginPath();
      ctx.moveTo(gx, y);
      ctx.quadraticCurveTo(gx + garlandWidth * 0.5, y + 40 + sway, gx + garlandWidth, y);
      ctx.strokeStyle = '#1D5C19'; // Mango leaf stem
      ctx.lineWidth = 4;
      ctx.stroke();

      // Hanging marigolds along curve
      for (let s = 0.15; s <= 0.85; s += 0.22) {
        const mx = gx + garlandWidth * s;
        const my = y + Math.sin(s * Math.PI) * (40 + sway);

        // Bright marigold flower
        ctx.beginPath();
        ctx.arc(mx, my, 8, 0, Math.PI * 2);
        ctx.fillStyle = (i % 2 === 0) ? '#FFA500' : '#FFD700';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(mx, my, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#D63031';
        ctx.fill();
      }

      // Hanging Mango leaf at center of loop
      const midX = gx + garlandWidth * 0.5;
      const midY = y + 40 + sway;
      ctx.beginPath();
      ctx.moveTo(midX, midY);
      ctx.quadraticCurveTo(midX + 7, midY + 18, midX, midY + 32);
      ctx.quadraticCurveTo(midX - 7, midY + 18, midX, midY);
      ctx.fillStyle = '#27ae60';
      ctx.fill();
    }

    ctx.restore();
  }

  // --- CUTE CARTOON KING MAHABALI (MAVELI) ---
  // Renders the lovable 3D cartoon Mahabali with welcoming open arms, golden crown,
  // royal ornaments, divine halo, traditional Olakkuda, and gentle breathing sway
  drawMahabali(ctx, cx, cy, scale = 1.0, time = 0, opacity = 1.0) {
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);

    // Subtle gentle breathing and joyful greeting sway
    const breath = Math.sin(time * 2.2) * 5;
    const sway = Math.sin(time * 1.6) * 0.02;

    // 1. Soft Elliptical Floor Shadow under Maveli's feet
    ctx.save();
    const shadowGrad = ctx.createRadialGradient(0, 275, 10, 0, 275, 190);
    shadowGrad.addColorStop(0, 'rgba(12, 3, 2, 0.58)');
    shadowGrad.addColorStop(0.5, 'rgba(12, 3, 2, 0.28)');
    shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = shadowGrad;
    ctx.beginPath();
    ctx.ellipse(0, 275, 185, 38, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 2. Divine Golden Aura (Prabhamandalam) behind Cute Mahabali
    const auraGrad = ctx.createRadialGradient(0, -120, 30, 0, -120, 420);
    auraGrad.addColorStop(0, 'rgba(255, 235, 120, 0.7)');
    auraGrad.addColorStop(0.35, 'rgba(255, 180, 40, 0.38)');
    auraGrad.addColorStop(0.7, 'rgba(218, 165, 32, 0.16)');
    auraGrad.addColorStop(1, 'rgba(218, 165, 32, 0)');
    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(0, -120, 420, 0, Math.PI * 2);
    ctx.fill();

    // Rotating radiant sun halo spikes around head
    ctx.save();
    ctx.translate(0, -120);
    ctx.rotate(time * 0.16);
    ctx.strokeStyle = 'rgba(255, 220, 80, 0.35)';
    ctx.lineWidth = 3;
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 12) {
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * 130, Math.sin(a) * 130);
      ctx.lineTo(Math.cos(a) * 200, Math.sin(a) * 200);
      ctx.stroke();
    }
    ctx.restore();

    // 3. Olakkuda (Traditional Palm Leaf Royal Umbrella) placed beside him
    this.drawOlakkuda(ctx, 220, -250 + breath * 0.4, 1.15, time);

    // 4. Render the Cute Cartoon Maveli
    ctx.save();
    ctx.translate(0, breath);
    ctx.rotate(sway);

    if (this.maveliImg && (this.maveliLoaded || (this.maveliImg.complete && this.maveliImg.naturalWidth > 0))) {
      // Natural 3D cute cartoon aspect ratio
      const renderW = 550;
      const naturalAspect = (this.maveliImg.naturalHeight || 405) / (this.maveliImg.naturalWidth || 387);
      const renderH = renderW * naturalAspect;
      const renderX = -renderW * 0.5;
      const renderY = -renderH * 0.53; // Aligns waist to (0, 0) and feet to floor ~270

      // Warm celestial bloom
      ctx.shadowColor = '#FFD700';
      ctx.shadowBlur = 18;
      ctx.drawImage(this.maveliImg, renderX, renderY, renderW, renderH);
      ctx.shadowBlur = 0;
    }
    ctx.restore();

    ctx.restore();
  }

  // Golden Kireedam (Traditional Kerala Royal Crown)
  drawGoldenKireedam(ctx, cx, cy) {
    ctx.save();
    ctx.translate(cx, cy);

    const goldGrad = ctx.createLinearGradient(-80, 0, 80, 0);
    goldGrad.addColorStop(0, '#B8860B');
    goldGrad.addColorStop(0.25, '#FFD700');
    goldGrad.addColorStop(0.5, '#FFF8DC');
    goldGrad.addColorStop(0.75, '#FFD700');
    goldGrad.addColorStop(1, '#996515');

    ctx.fillStyle = goldGrad;
    ctx.strokeStyle = '#FFEAA7';
    ctx.lineWidth = 2.5;

    // Crown Base band
    ctx.beginPath();
    ctx.roundRect(-65, -5, 130, 24, [4, 4, 8, 8]);
    ctx.fill();
    ctx.stroke();

    // Ruby & Emerald studs on headband
    for (let rx = -50; rx <= 50; rx += 20) {
      ctx.beginPath();
      ctx.arc(rx, 7, 5, 0, Math.PI * 2);
      ctx.fillStyle = (rx % 40 === 0) ? '#D63031' : '#00B894';
      ctx.fill();
      ctx.stroke();
    }

    // Tier 1 Crown Body
    ctx.beginPath();
    ctx.moveTo(-60, -5);
    ctx.lineTo(-45, -50);
    ctx.lineTo(45, -50);
    ctx.lineTo(60, -5);
    ctx.closePath();
    ctx.fillStyle = goldGrad;
    ctx.fill();
    ctx.stroke();

    // Tier 2 Curved Temple Gopuram dome
    ctx.beginPath();
    ctx.moveTo(-45, -50);
    ctx.quadraticCurveTo(-35, -95, 0, -125);
    ctx.quadraticCurveTo(35, -95, 45, -50);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Central ruby emblem
    ctx.beginPath();
    ctx.arc(0, -65, 12, 0, Math.PI * 2);
    ctx.fillStyle = '#C0392B';
    ctx.fill();
    ctx.strokeStyle = '#FFD700';
    ctx.stroke();

    // Crown Pinnacle jewel (Kalasam)
    ctx.beginPath();
    ctx.arc(0, -128, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#FFF8DC';
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 12;
    ctx.fill();

    // Side ear-protector wings (Chevippoovukal)
    [-75, 75].forEach(sideX => {
      ctx.beginPath();
      ctx.ellipse(sideX, 5, 18, 14, 0, 0, Math.PI * 2);
      ctx.fillStyle = goldGrad;
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(sideX, 5, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#D63031';
      ctx.fill();
    });

    ctx.restore();
  }

  // Mahabali Face & Features
  drawMahabaliHead(ctx, cx, cy, time) {
    ctx.save();
    ctx.translate(cx, cy);

    // Face skin tone
    const faceGrad = ctx.createRadialGradient(0, 0, 15, 0, 5, 65);
    faceGrad.addColorStop(0, '#F7C999');
    faceGrad.addColorStop(0.75, '#DA9A63');
    faceGrad.addColorStop(1, '#B67540');

    ctx.fillStyle = faceGrad;
    ctx.beginPath();
    ctx.ellipse(0, 0, 52, 58, 0, 0, Math.PI * 2);
    ctx.fill();

    // Chandanam (Sandalwood) and Kumkumam Thilak on forehead
    ctx.fillStyle = '#FFF8DC';
    ctx.beginPath();
    ctx.ellipse(0, -24, 18, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#C0392B';
    ctx.beginPath();
    ctx.arc(0, -24, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // Eyes with kind, warm, welcoming gaze
    [-18, 18].forEach(ex => {
      // Sclera
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.ellipse(ex, -6, 10, 5.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Iris (warm deep brown)
      ctx.fillStyle = '#2C1810';
      ctx.beginPath();
      ctx.arc(ex, -6, 5, 0, Math.PI * 2);
      ctx.fill();

      // Eye highlight
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(ex - 1.5, -7.5, 2, 0, Math.PI * 2);
      ctx.fill();

      // Regal arching eyebrow
      ctx.strokeStyle = '#1F140E';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(ex, -15, 12, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();
    });

    // Traditional Nose
    ctx.strokeStyle = '#965524';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, -18);
    ctx.lineTo(2, 6);
    ctx.quadraticCurveTo(0, 12, -4, 11);
    ctx.stroke();

    // Benevolent Smiling Mouth & Royal Mustache (Meesha)
    // Full majestic Kerala curved mustache
    ctx.fillStyle = '#1A110B';
    ctx.beginPath();
    ctx.moveTo(0, 13);
    ctx.quadraticCurveTo(-22, 10, -42, 17);
    ctx.quadraticCurveTo(-48, 14, -38, 8);
    ctx.quadraticCurveTo(-18, 9, 0, 15);
    ctx.quadraticCurveTo(18, 9, 38, 8);
    ctx.quadraticCurveTo(48, 14, 42, 17);
    ctx.quadraticCurveTo(22, 10, 0, 13);
    ctx.closePath();
    ctx.fill();

    // Gentle pleasant smile beneath
    ctx.strokeStyle = '#8E1717';
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    ctx.arc(0, 16, 14, 0.2, Math.PI - 0.2);
    ctx.stroke();

    // Royal Kundalas (Golden earrings) with pearl drops
    [-52, 52].forEach(kx => {
      ctx.fillStyle = '#FFD700';
      ctx.strokeStyle = '#B8860B';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(kx, 8, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Pearl drop
      ctx.beginPath();
      ctx.arc(kx, 22, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#FFF8DC';
      ctx.fill();
    });

    ctx.restore();
  }

  // Olakkuda (Traditional Kerala Palm Leaf Royal Umbrella)
  drawOlakkuda(ctx, ox, oy, scale = 1.0, time = 0) {
    ctx.save();
    ctx.translate(ox, oy);
    ctx.scale(scale, scale);

    const gentleBob = Math.sin(time * 1.5) * 4;
    ctx.translate(0, gentleBob);

    // Carved wooden shaft
    ctx.strokeStyle = '#4A2511';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(0, -60);
    ctx.lineTo(-45, 360);
    ctx.stroke();

    // Umbrella Canopy (woven golden-tan dried palm frond layers)
    const umbrellaGrad = ctx.createRadialGradient(0, -100, 20, 0, -80, 160);
    umbrellaGrad.addColorStop(0, '#DFC285');
    umbrellaGrad.addColorStop(0.5, '#C6A15B');
    umbrellaGrad.addColorStop(1, '#8C6826');

    ctx.fillStyle = umbrellaGrad;
    ctx.strokeStyle = '#5E4211';
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.arc(0, -80, 150, Math.PI * 1.08, Math.PI * 1.92);
    ctx.quadraticCurveTo(0, -40, -145, -45);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Bamboo radial rib spokes
    ctx.strokeStyle = 'rgba(74, 37, 17, 0.45)';
    ctx.lineWidth = 2;
    for (let angle = Math.PI * 1.12; angle < Math.PI * 1.88; angle += 0.12) {
      ctx.beginPath();
      ctx.moveTo(0, -80);
      ctx.lineTo(Math.cos(angle) * 150, -80 + Math.sin(angle) * 150);
      ctx.stroke();
    }

    // Golden decorative rim and top brass finial
    ctx.beginPath();
    ctx.arc(0, -145, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#FFD700';
    ctx.fill();
    ctx.strokeStyle = '#DAA520';
    ctx.stroke();

    ctx.restore();
  }

  // Welcoming Blessing Hand (Varada Mudra)
  drawWelcomingHand(ctx, hx, hy, wave = 0) {
    ctx.save();
    ctx.translate(hx, hy);
    ctx.rotate(wave);

    // Forearm
    const armGrad = ctx.createLinearGradient(0, -50, 0, 50);
    armGrad.addColorStop(0, '#D7975D');
    armGrad.addColorStop(1, '#F5C28E');

    ctx.fillStyle = armGrad;
    ctx.beginPath();
    ctx.ellipse(0, 0, 24, 45, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // Golden Vanki / Bangle (Kappu) at wrist
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(-18, 22, 36, 12);
    ctx.strokeRect(-18, 22, 36, 12);

    // Open welcoming palm with Henna / Chandanam dot
    ctx.beginPath();
    ctx.ellipse(0, 48, 16, 22, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#F5C28E';
    ctx.fill();

    // Red auspicious dot on palm
    ctx.beginPath();
    ctx.arc(0, 48, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#C0392B';
    ctx.fill();

    ctx.restore();
  }

  // Left arm holding umbrella
  drawHoldingArm(ctx, hx, hy) {
    ctx.save();
    ctx.translate(hx, hy);

    ctx.fillStyle = '#D7975D';
    ctx.beginPath();
    ctx.ellipse(0, 0, 22, 42, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Golden wrist bangle
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(-16, 20, 32, 10);
    ctx.strokeRect(-16, 20, 32, 10);

    // Closed hand gripping umbrella shaft
    ctx.beginPath();
    ctx.arc(4, 34, 14, 0, Math.PI * 2);
    ctx.fillStyle = '#F5C28E';
    ctx.fill();

    ctx.restore();
  }

  // Royal Golden Belt (Oddiyanam)
  drawGoldenBelt(ctx, bx, by) {
    ctx.save();
    ctx.translate(bx, by);

    const beltGrad = ctx.createLinearGradient(-100, 0, 100, 0);
    beltGrad.addColorStop(0, '#AA771C');
    beltGrad.addColorStop(0.5, '#FFEAA7');
    beltGrad.addColorStop(1, '#AA771C');

    ctx.fillStyle = beltGrad;
    ctx.strokeStyle = '#805300';
    ctx.lineWidth = 2.5;

    ctx.beginPath();
    ctx.roundRect(-90, -12, 180, 24, 6);
    ctx.fill();
    ctx.stroke();

    // Central Lion/Kirtimukha royal buckle
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.fillStyle = '#D63031';
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#FFD700';
    ctx.fill();

    ctx.restore();
  }

  // Royal Necklaces
  drawRoyalNecklaces(ctx, nx, ny) {
    ctx.save();
    ctx.translate(nx, ny);

    // Kasumala (strand 1)
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, 48, 0.25, Math.PI - 0.25);
    ctx.stroke();

    for (let a = 0.35; a < Math.PI - 0.35; a += 0.2) {
      const kx = Math.cos(a) * 48;
      const ky = Math.sin(a) * 48;
      ctx.beginPath();
      ctx.arc(kx, ky, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = '#FFDF6D';
      ctx.fill();
    }

    // Mullamottu mala (outer long garland strand 2)
    ctx.beginPath();
    ctx.arc(0, 10, 70, 0.3, Math.PI - 0.3);
    ctx.stroke();

    // Central Green/Ruby Pendant (Nagapadam)
    ctx.beginPath();
    ctx.arc(0, 80, 11, 0, Math.PI * 2);
    ctx.fillStyle = '#00B894';
    ctx.fill();
    ctx.strokeStyle = '#FFEAA7';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
  }

  drawRoyalFeet(ctx, fx, fy) {
    ctx.save();
    ctx.translate(fx, fy);

    // Foot base
    ctx.fillStyle = '#F5C28E';
    ctx.beginPath();
    ctx.ellipse(0, 10, 22, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Golden anklet (Kappu)
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(-18, 0, 36, 7);

    ctx.restore();
  }

  // --- THE MAGNIFICENT ATHAPOOKALAM ---
  // Renders the authentic Kerala Athapookalam with dynamic bloom expansion,
  // camera rotation, warm ambient glow, and center ceremonial brass oil flame
  drawPookalam(ctx, cx, cy, maxRadius = 380, bloom = 1.0, rot = 0, time = 0) {
    if (bloom <= 0.01) return;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);

    const radius = maxRadius * bloom;

    // 1. Soft sacred cow dung/clay base shadow under Pookalam
    ctx.beginPath();
    ctx.arc(0, 0, radius + 14, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(15, 5, 2, 0.52)';
    ctx.fill();

    // 2. Warm golden ambient floor wash around blooming petals
    const glow = ctx.createRadialGradient(0, 0, radius * 0.35, 0, 0, radius * 1.3);
    glow.addColorStop(0, 'rgba(255, 180, 20, 0.32)');
    glow.addColorStop(0.65, 'rgba(212, 175, 55, 0.14)');
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, radius * 1.3, 0, Math.PI * 2);
    ctx.fill();

    // 3. Render the Authentic Athapookalam Image
    if (this.pookalamImg && (this.pookalamLoaded || (this.pookalamImg.complete && this.pookalamImg.naturalWidth > 0))) {
      const diameter = radius * 2;
      ctx.drawImage(this.pookalamImg, -radius, -radius, diameter, diameter);
    }

    // 4. Center Golden Nilavilakku flame in the center of the Pookalam
    if (bloom > 0.35) {
      // Small brass center plate
      ctx.beginPath();
      ctx.arc(0, 0, 22 * bloom, 0, Math.PI * 2);
      ctx.fillStyle = '#D4AF37';
      ctx.fill();
      ctx.strokeStyle = '#FFEAA7';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Burning golden wick flame
      this.drawFlame(ctx, 0, -8 * bloom, 28 * bloom, time);
    }

    ctx.restore();
  }

  drawFlowerPetal(ctx, angle, dist, len, width, colorDark, colorLight) {
    ctx.save();
    ctx.rotate(angle);
    ctx.translate(dist, 0);

    const grad = ctx.createLinearGradient(0, -width * 0.5, len, width * 0.5);
    grad.addColorStop(0, colorDark);
    grad.addColorStop(0.6, colorLight);
    grad.addColorStop(1, colorDark);

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(len * 0.5, -width, len, 0);
    ctx.quadraticCurveTo(len * 0.5, width, 0, 0);
    ctx.closePath();
    ctx.fill();

    // Subtle center vein
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(len * 0.8, 0);
    ctx.stroke();

    ctx.restore();
  }

  // --- NILAVILAKKU (TRADITIONAL KERALA BRASS OIL LAMP) ---
  drawNilavilakku(ctx, cx, cy, height = 480, time = 0, scale = 1.0) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);

    const brassGrad = ctx.createLinearGradient(-40, 0, 40, 0);
    brassGrad.addColorStop(0, '#8C6826');
    brassGrad.addColorStop(0.2, '#D4AF37');
    brassGrad.addColorStop(0.5, '#FFF6BD');
    brassGrad.addColorStop(0.8, '#D4AF37');
    brassGrad.addColorStop(1, '#664A19');

    ctx.fillStyle = brassGrad;
    ctx.strokeStyle = '#FFEAA7';
    ctx.lineWidth = 2;

    // 1. Lamp Pedestal / Base (Thara)
    const baseY = 0;
    // Circular base disc
    ctx.beginPath();
    ctx.ellipse(0, baseY, 85, 25, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(0, baseY - 16, 68, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 2. Main Central Stem (Thandu) with ornate turned brass bulbs
    const stemTopY = baseY - height * 0.75;
    ctx.beginPath();
    ctx.moveTo(-16, baseY - 24);
    ctx.lineTo(-12, stemTopY);
    ctx.lineTo(12, stemTopY);
    ctx.lineTo(16, baseY - 24);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Ornate brass turned bulbs on stem
    const bulbYs = [baseY - height * 0.22, baseY - height * 0.45, baseY - height * 0.65];
    bulbYs.forEach(by => {
      ctx.beginPath();
      ctx.ellipse(0, by, 32, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });

    // 3. Oil Plate (Thattu) - Deep saucer holding coconut oil & wicks
    const thattuY = stemTopY;
    ctx.beginPath();
    ctx.ellipse(0, thattuY, 95, 26, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Inner oil reservoir
    ctx.beginPath();
    ctx.ellipse(0, thattuY - 4, 82, 19, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#9E7420';
    ctx.fill();

    // 4. Crown Apex: Sacred Swan / Annapakshi finial
    const birdY = thattuY - 75;
    this.drawAnnapakshi(ctx, 0, birdY, brassGrad);

    // 5. Traditional Wicks (Thiri) with Dynamic Dancing Flames
    // 5 wick points spread across oil plate rim
    const wicks = [
      { x: -80, y: thattuY - 2, scale: 0.9 },
      { x: -45, y: thattuY + 12, scale: 1.0 },
      { x: 0, y: thattuY + 16, scale: 1.1 },
      { x: 45, y: thattuY + 12, scale: 1.0 },
      { x: 80, y: thattuY - 2, scale: 0.9 }
    ];

    wicks.forEach((w, idx) => {
      // Wick cotton tip
      ctx.fillStyle = '#2C1810';
      ctx.beginPath();
      ctx.arc(w.x, w.y, 3, 0, Math.PI * 2);
      ctx.fill();

      // Flame
      this.drawFlame(ctx, w.x, w.y - 12, 38 * w.scale, time + idx * 1.3);
    });

    // Warm radial lighting cast by lamp onto nearby environment
    const lampGlow = ctx.createRadialGradient(0, thattuY, 20, 0, thattuY, 320);
    lampGlow.addColorStop(0, 'rgba(255, 200, 80, 0.45)');
    lampGlow.addColorStop(0.5, 'rgba(255, 140, 20, 0.18)');
    lampGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = lampGlow;
    ctx.beginPath();
    ctx.arc(0, thattuY, 320, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // Sacred Swan (Annapakshi) crest on top of Nilavilakku
  drawAnnapakshi(ctx, x, y, brassGrad) {
    ctx.save();
    ctx.translate(x, y);

    ctx.fillStyle = brassGrad;
    ctx.strokeStyle = '#FFEAA7';
    ctx.lineWidth = 1.8;

    // Body
    ctx.beginPath();
    ctx.ellipse(0, 25, 22, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Graceful arched swan neck & head
    ctx.beginPath();
    ctx.moveTo(10, 20);
    ctx.quadraticCurveTo(24, 0, 16, -18);
    ctx.quadraticCurveTo(8, -26, 0, -22);
    ctx.quadraticCurveTo(-14, -12, -4, 18);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Feather plume fan (ornate crest)
    ctx.beginPath();
    ctx.moveTo(-16, 20);
    ctx.quadraticCurveTo(-38, 0, -28, -25);
    ctx.quadraticCurveTo(-15, -12, -4, 15);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Beak
    ctx.beginPath();
    ctx.moveTo(16, -18);
    ctx.lineTo(26, -14);
    ctx.lineTo(14, -10);
    ctx.closePath();
    ctx.fillStyle = '#FFEAA7';
    ctx.fill();

    ctx.restore();
  }

  // Dynamic Dancing Oil Flame
  drawFlame(ctx, fx, fy, height, time) {
    ctx.save();
    ctx.translate(fx, fy);

    // Flame flicker physics
    const flickerX = Math.sin(time * 14) * 2.2 + Math.cos(time * 26) * 1.2;
    const flickerY = Math.cos(time * 18) * 3;
    const flameH = height + flickerY;
    const flameW = flameH * 0.42;

    // 1. Outer golden aura
    ctx.beginPath();
    ctx.arc(0, -flameH * 0.4, flameH * 0.9, 0, Math.PI * 2);
    const aura = ctx.createRadialGradient(0, -flameH * 0.4, 5, 0, -flameH * 0.4, flameH * 0.9);
    aura.addColorStop(0, 'rgba(255, 180, 20, 0.4)');
    aura.addColorStop(1, 'rgba(255, 100, 0, 0)');
    ctx.fillStyle = aura;
    ctx.fill();

    // 2. Main Flame Body (Orange-Red teardrop)
    const flameGrad = ctx.createLinearGradient(0, 0, 0, -flameH);
    flameGrad.addColorStop(0, '#2C3E50'); // Blue wick root
    flameGrad.addColorStop(0.15, '#E74C3C'); // Deep orange-red
    flameGrad.addColorStop(0.65, '#F39C12'); // Amber gold
    flameGrad.addColorStop(1, '#FFF'); // White tip

    ctx.fillStyle = flameGrad;
    ctx.beginPath();
    ctx.moveTo(-flameW * 0.5, 0);
    ctx.quadraticCurveTo(-flameW * 0.7, -flameH * 0.5, flickerX, -flameH);
    ctx.quadraticCurveTo(flameW * 0.7, -flameH * 0.5, flameW * 0.5, 0);
    ctx.closePath();
    ctx.fill();

    // 3. Bright White-Yellow Inner Core (Hottest part of flame)
    const coreGrad = ctx.createLinearGradient(0, 0, 0, -flameH * 0.65);
    coreGrad.addColorStop(0, '#F1C40F');
    coreGrad.addColorStop(0.5, '#FFF9D2');
    coreGrad.addColorStop(1, '#FFFFFF');

    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.moveTo(-flameW * 0.25, 0);
    ctx.quadraticCurveTo(-flameW * 0.35, -flameH * 0.3, flickerX * 0.6, -flameH * 0.65);
    ctx.quadraticCurveTo(flameW * 0.35, -flameH * 0.3, flameW * 0.25, 0);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  // --- VAZHAYILA (BANANA LEAF) & FESTIVE MOTIFS ---
  drawBananaLeaf(ctx, lx, ly, length = 380, width = 160, rot = 0) {
    ctx.save();
    ctx.translate(lx, ly);
    ctx.rotate(rot);

    // Leaf gradient (lush Kerala plantain green)
    const leafGrad = ctx.createLinearGradient(0, -width * 0.5, 0, width * 0.5);
    leafGrad.addColorStop(0, '#1E8449');
    leafGrad.addColorStop(0.5, '#27AE60');
    leafGrad.addColorStop(0.7, '#2ECC71');
    leafGrad.addColorStop(1, '#196F3D');

    ctx.fillStyle = leafGrad;
    ctx.strokeStyle = '#145A32';
    ctx.lineWidth = 3;

    // Curved organic leaf silhouette
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(length * 0.3, -width * 0.55, length * 0.7, -width * 0.5, length, 0);
    ctx.bezierCurveTo(length * 0.7, width * 0.5, length * 0.3, width * 0.55, 0, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Central Midrib stem
    ctx.strokeStyle = '#A9DFBF';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(length, 0);
    ctx.stroke();

    // Parallel leaf vein lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1.5;
    for (let x = 25; x < length - 20; x += 22) {
      // Top vein
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + 20, -width * 0.42);
      ctx.stroke();
      // Bottom vein
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + 20, width * 0.42);
      ctx.stroke();
    }

    ctx.restore();
  }

  // Brass Uruli with floating yellow & orange flowers
  drawUruli(ctx, ux, uy, radius = 95, time = 0) {
    ctx.save();
    ctx.translate(ux, uy);

    // Brass rim
    const uruliGrad = ctx.createRadialGradient(0, 0, radius * 0.4, 0, 0, radius);
    uruliGrad.addColorStop(0, '#5C4012');
    uruliGrad.addColorStop(0.6, '#B8860B');
    uruliGrad.addColorStop(0.85, '#FFD700');
    uruliGrad.addColorStop(1, '#805300');

    ctx.fillStyle = uruliGrad;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();

    // Water surface
    const waterGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, radius * 0.82);
    waterGrad.addColorStop(0, '#1B4F72');
    waterGrad.addColorStop(1, '#0E2433');
    ctx.fillStyle = waterGrad;
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.82, 0, Math.PI * 2);
    ctx.fill();

    // Floating marigolds in uruli
    const flowers = [
      { r: 0, a: 0, col: '#FFD700' },
      { r: radius * 0.45, a: 0.5, col: '#E67E22' },
      { r: radius * 0.45, a: 1.8, col: '#F1C40F' },
      { r: radius * 0.45, a: 3.1, col: '#E74C3C' },
      { r: radius * 0.45, a: 4.4, col: '#F39C12' },
      { r: radius * 0.45, a: 5.6, col: '#FFD700' }
    ];

    flowers.forEach((f, idx) => {
      const fx = Math.cos(f.a + time * 0.2 + idx) * f.r;
      const fy = Math.sin(f.a + time * 0.2 + idx) * f.r;
      ctx.beginPath();
      ctx.arc(fx, fy, 12, 0, Math.PI * 2);
      ctx.fillStyle = f.col;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(fx, fy, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#C0392B';
      ctx.fill();
    });

    ctx.restore();
  }
}

// Global instance
window.keralaGraphics = new KeralaGraphics();

