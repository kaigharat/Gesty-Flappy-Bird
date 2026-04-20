import { useFuzzyStore } from "@/store/fuzzy-store";
import { predictWeather } from "@/lib/fuzzy";
import WeatherIcon from "@/components/WeatherIcon";
import { Thermometer, Droplets, Wind, ArrowUpRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomeScreen({ onNavigate }: { onNavigate: (t: string) => void }) {
  const { inputs, unit, saveToHistory } = useFuzzyStore();
  const result = predictWeather(inputs);
  const tempDisplay = unit === "C" ? inputs.temperature : Math.round(inputs.temperature * 9 / 5 + 32);

  const stats = [
    { icon: Thermometer, label: "Temp", value: `${Math.round(tempDisplay)}°${unit}`, color: "text-sunny" },
    { icon: Droplets, label: "Humidity", value: `${Math.round(inputs.humidity)}%`, color: "text-rainy" },
    { icon: Wind, label: "Wind", value: `${Math.round(inputs.windSpeed)} km/h`, color: "text-secondary" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between pt-2">
        <div>
          <p className="text-xs text-muted-foreground tracking-widest uppercase">Today · Live</p>
          <h1 className="font-display text-2xl font-bold mt-0.5">FuzzyCast <span className="text-gradient">AI</span></h1>
        </div>
        <div className="glass rounded-full px-3 py-1.5 flex items-center gap-1.5 text-xs">
          <Sparkles className="w-3.5 h-3.5 text-secondary" />
          <span className="font-medium">Fuzzy v1.0</span>
        </div>
      </header>

      {/* Hero prediction card */}
      <div className="relative rounded-[2rem] overflow-hidden glass-strong p-6 shadow-glass animate-rise">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-aurora opacity-30 blur-3xl rounded-full" />
        <div className="absolute -bottom-32 -left-10 w-72 h-72 bg-secondary/20 blur-3xl rounded-full" />

        <div className="relative flex items-start justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Predicted</p>
            <h2 className="font-display text-4xl font-bold mt-1">{result.weather}</h2>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Confidence</span>
              <span className="text-sm font-semibold text-gradient">{result.confidence}%</span>
            </div>
          </div>
          <WeatherIcon weather={result.weather} className="w-24 h-24" />
        </div>

        {/* Confidence bar */}
        <div className="relative h-2 rounded-full bg-muted/40 overflow-hidden mb-6">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-aurora rounded-full transition-all duration-700 ease-fluid shadow-[0_0_12px_hsl(var(--primary)/0.7)]"
            style={{ width: `${result.confidence}%` }}
          />
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="rounded-2xl bg-background/40 backdrop-blur p-3 border border-glass-border/30">
                <Icon className={`w-4 h-4 ${s.color} mb-2`} strokeWidth={2.2} />
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</p>
                <p className="text-sm font-bold mt-0.5">{s.value}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Class probabilities */}
      <div className="rounded-3xl glass p-5 animate-rise" style={{ animationDelay: "0.1s" }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">Class probabilities</h3>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Defuzzified</span>
        </div>
        <div className="space-y-3">
          {(["Sunny", "Cloudy", "Rainy"] as const).map((cls) => {
            const pct = Math.round(result.scores[cls] * 100);
            const colorMap = { Sunny: "from-sunny to-sunny/60", Cloudy: "from-cloudy to-cloudy/60", Rainy: "from-rainy to-rainy/60" };
            return (
              <div key={cls}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium">{cls}</span>
                  <span className="text-xs text-muted-foreground tabular-nums">{pct}%</span>
                </div>
                <div className="relative h-1.5 rounded-full bg-muted/40 overflow-hidden">
                  <div
                    className={`absolute inset-y-0 left-0 bg-gradient-to-r ${colorMap[cls]} rounded-full transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3 animate-rise" style={{ animationDelay: "0.2s" }}>
        <button
          onClick={() => onNavigate("controls")}
          className="rounded-2xl glass p-4 text-left hover:scale-[1.02] transition-transform"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Adjust</span>
            <ArrowUpRight className="w-4 h-4 text-primary" />
          </div>
          <p className="font-semibold text-sm">Tune Inputs</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Live sliders</p>
        </button>
        <button
          onClick={() => onNavigate("fuzzy")}
          className="rounded-2xl glass p-4 text-left hover:scale-[1.02] transition-transform"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Inspect</span>
            <ArrowUpRight className="w-4 h-4 text-secondary" />
          </div>
          <p className="font-semibold text-sm">Fuzzy Sets</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Membership</p>
        </button>
      </div>

      <Button
        onClick={() => { saveToHistory(); }}
        className="w-full h-12 rounded-2xl bg-gradient-aurora text-white font-semibold shadow-glow hover:opacity-95 hover:shadow-glow active:scale-[0.99] transition-all"
      >
        Save Snapshot to History
      </Button>
    </div>
  );
}
