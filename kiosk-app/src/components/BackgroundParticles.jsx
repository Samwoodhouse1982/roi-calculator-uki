import React, { useEffect, useRef } from 'react';

/**
 * Ambient floating-particles background layer.
 *
 * Renders an absolutely-positioned canvas filled with 140 slowly drifting
 * teal particles, identical in behaviour to the splash screen's idle state.
 * Used to give the calculator flow and results page the same visual identity
 * as the splash.
 *
 * Usage:
 *   <div style={{ position: 'relative', zIndex: 0, ... }}>
 *     <BackgroundParticles />
 *     ... in-flow content here ...
 *   </div>
 *
 * The parent must:
 *   - establish a stacking context (position: relative + zIndex 0, or isolation: isolate)
 *   - have a solid background (so the canvas sits on it visibly)
 *
 * The canvas uses zIndex: -1 so it paints between the parent background and
 * the in-flow children. No need to touch the children's z-index.
 *
 * Internal canvas resolution is fixed at 1080×1920 to match the kiosk target.
 */
export function BackgroundParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;

    const w = canvas.width = 1080;
    const h = canvas.height = 1920;

    const particles = [];
    const PARTICLE_COUNT = 140;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * (w + 500) - 250,
        y: Math.random() * h,
        r: Math.random() * 3.5 + 0.8,
        speed: Math.random() * 0.8 + 0.2,
        opacity: Math.random() * 0.2 + 0.03,
        hue: Math.random() * 30 + 165,           // teal/aqua range
        glow: Math.random() > 0.92,              // ~8% of particles have a soft halo
        drift: (Math.random() - 0.5) * 0.3,
        phase: Math.random() * Math.PI * 2,
        waveAmp: Math.random() * 40 + 10,
        waveSpeed: Math.random() * 0.01 + 0.005,
      });
    }

    let t = 0;
    const draw = () => {
      t++;
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.x += p.speed;
        const wave = Math.sin(t * p.waveSpeed + p.phase) * p.waveAmp;
        const drawY = p.y + wave + p.drift * t * 0.1;

        // Wrap horizontally so the field keeps refilling from the left
        if (p.x > w + 50) {
          p.x = -50;
          p.y = Math.random() * h;
          p.phase = Math.random() * Math.PI * 2;
        }

        if (p.glow) {
          const grad = ctx.createRadialGradient(p.x, drawY, 0, p.x, drawY, p.r * 8);
          grad.addColorStop(0, `hsla(${p.hue}, 80%, 75%, ${p.opacity * 0.15})`);
          grad.addColorStop(1, `hsla(${p.hue}, 80%, 75%, 0)`);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, drawY, p.r * 8, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = `hsla(${p.hue}, 70%, ${p.glow ? 90 : 65}%, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, drawY, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0, left: 0, width: '100%', height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  );
}
