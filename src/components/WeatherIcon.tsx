import { WeatherClass } from "@/lib/fuzzy";
import { Sun, Cloud, CloudRain } from "lucide-react";

export default function WeatherIcon({ weather, className = "w-16 h-16" }: { weather: WeatherClass; className?: string }) {
  if (weather === "Sunny") {
    return (
      <div className={`relative ${className}`}>
        <div className="absolute inset-0 rounded-full bg-sunny/40 blur-2xl animate-pulse-glow" />
        <Sun className="relative w-full h-full text-sunny drop-shadow-[0_0_20px_hsl(var(--sunny)/0.7)] animate-float" strokeWidth={1.6} />
      </div>
    );
  }
  if (weather === "Rainy") {
    return (
      <div className={`relative ${className}`}>
        <div className="absolute inset-0 rounded-full bg-rainy/40 blur-2xl animate-pulse-glow" />
        <CloudRain className="relative w-full h-full text-rainy drop-shadow-[0_0_20px_hsl(var(--rainy)/0.7)] animate-float" strokeWidth={1.6} />
      </div>
    );
  }
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 rounded-full bg-cloudy/30 blur-2xl animate-pulse-glow" />
      <Cloud className="relative w-full h-full text-foreground/80 drop-shadow-[0_0_20px_hsl(var(--cloudy)/0.5)] animate-float" strokeWidth={1.6} />
    </div>
  );
}
