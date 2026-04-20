import { useFuzzyStore } from "@/store/fuzzy-store";
import { tempMembership, humidityMembership, windMembership } from "@/lib/fuzzy";
import { useState } from "react";

type SetKey = "temp" | "humidity" | "wind";

const CONFIG: Record<SetKey, {
  label: string; unit: string; min: number; max: number;
  fn: (x: number) => Record<string, number>;
  current: (i: { temperature: number; humidity: number; windSpeed: number }) => number;
  labels: string[];
  colors: string[];
}> = {
  temp: {
    label: "Temperature", unit: "°C", min: 0, max: 40,
    fn: tempMembership, current: (i) => i.temperature,
    labels: ["Low", "Medium", "High"],
    colors: ["hsl(var(--rainy))", "hsl(var(--secondary))", "hsl(var(--sunny))"],
  },
  humidity: {
    label: "Humidity", unit: "%", min: 0, max: 100,
    fn: humidityMembership, current: (i) => i.humidity,
    labels: ["Low", "Medium", "High"],
    colors: ["hsl(var(--sunny))", "hsl(var(--accent))", "hsl(var(--rainy))"],
  },
  wind: {
    label: "Wind Speed", unit: " km/h", min: 0, max: 40,
    fn: windMembership, current: (i) => i.windSpeed,
    labels: ["Slow", "Moderate", "Fast"],
    colors: ["hsl(var(--accent))", "hsl(var(--secondary))", "hsl(var(--primary))"],
  },
};

function MembershipChart({ setKey }: { setKey: SetKey }) {
  const cfg = CONFIG[setKey];
  const inputs = useFuzzyStore((s) => s.inputs);
  const x = cfg.current(inputs);
  const W = 320; const H = 140; const PAD = 16;
  const points = 80;
  const curves = cfg.labels.map((label, idx) => {
    const pts: { x: number; y: number; xv: number; yv: number }[] = [];
    for (let i = 0; i <= points; i++) {
      const xv = cfg.min + (i / points) * (cfg.max - cfg.min);
      const yv = (cfg.fn(xv) as Record<string, number>)[label];
      const px = PAD + (i / points) * (W - PAD * 2);
      const py = H - PAD - yv * (H - PAD * 2);
      pts.push({ x: px, y: py, xv, yv });
    }
    return { label, color: cfg.colors[idx], pts };
  });
  const xPx = PAD + ((x - cfg.min) / (cfg.max - cfg.min)) * (W - PAD * 2);
  const memValues = cfg.fn(x) as Record<string, number>;

  return (
    <div className="rounded-3xl glass p-5 animate-rise">
      <div className="flex items-baseline justify-between mb-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{cfg.label}</p>
          <p className="font-display text-lg font-bold">Membership μ(x)</p>
        </div>
        <p className="font-display text-xl font-bold tabular-nums text-gradient">
          {Math.round(x)}<span className="text-sm text-muted-foreground">{cfg.unit}</span>
        </p>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
        {/* Grid */}
        {[0, 0.5, 1].map((g) => {
          const y = H - PAD - g * (H - PAD * 2);
          return <line key={g} x1={PAD} x2={W - PAD} y1={y} y2={y} stroke="hsl(var(--border))" strokeWidth="0.5" strokeDasharray="2 3" />;
        })}
        {/* Active region fills */}
        {curves.map((c) => (
          <polygon
            key={`f-${c.label}`}
            points={`${PAD},${H - PAD} ${c.pts.map(p => `${p.x},${p.y}`).join(" ")} ${W - PAD},${H - PAD}`}
            fill={c.color}
            opacity={memValues[c.label] > 0.05 ? 0.18 : 0.06}
          />
        ))}
        {/* Curves */}
        {curves.map((c) => (
          <polyline
            key={c.label}
            points={c.pts.map(p => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke={c.color}
            strokeWidth={memValues[c.label] > 0.05 ? 2.5 : 1.5}
            opacity={memValues[c.label] > 0.05 ? 1 : 0.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
        {/* Cursor */}
        <line x1={xPx} x2={xPx} y1={PAD} y2={H - PAD} stroke="hsl(var(--primary))" strokeWidth="1" strokeDasharray="3 3" opacity="0.7" />
        {curves.map((c) => {
          const yv = memValues[c.label];
          const py = H - PAD - yv * (H - PAD * 2);
          return yv > 0.02 ? <circle key={`d-${c.label}`} cx={xPx} cy={py} r="3.5" fill={c.color} stroke="hsl(var(--background))" strokeWidth="1.5" /> : null;
        })}
      </svg>

      {/* Legend / membership values */}
      <div className="grid grid-cols-3 gap-2 mt-3">
        {curves.map((c) => {
          const v = memValues[c.label];
          const active = v > 0.05;
          return (
            <div
              key={c.label}
              className={`rounded-xl p-2 transition-all ${active ? "bg-background/60 border border-glass-border/40" : "opacity-50"}`}
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                <span className="text-[10px] font-medium">{c.label}</span>
              </div>
              <p className="text-sm font-bold tabular-nums" style={{ color: active ? c.color : undefined }}>
                {v.toFixed(2)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function FuzzyVizScreen() {
  const [tab, setTab] = useState<SetKey>("temp");
  return (
    <div className="space-y-5 pt-2">
      <header>
        <p className="text-xs text-muted-foreground tracking-widest uppercase">Inspect</p>
        <h1 className="font-display text-2xl font-bold mt-0.5">Fuzzy Membership</h1>
        <p className="text-xs text-muted-foreground mt-1">Active sets highlight where your input falls.</p>
      </header>

      <div className="glass rounded-2xl p-1 grid grid-cols-3 gap-1">
        {(["temp", "humidity", "wind"] as SetKey[]).map((k) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`relative rounded-xl py-2 text-xs font-semibold transition-all ${tab === k ? "text-primary-foreground" : "text-muted-foreground"}`}
          >
            {tab === k && <span className="absolute inset-0 rounded-xl bg-gradient-aurora shadow-glow" />}
            <span className="relative">{CONFIG[k].label}</span>
          </button>
        ))}
      </div>

      <MembershipChart setKey={tab} />

      <div className="rounded-3xl glass p-5 animate-rise">
        <h3 className="text-sm font-semibold mb-2">All variables at a glance</h3>
        <div className="space-y-3">
          {(["temp", "humidity", "wind"] as SetKey[]).map((k) => {
            const cfg = CONFIG[k];
            const inputs = useFuzzyStore.getState().inputs;
            const v = cfg.fn(cfg.current(inputs)) as Record<string, number>;
            return (
              <div key={k}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium">{cfg.label}</span>
                  <span className="text-[10px] text-muted-foreground">μ values</span>
                </div>
                <div className="flex gap-1.5 h-2 rounded-full overflow-hidden bg-muted/30">
                  {cfg.labels.map((label, i) => (
                    <div
                      key={label}
                      className="h-full transition-all"
                      style={{ width: `${Math.max(v[label] * 100, 2)}%`, background: cfg.colors[i] }}
                      title={`${label}: ${v[label].toFixed(2)}`}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
