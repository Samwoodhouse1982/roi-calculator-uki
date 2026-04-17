import React, { useState } from 'react';
import { C } from '../theme';

export function Card({ children, style }) {
  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16,
      padding: "28px 32px 24px", ...style
    }}>
      {children}
    </div>
  );
}

export function StepIndicator({ steps, current, onJump }) {
  return (
    <div style={{ display: "flex", gap: 6, marginBottom: 28, padding: "0 4px" }}>
      {steps.map((label, i) => {
        const active = current === i;
        const done = current > i;
        return (
          <div key={i} style={{ flex: 1, cursor: done ? "pointer" : "default" }}
            onClick={() => done && onJump(i)}>
            <div style={{
              height: 5, borderRadius: 3,
              background: active ? C.accent : done ? C.accent + "60" : C.border,
              transition: "background .3s"
            }} />
            <div style={{
              fontSize: 11, fontWeight: active ? 700 : 500, marginTop: 6,
              color: active ? C.accent : done ? C.textMid : C.textMuted,
              textAlign: "center", transition: "color .3s"
            }}>{label}</div>
          </div>
        );
      })}
    </div>
  );
}

export function NavButtons({ step, totalSteps, onBack, onNext, onCalculate }) {
  if (step >= totalSteps - 1) return null; // hide on results
  return (
    <div style={{
      padding: "20px 60px 28px", borderTop: `1px solid ${C.border}`,
      display: "flex", gap: 12, alignItems: "center"
    }}>
      {step > 0 && (
        <button onClick={onBack} style={{
          padding: "18px 36px", borderRadius: 14, border: `1px solid ${C.border}`,
          background: C.surface, color: C.textMid, fontSize: 18, fontWeight: 600,
          cursor: "pointer", fontFamily: "inherit"
        }}>
          ← Back
        </button>
      )}
      <div style={{ flex: 1 }} />
      {step < totalSteps - 2 ? (
        <button onClick={onNext} style={{
          padding: "18px 52px", borderRadius: 14, border: "none",
          background: C.accent, color: "#0a0f1a", fontSize: 18, fontWeight: 700,
          cursor: "pointer", fontFamily: "inherit"
        }}>
          Next →
        </button>
      ) : (
        <button onClick={onCalculate} style={{
          padding: "18px 52px", borderRadius: 14, border: "none",
          background: `linear-gradient(135deg, ${C.accent}, #00ffc8)`,
          color: "#0a0f1a", fontSize: 20, fontWeight: 800, cursor: "pointer",
          fontFamily: "inherit", boxShadow: "0 4px 20px rgba(0,212,170,0.4)"
        }}>
          Calculate ROI →
        </button>
      )}
    </div>
  );
}

export function TouchSlider({ label, value, min, max, step = 1, onChange, format, tip }) {
  const display = format ? format(value) : value;
  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: C.textMid }}>{label}</span>
            {tip && <InfoTip text={tip} />}
          </div>
          <span style={{ fontSize: 22, fontWeight: 800, color: C.accent }}>{display}</span>
        </div>
      )}
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: "100%", cursor: "pointer", accentColor: C.accent }} />
    </div>
  );
}

export function Stepper({ label, value, min = 0, max = 999, step = 1, onChange, tip }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: C.textMid }}>{label}</span>
        {tip && <InfoTip text={tip} />}
      </div>
      <button onClick={() => onChange(Math.max(min, value - step))} style={{
        width: 48, height: 48, borderRadius: 12, border: `1px solid ${C.border}`,
        background: C.surface, color: C.textMid, fontSize: 24, fontWeight: 700,
        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
      }}>−</button>
      <span style={{
        fontSize: 24, fontWeight: 800, color: C.accent, minWidth: 60, textAlign: "center"
      }}>{value}</span>
      <button onClick={() => onChange(Math.min(max, value + step))} style={{
        width: 48, height: 48, borderRadius: 12, border: `1px solid ${C.border}`,
        background: C.surface, color: C.textMid, fontSize: 24, fontWeight: 700,
        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
      }}>+</button>
    </div>
  );
}

export function InfoTip({ text }) {
  const [show, setShow] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline-flex" }}>
      <span onClick={() => setShow(!show)} style={{
        width: 22, height: 22, borderRadius: "50%", background: C.border,
        color: C.textMid, display: "inline-flex", alignItems: "center",
        justifyContent: "center", fontSize: 12, fontWeight: 700, cursor: "pointer"
      }}>i</span>
      {show && (
        <span onClick={() => setShow(false)} style={{
          position: "absolute", bottom: "calc(100% + 10px)", left: "50%",
          transform: "translateX(-50%)", background: "#1e2840", color: C.text,
          fontSize: 13, lineHeight: 1.5, padding: "14px 18px", borderRadius: 12,
          width: 320, maxWidth: "80vw", boxShadow: "0 8px 32px rgba(0,0,0,.5)",
          zIndex: 20, border: `1px solid ${C.border}`
        }}>
          {text}
        </span>
      )}
    </span>
  );
}

export function BigChoice({ options, value, onChange }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      {options.map(opt => (
        <button key={opt.key} onClick={() => onChange(opt.key)} style={{
          width: "100%", padding: "24px 26px", textAlign: "left",
          border: value === opt.key ? `3px solid ${C.accent}` : `1px solid ${C.border}`,
          borderRadius: 16, background: value === opt.key ? C.accentPale : C.surface,
          cursor: "pointer", transition: "all .15s"
        }}>
          {opt.icon && <div style={{ fontSize: 28, marginBottom: 8 }}>{opt.icon}</div>}
          <div style={{ fontSize: 18, fontWeight: 700, color: value === opt.key ? C.accent : C.text }}>
            {opt.label}
          </div>
          <div style={{ fontSize: 13, color: C.textMuted, marginTop: 4, lineHeight: 1.4 }}>
            {opt.desc}
          </div>
        </button>
      ))}
    </div>
  );
}

export function SectionTitle({ number, children }) {
  return (
    <div style={{
      fontSize: 18, fontWeight: 700, color: C.textMid, letterSpacing: ".03em",
      marginBottom: 20, display: "flex", alignItems: "center", gap: 12
    }}>
      <span style={{
        width: 36, height: 36, borderRadius: "50%", background: C.accent, color: "#0a0f1a",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800
      }}>{number}</span>
      {children}
    </div>
  );
}
