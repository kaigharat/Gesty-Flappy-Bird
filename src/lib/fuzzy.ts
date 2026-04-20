// Fuzzy logic engine for weather prediction

export type FuzzyInputs = { temperature: number; humidity: number; windSpeed: number };
export type WeatherClass = "Sunny" | "Cloudy" | "Rainy";

// Triangular membership function
const tri = (x: number, a: number, b: number, c: number): number => {
  if (x <= a || x >= c) return 0;
  if (x === b) return 1;
  if (x < b) return (x - a) / (b - a);
  return (c - x) / (c - b);
};

// Trapezoidal for edges
const trap = (x: number, a: number, b: number, c: number, d: number): number => {
  if (x <= a || x >= d) return 0;
  if (x >= b && x <= c) return 1;
  if (x < b) return (x - a) / (b - a);
  return (d - x) / (d - c);
};

export const tempMembership = (t: number) => ({
  Low: trap(t, -5, 0, 10, 18),
  Medium: tri(t, 14, 22, 30),
  High: trap(t, 26, 32, 40, 45),
});

export const humidityMembership = (h: number) => ({
  Low: trap(h, -10, 0, 25, 40),
  Medium: tri(h, 30, 55, 80),
  High: trap(h, 65, 80, 100, 110),
});

export const windMembership = (w: number) => ({
  Slow: trap(w, -5, 0, 8, 15),
  Moderate: tri(w, 10, 20, 30),
  Fast: trap(w, 25, 32, 40, 45),
});

export type Rule = {
  id: number;
  text: string;
  output: WeatherClass;
  evaluate: (t: ReturnType<typeof tempMembership>, h: ReturnType<typeof humidityMembership>, w: ReturnType<typeof windMembership>) => number;
};

export const RULES: Rule[] = [
  { id: 1, text: "IF Temp is High AND Humidity is Low THEN Sunny", output: "Sunny", evaluate: (t, h) => Math.min(t.High, h.Low) },
  { id: 2, text: "IF Temp is Medium AND Humidity is Low AND Wind is Slow THEN Sunny", output: "Sunny", evaluate: (t, h, w) => Math.min(t.Medium, h.Low, w.Slow) },
  { id: 3, text: "IF Temp is High AND Humidity is Medium THEN Sunny", output: "Sunny", evaluate: (t, h) => Math.min(t.High, h.Medium) * 0.7 },
  { id: 4, text: "IF Temp is Medium AND Humidity is Medium THEN Cloudy", output: "Cloudy", evaluate: (t, h) => Math.min(t.Medium, h.Medium) },
  { id: 5, text: "IF Humidity is High AND Wind is Moderate THEN Cloudy", output: "Cloudy", evaluate: (_t, h, w) => Math.min(h.High, w.Moderate) * 0.85 },
  { id: 6, text: "IF Temp is Low AND Wind is Fast THEN Cloudy", output: "Cloudy", evaluate: (t, _h, w) => Math.min(t.Low, w.Fast) * 0.8 },
  { id: 7, text: "IF Humidity is High AND Temp is Low THEN Rainy", output: "Rainy", evaluate: (t, h) => Math.min(h.High, t.Low) },
  { id: 8, text: "IF Humidity is High AND Wind is Fast THEN Rainy", output: "Rainy", evaluate: (_t, h, w) => Math.min(h.High, w.Fast) },
  { id: 9, text: "IF Temp is Medium AND Humidity is High THEN Rainy", output: "Rainy", evaluate: (t, h) => Math.min(t.Medium, h.High) * 0.9 },
];

export type PredictionResult = {
  weather: WeatherClass;
  confidence: number;
  scores: Record<WeatherClass, number>;
  activeRules: { id: number; strength: number }[];
};

export const predictWeather = (inputs: FuzzyInputs): PredictionResult => {
  const t = tempMembership(inputs.temperature);
  const h = humidityMembership(inputs.humidity);
  const w = windMembership(inputs.windSpeed);

  const scores: Record<WeatherClass, number> = { Sunny: 0, Cloudy: 0, Rainy: 0 };
  const activeRules: { id: number; strength: number }[] = [];

  RULES.forEach((rule) => {
    const strength = rule.evaluate(t, h, w);
    activeRules.push({ id: rule.id, strength });
    if (strength > scores[rule.output]) scores[rule.output] = strength;
  });

  const total = scores.Sunny + scores.Cloudy + scores.Rainy || 1;
  const normalized = {
    Sunny: scores.Sunny / total,
    Cloudy: scores.Cloudy / total,
    Rainy: scores.Rainy / total,
  };

  let weather: WeatherClass = "Cloudy";
  let max = 0;
  (Object.keys(normalized) as WeatherClass[]).forEach((k) => {
    if (normalized[k] > max) { max = normalized[k]; weather = k; }
  });

  const topRaw = Math.max(scores.Sunny, scores.Cloudy, scores.Rainy);
  const confidence = Math.round(Math.min(1, topRaw * 0.6 + max * 0.6) * 100);

  return { weather, confidence, scores: normalized, activeRules };
};
