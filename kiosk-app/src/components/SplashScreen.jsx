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

      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: 1000, padding: '75px 80px', marginTop: '14vh',
      }}>

        <div style={{
          fontSize: 20, fontWeight: 600, letterSpacing: 10, textTransform: 'uppercase',
          color: '#00d4aa', marginBottom: 50, opacity: 0.7,
        }}>RLDatix Galen Clinical Archive</div>

        <h1 style={{
          fontSize: 80, fontWeight: 800, lineHeight: 1.15, color: '#fff',
          margin: '0 0 30px', letterSpacing: '-1.25px',
        }}>
          Decommission legacy systems.
          <br />
          <span style={{ color: '#00d4aa' }}>Discover your ROI.</span>
        </h1>

        <p style={{
          fontSize: 28, fontWeight: 400, color: 'rgba(255,255,255,0.5)',
          lineHeight: 1.6, margin: '0 auto 75px', maxWidth: 750,
        }}>
          See exactly how much your health system could save by retiring legacy applications and consolidating clinical data into a single archive.
        </p>

        <button onClick={onStart} style={{
          display: 'block', margin: '0 auto',
          padding: '30px 90px', borderRadius: 80, border: '3px solid #00d4aa',
          background: 'rgba(0,212,170,0.18)', color: '#fff',
          fontSize: 30, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit',
          letterSpacing: 4, transition: 'all 0.3s',
          textTransform: 'uppercase',
          boxShadow: '0 0 80px rgba(0,212,170,0.35), inset 0 0 60px rgba(0,212,170,0.08)',
          animation: 'splashPulseBig 2s ease-in-out infinite',
        }}>
          Tap to Start
        </button>

        <style>{`
          @keyframes splashPulseBig {
            0%, 100% { box-shadow: 0 0 80px rgba(0,212,170,0.35), inset 0 0 60px rgba(0,212,170,0.08); transform: scale(1); }
            50% { box-shadow: 0 0 120px rgba(0,212,170,0.55), inset 0 0 80px rgba(0,212,170,0.15); transform: scale(1.02); }
          }
        `}</style>

        <div style={{
          marginTop: 60, fontSize: 18, color: 'rgba(255,255,255,0.25)',
          letterSpacing: 2.5,
        }}>
          BEST IN KLAS 2025 &nbsp;·&nbsp; DATA ARCHIVING
        </div>

      </div>

      <img src={rldatixLogo} alt="RLDatix" style={{
        position: 'absolute', bottom: 50, left: '50%', transform: 'translateX(-50%)',
        width: 450, opacity: 0.5, zIndex: 3,
      }} />
      <div style={{
        position: 'absolute', bottom: 18, left: '50%', transform: 'translateX(-50%)',
        fontSize: 14, color: 'rgba(255,255,255,0.2)', letterSpacing: 1, zIndex: 3, whiteSpace: 'nowrap',
      }}>v2.1 · Updated May 2026</div>
    </div>
  );
}
