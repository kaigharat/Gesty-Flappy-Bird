import { useState } from "react";
import { Home, Sliders, Activity, BookOpen, BarChart3, Settings as SettingsIcon, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import HomeScreen from "@/components/screens/HomeScreen";
import ControlsScreen from "@/components/screens/ControlsScreen";
import FuzzyVizScreen from "@/components/screens/FuzzyVizScreen";
import RulesScreen from "@/components/screens/RulesScreen";
import AnalyticsScreen from "@/components/screens/AnalyticsScreen";
import SettingsScreen from "@/components/screens/SettingsScreen";
import { useFuzzyStore } from "@/store/fuzzy-store";
import { toast } from "sonner";

type Tab = "home" | "controls" | "fuzzy" | "rules" | "analytics" | "settings";

const TABS: { id: Tab; label: string; icon: typeof Home }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "controls", label: "Inputs", icon: Sliders },
  { id: "fuzzy", label: "Fuzzy", icon: Activity },
  { id: "rules", label: "Rules", icon: BookOpen },
  { id: "analytics", label: "Trends", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: SettingsIcon },
];

export default function AppShell() {
  const [tab, setTab] = useState<Tab>("home");
  const reset = useFuzzyStore((s) => s.resetInputs);

  return (
    <div className="relative mx-auto max-w-md min-h-screen flex flex-col">
      {/* Status spacer */}
      <div className="h-6" />

      {/* Screen content */}
      <div className="flex-1 px-5 pb-32 animate-fade-up" key={tab}>
        {tab === "home" && <HomeScreen onNavigate={setTab as (t: string) => void} />}
        {tab === "controls" && <ControlsScreen />}
        {tab === "fuzzy" && <FuzzyVizScreen />}
        {tab === "rules" && <RulesScreen />}
        {tab === "analytics" && <AnalyticsScreen />}
        {tab === "settings" && <SettingsScreen />}
      </div>

      {/* Floating reset FAB */}
      <button
        onClick={() => { reset(); toast.success("Inputs reset to defaults"); }}
        className="fixed bottom-28 right-6 z-30 w-14 h-14 rounded-full bg-gradient-aurora shadow-glow flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all duration-300 ease-spring"
        aria-label="Reset inputs"
      >
        <RotateCcw className="w-5 h-5" strokeWidth={2.2} />
      </button>

      {/* Bottom nav */}
      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20 w-[calc(100%-2rem)] max-w-md">
        <div className="glass-strong rounded-3xl px-2 py-2 flex items-center justify-between">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "relative flex flex-col items-center justify-center rounded-2xl py-2 transition-all duration-300 ease-fluid",
                  "min-w-0 flex-1",
                  active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {active && (
                  <span className="absolute inset-0 rounded-2xl bg-gradient-aurora shadow-glow" />
                )}
                <Icon className={cn("relative w-[18px] h-[18px] mb-0.5", active && "drop-shadow")} strokeWidth={active ? 2.4 : 2} />
                <span className={cn("relative text-[10px] font-medium", active && "font-semibold")}>{t.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
