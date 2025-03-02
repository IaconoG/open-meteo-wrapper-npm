import { UvRiskLevels } from "../types/weatherTypes";
import { uvDescriptions } from "./constants";

export const getUvRiskLevel = (index: number): UvRiskLevels => {
  if (index < 0) return UvRiskLevels.unknown;
  if (index <= 2) return UvRiskLevels.low;
  if (index <= 7) return UvRiskLevels.moderate;
  return UvRiskLevels.high;
};

export const getUvDescription = (index: number): string => {
  if (index < 0) return uvDescriptions.unknown;
  if (index <= 2) return uvDescriptions.low;
  if (index <= 7) return uvDescriptions.moderate;
  return uvDescriptions.high;
};
