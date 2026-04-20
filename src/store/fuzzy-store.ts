import { create } from "zustand";
import { persist } from "zustand/middleware";
import { FuzzyInputs, predictWeather, PredictionResult } from "@/lib/fuzzy";

type Unit = "C" | "F";
type HistoryEntry = { id: string; ts: number; inputs: FuzzyInputs; result: PredictionResult };

type State = {
  inputs: FuzzyInputs;
  unit: Unit;
  theme: "dark" | "light";
  history: HistoryEntry[];
  setInput: (k: keyof FuzzyInputs, v: number) => void;
  resetInputs: () => void;
  setUnit: (u: Unit) => void;
  toggleTheme: () => void;
  saveToHistory: () => void;
  clearHistory: () => void;
};

const DEFAULTS: FuzzyInputs = { temperature: 24, humidity: 55, windSpeed: 12 };

export const useFuzzyStore = create<State>()(
  persist(
    (set, get) => ({
      inputs: DEFAULTS,
      unit: "C",
      theme: "dark",
      history: [],
      setInput: (k, v) => set((s) => ({ inputs: { ...s.inputs, [k]: v } })),
      resetInputs: () => set({ inputs: DEFAULTS }),
      setUnit: (u) => set({ unit: u }),
      toggleTheme: () => {
        const next = get().theme === "dark" ? "light" : "dark";
        set({ theme: next });
        document.documentElement.classList.toggle("dark", next === "dark");
      },
      saveToHistory: () => {
        const inputs = get().inputs;
        const result = predictWeather(inputs);
        const entry: HistoryEntry = { id: crypto.randomUUID(), ts: Date.now(), inputs, result };
        set((s) => ({ history: [entry, ...s.history].slice(0, 30) }));
      },
      clearHistory: () => set({ history: [] }),
    }),
    { name: "fuzzycast-store" }
  )
);

export type { HistoryEntry };
