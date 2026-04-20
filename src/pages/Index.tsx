import { useEffect, useState } from "react";
import { useFuzzyStore } from "@/store/fuzzy-store";
import SplashScreen from "@/components/SplashScreen";
import AppShell from "@/components/AppShell";

const Index = () => {
  const theme = useFuzzyStore((s) => s.theme);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    document.title = "FuzzyCast AI — Smart Weather, Smarter Predictions";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "AI-powered fuzzy logic weather prediction. Visualize membership functions, rules, and confidence in real time.");
    const t = setTimeout(() => setShowSplash(false), 2600);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="min-h-screen aurora-bg overflow-hidden">
      {showSplash ? <SplashScreen onDone={() => setShowSplash(false)} /> : <AppShell />}
    </main>
  );
};

export default Index;
