import React, { useState } from 'react';
import { C, F } from '../theme';

export function Card({ children, style }) {
  return <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: "32px 36px 28px", ...style }}>{children}</div>;
}

export function StepIndicator({ steps, current, onJump }) {
  return <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
    {steps.map((label, i) => {
      const active = current === i, done = current > i;
      return <div key={i} style={{ flex: 1, cursor: done ? "pointer" : "default" }} onClick={() => done && onJump(i)}>
        <div style={{ height: 6, borderRadius: 3, background: active ? C.accent : done ? C.accent + "60" : C.border, transition: "background .4s" }} />
        <div style={{ fontSize: F.tiny, fontWeight: active ? 700 : 500, marginTop: 8, color: active ? C.accent : done ? C.textMid : C.textMuted, textAlign: "center" }}>{label}</div>
      </div>;
    })}
  </div>;
}

export function NavButtons({ step, totalSteps, onBack, onNext, onCalculate }) {
  if (step >= totalSteps - 1) return null;
  return <div style={{ padding: "24px 60px 32px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 16, alignItems: "center" }}>
    {step > 0 && <button onClick={onBack} style={{ padding: "20px 40px", borderRadius: 16, border: `1px solid ${C.border}`, background: C.surface, color: C.textMid, fontSize: F.body, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>← Back</button>}
    <div style={{ flex: 1 }} />
    {step < totalSteps - 2 ? (
      <button onClick={onNext} style={{ padding: "20px 56px", borderRadius: 16, border: "none", background: C.accent, color: "#0a0f1a", fontSize: F.h3, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Next →</button>
    ) : (
      <button onClick={onCalculate} style={{ padding: "20px 56px", borderRadius: 16, border: "none", background: `linear-gradient(135deg, ${C.accent}, #00ffc8)`, color: "#0a0f1a", fontSize: F.h2, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 24px rgba(0,212,170,0.4)" }}>Calculate ROI →</button>
    )}
  </div>;
}

export function PageTransition({ children, step }) {
  return <div key={step} style={{ animation: "kiosk-fade .3s ease-out" }}>
    <style>{`@keyframes kiosk-fade { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }`}</style>
    {children}
  </div>;
}

export function TouchSlider({ label, value, min, max, step = 1, onChange, format, tip }) {
  return <div style={{ marginBottom: 20 }}>
    {label && <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: F.body, fontWeight: 600, color: C.textMid }}>{label}</span>
        {tip && <InfoTip text={tip} />}
      </div>
      <span style={{ fontSize: F.h1, fontWeight: 800, color: C.accent }}>{format ? format(value) : value}</span>
    </div>}
    <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} style={{ width: "100%", cursor: "pointer", accentColor: C.accent }} />
  </div>;
}

export function Stepper({ label, value, min = 0, max = 999, step = 1, onChange, tip }) {
  return <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
    <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontSize: F.body, fontWeight: 600, color: C.textMid }}>{label}</span>
      {tip && <InfoTip text={tip} />}
    </div>
    <button onClick={() => onChange(Math.max(min, value - step))} style={{ width: 56, height: 56, borderRadius: 14, border: `1px solid ${C.border}`, background: C.surface, color: C.textMid, fontSize: 28, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}>−</button>
    <span style={{ fontSize: F.h1, fontWeight: 800, color: C.accent, minWidth: 80, textAlign: "center" }}>{value}</span>
    <button onClick={() => onChange(Math.min(max, value + step))} style={{ width: 56, height: 56, borderRadius: 14, border: `1px solid ${C.border}`, background: C.surface, color: C.textMid, fontSize: 28, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}>+</button>
  </div>;
}

export function InfoTip({ text }) {
  const [show, setShow] = useState(false);
  return <span style={{ position: "relative", display: "inline-flex" }}>
    <span onClick={() => setShow(!show)} style={{ width: 26, height: 26, borderRadius: "50%", background: C.border, color: C.textMid, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: F.small, fontWeight: 700, cursor: "pointer" }}>i</span>
    {show && <>
      <div onClick={() => setShow(false)} style={{ position: "fixed", inset: 0, zIndex: 19 }} />
      <span style={{ position: "absolute", bottom: "calc(100% + 12px)", left: "50%", transform: "translateX(-50%)", background: "#1e2840", color: C.text, fontSize: F.small, lineHeight: 1.6, padding: "18px 22px", borderRadius: 16, width: 360, boxShadow: "0 12px 48px rgba(0,0,0,.6)", zIndex: 20, border: `1px solid ${C.border}`, animation: "kiosk-fade .2s ease-out" }}>{text}</span>
    </>}
  </span>;
}

export function BigChoice({ options, value, onChange, columns = 2 }) {
  return <div style={{ display: "grid", gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: 14 }}>
    {options.map(opt => <button key={opt.key} onClick={() => onChange(opt.key)} style={{ width: "100%", padding: "28px 30px", textAlign: "left", border: value === opt.key ? `3px solid ${C.accent}` : `1px solid ${C.border}`, borderRadius: 20, background: value === opt.key ? C.accentPale : C.surface, cursor: "pointer", transition: "all .2s" }}>
      {opt.icon && <div style={{ fontSize: 36, marginBottom: 10 }}>{opt.icon}</div>}
      <div style={{ fontSize: F.h3, fontWeight: 700, color: value === opt.key ? C.accent : C.text }}>{opt.label}</div>
      <div style={{ fontSize: F.small, color: C.textMuted, marginTop: 6, lineHeight: 1.5 }}>{opt.desc}</div>
    </button>)}
  </div>;
}

export function SectionTitle({ number, children }) {
  return <div style={{ fontSize: F.h2, fontWeight: 700, color: C.textMid, marginBottom: 24, display: "flex", alignItems: "center", gap: 14 }}>
    <span style={{ width: 44, height: 44, borderRadius: "50%", background: C.accent, color: "#0a0f1a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: F.h3, fontWeight: 800 }}>{number}</span>
    {children}
  </div>;
}

export function SegmentedControl({ options, value, onChange, label }) {
  return <div>
    {label && <div style={{ fontSize: F.body, fontWeight: 600, color: C.textMid, marginBottom: 10 }}>{label}</div>}
    <div style={{ display: "flex", gap: 8 }}>
      {options.map(opt => <button key={opt.key} onClick={() => onChange(opt.key)} style={{ flex: 1, padding: "16px", borderRadius: 14, cursor: "pointer", border: value === opt.key ? `2px solid ${C.accent}` : `1px solid ${C.border}`, background: value === opt.key ? C.accentPale : C.surface, color: value === opt.key ? C.accent : C.textMid, fontSize: F.body, fontWeight: 600, fontFamily: "inherit" }}>{opt.label}</button>)}
    </div>
  </div>;
}
