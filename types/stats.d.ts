export type KPITrend = "up" | "down";

export interface KPIItemData {
  id: string;
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: KPITrend;
  trendVal?: string;
}
