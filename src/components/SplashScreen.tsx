import { Cloud, Sparkles } from "lucide-react";

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center aurora-bg animate-fade-up"
      onClick={onDone}
    >
      {/* Drifting particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 18 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/40 blur-sm animate-drift"
            style={{
              top: `${(i * 53) % 100}%`,
              width: `${4 + (i % 5) * 3}px`,
              height: `${4 + (i % 5) * 3}px`,
              animationDelay: `${-i * 1.4}s`,
              animationDuration: `${18 + (i % 6) * 3}s`,
              opacity: 0.3 + (i % 4) * 0.15,
            }}
          />
        ))}
      </div>

      {/* Logo orb */}
      <div className="relative mb-8 animate-rise">
        <div className="absolute inset-0 rounded-full bg-gradient-aurora blur-3xl scale-150 animate-pulse-glow" />
        <div className="relative w-28 h-28 rounded-full glass-strong flex items-center justify-center shadow-glow">
          <div className="absolute inset-2 rounded-full bg-gradient-aurora opacity-90" />
          <Cloud className="relative w-12 h-12 text-white drop-shadow-lg" strokeWidth={1.8} />
          <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-secondary animate-pulse" />
        </div>
      </div>

      <h1 className="font-display text-5xl font-bold text-gradient mb-3 animate-rise" style={{ animationDelay: "0.15s" }}>
        FuzzyCast AI
      </h1>
      <p className="text-foreground/70 text-base tracking-wide animate-rise" style={{ animationDelay: "0.3s" }}>
        Smart Weather. Smarter Predictions.
      </p>

      <div className="absolute bottom-12 flex gap-1.5 animate-rise" style={{ animationDelay: "0.5s" }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-primary animate-pulse-glow"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
}
