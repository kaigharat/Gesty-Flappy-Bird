import { useFuzzyStore } from "@/store/fuzzy-store";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { Trash2, Sun, Cloud, CloudRain } from "lucide-react";
import { Button } from "@/components/ui/button";

const ICONS = { Sunny: Sun, Cloudy: Cloud, Rainy: CloudRain };
const COLORS = { Sunny: "text-sunny", Cloudy: "text-cloudy", Rainy: "text-rainy" };

export default function AnalyticsScreen() {
  const { history, clearHistory } = useFuzzyStore();

  const chartData = [...history].reverse().map((h, i) => ({
    name: `#${i + 1}`,
    Temp: Math.round(h.inputs.temperature),
    Humidity: Math.round(h.inputs.humidity),
    Wind: Math.round(h.inputs.windSpeed),
    Conf: h.result.confidence,
  }));

  const counts = history.reduce(
    (acc, h) => { acc[h.result.weather]++; return acc; },
    { Sunny: 0, Cloudy: 0, Rainy: 0 } as Record<string, number>
  );
  const total = history.length || 1;

  return (
    <div className="space-y-5 pt-2">
      <header className="flex items-end justify-between">
        <div>
          <p className="text-xs text-muted-foreground tracking-widest uppercase">History</p>
          <h1 className="font-display text-2xl font-bold mt-0.5">Analytics</h1>
        </div>
        {history.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearHistory} className="text-muted-foreground h-8">
            <Trash2 className="w-3.5 h-3.5 mr-1" /> Clear
          </Button>
        )}
      </header>

      {/* Distribution */}
      <div className="rounded-3xl glass p-5">
        <h3 className="text-sm font-semibold mb-3">Prediction distribution</h3>
        <div className="grid grid-cols-3 gap-2">
          {(["Sunny", "Cloudy", "Rainy"] as const).map((k) => {
            const Icon = ICONS[k];
            const pct = Math.round((counts[k] / total) * 100);
            return (
              <div key={k} className="rounded-2xl bg-background/50 backdrop-blur p-3 border border-glass-border/30">
                <Icon className={`w-4 h-4 ${COLORS[k]} mb-2`} strokeWidth={2.2} />
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</p>
                <p className="font-display text-xl font-bold mt-0.5 tabular-nums">{counts[k]}</p>
                <p className="text-[10px] text-muted-foreground tabular-nums">{history.length ? `${pct}%` : "—"}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trend chart */}
      <div className="rounded-3xl glass p-5">
        <h3 className="text-sm font-semibold mb-1">Inputs vs confidence</h3>
        <p className="text-[11px] text-muted-foreground mb-3">Last {history.length || 0} snapshots</p>
        {history.length === 0 ? (
          <div className="h-44 flex flex-col items-center justify-center text-muted-foreground">
            <Cloud className="w-10 h-10 mb-2 opacity-40" />
            <p className="text-xs">No data yet — save a snapshot from Home.</p>
          </div>
        ) : (
          <div className="h-52 -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="2 4" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={28} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                    fontSize: "11px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "10px", paddingTop: "4px" }} iconType="circle" />
                <Line type="monotone" dataKey="Temp" stroke="hsl(var(--sunny))" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Humidity" stroke="hsl(var(--rainy))" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Wind" stroke="hsl(var(--secondary))" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Conf" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 2.5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* History list */}
      <div className="space-y-2">
        <h3 className="text-xs uppercase tracking-wider text-muted-foreground px-1">Recent</h3>
        {history.length === 0 && (
          <div className="rounded-3xl glass p-6 text-center text-xs text-muted-foreground">
            Tap “Save Snapshot” on Home to start tracking predictions.
          </div>
        )}
        {history.map((h) => {
          const Icon = ICONS[h.result.weather];
          const date = new Date(h.ts);
          return (
            <div key={h.id} className="glass rounded-2xl p-3 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl bg-background/50 flex items-center justify-center ${COLORS[h.result.weather]}`}>
                <Icon className="w-4 h-4" strokeWidth={2.2} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{h.result.weather}</p>
                  <p className="text-[10px] text-muted-foreground tabular-nums">{date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                </div>
                <p className="text-[11px] text-muted-foreground tabular-nums">
                  {Math.round(h.inputs.temperature)}° · {Math.round(h.inputs.humidity)}% · {Math.round(h.inputs.windSpeed)}km/h
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase text-muted-foreground tracking-wider">Conf</p>
                <p className="text-sm font-bold text-gradient tabular-nums">{h.result.confidence}%</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
