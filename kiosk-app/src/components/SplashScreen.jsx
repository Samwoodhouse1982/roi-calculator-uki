import React, { useEffect, useRef } from 'react';
import { C } from '../theme';
import rldatixLogo from '../assets/rldatix-logo.png';

export function SplashScreen({ onStart }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    let w, h;

    const resize = () => {
      w = canvas.width = 1080;
      h = canvas.height = 1920;
    };
    resize();

    // Portrait 9:16 - distribute particles across full height
    const isPortrait = h > w;

    const particles = [];
    const PARTICLE_COUNT = 140;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * (w + 500) - 250,
        y: Math.random() * h,
        r: Math.random() * 3.5 + 0.8,
        speed: Math.random() * 0.8 + 0.2,
        opacity: Math.random() * 0.2 + 0.03,
        hue: Math.random() * 30 + 165,
        glow: Math.random() > 0.92,
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

    return () => {
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div style={{
      position: 'relative', zIndex: 100, width: 1080, minHeight: 1920, height: '100vh',
      background: 'linear-gradient(160deg, #060b14 0%, #0a1020 25%, #0c1825 50%, #091520 75%, #060b14 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start',
      overflow: 'hidden', cursor: 'pointer',
    }} onClick={onStart}>

      <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }} />

      <div style={{ position: 'absolute', inset: 0, zIndex: 1,
        background: 'radial-gradient(ellipse at 30% 50%, rgba(0,212,170,0.06) 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(0,180,255,0.04) 0%, transparent 50%)',
      }} />

      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: 900, padding: '60px 64px', marginTop: '18vh',
        background: 'radial-gradient(ellipse at center, rgba(6,11,20,0.85) 0%, rgba(6,11,20,0.5) 50%, transparent 80%)',
        borderRadius: 40,
      }}>

        <div style={{
          fontSize: 16, fontWeight: 600, letterSpacing: 8, textTransform: 'uppercase',
          color: '#00d4aa', marginBottom: 40, opacity: 0.7,
        }}>RLDatix Galen Clinical Archive</div>

        <h1 style={{
          fontSize: 64, fontWeight: 800, lineHeight: 1.15, color: '#fff',
          margin: '0 0 24px', letterSpacing: '-1px',
        }}>
          Decommission legacy systems.
          <br />
          <span style={{ color: '#00d4aa' }}>Discover your ROI.</span>
        </h1>

        <p style={{
          fontSize: 22, fontWeight: 400, color: 'rgba(255,255,255,0.5)',
          lineHeight: 1.6, margin: '0 0 60px', maxWidth: 600, marginLeft: 'auto', marginRight: 'auto',
        }}>
          See exactly how much your health system could save by retiring legacy applications and consolidating clinical data into a single archive.
        </p>

        <button onClick={onStart} style={{
          padding: '24px 72px', borderRadius: 60, border: '2px solid #00d4aa',
          background: 'rgba(0,212,170,0.1)', color: '#00d4aa',
          fontSize: 24, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
          letterSpacing: 1, transition: 'all 0.3s',
          boxShadow: '0 0 40px rgba(0,212,170,0.15), inset 0 0 40px rgba(0,212,170,0.05)',
          animation: 'splashPulse 3s ease-in-out infinite',
        }}>
          Discover your ROI
        </button>

        <style>{`
          @keyframes splashPulse {
            0%, 100% { box-shadow: 0 0 40px rgba(0,212,170,0.15), inset 0 0 40px rgba(0,212,170,0.05); }
            50% { box-shadow: 0 0 60px rgba(0,212,170,0.3), inset 0 0 60px rgba(0,212,170,0.1); }
          }
        `}</style>

        <div style={{
          marginTop: 48, fontSize: 14, color: 'rgba(255,255,255,0.25)',
          letterSpacing: 2,
        }}>
          BEST IN KLAS 2025 &nbsp;·&nbsp; DATA ARCHIVING
        </div>

        <img src={rldatixLogo} alt="RLDatix" style={{
          position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          width: 180, opacity: 0.5,
        }} />
      </div>
    </div>
  );
}
