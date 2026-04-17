import React, { useState } from 'react';
import { C, F } from '../theme';

export function Card({ children, style }) {
  return <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 24, padding: "36px 40px 32px", ...style }}>{children}</div>;
}

export function StepIndicator({ steps, current, onJump }) {
  return <div style={{ display: "flex", gap: 10, marginBottom: 36 }}>
    {steps.map((label, i) => {
      const active = current === i, done = current > i;
      return <div key={i} style={{ flex: 1, cursor: done ? "pointer" : "default" }} onClick={() => done && onJump(i)}>
        <div style={{ height: 8, borderRadius: 4, background: active ? C.accent : done ? C.accent + "60" : C.border, transition: "background .4s" }} />
        <div style={{ fontSize: F.tiny, fontWeight: active ? 700 : 500, marginTop: 10, color: active ? C.accent : done ? C.textMid : C.textMuted, textAlign: "center" }}>{label}</div>
      </div>;
    })}
  </div>;
}

export function NavButtons({ step, totalSteps, onBack, onNext, onCalculate }) {
  if (step >= totalSteps - 1) return null;
  return <div style={{ padding: "28px 56px 40px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 20, alignItems: "center" }}>
    {step > 0 && <button onClick={onBack} style={{ padding: "24px 44px", borderRadius: 18, border: `1px solid ${C.border}`, background: C.surface, color: C.textMid, fontSize: F.body, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>← Back</button>}
    <div style={{ flex: 1 }} />
    {step < totalSteps - 2 ? (
      <button onClick={onNext} style={{ padding: "24px 64px", borderRadius: 18, border: "none", background: C.accent, color: "#0a0f1a", fontSize: F.h3, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Next →</button>
    ) : (
      <button onClick={onCalculate} style={{ padding: "24px 64px", borderRadius: 18, border: "none", background: `linear-gradient(135deg, ${C.accent}, #00ffc8)`, color: "#0a0f1a", fontSize: F.h2, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 6px 28px rgba(0,212,170,0.4)" }}>Calculate ROI →</button>
    )}
  </div>;
}

export function PageTransition({ children, step }) {
  return <div key={step} style={{ animation: "kSlideUp .4s cubic-bezier(0.16, 1, 0.3, 1)" }}>
    <style>{`
      @keyframes kSlideUp {
        0% { opacity: 0; transform: translateY(40px) scale(0.97); filter: blur(4px); }
        60% { opacity: 1; filter: blur(0); }
        100% { transform: translateY(0) scale(1); }
      }
    `}</style>
    {children}
  </div>;
}

export function TouchSlider({ label, value, min, max, step = 1, onChange, format, tip }) {
  return <div style={{ marginBottom: 24 }}>
    {label && <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: F.body, fontWeight: 600, color: C.textMid }}>{label}</span>
        {tip && <InfoTip text={tip} />}
      </div>
      <span style={{ fontSize: F.h1, fontWeight: 800, color: C.accent }}>{format ? format(value) : value}</span>
    </div>}
    <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} style={{ width: "100%", cursor: "pointer", accentColor: C.accent }} />
  </div>;
}

export function Stepper({ label, value, min = 0, max = 999, step = 1, onChange, tip }) {
  return <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 20 }}>
    <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ fontSize: F.body, fontWeight: 600, color: C.textMid }}>{label}</span>
      {tip && <InfoTip text={tip} />}
    </div>
    <button onClick={() => onChange(Math.max(min, value - step))} style={{ width: 64, height: 64, borderRadius: 16, border: `1px solid ${C.border}`, background: C.surface, color: C.textMid, fontSize: 32, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}>−</button>
    <span style={{ fontSize: F.h1, fontWeight: 800, color: C.accent, minWidth: 90, textAlign: "center" }}>{value}</span>
    <button onClick={() => onChange(Math.min(max, value + step))} style={{ width: 64, height: 64, borderRadius: 16, border: `1px solid ${C.border}`, background: C.surface, color: C.textMid, fontSize: 32, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}>+</button>
  </div>;
}

export function InfoTip({ text }) {
  const [show, setShow] = useState(false);
  return <span style={{ position: "relative", display: "inline-flex" }}>
    <span onClick={() => setShow(!show)} style={{ width: 30, height: 30, borderRadius: "50%", background: C.border, color: C.textMid, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: F.small, fontWeight: 700, cursor: "pointer" }}>i</span>
    {show && <>
      <div onClick={() => setShow(false)} style={{ position: "fixed", inset: 0, zIndex: 19 }} />
      <span style={{ position: "absolute", bottom: "calc(100% + 14px)", left: "50%", transform: "translateX(-50%)", background: "#1e2840", color: C.text, fontSize: F.small, lineHeight: 1.6, padding: "20px 24px", borderRadius: 18, width: 400, boxShadow: "0 12px 48px rgba(0,0,0,.6)", zIndex: 20, border: `1px solid ${C.border}`, animation: "kfade .2s ease-out" }}>{text}</span>
    </>}
  </span>;
}

export function BigChoice({ options, value, onChange }) {
  return <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
    {options.map(opt => <button key={opt.key} onClick={() => onChange(opt.key)} style={{
      width: "100%", padding: "28px 32px", textAlign: "left",
      border: value === opt.key ? `3px solid ${C.accent}` : `1px solid ${C.border}`,
      borderRadius: 22, background: value === opt.key ? C.accentPale : C.surface,
      cursor: "pointer", transition: "all .2s", display: "flex", alignItems: "center", gap: 20
    }}>
      {opt.icon && <span style={{ fontSize: 40 }}>{opt.icon}</span>}
      <div>
        <div style={{ fontSize: F.h3, fontWeight: 700, color: value === opt.key ? C.accent : C.text }}>{opt.label}</div>
        <div style={{ fontSize: F.small, color: C.textMuted, marginTop: 4, lineHeight: 1.4 }}>{opt.desc}</div>
      </div>
    </button>)}
  </div>;
}

export function SectionTitle({ number, children }) {
  return <div style={{ fontSize: F.h2, fontWeight: 700, color: C.textMid, marginBottom: 28, display: "flex", alignItems: "center", gap: 16 }}>
    <span style={{ width: 52, height: 52, borderRadius: "50%", background: C.accent, color: "#0a0f1a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: F.h3, fontWeight: 800, flexShrink: 0 }}>{number}</span>
    {children}
  </div>;
}

export function SegmentedControl({ options, value, onChange, label }) {
  return <div>
    {label && <div style={{ fontSize: F.body, fontWeight: 600, color: C.textMid, marginBottom: 12 }}>{label}</div>}
    <div style={{ display: "flex", gap: 10 }}>
      {options.map(opt => <button key={opt.key} onClick={() => onChange(opt.key)} style={{ flex: 1, padding: "18px", borderRadius: 16, cursor: "pointer", border: value === opt.key ? `2px solid ${C.accent}` : `1px solid ${C.border}`, background: value === opt.key ? C.accentPale : C.surface, color: value === opt.key ? C.accent : C.textMid, fontSize: F.body, fontWeight: 600, fontFamily: "inherit" }}>{opt.label}</button>)}
    </div>
  </div>;
}
