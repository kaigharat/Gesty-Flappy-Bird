import { useFuzzyStore } from "@/store/fuzzy-store";
import { Slider } from "@/components/ui/slider";
import { predictWeather } from "@/lib/fuzzy";
import { Thermometer, Droplets, Wind } from "lucide-react";
import WeatherIcon from "@/components/WeatherIcon";

export default function ControlsScreen() {
  const { inputs, setInput, unit } = useFuzzyStore();
  const result = predictWeather(inputs);

  const controls = [
    { key: "temperature" as const, label: "Temperature", icon: Thermometer, min: 0, max: 40, step: 1, suffix: `°${unit}`, value: unit === "C" ? inputs.temperature : Math.round(inputs.temperature * 9 / 5 + 32), color: "text-sunny" },
    { key: "humidity" as const, label: "Humidity", icon: Droplets, min: 0, max: 100, step: 1, suffix: "%", value: inputs.humidity, color: "text-rainy" },
    { key: "windSpeed" as const, label: "Wind Speed", icon: Wind, min: 0, max: 40, step: 1, suffix: " km/h", value: inputs.windSpeed, color: "text-secondary" },
  ];

  return (
    <div className="space-y-6 pt-2">
      <header>
        <p className="text-xs text-muted-foreground tracking-widest uppercase">Live</p>
        <h1 className="font-display text-2xl font-bold mt-0.5">Input Controls</h1>
      </header>

      {/* Live preview */}
      <div className="rounded-3xl glass-strong p-5 flex items-center gap-4 animate-rise">
        <WeatherIcon weather={result.weather} className="w-16 h-16 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Live prediction</p>
          <p className="font-display text-2xl font-bold">{result.weather}</p>
          <div className="mt-2 h-1.5 rounded-full bg-muted/40 overflow-hidden">
            <div className="h-full bg-gradient-aurora transition-all duration-500" style={{ width: `${result.confidence}%` }} />
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Conf</p>
          <p className="font-display text-xl font-bold text-gradient">{result.confidence}%</p>
        </div>
      </div>

      {/* Sliders */}
      <div className="space-y-5">
        {controls.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.key} className="rounded-3xl glass p-5 animate-rise">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-background/50 backdrop-blur flex items-center justify-center ${c.color}`}>
                    <Icon className="w-5 h-5" strokeWidth={2.2} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{c.label}</p>
                    <p className="text-[11px] text-muted-foreground">Range {c.min}–{c.max}{c.suffix}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-display text-2xl font-bold tabular-nums text-gradient">
                    {Math.round(c.value)}<span className="text-base text-muted-foreground font-medium">{c.suffix}</span>
                  </p>
                </div>
              </div>
              <Slider
                value={[inputs[c.key]]}
                min={c.key === "temperature" ? 0 : c.min}
                max={c.key === "temperature" ? 40 : c.max}
                step={c.step}
                onValueChange={(v) => setInput(c.key, v[0])}
              />
              <div className="flex justify-between mt-2 text-[10px] text-muted-foreground tabular-nums">
                <span>{c.min}</span>
                <span>{c.max}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
