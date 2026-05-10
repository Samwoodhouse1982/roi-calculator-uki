import React, { useState } from 'react';
import { C, F } from '../theme';
import { Icon } from './Icons';

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

const STEP_CONTEXT = [
  // 0 - Scope
  { title: "Why this matters", text: "Your organization type determines the staffing ratios, system complexity, and cost benchmarks we use. The reimbursement model shapes which financial impacts appear in your report. Fee-for-service focuses on denial recovery and coding accuracy, value-based adds CMS penalty programs (HRRP, HAC, VBP), and mixed models blend both. This ensures the ROI reflects your actual revenue exposure." },
  // 1 - Journey
  { title: "Why this matters", text: "Whether you already have an EHR changes the calculation significantly. With an EHR in place, the ROI focuses on archiving and decommissioning legacy systems. Without one, it includes the full migration case." },
  // 2 - Facilities
  { title: "Why this matters", text: "Bed count is the primary scaling factor. It drives staffing levels, annual admissions, revenue estimates, and patient safety metrics. More beds means more staff navigating legacy systems and more clinical encounters affected by fragmentation." },
  // 3 - Systems
  { title: "Why this matters", text: "Each legacy system has a real annual cost: licensing, hosting, interfaces, and support. The number and tier of systems directly determines your decommission savings and how much time clinicians waste switching between platforms." },
  // 4 - Fine-tune
  { title: "Why this matters", text: "These settings calibrate the model to your specific situation. Complexity and data quality affect migration effort. Occupancy drives admission volume. Galen costs let us calculate your exact payback period." },
];

export function NavButtons({ step, totalSteps, onBack, onNext, onCalculate, onStartOver }) {
  if (step >= totalSteps - 1) return null;
  const ctx = STEP_CONTEXT[step];
  return <div style={{ borderTop: `1px solid ${C.border}` }}>
    {ctx && <div style={{ margin: "20px 56px 0", padding: "16px 20px", background: `${C.accent}08`, border: `1px solid ${C.accent}20`, borderRadius: 14, display: "flex", gap: 12, alignItems: "flex-start" }}>
      <span style={{ flexShrink: 0, marginTop: 1 }}><Icon name="lightbulb" size={20} stroke={C.accent} /></span>
      <div>
        <div style={{ fontSize: F.tiny, fontWeight: 700, color: C.accent, marginBottom: 4 }}>{ctx.title}</div>
        <div style={{ fontSize: F.tiny, color: C.textMid, lineHeight: 1.6 }}>{ctx.text}</div>
      </div>
    </div>}
    <div style={{ padding: "16px 56px 40px", display: "flex", gap: 20, alignItems: "center" }}>
      {step > 0 && <button onClick={onBack} style={{ padding: "24px 44px", borderRadius: 18, border: `1px solid ${C.border}`, background: C.surface, color: C.textMid, fontSize: F.body, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>← Back</button>}
      <div style={{ flex: 1 }} />
      {/* Subtle Start over button - sits centred between Back and Next/Calculate.
          Deliberately understated (no background, muted text colour, smaller
          font) so it doesn't compete with the primary navigation. */}
      {onStartOver && <button onClick={onStartOver} style={{
        padding: "10px 18px", borderRadius: 12, border: "none",
        background: "transparent", color: C.textMuted, fontSize: F.small,
        fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
        letterSpacing: 0.3, opacity: 0.75, transition: "opacity .15s, color .15s"
      }} onMouseEnter={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.color = C.textMid; }}
         onMouseLeave={e => { e.currentTarget.style.opacity = "0.75"; e.currentTarget.style.color = C.textMuted; }}>
        ↻  Start over
      </button>}
      <div style={{ flex: 1 }} />
      {step < totalSteps - 2 ? (
        <button onClick={onNext} style={{ padding: "24px 64px", borderRadius: 18, border: "none", background: C.accent, color: "#0a0f1a", fontSize: F.h3, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Next →</button>
      ) : (
        <button onClick={onCalculate} style={{ padding: "24px 64px", borderRadius: 18, border: "none", background: `linear-gradient(135deg, ${C.accent}, #00ffc8)`, color: "#0a0f1a", fontSize: F.h2, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 6px 28px rgba(0,212,170,0.4)" }}>Calculate ROI →</button>
      )}
    </div>
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
  return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
    {options.map((opt, i) => {
      const isLastOdd = options.length % 2 === 1 && i === options.length - 1;
      return <button key={opt.key} onClick={() => onChange(opt.key)} style={{
        gridColumn: isLastOdd ? "1 / -1" : "auto",
        padding: "32px 30px", textAlign: "left", cursor: "pointer",
        border: value === opt.key ? `3px solid ${C.accent}` : `1px solid ${C.border}`,
        borderRadius: 22, background: value === opt.key ? C.accentPale : C.surface,
        transition: "all .2s", display: "flex", flexDirection: "column", alignItems: "flex-start"
      }}>
        <div style={{ marginBottom: 14 }}>
          {opt.iconKey ? <Icon name={opt.iconKey} size={42} stroke={value === opt.key ? C.accent : C.textMid} /> : opt.icon && <span style={{ fontSize: 42 }}>{opt.icon}</span>}
        </div>
        <div style={{ fontSize: F.h3, fontWeight: 700, color: value === opt.key ? C.accent : C.text, marginBottom: 8, lineHeight: 1.2 }}>{opt.label}</div>
        <div style={{ fontSize: F.small, color: C.textMuted, lineHeight: 1.5 }}>{opt.desc}</div>
      </button>;
    })}
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
