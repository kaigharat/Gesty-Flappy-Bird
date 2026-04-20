import { useFuzzyStore } from "@/store/fuzzy-store";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun, Thermometer, RotateCcw, Github, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function SettingsScreen() {
  const { theme, toggleTheme, unit, setUnit, resetInputs, clearHistory } = useFuzzyStore();

  return (
    <div className="space-y-5 pt-2">
      <header>
        <p className="text-xs text-muted-foreground tracking-widest uppercase">Preferences</p>
        <h1 className="font-display text-2xl font-bold mt-0.5">Settings</h1>
      </header>

      {/* Appearance */}
      <div className="rounded-3xl glass p-5">
        <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-4">Appearance</h3>

        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-background/50 flex items-center justify-center text-primary">
              {theme === "dark" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </div>
            <div>
              <p className="text-sm font-semibold">Dark Mode</p>
              <p className="text-[11px] text-muted-foreground">Easier on the eyes at night</p>
            </div>
          </div>
          <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
        </div>
      </div>

      {/* Units */}
      <div className="rounded-3xl glass p-5">
        <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-4">Units</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-background/50 flex items-center justify-center text-sunny">
              <Thermometer className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">Temperature</p>
              <p className="text-[11px] text-muted-foreground">Display unit</p>
            </div>
          </div>
          <div className="glass rounded-xl p-1 flex">
            {(["C", "F"] as const).map((u) => (
              <button
                key={u}
                onClick={() => setUnit(u)}
                className={`relative px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${unit === u ? "text-primary-foreground" : "text-muted-foreground"}`}
              >
                {unit === u && <span className="absolute inset-0 rounded-lg bg-gradient-aurora shadow-glow" />}
                <span className="relative">°{u}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Data */}
      <div className="rounded-3xl glass p-5 space-y-3">
        <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Data</h3>
        <Button
          variant="outline"
          className="w-full justify-start h-12 rounded-2xl bg-background/40 border-glass-border/50"
          onClick={() => { resetInputs(); toast.success("Inputs reset"); }}
        >
          <RotateCcw className="w-4 h-4 mr-3 text-primary" />
          <span className="font-semibold">Reset inputs</span>
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start h-12 rounded-2xl bg-background/40 border-glass-border/50"
          onClick={() => { clearHistory(); toast.success("History cleared"); }}
        >
          <RotateCcw className="w-4 h-4 mr-3 text-destructive" />
          <span className="font-semibold">Clear history</span>
        </Button>
      </div>

      {/* About */}
      <div className="rounded-3xl glass-strong p-5 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-aurora opacity-20 blur-3xl rounded-full" />
        <div className="relative flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-aurora flex items-center justify-center text-white">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold">FuzzyCast AI</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">v1.0.0 · Mamdani inference engine</p>
            <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
              Built with React, fuzzy logic principles, and a love for clean interfaces.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground pb-2">
        <Github className="w-3 h-3" />
        <span>Crafted with care · 2026</span>
      </div>
    </div>
  );
}
