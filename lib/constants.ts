export const MILEAGE_RATE = 0.13;

export const ROUTE_PRESETS = [
  { label: "Σάββατο", value: "ΣΑΒΒΑΤΟ" },
  { label: "Κυριακή", value: "ΚΥΡΙΑΚΗ" },
  { label: "Αργία", value: "ΑΡΓΙΑ" },
] as const;

export function routePresetLabel(route: string): string | undefined {
  const normalized = route.trim().toUpperCase();
  return ROUTE_PRESETS.find((preset) => preset.value === normalized)?.label;
}
