import { useState } from "react";
import { useFuzzyStore } from "@/store/fuzzy-store";
import { predictWeather, RULES } from "@/lib/fuzzy";
import { Switch } from "@/components/ui/switch";
import { Sun, Cloud, CloudRain, Zap } from "lucide-react";

const ICONS = { Sunny: Sun, Cloudy: Cloud, Rainy: CloudRain };
const COLORS = { Sunny: "text-sunny", Cloudy: "text-cloudy", Rainy: "text-rainy" };
const BG = { Sunny: "from-sunny/20", Cloudy: "from-cloudy/20", Rainy: "from-rainy/20" };

export default function RulesScreen() {
  const inputs = useFuzzyStore((s) => s.inputs);
  const result = predictWeather(inputs);
  const [showStrength, setShowStrength] = useState(true);

  const sorted = [...result.activeRules].sort((a, b) => b.strength - a.strength);

  return (
    <div className="space-y-5 pt-2">
      <header>
        <p className="text-xs text-muted-foreground tracking-widest uppercase">Reasoning</p>
        <h1 className="font-display text-2xl font-bold mt-0.5">Rule Engine</h1>
        <p className="text-xs text-muted-foreground mt-1">{RULES.length} IF-THEN rules · firing strengths shown live</p>
      </header>

      <div className="glass rounded-2xl p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-secondary" />
          <span className="text-sm font-medium">Show firing strength</span>
        </div>
        <Switch checked={showStrength} onCheckedChange={setShowStrength} />
      </div>

      <div className="space-y-3">
        {sorted.map(({ id, strength }) => {
          const rule = RULES.find((r) => r.id === id)!;
          const Icon = ICONS[rule.output];
          const active = strength > 0.05;
          const pct = Math.round(strength * 100);
          return (
            <div
              key={id}
              className={`relative rounded-3xl p-4 overflow-hidden transition-all duration-500 ${active ? "glass-strong" : "glass opacity-60"}`}
            >
              {active && (
                <div className={`absolute inset-0 bg-gradient-to-br ${BG[rule.output]} to-transparent pointer-events-none`} />
              )}
              <div className="relative flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl bg-background/50 backdrop-blur flex items-center justify-center shrink-0 ${COLORS[rule.output]}`}>
                  <Icon className="w-5 h-5" strokeWidth={2.2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">Rule {String(id).padStart(2, "0")}</span>
                    {active && (
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${COLORS[rule.output]}`}>
                        ● Firing
                      </span>
                    )}
                  </div>
                  <p className="text-[13px] leading-snug font-medium">
                    {rule.text.split(/(IF|AND|THEN)/g).map((part, i) =>
                      ["IF", "AND", "THEN"].includes(part) ? (
                        <span key={i} className="text-primary font-bold">{part}</span>
                      ) : (
                        <span key={i}>{part}</span>
                      )
                    )}
                  </p>
                  {showStrength && (
                    <div className="mt-2.5">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-muted-foreground">Strength</span>
                        <span className="text-[11px] font-bold tabular-nums">{pct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted/40 overflow-hidden">
                        <div
                          className="h-full bg-gradient-aurora rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(pct, 2)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
