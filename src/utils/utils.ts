import { UvRiskLevels } from "../types/weatherTypes";

export const getUvRiskLevel = (index: number): UvRiskLevels => {
  if (index <= 2) return UvRiskLevels.low;
  if (index <= 7) return UvRiskLevels.moderate;
  return UvRiskLevels.high;
};
